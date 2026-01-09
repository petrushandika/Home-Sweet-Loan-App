# 🛠️ Tech Stack Reference

# Home Sweet Loan App

**Version**: 3.0 (Latest Stable + Cutting Edge)  
**Date**: 10 January 2026  
**Status**: Modern Stack with Latest Features

---

## 📦 Complete Tech Stack (Latest & Greatest)

### Frontend Stack

| Technology          | Version   | Purpose            | Why This Version?                                                    |
| ------------------- | --------- | ------------------ | -------------------------------------------------------------------- |
| **Next.js**         | 16.0.0-rc | React Framework    | Latest RC with React 19 Compiler, improved caching, better Turbopack |
| **React**           | 19.0.0    | UI Library         | Latest stable with React Compiler, improved concurrent features      |
| **TypeScript**      | 5.7.x     | Type Safety        | Latest with improved type inference, decorators                      |
| **TailwindCSS**     | 4.0.x     | Styling            | Latest with native CSS, Rust-based, 10x faster                       |
| **Shadcn/ui**       | Latest    | Component Library  | Latest Radix UI primitives + Chart components                        |
| **Shadcn Charts**   | Latest    | Data Visualization | Built-in charts (Recharts wrapper), perfect for dashboards           |
| **Zod**             | 3.24.x    | Schema Validation  | Latest with better TypeScript integration                            |
| **React Hook Form** | 7.54.x    | Form Management    | Latest stable                                                        |
| **Zustand**         | 5.0.x     | State Management   | Latest with improved TypeScript                                      |
| **TanStack Query**  | 5.x       | Server State       | Latest (formerly React Query)                                        |
| **NextAuth.js**     | 5.0.0     | Authentication     | v5 stable with App Router support                                    |

### Backend Stack

| Technology            | Version    | Purpose               | Why This Version?                               |
| --------------------- | ---------- | --------------------- | ----------------------------------------------- |
| **NestJS**            | 11.0.x     | Backend Framework     | Latest with improved DI, better performance     |
| **Node.js**           | 23.x       | Runtime               | Latest (cutting edge features)                  |
| **Prisma**            | 7.0.0-beta | ORM                   | Latest beta with TypedSQL, improved performance |
| **PostgreSQL**        | 17.x       | Database              | Latest with improved performance, JSON features |
| **Class Validator**   | 0.14.x     | DTO Validation        | Latest stable                                   |
| **Class Transformer** | 0.5.x      | Object Transformation | Latest stable                                   |
| **Passport**          | 0.7.x      | Authentication        | Latest stable                                   |
| **JWT**               | 9.0.x      | Token Management      | Latest stable                                   |

### Development Tools

| Technology     | Version             | Purpose              | Why?                                           |
| -------------- | ------------------- | -------------------- | ---------------------------------------------- |
| **npm**        | 10.x                | Package Manager      | Built-in with Node.js, universal compatibility |
| **Turbopack**  | Built-in Next.js 16 | Build Tool           | 10x faster than Webpack                        |
| **Biome**      | 1.9.x               | Linting & Formatting | 100x faster than ESLint+Prettier               |
| **Vitest**     | 2.x                 | Unit Testing         | Faster than Jest, Vite-powered                 |
| **Playwright** | 1.49.x              | E2E Testing          | Latest with better debugging                   |

### Deployment & Infrastructure

| Service     | Purpose          | Free Tier        | Notes               |
| ----------- | ---------------- | ---------------- | ------------------- |
| **Vercel**  | Frontend Hosting | Yes (Hobby)      | Best for Next.js 16 |
| **Railway** | Backend Hosting  | $5/month credit  | Easy NestJS deploy  |
| **Neon**    | PostgreSQL 17    | 3 GB free        | Serverless Postgres |
| **Upstash** | Redis (optional) | 10K requests/day | For caching         |

---

## 🎯 Why This Stack?

### Next.js 16.0.0-rc (Release Candidate)

- ✅ **React 19 Compiler**: Automatic memoization, no more useMemo/useCallback
- ✅ **Improved Turbopack**: 10x faster than Webpack, 2x faster than v15
- ✅ **Better Caching**: Smarter cache invalidation
- ✅ **Partial Prerendering**: Stable and production-ready
- ✅ **Server Actions**: Enhanced with better error handling
- ✅ **Streaming**: Improved streaming with better Suspense
- ⚠️ **RC Status**: Release Candidate, very stable, production-ready for early adopters

### React 19.0.0 (Stable)

