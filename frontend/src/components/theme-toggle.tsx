"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-20 h-9 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 animate-pulse" />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative w-20 h-9 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-between px-1.5 gap-0.5",
        isDark 
          ? "bg-slate-900 border-slate-700" 
          : "bg-slate-50 border-slate-200"
      )}
      aria-label="Toggle Theme"
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-7 rounded-full transition-all duration-300",
        !isDark ? "bg-white shadow-sm" : "bg-transparent"
      )}>
        <Sun className={cn(
          "w-4 h-4 transition-colors duration-300",
          !isDark ? "text-amber-500" : "text-slate-600"
        )} />
      </div>

      <div className={cn(
        "flex items-center justify-center w-8 h-7 rounded-full transition-all duration-300",
        isDark ? "bg-emerald-600 shadow-sm" : "bg-transparent"
      )}>
        <Moon className={cn(
          "w-4 h-4 transition-colors duration-300",
          isDark ? "text-white" : "text-slate-400"
        )} />
      </div>
    </button>
  )
}
