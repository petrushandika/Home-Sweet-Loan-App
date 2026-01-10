"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-14 h-8 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-800" />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative w-14 h-8 rounded-full border transition-all duration-300 cursor-pointer p-1",
        isDark 
          ? "bg-slate-900 border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" 
          : "bg-slate-50 border-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
      )}
      aria-label="Toggle Theme"
    >
      <div
        className={cn(
          "absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-500 flex items-center justify-center",
          isDark 
            ? "translate-x-6 bg-emerald-600 rotate-0" 
            : "translate-x-0 bg-white rotate-0 shadow-sm"
        )}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-white animate-in zoom-in-50 duration-300" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500 animate-in zoom-in-50 duration-300" />
        )}
      </div>
    </button>
  )
}
