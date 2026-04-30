
# System Architecture

## Overview
The Library Management System is a multi-layer API system built with Node.js, Express, Apollo GraphQL, and SQLite.

## Architecture Diagram


┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│         (Thunder Client / Postman / Browser)            │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│                   EXPRESS SERVER                        │
│                  (Port 3000)                            │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │  REST API   │  │  GraphQL    │  │   Swagger UI   │  │
│  │  /members   │  │  /graphql   │  │   /api-docs    │  │
│  │  /books     │  │  (Apollo)   │  │                │  │
│  │  /loans     │  │             │  │                │  │
│  │  /services  │  │             │  │                │  │
│  └──────┬──────┘  └──────┬──────┘  └────────────────┘  │
│         │                │                              │
│         └────────┬───────┘                              │
│                  ▼                                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │              SERVICE LAYER                        │  │
│  │   bookService.js    │    memberService.js         │  │
│  └──────────┬──────────────────────────┬────────────┘  │
│             │                          │               │
│             ▼                          ▼               │
│  ┌──────────────────┐    ┌─────────────────────────┐  │
│  │   Sequelize ORM  │    │   Third-Party APIs      │  │
│  │                  │    │                         │  │
│  │  Member Model    │    │  OpenLibrary API        │  │
│  │  Book Model      │    │  (Book Details)         │  │
│  │  Loan Model      │    │                         │  │
│  └────────┬─────────┘    └─────────────────────────┘  │
│           │                                            │
│           ▼                                            │
│  ┌──────────────────┐                                  │
│  │   SQLite DB      │                                  │
│  │  library.sqlite  │                                  │
│  └──────────────────┘                                  │
└─────────────────────────────────────────────────────────┘


## Components

### 1. REST API Layer
- Built with Express.js
- Endpoints for members, books, loans and services
- Proper error handling and pagination
- Secured with Helmet and CORS

### 2. GraphQL API Layer
- Built with Apollo Server 4
- Single endpoint /graphql
- Queries and mutations for all resources
- Reuses existing service layer

### 3. Service Layer
- bookService.js — handles book operations and OpenLibrary API
- memberService.js — handles member operations
- Aggregates data from database and third-party APIs

### 4. Database Layer
- SQLite database with Sequelize ORM
- Three tables: members, books, loans
- Proper relationships and indexes

### 5. Third-Party Integration
- OpenLibrary API — fetches book metadata by ISBN
- No API key required
- Error handling and fallback mechanisms

## Security
- Helmet.js for HTTP headers
- CORS configuration
- Input validation on all endpoints
- Error handling middleware

