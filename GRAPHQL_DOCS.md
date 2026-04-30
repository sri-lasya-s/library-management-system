# GraphQL API Documentation

## Endpoint
`POST http://localhost:3000/graphql`

## Schema Types

### Member
```graphql
type Member {
  id: Int
  name: String
  email: String
  phone: String
  membership_date: String
  loans: [Loan]
}
```

### Book
```graphql
type Book {
  id: Int
  isbn: String
  title: String
  author: String
  genre: String
  total_copies: Int
  available_copies: Int
}
```

### Loan
```graphql
type Loan {
  id: Int
  loan_date: String
  due_date: String
  return_date: String
  status: String
  Member: Member
  Book: Book
}
```

## Queries

### Get All Books
```graphql
query {
  getBooks(page: 1, limit: 10) {
    total
    page
    totalPages
    data {
      id
      title
      author
      genre
      available_copies
    }
  }
}
```

### Get Single Book
```graphql
query {
  getBook(id: 1) {
    id
    title
    author
    genre
    total_copies
    available_copies
  }
}
```

### Get All Members
```graphql
query {
  getMembers(page: 1, limit: 10) {
    total
    page
    data {
      id
      name
      email
      phone
    }
  }
}
```

### Get Member With Loans
```graphql
query {
  getMember(id: 1) {
    id
    name
    email
    loans {
      id
      status
      due_date
      Book {
        title
        author
      }
    }
  }
}
```

### Get Loan By ID
```graphql
query {
  getLoan(loanId: 1) {
    id
    status
    loan_date
    due_date
    Member {
      name
      email
    }
    Book {
      title
      author
    }
  }
}
```

### Get Loans By Member
```graphql
query {
  getLoansByMember(memberId: 1, page: 1, limit: 10) {
    total
    page
    data {
      id
      status
      due_date
      Book {
        title
      }
    }
  }
}
```

## Mutations

### Create Member
```graphql
mutation {
  createMember(
    name: "Jane Doe"
    email: "jane@example.com"
    phone: "555-5678"
  ) {
    id
    name
    email
  }
}
```

### Update Member
```graphql
mutation {
  updateMember(
    id: 1
    name: "Jane Smith"
    phone: "555-9999"
  ) {
    id
    name
    phone
  }
}
```

### Delete Member
```graphql
mutation {
  deleteMember(id: 1) {
    message
  }
}
```

### Create Book
```graphql
mutation {
  createBook(
    isbn: "978-0-7432-7356-5"
    title: "The Great Gatsby"
    author: "F. Scott Fitzgerald"
    genre: "Classic"
    total_copies: 3
  ) {
    id
    title
    available_copies
  }
}
```

### Update Book
```graphql
mutation {
  updateBook(
    id: 1
    total_copies: 5
    available_copies: 4
  ) {
    id
    title
    total_copies
    available_copies
  }
}
```

### Delete Book
```graphql
mutation {
  deleteBook(id: 1) {
    message
  }
}
```

### Create Loan (Borrow a Book)
```graphql
mutation {
  createLoan(
    member_id: 1
    book_id: 1
    due_date: "2026-05-30"
  ) {
    id
    status
    loan_date
    due_date
  }
}
```

### Update Loan (Extend Due Date)
```graphql
mutation {
  updateLoan(
    loanId: 1
    due_date: "2026-06-15"
  ) {
    id
    due_date
    status
  }
}
```

### Return a Book
```graphql
mutation {
  updateLoan(
    loanId: 1
    status: "returned"
    return_date: "2026-04-30"
  ) {
    id
    status
    return_date
  }
}
```

### Cancel Loan
```graphql
mutation {
  cancelLoan(loanId: 1) {
    message
  }
}
```

## Performance Comparison: REST vs GraphQL

### REST API
- Fixed data structure — always returns all fields
- Multiple endpoints needed for related data
- Example: Getting member + loans requires 2 calls:
  - `GET /members/1`
  - `GET /members/1/loans`

### GraphQL
- Flexible — request only fields you need
- Single endpoint for all operations
- Example: Getting member + loans in 1 call:
```graphql
query {
  getMember(id: 1) {
    name
    email
    loans {
      status
      due_date
      Book { title }
    }
  }
}
```

### Performance Results
| Metric | REST | GraphQL |
|--------|------|---------|
| Endpoints | 14 endpoints | 1 endpoint |
| Data fetching | Fixed fields | Flexible fields |
| Over-fetching | Yes | No |
| Under-fetching | Sometimes | No |
| Network calls for related data | Multiple | Single |
| Response time (simple query) | ~15ms | ~11ms |
| Best for | Simple CRUD | Complex queries |