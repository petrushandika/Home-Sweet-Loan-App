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
  FileText,
  Download,
  Calendar,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { ResponsiveModal } from "@/components/responsive-modal";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguageStore, translations } from "@/store/use-language-store";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getSetup, SetupConfig } from "@/lib/api/setup";
import { getBudget, Budget } from "@/lib/api/budgets";
import { getSpending, Spending } from "@/lib/api/spending";

export default function ReportPage() {
  const { language } = useLanguageStore();
  const t = translations[language].dashboard.report;
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    new Date().getMonth().toString()
  );

  const [barData, setBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, [selectedMonthIndex]);

  const fetchData = async () => {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const monthIndex = parseInt(selectedMonthIndex);
      const yearMonth = `${currentYear}-${(monthIndex + 1)
        .toString()
        .padStart(2, "0")}`;

      const [setupData, budgetData, spendingData] = await Promise.all([
        getSetup(),
        getBudget(yearMonth),
        getSpending({
          startDate: `${yearMonth}-01`,
          endDate: `${yearMonth}-31`,
          limit: 1000,
        }),
      ]);

      // Process Bar Data (Top 5 Items by Volume)
      const itemMetrics: Record<string, { budget: number; actual: number }> =
        {};

      // Fill budget
      if (budgetData) {
        Object.entries(budgetData.expenses || {}).forEach(([name, amount]) => {
          if (!itemMetrics[name]) itemMetrics[name] = { budget: 0, actual: 0 };
          itemMetrics[name].budget += Number(amount);
        });
        Object.entries(budgetData.savingsAllocation || {}).forEach(
          ([name, amount]) => {
            if (!itemMetrics[name])
              itemMetrics[name] = { budget: 0, actual: 0 };
            itemMetrics[name].budget += Number(amount);
          }
        );
      }

      // Fill actual spending
      spendingData.spending.forEach((s) => {
        const name = s.category; // Assuming category field holds item name
        if (!itemMetrics[name]) itemMetrics[name] = { budget: 0, actual: 0 };
        itemMetrics[name].actual += Number(s.amount);
      });

      const processedBarData = Object.entries(itemMetrics)
        .map(([name, metrics]) => ({
          name: name.substring(0, 10) + (name.length > 10 ? "..." : ""),
          fullName: name,
          budget: metrics.budget,
          actual: metrics.actual,
          totalVolume: metrics.budget + metrics.actual,
        }))
        .sort((a, b) => b.totalVolume - a.totalVolume)
        .slice(0, 5);

      setBarData(processedBarData);

      // Process Pie Data (Needs vs Wants vs Savings)
      const categoryTotals = {
        Needs: 0,
        Wants: 0,
        Savings: 0,
      };

      spendingData.spending.forEach((s) => {
        const name = s.category;
        const amount = Number(s.amount);
        if (setupData.needs.includes(name)) categoryTotals.Needs += amount;
        else if (setupData.wants.includes(name)) categoryTotals.Wants += amount;
        else if (setupData.savings.includes(name))
          categoryTotals.Savings += amount;
      });

      const processedPieData = [
        { name: "Needs", value: categoryTotals.Needs, color: "#10b981" },
        { name: "Wants", value: categoryTotals.Wants, color: "#6366f1" },
        { name: "Savings", value: categoryTotals.Savings, color: "#ec4899" },
      ].filter((d) => d.value > 0);

      setPieData(processedPieData);
    } catch (error) {
      console.error("Failed to fetch report data", error);
      toast.error("Could not load report data");
    }
  };

  const handleDownload = () => {
    toast.success("Report generation started", {
      description: "Your PDF report will be ready in a few seconds.",
    });
  };

  const handleSimulateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("AI Analysis Complete", {
        description: "We've generated new insights for your budget.",
      });
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-10 pb-10 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            {t.desc}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={selectedMonthIndex}
            onValueChange={setSelectedMonthIndex}
          >
            <SelectTrigger className="w-full sm:w-32 rounded-full px-4 border-border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all h-10">
              <div className="flex items-center text-xs">
                <Calendar className="mr-2 h-3.5 w-3.5 text-slate-400" />
                <SelectValue placeholder={t.thisMonth} />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border bg-white dark:bg-slate-900 max-h-64 overflow-y-auto no-scrollbar min-w-(--radix-select-trigger-width)">
              {translations[language].months.map((month, index) => (
                <SelectItem
                  key={index}
                  value={index.toString()}
                  className="cursor-pointer font-bold rounded-xl m-1 text-xs"
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleDownload}
            className="w-full sm:w-auto rounded-full px-6 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-bold shadow-sm transition-all active:scale-95 cursor-pointer border-none"
          >
            <Download className="mr-2 h-4 w-4" /> {t.downloadBtn}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-border shadow-none rounded-3xl bg-white dark:bg-slate-900 overflow-hidden border group transition-all hover:border-slate-400 dark:hover:border-slate-600">
          <CardHeader className="p-6 md:px-10 md:pt-8 md:pb-4">
            <div className="flex items-center gap-5 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-800 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                <FileText className="w-7 h-7 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                  {t.analysisTitle}
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">
                  {t.analysisDesc}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:px-10 md:pb-8 pt-0">
            <div className="h-[300px] w-full bg-slate-50/50 dark:bg-slate-950/20 rounded-3xl p-4 border border-slate-100 dark:border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="budget" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-8 rounded-2xl group/btn py-6 font-bold text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t.detailedBtn}{" "}
              <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none rounded-3xl bg-white dark:bg-slate-900 overflow-hidden border group transition-all hover:border-slate-400 dark:hover:border-slate-600">
          <CardHeader className="p-6 md:px-10 md:pt-8 md:pb-4">
            <div className="flex items-center gap-5 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                <FileText className="w-7 h-7 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                  {t.distTitle}
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">
                  {t.distDesc}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:px-10 md:pb-8 pt-0">
            <div className="h-[300px] w-full bg-slate-50/50 dark:bg-slate-950/20 rounded-3xl p-4 border border-slate-100 dark:border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-8 rounded-2xl group/btn py-6 font-bold text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t.optimizeBtn}{" "}
              <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <ResponsiveModal
        title={t.advisorTitle}
        description={t.advisorDesc}
        trigger={
          <Card className="border-indigo-700 dark:border-indigo-800 rounded-3xl bg-linear-to-r from-indigo-600 to-violet-700 dark:from-indigo-800 dark:to-indigo-950 p-8 md:p-12 text-white overflow-hidden relative border shadow-sm cursor-pointer group hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 p-12 opacity-10 transition-transform group-hover:scale-110">
              <FileText className="w-64 h-64 text-white" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-black mb-5 tracking-tight group-hover:translate-x-1 transition-transform">
                {t.aiTitle}
              </h2>
              <p
                className="text-indigo-50 dark:text-indigo-200 text-base leading-relaxed mb-10 font-medium"
                dangerouslySetInnerHTML={{ __html: t.aiDesc }}
              />
              <Button className="rounded-full px-10 bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white font-black hover:bg-indigo-50 dark:hover:bg-indigo-700 border border-transparent shadow-sm py-6 active:scale-95 transition-all">
                {t.aiBtn}
              </Button>
            </div>
          </Card>
        }
      >
        <div className="space-y-4">
          <div className="p-5 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 italic text-indigo-900 dark:text-indigo-200 font-medium leading-relaxed">
            "We noticed that you spend 15% more on weekends. Try setting a
            specific weekend budget to increase your monthly savings by Rp
            400.000."
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1">
                Potential Savings
              </p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                Rp 1.2M / mo
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1">
                Advice Type
              </p>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                Lifestyle
              </p>
            </div>
          </div>
          <Button
            onClick={handleSimulateAI}
            disabled={isGenerating}
            className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 shadow-lg shadow-indigo-100 dark:shadow-none mt-4 border-none"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? t.analyzing : t.refreshBtn}
          </Button>
        </div>
      </ResponsiveModal>
    </div>
  );
}
