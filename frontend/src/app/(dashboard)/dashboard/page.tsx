"use client"

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Download,
  PiggyBank,
  Plus,
  ArrowRight,
  CalendarIcon
} from "lucide-react"
import { 
  Bar, 
  BarChart, 
  XAxis, 
  CartesianGrid
} from "recharts"
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { ResponsiveModal } from "@/components/responsive-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { toast } from "sonner"
import { useLanguageStore, translations } from "@/store/use-language-store"
import { useSearchStore } from "@/store/use-search-store"
import { useMemo } from "react"

const chartData = [
  { month: "Jan", income: 15400000, expenses: 8200000 },
  { month: "Feb", income: 15400000, expenses: 7100000 },
  { month: "Mar", income: 18000000, expenses: 9800000 },
  { month: "Apr", income: 15400000, expenses: 11200000 },
  { month: "May", income: 16500000, expenses: 8500000 },
  { month: "Jun", income: 15400000, expenses: 9900000 },
]

const ALL_ACTIVITY = [
  { name: "Sembako Bulanan", category: "Needs", amount: "- Rp 850,000", date: "Today, 14:20", color: "text-orange-500", icon: Wallet, bg: "bg-orange-50 dark:bg-orange-950/20" },
  { name: "Coffee & Chill", category: "Wants", amount: "- Rp 45,000", date: "Today, 10:15", color: "text-violet-500", icon: TrendingDown, bg: "bg-violet-50 dark:bg-violet-950/20" },
  { name: "Salary Transfer", category: "Income", amount: "+ Rp 15,400,000", date: "Jan 25", color: "text-emerald-600", icon: TrendingUp, bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  { name: "Netflix Subscription", category: "Wants", amount: "- Rp 186,000", date: "Jan 25", color: "text-violet-500", icon: TrendingDown, bg: "bg-violet-50 dark:bg-violet-950/20" },
  { name: "Supermarket Plaza", category: "Needs", amount: "- Rp 1,240,000", date: "Jan 24", color: "text-orange-500", icon: Wallet, bg: "bg-orange-50 dark:bg-orange-950/20" },
  { name: "Listrik & Air", category: "Needs", amount: "- Rp 450,000", date: "Jan 24", color: "text-orange-500", icon: Wallet, bg: "bg-orange-50 dark:bg-orange-950/20" },
  { name: "Tabungan Emas", category: "Savings", amount: "- Rp 1,000,000", date: "Jan 23", color: "text-rose-500", icon: PiggyBank, bg: "bg-rose-50 dark:bg-rose-950/20" },
  { name: "Gopay Topup", category: "Wants", amount: "- Rp 200,000", date: "Jan 22", color: "text-violet-500", icon: TrendingDown, bg: "bg-violet-50 dark:bg-violet-950/20" },
  { name: "Investasi Saham", category: "Assets", amount: "- Rp 2,500,000", date: "Jan 21", color: "text-sky-600", icon: TrendingUp, bg: "bg-sky-50 dark:bg-sky-950/20" },
  { name: "Dividen Saham", category: "Income", amount: "+ Rp 350,000", date: "Jan 20", color: "text-emerald-600", icon: TrendingUp, bg: "bg-emerald-50 dark:bg-emerald-950/20" },
]

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--income)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--expenses)",
  },
} satisfies ChartConfig

