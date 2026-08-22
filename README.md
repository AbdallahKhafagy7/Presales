# Presales AI API

An AI-assisted backend for turning sales opportunities and uploaded project documents into structured requirements, analysis, estimates, and technology recommendations.

The service combines an Express API with MongoDB for opportunity data, Redis for caching and chat state, and an Azure OpenAI-compatible model for generation, embeddings, RAG search, clarification, and estimation workflows.

## What It Provides

- Opportunity lifecycle management
- Requirement capture and document-backed requirement analysis
- File uploads for project and requirement documents
- AI-generated clarification questions
- Effort and cost estimation workflows
- Technology catalog and technology-stack recommendations
- Retrieval-augmented chat over indexed opportunity content
- Reindexing support for refreshed embeddings
- Request validation with Zod and centralized error handling
- Health checks and structured application logging

## Technology

- Node.js 22+
- Express 5
- MongoDB with Mongoose
- Redis
- Azure OpenAI-compatible API through the OpenAI SDK
- Zod, Multer, Mammoth, and PDF parsing utilities
- Docker and Docker Compose

## Frontend

The frontend is included in the `frontend/` directory and is built with React and Vite.

## API Overview

All endpoints are prefixed with `/api`.

| Method   | Complete endpoint                                             | Purpose                                                 |
| -------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| `GET`    | `/api/health`                                                 | Reports API and MongoDB connectivity                    |
| `POST`   | `/api/opportunities/create`                                   | Create an opportunity                                   |
| `GET`    | `/api/opportunities/get-all`                                  | List all opportunities                                  |
| `GET`    | `/api/opportunities/view/:id`                                 | Get one opportunity                                     |
| `PUT`    | `/api/opportunities/:id`                                      | Update an opportunity                                   |
| `DELETE` | `/api/opportunities/:id`                                      | Delete an opportunity                                   |
| `POST`   | `/api/requirements/:opportunityId`                            | Create opportunity requirements                         |
| `GET`    | `/api/requirements/:opportunityId`                            | Get opportunity requirements                            |
| `DELETE` | `/api/requirements/:opportunityId`                            | Delete opportunity requirements                         |
| `POST`   | `/api/files/:opportunityId`                                   | Upload a requirement file using the `file-upload` field |
| `GET`    | `/api/files/:opportunityId`                                   | List files for an opportunity                           |
| `GET`    | `/api/files/download/:fileId`                                 | Download a requirement file                             |
| `DELETE` | `/api/files/:fileId`                                          | Delete a requirement file                               |
| `GET`    | `/api/opportunities/:id/requirement-analysis/context`         | Get requirement-analysis context                        |
| `GET`    | `/api/opportunities/:id/requirement-analysis/opportunity`     | Get the opportunity for analysis                        |
| `POST`   | `/api/opportunities/:id/requirement-analysis/generate`        | Generate requirement analysis                           |
| `POST`   | `/api/opportunities/:id/requirement-analysis/save`            | Save requirement analysis                               |
| `PUT`    | `/api/opportunities/:id/requirement-analysis/analysis`        | Update requirement analysis                             |
| `GET`    | `/api/opportunities/:id/requirement-analysis/analysis`        | Get saved requirement analysis                          |
| `GET`    | `/api/opportunities/:opportunityId/clarifications`            | Get clarification questions and assumptions             |
| `POST`   | `/api/opportunities/:opportunityId/questions`                 | Add a clarification question                            |
| `PATCH`  | `/api/opportunities/:opportunityId/questions/:questionId`     | Update a clarification question                         |
| `DELETE` | `/api/opportunities/:opportunityId/questions/:questionId`     | Delete a clarification question                         |
| `POST`   | `/api/opportunities/:opportunityId/assumptions`               | Add an assumption                                       |
| `PATCH`  | `/api/opportunities/:opportunityId/assumptions/:assumptionId` | Update an assumption                                    |
| `DELETE` | `/api/opportunities/:opportunityId/assumptions/:assumptionId` | Delete an assumption                                    |
| `GET`    | `/api/opportunities/:id/estimations/opportunity`              | Get estimation opportunity data                         |
| `GET`    | `/api/opportunities/:id/estimations/context`                  | Get estimation context                                  |
| `POST`   | `/api/opportunities/:id/estimations/generate`                 | Generate an opportunity estimate                        |
| `GET`    | `/api/technology/`                                            | List technologies                                       |
| `POST`   | `/api/technology/`                                            | Add a technology                                        |
| `PUT`    | `/api/technology/:technologyId`                               | Update a technology                                     |
| `DELETE` | `/api/technology/:technologyId`                               | Delete a technology                                     |
| `POST`   | `/api/recommendations/:opportunityId`                         | Generate technology recommendations                     |
| `GET`    | `/api/recommendations/:opportunityId`                         | Get saved recommendations                               |
| `PUT`    | `/api/recommendations/:opportunityId`                         | Save recommendations                                    |
| `DELETE` | `/api/recommendations/:opportunityId`                         | Delete recommendations                                  |
| `POST`   | `/api/rag/chat`                                               | Ask a question using indexed context                    |
| `POST`   | `/api/rag/chat/reset`                                         | Reset a chat session                                    |
| `POST`   | `/api/rag/reindex/technology-catalog`                         | Reindex the technology catalog                          |
| `POST`   | `/api/rag/reindex/requirement-analysis`                       | Reindex requirement analyses                            |
| `POST`   | `/api/rag/reindex/opportunities`                              | Reindex opportunities                                   |

