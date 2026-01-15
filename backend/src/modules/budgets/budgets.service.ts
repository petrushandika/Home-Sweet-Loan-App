import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BudgetsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async findAll(userId: string, year?: number, month?: number) {
    const where: any = { userId };

    if (year && month) {
      const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;
      where.yearMonth = yearMonth;
    }

    const budgets = await this.prisma.budget.findMany({
      where,
      orderBy: { yearMonth: 'desc' },
    });

    return budgets.map((budget) => {
      const income = (budget.income || {}) as Record<string, number>;
      const savingsAllocation = (budget.savingsAllocation || {}) as Record<string, number>;
      const expenses = (budget.expenses || {}) as Record<string, number>;

      const totalIncome = Object.values(income).reduce((sum, val) => sum + Number(val), 0);
      const totalSavings = Object.values(savingsAllocation).reduce(
        (sum, val) => sum + Number(val),
        0,
      );
      const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + Number(val), 0);

      const allocatedPercentage =
        totalIncome > 0 ? ((totalSavings + totalExpenses) / totalIncome) * 100 : 0;
      const nonAllocated = totalIncome - totalSavings - totalExpenses;

      return {
        ...budget,
        summary: {
          totalIncome,
          totalSavings,
          totalExpenses,
          allocatedPercentage: Math.round(allocatedPercentage * 100) / 100,
          nonAllocated,
        },
      };
    });
  }

  async findOne(userId: string, yearMonth: string) {
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

    const income = budget.income as Record<string, number>;
    const savingsAllocation = budget.savingsAllocation as Record<string, number>;
    const expenses = budget.expenses as Record<string, number>;

    const totalIncome = Object.values(income).reduce((sum, val) => sum + Number(val), 0);
    const totalSavings = Object.values(savingsAllocation).reduce(
      (sum, val) => sum + Number(val),
      0,
    );
    const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + Number(val), 0);

    const allocatedPercentage =
      totalIncome > 0 ? ((totalSavings + totalExpenses) / totalIncome) * 100 : 0;
    const nonAllocated = totalIncome - totalSavings - totalExpenses;

    return {
      ...budget,
      summary: {
        totalIncome,
        totalSavings,
        totalExpenses,
        allocatedPercentage: Math.round(allocatedPercentage * 100) / 100,
        nonAllocated,
      },
    };
  }

  async create(userId: string, createBudgetDto: CreateBudgetDto) {
    const budget = await this.prisma.budget.create({
      data: {
        userId,
        ...createBudgetDto,
      },
    });

    // Log Activity
    await this.notifications.create(
      userId,
      'Budget Created',
      `Created budget plan for ${createBudgetDto.yearMonth}`,
      'BUDGET',
      { yearMonth: createBudgetDto.yearMonth },
    );

    return budget;
  }

  async update(userId: string, yearMonth: string, updateBudgetDto: UpdateBudgetDto) {
    const updated = await this.prisma.budget.update({
      where: {
        userId_yearMonth: {
          userId,
          yearMonth,
        },
      },
      data: updateBudgetDto,
    });

    // Log Activity based on what was updated
    let activityTitle = 'Budget Updated';
    let activityMsg = `Updated budget for ${yearMonth}`;

    if (updateBudgetDto.income && Object.keys(updateBudgetDto.income).length > 0) {
      activityTitle = 'Income Updated';
      activityMsg = `Updated income sources for ${yearMonth}`;
    } else if (updateBudgetDto.expenses && Object.keys(updateBudgetDto.expenses).length > 0) {
      activityTitle = 'Budget Allocation';
      activityMsg = `Updated expense allocations for ${yearMonth}`;
    } else if (
      updateBudgetDto.savingsAllocation &&
      Object.keys(updateBudgetDto.savingsAllocation).length > 0
    ) {
      activityTitle = 'Savings Updated';
      activityMsg = `Updated savings plan for ${yearMonth}`;
    }

    await this.notifications.create(userId, activityTitle, activityMsg, 'BUDGET', {
      yearMonth,
      update: updateBudgetDto,
    });

    return updated;
  }

  async remove(userId: string, yearMonth: string) {
    return this.prisma.budget.delete({
      where: {
        userId_yearMonth: {
          userId,
          yearMonth,
        },
      },
    });
  }
}
