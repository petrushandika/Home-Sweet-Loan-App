# 🏠 Home Sweet Loan App

> Personal Finance Management Application - Inspired by "Home Sweet Loan" Movie

## 📋 Overview

**Home Sweet Loan App** adalah aplikasi manajemen keuangan pribadi yang terinspirasi dari film "Home Sweet Loan". Aplikasi ini dirancang untuk membantu pengguna mengelola budget bulanan, melacak pengeluaran, memantau aset, dan membuat laporan keuangan secara otomatis.

## 🎯 Problem Statement

Banyak orang kesulitan dalam:

- Mengatur budget bulanan dengan terstruktur
- Melacak pengeluaran harian secara konsisten
- Memahami alokasi keuangan mereka (Needs, Wants, Savings)
- Memantau progress aset dan target keuangan
- Mendapatkan insight dari data keuangan mereka

## 💡 Solution

Aplikasi ini menyediakan platform yang user-friendly untuk:

- Setup konfigurasi keuangan personal (accounts, income sources, categories)
- Membuat budget bulanan dengan alokasi yang jelas
- Tracking pengeluaran real-time dengan kategorisasi
- Dashboard summary dengan visualisasi data (charts)
- Laporan bulanan dengan progress tracking
- Manajemen aset (liquid & non-liquid)

## ✨ Key Features

### 1. **Setup & Configuration**

- Konfigurasi akun bank/e-wallet (BCA, Gopay, Permata, dll)
- Setup sumber pendapatan (Monthly Salary, Bonus, dll)
- Kategorisasi pengeluaran (Needs, Wants, Savings)
- Setup akun aset
- Konfigurasi tanggal gajian

### 2. **Monthly Budgeting**

- Input budget untuk setiap bulan (January - December)
- Alokasi budget per kategori income sources
- Alokasi savings list
- Alokasi budgeting list (expenses)
- Kalkulasi otomatis allocated money & non-allocated money
- Visualisasi persentase penggunaan budget

### 3. **Summary Dashboard**

- Informasi tanggal dan countdown next payday
- Filter berdasarkan bulan
- Overview per akun bank
- Breakdown per kategori (Needs, Wants, Savings)
- Total income, non-allocated, usage percentage
- Tabel detail alokasi per expense
- Stacked bar chart untuk distribusi budget
- Pie chart untuk category breakdown

### 4. **Spending Tracker**

- Input pengeluaran harian dengan:
  - Checkbox untuk mark as done
  - Date picker
  - Description
  - Category dropdown (dari budgeting list)
  - Amount
- List semua pengeluaran dengan filter
- Edit dan delete spending entries

### 5. **Report & Analytics**

- Money Management Dashboard
- Filter berdasarkan year dan month
- 4 Card metrics:
  - Total Income
  - Budgeted Expenses
  - Total Spending
  - Monthly Savings
- Tabel perbandingan:
  - Expense List
  - Allocation (dari budget)
  - Realization (dari spending)
  - Budget Usage Progress (progress bar)
  - Percentage Usage
- Visualisasi trend pengeluaran

### 6. **Assets Management**

- Header info: Last Update, Target, Progress
- Total Assets Value
- Liquid Assets tracking:
  - Description
  - Value
  - Account
- Non-Liquid Assets tracking:
  - Description
  - Value
  - Account
- Yearly Summary Table (12 months)
- Bar chart untuk visualisasi aset tahunan

## 🎨 Design Principles

### User Experience

- **Intuitive Navigation**: Sidebar navigation untuk akses cepat ke semua fitur
- **Progressive Disclosure**: User setup dulu, baru bisa menggunakan fitur lain
- **Visual Feedback**: Charts dan progress bars untuk insight cepat
- **Responsive Design**: Optimal di desktop dan mobile

### Visual Design

- **Modern & Premium**: Gradient colors, glassmorphism effects
- **Color Coding**:
  - Income/Liquid Assets: Green tones
  - Needs: Orange/Yellow tones
  - Wants: Pink/Purple tones
  - Savings: Blue/Teal tones
