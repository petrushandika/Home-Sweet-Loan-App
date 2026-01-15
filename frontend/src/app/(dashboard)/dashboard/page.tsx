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
import { getBudget, getBudgets } from "@/lib/api/budgets";
import { getSpending, createSpending } from "@/lib/api/spending";
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
  const t = translations[language].dashboard.summary;
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
      ...setup.incomeSources.map((s) => ({
        label: s,
        value: s,
        type: "Income",
      })),
      ...setup.needs.map((n) => ({ label: n, value: n, type: "Needs" })),
      ...setup.wants.map((w) => ({ label: w, value: w, type: "Wants" })),
      ...setup.savings.map((s) => ({ label: s, value: s, type: "Savings" })),
      ...setup.accountAssets.map((a) => ({
        label: a,
        value: a,
        type: "Assets",
      })),
    ];
  }, [setup]);

  // ... (processChartHistory remains same, keeping it outside or here? It was defined before fetchDashboardData in last edit.
  // Wait, I am replacing a block that includes fetchDashboardData. I need to be careful not to delete processChartHistory if I don't include it.
  // In previous step (2112), processChartHistory is BEFORE fetchDashboardData.
  // The block I am targeting starts at line 107 (useEffect).
  // I will include processChartHistory in the replacement to be safe and ensure order.

  const processChartHistory = (
    budgets: any[],
    range: string,
    transactions: any[] = []
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
        (b: any) => b.yearMonth === currentMonthStr
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
      const breakdown = (setup?.incomeSources || []).map((source) => ({
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

      // 3. Process Activity
      // Merge Transactions and Notifications/Events
      const txActivities = (spendingRes.spending || []).map((s: any) => ({
        ...s,
        isEvent: false,
      }));

      const eventActivities = (notifications || [])
        .filter((n: any) => ["BUDGET", "ASSET", "SYSTEM"].includes(n.type))
        .map((n: any) => ({
          id: n.id,
          date: n.createdAt,
          description: n.message,
          category: n.type,
          amount: Number(n.metadata?.value || 0),
          isEvent: true,
          type: n.type,
        }));

      console.log("📊 Dashboard Activity Debug:", {
        spendingCount: txActivities.length,
        notificationsCount: eventActivities.length,
        totalNotifications: notifications?.length || 0,
        sampleSpending: txActivities.slice(0, 2),
        sampleNotifications: eventActivities.slice(0, 2),
        allNotificationTypes: notifications?.map((n: any) => n.type) || [],
      });

      const combined = [...txActivities, ...eventActivities].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      console.log("✅ Combined activities:", combined.length, "items");

      setRecentActivity(combined.slice(0, 15));
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
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
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
          <CardContent className="p-6 md:px-10 md:pt-4 md:pb-8 space-y-4">
            {isLoading ? (
              <div className="h-40 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            ) : filteredActivity.length > 0 ? (
              filteredActivity.map((item, idx) => {
                const isIncome = !!setup?.incomeSources?.includes(
                  item.category
                );
                const isSavings = !!setup?.savings?.includes(item.category);
                const isAsset =
                  !!setup?.accountAssets?.includes(item.category) ||
                  item.category === "ASSET";
                const isBudget = item.category === "BUDGET";
                const isSystem = item.category === "SYSTEM";

                // Colors based on category type
                let typeColor = "text-rose-600 dark:text-rose-400";
                if (isIncome) typeColor = "text-emerald-600";
                if (isSavings) typeColor = "text-sky-600";
                if (isAsset) typeColor = "text-violet-600";
                if (isBudget) typeColor = "text-amber-600";
                if (isSystem) typeColor = "text-slate-600";

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
                            isIncome
                              ? "bg-emerald-100 text-emerald-700"
                              : isSavings
                              ? "bg-sky-100 text-sky-700"
                              : isAsset
                              ? "bg-violet-100 text-violet-700"
                              : isBudget
                              ? "bg-amber-100 text-amber-700"
                              : isSystem
                              ? "bg-slate-100 text-slate-700"
                              : "bg-rose-100 text-rose-700"
                          )}
                        >
                          {isIncome
                            ? t.badgeIncome
                            : isSavings
                            ? t.badgeSavings
                            : isAsset
                            ? t.badgeAsset
                            : isBudget
                            ? t.badgeBudget
                            : isSystem
                            ? "System"
                            : t.badgeSpending}
                        </span>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none">
                          {item.category} •{" "}
                          {format(new Date(item.date), "dd MMM")}
                        </p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "font-black text-sm text-right transition-colors duration-300",
                        isIncome
                          ? "text-emerald-600"
                          : isBudget
                          ? "text-amber-600"
                          : typeColor
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

          {/* Income Breakdown Info Button */}
          {breakdown && breakdown.length > 0 && (
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
        ) : (
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {amount}
          </div>
        )}
        {subtitle && (
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1.5 uppercase tracking-wide">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
