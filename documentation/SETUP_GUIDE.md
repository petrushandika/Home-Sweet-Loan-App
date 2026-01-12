# Tech Stack Setup Guide

# Home Sweet Loan App

**Version**: 1.0  
**Date**: 10 January 2026  
**Stack**: Next.js 15 + TypeScript + NestJS + PostgreSQL

---

## 📦 Technology Stack Overview

### Frontend

- **Next.js 15** (App Router) - React framework with SSR/SSG
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Accessible component library
- **Recharts** - Data visualization
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **Zustand** - State management
- **NextAuth.js v5** - Authentication

### Backend

- **NestJS** - Progressive Node.js framework
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Relational database
- **Class-validator** - DTO validation
- **Passport JWT** - Authentication strategy
- **Swagger** - API documentation

### DevOps & Tools

- **Vercel** - Frontend deployment
- **Railway/Render** - Backend deployment
- **Neon/Supabase** - PostgreSQL hosting
- **GitHub Actions** - CI/CD
- **ESLint + Prettier** - Code quality
- **Husky** - Git hooks
- **Vitest** - Unit testing
- **Playwright** - E2E testing

---

## 🚀 Project Setup

### Prerequisites

```bash
# Required versions
Node.js >= 20.x
npm >= 10.x
PostgreSQL >= 15.x
Git >= 2.x
```

### Recommended Tools

```bash
# VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- TypeScript Vue Plugin (Volar)
- GitLens
- Error Lens
- Auto Rename Tag
- Path Intellisense
```

---

## 📁 Project Structure

```
home-sweet-loan/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── (auth)/        # Auth group
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/   # Dashboard group
│   │   │   │   ├── setup/
│   │   │   │   ├── budgeting/
│   │   │   │   ├── summary/
│   │   │   │   ├── spending/
│   │   │   │   ├── report/
│   │   │   │   └── assets/
│   │   │   ├── api/           # API routes (optional)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Shadcn components
│   │   │   ├── forms/        # Form components
│   │   │   ├── charts/       # Chart components
│   │   │   ├── layout/       # Layout components
│   │   │   └── shared/       # Shared components
│   │   ├── lib/              # Utilities
│   │   │   ├── utils.ts
│   │   │   ├── api.ts
│   │   │   └── validators.ts
│   │   ├── hooks/            # Custom hooks
│   │   ├── store/            # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   └── styles/           # Global styles
│   ├── public/               # Static assets
│   ├── prisma/               # Prisma schema (if using)
│   ├── .env.local            # Environment variables
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # NestJS application
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── setup/
│   │   │   ├── budgets/
│   │   │   ├── spending/
│   │   │   ├── reports/
│   │   │   └── assets/
│   │   ├── common/           # Shared code
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── pipes/
│   │   ├── config/           # Configuration
│   │   ├── database/         # Database config
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── test/                 # Tests
│   ├── .env
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── package.json
│
└── documentation/              # Documentation
    ├── INDEX.md
    ├── PRD.md
    ├── MVP.md
    ├── TECHNICAL_SPEC.md
    ├── SETUP_GUIDE.md
    ├── DESIGN_SYSTEM.md
    ├── USER_GUIDE.md
    ├── API.md
    └── ROADMAP.md
```

---

## 🎨 Frontend Setup (Next.js)

### 1. Create Next.js Project

```bash
# Create new Next.js app with TypeScript
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir --import-alias "@/*"

cd frontend
```

### 2. Install Dependencies

```bash
# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-toast

# Shadcn/ui
npx shadcn-ui@latest init

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# State Management
npm install zustand

# Charts
npm install recharts

# Date handling
npm install date-fns

# HTTP Client
npm install axios

# Authentication
npm install next-auth@beta

# Icons
npm install lucide-react

# Utils
npm install clsx tailwind-merge class-variance-authority
```

### 3. Setup Shadcn/ui Components

```bash
# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add form
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add progress
```

### 4. Configure Tailwind (tailwind.config.ts)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          DEFAULT: "#10b981",
          foreground: "#ffffff",
        },
        income: "#10b981",
        savings: "#059669",
        needs: "#f59e0b",
        wants: "#8b5cf6",
        expenses: "#f97316",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "gradient-income": "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
        "gradient-savings": "linear-gradient(135deg, #10b981 0%, #047857 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### 5. Environment Variables (.env.local)

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3050
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# NextAuth
NEXTAUTH_URL=http://localhost:3050
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# Database (if using Prisma in frontend)
DATABASE_URL="postgresql://user:password@localhost:5432/homesweet"
```

### 6. Next.js Config (next.config.ts)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
  },
  experimental: {
    optimizePackageImports: ["recharts", "lucide-react"],
  },
};

export default nextConfig;
```

---

## 🔧 Backend Setup (NestJS)

### 1. Create NestJS Project