- **Typography**: Clean, readable fonts (Inter, Roboto)
- **Micro-interactions**: Smooth transitions dan hover effects

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Presentation Layer                   │
│  ┌──────────┬──────────┬──────────┬──────────┬────────┐ │
│  │  Setup   │Budgeting │ Summary  │ Spending │ Report │ │
│  │   Page   │   Page   │   Page   │   Page   │  Page  │ │
│  └──────────┴──────────┴──────────┴──────────┴────────┘ │
│  ┌────────────────────────────────────────────────────┐  │
│  │              Assets Page                           │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Business Logic Layer                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Budget Calculator │ Spending Aggregator           │ │
│  │  Asset Calculator  │ Report Generator              │ │
│  │  Date Calculator   │ Percentage Calculator         │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      Data Layer                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Setup Data    │ Budget Data   │ Spending Data    │ │
│  │  Assets Data   │ User Preferences                  │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Storage (LocalStorage / Database)          │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 📊 Data Models

### Setup Data

```javascript
{
  accountSummary: ["BCA", "Gopay", "Permata"],
  incomeSources: ["Monthly Salary", "Monthly Intensive", "Bonus"],
  needs: ["Home Rent", "Course", "Lecture", "Utilities"],
  wants: ["Shopping", "Entertainment", "Gifts"],
  savings: ["General Savings", "Emergency Funds", "Deposits"],
  accountAssets: ["General Savings", "Bibit", "BPJS"],
  paydayDate: 5
}
```

### Budget Data

```javascript
{
  "2026-01": {
    income: {
      "Monthly Salary": 6430000,
      "Monthly Intensive": 0,
      "Bonus": 0
    },
    savings: {
      "General Savings": 0,
      "Emergency Funds": 0
    },
    expenses: {
      "Home Rent": 1700000,
      "Course": 150000,
      "Lecture": 500000
    }
  }
}
```

### Spending Data

```javascript
{
  id: "uuid",
  date: "2026-01-05",
  description: "Gasoline",
  category: "Transportation",
  amount: 100000,
  checked: false,
  createdAt: "2026-01-05T10:30:00"
}
```

### Assets Data

```javascript
{
  target: 100000000,
  lastUpdate: "2026-01-06",
  liquidAssets: [
    {
      id: "uuid",
      description: "Tabungan",
      value: 5000000,
      account: "General Savings"
    }
  ],
  nonLiquidAssets: [
    {
      id: "uuid",
      description: "Saldo BPJS",
      value: 2000000,
      account: "BPJS"
    }
  ]
}
```

## 🔄 User Flow

### First Time User

1. **Setup** → User mengisi konfigurasi awal (accounts, categories, payday date)
2. **Budgeting** → User membuat budget untuk bulan pertama
3. **Spending** → User mulai input pengeluaran harian
4. **Summary** → User melihat dashboard summary
5. **Report** → User melihat laporan bulanan
6. **Assets** → User input dan track aset

### Returning User

1. Login → Dashboard Summary (default page)
2. Quick access ke Spending untuk input pengeluaran
3. Monthly review di Report page
4. Update budget di Budgeting page
5. Track assets di Assets page

## 🎯 MVP Scope

### Phase 1 - Core Features (MVP)

- ✅ Setup & Configuration
- ✅ Monthly Budgeting
- ✅ Spending Tracker
- ✅ Basic Summary Dashboard
- ✅ LocalStorage persistence

### Phase 2 - Enhanced Features

- ✅ Report & Analytics
- ✅ Assets Management
- ✅ Charts & Visualizations
- ✅ Export to Excel/PDF

### Phase 3 - Advanced Features

- 🔲 Multi-user support (Authentication)
- 🔲 Cloud sync (Database integration)
- 🔲 Recurring transactions
- 🔲 Budget templates
- 🔲 Financial goals tracking
- 🔲 Notifications & reminders
- 🔲 Mobile app (React Native / Flutter)
- 🔲 Data export/import (Excel, CSV, PDF)
- 🔲 Budget sharing & collaboration
- 🔲 AI-powered insights & recommendations

## 🛠️ Recommended Tech Stack

