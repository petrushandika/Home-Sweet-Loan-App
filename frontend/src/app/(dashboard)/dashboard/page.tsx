"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Download,
  PiggyBank,
  Plus,
  ArrowRight,
  CalendarIcon,
  Loader2,
  Info,
} from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { useLanguageStore, translations } from "@/store/use-language-store";
import { useSearchStore } from "@/store/use-search-store";
import { useMemo } from "react";
import { getBudget, getBudgets, Budget } from "@/lib/api/budgets";
import { getSpending, createSpending, Spending } from "@/lib/api/spending";
import { getAssets } from "@/lib/api/assets";
import { getNotifications } from "@/lib/api/notifications";
import { format } from "date-fns";

import { useSetupStore } from "@/store/use-setup-store";
import { TransactionIcon } from "@/components/transaction-icon";

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--income)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--expenses)",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const { language } = useLanguageStore();
  const langKey = language as keyof typeof translations;
  const t = translations[langKey].dashboard.summary;
  const { query: searchQuery } = useSearchStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Global Setup for Categories
  const { setup, fetchSetup } = useSetupStore();

  // Data State
  const [summaryStats, setSummaryStats] = useState({
    income: 0,
    spending: 0,
    savings: 0,
    netWorth: 0,
    incomeTrend: "+0%",
    spendingTrend: "+0%",
    savingsTrend: "+0%",
    netWorthTrend: "+0%",
    incomeBreakdown: [] as { label: string; amount: number }[],
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Quick Add State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [quickAddForm, setQuickAddForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  const [rawBudgets, setRawBudgets] = useState<any[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);

  // Privacy State - Hide/Show Cards
  const [hiddenCards, setHiddenCards] = useState<{
    income: boolean;
    spending: boolean;
    savings: boolean;
    netWorth: boolean;
  }>({
    income: false,
    spending: false,
    savings: false,
    netWorth: false,
  });

  // Load hidden cards preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-hidden-cards');
    if (saved) {
      try {
        setHiddenCards(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse hidden cards preference');
      }
    }
  }, []);

  // Save hidden cards preference to localStorage
  const toggleCardVisibility = (cardKey: 'income' | 'spending' | 'savings' | 'netWorth') => {
    const newHiddenCards = {
      ...hiddenCards,
      [cardKey]: !hiddenCards[cardKey],
    };
    setHiddenCards(newHiddenCards);
    localStorage.setItem('dashboard-hidden-cards', JSON.stringify(newHiddenCards));
  };

  useEffect(() => {
    setMounted(true);
    fetchSetup();
  }, []);

  useEffect(() => {
    if (setup) {
      fetchDashboardData();
    }
  }, [setup]);

  const categoryOptions = useMemo(() => {
    if (!setup) return [];
    return [
      ...setup.needs.map((n: string) => ({ label: n, value: n, type: "Needs" })),
      ...setup.wants.map((w: string) => ({ label: w, value: w, type: "Wants" })),
    ];
  }, [setup]);

  // ... (processChartHistory remains same, keeping it outside or here? It was defined before fetchDashboardData in last edit.
  // Wait, I am replacing a block that includes fetchDashboardData. I need to be careful not to delete processChartHistory if I don't include it.
  // In previous step (2112), processChartHistory is BEFORE fetchDashboardData.
  // The block I am targeting starts at line 107 (useEffect).
  // I will include processChartHistory in the replacement to be safe and ensure order.

  const processChartHistory = (
    budgets: Budget[],
    range: string,
    transactions: Spending[] = []
  ) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthStr = format(now, "yyyy-MM");

    let targetMonths: string[] = [];

    if (range === "1m") {
      targetMonths = [currentMonthStr];
    } else if (range === "6m") {
      for (let i = 1; i <= 6; i++) {
        targetMonths.push(`${currentYear}-${String(i).padStart(2, "0")}`);
      }
    } else if (range === "12m") {
      for (let i = 1; i <= 12; i++) {
        targetMonths.push(`${currentYear}-${String(i).padStart(2, "0")}`);
      }
    }

    const incomeSources = setup?.incomeSources || [];

    return targetMonths.map((ym) => {
      // 1. Get Budgeted Income
      const budget = budgets.find((b) => b.yearMonth === ym);
      const budgetedIncome = budget?.summary?.totalIncome || 0;

      // 2. Get Actual Spending (Expenses)
      const monthTx = transactions.filter((t) => t.date.startsWith(ym));
      let actualSpending = 0;

      monthTx.forEach((tx) => {
        // Exclude income categories from spending bar
        if (!incomeSources.includes(tx.category)) {
          actualSpending += Math.abs(Number(tx.amount));
        }
      });

      const dateObj = new Date(ym + "-01");
      return {
        month:
          range === "1m" ? format(dateObj, "MMMM") : format(dateObj, "MMM"),
        income: budgetedIncome, // Now from Budget Summary
        expenses: actualSpending, // From Actual Transactions
        raw: ym,
      };
    });
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const now = new Date();
      const currentMonthStr = format(now, "yyyy-MM");

      // Fetch concurrent data
      // We fetch 'currentMonthTransactions' specifically for accurate summary stats
      const [
        allBudgets,
        assetsRes,
        spendingRes,
        yearlyTransactionsRes,
        notifications,
      ] = await Promise.all([
        getBudgets(),
        getAssets(),
        getSpending({ limit: 50 }), // Latest for Activity Card - increased to 50
        getSpending({
          startDate: `${now.getFullYear()}-01-01`,
          limit: 5000,
        }),
        getNotifications(),
      ]);

      setRawBudgets(allBudgets);
      setAllTransactions(yearlyTransactionsRes.spending || []);

      // 1. Process Chart Data
      const processedChartData = processChartHistory(
        allBudgets,
        "6m",
        yearlyTransactionsRes.spending || []
      );
      setChartData(processedChartData);

      // 2. Process Summary Stats
      const currentMonthBudget = allBudgets.find(
        (b: Budget) => b.yearMonth === currentMonthStr
      );
      const budgetedIncome = currentMonthBudget?.summary?.totalIncome || 0;

      // Calculate real income and spending from actual transactions
      let actualIncome = 0;
      let actualSpending = 0;

      // Logic: Income based on Setup Config
      const incomeSources = setup?.incomeSources || [];

      if (yearlyTransactionsRes && yearlyTransactionsRes.spending) {
        yearlyTransactionsRes.spending.forEach((s: any) => {
          if (s.date.startsWith(currentMonthStr)) {
            if (incomeSources.includes(s.category)) {
              actualIncome += Math.abs(s.amount);
            } else {
              actualSpending += Math.abs(s.amount);
            }
          }
        });
      }

      // Calculate trend
      const previousMonthBudget = allBudgets.find(
        (b: any) =>
          b.yearMonth ===
          format(new Date(now.setMonth(now.getMonth() - 1)), "yyyy-MM")
      );
      const previousMonthIncome =
        previousMonthBudget?.summary?.totalIncome || 0;
      const incomeTrend =
        previousMonthIncome === 0
          ? "+0%"
          : `${(
              ((budgetedIncome - previousMonthIncome) / previousMonthIncome) *
              100
            ).toFixed(0)}%`;

      // Build Income Breakdown
      const incomeMap = currentMonthBudget?.income || {};
      const breakdown = (setup?.incomeSources || []).map((source: string) => ({
        label: source,
        amount: incomeMap[source] || 0,
      }));

      setSummaryStats({
        income: Number(budgetedIncome), // User requested Projected Income to be shown
        spending: actualSpending, // Keep Spending as Actual
        savings: Number(assetsRes.summary.totalLiquidAssets),
        netWorth: Number(assetsRes.summary.totalAssets),
        incomeTrend: incomeTrend,
        spendingTrend: "+0%",
        savingsTrend: "+0%",
        netWorthTrend: "+0%",
        incomeBreakdown: breakdown,
      });

      // 3. Process Activity - COMPLETE REWRITE FOR PROPER DEDUPLICATION
      // Get latest setup state
      const currentSetup = useSetupStore.getState().setup;
      
      // Build comprehensive item tracking
      const activeItems = {
        incomeSources: new Set(currentSetup?.incomeSources || []),
        needs: new Set(currentSetup?.needs || []),
        wants: new Set(currentSetup?.wants || []),
        savings: new Set(currentSetup?.savings || []),
        assets: new Set(currentSetup?.accountAssets || []),
      };

      // Process Spending Transactions
      const txActivities = (spendingRes.spending || [])
        .filter((s: any) => Math.abs(Number(s.amount)) > 0)
        .map((s: any) => ({
          id: s.id,
          date: s.date,
          description: s.description,
          category: s.category,
          amount: s.amount,
          isEvent: false,
          type: "SPENDING",
        }));

      // Process Notifications with Smart Deduplication
      const activityMap = new Map<string, any>();
      
      // Sort notifications by date (newest first)
      const sortedNotifs = [...(notifications || [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      for (const notif of sortedNotifs) {
        if (!["BUDGET", "ASSET"].includes(notif.type)) continue;

        let itemName = "";
        let itemCategory = "";
        let amount = 0;
        let activityType = notif.type;
        let uniqueKey = "";

        // Extract Budget Activities (Income, Needs, Wants, Savings)
        if (notif.type === "BUDGET" && notif.metadata?.update) {
          const update = notif.metadata.update;
          
          if (update.income) {
            const source = Object.keys(update.income)[0];
            itemName = source;
            itemCategory = source;
            amount = Number(update.income[source]);
            uniqueKey = `INCOME-${source}`;
            
            // Check if still exists
            if (!activeItems.incomeSources.has(source)) continue;
          } 
          else if (update.expenses) {
            const item = Object.keys(update.expenses)[0];
            itemName = item;
            itemCategory = item;
            amount = Number(update.expenses[item]);
            
            // Determine if Needs or Wants
            if (activeItems.needs.has(item)) {
              uniqueKey = `NEEDS-${item}`;
            } else if (activeItems.wants.has(item)) {
              uniqueKey = `WANTS-${item}`;
            } else {
              continue; // Item deleted
            }
          } 
          else if (update.savingsAllocation) {
            const item = Object.keys(update.savingsAllocation)[0];
            itemName = item;
            itemCategory = item;
            amount = Number(update.savingsAllocation[item]);
            uniqueKey = `SAVINGS-${item}`;
            
            // Check if still exists
            if (!activeItems.savings.has(item)) continue;
          }
        }
        // Extract Asset Activities
        else if (notif.type === "ASSET" && notif.metadata?.itemName) {
          itemName = notif.metadata.itemName;
          itemCategory = notif.metadata.itemName;
          amount = Number(notif.metadata?.value || 0);
          uniqueKey = `ASSET-${itemName}`;
          
          // Check if still exists (asset could be in accountAssets or be a description)
          // For assets, we check the description field
          const assetExists = notif.metadata?.description && 
            (activeItems.assets.has(notif.metadata.description) || 
             notif.metadata?.assetId); // If has assetId, it's a real asset
          
          if (!assetExists && !notif.metadata?.assetId) continue;
        }

        // Skip if no amount
        if (Math.abs(amount) <= 0) continue;

        // Deduplication: Only keep the LATEST entry for each unique item
        if (!activityMap.has(uniqueKey)) {
          activityMap.set(uniqueKey, {
            id: notif.id,
            date: notif.createdAt,
            description: itemName,
            category: itemCategory,
            amount: amount,
            isEvent: true,
            type: activityType,
          });
        }
      }

      const eventActivities = Array.from(activityMap.values());

      // Combine and sort all activities
      const combined = [...txActivities, ...eventActivities]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      console.log("✅ Recent Activity Summary:", {
        spending: txActivities.length,
        budgetingAndAssets: eventActivities.length,
        total: combined.length,
        showing: Math.min(5, combined.length)
      });

      // Keep only 5 most recent
      setRecentActivity(combined.slice(0, 5));
    } catch (error) {
      console.error("Failed to load dashboard", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = async () => {
    if (
      !quickAddForm.description ||
      !quickAddForm.amount ||
      !quickAddForm.category
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const isIncome = setup?.incomeSources.includes(quickAddForm.category);
      const finalAmount = isIncome
        ? Math.abs(Number(quickAddForm.amount))
        : -Math.abs(Number(quickAddForm.amount));

      await createSpending({
        description: quickAddForm.description,
        amount: finalAmount,
        category: quickAddForm.category,
        date: new Date(quickAddForm.date).toISOString(),
      });

      toast.success("Transaction Added");
      setIsAddOpen(false);
      setQuickAddForm({
        description: "",
        amount: "",
        category: "",
        date: format(new Date(), "yyyy-MM-dd"),
      });
      fetchDashboardData(); // Refresh
    } catch (error) {
      toast.error("Failed to add transaction");
    }
  };

  const filteredActivity = useMemo(() => {
    return recentActivity.filter(
      (item) =>
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, recentActivity]);

  const handleExport = async () => {
    try {
      const toastId = toast.loading("Exporting data...");

      const { spending: allStats } = await getSpending({ limit: 1000 });

      if (!allStats || allStats.length === 0) {
        toast.dismiss(toastId);
        toast.error("No data to export");
        return;
      }

      // Compute CSV
      const headers = ["Date", "Description", "Category", "Amount"];
      const rows = allStats.map((s) => [
        format(new Date(s.date), "yyyy-MM-dd"),
        `"${s.description.replace(/"/g, '""')}"`,
        s.category,
        s.amount.toString(),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((r) => r.join(",")),
      ].join("\n");

      // Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `financial_export_${format(new Date(), "yyyyMMdd")}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.dismiss(toastId);
      toast.success("Download started");
    } catch (e) {
      toast.error("Export failed");
    }
  };

  const [chartRange, setChartRange] = useState("6m");

  useEffect(() => {
    if (rawBudgets.length > 0 || allTransactions.length > 0) {
      setChartData(
        processChartHistory(rawBudgets, chartRange, allTransactions)
      );
    }
  }, [rawBudgets, chartRange, allTransactions]);

  if (!mounted) return null;

  // Format currency helper
  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 transition-colors duration-300">
            {t.welcome}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleExport}
            variant="outline"
            className="w-full sm:w-auto rounded-full px-6 border-border bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 font-semibold transition-all duration-300 hover:shadow-sm cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" /> {t.exportBtn}
          </Button>

          <ResponsiveModal
            open={isAddOpen}
            onOpenChange={setIsAddOpen}
            title={t.modalTitle}
            description={t.modalDesc}
            trigger={
              <Button className="w-full sm:w-auto rounded-full px-6 bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold transition-all hover:scale-105 active:scale-95 border-none duration-300 shadow-sm hover:shadow-md">
                <Plus className="mr-2 h-4 w-4" /> {t.addBtn}
              </Button>
            }
          >
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label
                  htmlFor="desc"
                  className="text-slate-700 dark:text-slate-300 font-bold ml-1"
                >
                  {t.descLabel}
                </Label>
                <Input
                  id="desc"
                  placeholder="e.g. Cinema Tickets"
                  className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 h-11 transition-all duration-300"
                  value={quickAddForm.description}
                  onChange={(e) =>
                    setQuickAddForm({
                      ...quickAddForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="amount"
                    className="text-slate-700 dark:text-slate-300 font-bold ml-1"
                  >
                    {t.amountLabel}
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="50000"
                    className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 h-11 transition-all duration-300"
                    value={quickAddForm.amount}
                    onChange={(e) =>
                      setQuickAddForm({
                        ...quickAddForm,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="category"
                    className="text-slate-700 dark:text-slate-300 font-bold ml-1"
                  >
                    {t.catLabel}
                  </Label>
                  <Select
                    value={quickAddForm.category}
                    onValueChange={(val) =>
                      setQuickAddForm({ ...quickAddForm, category: val })
                    }
                  >
                    <SelectTrigger className="rounded-2xl border-border dark:bg-slate-900 focus:ring-emerald-500 h-11 transition-all duration-300">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border dark:bg-slate-900 max-h-60">
                      {categoryOptions.map((opt) => (
                        <SelectItem
                          key={`${opt.type}-${opt.value}`}
                          value={opt.value}
                          className="cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {opt.type}
                            </span>
                            {opt.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="date"
                  className="text-slate-700 dark:text-slate-300 font-bold ml-1"
                >
                  {t.dateLabel}
                </Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors duration-300" />
                  <Input
                    id="date"
                    type="date"
                    className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 pl-11 h-11 transition-all duration-300"
                    value={quickAddForm.date}
                    onChange={(e) =>
                      setQuickAddForm({ ...quickAddForm, date: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleQuickAdd}
                className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 mt-2 border-none transition-all active:scale-95 duration-300 hover:shadow-sm"
              >
                {t.completeBtn}
              </Button>
            </div>
          </ResponsiveModal>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <StatsCard
          title={t.income}
          amount={fmt(summaryStats.income)}
          trend={summaryStats.incomeTrend}
          positive={true}
          icon={TrendingUp}
          gradient="bg-emerald-50/50"
          borderColor="border-emerald-200 dark:border-emerald-800/50"
          textColor="text-emerald-600"
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          isLoading={isLoading}
          breakdown={summaryStats.incomeBreakdown}
          isHidden={hiddenCards.income}
          onToggleVisibility={() => toggleCardVisibility('income')}
        />
        <StatsCard
          title={t.spending}
          amount={fmt(summaryStats.spending)}
          trend={summaryStats.spendingTrend}
          positive={false}
          icon={TrendingDown}
          gradient="bg-rose-50/50"
          borderColor="border-rose-200 dark:border-rose-800/50"
          textColor="text-rose-600"
          iconBg="bg-rose-100 dark:bg-rose-900/30"
          isLoading={isLoading}
          isHidden={hiddenCards.spending}
          onToggleVisibility={() => toggleCardVisibility('spending')}
        />
        <StatsCard
          title={t.savings}
          amount={fmt(summaryStats.savings)}
          trend={summaryStats.savingsTrend}
          positive={true}
          icon={PiggyBank}
          gradient="bg-sky-50/50"
          borderColor="border-sky-200 dark:border-sky-800/50"
          textColor="text-sky-600"
          iconBg="bg-sky-100 dark:bg-sky-900/30"
          subtitle={`${t.target}: Liquid Assets`}
          isLoading={isLoading}
          isHidden={hiddenCards.savings}
          onToggleVisibility={() => toggleCardVisibility('savings')}
        />
        <StatsCard
          title={t.networth}
          amount={fmt(summaryStats.netWorth)}
          trend={summaryStats.netWorthTrend}
          positive={true}
          icon={Wallet}
          gradient="bg-violet-50/50"
          borderColor="border-violet-200 dark:border-violet-800/50"
          textColor="text-violet-600"
          iconBg="bg-violet-100 dark:bg-violet-900/30"
          isLoading={isLoading}
          isHidden={hiddenCards.netWorth}
          onToggleVisibility={() => toggleCardVisibility('netWorth')}
        />
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-1 xl:grid-cols-7">
        <Card className="xl:col-span-4 border-border rounded-3xl overflow-hidden bg-white dark:bg-slate-900 transition-all duration-500 hover:shadow-sm">
          <CardHeader className="p-6 md:px-10 md:pt-8 md:pb-4 border-b border-border/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">
                  {t.cashflow}
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 font-medium tracking-tight transition-colors duration-300">
                  {t.cashflowDesc}
                </CardDescription>
              </div>
              <Tabs
                value={chartRange}
                onValueChange={setChartRange}
                className="w-full sm:w-fit"
              >
                <TabsList className="w-full sm:w-fit rounded-full bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 transition-all duration-300">
                  <TabsTrigger
                    value="1m"
                    className="flex-1 sm:flex-none rounded-full px-4 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    1M
                  </TabsTrigger>
                  <TabsTrigger
                    value="6m"
                    className="flex-1 sm:flex-none rounded-full px-4 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    6M
                  </TabsTrigger>
                  <TabsTrigger
                    value="12m"
                    className="flex-1 sm:flex-none rounded-full px-4 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    12M
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:px-10 md:pt-2 md:pb-8">
            <div className="h-[350px] w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                </div>
              ) : chartData.length > 0 ? (
                <ChartContainer
                  config={chartConfig}
                  className="h-full w-full animate-in fade-in duration-1000"
                >
                  <BarChart data={chartData}>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                    />
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (!active || !payload || payload.length === 0) return null;
                        
                        return (
                          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-lg">
                            <div className="space-y-1.5">
                              {payload.map((entry: any, index: number) => {
                                const isIncome = entry.dataKey === 'income';
                                const isHidden = isIncome ? hiddenCards.income : hiddenCards.spending;
                                
                                return (
                                  <div key={index} className="flex items-center gap-2">
                                    <div 
                                      className="w-3 h-3 rounded-sm" 
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                      {entry.name}:
                                    </span>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                                      {isHidden ? "••••••" : `Rp ${entry.value?.toLocaleString()}`}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar
                      dataKey="income"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      barSize={
                        chartRange === "1m" ? 60 : chartRange === "6m" ? 32 : 16
                      }
                    />
                    <Bar
                      dataKey="expenses"
                      fill="#ec4899"
                      radius={[4, 4, 0, 0]}
                      barSize={
                        chartRange === "1m" ? 60 : chartRange === "6m" ? 32 : 16
                      }
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <p>No enough data for chart</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-3 border-border rounded-3xl bg-white dark:bg-slate-900 overflow-hidden transition-all duration-500 hover:shadow-sm">
          <CardHeader className="p-6 md:px-10 md:pt-8 md:pb-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">
                {t.activity}
              </CardTitle>
              <Link href="/spending">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800 cursor-pointer transition-all duration-300 hover:shadow-sm"
                >
                  {t.viewAll} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:px-10 md:pt-4 md:pb-8">
            <div className="max-h-[385px] overflow-y-auto pr-2 emerald-scrollbar space-y-4">
              {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                </div>
              ) : filteredActivity.length > 0 ? (
                filteredActivity.map((item: any, idx: number) => {
                  // Determine activity type for proper badge and color
                  const isIncome = !!setup?.incomeSources?.includes(item.description) || 
                                   !!setup?.incomeSources?.includes(item.category);
                  const isNeeds = !!setup?.needs?.includes(item.description) || 
                                  !!setup?.needs?.includes(item.category);
                  const isWants = !!setup?.wants?.includes(item.description) || 
                                  !!setup?.wants?.includes(item.category);
                  const isSavings = !!setup?.savings?.includes(item.description) || 
                                    !!setup?.savings?.includes(item.category);
                  const isAsset = item.type === "ASSET";
                  const isSpending = item.type === "SPENDING";

                  // Determine badge label and color
                  let badgeLabel = t.badgeSpending;
                  let badgeColor = "bg-rose-100 text-rose-700";
                  let typeColor = "text-rose-600 dark:text-rose-400";

                  if (isIncome) {
                    badgeLabel = t.badgeIncome;
                    badgeColor = "bg-emerald-100 text-emerald-700";
                    typeColor = "text-emerald-600";
                  } else if (isNeeds) {
                    badgeLabel = "Needs";
                    badgeColor = "bg-orange-100 text-orange-700";
                    typeColor = "text-orange-600";
                  } else if (isWants) {
                    badgeLabel = "Wants";
                    badgeColor = "bg-pink-100 text-pink-700";
                    typeColor = "text-pink-600";
                  } else if (isSavings) {
                    badgeLabel = t.badgeSavings;
                    badgeColor = "bg-sky-100 text-sky-700";
                    typeColor = "text-sky-600";
                  } else if (isAsset) {
                    badgeLabel = t.badgeAsset;
                    badgeColor = "bg-violet-100 text-violet-700";
                    typeColor = "text-violet-600";
                  }

                  return (
                    <div
                      key={idx}
                      className="flex items-center group cursor-pointer border-b border-slate-50 dark:border-slate-800 pb-4 last:border-0 last:pb-0 transition-all duration-300"
                    >
                    <div className="mr-4 shrink-0">
                      <TransactionIcon
                        category={item.category}
                        isIncome={isIncome}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-none mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                        {item.description}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={cn(
                            "text-[9px] font-black uppercase px-1.5 py-0.5 rounded",
                            badgeColor
                          )}
                        >
                          {badgeLabel}
                        </span>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none">
                          {item.category} •{" "}
                          {format(new Date(item.date), "dd MMMM yyyy")}
                        </p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "font-black text-sm text-right transition-colors duration-300",
                        typeColor
                      )}
                    >
                      {item.amount > 0 ? "+" : "-"} Rp{" "}
                      {Math.abs(item.amount).toLocaleString()}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400 italic">
                <p>No activity found</p>
              </div>
            )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  amount,
  trend,
  positive,
  icon: Icon,
  gradient,
  borderColor,
  textColor,
  iconBg,
  subtitle,
  isLoading,
  breakdown,
  isHidden,
  onToggleVisibility,
}: any) {
  return (
    <Card
      className={cn(
        "border bg-white dark:bg-slate-900 shadow-none rounded-3xl overflow-hidden relative group transition-all hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer",
        borderColor
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-40 transition-opacity",
          gradient
        )}
      />
      <CardHeader className="p-5 md:p-6 relative z-10 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div
            className={cn(
              "w-11 h-11 rounded-2xl flex items-center justify-center border border-white/50 dark:border-slate-800/50 shadow-sm",
              iconBg
            )}
          >
            <Icon className={cn("w-5.5 h-5.5", textColor)} />
          </div>

          <div className="flex items-center gap-1">
            {/* Hide/Show Toggle */}
            {onToggleVisibility && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleVisibility}
                className="h-8 w-8 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {isHidden ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </Button>
            )}

            {/* Income Breakdown Info Button */}
            {breakdown && breakdown.length > 0 && !isHidden && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2">
                  <DropdownMenuLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 py-1.5">
                    Income Sources
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="-mx-1 my-1" />
                  <div className="max-h-[200px] overflow-y-auto emerald-scrollbar">
                    {breakdown.map((item: any, idx: number) => (
                      <DropdownMenuItem
                        key={idx}
                        className="flex justify-between items-center py-2.5 px-2 rounded-xl cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800"
                      >
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-emerald-600 tabular-nums">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(item.amount)}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Trend Badge - Optional (Hidden if Breakdown exists or just default hidden as before) */}
          {/* {!breakdown && <div className={cn(...) }>{trend}</div>} */}
        </div>
        <CardTitle className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 md:p-6 pt-0 relative z-10">
        {isLoading ? (
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        ) : isHidden ? (
          <div className="text-xl sm:text-2xl font-black text-slate-400 dark:text-slate-600 tracking-tight">
            ••••••
          </div>
        ) : (
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {amount}
          </div>
        )}
        {subtitle && !isHidden && (
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1.5 uppercase tracking-wide">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