### Example

Create an opportunity:

```bash
curl -X POST http://localhost:5000/api/opportunities/create \
	-H "Content-Type: application/json" \
	-d '{
		"projectName": "Customer Portal",
		"clientName": "Acme Corp",
		"contactPerson": "Jane Doe",
		"contactEmail": "jane.doe@example.com",
		"industry": "Software",
		"generalNotes": "A self-service portal for customer operations"
	}'
```

Check service health:

```bash
curl http://localhost:5000/api/health
```

Start with `/api/health` when verifying a new environment.

## Getting Started

### Prerequisites

- Node.js 22 or newer
- MongoDB 8 or a compatible MongoDB deployment
- Redis 6 or newer
- An Azure OpenAI-compatible deployment and API key for AI features

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
NODE_ENV=development
API_PREFIX=/api
MONGODB_URI=mongodb://localhost:27017/presales
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_api_key
AI_MODEL=your_deployment_name
LOG_LEVEL=info
```

`OPENAI_API_KEY` and `AI_MODEL` are required for AI-powered endpoints. Keep `.env` out of version control and rotate keys immediately if they are exposed.

### 3. Run the API

Development mode with automatic restart:

```bash
npm run start:dev
```

Production-style start:

```bash
npm start
```

The API listens on `http://localhost:5000` by default.

## Docker Compose

The Compose file provisions the frontend, API, MongoDB, and Redis services:

```bash
docker compose up --build
```

The complete application will be available at:

- Frontend: `http://localhost:3001`
- Backend API: `http://localhost:3000/api`
- Backend health check: `http://localhost:3000/api/health`

When running inside Compose, use the service names in connection strings:

```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/presales
REDIS_URL=redis://redis:6379
VITE_API_BASE_URL=http://localhost:3000/api
```

The frontend is built from the local `frontend/` directory, so no internet connection is required for the frontend build after the repository has been downloaded.

Stop the services with:

```bash
docker compose down
```

Add `-v` only when you intentionally want to remove the persisted MongoDB and Redis volumes.

## Project Structure

```text
src/
├── config/              Environment configuration
├── DB/                  MongoDB and Redis connections
├── static/uploads/      Runtime requirement-file uploads
├── model/               Mongoose schemas and models
├── module/              Feature controllers, services, routes, and validation
├── routes/              API route composition
└── utils/               AI, embeddings, RAG, uploads, errors, logging, and middleware
```

## Operational Notes

- The health endpoint returns HTTP `200` when MongoDB is connected and `503` when it is not.
- Uploaded files are stored under `src/static/uploads`; configure deployment storage accordingly.
- AI generation uses an Azure OpenAI-compatible deployment selected through `AI_MODEL`.

## License

Licensed under the ISC license.