### Full-Stack Architecture (Production-Ready)

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  - Next.js 16.0 RC (App Router + Turbopack)                 │
│  - React 19 + TypeScript 5.7                                 │
│  - TailwindCSS 4.0 (Native CSS, Rust-based)                  │
│  - Shadcn/ui + Shadcn Charts (Dashboard-ready)               │
│  - Zod 3.24 for schema validation                            │
│  - React Hook Form 7.54 for forms                            │
│  - Zustand 5.0 + TanStack Query 5.x                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│  - NestJS 11.0 + Node.js 23 (Latest)                         │
│  - TypeScript 5.7                                            │
│  - Prisma 7.0 Beta (TypedSQL, 30% faster)                    │
│  - PostgreSQL 17.x                                           │
│  - JWT + Passport for authentication                         │
│  - Class-validator 0.14 + Class-transformer 0.5              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Deployment                             │
│  - Frontend: Vercel (Edge Runtime)                           │
│  - Backend: Railway / Render                                 │
│  - Database: Neon (Serverless PostgreSQL 17)                 │
│  - Package Manager: npm 10.x                                 │
│  - Linter: Biome (100x faster than ESLint)                   │
└─────────────────────────────────────────────────────────────┘
```

### Why This Stack?

#### Next.js 15 + TypeScript

- ✅ **SEO-friendly**: Server-side rendering & static generation
- ✅ **Type-safe**: TypeScript untuk mengurangi bugs
- ✅ **Fast**: Automatic code splitting & optimization
- ✅ **Developer Experience**: Hot reload, great tooling
- ✅ **API Routes**: Built-in backend capabilities

#### TailwindCSS

- ✅ **Utility-first**: Rapid UI development
- ✅ **Customizable**: Easy theming & design system
- ✅ **Performance**: Purge unused CSS automatically
- ✅ **Responsive**: Mobile-first approach

#### Shadcn/ui

- ✅ **Accessible**: WCAG compliant components
- ✅ **Customizable**: Copy-paste, not npm install
- ✅ **Beautiful**: Modern, clean design
- ✅ **Type-safe**: Full TypeScript support

#### Zod

- ✅ **Schema validation**: Type-safe validation
- ✅ **Runtime safety**: Catch errors early
- ✅ **Integration**: Works with React Hook Form
- ✅ **TypeScript inference**: Automatic type generation

#### NestJS

- ✅ **Scalable**: Modular architecture
- ✅ **TypeScript-first**: Built with TypeScript
- ✅ **Dependency Injection**: Clean, testable code
- ✅ **Documentation**: Auto-generate API docs with Swagger

#### Prisma ORM

- ✅ **Type-safe**: Auto-generated types from schema
- ✅ **Migrations**: Easy database versioning
- ✅ **Developer Experience**: Great tooling & IntelliSense
- ✅ **Performance**: Optimized queries

#### PostgreSQL

- ✅ **Reliable**: ACID compliance
- ✅ **Scalable**: Handle millions of records
- ✅ **Rich features**: JSON support, full-text search
- ✅ **Open-source**: No vendor lock-in

### Additional Recommendations

#### State Management

- **Zustand** (recommended) - Simple, lightweight
- **React Query** - For server state management
- **Jotai** - Atomic state management (alternative)

#### Form Handling

- **React Hook Form** + **Zod** - Best combination for type-safe forms

#### Charts & Visualization

- **Recharts** (recommended) - React-friendly, customizable
- **Chart.js** - Alternative, more features
- **Tremor** - Tailwind-based charts (modern option)

#### Authentication

- **NextAuth.js v5** - Easy integration with Next.js
- **Lucia** - Lightweight alternative
- **Clerk** - Managed auth (paid but great DX)

#### Testing

- **Vitest** - Fast unit testing
- **Playwright** - E2E testing
- **React Testing Library** - Component testing

#### Code Quality

- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Conventional commits

#### Monitoring & Analytics (Phase 2+)

- **Vercel Analytics** - Built-in for Next.js
- **Sentry** - Error tracking
- **PostHog** - Product analytics (open-source)

### Database Schema (for Phase 2+)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Setup Configuration
CREATE TABLE setup_config (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50), -- accountSummary, incomeSources, needs, wants, savings, accountAssets
  value VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Budgets
CREATE TABLE budgets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  month VARCHAR(7), -- YYYY-MM
  category_type VARCHAR(50), -- income, savings, expenses
  category_name VARCHAR(255),
  amount DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Spending
CREATE TABLE spending (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  date DATE,
  description TEXT,
  category VARCHAR(255),
  amount DECIMAL(15, 2),
  checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Assets
CREATE TABLE assets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50), -- liquid, non-liquid
  description TEXT,
  value DECIMAL(15, 2),
  account VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Settings
CREATE TABLE user_settings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  payday_date INTEGER,
  assets_target DECIMAL(15, 2),
  currency VARCHAR(10) DEFAULT 'IDR',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Large Desktop: 1440px+
```

