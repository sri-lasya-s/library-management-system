const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Member {
    id: Int
    name: String
    email: String
    phone: String
    membership_date: String
    loans: [Loan]
  }

  type Book {
    id: Int
    isbn: String
    title: String
    author: String
    genre: String
    total_copies: Int
    available_copies: Int
  }

  type Loan {
    id: Int
    loan_date: String
    due_date: String
    return_date: String
    status: String
    Member: Member
    Book: Book
  }

  type PaginatedLoans {
    total: Int
    page: Int
    totalPages: Int
    data: [Loan]
  }

  type PaginatedBooks {
    total: Int
    page: Int
    totalPages: Int
    data: [Book]
  }

  type PaginatedMembers {
    total: Int
    page: Int
    totalPages: Int
    data: [Member]
  }

  type DeleteResponse {
    message: String
  }

  type Query {
    getMembers(page: Int, limit: Int): PaginatedMembers
    getMember(id: Int!): Member
    getBooks(page: Int, limit: Int): PaginatedBooks
    getBook(id: Int!): Book
    getLoan(loanId: Int!): Loan
    getLoansByMember(memberId: Int!, page: Int, limit: Int): PaginatedLoans
  }

  type Mutation {
    createMember(name: String!, email: String!, phone: String): Member
    updateMember(id: Int!, name: String, email: String, phone: String): Member
    deleteMember(id: Int!): DeleteResponse
    createBook(isbn: String!, title: String!, author: String!, genre: String, total_copies: Int): Book
    updateBook(id: Int!, title: String, author: String, genre: String, total_copies: Int, available_copies: Int): Book
    deleteBook(id: Int!): DeleteResponse
    createLoan(member_id: Int!, book_id: Int!, due_date: String!): Loan
    updateLoan(loanId: Int!, due_date: String, status: String, return_date: String): Loan
    cancelLoan(loanId: Int!): DeleteResponse
  }
`;

module.exports = typeDefs;