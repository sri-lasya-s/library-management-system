Click `README.md` and replace everything with this:

# Library Management System API

A comprehensive multi-layer API system for managing library books, members, and loans. Built with Node.js, Express, Apollo GraphQL, and SQLite.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **GraphQL:** Apollo Server 4
- **Database:** SQLite with Sequelize ORM
- **Logging:** Winston
- **Documentation:** Swagger/OpenAPI

## Project Structure

library-management-system/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── bookController.js
│   │   ├── loanController.js
│   │   └── memberController.js
│   ├── graphql/
│   │   ├── resolvers.js
│   │   └── schema.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Book.js
│   │   ├── index.js
│   │   ├── Loan.js
│   │   └── Member.js
│   ├── routes/
│   │   ├── books.js
│   │   ├── loans.js
│   │   ├── members.js
│   │   └── services.js
│   ├── services/
│   │   ├── bookService.js
│   │   └── memberService.js
│   ├── app.js
│   ├── logger.js
│   ├── seedData.js
│   └── swagger.js
├── logs/
│   ├── combined.log
│   └── error.log
├── .env.example
├── .gitignore
├── ARCHITECTURE.md
├── DATABASE_SCHEMA.md
├── DEMO_SCRIPT.md
├── GRAPHQL_DOCS.md
├── REPORT.md
├── deploy.sh
├── package.json
├── README.md
└── server.js

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm

### Installation

1. Clone the repository:
git clone https://github.com/YOURUSERNAME/library-management-system.git
cd library-management-system

2. Install dependencies:

npm install

3. Create environment file:

cp .env.example .env

4. Run the server:

npm run dev

## API Endpoints

### REST API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /members | Get all members (paginated) |
| GET | /members/:id | Get member by ID |
| POST | /members | Create member |
| PUT | /members/:id | Update member |
| DELETE | /members/:id | Delete member |
| GET | /members/:id/loans | Get member loans |
| GET | /books | Get all books (paginated) |
| GET | /books/:id | Get book by ID |
| POST | /books | Add book |
| PUT | /books/:id | Update book |
| DELETE | /books/:id | Delete book |
| GET | /loans/:id | Get loan by ID |
| POST | /loans | Create loan (borrow book) |
| PUT | /loans/:id | Update loan |
| DELETE | /loans/:id | Cancel loan |
| GET | /services/books/:isbn/details | Get book details from OpenLibrary |
| GET | /services/members/:id/recommendations | Get book recommendations |

### GraphQL API
- **Endpoint:** `POST /graphql`
- **Playground:** Use Thunder Client or Apollo Studio

### API Documentation
- **Swagger UI:** `http://localhost:3000/api-docs`

## Features
- ✅ RESTful API with full CRUD operations
- ✅ GraphQL API with Apollo Server
- ✅ SQLite database with Sequelize ORM
- ✅ Proper relationships and indexes
- ✅ Pagination on all list endpoints
- ✅ Error handling and validation
- ✅ OpenLibrary third-party API integration
- ✅ Book recommendation engine
- ✅ Winston logging with file persistence
- ✅ Swagger/OpenAPI documentation
- ✅ CORS and Helmet security

## Documentation
- [Architecture Diagram](ARCHITECTURE.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [GraphQL Documentation](GRAPHQL_DOCS.md)
- [Demo Script](DEMO_SCRIPT.md)
- [Project Report](REPORT.md)


## Live Demo
- **API:** https://library-management-api.azurewebsites.net
- **Health:** https://library-management-api.azurewebsites.net/health
- **Swagger Docs:** https://library-management-api.azurewebsites.net/api-docs
- **GraphQL:** https://library-management-api.azurewebsites.net/graphql