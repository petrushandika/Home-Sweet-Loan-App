"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Wallet, Target, Info, Sparkles, PieChart, ShieldCheck, Heart } from "lucide-react"
import { ResponsiveModal } from "@/components/responsive-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import { useLanguageStore, translations } from "@/store/use-language-store"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export default function BudgetingPage() {
  const { language } = useLanguageStore()
  const t = translations[language].dashboard.budgeting
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInitialize = () => {
    toast.success(t.toastTitle, {
      description: t.toastDesc
    })
  }

  const handleViewGoals = () => {
     toast.info("Wealth Goals", {
       description: "Redirecting to your long-term wealth projection center..."
     })
  }

  if (!mounted) return null

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
              <Button variant="outline" className="w-full sm:w-auto rounded-full px-6 border-border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all border">
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
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800 font-bold text-emerald-600">50%</div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight"><b>Needs:</b> Groceries, housing, utilities, insurance, and minimum debt payments.</p>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-violet-100 dark:border-violet-800 font-bold text-violet-600">30%</div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight"><b>Wants:</b> Dining out, hobbies, subscriptions, and non-essential shopping.</p>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800 font-bold text-emerald-600">20%</div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight"><b>Savings:</b> Debt repayment, emergency fund, and wealth building.</p>
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                     <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Benefit 1</p>
                     <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">Avoid lifestyle creep and overspending.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                     <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Benefit 2</p>
                     <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">Build safety net for unexpected events.</p>
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
                <Label htmlFor="plan-month" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.periodLabel}</Label>
                <Select defaultValue="current">
                  <SelectTrigger className="rounded-2xl border-border dark:bg-slate-900 focus:ring-emerald-500 h-11">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border dark:bg-slate-900">
                    <SelectItem value="current" className="cursor-pointer">{t.currentMonth}</SelectItem>
                    <SelectItem value="next" className="cursor-pointer">{t.nextMonth}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="total-income" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.incomeLabel}</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                  <Input id="total-income" placeholder="0" className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 pl-11 h-11" />
                </div>
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
            <div className="flex items-center gap-4 md:gap-5 mb-2 md:mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center transition-colors shrink-0">
                <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{t.planCardTitle}</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 font-medium transition-colors">{t.planCardDesc}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 md:px-10 md:pb-8 pt-0">
             <div className="space-y-2 lg:max-h-[500px] overflow-y-auto pr-4 emerald-scrollbar">
                {[
                  { name: "Housing & Utilities", allocated: "Rp 3,500,000", spent: "Rp 3,200,000", percent: 91, color: "bg-orange-500", icon: Wallet, bg: "bg-orange-50 dark:bg-orange-950/20" },
                  { name: "Groceries & Food", allocated: "Rp 4,000,000", spent: "Rp 1,850,000", percent: 46, color: "bg-emerald-500", icon: ShieldCheck, bg: "bg-emerald-50 dark:bg-emerald-950/20" },
                  { name: "Fixed Expenses", allocated: "Rp 1,500,000", spent: "Rp 1,450,000", percent: 96, color: "bg-blue-500", icon: Info, bg: "bg-blue-50 dark:bg-blue-950/20" },
                  { name: "Entertainment", allocated: "Rp 1,000,000", spent: "Rp 420,000", percent: 42, color: "bg-violet-500", icon: Heart, bg: "bg-violet-50 dark:bg-violet-950/20" },
                  { name: "Other Spending", allocated: "Rp 1,400,000", spent: "Rp 50,000", percent: 3, color: "bg-slate-400", icon: Target, bg: "bg-slate-50 dark:bg-slate-950/20" },
                ].map((item, idx) => (
                  <div key={idx} className="group py-2 md:py-3 px-3 md:px-5 rounded-2xl md:rounded-3xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-all">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 sm:mb-2">
                       <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all", item.bg)}>
                             <item.icon className={cn("w-5 h-5", item.color.replace('bg-', 'text-'))} />
                          </div>
                          <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-tight text-xs md:text-sm leading-tight">{item.name}</h4>
                       </div>
                       <div className="flex flex-col items-start sm:items-end pl-13 sm:pl-0">
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 tabular-nums leading-none">
                             {item.spent} <span className="text-slate-300 dark:text-slate-600 mx-1">/</span> {item.allocated}
                          </span>
                       </div>
                    </div>
                    <div className="h-1.5 md:h-2.5 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden p-0.5 border border-border transition-colors">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", item.color)} 
                        style={{ width: `${item.percent}%` }} 
                      />
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4 border-emerald-700 dark:border-emerald-800 shadow-none rounded-[2rem] bg-linear-to-br from-emerald-600 to-emerald-800 dark:from-emerald-800 dark:to-emerald-950 text-white overflow-hidden border relative group transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110 pointer-events-none">
            <Target className="w-32 h-32 text-white" />
          </div>
          <CardHeader className="p-6 md:px-10 md:pt-8 md:pb-6 relative z-10">
            <CardTitle className="text-2xl font-bold">{t.goalTrackerTitle}</CardTitle>
            <CardDescription className="text-emerald-100/80 dark:text-emerald-400/60 font-medium tracking-tight">{t.goalTrackerDesc}</CardDescription>
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
  )
}