- ✅ **React Compiler**: Automatic optimization, no manual memoization
- ✅ **Improved hooks**: useOptimistic, useFormStatus, useActionState
- ✅ **Better Suspense**: More predictable concurrent rendering
- ✅ **Server Components**: Fully stable and optimized
- ✅ **Actions**: First-class support for server actions

### TypeScript 5.7.x (Latest)

- ✅ **Improved type inference**: Better type narrowing
- ✅ **Better decorators**: Full support for NestJS decorators
- ✅ **Faster compilation**: 20% faster than 5.6
- ✅ **Better error messages**: More helpful diagnostics

### TailwindCSS 4.0.x (Latest)

- ✅ **Native CSS**: No PostCSS needed, pure CSS
- ✅ **Rust-based**: 10x faster compilation
- ✅ **Better IntelliSense**: Improved autocomplete
- ✅ **Smaller bundles**: Better tree-shaking

### Prisma 7.0.0-beta (Beta)

- ✅ **TypedSQL**: Write raw SQL with full type safety
- ✅ **Improved performance**: 30% faster queries
- ✅ **Better migrations**: Smarter migration generation
- ✅ **Enhanced types**: Better TypeScript integration
- ⚠️ **Beta Status**: Stable enough for production, breaking changes possible
- 💡 **Alternative**: Use Prisma 6.x if you need 100% stability

### NestJS 11.0.x (Latest)

- ✅ **Improved DI**: Better dependency injection
- ✅ **Better performance**: 15% faster than v10
- ✅ **Full TypeScript 5.7**: Support for latest features
- ✅ **Enhanced decorators**: Better metadata handling

### Node.js 23.x (Latest)

- ✅ **Latest features**: Cutting edge JavaScript features
- ✅ **Better performance**: V8 engine improvements
- ✅ **Native TypeScript**: Experimental TypeScript support
- ⚠️ **Not LTS**: Use Node 22 LTS if you need long-term support
- 💡 **Alternative**: Node.js 22 LTS for production stability

### Shadcn Charts (Instead of Recharts)

- ✅ **Built-in**: Part of Shadcn/ui ecosystem
- ✅ **Consistent design**: Matches your dashboard template
- ✅ **Recharts wrapper**: Uses Recharts under the hood
- ✅ **Pre-styled**: Beautiful charts out of the box
- ✅ **Customizable**: Full Tailwind customization
- ✅ **Perfect for dashboards**: Designed for admin/dashboard UIs

### Biome (Instead of ESLint + Prettier)

- ✅ **100x faster**: Rust-based linter and formatter
- ✅ **All-in-one**: Linting + formatting in one tool
- ✅ **Zero config**: Works out of the box
- ✅ **Better errors**: More helpful error messages
- 💡 **Alternative**: Use ESLint + Prettier if you prefer traditional tools

---

## 📋 Version Compatibility Matrix

| Frontend        | Backend        | Database      | Package Manager | Compatible? |
| --------------- | -------------- | ------------- | --------------- | ----------- |
| Next.js 16 RC   | NestJS 11      | PostgreSQL 17 | npm 10.x        | ✅ Yes      |
| React 19        | Node.js 23     | Prisma 7 Beta | -               | ✅ Yes      |
| TypeScript 5.7  | TypeScript 5.7 | -             | -               | ✅ Yes      |
| TailwindCSS 4.0 | -              | -             | -               | ✅ Yes      |

---

## 🚀 Installation Commands (npm-based)

### Frontend Setup

```bash
# Create Next.js 16 app with npm
npx create-next-app@rc frontend --typescript --tailwind --app --turbopack --src-dir --import-alias "@/*"

cd frontend

# Install dependencies with npm
npm install zod react-hook-form @hookform/resolvers
npm install zustand @tanstack/react-query
npm install date-fns
npm install next-auth@beta
npm install axios

# Install Shadcn/ui
npx shadcn@latest init

# Add Shadcn Chart components
npx shadcn@latest add chart

# Add other Shadcn components
npx shadcn@latest add button card input table select dialog dropdown-menu tabs toast form calendar checkbox progress

# Dev dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @biomejs/biome
```

### Backend Setup

```bash
# Install NestJS CLI globally with npm
npm install -g @nestjs/cli

# Create NestJS app
nest new backend --package-manager npm

cd backend

# Install dependencies with npm
npm install @nestjs/config @nestjs/swagger
npm install @prisma/client@beta
npm install @nestjs/passport passport passport-jwt
npm install @nestjs/jwt bcrypt
npm install class-validator class-transformer

# Dev dependencies
npm install -D prisma@beta
npm install -D @types/passport-jwt @types/bcrypt
npm install -D @nestjs/testing
npm install -D @biomejs/biome

# Initialize Prisma 7
npx prisma@beta init
```

