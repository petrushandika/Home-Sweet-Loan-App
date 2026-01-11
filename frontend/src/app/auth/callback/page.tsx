
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/use-auth-store"
import api from "@/lib/api"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { setUser, setIsAuthenticated } = useAuthStore()

  useEffect(() => {
    const finishSocialLogin = async () => {
      try {
        const response = await api.get("/users/profile")
        if (response.data.success) {
          setUser(response.data.data)
          setIsAuthenticated(true)
          toast.success("Welcome!", { description: "Social login successful." })
          router.push("/dashboard")
        } else {
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Callback error:", error)
        toast.error("Authentication failed", { description: "Please try logging in again." })
        router.push("/auth/login")
      }
    }

    finishSocialLogin()
  }, [router, setUser, setIsAuthenticated])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-6 animate-bounce">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
      <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2 italic">Authenticating...</h1>
      <p className="text-slate-500 dark:text-slate-400 font-bold">Completing your secure sign-in, please wait.</p>
    </div>
  )
}
