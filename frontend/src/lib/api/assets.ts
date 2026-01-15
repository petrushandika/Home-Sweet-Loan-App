/**
 * Assets API Service
 * Handles all API calls related to wealth and assets management
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export type AssetType = "LIQUID" | "NON_LIQUID";

export interface Asset {
  id: string;
  userId: string;
  type: AssetType;
  description: string;
  value: number;
  account: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetsSummary {
  totalLiquidAssets: number;
  totalNonLiquidAssets: number;
  totalAssets: number;
  target: number;
  progress: number;
}

export interface AssetsResponse {
  liquidAssets: Asset[];
  nonLiquidAssets: Asset[];
  summary: AssetsSummary;
}

export interface CreateAssetRequest {
  type: AssetType;
  description: string;
  value: number;
  account: string;
}

export interface UpdateAssetRequest {
  type?: AssetType;
  description?: string;
  value?: number;
  account?: string;
}

import api from "@/lib/api";
import { getAuthToken } from "./setup";

/**
 * Get all assets for the user
 */
export const getAssets = async (): Promise<AssetsResponse> => {
  const response = await api.get("/assets", {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return response.data.data;
};

/**
 * Create a new asset
 */
export const createAsset = async (
  assetData: CreateAssetRequest
): Promise<Asset> => {
  const response = await api.post("/assets", assetData, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return response.data.data;
};

/**
 * Update an existing asset
 */
export const updateAsset = async (
  id: string,
  assetData: UpdateAssetRequest
): Promise<Asset> => {
  const response = await api.put(`/assets/${id}`, assetData, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return response.data.data;
};

/**
 * Delete an asset
 */
export const deleteAsset = async (id: string): Promise<void> => {
  await api.delete(`/assets/${id}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};

/**
 * Update assets target goal
 */
export const updateAssetsTarget = async (target: number): Promise<any> => {
  const response = await api.put(
    "/assets/target",
    { target },
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );

  return response.data.data;
};
