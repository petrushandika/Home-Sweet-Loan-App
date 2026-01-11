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
}
