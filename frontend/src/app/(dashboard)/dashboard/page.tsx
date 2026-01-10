
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

const chartData = [
  { month: "Jan", income: 12500000, expenses: 4200000 },
  { month: "Feb", income: 12500000, expenses: 5100000 },
  { month: "Mar", income: 15000000, expenses: 4800000 },
  { month: "Apr", income: 12500000, expenses: 6200000 },
  { month: "May", income: 13000000, expenses: 4500000 },
  { month: "Jun", income: 14000000, expenses: 4900000 },
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
  const handleExport = () => {
    toast.success("Exporting data...", {
      description: "Your financial data is being prepared for download."
    })
  }

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Financial <span className="text-gradient-money">Summary</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Welcome back, Pandawa! Here's what's happening today.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleExport}
            variant="outline" 
            className="w-full sm:w-auto rounded-full px-6 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold shadow-sm cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
          
          <ResponsiveModal
            title="Add Transaction"
            description="Capture your spending or income quickly."
            trigger={
              <Button className="w-full sm:w-auto rounded-full px-6 bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold shadow-sm transition-all hover:scale-105 active:scale-95">
                <Plus className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            }
          >
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="desc" className="text-slate-700 font-bold ml-1">Description</Label>
                <Input id="desc" placeholder="e.g. Cinema Tickets" className="rounded-2xl border-slate-200 focus-visible:ring-emerald-500 h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount" className="text-slate-700 font-bold ml-1">Amount (Rp)</Label>
                  <Input id="amount" type="number" placeholder="50.000" className="rounded-2xl border-slate-200 focus-visible:ring-emerald-500 h-11" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-slate-700 font-bold ml-1">Category</Label>
                  <Select>
                    <SelectTrigger className="rounded-2xl border-slate-200 focus:ring-emerald-500 h-11">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200">
                      <SelectItem value="food">Food & Drinks</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="needs">Needs (Fixed)</SelectItem>
                      <SelectItem value="wants">Wants (Flex)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date" className="text-slate-700 font-bold ml-1">Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input id="date" type="date" className="rounded-2xl border-slate-200 focus-visible:ring-emerald-500 pl-11 h-11" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <Button type="submit" className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 mt-2">
                Complete Transaction
              </Button>
            </div>
          </ResponsiveModal>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard 
          title="Monthly Income" 
          amount="Rp 12,500,000" 
          trend="+12%" 
          positive 
          icon={TrendingUp} 
          gradient="bg-emerald-50/50" 
          borderColor="border-emerald-200"
          textColor="text-emerald-600"
          iconBg="bg-emerald-100"
        />
        <StatsCard 
          title="Monthly Spending" 
          amount="Rp 4,230,000" 
          trend="-4%" 
          positive 
          icon={TrendingDown} 
          gradient="bg-rose-50/50" 
          borderColor="border-rose-200"
          textColor="text-rose-600"
          iconBg="bg-rose-100"
        />
        <StatsCard 
          title="Total Savings" 
          amount="Rp 45,000,000" 
          trend="82%" 
          icon={PiggyBank} 
          gradient="bg-sky-50/50" 
          borderColor="border-sky-200"
          textColor="text-sky-600"
          iconBg="bg-sky-100"
          subtitle="Target: DP Rumah"
        />
        <StatsCard 
          title="Net Worth" 
          amount="Rp 157,800,000" 
          trend="+Rp 15M" 
          positive 
          icon={Wallet} 
          gradient="bg-violet-50/50" 
          borderColor="border-violet-200"
          textColor="text-violet-600"
          iconBg="bg-violet-100"
        />
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-1 xl:grid-cols-7">
        <Card className="xl:col-span-4 border-slate-200 shadow-none rounded-3xl overflow-hidden bg-white">
          <CardHeader className="p-6 md:p-8 pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">Cash Flow</CardTitle>
                <CardDescription className="text-slate-500 font-medium tracking-tight">Income vs expenses</CardDescription>
              </div>
              <Tabs defaultValue="6m" className="w-full sm:w-fit">
                <TabsList className="w-full sm:w-fit rounded-full bg-slate-100 p-1 border border-slate-200">
                  <TabsTrigger value="1m" className="flex-1 sm:flex-none rounded-full px-4 text-xs font-bold data-[state=active]:shadow-sm">1M</TabsTrigger>
                  <TabsTrigger value="6m" className="flex-1 sm:flex-none rounded-full px-4 text-xs font-bold data-[state=active]:shadow-sm">6M</TabsTrigger>
                  <TabsTrigger value="1y" className="flex-1 sm:flex-none rounded-full px-4 text-xs font-bold data-[state=active]:shadow-sm">1Y</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-6">
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
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

        <Card className="xl:col-span-3 border-slate-200 shadow-none rounded-3xl bg-white overflow-hidden">
          <CardHeader className="p-6 md:p-8 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-800">Recent Activity</CardTitle>
              <Link href="/spending">
                <Button variant="ghost" size="sm" className="rounded-full text-emerald-600 font-bold hover:bg-emerald-50 border border-transparent hover:border-emerald-100 cursor-pointer">
                  View All <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-0 space-y-6">
            {[
              { name: "Sembako Bulanan", category: "Needs", amount: "- Rp 850,000", date: "Today, 14:20", color: "text-orange-500", icon: Wallet, bg: "bg-orange-50" },
              { name: "Coffee & Chill", category: "Wants", amount: "- Rp 45,000", date: "Today, 10:15", color: "text-violet-500", icon: TrendingDown, bg: "bg-violet-50" },
              { name: "Salary Transfer", category: "Income", amount: "+ Rp 12,000,000", date: "Jan 25", color: "text-emerald-600", icon: TrendingUp, bg: "bg-emerald-50" },
              { name: "Listrik & Air", category: "Needs", amount: "- Rp 450,000", date: "Jan 24", color: "text-orange-500", icon: Wallet, bg: "bg-orange-50" },
              { name: "Tabungan Emas", category: "Savings", amount: "- Rp 1,000,000", date: "Jan 23", color: "text-rose-500", icon: PiggyBank, bg: "bg-rose-50" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center group cursor-pointer border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mr-4 transition-all border border-transparent group-hover:border-slate-200", item.bg)}>
                  <item.icon className={cn("w-6 h-6", item.color)} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-800 leading-none mb-1 group-hover:text-emerald-600 transition-colors">{item.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{item.category} • {item.date}</p>
                </div>
                <div className={cn("font-black text-sm text-right", item.amount.startsWith("+") ? "text-emerald-600" : "text-slate-700")}>
                  {item.amount}
                </div>
              </div>
            ))}
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
    <Card className={cn("border bg-white shadow-none rounded-3xl overflow-hidden relative group transition-all hover:border-slate-300 cursor-pointer", borderColor)}>
      <div className={cn("absolute inset-0 opacity-40 transition-opacity", gradient)} />
      <CardHeader className="p-5 md:p-6 relative z-10 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center border border-white/50 shadow-sm", iconBg)}>
            <Icon className={cn("w-5.5 h-5.5", textColor)} />
          </div>
          <div className={cn(
            "text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border shadow-xs transition-transform group-hover:scale-105",
            positive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
          )}>
            {trend}
          </div>
        </div>
        <CardTitle className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-5 md:p-6 pt-0 relative z-10">
        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{amount}</div>
        {subtitle && <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wide">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
