import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@homesweetloan.com' },
    update: {},
    create: {
      email: 'demo@homesweetloan.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create setup config
  const setupConfig = await prisma.setupConfig.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      accountSummary: ['BCA', 'Gopay', 'Permata', 'Mandiri'],
      incomeSources: ['Monthly Salary', 'Monthly Intensive', 'Bonus'],
      needs: ['Home Rent', 'Course', 'Lecture', 'Utilities', 'Transportation', 'Groceries'],
      wants: ['Shopping', 'Entertainment', 'Dining Out', 'Hobbies'],
      savings: ['General Savings', 'Emergency Funds', 'Deposits', 'Investment'],
      accountAssets: ['General Savings', 'Bibit', 'BPJS', 'Stocks'],
      paydayDate: 5,
    },
  });

  console.log('✅ Created setup config');

  // Create budget for January 2026
  const budget = await prisma.budget.upsert({
    where: {
      userId_yearMonth: {
        userId: user.id,
        yearMonth: '2026-01',
      },
    },
    update: {},
    create: {
      userId: user.id,
      yearMonth: '2026-01',
      income: {
        'Monthly Salary': 6430000,
        'Monthly Intensive': 0,
        'Bonus': 0,
      },
      savingsAllocation: {
        'General Savings': 1000000,
        'Emergency Funds': 500000,
        'Deposits': 300000,
      },
      expenses: {
        'Home Rent': 1700000,
        'Course': 150000,
        'Lecture': 500000,
        'Utilities': 300000,
        'Transportation': 400000,
        'Groceries': 800000,
        'Shopping': 200000,
        'Entertainment': 150000,
      },
    },
  });

  console.log('✅ Created budget for 2026-01');

  // Create some spending entries
  const spendingEntries = [
    {
      userId: user.id,
      date: new Date('2026-01-05'),
      description: 'Gasoline',
      category: 'Transportation',
      amount: 100000,
      checked: true,
    },
    {
      userId: user.id,
      date: new Date('2026-01-06'),
      description: 'Grocery Shopping',
      category: 'Groceries',
      amount: 250000,
      checked: true,
    },
    {
      userId: user.id,
      date: new Date('2026-01-07'),
      description: 'Electricity Bill',
      category: 'Utilities',
      amount: 150000,
      checked: false,
    },
    {
      userId: user.id,
      date: new Date('2026-01-08'),
      description: 'Restaurant Dinner',
      category: 'Dining Out',
      amount: 200000,
      checked: false,
    },
    {
      userId: user.id,
      date: new Date('2026-01-09'),
      description: 'Online Course',
      category: 'Course',
      amount: 150000,
      checked: true,
    },
  ];

  for (const entry of spendingEntries) {
    await prisma.spending.create({
      data: entry,
    });
  }

  console.log(`✅ Created ${spendingEntries.length} spending entries`);

  // Create assets
  const liquidAssets = [
    {
      userId: user.id,
      type: 'LIQUID' as const,
      description: 'BCA Savings Account',
      value: 5000000,
      account: 'General Savings',
    },
    {
      userId: user.id,
      type: 'LIQUID' as const,
      description: 'Gopay Balance',
      value: 500000,
      account: 'General Savings',
    },
    {
      userId: user.id,
      type: 'LIQUID' as const,
      description: 'Bibit Investment',
      value: 3000000,
      account: 'Bibit',
    },
  ];

  const nonLiquidAssets = [
    {
      userId: user.id,
      type: 'NON_LIQUID' as const,
      description: 'BPJS Balance',
      value: 2000000,
      account: 'BPJS',
    },
    {
      userId: user.id,
      type: 'NON_LIQUID' as const,
      description: 'Stock Portfolio',
      value: 10000000,
      account: 'Stocks',
    },
  ];

  for (const asset of [...liquidAssets, ...nonLiquidAssets]) {
    await prisma.asset.create({
      data: asset,
    });
  }

  console.log(`✅ Created ${liquidAssets.length + nonLiquidAssets.length} assets`);

  // Create user settings
  const userSettings = await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      assetsTarget: 100000000, // 100 million
      currency: 'IDR',
      preferences: {
        theme: 'light',
        language: 'id',
        notifications: true,
      },
    },
  });

  console.log('✅ Created user settings');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: 1`);
  console.log(`   - Setup Configs: 1`);
  console.log(`   - Budgets: 1`);
  console.log(`   - Spending Entries: ${spendingEntries.length}`);
  console.log(`   - Assets: ${liquidAssets.length + nonLiquidAssets.length}`);
  console.log(`   - User Settings: 1`);
  console.log('\n🔐 Demo Credentials:');
  console.log(`   Email: demo@homesweetloan.com`);
  console.log(`   Password: password123`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
