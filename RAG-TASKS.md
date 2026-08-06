# RAG Chatbot — Developer Task Breakdown

This document splits the RAG chatbot work into three independent tasks, one per developer, each preparing a single existing feature as a retrieval data source.
Everything shared — the vector collection, embedding, retrieval, and chat endpoint — is built once up front, so each developer only writes one file.

---

## Task 0: Shared foundation — prepare before anyone starts

This is built once, by the tech lead or by one developer with the other two reviewing, and merged before the three tasks begin. None of the three tasks can be tested until it exists.

**Verify first.** The current `AI_MODEL` is `DeepSeek-V3.2`, which is chat-only. Confirm the Azure AI Foundry resource also has an **embeddings** deployment (for example `text-embedding-3-small`), otherwise nobody can start. Also confirm access to a MongoDB Atlas cluster — the free M0 tier supports Vector Search and is enough for this.

**1. Prepare the MongoDB Atlas vector database and configure the connection.**
The existing local MongoDB stays exactly as it is and keeps all application data. Atlas holds nothing but the vectors. Open a second, independent Mongoose connection with `mongoose.createConnection(ATLAS_VECTOR_URI)` in `src/DB/vector-connection.js`, await it during startup in `src/index.js`, and report its state in `/api/health`.
Because these are two separate clusters, **you cannot `populate` or `$lookup` from a vector back into the application data.** Every field the chatbot needs must be copied into the vector's metadata at index time. This is why Developers 2 and 3 store `projectName` and `clientName` on their chunks.

**2. Create the vector collection and its model.**
One shared collection, `ragvectors`, for all three sources, registered on the Atlas connection:

```js
{
  sourceType: String,   // "technology_catalog" | "requirement_analysis" | "opportunity"
  sourceId:   String,   // _id of the originating record
  chunkId:    String,   // unique, e.g. "68f3a1:mainModules"
  title:      String,   // short label shown as the citation
  text:       String,   // exactly what was embedded
  embedding:  [Number],
  metadata:   Mixed,    // per-source; includes opportunityId where relevant
  updatedAt:  Date,
}
```

**3. Create the Atlas vector search index.**
Defined once, either through the Atlas UI JSON editor or a small helper:

```json
{
  "name": "rag_vector_index",
  "type": "vectorSearch",
  "fields": [
    { "type": "vector", "path": "embedding", "numDimensions": 1536, "similarity": "cosine" },
    { "type": "filter", "path": "sourceType" },
    { "type": "filter", "path": "metadata.opportunityId" }
  ]
}
```

Three things that will cost someone an afternoon if missed. `numDimensions` must match the embedding model exactly (1536 for `text-embedding-3-small`); changing models means rebuilding the index. Filtering in `$vectorSearch` only works on paths declared here as `filter` type. And index builds are asynchronous — the index sits in `PENDING` for a minute or so after creation and returns nothing until it reports `READY`, which looks exactly like broken code.

**4. Create the embedding service.**
A single module exposing `embedText(string)` and `embedTexts(strings[])` with batching. It reuses the OpenAI client configuration already in `src/utils/ai.js`, just pointed at the embeddings deployment instead of the chat model. No developer calls the embedding API directly.

**5. Define the data source contract and registry.**
This is the interface each of the three developers implements, and the only thing they write:

```js
export default {
  sourceType: SOURCE_TYPES.TECHNOLOGY_CATALOG,
  async load({ opportunityId } = {}) {
    // read from MongoDB, return an array of:
    // { sourceId, chunkId, title, text, metadata }
    // No embedding calls. No writes. Just plain objects.
  },
};
```

Plus a `sources/index.js` registry mapping each `sourceType` to its module — the one file all three developers touch, one line each.

**6. Create the vector service.**
`replaceVectors(sourceType, items, filter)` deletes the matching vectors and inserts the fresh ones. Always delete-then-insert, never a partial upsert: publishing a requirement analysis replaces the document and changes its `_id`, so stale vectors must be cleared by `opportunityId` rather than by `sourceId`.
`searchSimilar(queryEmbedding, { sourceTypes, opportunityId, topK })` runs `$vectorSearch` as the first aggregation stage, then projects out the embedding and adds `score: { $meta: "vectorSearchScore" }`.

**7. Create the retrieval service.**
Turns a question into ranked contexts. It embeds the question, works out which project the question is about, and builds the filter. When the request carries an `opportunityId`, that is used directly. When it does not, resolve it from the question text by matching against the list of `projectName` and `clientName` values (a few dozen documents, cached briefly) — one match means scope to it, no match means search everything.

The filter must let company-wide sources through during a project-scoped chat, otherwise the technology catalog becomes invisible:

```js
const filter = opportunityId
  ? { $or: [
      { "metadata.opportunityId": { $eq: opportunityId } },
      { sourceType: { $eq: "technology_catalog" } },
    ] }
  : undefined
```

A cheap guard against mixing projects: after retrieval, check which project the top-scoring chunk belongs to and drop any results from a different one.

**8. Prepare the chatbot endpoint.**
Two routes mounted at `/api/rag` in `src/routes/index.js`:

