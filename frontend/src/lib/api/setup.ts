/**
 * Setup API Service
 * Handles all API calls related to setup configuration
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Category mapping from frontend display names to backend enum values
export const CATEGORY_MAP: Record<string, string> = {
  "Account Summary": "accountSummary",
  "Income Sources": "incomeSources",
  Needs: "needs",
  Wants: "wants",
  Savings: "savings",
  Assets: "accountAssets",
};

// Reverse mapping for display
export const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  accountSummary: "Account Summary",
  incomeSources: "Income Sources",
  needs: "Needs",
  wants: "Wants",
  savings: "Savings",
  accountAssets: "Assets",
};

export interface SetupConfig {
  id: string;
  userId: string;
  accountSummary: string[];
  incomeSources: string[];
  needs: string[];
  wants: string[];
  savings: string[];
  accountAssets: string[];
  paydayDate: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddItemRequest {
  category: string;
  itemName: string;
}

export interface DeleteItemRequest {
  category: string;
  itemName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
}

import api from "@/lib/api";

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

/**
 * Get user's setup configuration
 */
export const getSetup = async (): Promise<SetupConfig> => {
  const response = await api.get("/setup", {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return response.data.data;
};

/**
 * Update entire setup configuration
 */
export const updateSetup = async (
  setupData: Partial<SetupConfig>
): Promise<SetupConfig> => {
  const response = await api.put("/setup", setupData, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return response.data.data;
};

/**
 * Add item to a category
 */
export const addItem = async (
  category: string,
  itemName: string
): Promise<{ category: string; itemName: string; items: string[] }> => {
  const response = await api.post(
    "/setup/items",
    { category, itemName },
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );

  return response.data.data;
};

/**
 * Delete item from a category
 */
export const deleteItem = async (
  category: string,
  itemName: string
): Promise<{ category: string; itemName: string; items: string[] }> => {
  const response = await api.delete("/setup/items", {
    data: { category, itemName },
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return response.data.data;
};

/**
 * Update an item name in a category
 */
export const updateItem = async (
  category: string,
  oldItemName: string,
  newItemName: string
): Promise<{
  category: string;
  oldItemName: string;
  newItemName: string;
  items: string[];
}> => {
  const response = await api.post(
    "/setup/items/update",
    { category, oldItemName, newItemName },
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );

  return response.data.data;
};

/**
 * Validate item name
 */
export const validateItemName = (
  itemName: string
): { valid: boolean; error?: string } => {
  const trimmed = itemName.trim();

  if (!trimmed) {
    return { valid: false, error: "Item name cannot be empty" };
  }

  if (trimmed.length > 100) {
    return {
      valid: false,
      error: "Item name is too long (max 100 characters)",
    };
  }

  return { valid: true };
};

/**
 * Check if item exists in category
 */
export const itemExists = (items: string[], itemName: string): boolean => {
  return items.some((item) => item.toLowerCase() === itemName.toLowerCase());
};
