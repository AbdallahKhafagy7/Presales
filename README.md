# presales-ai-backend

**Version:** `1.0.0`
## Quick Start

```bash
git clone <repository-url>
cd pre-sales-requirements
npm install
cp .env.example .env
npm run start:dev


## Installation Guide

## Prerequisites

Before running the project, ensure that the following software is installed:

- Node.js 
- npm
- MongoDB
- Git
- Docker 

Verify installation:

```bash
node -v
npm -v
git --version
```

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd pre-sales-requirements
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the root directory.

Example:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pre-sales-requirements

API_KEY=
```

Or copy the example file:

```bash
cp .env.example .env
```

---

## 4. Run the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm start
```

The API will be available at:

```text
http://localhost:3000
```

---

## 5. Run Using Docker (Optional)

```bash
docker compose up --build
```

Stop containers:

```bash
docker compose down
```

---

# Project Description

Pre-Sales Requirements is a RESTful API built to manage pre-sales opportunities and their related requirements.

The system allows users to:

- Create, update, retrieve, and delete opportunities.
- Add or update requirements text for an opportunity.
- Upload and manage requirement files.
- Analyze requirements using AI.
- Enforce business rules before an opportunity can be marked as ready for analysis.
- Automatically remove related requirements and files when deleting an opportunity.

---

# Technologies Used

## Backend
- Node.js
- Express.js
- TypeScript

## Database
- MongoDB
- Mongoose

## Validation
- Zod

## File Upload
- Multer

## AI Integration
- OpenAI SDK / Azure AI Foundry

# Error Handling

The application uses custom exception classes to provide consistent API error responses.

## Available Exceptions

| Error Class | HTTP Status Code | Description |
|------------|-----------------|-------------|
| `BadRequestError` | `400` | Invalid request data or business rule violation |
| `AuthorityError` | `401` | Authentication or authorization failure |
| `NotFoundError` | `404` | Requested resource does not exist |
| `ConflictError` | `409` | Resource conflict or duplicate data |
| `AppError` | Custom | Base error class for all application exceptions |

---

## Error Response Format

All errors follow the same response structure:

```json
{
  "message": "Validation failed",
  "errorDetails": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

---

## Example Responses

### Bad Request

```json
{
  "message": "Opportunity cannot be marked as ready for analysis",
  "statusCode": 400
}
```

### Not Found

```json
{
  "message": "Opportunity not found",
  "statusCode": 404
}
```

### Conflict

```json
{
  "message": "Opportunity already exists",
  "statusCode": 409
}
```

### Unauthorized

```json
{
  "message": "Invalid token",
  "statusCode": 401
}
```

# Project Structure

```bash
src
├── config/                    # Application and AI configuration
│   ├── AI.config.ts
│   └── dev.env.ts
│
├── DB/                        # Database connection configuration
│   └── connection.ts
│
├── model/                     # Mongoose schemas and models
│   ├── opportunity/
│   ├── opportunityAnalysis/
│   ├── opportunityRequirements/
│   └── requirementFile/
│
├── module/                    # Feature-based modules
│   │
│   ├── common/
│   │   └── validation.ts      # Shared validation utilities
│   │
│   ├── Opportunity/
│   │   ├── opportunity.controller.ts
│   │   ├── opportunity.service.ts
│   │   ├── opportunity.dto.ts
│   │   └── opportunity.validation.ts
│   │
│   ├── Requirements/          # Requirements management module
│   ├── RequirementFile/       # Requirement files module
│   └── opportunity-analysis/  # AI analysis module
│
├── utils/                     # Shared utilities
│   ├── AI/                    # AI prompts and helper functions
│   ├── enum/                  # Application enums
│   ├── error/                 # Custom exceptions and error handling
│   ├── interfaces/            # Shared TypeScript interfaces
│   ├── middleware/            # Express middlewares
│   └── read-files-data/       # PDF, DOCX and TXT extraction utilities
│
├── app.controller.ts          # Express application configuration
└── index.ts                   # Application entry point
│
uploads/                       # Uploaded requirement files
│
.env.example                   # Example environment variables
Dockerfile                     # Docker image definition
docker-compose.yml             # Multi-container setup
package.json                   # Dependencies and scripts
tsconfig.json                  # TypeScript configuration
README.md                      # Project documentation
```
...
