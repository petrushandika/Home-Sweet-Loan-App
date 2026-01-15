/**
 * Spending API Service
 * Handles all API calls related to spending transactions
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface Spending {
  id: string;
  userId: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpendingFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  checked?: boolean;
  page?: number;
  limit?: number;
}

export interface SpendingResponse {
  spending: Spending[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateSpendingRequest {
  date?: string;
  description: string;
  category: string;
  amount: number;
  checked?: boolean;
}

export interface UpdateSpendingRequest {
  date?: string;
  description?: string;
  category?: string;
  amount?: number;
  checked?: boolean;
}

import api from "@/lib/api";
import { getAuthToken } from "./setup";

/**
 * Get all spending records for the user
 */
export const getSpending = async (
  filters?: SpendingFilters
): Promise<SpendingResponse> => {
  const response = await api.get("/spending", {
    params: filters,
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return response.data.data;
};

/**
 * Create a new spending record
 */
export const createSpending = async (
  spendingData: CreateSpendingRequest
): Promise<Spending> => {
  const response = await api.post("/spending", spendingData, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return response.data.data;
};

/**
 * Update an existing spending record
 */
export const updateSpending = async (
  id: string,
  spendingData: UpdateSpendingRequest
): Promise<Spending> => {
  const response = await api.put(`/spending/${id}`, spendingData, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return response.data.data;
};

/**
 * Delete a spending record
 */
export const deleteSpending = async (id: string): Promise<void> => {
  await api.delete(`/spending/${id}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};
