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
import Link from "next/link";
import { toast } from "sonner";
import { useLanguageStore, translations } from "@/store/use-language-store";
import { useSearchStore } from "@/store/use-search-store";
import { useMemo } from "react";
import { getBudget, getBudgets } from "@/lib/api/budgets";
import { getSpending, createSpending } from "@/lib/api/spending";
import { getAssets } from "@/lib/api/assets";
import { format } from "date-fns";

import { useSetupStore } from "@/store/use-setup-store";

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

  useEffect(() => {
    setMounted(true);
    fetchSetup();
    fetchDashboardData();
  }, []);

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

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const now = new Date();
      const currentMonthStr = format(now, "yyyy-MM");

      // Fetch concurrent data
      const [allBudgets, assetsRes, spendingRes] = await Promise.all([
        getBudgets(), // To build chart history
        getAssets(),
        getSpending({ limit: 10 }), // Get latest 10 transactions
      ]);

      // 1. Process Chart Data (Last 6 Months)
      const processedChartData = processChartHistory(allBudgets);
      setChartData(processedChartData);

      // 2. Process Summary Stats
      // Find current month budget for Income projection
      const currentBudget = allBudgets.find(
        (b: any) => b.yearMonth === currentMonthStr
      );
      const totalIncome = currentBudget?.summary?.totalIncome || 0;

      // Calculate Income Trend (vs Previous Month Budget)
      const prevMonth = new Date();
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevMonthStr = format(prevMonth, "yyyy-MM");
      const prevBudget = allBudgets.find(
        (b: any) => b.yearMonth === prevMonthStr
      );
      const prevIncome = prevBudget?.summary?.totalIncome || 0;
      const incomeTrendVal =
        prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : 0;
      const incomeTrend = `${
        incomeTrendVal > 0 ? "+" : ""
      }${incomeTrendVal.toFixed(0)}%`;

      // Calculate real spending for this month
      const currentMonthSpendingRes = await getSpending({
        startDate: `${currentMonthStr}-01`,
        endDate: `${currentMonthStr}-31`,
        limit: 1000,
      });
      const totalSpendingReal = currentMonthSpendingRes.spending.reduce(
        (acc: number, curr: any) => acc + Number(curr.amount),
        0
      );

      const totalSavings = assetsRes.liquidAssets.reduce(
        (acc: number, curr: any) => acc + Number(curr.value),
        0
      );

      setSummaryStats({
        income: Number(totalIncome),
        spending: totalSpendingReal,
        savings: Number(assetsRes.summary.totalLiquidAssets),
        netWorth: Number(assetsRes.summary.totalAssets),
        incomeTrend: incomeTrend,
        spendingTrend: "+0%",
        savingsTrend: "+0%",
        netWorthTrend: "+0%",
      });

      // 3. Process Activity
      setRecentActivity(spendingRes.spending);
    } catch (error) {
      console.error("Failed to load dashboard", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const processChartHistory = (budgets: any[]) => {
    // Sort budgets by date
    const sorted = [...budgets].sort((a, b) =>
      a.yearMonth.localeCompare(b.yearMonth)
    );
    // Take last 6
    const last6 = sorted.slice(-6);

    // Map to chart format
    // Logic: Income = budget.totalIncome, Expenses = budget.totalExpenses (projected) or needs update from real spending?
    // Review: Dashboard usually shows Budget vs Actual or Income vs Expense history.
    // Let's us Budgeted Income vs Budgeted Expense for simplicity if real spending history isn't easily aggregated without multiple API calls
    return last6.map((b) => ({
      month: format(new Date(b.yearMonth + "-01"), "MMM"),
      income: b.summary?.totalIncome || 0,
      expenses: b.summary?.totalExpenses || 0, // Budgeted expenses
    }));
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

  const handleExport = () => {
    toast.success(t.toastTitle, {
      description: t.toastDesc,
    });
  };

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
              <Tabs defaultValue="6m" className="w-full sm:w-fit">
                <TabsList className="w-full sm:w-fit rounded-full bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 transition-all duration-300">
                  <TabsTrigger
                    value="6m"
                    className="flex-1 sm:flex-none rounded-full px-4 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    6M
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:px-10 md:pt-2 md:pb-8">
            <div className="h-[350px] w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
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
                      barSize={24}
                    />
                    <Bar
                      dataKey="expenses"
                      fill="#ec4899"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
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
          <CardContent className="p-6 md:px-10 md:pt-2 md:pb-8 space-y-4">
            {isLoading ? (
              <div className="h-40 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : filteredActivity.length > 0 ? (
              filteredActivity.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center group cursor-pointer border-b border-slate-50 dark:border-slate-800 pb-4 last:border-0 last:pb-0 transition-all duration-300"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mr-4 transition-all border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    )}
                  >
                    {/* Simplified icon logic for MVP */}
                    <TrendingDown className={cn("w-6 h-6 text-slate-500")} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-none mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                      {item.description}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">
                      {item.category} • {format(new Date(item.date), "dd MMM")}
                    </p>
                  </div>
                  <div className="font-black text-sm text-right transition-colors duration-300 text-slate-700 dark:text-slate-300">
                    {fmt(item.amount)}
                  </div>
                </div>
              ))
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
          {/* Trend Badge - Optional for MVP as real trend needs more data */}
          {/* <div className={cn(
            "text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border shadow-xs transition-transform group-hover:scale-105",
            positive 
              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800" 
              : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800"
          )}>
            {trend}
          </div> */}
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
