import { create } from "zustand";
import {
  Asset,
  AssetsSummary,
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  AssetType,
} from "@/lib/api/assets";

interface AssetsStore {
  assets: Asset[];
  summary: AssetsSummary | null;
  isLoading: boolean;
  error: string | null;

  fetchAssets: () => Promise<void>;
  addAsset: (data: {
    type: AssetType;
    description: string;
    value: number;
    account: string;
  }) => Promise<void>;
  updateAsset: (id: string, data: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
}

export const useAssetsStore = create<AssetsStore>((set, get) => ({
  assets: [],
  summary: null,
  isLoading: false,
  error: null,

  fetchAssets: async () => {
    const { assets } = get();
    // Only show loading if we have no data
    if (assets.length === 0) {
      set({ isLoading: true, error: null });
    }
    try {
      const data = await getAssets();
      set({
        assets: [...data.liquidAssets, ...data.nonLiquidAssets],
        summary: data.summary,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addAsset: async (data) => {
    const { assets, summary } = get();
    // Optimistic
    const tempId = `temp-${Date.now()}`;
    const optimisticAsset: Asset = {
      id: tempId,
      userId: "user",
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newAssets = [optimisticAsset, ...assets];
    const newSummary = calculateSummary(newAssets, summary);
    const previousAssets = assets;
    const previousSummary = summary;

    set({ assets: newAssets, summary: newSummary });

    try {
      const newAsset = await createAsset(data);
      // Replace temp
      set((state) => ({
        assets: state.assets.map((a) => (a.id === tempId ? newAsset : a)),
      }));
      // Background fetch for summary update
      const freshData = await getAssets();
      set({ summary: freshData.summary });
    } catch (error: any) {
      set({ assets: previousAssets, summary: previousSummary }); // Rollback
      throw error;
    }
  },

  updateAsset: async (id, data) => {
    const { assets, summary } = get();
    const previousAssets = assets;
    const previousSummary = summary;

    const newAssets = assets.map((a) => (a.id === id ? { ...a, ...data } : a));
    const newSummary = calculateSummary(newAssets, summary);

    set({
      assets: newAssets,
      summary: newSummary,
    });

    try {
      const updated = await updateAsset(id, data);
      set((state) => ({
        assets: state.assets.map((a) => (a.id === id ? updated : a)),
      }));
      // Background fetch for summary update
      const freshData = await getAssets();
      set({ summary: freshData.summary });
    } catch (error: any) {
      set({ assets: previousAssets, summary: previousSummary }); // Rollback
      throw error;
    }
  },

  deleteAsset: async (id) => {
    const { assets, summary } = get();
    const previousAssets = assets;
    const previousSummary = summary;

    const newAssets = assets.filter((a) => a.id !== id);
    const newSummary = calculateSummary(newAssets, summary);

    set({
      assets: newAssets,
      summary: newSummary,
    });

    try {
      await deleteAsset(id);
      // Background fetch for summary update
      const freshData = await getAssets();
      set({ summary: freshData.summary });
    } catch (error: any) {
      set({ assets: previousAssets, summary: previousSummary }); // Rollback
      throw error;
    }
  },
}));

// Helper to calculate summary locally
const calculateSummary = (
  assets: Asset[],
  previousSummary: AssetsSummary | null
): AssetsSummary => {
  const liquid = assets
    .filter((a) => a.type === "LIQUID")
    .reduce((acc, curr) => acc + Number(curr.value), 0);
  const nonLiquid = assets
    .filter((a) => a.type === "NON_LIQUID")
    .reduce((acc, curr) => acc + Number(curr.value), 0);

  const totalAssets = liquid + nonLiquid;
  const target = previousSummary?.target || 0;
  // Prevent division by zero
  const progress = target > 0 ? Math.round((totalAssets / target) * 100) : 0;

  return {
    totalLiquidAssets: liquid,
    totalNonLiquidAssets: nonLiquid,
    totalAssets,
    target,
    progress,
  };
};