### Biome Setup (Linter & Formatter)

```bash
# Initialize Biome
npx @biomejs/biome init

# This creates biome.json with default config
```

---

## 📊 Performance Benchmarks

### Build Time

| Tool                       | Time    | Improvement       |
| -------------------------- | ------- | ----------------- |
| Webpack (Next.js 14)       | ~45s    | Baseline          |
| Turbopack (Next.js 15)     | ~8s     | 5.6x faster       |
| **Turbopack (Next.js 16)** | **~4s** | **11x faster** 🏆 |

### Linting & Formatting

| Tool              | Time       | Notes              |
| ----------------- | ---------- | ------------------ |
| ESLint + Prettier | ~8s        | Baseline           |
| **Biome**         | **~0.08s** | **100x faster** 🏆 |

### Bundle Size

| Framework             | Size       | Notes                        |
| --------------------- | ---------- | ---------------------------- |
| Next.js 16 + React 19 | ~82 KB     | Gzipped, with React Compiler |
| TailwindCSS 4         | ~8 KB      | Purged                       |
| **Total**             | **~90 KB** | First load                   |

---

## 🔄 Migration Guides

### Next.js 15 → 16

```bash
# Update Next.js to RC
npm install next@rc react@latest react-dom@latest

# Update config (next.config.ts)
# Enable React Compiler
const nextConfig = {
  experimental: {
    reactCompiler: true, // Auto-memoization
  },
}
```

### Prisma 6 → 7 (Beta)

```bash
# Update to Prisma 7 beta
npm install prisma@beta @prisma/client@beta

# Generate client
npx prisma@beta generate

# Run migrations
npx prisma@beta migrate dev
```

### ESLint + Prettier → Biome

```bash
# Remove old tools
npm uninstall eslint prettier

# Install Biome
npm install -D @biomejs/biome

# Initialize
npx @biomejs/biome init

# Update package.json scripts
{
  "scripts": {
    "lint": "biome check .",
    "format": "biome format --write ."
  }
}
```

---

## ⚠️ Important Notes

### Recommended Versions (Our Choice)

1. ✅ **Next.js 16 RC** - Very stable RC, production-ready
2. ✅ **React 19** - Stable, production-ready
3. ✅ **TypeScript 5.7** - Stable
4. ✅ **TailwindCSS 4.0** - Stable
5. ✅ **npm 10.x** - Built-in, universal
6. ✅ **NestJS 11** - Stable
7. ✅ **PostgreSQL 17** - Stable
8. ✅ **Shadcn Charts** - Stable, perfect for dashboards
9. ✅ **Biome** - Stable, much faster than ESLint

### Use with Caution (Beta/Latest)

1. ⚠️ **Prisma 7 Beta** - Beta, but stable enough for production
   - **Alternative**: Use Prisma 6.x if you want 100% stability
2. ⚠️ **Node.js 23** - Latest but not LTS
   - **Alternative**: Use Node.js 22 LTS for long-term support

### What NOT to use

1. ❌ **Experimental features** - Wait for stable
2. ❌ **Alpha versions** - Too unstable

---

## 🎨 Shadcn Charts Components

### Available Chart Types

```bash
# Add all chart components
npx shadcn@latest add chart

# This adds:
# - Area Chart
# - Bar Chart
# - Line Chart
# - Pie Chart
# - Radar Chart
# - Radial Chart
```

### Example Usage (Budget Chart)

```tsx
import { BarChart } from "@/components/ui/chart";

const chartData = [
  { month: "January", income: 6430000, expenses: 4200000, savings: 2230000 },
  { month: "February", income: 6430000, expenses: 4500000, savings: 1930000 },
  { month: "March", income: 6430000, expenses: 4100000, savings: 2330000 },
];

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))", // Green
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))", // Orange
  },
  savings: {
    label: "Savings",
    color: "hsl(var(--chart-3))", // Blue
  },
};

export function BudgetChart() {
  return (
    <BarChart data={chartData} config={chartConfig} className="h-[300px]" />
  );
}
```

### Example Usage (Category Pie Chart)

```tsx
import { PieChart } from "@/components/ui/chart";

const chartData = [
  { category: "Needs", value: 3215000, fill: "hsl(var(--chart-1))" },
  { category: "Wants", value: 1929000, fill: "hsl(var(--chart-2))" },
  { category: "Savings", value: 1286000, fill: "hsl(var(--chart-3))" },
];

export function CategoryPieChart() {
  return <PieChart data={chartData} className="h-[300px]" />;
}
```

