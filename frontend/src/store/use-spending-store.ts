import { create } from "zustand";
import {
  Spending,
  getSpending,
  createSpending,
  updateSpending,
  deleteSpending,
} from "@/lib/api/spending";

interface SpendingStore {
  spending: Spending[];
  isLoading: boolean;
  error: string | null;

  fetchSpending: () => Promise<void>;
  addSpending: (data: {
    description: string;
    amount: number;
    category: string;
    date: string;
  }) => Promise<void>;
  updateSpending: (
    id: string,
    data: {
      description?: string;
      amount?: number;
      category?: string;
      date?: string;
    }
  ) => Promise<void>;
  deleteSpending: (id: string) => Promise<void>;
}

export const useSpendingStore = create<SpendingStore>((set, get) => ({
  spending: [],
  isLoading: false,
  error: null,

  fetchSpending: async () => {
    const { spending } = get();
    // Only show loading if we have no data
    if (spending.length === 0) {
      set({ isLoading: true, error: null });
    }
    try {
      const data = await getSpending({ limit: 1000 });
      set({ spending: data.spending, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addSpending: async (data) => {
    const { spending } = get();
    // Optimistic
    const tempId = `temp-${Date.now()}`;
    const optimisticSpending: Spending = {
      id: tempId,
      userId: "user",
      checked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    set({ spending: [optimisticSpending, ...spending] });

    try {
      const newRecord = await createSpending(data);
      // Replace temp
      set((state) => ({
        spending: state.spending.map((s) => (s.id === tempId ? newRecord : s)),
      }));
    } catch (error: any) {
      set({ spending }); // Rollback
      throw error;
    }
  },

  updateSpending: async (id, data) => {
    const { spending } = get();
    const previousSpending = spending;

    set({
      spending: spending.map((s) => (s.id === id ? { ...s, ...data } : s)),
    });

    try {
      const updated = await updateSpending(id, data as any);
      set((state) => ({
        spending: state.spending.map((s) => (s.id === id ? updated : s)),
      }));
    } catch (error: any) {
      set({ spending: previousSpending }); // Rollback
      throw error;
    }
  },

  deleteSpending: async (id) => {
    const { spending } = get();
    const previousSpending = spending;

    set({
      spending: spending.filter((s) => s.id !== id),
    });

    try {
      await deleteSpending(id);
    } catch (error: any) {
      set({ spending: previousSpending }); // Rollback
      throw error;
    }
  },
}));
