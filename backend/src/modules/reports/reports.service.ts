import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getMonthlyReport(userId: string, year: number, month: number) {
    const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;

    const budget = await this.prisma.budget.findUnique({
      where: {
        userId_yearMonth: {
          userId,
          yearMonth,
        },
      },
    });

    if (!budget) {
      return null;
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const spending = await this.prisma.spending.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const income = budget.income as Record<string, number>;
    const savingsAllocation = budget.savingsAllocation as Record<string, number>;
    const expenses = budget.expenses as Record<string, number>;

    const totalIncome = Object.values(income).reduce((sum, val) => sum + Number(val), 0);
    const totalSavings = Object.values(savingsAllocation).reduce((sum, val) => sum + Number(val), 0);
    const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + Number(val), 0);

    const totalSpending = spending.reduce((sum, s) => sum + Number(s.amount), 0);
    const monthlySavings = totalIncome - totalSpending;

    const comparison = Object.keys(expenses).map((category) => {
      const allocation = Number(expenses[category]);
      const realization = spending
        .filter((s) => s.category === category)
        .reduce((sum, s) => sum + Number(s.amount), 0);

      const percentage = allocation > 0 ? (realization / allocation) * 100 : 0;
      const status = percentage <= 80 ? 'ok' : percentage <= 100 ? 'warning' : 'over';

      return {
        category,
        allocation,
        realization,
        percentage: Math.round(percentage * 100) / 100,
        status,
      };
    });

    return {
      year,
      month,
      budget: {
        totalIncome,
        totalSavings,
        totalExpenses,
      },
      actual: {
        totalSpending,
        monthlySavings,
      },
      comparison,
    };
  }

  async getSummary(userId: string) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const yearMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

    // Get current budget
    const budget = await this.prisma.budget.findUnique({
      where: {
        userId_yearMonth: { userId, yearMonth },
      },
    });

    const income = budget ? (budget.income as Record<string, number>) : {};
    const totalIncome = Object.values(income).reduce((sum, val) => sum + Number(val), 0);

    // Get current spending
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);
    const spending = await this.prisma.spending.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
    });
    const totalSpending = spending.reduce((sum, s) => sum + Number(s.amount), 0);

    // Get assets
    const assets = await this.prisma.asset.findMany({ where: { userId } });
    const netWorth = assets.reduce((sum, a) => sum + Number(a.value), 0);
    const liquidAssets = assets
      .filter((a) => a.type === 'LIQUID')
      .reduce((sum, a) => sum + Number(a.value), 0);
    const nonLiquidAssets = assets
      .filter((a) => a.type === 'NON_LIQUID')
      .reduce((sum, a) => sum + Number(a.value), 0);

    // Get user settings (target)
    const settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    // Get payday date
    const setup = await this.prisma.setupConfig.findUnique({
      where: { userId },
      select: { paydayDate: true },
    });

    // Get last 5 transactions
    const transactions = await this.prisma.spending.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    });

    // Get last 6 months cashflow
    const cashflow = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1 - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const ym = `${y}-${m.toString().padStart(2, '0')}`;

      const b = await this.prisma.budget.findUnique({
        where: { userId_yearMonth: { userId, yearMonth: ym } },
      });

      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0);
      const s = await this.prisma.spending.aggregate({
        where: { userId, date: { gte: start, lte: end } },
        _sum: { amount: true },
      });

      const monIncome = b ? Object.values(b.income as Record<string, number>).reduce((sum, val) => sum + Number(val), 0) : 0;
      const monExpenses = s._sum.amount ? Number(s._sum.amount) : 0;

      cashflow.push({
        month: d.toLocaleString('default', { month: 'short' }),
        income: monIncome,
        expenses: monExpenses,
      });
    }

    return {
      income: totalIncome,
      spending: totalSpending,
      savings: liquidAssets,
      nonLiquidAssets,
      netWorth,
      paydayDate: setup?.paydayDate || 1,
      savingsTarget: settings?.assetsTarget || 0,
      recentTransactions: transactions,
      cashflow,
    };
  }
}