---

## 📁 Project Structure (npm + Next.js 16)

```
home-sweet-loan/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── setup/
│   │   │   │   ├── budgeting/
│   │   │   │   ├── summary/
│   │   │   │   ├── spending/
│   │   │   │   ├── report/
│   │   │   │   └── assets/
│   │   │   ├── api/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/          # Shadcn components + charts
│   │   │   ├── forms/
│   │   │   ├── charts/
│   │   │   ├── layout/
│   │   │   └── shared/
│   │   ├── lib/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── types/
│   │   └── styles/
│   ├── public/
│   ├── biome.json           # Biome config
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package-lock.json    # npm lockfile
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── setup/
│   │   │   ├── budgets/
│   │   │   ├── spending/
│   │   │   ├── reports/
│   │   │   └── assets/
│   │   ├── common/
│   │   ├── config/
│   │   ├── database/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma    # Prisma 7 schema
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── test/
│   ├── biome.json
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── package-lock.json
│   └── package.json
│
└── documentation/
    ├── INDEX.md
    ├── README.md
    ├── PRD.md
    ├── MVP.md
    ├── TECHNICAL_SPEC.md
    ├── SETUP_GUIDE.md
    ├── DESIGN_SYSTEM.md
    ├── USER_GUIDE.md
    ├── API.md
    ├── ROADMAP.md
    └── TECH_STACK.md
```

---

## 🔐 Security Considerations

### npm Security

```bash
# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

### Recommended Security Packages

```bash
npm install helmet  # Security headers
npm install express-rate-limit  # Rate limiting
npm install @nestjs/throttler  # NestJS rate limiting
```

---

## 📚 Official Documentation Links

- [Next.js 16 RC](https://nextjs.org/blog/next-16-rc)
- [React 19](https://react.dev/blog/2024/12/05/react-19)
- [TypeScript 5.7](https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/)
- [TailwindCSS 4](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [Prisma 7 Beta](https://www.prisma.io/blog/prisma-7-beta)
- [NestJS 11](https://docs.nestjs.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Shadcn Charts](https://ui.shadcn.com/docs/components/chart)
- [Biome](https://biomejs.dev)
- [npm](https://docs.npmjs.com)

---

## 🎯 Recommended Approach

### For Production (Maximum Stability)

```
Next.js 16 RC + React 19 + npm + Prisma 6 + Node 22 LTS
+ Shadcn Charts + ESLint/Prettier
```

### For Modern Stack (Balanced)

```
Next.js 16 RC + React 19 + npm + Prisma 7 Beta + Node 23
+ Shadcn Charts + Biome
```

### Our Choice (Latest Features)

```
Next.js 16 RC + React 19 + npm + Prisma 7 Beta + Node 23
+ Shadcn Charts + Biome
```

**Rationale**:

- Next.js 16 RC is very stable (RC = Release Candidate)
- React 19 is stable and production-ready
- Prisma 7 Beta is stable enough, huge performance gains
- Node.js 23 has latest features (use 22 LTS if you prefer stability)
- npm is universal and built-in
- Shadcn Charts perfect for dashboard template
- Biome is stable and 100x faster than ESLint

---

## 🚀 Quick Start (Complete Setup)

```bash
# Frontend
npx create-next-app@rc frontend --typescript --tailwind --app --turbopack --src-dir
cd frontend
npm install zod react-hook-form @hookform/resolvers zustand @tanstack/react-query next-auth@beta
npx shadcn@latest init
npx shadcn@latest add chart button card input table
npm install -D @biomejs/biome
npx @biomejs/biome init

# Backend
cd ..
npm install -g @nestjs/cli
nest new backend --package-manager npm
cd backend
npm install @prisma/client@beta @nestjs/config @nestjs/swagger @nestjs/passport passport-jwt
npm install -D prisma@beta @biomejs/biome
npx prisma@beta init
npx @biomejs/biome init

# Start development
# Terminal 1 (Frontend)
cd frontend
npm run dev

# Terminal 2 (Backend)
cd backend
npm run start:dev
```

---

**Last Updated**: 10 January 2026  
**Next Review**: Monthly  
**Status**: Latest Stable + Cutting Edge 🚀

---

**Note**: This stack uses latest stable versions with some cutting-edge features (Next.js 16 RC, Prisma 7 Beta). All choices are production-ready or very close to it.
