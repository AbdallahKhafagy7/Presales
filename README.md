# Presales API

A RESTful API for managing presales opportunities, their requirements, and associated files. Built with Node.js, Express, and MongoDB.

## Project Description

This is a backend application designed to manage presales opportunities within an organization. The system allows users to:

- Create, read, update, and delete presales opportunities
- Define and manage requirements for each opportunity
- Upload and manage files associated with opportunities
- Track presales requirements and deliverables

The API provides a complete CRUD (Create, Read, Update, Delete) interface for opportunity management with file storage capabilities.

## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose v9.7.4
- **File Upload**: Multer v2.2.0
- **Language**: JavaScript (ES Modules)
- **Environment Management**: Node.js built-in dotenv

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB instance (local or cloud-based)
- npm or yarn package manager

### Installation Steps

1. **Clone or navigate to the project directory**

   ```bash
   cd project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory with the following variables:

   ```env
   PORT=8080
   MONGO_URI=mongodb://localhost:27017/opportunities
   ```

   - `PORT`: Server port (default: 8080)
   - `MONGO_URI`: MongoDB connection string

4. **Verify MongoDB is running** (if using local MongoDB)
   ```bash
   mongod
   ```

## How to Run the Project

1. **Start the development server with auto-reload**:

   ```bash
   npm start
   ```

2. **The server will output**:

   ```
   Database connected successfully!
   Server listening on port 8080...
   ```

3. **Test the API** using Postman or any HTTP client at:
   ```
   http://localhost:8080
   ```

## Implementation Notes

- **Error Handling**: Global error handler implemented for consistent error responses
- **Not Found Handler**: Custom 404 handler for undefined routes
- **Static Files**: Uploaded files are served from the `static/uploads` directory
- **File Upload**: Uses Multer for secure file upload handling
- **Database**: Mongoose provides schema validation and ORM functionality
- **Development**: Auto-reload enabled with `--watch` flag for faster development

## API Endpoints

### Base URL

```
http://localhost:8080/api
```

### Opportunities

| Method | Endpoint                        | Description                |
| ------ | ------------------------------- | -------------------------- |
| GET    | `/opportunities`                | Get all opportunities      |
| GET    | `/opportunities/:opportunityId` | Get a specific opportunity |
| POST   | `/opportunities`                | Create a new opportunity   |
| POST   | `/opportunities/:opportunityId` | Update an opportunity      |
| DELETE | `/opportunities/:opportunityId` | Delete an opportunity      |

### Requirements (nested under Opportunities)

| Method | Endpoint                                     | Description                             |
| ------ | -------------------------------------------- | --------------------------------------- |
| GET    | `/opportunities/requirements/:opportunityId` | Get requirements for an opportunity     |
| POST   | `/opportunities/requirements/:opportunityId` | Create a requirement for an opportunity |
| DELETE | `/opportunities/requirements/:opportunityId` | Delete a requirement                    |

### Files (nested under Opportunities)

| Method | Endpoint                              | Description                                                                           |
| ------ | ------------------------------------- | ------------------------------------------------------------------------------------- |
| GET    | `/opportunities/files/:opportunityId` | Get files for an opportunity                                                          |
| POST   | `/opportunities/files/:opportunityId` | Upload a file for an opportunity (multipart/form-data with field name: `file-upload`) |
| DELETE | `/opportunities/files/:fileId`        | Delete a file                                                                         |

## Example Usage

### Create an Opportunity

```bash
curl -X POST http://localhost:8080/api/opportunities \
  -H "Content-Type: application/json" \
  -d '{"title": "New Opportunity", "description": "Description here"}'
```

### Upload a File

```bash
curl -X POST http://localhost:8080/api/opportunities/files/opportunityId \
  -F "file-upload=@path/to/file.txt"
```

### Get All Opportunities

```bash
curl http://localhost:8080/api/opportunities
```

## Project Structure

```
├── index.js                    # Main server entry point
├── package.json               # Project dependencies
├── controllers/               # Request handlers
│   ├── opportunitiesController.js
│   ├── requirementsController.js
│   └── filesController.js
├── models/                    # Mongoose schemas
│   ├── Opportunity.js
│   ├── OpportunityRequirement.js
│   └── RequirementFile.js
├── routes/                    # API route definitions
│   ├── opportunity.js
│   ├── opportunityRequirement.js
│   └── requirementFile.js
├── utils/                     # Utility functions
│   ├── globalErrorHandler.js
│   ├── notFoundHandler.js
│   └── uploader.js
└── static/                    # Static files and uploads
    └── uploads/               # File upload directory
```

## License

ISC
