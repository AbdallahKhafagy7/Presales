import mongoose from "mongoose";
import TechnologyCatalog from "./technology-catalog.model.js"; // Adjust path to match your model file

const sampleTechnologies = [
  // Frontend
  {
    technologyName: "React",
    category: "Frontend",
    preferredUsecase:
      "Interactive web applications, dashboards, single-page apps (SPAs), and customer portals.",
    notes: "Primary company standard for web frontends.",
  },
  {
    technologyName: "Next.js",
    category: "Frontend",
    preferredUsecase:
      "Server-side rendered (SSR) web applications, SEO-focused portals, and marketing sites.",
    notes: "Use when SEO or fast initial page loads are essential.",
  },

  // Backend
  {
    technologyName: "Node.js (Express)",
    category: "Backend",
    preferredUsecase:
      "Lightweight RESTful APIs, event-driven microservices, and real-time backends.",
    notes: "Default backend choice for JavaScript ecosystems.",
  },
  {
    technologyName: "NestJS",
    category: "Backend",
    preferredUsecase:
      "Large-scale enterprise APIs requiring strict TypeScript modular architecture.",
    notes: "Preferred over Express for complex, multi-team backends.",
  },
  {
    technologyName: "Python (FastAPI)",
    category: "Backend",
    preferredUsecase:
      "High-performance asynchronous APIs, data processing pipelines, and AI/ML model integrations.",
    notes: "Primary choice for AI and data-heavy projects.",
  },

  // Database
  {
    technologyName: "PostgreSQL",
    category: "Database",
    preferredUsecase:
      "Relational data models requiring strict ACID compliance, transactional integrity, and complex queries.",
    notes: "Default relational database.",
  },
  {
    technologyName: "MongoDB",
    category: "Database",
    preferredUsecase:
      "Unstructured or rapidly evolving document data, content catalogs, and flexible schemas.",
    notes: "Default NoSQL database.",
  },
  {
    technologyName: "Redis",
    category: "Database",
    preferredUsecase:
      "In-memory caching, user session storage, rate limiting, and real-time pub/sub messaging.",
    notes: "Caching layer for high-throughput endpoints.",
  },

  // Mobile
  {
    technologyName: "React Native",
    category: "Mobile",
    preferredUsecase:
      "Cross-platform iOS and Android mobile apps from a single TypeScript/JavaScript codebase.",
    notes: "Primary cross-platform mobile framework.",
  },

  // DevOps & Cloud
  {
    technologyName: "Docker",
    category: "DevOps",
    preferredUsecase:
      "Containerizing services for consistent packaging across local development and production servers.",
    notes: "Mandatory for all microservice deployments.",
  },
  {
    technologyName: "Azure",
    category: "Cloud",
    preferredUsecase:
      "Enterprise cloud hosting, Active Directory (Entra ID) integrations, and Microsoft ecosystems.",
    notes: "Primary cloud vendor for corporate clients.",
  },

  // AI
  {
    technologyName: "LangChain",
    category: "AI",
    preferredUsecase:
      "LLM orchestration, Retrieval-Augmented Generation (RAG) pipelines, and autonomous AI agent workflows.",
    notes: "Standard framework for GenAI integration.",
  },

  // Testing
  {
    technologyName: "Jest",
    category: "Testing",
    preferredUsecase:
      "Unit testing, component testing, and mock testing for JavaScript/TypeScript services.",
    notes: "Standard testing library.",
  },

  // CMS
  {
    technologyName: "Strapi",
    category: "CMS",
    preferredUsecase:
      "Headless CMS for managing dynamic application content via REST or GraphQL APIs.",
    notes: "Default open-source headless CMS.",
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/presales";

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);

    // Clear existing catalog items to avoid duplicates
    await TechnologyCatalog.deleteMany({});
    console.log("Cleared existing technology catalog data.");

    // Insert initial catalog items
    const inserted = await TechnologyCatalog.insertMany(sampleTechnologies);
    console.log(
      `Successfully seeded ${inserted.length} technologies into the catalog!`,
    );

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding technology catalog:", error);
    process.exit(1);
  }
};

seedDatabase();
