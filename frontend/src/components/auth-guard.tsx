
"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/use-auth-store"
import api from "@/lib/api"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, checkSession, isAuthenticated } = useAuthStore()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user) {
          await checkSession()
          // Re-check after session verify
          if (!useAuthStore.getState().isAuthenticated) {
             router.push("/auth/login")
          }
        }
      } catch (error) {
        router.push("/auth/login")
      } finally {
        setChecking(false)
      }
    }

    if (pathname.startsWith("/dashboard")) {
        checkAuth()
    } else {
        setChecking(false)
    }
  }, [pathname, router, checkSession, user])

  if (checking && pathname.startsWith("/dashboard")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">Verifying session...</p>
      </div>
    )
  }

  return <>{children}</>
}
