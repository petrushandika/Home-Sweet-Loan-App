
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Settings, 
  Wallet, 
  ArrowUpRight, 
  FileText, 
  PiggyBank,
  ChevronRight
} from "lucide-react"

const items = [
  {
    title: "Summary",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Setup",
    href: "/setup",
    icon: Settings,
  },
  {
    title: "Budgeting",
    href: "/budgeting",
    icon: Wallet,
  },
  {
    title: "Spending",
    href: "/spending",
    icon: ArrowUpRight,
  },
  {
    title: "Report",
    href: "/report",
    icon: FileText,
  },
  {
    title: "Assets",
    href: "/assets",
    icon: PiggyBank,
  },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <div className={cn("flex flex-col h-full w-64 bg-sidebar border-r border-slate-200", className)}>
      <div className="p-8">
        <span className="text-2xl font-black tracking-tighter text-gradient-money">
          Home Sweet Loan
        </span>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto emerald-scrollbar">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border border-transparent",
                isActive
                  ? "bg-linear-to-r from-emerald-600 to-emerald-700 text-white border-emerald-800/20 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:border-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
                {item.title}
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
            </Link>
          )
        })}
      </nav>
      <div className="p-6">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-white hover:border-primary/20 transition-all group/profile">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary to-savings border border-white/20" />
             <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">Pandawa</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">PRO PLAN</span>
             </div>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
             <div className="h-full bg-primary w-2/3" />
          </div>
          <p className="text-[10px] mt-2 text-slate-500 font-medium tracking-wide">Budget usage: 66%</p>
        </div>
      </div>
    </div>
  )
}
