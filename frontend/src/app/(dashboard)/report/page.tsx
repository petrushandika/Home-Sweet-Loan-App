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
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
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
  const langKey = language as keyof typeof translations;
  const t = translations[langKey].dashboard.report;
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    new Date().getMonth().toString()
  );

  const [barData, setBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [potentialSavings, setPotentialSavings] = useState<string>("Rp 0");
  const [adviceType, setAdviceType] = useState<string>("Strategic");

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
    toast.success("Preparing Report", {
      description: "Opening print dialog...",
    });
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleSimulateAI = async () => {
    if (pieData.length === 0 && barData.length === 0) {
      toast.error("No data to analyze", {
        description: "Please add some transactions for this month first."
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const monthName = translations[langKey].months[parseInt(selectedMonthIndex)];
      const contextSummary = `
        Analysis for ${monthName}:
        - ${pieData.map(d => `${d.name}: Rp ${d.value.toLocaleString()}`).join(', ')}
        - Top 5 Categories: ${barData.map(d => d.fullName).join(', ')}
      `;

      const prompt = `Analyze my financial report for ${monthName} and provide a World-Class Strategic Insight. 
      Data Context: ${contextSummary}. 
      
      Format your response with:
      ### [Strategic Title]
      [A detailed but punchy 2-3 sentence analysis]
      
      * **Action Item 1**: [Description]
      * **Action Item 2**: [Description]
      
      End with a "Strategic Question" to make me think.
      Keep it professional, high-authority, and tactical.`;

      const response = await api.post("/ai/chat", { message: prompt });
      
      const responseData = response.data.data || response.data;
      
      if (response.data.success) {
        const message = responseData.data?.message || responseData.message;
        
        if (!message) throw new Error("No message in response");
        
        setAiInsight(message);
        
        // Extract a "potential savings" number if possible or use a dynamic one
        const matches = message.match(/Rp\s?[\d.]+/g);
        if (matches && matches.length > 0) {
          setPotentialSavings(matches[0]);
        } else {
          setPotentialSavings("Optimized");
        }
        
        setAdviceType(message.toLowerCase().includes('lifestyle') ? 'Lifestyle' : 'Wealth Scaling');
        
        toast.success("AI Analysis Complete", {
          description: "We've generated new strategic insights for your report.",
        });
      } else {
        throw new Error(response.data.message || "Request failed");
      }
    } catch (error) {
      console.error("AI Insight Error:", error);
      toast.error("Failed to generate AI insights");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('###')) {
        return (
          <h3 key={i} className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mt-4 mb-2 first:mt-0 flex items-center gap-2">
            <span className="w-1 h-4 bg-indigo-500 rounded-full" />
            {trimmedLine.replace(/^###\s+/, '')}
          </h3>
        )
      }
      if (/^[*•-]\s/.test(trimmedLine)) {
        const text = trimmedLine.replace(/^[*•-]\s/, '');
        const boldFormatted = text.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-slate-900 dark:text-slate-100 font-bold">{part.slice(2, -2)}</strong>
          }
          return part
        })
        return (
          <div key={i} className="flex gap-2 mb-2 ml-2">
            <span className="text-indigo-500 shrink-0">•</span>
            <span className="flex-1 text-slate-700 dark:text-slate-300 text-sm">{boldFormatted}</span>
          </div>
        )
      }
      const boldFormatted = line.split(/(\*\*.*?\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-bold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>
        }
        return part
      })
      return trimmedLine ? (
        <p key={i} className="mb-3 last:mb-0 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {boldFormatted}
        </p>
      ) : <div key={i} className="h-2" />;
    });
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
              {translations[langKey].months.map((month, index) => (
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
        <div className="space-y-6">
          {!aiInsight ? (
            <div className="p-8 bg-indigo-50/50 dark:bg-indigo-950/10 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Ready to Analyze</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px]">
                  Click the button below to let our AI strategist analyze your {translations[langKey].months[parseInt(selectedMonthIndex)]} data.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-5 bg-linear-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-sm">
                {renderContent(aiInsight)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">
                      Potential Efficiency
                    </p>
                  </div>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {potentialSavings}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-3.5 h-3.5 text-indigo-500" />
                    <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">
                      Strategy Focus
                    </p>
                  </div>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {adviceType}
                  </p>
                </div>
              </div>
            </>
          )}

          <Button
            onClick={handleSimulateAI}
            disabled={isGenerating}
            className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-14 shadow-lg shadow-indigo-200/50 dark:shadow-none mt-2 border-none transition-all active:scale-95 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {isGenerating ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Zap className="mr-2 h-5 w-5 fill-current" />
            )}
            {isGenerating ? t.analyzing : aiInsight ? "Regenerate Analysis" : t.refreshBtn}
          </Button>
        </div>
      </ResponsiveModal>
    </div>
  );
}
