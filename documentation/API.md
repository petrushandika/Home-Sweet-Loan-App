# API Documentation

# Home Sweet Loan App

**Version**: 1.0  
**Date**: 10 January 2026  
**Type**: LocalStorage API (MVP) / REST API (Phase 2)

---

## Overview

Untuk **MVP (Phase 1)**, aplikasi menggunakan **LocalStorage** sebagai data persistence layer. Tidak ada backend API.

Untuk **Phase 2+**, akan ada REST API dengan database backend.

---

## LocalStorage API (MVP)

### Storage Keys

Semua keys menggunakan prefix `homeSweetLoan_`:

| Key                         | Type   | Description          |
| --------------------------- | ------ | -------------------- |
| `homeSweetLoan_setup`       | Object | Setup configuration  |
| `homeSweetLoan_budgets`     | Object | All budgets data     |
| `homeSweetLoan_spending`    | Array  | All spending entries |
| `homeSweetLoan_assets`      | Object | Assets data          |
| `homeSweetLoan_preferences` | Object | User preferences     |

### Data Structures

#### Setup Data

```json
{
  "accountSummary": ["BCA", "Gopay", "Permata"],
  "incomeSources": ["Monthly Salary", "Bonus"],
  "needs": ["Home Rent", "Course", "Utilities"],
  "wants": ["Shopping", "Entertainment"],
  "savings": ["General Savings", "Emergency Funds"],
  "accountAssets": ["General Savings", "Bibit"],
  "paydayDate": 5
}
```

#### Budget Data

```json
{
  "2026-01": {
    "income": {
      "Monthly Salary": 6430000,
      "Bonus": 0
    },
    "savings": {
      "General Savings": 500000,
      "Emergency Funds": 300000
    },
    "expenses": {
      "Home Rent": 1700000,
      "Course": 150000,
      "Shopping": 200000
    }
  },
  "2026-02": {
    "income": {},
    "savings": {},
    "expenses": {}
  }
}
```

#### Spending Data

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "date": "2026-01-05",
    "description": "Gasoline",
    "category": "Transportation",
    "amount": 100000,
    "checked": false,
    "createdAt": "2026-01-05T10:30:00Z",
    "updatedAt": "2026-01-05T10:30:00Z"
  }
]
```

---

## REST API Specification (Phase 2)

### Base URL

```
Production: https://api.homesweetloan.com/v1
Staging: https://staging-api.homesweetloan.com/v1
Development: http://localhost:3050/api/v1
```

### Authentication

```http
Authorization: Bearer <JWT_TOKEN>
```

### Common Headers

```http
Content-Type: application/json
Accept: application/json
X-API-Version: 1.0
```

### Response Format

**Success Response**:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-01-10T00:00:00Z"
}
```