- `POST /api/rag/chat` with `{ question, opportunityId? }` — `opportunityId` stays optional so the same endpoint serves a global assistant page today and a project-scoped widget later. Returns `{ answer, sources }`.
- `POST /api/rag/reindex/:sourceType` — plus an equivalent CLI script (`npm run rag:reindex`) so developers can rebuild their own source without the server running.

The prompt builder labels every context with its project name and instructs the model to say it does not have the information rather than inventing an answer, to name the project behind each fact, and to ask which project is meant when the contexts span several. Aggregate questions ("how many projects use React?") should be declined — retrieval returns a sample, not a complete set.

**9. Add the environment variables.**

```env
ATLAS_VECTOR_URI="mongodb+srv://...@cluster.mongodb.net/presales_vectors"
VECTOR_INDEX_NAME="rag_vector_index"
EMBEDDING_MODEL="text-embedding-3-small"
EMBEDDING_DIMENSIONS=1536
RAG_TOP_K=5
```

**10. Folder structure.**

```
src/DB/
├── connection.js                 # existing application MongoDB — unchanged
└── vector-connection.js          # new: Atlas connection for vectors only

src/module/rag/
├── rag.constants.js              # SOURCE_TYPES, TOP_K, index name
├── rag.model.js                  # RagVector, registered on the Atlas connection
├── rag.search-index.js           # Atlas index definition
├── rag.routes.js
├── rag.controller.js
├── rag.prompt.js
├── reindex.script.js
├── services/
│   ├── embedding.service.js
│   ├── vector.service.js
│   └── retrieval.service.js
└── sources/
    ├── index.js                          # registry
    ├── technology-catalog.source.js      # Developer 1
    ├── requirement-analysis.source.js    # Developer 2
    └── opportunity.source.js             # Developer 3
```

Once this is merged, Developer 1 should go slightly ahead of the other two — the technology catalog is the fastest way to prove the whole pipeline works end to end, since it is already seeded and needs no scoping.

---

## Developer 1: Technology Stack Catalog

Embed the company's available technologies, using the fields that exist in `technology-catalog.schema.js`:

- Technology name
- Category (Frontend, Backend, Database, Mobile, DevOps, Cloud, AI, Testing, CMS, E-commerce)
- Preferred use case
- Notes

Example chatbot questions:

- "What is MongoDB used for?"
- "What backend technologies are available?"
- "Which technologies are suitable for an AI chatbot or RAG project?"
- "Which frontend framework should we use for an SEO-focused portal?"
- "What is our default database for caching and sessions?"

This feature is the easiest because every technology is stored as one separate vector document, the collection has no relations to anything else, and it is not tied to an opportunity — so there is no filtering to get wrong during retrieval. The catalog is already seeded with 14 rows, so this developer can demo on day one without waiting for anyone to enter data.

---

## Developer 2: Requirement Analysis (published only)

Embed each section of a published requirement analysis as its own vector, from `requirementAnalysis.schema.js`. Every chunk starts with the same project header, then the section:

- Project name, client name, industry (header, repeated on every chunk)
- Section name
- Section content, as bullet points

The sections are: Executive Summary, Functional Requirements, Non-Functional Requirements, Main Modules, External Integrations, Assumptions, Clarification Questions, Possible Risks.

Example chatbot questions:

- "What are the main modules of the Northwind customer portal?"
- "Which external integrations does that project need?"
- "What are the biggest risks identified for the supply chain project?"
- "What non-functional requirements were captured around security and performance?"
- "What assumptions were made for the MediCare Plus app?"

This feature is easy because the schema already stores every section as a separate array, so the chunking is done for you — one section, one vector, no text splitter. The section name sits inside the embedded text, so a question like "what are the modules?" matches the chunk that begins `Section: Main Modules` almost word for word. Only documents with `status: "published"` are indexed; drafts are ignored.

---

## Developer 3: Opportunity

Embed each opportunity as a single project profile, from `opportunity.schema.js` plus the linked requirements text:

- Project name
- Client name
- Industry
- Status
- Created date
- General notes
- Requirements text (from the linked `OpportunityRequirement` record, 1:1 with the opportunity)

Do not embed contact email or contact phone. Anything embedded can end up in a chatbot answer, and there is no question worth answering that needs the assistant to read out a client's phone number.

Example chatbot questions:

- "What is the Enterprise Customer Portal Modernization project about?"
- "Which project involves Azure AD SSO and secure document exchange?"
- "Do we have any projects in the healthcare industry?"
- "Who is the client for the supply chain visibility project?"
- "Which opportunities are still in progress?"

This feature is easy because every opportunity is stored as one separate vector document — no arrays, no nested data, no draft or published state. Because there is only one chunk per project, it is impossible to retrieve the wrong part of it, and the project name and client name sit at the top of the text, which is what lets the chatbot identify which project a question is about.

---

## Shared work, built once before the three tasks start

The vector collection and its Atlas search index, the embedding call, the reindex runner, the retrieval service, and the chat endpoint are all shared.

Each developer writes exactly one file — a `load()` function that reads their collection and returns an array of `{ sourceId, chunkId, title, text, metadata }`. No embedding calls, no writes to the vector store, no retrieval or prompt code.

Developers 2 and 3 set `opportunityId` in their metadata so the assistant can scope answers to a project. Developer 1 leaves it unset because the catalog is company-wide.
