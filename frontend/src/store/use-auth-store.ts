import { create } from "zustand"
import { persist } from "zustand/middleware"
import api from "@/lib/api"

interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setIsAuthenticated: (status: boolean) => void
  setIsLoading: (status: boolean) => void
  logout: () => void
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setIsLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false }),
      checkSession: async () => {
        try {
          const response = await api.get("/users/profile")
          if (response.data.success) {
            set({ user: response.data.data, isAuthenticated: true })
          } else {
            set({ user: null, isAuthenticated: false })
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false })
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
)
