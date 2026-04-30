# Database Schema

## Tables

### members
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| name | STRING | NOT NULL |
| email | STRING | NOT NULL, UNIQUE |
| phone | STRING | |
| membership_date | DATEONLY | DEFAULT NOW |
| createdAt | DATETIME | AUTO |
| updatedAt | DATETIME | AUTO |

**Indexes:** email, name

### books
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| isbn | STRING | NOT NULL, UNIQUE |
| title | STRING | NOT NULL |
| author | STRING | NOT NULL |
| genre | STRING | |
| total_copies | INTEGER | DEFAULT 1 |
| available_copies | INTEGER | DEFAULT 1 |
| createdAt | DATETIME | AUTO |
| updatedAt | DATETIME | AUTO |

**Indexes:** isbn, author, genre

### loans
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| member_id | INTEGER | FOREIGN KEY → members.id |
| book_id | INTEGER | FOREIGN KEY → books.id |
| loan_date | DATEONLY | DEFAULT NOW |
| due_date | DATEONLY | NOT NULL |
| return_date | DATEONLY | |
| status | ENUM | active/returned/overdue/cancelled |
| createdAt | DATETIME | AUTO |
| updatedAt | DATETIME | AUTO |

**Indexes:** member_id, book_id, status

## Relationships

members ──< loans >── books
(one member can have many loans)
(one book can have many loans)

## Entity Relationship Diagram
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   members   │         │    loans    │         │    books    │
│─────────────│         │─────────────│         │─────────────│
│ id (PK)     │──────┐  │ id (PK)     │  ┌──────│ id (PK)     │
│ name        │      └─►│ member_id   │  │      │ isbn        │
│ email       │         │ book_id     │◄─┘      │ title       │
│ phone       │         │ loan_date   │         │ author      │
│ membership  │         │ due_date    │         │ genre       │
│ _date       │         │ return_date │         │ total_copies│
└─────────────┘         │ status      │         │ available   │
└─────────────┘         └─────────────┘

