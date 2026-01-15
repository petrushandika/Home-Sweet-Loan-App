/**
 * Budgets API Service
 * Handles all API calls related to budget management
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface BudgetSummary {
  totalIncome: number;
  totalSavings: number;
  totalExpenses: number;
  allocatedPercentage: number;
  nonAllocated: number;
}

export interface Budget {
  id: string;
  userId: string;
  yearMonth: string;
  income: Record<string, number>;
  savingsAllocation: Record<string, number>;
  expenses: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  summary?: BudgetSummary;
}

export interface CreateBudgetRequest {
  yearMonth: string;
  income?: Record<string, number>;
  savingsAllocation?: Record<string, number>;
  expenses?: Record<string, number>;
}

export interface UpdateBudgetRequest {
  income?: Record<string, number>;
  savingsAllocation?: Record<string, number>;
  expenses?: Record<string, number>;
}

import api from "@/lib/api";
import { getAuthToken } from "./setup";

/**
 * Get all budgets for the user
 */
export const getBudgets = async (
  year?: number,
  month?: number
): Promise<Budget[]> => {
  const response = await api.get("/budgets", {
    params: { year, month },
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return response.data.data;
};

/**
 * Get a specific budget by yearMonth (e.g., "2024-01")
 */
export const getBudget = async (yearMonth: string): Promise<Budget | null> => {
  try {
    const response = await api.get(`/budgets/${yearMonth}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

/**
 * Create a new budget
 */
export const createBudget = async (
  budgetData: CreateBudgetRequest
): Promise<Budget> => {
  const response = await api.post("/budgets", budgetData, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return response.data.data;
};

/**
 * Update an existing budget
 */
export const updateBudget = async (
  yearMonth: string,
  budgetData: UpdateBudgetRequest
): Promise<Budget> => {
  const response = await api.put(`/budgets/${yearMonth}`, budgetData, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return response.data.data;
};

/**
 * Delete a budget
 */
export const deleteBudget = async (yearMonth: string): Promise<void> => {
  await api.delete(`/budgets/${yearMonth}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};