export default function DashboardPage() {
  const { language } = useLanguageStore()
  const t = translations[language].dashboard.summary
  const { query: searchQuery } = useSearchStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredActivity = useMemo(() => {
    return ALL_ACTIVITY.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
  }, [searchQuery])

  const handleExport = () => {
    toast.success(t.toastTitle, {
      description: t.toastDesc
    })
  }

  if (!mounted) return null

  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 transition-colors duration-300">{t.welcome}</p>
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
                <Label htmlFor="desc" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.descLabel}</Label>
                <Input id="desc" placeholder="e.g. Cinema Tickets" className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 h-11 transition-all duration-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.amountLabel}</Label>
                  <Input id="amount" type="number" placeholder="50.000" className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 h-11 transition-all duration-300" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.catLabel}</Label>
                  <Select>
                    <SelectTrigger className="rounded-2xl border-border dark:bg-slate-900 focus:ring-emerald-500 h-11 transition-all duration-300">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-200">
                      <SelectItem value="food" className="cursor-pointer">Food & Drinks</SelectItem>
                      <SelectItem value="transport" className="cursor-pointer">Transport</SelectItem>
                      <SelectItem value="needs" className="cursor-pointer">Needs (Fixed)</SelectItem>
                      <SelectItem value="wants" className="cursor-pointer">Wants (Flex)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.dateLabel}</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors duration-300" />
                  <Input id="date" type="date" className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 pl-11 h-11 transition-all duration-300" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <Button type="submit" className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 mt-2 border-none transition-all active:scale-95 duration-300 hover:shadow-sm">
                {t.completeBtn}
              </Button>
            </div>
          </ResponsiveModal>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <StatsCard 
          title={t.income} 
          amount="Rp 15,400,000" 
          trend="+18%" 
          positive 
          icon={TrendingUp} 
          gradient="bg-emerald-50/50" 
          borderColor="border-emerald-200 dark:border-emerald-800/50"
          textColor="text-emerald-600"
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatsCard 
          title={t.spending} 
          amount="Rp 5,820,000" 
          trend="-7%" 
          positive 
          icon={TrendingDown} 
          gradient="bg-rose-50/50" 
          borderColor="border-rose-200 dark:border-rose-800/50"
          textColor="text-rose-600"
          iconBg="bg-rose-100 dark:bg-rose-900/30"
        />
        <StatsCard 
          title={t.savings} 
          amount="Rp 62,300,000" 
          trend="88%" 
          icon={PiggyBank} 
          gradient="bg-sky-50/50" 
          borderColor="border-sky-200 dark:border-sky-800/50"
          textColor="text-sky-600"
          iconBg="bg-sky-100 dark:bg-sky-900/30"
          subtitle={`${t.target}: DP Rumah`}
        />
        <StatsCard 
          title={t.networth} 
          amount="Rp 184,200,000" 
          trend="+Rp 22M" 
          positive 
          icon={Wallet} 
          gradient="bg-violet-50/50" 
          borderColor="border-violet-200 dark:border-violet-800/50"
          textColor="text-violet-600"
          iconBg="bg-violet-100 dark:bg-violet-900/30"
        />
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-1 xl:grid-cols-7">
        <Card className="xl:col-span-4 border-border rounded-3xl overflow-hidden bg-white dark:bg-slate-900 transition-all duration-500 hover:shadow-sm">
          <CardHeader className="p-6 md:px-10 md:pt-8 md:pb-4 border-b border-border/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">{t.cashflow}</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 font-medium tracking-tight transition-colors duration-300">{t.cashflowDesc}</CardDescription>
              </div>
              <Tabs defaultValue="6m" className="w-full sm:w-fit">
                <TabsList className="w-full sm:w-fit rounded-full bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 transition-all duration-300">
                  <TabsTrigger value="1m" className="flex-1 sm:flex-none rounded-full px-4 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm transition-all duration-300">1M</TabsTrigger>
                  <TabsTrigger value="6m" className="flex-1 sm:flex-none rounded-full px-4 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm transition-all duration-300">6M</TabsTrigger>
                  <TabsTrigger value="1y" className="flex-1 sm:flex-none rounded-full px-4 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm transition-all duration-300">1Y</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:px-10 md:pt-2 md:pb-8">
            <ChartContainer config={chartConfig} className="h-[350px] w-full animate-in fade-in duration-1000">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="expenses" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="xl:col-span-3 border-border rounded-3xl bg-white dark:bg-slate-900 overflow-hidden transition-all duration-500 hover:shadow-sm">
          <CardHeader className="p-6 md:px-10 md:pt-8 md:pb-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">{t.activity}</CardTitle>
              <Link href="/spending">
                <Button variant="ghost" size="sm" className="rounded-full text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800 cursor-pointer transition-all duration-300 hover:shadow-sm">
                  {t.viewAll} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:px-10 md:pt-2 md:pb-8 space-y-4">
            {filteredActivity.length > 0 ? (
              filteredActivity.map((item, idx) => (
                <div key={idx} className="flex items-center group cursor-pointer border-b border-slate-50 dark:border-slate-800 pb-4 last:border-0 last:pb-0 transition-all duration-300">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mr-4 transition-all border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700", item.bg)}>
                    <item.icon className={cn("w-6 h-6", item.color)} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-none mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{item.name}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">{item.category} • {item.date}</p>
                  </div>
                  <div className={cn("font-black text-sm text-right transition-colors duration-300", item.amount.startsWith("+") ? "text-emerald-600" : "text-slate-700 dark:text-slate-300")}>
                    {item.amount}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400 italic">
                <p>No activity found for "{searchQuery}"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
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
  subtitle 
}: any) {
  return (
    <Card className={cn("border bg-white dark:bg-slate-900 shadow-none rounded-3xl overflow-hidden relative group transition-all hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer", borderColor)}>
      <div className={cn("absolute inset-0 opacity-40 transition-opacity", gradient)} />
      <CardHeader className="p-5 md:p-6 relative z-10 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center border border-white/50 dark:border-slate-800/50 shadow-sm", iconBg)}>
            <Icon className={cn("w-5.5 h-5.5", textColor)} />
          </div>
          <div className={cn(
            "text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border shadow-xs transition-transform group-hover:scale-105",
            positive || (trend && trend.startsWith('+')) || (trend && !trend.startsWith('-')) 
              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800" 
              : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800"
          )}>
            {trend}
          </div>
        </div>
        <CardTitle className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-5 md:p-6 pt-0 relative z-10">
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{amount}</div>
        {subtitle && <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1.5 uppercase tracking-wide">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