```bash
# Install NestJS CLI
npm install -g @nestjs/cli

# Create new project
nest new backend

cd backend
```

### 2. Install Dependencies

```bash
# Prisma
npm install @prisma/client
npm install -D prisma

# Validation
npm install class-validator class-transformer

# Authentication
npm install @nestjs/passport passport passport-jwt
npm install @nestjs/jwt
npm install -D @types/passport-jwt

# Configuration
npm install @nestjs/config

# Swagger (API Documentation)
npm install @nestjs/swagger

# CORS
npm install @nestjs/platform-express

# Security
npm install helmet
npm install bcrypt
npm install -D @types/bcrypt

# Testing
npm install -D @nestjs/testing
```

### 3. Initialize Prisma

```bash
npx prisma init
```

### 4. Prisma Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  setup     Setup?
  budgets   Budget[]
  spending  Spending[]
  assets    Asset[]

  @@map("users")
}

model Setup {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  accountSummary  String[]
  incomeSources   String[]
  needs           String[]
  wants           String[]
  savings         String[]
  accountAssets   String[]
  paydayDate      Int      @default(5)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("setup")
}

model Budget {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  yearMonth String   // Format: "2026-01"
  income    Json     // { "Monthly Salary": 6430000 }
  savings   Json     // { "General Savings": 500000 }
  expenses  Json     // { "Home Rent": 1700000 }

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, yearMonth])
  @@map("budgets")
}

model Spending {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  date        DateTime
  description String
  category    String
  amount      Decimal  @db.Decimal(15, 2)
  checked     Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId, date])
  @@map("spending")
}

model Asset {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  type        AssetType
  description String
  value       Decimal   @db.Decimal(15, 2)
  account     String

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId, type])
  @@map("assets")
}

enum AssetType {
  LIQUID
  NON_LIQUID
}
```

### 5. Environment Variables (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/homesweet?schema=public"

# JWT
JWT_SECRET=your-jwt-secret-key-change-this
JWT_EXPIRES_IN=7d

# App
PORT=4000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3050
```

### 6. Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### 7. NestJS Main Config (src/main.ts)

```typescript
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3050",
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix("api");

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle("Home Sweet Loan API")
    .setDescription("Personal Finance Management API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
```

---

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb homesweet

# Create user
psql postgres
CREATE USER homesweet_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE homesweet TO homesweet_user;
```

### Option 2: Docker PostgreSQL

```yaml
# docker-compose.yml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: homesweet-db
    environment:
      POSTGRES_USER: homesweet_user
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: homesweet
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Start database
docker-compose up -d
```

### Option 3: Cloud PostgreSQL (Recommended for Production)

**Neon** (Recommended):

- Free tier: 3 GB storage
- Serverless PostgreSQL
- Auto-scaling
- https://neon.tech

**Supabase**:

- Free tier: 500 MB storage
- PostgreSQL + Auth + Storage
- https://supabase.com

**Railway**:

- Free tier: $5 credit/month
- Easy deployment
- https://railway.app

---

## 🧪 Development Workflow

### 1. Start Development Servers

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev
# Runs on http://localhost:3050

# Terminal 2 - Backend
cd backend
npm run start:dev
# Runs on http://localhost:4000

# Terminal 3 - Database (if using Docker)
docker-compose up
```

### 2. Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run type-check
```

### 3. Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### 4. Database Management

```bash
# Prisma Studio (GUI)
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed
```

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Production deployment
vercel --prod
```

**Environment Variables in Vercel**:

- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `DATABASE_URL` (if using Prisma)

### Backend (Railway)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
cd backend
railway init

# Deploy
railway up

# Add environment variables
railway variables set DATABASE_URL=...
railway variables set JWT_SECRET=...
```

### Database (Neon)

1. Create account at https://neon.tech
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` in both frontend and backend
5. Run migrations: `npx prisma migrate deploy`

---

## 📚 Useful Commands

### Next.js

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### NestJS

```bash
npm run start        # Start application
npm run start:dev    # Start in watch mode
npm run start:prod   # Start production build
npm run build        # Build application
npm run test         # Run tests
```

### Prisma

```bash
npx prisma studio           # Open Prisma Studio
npx prisma generate         # Generate Prisma Client
npx prisma migrate dev      # Create and apply migration
npx prisma migrate deploy   # Apply migrations (production)
npx prisma db push          # Push schema without migration
npx prisma db seed          # Seed database
```

---

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # or :4000

# Kill process
kill -9 <PID>
```

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -h localhost -U homesweet_user -d homesweet
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Next Steps

1. ✅ Setup development environment
2. ✅ Create database schema
3. ✅ Implement authentication
4. ✅ Build API endpoints
5. ✅ Create frontend pages
6. ✅ Integrate frontend with backend
7. ✅ Add charts and visualizations
8. ✅ Testing
9. ✅ Deployment

---

**Happy Coding! 🚀**
