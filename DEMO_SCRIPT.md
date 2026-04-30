# Demo Script

## Library Management System — API Demo

### 1. Health Check
GET http://localhost:3000/health

### 2. Create a Member
POST http://localhost:3000/members
Body: {"name": "Alice Johnson", "email": "alice@example.com", "phone": "555-1111"}

### 3. Get All Members
GET http://localhost:3000/members

### 4. Create a Book
POST http://localhost:3000/books
Body: {"isbn": "978-0-14-028329-7", "title": "1984", "author": "George Orwell", "genre": "Dystopian", "total_copies": 3}

### 5. Get All Books
GET http://localhost:3000/books

### 6. Borrow a Book
POST http://localhost:3000/loans
Body: {"member_id": 1, "book_id": 1, "due_date": "2026-05-30"}

### 7. Get Member Loans
GET http://localhost:3000/members/1/loans

### 8. Get Book Details from OpenLibrary
GET http://localhost:3000/services/books/978-0-14-028329-7/details

### 9. Get Book Recommendations
GET http://localhost:3000/services/members/1/recommendations

### 10. Return a Book
PUT http://localhost:3000/loans/1
Body: {"status": "returned", "return_date": "2026-04-30"}

### 11. GraphQL — Get All Books
POST http://localhost:3000/graphql
Body (GraphQL):
query {
  getBooks(page: 1, limit: 10) {
    total
    data { id title author genre available_copies }
  }
}

### 12. GraphQL — Create Member
POST http://localhost:3000/graphql
Body (GraphQL):
mutation {
  createMember(name: "Bob Wilson", email: "bob@example.com") {
    id name email
  }
}

### 13. Swagger Documentation
GET http://localhost:3000/api-docs