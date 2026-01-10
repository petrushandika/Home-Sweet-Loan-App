"use client"

import * as React from "react"
import { useLanguageStore, Language } from "@/store/use-language-store"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const languages = [
  {
    code: "id" as Language,
    label: "Indonesia",
    flag: "https://flagcdn.com/w40/id.png",
  },
  {
    code: "en" as Language,
    label: "English",
    flag: "https://flagcdn.com/w40/us.png",
  },
]

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-24 h-9 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 animate-pulse" />
    )
  }

  const currentLang = languages.find((l) => l.code === language) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full pl-2 pr-3 h-9 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer outline-none group">
          <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 flex-shrink-0 shadow-sm">
             <img src={currentLang.flag} alt={currentLang.label} className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 transition-colors">
            {currentLang.code}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 rounded-[1.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 shadow-2xl animate-in fade-in-0 zoom-in-95 space-y-1"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "flex items-center justify-between rounded-xl px-3 py-3 cursor-pointer transition-all border border-transparent",
              language === lang.code 
                ? "bg-slate-50 dark:bg-slate-900 text-emerald-600 font-black border-slate-100 dark:border-slate-800" 
                : "text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                <img src={lang.flag} alt={lang.label} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs uppercase tracking-widest font-black leading-none">{lang.label}</span>
            </div>
            {language === lang.code && (
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
