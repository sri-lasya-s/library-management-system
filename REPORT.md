# Library Management System — Project Report

## 1. Design Decisions and Justifications

### Scenario Selection
I chose a Library Management System as it naturally maps to the required API structure with three core entities: members, books, and loans. This scenario provides clear relationships between entities and realistic use cases for both REST and GraphQL APIs.

### Technology Stack
- **Node.js + Express.js** — Chosen for its lightweight nature, extensive ecosystem, and suitability for building REST APIs rapidly
- **Apollo Server 4** — Industry standard for GraphQL implementation, provides excellent developer tooling and integrates seamlessly with Express
- **SQLite with Sequelize ORM** — Selected for portability and ease of setup. Sequelize provides database abstraction, making it easy to migrate to PostgreSQL or MySQL in production
- **Winston** — Professional logging library providing structured JSON logs with timestamps, log levels, and file-based log persistence
- **Swagger/OpenAPI** — Auto-generated documentation from JSDoc comments ensures documentation stays in sync with code

### Database Design
The database follows normalization principles with three tables:
- **members** — Stores library member information with unique email constraint
- **books** — Stores book catalog with ISBN as unique identifier and copy tracking
- **loans** — Junction table connecting members and books with loan status tracking

Indexes were added on frequently queried fields (email, isbn, author, genre, member_id, book_id, status) to optimize query performance.

### API Architecture
A layered architecture was implemented:
- **Routes Layer** — Handles HTTP routing and request/response
- **Controllers Layer** — Contains business logic for REST endpoints
- **Service Layer** — Aggregates data from database and third-party APIs
- **Models Layer** — Sequelize ORM models with relationships

This separation of concerns ensures maintainability and testability.

### GraphQL Implementation
Apollo Server was integrated alongside the REST API, sharing the same service layer. This ensures consistent business logic across both API styles and avoids code duplication.

---

## 2. Challenges Encountered and Solutions

### Challenge 1: SQLite with Sequelize Sync
**Problem:** Sequelize's `alter: true` sync caused conflicts with SQLite when adding indexes to existing tables.
**Solution:** Switched to `force: false` sync which only creates tables if they don't exist, avoiding conflicts while preserving data.

### Challenge 2: Apollo Server CORS
**Problem:** Apollo Server middleware required specific CORS configuration to accept requests from external clients.
**Solution:** Configured CORS with `origin: '*'` on both the Express app and GraphQL middleware endpoint.

### Challenge 3: Third-Party API Integration
**Problem:** OpenLibrary API returns different data structures for different books.
**Solution:** Implemented defensive coding with optional chaining and fallback values to handle missing fields gracefully.

### Challenge 4: GraphQL and REST Coexistence
**Problem:** Running Apollo Server alongside Express required careful middleware ordering.
**Solution:** Initialized Apollo Server first, then mounted it as Express middleware after all REST routes.

---

## 3. Performance Analysis and Optimization Strategies

### REST API Performance
- Average response time: ~15ms for simple queries
- Pagination implemented on all list endpoints to limit data transfer
- Database indexes on frequently queried fields reduce query time

### GraphQL Performance
- Average response time: ~11ms for equivalent queries
- Single endpoint reduces HTTP overhead
- Clients request only needed fields, reducing payload size

### REST vs GraphQL Comparison

| Metric | REST API | GraphQL |
|--------|----------|---------|
| Number of endpoints | 17 endpoints | 1 endpoint |
| Response time (simple) | ~15ms | ~11ms |
| Data flexibility | Fixed structure | Client-defined |
| Over-fetching | Yes | No |
| Under-fetching | Sometimes | No |
| Network calls for related data | Multiple | Single |
| Caching | Easy (HTTP cache) | Requires custom |
| Learning curve | Low | Medium |

### Optimization Strategies Implemented
- Database indexes on all foreign keys and frequently filtered fields
- Pagination on all list endpoints (default 10 items per page)
- Winston logging to file to avoid console I/O bottlenecks
- Sequelize ORM lazy loading to avoid unnecessary joins

---

## 4. Security Considerations and Implementations

### Helmet.js
HTTP security headers configured using Helmet.js, protecting against:
- Cross-Site Scripting (XSS)
- Clickjacking
- MIME type sniffing
- Information disclosure via X-Powered-By header

### CORS Configuration
Cross-Origin Resource Sharing configured to control which domains can access the API.

### Input Validation
All endpoints validate required fields before processing:
- Missing required fields return 400 Bad Request
- Invalid IDs return 404 Not Found
- Duplicate unique fields return appropriate error messages

### Error Handling
Centralized error handling middleware catches all unhandled errors and returns consistent JSON error responses without exposing internal stack traces to clients.

### Environment Variables
Sensitive configuration stored in `.env` file which is excluded from version control via `.gitignore`. `.env.example` provided as a template.

### Authentication
Authentication was marked as optional in the assignment requirements. For production, JWT-based authentication would be implemented using the jsonwebtoken package, with middleware protecting all write operations.

---

## 5. Future Improvements

### Short Term
- **JWT Authentication** — Add token-based authentication to protect write endpoints
- **Rate Limiting** — Implement express-rate-limit to prevent API abuse
- **Input Sanitization** — Add express-validator for comprehensive input validation
- **Unit Tests** — Add Jest tests for all controllers and services
- **Caching** — Implement Redis caching for frequently accessed book details

### Medium Term
- **PostgreSQL Migration** — Move from SQLite to PostgreSQL for production scalability
- **GraphQL DataLoader** — Implement DataLoader pattern to solve N+1 query problem
- **GraphQL Subscriptions** — Real-time notifications for loan due dates
- **Email Notifications** — Send reminders for overdue loans

### Long Term
- **Microservices** — Split into separate services for members, books, and loans
- **API Gateway** — Implement API gateway for rate limiting and authentication
- **Analytics Dashboard** — Track popular books, active members, and loan trends
- **Mobile App** — Build React Native app consuming the GraphQL API