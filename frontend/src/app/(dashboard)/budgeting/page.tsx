"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Wallet,
  Target,
  Info,
  Sparkles,
  PieChart,
  ShieldCheck,
  Heart,
  Loader2,
} from "lucide-react";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useLanguageStore, translations } from "@/store/use-language-store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSetupStore } from "@/store/use-setup-store";
import { useBudgetStore } from "@/store/use-budget-store";
import { getSpending, Spending } from "@/lib/api/spending";

export default function BudgetingPage() {
  const { language } = useLanguageStore();
  const langKey = language as keyof typeof translations;
  const t = translations[langKey].dashboard.budgeting;
  const [mounted, setMounted] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("current");
  const [spentByItem, setSpentByItem] = useState<Record<string, number>>({});

  // Privacy State - Hide/Show Amounts
  const [hiddenAmounts, setHiddenAmounts] = useState(false);

  // Load hidden preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('budgeting-hidden-amounts');
    if (saved === 'true') {
      setHiddenAmounts(true);
    }
  }, []);

  // Toggle visibility
  const toggleAmountsVisibility = () => {
    const newValue = !hiddenAmounts;
    setHiddenAmounts(newValue);
    localStorage.setItem('budgeting-hidden-amounts', String(newValue));
  };

  // Global Stores
  const { setup, fetchSetup } = useSetupStore();
  const {
    budget: currentBudget,
    isLoading,
    fetchBudget,
    createBudget,
    updateBudgetIncome,
    updateBudgetAllocation,
  } = useBudgetStore();

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    fetchSetup();
    fetchBudget(yearMonth);
    fetchSpendingData(yearMonth);
  }, []);

  const fetchSpendingData = async (yearMonth: string) => {
    try {
      const spendingData = await getSpending({
        startDate: `${yearMonth}-01`,
        endDate: `${yearMonth}-31`, // Simplified end date
        limit: 1000,
      });

      // Aggregate spending by item name (category field in Spending) - Treating ALL amounts as usage (magnitude)
      const aggregated: Record<string, number> = {};
      spendingData.spending.forEach((s: Spending) => {
        // User request: "mau minus atau plus ... berarti pengeluaran"
        // Treat both positive and negative amounts as expenditure magnitude
        aggregated[s.category] =
          (aggregated[s.category] || 0) + Math.abs(s.amount);
      });
      setSpentByItem(aggregated);
    } catch (error) {
      console.error("Failed to fetch spending data", error);
    }
  };

  const handleInitialize = async () => {
    try {
      const now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;

      if (selectedMonth === "next") {
        month += 1;
        if (month > 12) {
          month = 1;
          year += 1;
        }
      }

      const yearMonth = `${year}-${month.toString().padStart(2, "0")}`;

      // Initialize income with setup sources (default 0)
      const initialIncome: Record<string, number> = {};
      if (setup?.incomeSources) {
        setup.incomeSources.forEach((source: string) => {
          initialIncome[source] = 0;
        });
      } else {
        initialIncome["Primary Income"] = 0;
      }

      await createBudget(yearMonth, initialIncome);

      toast.success(t.toastTitle, {
        description: t.toastDesc,
      });
    } catch (error: any) {
      toast.error("Failed to initialize budget", {
        description: error.message,
      });
    }
  };

  const handleUpdateIncome = async (source: string, newValue: string) => {
    if (!currentBudget || isNaN(Number(newValue))) return;

    try {
      await updateBudgetIncome(source, Number(newValue));
    } catch (error: any) {
      toast.error("Failed to update income", { description: error.message });
    }
  };

  const handleUpdateAllocation = async (
    category: string,
    itemName: string,
    amount: string
  ) => {
    if (!currentBudget || isNaN(Number(amount))) return;

    try {
      await updateBudgetAllocation(category, itemName, Number(amount));
    } catch (error: any) {
      toast.error("Failed to update allocation", {
        description: error.message,
      });
    }
  };

  const handleViewGoals = () => {
    toast.info("Wealth Goals", {
      description: "Redirecting to your long-term wealth projection center...",
    });
  };

  if (!mounted) return null;

  return (
    <div className="space-y-10 pb-10 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white transition-colors"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 transition-colors">
            {t.subtitle}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <ResponsiveModal
            title="Budgeting Guidelines"
            description="Master the art of financial management with our expert rules."
            trigger={
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-full px-6 border-border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all border"
              >
                <Info className="mr-2 h-4 w-4" /> {t.guidelines}
              </Button>
            }
          >
            <div className="space-y-6">
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-800">
                <h3 className="text-emerald-700 dark:text-emerald-400 font-black flex items-center gap-2 mb-3">
                  <PieChart className="w-5 h-5" /> The 50/30/20 Rule
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800 font-bold text-emerald-600">
                      50%
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
                      <b>Needs:</b> Groceries, housing, utilities, insurance,
                      and minimum debt payments.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-violet-100 dark:border-violet-800 font-bold text-violet-600">
                      30%
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
                      <b>Wants:</b> Dining out, hobbies, subscriptions, and
                      non-essential shopping.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800 font-bold text-emerald-600">
                      20%
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
                      <b>Savings:</b> Debt repayment, emergency fund, and wealth
                      building.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">
                    Benefit 1
                  </p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">
                    Avoid lifestyle creep and overspending.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">
                    Benefit 2
                  </p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">
                    Build safety net for unexpected events.
                  </p>
                </div>
              </div>
            </div>
          </ResponsiveModal>

          <ResponsiveModal
            title={t.modalTitle}
            description={t.modalDesc}
            trigger={
              <Button className="w-full sm:w-auto rounded-full px-6 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-bold shadow-sm transition-all hover:scale-105 active:scale-95 border-none">
                <Plus className="mr-2 h-4 w-4" /> {t.createPlan}
              </Button>
            }
          >
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="plan-month"
                  className="text-slate-700 dark:text-slate-300 font-bold ml-1"
                >
                  {t.periodLabel}
                </Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="rounded-2xl border-border dark:bg-slate-900 focus:ring-emerald-500 h-11">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border dark:bg-slate-900">
                    <SelectItem value="current" className="cursor-pointer">
                      {t.currentMonth}
                    </SelectItem>
                    <SelectItem value="next" className="cursor-pointer">
                      {t.nextMonth}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex gap-4 animate-smooth-in transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-700 shadow-sm transition-colors">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold leading-relaxed transition-colors">
                  {t.tip}
                </p>
              </div>
              <Button
                onClick={handleInitialize}
                type="submit"
                className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-lg shadow-emerald-100 dark:shadow-none cursor-pointer transition-all active:scale-95 border-none"
              >
                {t.initializeBtn}
              </Button>
            </div>
          </ResponsiveModal>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 xl:grid-cols-12">
        <Card className="xl:col-span-8 border-border shadow-none rounded-[2rem] bg-white dark:bg-slate-900 overflow-hidden border transition-colors duration-300">
          <CardHeader className="p-4 md:px-10 md:pt-8 md:pb-6">
            <div className="flex items-center justify-between gap-4 md:gap-5 mb-2 md:mb-4">
              <div className="flex items-center gap-4 md:gap-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center transition-colors shrink-0">
                <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">
                  {t.planCardTitle}
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 font-medium transition-colors">
                  {t.planCardDesc}
                </CardDescription>
              </div>
              </div>
              {/* Hide/Show Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleAmountsVisibility}
                className="h-10 w-10 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors shrink-0"
              >
                {hiddenAmounts ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 md:px-10 md:pb-8 pt-0">
            <div className="space-y-4 lg:max-h-[400px] overflow-y-auto pr-4 emerald-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
                  <p className="font-medium">Loading budget plan...</p>
                </div>
              ) : !currentBudget ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    <Wallet className="w-10 h-10 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                      {t.emptyState}
                    </h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                      {t.createPlanDesc}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                      <p className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 mb-2">
                        {t.incomeSources}
                      </p>
                      <div className="space-y-3">
                        {setup?.incomeSources?.map((source: string) => (
                          <div key={source} className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 pl-1">
                              {source}
                            </span>
                            {hiddenAmounts ? (
                              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-xl px-3 h-10 border border-emerald-100 dark:border-emerald-800 w-full">
                                <span className="text-sm font-black text-slate-400 tabular-nums">
                                  ••••••
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-xl px-3 h-10 border border-emerald-100 dark:border-emerald-800 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all w-full">
                                <span className="text-xs font-black text-slate-400 mr-1">
                                  Rp
                                </span>
                                <input
                                  type="number"
                                  defaultValue={
                                    currentBudget.income?.[source] || 0
                                  }
                                  onBlur={(e) =>
                                    handleUpdateIncome(source, e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.currentTarget.blur();
                                    }
                                  }}
                                  className="bg-transparent border-none focus:ring-0 text-sm font-black text-slate-800 dark:text-white w-full tabular-nums outline-none p-0 h-full"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-emerald-100 dark:border-emerald-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          {t.totalProjected}
                        </span>
                        <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                          {hiddenAmounts ? (
                            "••••••"
                          ) : (
                            <>
                              Rp{" "}
                              {(Object.values(currentBudget.income || {}) as number[])
                                .reduce((a: number, b: number) => a + b, 0)
                                .toLocaleString()}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-800">
                      <p className="text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 mb-1">
                        {t.remaining}
                      </p>
                      <p className="text-xl font-black text-slate-800 dark:text-white leading-none">
                        {hiddenAmounts ? (
                          "••••••"
                        ) : (
                          <>
                            Rp{" "}
                            {(
                              currentBudget.summary?.nonAllocated || 0
                            ).toLocaleString()}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {[
                    {
                      title: t.needs,
                      items: setup?.needs || [],
                      color: "bg-orange-500",
                      icon: Wallet,
                      bg: "bg-orange-50 dark:bg-orange-950/20",
                    },
                    {
                      title: t.wants,
                      items: setup?.wants || [],
                      color: "bg-violet-500",
                      icon: Heart,
                      bg: "bg-violet-50 dark:bg-violet-950/20",
                    },
                    {
                      title: t.savingsCat,
                      items: setup?.savings || [],
                      color: "bg-emerald-500",
                      icon: ShieldCheck,
                      bg: "bg-emerald-50 dark:bg-emerald-950/20",
                    },
                  ].map((cat: { title: string; items: string[]; color: string; icon: any; bg: string }) => (
                    <div key={cat.title} className="space-y-3">
                      <div className="flex items-center gap-2 px-2">
                        <div
                          className={cn("w-1.5 h-4 rounded-full", cat.color)}
                        />
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                          {cat.title}
                        </h4>
                      </div>
                      {cat.items.length === 0 ? (
                        <p className="text-xs text-slate-400 italic px-2">
                          {t.noSetup}
                        </p>
                      ) : (
                        cat.items.map((itemName: string) => {
                          const allocated =
                            (cat.title === t.savingsCat
                              ? currentBudget.savingsAllocation?.[itemName]
                              : currentBudget.expenses?.[itemName]) || 0;
                          const spent = Math.abs((spentByItem as Record<string, number>)[itemName] || 0);
                          const percent =
                            allocated > 0 ? (spent / allocated) * 100 : 0;

                          return (
                            <div
                              key={itemName}
                              className="group py-3 px-5 rounded-3xl border border-border bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all"
                            >
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-2 gap-3 sm:gap-0">
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                  <div
                                    className={cn(
                                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                      cat.bg
                                    )}
                                  >
                                    <cat.icon
                                      className={cn(
                                        "w-4 h-4",
                                        cat.color.replace("bg-", "text-")
                                      )}
                                    />
                                  </div>
                                  <span className="font-bold text-slate-700 dark:text-slate-200 text-sm whitespace-nowrap overflow-hidden text-ellipsis flex-1 sm:flex-none sm:max-w-[150px]">
                                    {itemName}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                                  <span className="text-[10px] font-black text-slate-400 tabular-nums">
                                    {hiddenAmounts ? "Rp ••••••" : `Rp ${spent.toLocaleString()}`} /
                                  </span>
                                  {hiddenAmounts ? (
                                    <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-3 h-10 border border-slate-100 dark:border-slate-800 w-full sm:w-40">
                                      <span className="text-sm font-black text-slate-400 tabular-nums">
                                        ••••••
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-3 h-10 border border-slate-100 dark:border-slate-800 group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all w-full sm:w-40 flex-1 sm:flex-none">
                                      <span className="text-xs font-black text-slate-500 mr-1">
                                        Rp
                                      </span>
                                      <input
                                        type="number"
                                        defaultValue={allocated}
                                        onBlur={(e) =>
                                          handleUpdateAllocation(
                                            cat.title,
                                            itemName,
                                            e.target.value
                                          )
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            e.currentTarget.blur();
                                          }
                                        }}
                                        className="bg-transparent border-none focus:ring-0 text-sm font-black text-slate-700 dark:text-slate-200 w-full tabular-nums text-right outline-none p-0 h-full"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    cat.color
                                  )}
                                  style={{
                                    width: `${Math.min(percent, 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4 border-emerald-700 dark:border-emerald-800 shadow-none rounded-[2rem] bg-linear-to-br from-emerald-600 to-emerald-800 dark:from-emerald-800 dark:to-emerald-950 text-white overflow-hidden border relative group transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110 pointer-events-none">
            <Target className="w-32 h-32 text-white" />
          </div>
          <CardHeader className="p-6 md:px-10 md:pt-8 md:pb-6 relative z-10">
            <CardTitle className="text-2xl font-bold">
              {t.goalTrackerTitle}
            </CardTitle>
            <CardDescription className="text-emerald-100/80 dark:text-emerald-400/60 font-medium tracking-tight">
              {t.goalTrackerDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 md:px-10 md:pb-8 pt-0 relative z-10 space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-black uppercase tracking-wider">
                <span>{t.savingTarget}</span>
                <span>75%</span>
              </div>
              <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden border border-white/10 dark:border-emerald-900/30 p-0.5 transition-colors">
                <div className="h-full bg-white dark:bg-emerald-500 rounded-full w-3/4 shadow-[0_0_10px_rgba(255,255,255,0.3)] dark:shadow-none" />
              </div>
            </div>
            <div className="space-y-5 pt-4">
              <p
                className="text-sm font-medium leading-relaxed text-emerald-50 dark:text-emerald-100/80 transition-colors"
                dangerouslySetInnerHTML={{ __html: t.encouragement }}
              />
              <Button
                onClick={handleViewGoals}
                className="w-full rounded-2xl bg-white dark:bg-emerald-600 text-emerald-700 dark:text-white font-black hover:bg-emerald-50 dark:hover:bg-emerald-700 border border-transparent transition-all py-7 shadow-sm active:scale-95 border-none"
              >
                {t.viewGoalsBtn}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
