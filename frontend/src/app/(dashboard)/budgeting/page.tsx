"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Wallet, Target, Info, Sparkles } from "lucide-react"
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

export default function BudgetingPage() {
  const { language } = useLanguageStore()
  const t = translations[language].dashboard.budgeting

  const handleInitialize = () => {
    toast.success(t.toastTitle, {
      description: t.toastDesc
    })
  }

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
          <Button variant="outline" className="w-full sm:w-auto rounded-full px-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all">
            <Info className="mr-2 h-4 w-4" /> {t.guidelines}
          </Button>
          
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
                  <SelectTrigger className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus:ring-emerald-500 h-11">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                    <SelectItem value="current" className="cursor-pointer">{t.currentMonth}</SelectItem>
                    <SelectItem value="next" className="cursor-pointer">{t.nextMonth}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="total-income" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.incomeLabel}</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                  <Input id="total-income" placeholder="0" className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus-visible:ring-emerald-500 pl-11 h-11" />
                </div>
              </div>
              <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex gap-4 animate-smooth-in transition-colors">
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
        <Card className="xl:col-span-8 border-slate-200 dark:border-slate-800 shadow-none rounded-[2rem] bg-white dark:bg-slate-900 overflow-hidden border transition-colors duration-300">
          <CardHeader className="p-6 md:p-10">
            <div className="flex items-center gap-5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center transition-colors">
                <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{t.planCardTitle}</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 font-medium transition-colors">{t.planCardDesc}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-10 pt-0">
             <div className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] text-slate-400 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-950/20 font-medium italic transition-all group hover:border-emerald-200 dark:hover:border-emerald-800/50">
                <Wallet className="w-12 h-12 mb-4 opacity-10 dark:opacity-20 transition-opacity group-hover:opacity-30" />
                <p>{t.emptyState}</p>
                <Button variant="link" className="text-emerald-600 dark:text-emerald-400 font-bold mt-2">{t.importBtn}</Button>
             </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4 border-emerald-700 dark:border-emerald-800 shadow-none rounded-[2rem] bg-linear-to-br from-emerald-600 to-emerald-800 dark:from-emerald-800 dark:to-emerald-950 text-white overflow-hidden border relative group transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110 pointer-events-none">
            <Target className="w-32 h-32 text-white" />
          </div>
          <CardHeader className="p-6 md:p-10 relative z-10">
            <CardTitle className="text-2xl font-bold">{t.goalTrackerTitle}</CardTitle>
            <CardDescription className="text-emerald-100/80 dark:text-emerald-400/60 font-medium tracking-tight">{t.goalTrackerDesc}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-10 pt-0 relative z-10 space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-black uppercase tracking-wider">
                <span>{t.savingTarget}</span>
                <span>75%</span>
              </div>
              <div className="h-2.5 w-full bg-white/20 dark:bg-black/20 rounded-full overflow-hidden border border-white/10 dark:border-emerald-900/30 p-0.5 transition-colors">
                <div className="h-full bg-white dark:bg-emerald-500 rounded-full w-3/4 shadow-[0_0_10px_rgba(255,255,255,0.3)] dark:shadow-none" />
              </div>
            </div>
            <div className="space-y-5 pt-4">
              <p 
                className="text-sm font-medium leading-relaxed text-emerald-50 dark:text-emerald-100/80 transition-colors"
                dangerouslySetInnerHTML={{ __html: t.encouragement }}
              />
              <Button className="w-full rounded-2xl bg-white dark:bg-emerald-600 text-emerald-700 dark:text-white font-black hover:bg-emerald-50 dark:hover:bg-emerald-700 border border-transparent transition-all py-6 shadow-sm active:scale-95 border-none">
                {t.viewGoalsBtn}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
