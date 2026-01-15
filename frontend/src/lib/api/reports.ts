import api from "@/lib/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface MonthlyReport {
  income: number;
  expenses: number;
  savings: number;
  remainingBudget: number;
  topExpenses: { category: string; amount: number }[];
  dailySpending: { date: string; amount: number }[];
}

export interface DashboardSummary {
  totalWealth: number;
  monthlySpending: number;
  monthlyIncome: number;
  budgetStatus: number; // Percentage
}

/**
 * Get monthly analytics report
 */
export const getMonthlyReport = async (
  year: number,
  month: number
): Promise<MonthlyReport> => {
  const response = await api.get("/reports/monthly", {
    params: { year, month },
  });
  return response.data.data;
};

/**
 * Get dashboard summary statistics
 */
export const getSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get("/reports/summary");
  return response.data.data;
};
