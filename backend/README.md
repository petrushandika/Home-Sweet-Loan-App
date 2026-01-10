# Home Sweet Loan App - Backend

Backend API for Home Sweet Loan, built with NestJS 11, Prisma 7 Beta, and PostgreSQL 17.

## 🛠️ Tech Stack

- **Framework**: NestJS 11.0
- **Runtime**: Node.js 24.x
- **Language**: TypeScript 5.7
- **ORM**: Prisma 6.0 (Stable)
- **Database**: PostgreSQL 17.x
- **Authentication**: JWT + Passport
- **Validation**: Class Validator + Class Transformer
- **Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── common/
│   │   ├── decorators/        # Custom decorators
│   │   ├── guards/            # Auth guards
│   │   ├── filters/           # Exception filters
│   │   └── interceptors/      # Response interceptors
│   ├── config/
│   │   ├── prisma.module.ts   # Prisma configuration
│   │   └── prisma.service.ts  # Prisma service
│   ├── modules/
│   │   ├── auth/              # Authentication
│   │   ├── users/             # User management
│   │   ├── setup/             # Setup configuration
│   │   ├── budgets/           # Budget management
│   │   ├── spending/          # Spending tracker
│   │   ├── reports/           # Reports & analytics
│   │   └── assets/            # Assets management
│   ├── app.module.ts          # Root module
│   └── main.ts                # Application entry point
├── .env.example               # Environment variables template
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 24.x or higher
- PostgreSQL 17.x
- npm 10.x

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Setup environment variables**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your database connection:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/home_sweet_loan?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   CORS_ORIGIN="http://localhost:8000"
   ```

3. **Setup database**:

   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # Seed database with demo data
   npm run prisma:seed
   ```

4. **Start development server**:

   ```bash
   npm run start:dev
   ```

   The API will be available at:
   - **API**: http://localhost:3000/api/v1
   - **Swagger Docs**: http://localhost:3000/api/docs

## 📊 Database Schema

### Models

- **User**: User accounts with authentication
- **SetupConfig**: User configuration (accounts, categories, payday)
- **Budget**: Monthly budgets (income, savings, expenses)
- **Spending**: Daily spending entries
- **Asset**: Liquid and non-liquid assets
- **UserSettings**: User preferences and targets

### Relationships

```
User (1) ─── (1) SetupConfig
User (1) ─── (N) Budget
User (1) ─── (N) Spending
User (1) ─── (N) Asset
User (1) ─── (1) UserSettings
```

## 🔐 Authentication

The API uses JWT Bearer token authentication.

### Register

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Use Token

```bash
GET /api/v1/users/profile
Authorization: Bearer <your-jwt-token>
```

## 📚 API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Users

- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

### Setup

- `GET /setup` - Get setup configuration
- `PUT /setup` - Update setup configuration

### Budgets

- `GET /budgets` - Get all budgets
- `GET /budgets/:yearMonth` - Get specific budget
- `POST /budgets` - Create budget
- `PUT /budgets/:yearMonth` - Update budget
- `DELETE /budgets/:yearMonth` - Delete budget

### Spending

- `GET /spending` - Get all spending (with filters)
- `POST /spending` - Create spending entry
- `PUT /spending/:id` - Update spending entry
- `DELETE /spending/:id` - Delete spending entry

### Assets

- `GET /assets` - Get all assets with summary
- `POST /assets` - Create asset
- `PUT /assets/:id` - Update asset
- `DELETE /assets/:id` - Delete asset
- `PUT /assets/target` - Update assets target

### Reports

- `GET /reports/monthly?year=2026&month=1` - Get monthly report

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🗄️ Database Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Seed database
npm run prisma:seed
```

## 🔧 Development

```bash
# Development mode with hot reload
npm run start:dev

# Debug mode
npm run start:debug

# Production build
npm run build

# Production mode
npm run start:prod
```

## 📦 Production Deployment

### Option 1: Railway

1. Create new project on Railway
2. Add PostgreSQL database
3. Connect GitHub repository
4. Set environment variables
5. Deploy automatically

### Option 2: Render

1. Create new Web Service
2. Connect GitHub repository
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

### Option 3: Docker

```bash
# Build image
docker build -t home-sweet-loan-backend .

# Run container
docker run -p 3000:3000 home-sweet-loan-backend
```

## 🔐 Environment Variables

| Variable         | Description                  | Default                 |
| ---------------- | ---------------------------- | ----------------------- |
| `DATABASE_URL`   | PostgreSQL connection string | -                       |
| `JWT_SECRET`     | Secret key for JWT           | -                       |
| `JWT_EXPIRES_IN` | JWT expiration time          | `7d`                    |
| `PORT`           | Server port                  | `3000`                  |
| `NODE_ENV`       | Environment                  | `development`           |
| `CORS_ORIGIN`    | Allowed CORS origin          | `http://localhost:8000` |
| `API_PREFIX`     | API route prefix             | `api/v1`                |

## 📝 Demo Credentials

After running `npm run prisma:seed`:

- **Email**: demo@homesweetloan.com
- **Password**: password123

## 🛡️ Security

- Password hashing with bcrypt (10 rounds)
- JWT authentication with configurable expiration
- Global validation pipe for input sanitization
- CORS protection
- Environment-based configuration

## 📖 API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:3000/api/docs

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Run migrations
npm run prisma:migrate
```

### Prisma Client Error

```bash
# Regenerate Prisma Client
npm run prisma:generate
```

### Port Already in Use

```bash
# Change PORT in .env
PORT=8000
```

## 📄 License

MIT

## 👨‍💻 Author

Petrus Handika

---

**Built with ❤️ using NestJS 11 + Prisma 7 Beta + PostgreSQL 17**