## 🎨 Color Palette - Money Green Theme

### Design Philosophy

Warna hijau melambangkan **pertumbuhan, kesuksesan finansial, dan stabilitas**. Palette ini dirancang untuk:

- 💚 Memberikan rasa **tenang dan optimis**
- 📈 Memotivasi **konsistensi dalam budgeting**
- ✨ Menciptakan **visual yang fresh dan modern**
- 🎯 Meningkatkan **engagement dan retention**

### Primary Colors (Green Gradient)

```css
/* Main Brand Colors - Green Gradient */
--primary-gradient: linear-gradient(135deg, #10b981 0%, #059669 100%);
--primary-gradient-light: linear-gradient(135deg, #34d399 0%, #10b981 100%);
--primary-gradient-dark: linear-gradient(135deg, #059669 0%, #047857 100%);

/* Accent Gradient - Teal to Emerald */
--accent-gradient: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);

/* Success Gradient - Lime to Green */
--success-gradient: linear-gradient(135deg, #84cc16 0%, #65a30d 100%);

/* Primary Shades */
--green-50: #ecfdf5; /* Very light - backgrounds */
--green-100: #d1fae5; /* Light - hover states */
--green-200: #a7f3d0; /* Soft - borders */
--green-300: #6ee7b7; /* Medium light */
--green-400: #34d399; /* Medium */
--green-500: #10b981; /* Primary brand color */
--green-600: #059669; /* Primary dark */
--green-700: #047857; /* Dark - text */
--green-800: #065f46; /* Very dark */
--green-900: #064e3b; /* Darkest */

/* Teal Accent (for variety) */
--teal-400: #2dd4bf;
--teal-500: #14b8a6;
--teal-600: #0d9488;
--teal-700: #0f766e;
```

### Category Colors

```css
/* Income - Bright Green (positive, growth) */
--income-color: #10b981;
--income-gradient: linear-gradient(135deg, #34d399 0%, #10b981 100%);

/* Savings - Deep Green (stability, security) */
--savings-color: #059669;
--savings-gradient: linear-gradient(135deg, #10b981 0%, #047857 100%);

/* Needs - Amber (important, attention) */
--needs-color: #f59e0b;
--needs-gradient: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);

/* Wants - Purple (luxury, desire) */
--wants-color: #8b5cf6;
--wants-gradient: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);

/* Expenses - Orange (caution) */
--expenses-color: #f97316;
--expenses-gradient: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
```

### Semantic Colors

```css
/* Success - Green */
--success: #10b981;
--success-light: #d1fae5;
--success-dark: #047857;

/* Warning - Amber */
--warning: #f59e0b;
--warning-light: #fef3c7;
--warning-dark: #d97706;

/* Error - Red */
--error: #ef4444;
--error-light: #fee2e2;
--error-dark: #dc2626;

/* Info - Blue */
--info: #3b82f6;
--info-light: #dbeafe;
--info-dark: #2563eb;
```

### Neutral Colors (Gray Scale)

```css
/* Warm Gray - better for green theme */
--gray-50: #fafaf9;
--gray-100: #f5f5f4;
--gray-200: #e7e5e4;
--gray-300: #d6d3d1;
--gray-400: #a8a29e;
--gray-500: #78716c;
--gray-600: #57534e;
--gray-700: #44403c;
--gray-800: #292524;
--gray-900: #1c1917;
```

### Background & Surface Colors

