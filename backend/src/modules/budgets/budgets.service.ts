import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, year?: number, month?: number) {
    const where: any = { userId };

    if (year && month) {
      const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;
      where.yearMonth = yearMonth;
    }

    return this.prisma.budget.findMany({
      where,
      orderBy: { yearMonth: 'desc' },
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
    const totalSavings = Object.values(savingsAllocation).reduce((sum, val) => sum + Number(val), 0);
    const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + Number(val), 0);

    const allocatedPercentage = totalIncome > 0 ? ((totalSavings + totalExpenses) / totalIncome) * 100 : 0;
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
    return this.prisma.budget.create({
      data: {
        userId,
        ...createBudgetDto,
      },
    });
  }

  async update(userId: string, yearMonth: string, updateBudgetDto: UpdateBudgetDto) {
    return this.prisma.budget.update({
      where: {
        userId_yearMonth: {
          userId,
          yearMonth,
        },
      },
      data: updateBudgetDto,
    });
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
