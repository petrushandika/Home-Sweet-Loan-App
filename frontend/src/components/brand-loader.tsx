"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export function BrandLoader() {
  const [isVisible] = useState(true)
  const brandName = "Home Sweet Loan"
  
  return (
    <div className={cn(
      "fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white dark:bg-slate-950 noise transition-opacity duration-1000",
      isVisible ? 'opacity-100' : 'opacity-0'
    )}>
       <div className="flex flex-col items-center gap-6 md:gap-10 w-full px-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-[0.05em] gap-y-4 md:gap-y-0 relative">
             {brandName.split("").map((char, index) => (
                <span 
                  key={index} 
                  className={cn(
                    "text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter animate-glossy-wave",
                    `delay-${index % 16}`,
                    char === " " ? "mr-3 md:mr-6" : ""
                  )}
                >
                   {char === " " ? "\u00A0" : char}
                </span>
             ))}
          </div>
          
          <div className="flex flex-col items-center gap-4">
             <div className="w-24 md:w-32 h-1 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div className="h-full bg-emerald-600 animate-brand-shimmer bg-[length:200%_auto]" style={{ width: '100%' }} />
             </div>
             <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-emerald-600/60 animate-pulse">
                Initializing Wealth Portal
             </span>
          </div>
       </div>
    </div>
  )
}
