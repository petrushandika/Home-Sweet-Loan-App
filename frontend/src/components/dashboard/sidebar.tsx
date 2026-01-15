"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguageStore, translations } from "@/store/use-language-store";
import { useAuthStore } from "@/store/use-auth-store";
import {
  LayoutDashboard,
  Settings,
  Wallet,
  ArrowUpRight,
  FileText,
  PiggyBank,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getBudget } from "@/lib/api/budgets";
import { getSpending } from "@/lib/api/spending";

export function Sidebar({
  className,
  onItemClick,
  isCollapsed,
  onToggleCollapse,
  onClose,
}: {
  className?: string;
  onItemClick?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const [budgetStats, setBudgetStats] = useState({ percent: 0, loading: true });

  const t = translations[language].dashboard;

  useEffect(() => {
    const fetchBudgetStats = async () => {
      try {
        const now = new Date();
        const yearMonth = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}`;

        const startDate = `${yearMonth}-01`;
        const endDate = `${yearMonth}-31`;

        const [budget, spendingData] = await Promise.all([
          getBudget(yearMonth).catch(() => null), // If no budget, null
          getSpending({
            startDate,
            endDate,
            limit: 2000,
            excludeIncome: true,
          }).catch(() => ({ spending: [] })),
        ]);

        let totalIncome = 0;
        if (budget && budget.income) {
          totalIncome = Object.values(budget.income).reduce(
            (a: number, b: number) => a + b,
            0
          );
        }

        const totalSpent = spendingData.spending.reduce(
          (sum: number, tx: any) => sum + Math.abs(tx.amount),
          0
        );

        let percent = 0;
        if (totalIncome > 0) {
          percent = Math.round((totalSpent / totalIncome) * 100);
        } else if (totalSpent > 0) {
          percent = 100; // Spent something with no budget
        }

        setBudgetStats({ percent, loading: false });
      } catch (error) {
        console.error("Failed to fetch sidebar stats", error);
        setBudgetStats({ percent: 0, loading: false });
      }
    };

    if (user) {
      fetchBudgetStats();
    }
  }, [user]);

  const items = [
    {
      title: t.nav.summary,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t.nav.setup,
      href: "/setup",
      icon: Settings,
    },
    {
      title: t.nav.budgeting,
      href: "/budgeting",
      icon: Wallet,
    },
    {
      title: t.nav.spending,
      href: "/spending",
      icon: ArrowUpRight,
    },
    {
      title: t.nav.report,
      href: "/report",
      icon: FileText,
    },
    {
      title: t.nav.assets,
      href: "/assets",
      icon: PiggyBank,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white dark:bg-slate-900 border-r border-border transition-all duration-300 ease-in-out overflow-y-auto no-scrollbar",
        isCollapsed ? "w-[80px]" : "w-[280px]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center h-20 transition-all duration-300 border-b border-transparent shrink-0",
          isCollapsed ? "justify-center" : "justify-between px-6"
        )}
      >
        <div
          className={cn(
            "flex items-center overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 mr-2"
          )}
        >
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white whitespace-nowrap leading-none">
            Home Sweet <span className="text-emerald-600">Loan</span>
          </span>
        </div>

        {/* Toggle Button (Desktop) */}
        {onToggleCollapse && !onClose && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              "text-slate-400 hover:text-emerald-600 transition-all duration-300 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center",
              isCollapsed ? "mx-auto" : "ml-auto"
            )}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Close Button (Mobile) */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-slate-400 hover:text-rose-600 transition-all duration-300 p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center border border-transparent hover:border-rose-100 dark:hover:border-rose-900"
            title="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto emerald-scrollbar my-3">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              title={isCollapsed ? item.title : ""}
              className={cn(
                "group flex items-center rounded-2xl text-sm font-semibold transition-all duration-300 border border-transparent whitespace-nowrap overflow-hidden relative",
                isCollapsed
                  ? "justify-center px-0 py-4"
                  : "justify-between px-4 py-3",
                isActive
                  ? "bg-linear-to-r from-emerald-600 to-emerald-700 text-white border-emerald-800/20 shadow-lg shadow-emerald-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
              )}
            >
              <div
                className={cn(
                  "flex items-center transition-all duration-300",
                  isCollapsed ? "justify-center w-full gap-0" : "gap-3"
                )}
              >
                <item.icon
                  className={cn(
                    "transition-all duration-300 shrink-0 w-5 h-5",
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-emerald-500"
                  )}
                />
                <span
                  className={cn(
                    "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}
                  style={{ transitionDelay: isCollapsed ? "0ms" : "100ms" }}
                >
                  {item.title}
                </span>
              </div>
              {!isCollapsed && isActive && (
                <div
                  className={cn(
                    "absolute right-4 overflow-hidden transition-all duration-300",
                    isCollapsed ? "w-0 opacity-0" : "w-4 opacity-100"
                  )}
                >
                  <ChevronRight className="w-4 h-4 text-white/70" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "p-4 border-t border-border mt-auto transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}
      >
        <div
          className={cn("flex flex-col gap-2", isCollapsed && "items-center")}
        >
          {/* Sidebar Toggle Button Removed from Bottom */}

          <Link
            href="/profile"
            className={cn(
              "block rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border cursor-pointer hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-500/20 hover:shadow-sm transition-all duration-300 group/profile overflow-hidden relative",
              isCollapsed
                ? "p-0 flex justify-center items-center h-[60px] w-[60px] mx-auto"
                : "p-4"
            )}
          >
            <div
              className={cn(
                "flex items-center transition-all duration-300",
                isCollapsed ? "justify-center w-full" : "gap-3 mb-3"
              )}
            >
              <div
                className={cn(
                  "rounded-full border border-emerald-100 dark:border-emerald-800 p-0.5 overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300 shrink-0 relative z-10",
                  "w-10 h-10"
                )}
              >
                <img
                  src={
                    user?.avatarUrl ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover group-hover/profile:scale-110 transition-transform duration-700"
                />
              </div>
              <div
                className={cn(
                  "flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
                  isCollapsed
                    ? "w-0 opacity-0 absolute"
                    : "w-auto opacity-100 relative"
                )}
              >
                <span className="text-sm font-bold text-slate-800 dark:text-white transition-colors duration-300 truncate">
                  {user?.name || "User"}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold transition-colors duration-300 truncate">
                  {user?.plan || "FREE PLAN"}
                </span>
              </div>
            </div>

            <div
              className={cn(
                "transition-all duration-300 overflow-hidden",
                isCollapsed ? "h-0 opacity-0 mt-0" : "h-auto opacity-100 mt-2"
              )}
            >
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden transition-colors duration-300">
                <div
                  className={cn(
                    "h-full transition-all duration-1000",
                    budgetStats.percent > 100 ? "bg-rose-500" : "bg-emerald-600"
                  )}
                  style={{ width: `${Math.min(budgetStats.percent, 100)}%` }}
                />
              </div>
              <p className="text-[10px] mt-1 text-slate-500 dark:text-slate-400 font-medium tracking-wide transition-colors duration-300 whitespace-nowrap">
                {language === "id" ? "Terpakai" : "Used"}: {budgetStats.percent}
                %
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