**Error Response**:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "amount",
        "message": "Amount must be greater than 0"
      }
    ]
  },
  "timestamp": "2026-01-10T00:00:00Z"
}
```

---

## Endpoints

### Authentication

#### POST /auth/register

Register new user

**Request**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/login

Login user

**Request**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

---

### Setup Configuration

#### GET /setup

Get user's setup configuration

**Response**:

```json
{
  "success": true,
  "data": {
    "accountSummary": ["BCA", "Gopay"],
    "incomeSources": ["Monthly Salary"],
    "needs": ["Home Rent", "Course"],
    "wants": ["Shopping"],
    "savings": ["General Savings"],
    "accountAssets": ["General Savings"],
    "paydayDate": 5
  }
}
```

#### PUT /setup

Update setup configuration

**Request**:

```json
{
  "accountSummary": ["BCA", "Gopay", "Permata"],
  "paydayDate": 5
}
```

**Response**:

```json
{
  "success": true,
  "data": { ... },
  "message": "Setup updated successfully"
}
```

---

### Budgets

#### GET /budgets

Get all budgets

**Query Parameters**:

- `year` (optional): Filter by year (e.g., 2026)
- `month` (optional): Filter by month (1-12)

**Response**:

```json
{
  "success": true,
  "data": {
    "2026-01": {
      "income": { ... },
      "savings": { ... },
      "expenses": { ... }
    }
  }
}
```

#### GET /budgets/:yearMonth

Get specific month budget

**Example**: `GET /budgets/2026-01`

**Response**:

```json
{
  "success": true,
  "data": {
    "yearMonth": "2026-01",
    "income": {
      "Monthly Salary": 6430000
    },
    "savings": {
      "General Savings": 500000
    },
    "expenses": {
      "Home Rent": 1700000
    },
    "summary": {
      "totalIncome": 6430000,
      "totalSavings": 500000,
      "totalExpenses": 1700000,
      "allocatedPercentage": 34.21,
      "nonAllocated": 4230000
    }
  }
}
```

#### POST /budgets

Create new budget

**Request**:

```json
{
  "yearMonth": "2026-01",
  "income": {
    "Monthly Salary": 6430000
  },
  "savings": {
    "General Savings": 500000
  },
  "expenses": {
    "Home Rent": 1700000
  }
}
```

**Response**:

```json
{
  "success": true,
  "data": { ... },
  "message": "Budget created successfully"
}
```

#### PUT /budgets/:yearMonth

Update existing budget

**Request**: Same as POST

**Response**:

```json
{
  "success": true,
  "data": { ... },
  "message": "Budget updated successfully"
}
```

#### DELETE /budgets/:yearMonth

Delete budget

**Response**:

```json
{
  "success": true,
  "message": "Budget deleted successfully"
}
```

---

### Spending

#### GET /spending

Get all spending entries

**Query Parameters**:

- `startDate` (optional): Filter from date (YYYY-MM-DD)
- `endDate` (optional): Filter to date (YYYY-MM-DD)
- `category` (optional): Filter by category
- `checked` (optional): Filter by checked status (true/false)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response**:

```json
{
  "success": true,
  "data": {
    "spending": [
      {
        "id": "uuid",
        "date": "2026-01-05",
        "description": "Gasoline",
        "category": "Transportation",
        "amount": 100000,
        "checked": false,
        "createdAt": "2026-01-05T10:30:00Z",
        "updatedAt": "2026-01-05T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    },
    "summary": {
      "totalAmount": 5000000,
      "count": 150
    }
  }
}
```

#### GET /spending/:id

Get specific spending entry

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "date": "2026-01-05",
    "description": "Gasoline",
    "category": "Transportation",
    "amount": 100000,
    "checked": false,
    "createdAt": "2026-01-05T10:30:00Z",
    "updatedAt": "2026-01-05T10:30:00Z"
  }
}
```

#### POST /spending

Create new spending entry

**Request**:

```json
{
  "date": "2026-01-05",
  "description": "Gasoline",
  "category": "Transportation",
  "amount": 100000
}
```

**Validation**:

- `date`: Required, valid date, not future date
- `description`: Required, max 200 characters
- `category`: Required, must exist in setup
- `amount`: Required, number > 0

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    ...
  },
  "message": "Spending created successfully"
}
```

#### PUT /spending/:id

Update spending entry

**Request**:

```json
{
  "description": "Gasoline Shell",
  "amount": 120000,
  "checked": true
}
```

**Response**:

```json
{
  "success": true,
  "data": { ... },
  "message": "Spending updated successfully"
}
```

#### DELETE /spending/:id

Delete spending entry

**Response**:

```json
{
  "success": true,
  "message": "Spending deleted successfully"
}
```

---

### Reports

#### GET /reports/monthly

Get monthly report

**Query Parameters**:

- `year`: Required (e.g., 2026)
- `month`: Required (1-12)

**Response**:

```json
{
  "success": true,
  "data": {
    "year": 2026,
    "month": 1,
    "budget": {
      "totalIncome": 6430000,
      "totalSavings": 800000,
      "totalExpenses": 4500000
    },
    "actual": {
      "totalSpending": 4200000,
      "monthlySavings": 2230000
    },
    "comparison": [
      {
        "category": "Home Rent",
        "allocation": 1700000,
        "realization": 1700000,
        "percentage": 100,
        "status": "ok"
      },
      {
        "category": "Shopping",
        "allocation": 200000,
        "realization": 250000,
        "percentage": 125,
        "status": "over"
      }
    ]
  }
}
```

#### GET /reports/yearly

Get yearly summary

**Query Parameters**:

- `year`: Required (e.g., 2026)

**Response**:

```json
{
  "success": true,
  "data": {
    "year": 2026,
    "months": [
      {
        "month": 1,
        "totalIncome": 6430000,
        "totalSavings": 800000,
        "totalExpenses": 4200000
      },
      ...
    ],
    "summary": {
      "totalIncome": 77160000,
      "totalSavings": 9600000,
      "totalExpenses": 50400000,
      "averageMonthlyIncome": 6430000,
      "averageMonthlySavings": 800000,
      "averageMonthlyExpenses": 4200000
    }
  }
}
```

---

### Assets

#### GET /assets

Get all assets

**Response**:

```json
{
  "success": true,
  "data": {
    "target": 100000000,
    "lastUpdate": "2026-01-06",
    "liquidAssets": [
      {
        "id": "uuid",
        "description": "Tabungan BCA",
        "value": 5000000,
        "account": "General Savings",
        "createdAt": "2026-01-01T00:00:00Z",
        "updatedAt": "2026-01-06T00:00:00Z"
      }
    ],
    "nonLiquidAssets": [
      {
        "id": "uuid",
        "description": "Saldo BPJS",
        "value": 2000000,
        "account": "BPJS",
        "createdAt": "2026-01-01T00:00:00Z",
        "updatedAt": "2026-01-06T00:00:00Z"
      }
    ],
    "summary": {
      "totalLiquidAssets": 5000000,
      "totalNonLiquidAssets": 2000000,
      "totalAssets": 7000000,
      "progress": 7.0
    }
  }
}
```

#### POST /assets

Create new asset

**Request**:

```json
{
  "type": "liquid",
  "description": "Tabungan BCA",
  "value": 5000000,
  "account": "General Savings"
}
```

**Validation**:

- `type`: Required, enum ["liquid", "non-liquid"]
- `description`: Required, max 200 characters
- `value`: Required, number >= 0
- `account`: Required

**Response**:

```json
{
  "success": true,
  "data": { ... },
  "message": "Asset created successfully"
}
```

#### PUT /assets/:id

Update asset

**Request**:

```json
{
  "value": 5500000
}
```

**Response**:

```json
{
  "success": true,
  "data": { ... },
  "message": "Asset updated successfully"
}
```

#### DELETE /assets/:id

Delete asset

**Response**:

```json
{
  "success": true,
  "message": "Asset deleted successfully"
}
```

#### PUT /assets/target

Update assets target

**Request**:

```json
{
  "target": 100000000
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "target": 100000000
  },
  "message": "Target updated successfully"
}
```

---

## Error Codes

| Code                    | HTTP Status | Description                     |
| ----------------------- | ----------- | ------------------------------- |
| `VALIDATION_ERROR`      | 400         | Invalid input data              |
| `UNAUTHORIZED`          | 401         | Invalid or missing token        |
| `FORBIDDEN`             | 403         | Insufficient permissions        |
| `NOT_FOUND`             | 404         | Resource not found              |
| `CONFLICT`              | 409         | Resource already exists         |
| `RATE_LIMIT_EXCEEDED`   | 429         | Too many requests               |
| `INTERNAL_SERVER_ERROR` | 500         | Server error                    |
| `SERVICE_UNAVAILABLE`   | 503         | Service temporarily unavailable |

---

## Rate Limiting

- **Limit**: 100 requests per minute per user
- **Headers**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: 95
  - `X-RateLimit-Reset`: 1641772800

---

## Webhooks (Phase 3)

### Events

- `budget.created`
- `budget.updated`
- `budget.deleted`
- `spending.created`
- `spending.updated`
- `spending.deleted`
- `asset.created`
- `asset.updated`
- `asset.deleted`

### Payload

```json
{
  "event": "spending.created",
  "timestamp": "2026-01-10T00:00:00Z",
  "data": {
    "id": "uuid",
    ...
  }
}
```

---

## SDK Examples

### JavaScript

```javascript
import HomeSweetLoanAPI from "@homesweetloan/sdk";

const client = new HomeSweetLoanAPI({
  apiKey: "your_api_key",
  baseURL: "https://api.homesweetloan.com/v1",
});

// Get budgets
const budgets = await client.budgets.list();

// Create spending
const spending = await client.spending.create({
  date: "2026-01-05",
  description: "Gasoline",
  category: "Transportation",
  amount: 100000,
});

// Get monthly report
const report = await client.reports.monthly(2026, 1);
```

---

**API Version**: 1.0  
**Last Updated**: 10 January 2026  
**Status**: Planning (Phase 2)