```css
/* Light Mode */
--bg-primary: #ffffff;
--bg-secondary: #fafaf9;
--bg-tertiary: #f5f5f4;
--bg-green-subtle: #ecfdf5; /* Light green tint */

/* Dark Mode (optional Phase 2) */
--bg-dark-primary: #0f172a;
--bg-dark-secondary: #1e293b;
--bg-dark-tertiary: #334155;
--bg-dark-green-subtle: #064e3b;

/* Card Backgrounds */
--card-bg: #ffffff;
--card-bg-hover: #fafaf9;
--card-border: #e7e5e4;

/* Green-tinted backgrounds for special sections */
--bg-income: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
--bg-savings: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
```

### Text Colors

```css
/* Text Hierarchy */
--text-primary: #1c1917; /* Headings, important text */
--text-secondary: #44403c; /* Body text */
--text-tertiary: #78716c; /* Muted text */
--text-disabled: #a8a29e; /* Disabled state */

/* Text on colored backgrounds */
--text-on-green: #ffffff;
--text-on-green-light: #064e3b;
```

### Shadow & Effects

```css
/* Shadows with green tint */
--shadow-sm: 0 1px 2px 0 rgba(16, 185, 129, 0.05);
--shadow-md: 0 4px 6px -1px rgba(16, 185, 129, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(16, 185, 129, 0.15);
--shadow-xl: 0 20px 25px -5px rgba(16, 185, 129, 0.2);

/* Glow effects for interactive elements */
--glow-green: 0 0 20px rgba(16, 185, 129, 0.3);
--glow-green-strong: 0 0 30px rgba(16, 185, 129, 0.5);
```

### Usage Examples

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.4);
}

/* Income Card */
.income-card {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-left: 4px solid #10b981;
}

/* Savings Progress */
.savings-progress {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

/* Dashboard Card Hover */
.dashboard-card:hover {
  border-color: #10b981;
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.15);
  transform: translateY(-2px);
}
```

### Tailwind Config

```javascript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
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
    },
  },
};
```

## 📐 Component Library

### Core Components

- **Button** (Primary, Secondary, Icon, Danger)
- **Input** (Text, Number, Date, Select, Textarea)
- **Card** (Default, Elevated, Outlined)
- **Table** (Sortable, Filterable)
- **Modal** (Confirmation, Form)
- **Chart** (Bar, Pie, Line, Stacked Bar)
- **Progress Bar**
- **Dropdown**
- **Checkbox**
- **Badge**
- **Toast/Notification**

## 🔐 Security Considerations

### Data Privacy

- Sensitive financial data harus dienkripsi
- Implement proper authentication & authorization
- HTTPS only untuk production
- Regular security audits

### Best Practices

- Input validation & sanitization
- XSS protection
- CSRF protection
- Rate limiting untuk API
- Secure password hashing (bcrypt)
- JWT token expiration

## 📈 Performance Optimization

### Frontend

- Code splitting & lazy loading
- Image optimization
- Minimize bundle size
- Use CDN for static assets
- Implement caching strategies
- Debounce/throttle expensive operations

### Backend

- Database indexing
- Query optimization
- Caching (Redis)
- Pagination for large datasets
- Background jobs for heavy operations

## 🧪 Testing Strategy

### Unit Tests

- Business logic functions
- Calculation utilities
- Data transformations

### Integration Tests

- API endpoints
- Database operations
- Authentication flow

### E2E Tests

- Critical user flows
- Budget creation flow
- Spending tracking flow
- Report generation

## 📦 Deployment

### Frontend Deployment Options

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **GitHub Pages** (for static sites)
- **AWS S3 + CloudFront**

### Backend Deployment Options

- **Vercel** (Serverless functions)
- **Railway**
- **Render**
- **AWS EC2/ECS**
- **DigitalOcean**

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 18.x
npm or yarn or pnpm
Git
```

### Installation (Example for Next.js)

```bash
# Clone repository
git clone https://github.com/yourusername/home-sweet-loan-app.git

# Navigate to project
cd home-sweet-loan-app

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## 📝 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/homesweet"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# API Keys (if needed)
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines first.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👥 Team

- **Product Owner**: [Your Name]
- **Developer**: [Your Name]
- **Designer**: [Your Name]

## 📞 Support

For support, email support@homesweetloan.com or join our Slack channel.

---

**Made with ❤️ for better financial management**
