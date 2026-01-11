"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, PiggyBank, Landmark, Briefcase, TrendingUp, Wallet, Home, Landmark as BankIcon } from "lucide-react"
import { cn } from "@/lib/utils"
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
import { useEffect, useState } from "react"

export default function AssetsPage() {
  const { language } = useLanguageStore()
  const t = translations[language].dashboard.assets
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRegister = () => {
    toast.success("Asset Registered", {
      description: "Successfully added new item to your wealth portfolio."
    })
  }

  if (!mounted) return null

  return (
    <div className="space-y-10 pb-10 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">{t.desc}</p>
        </div>
        
        <ResponsiveModal
          title={t.modalTitle}
          description={t.modalDesc}
          trigger={
            <Button className="w-full sm:w-auto rounded-full px-6 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-bold shadow-sm transition-all hover:scale-105 active:scale-95 border-none">
              <Plus className="mr-2 h-4 w-4" /> {t.addBtn}
            </Button>
          }
        >
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="asset-name" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.form.name}</Label>
              <Input id="asset-name" placeholder={t.form.namePlaceholder} className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus-visible:ring-emerald-500 h-11" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="asset-type" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.form.type}</Label>
              <Select>
                <SelectTrigger className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus:ring-emerald-500 h-11">
                  <SelectValue placeholder={t.form.typePlaceholder} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                  <SelectItem value="liquid" className="cursor-pointer">Liquid (Cash/Bank)</SelectItem>
                  <SelectItem value="investment" className="cursor-pointer">Investment (Stocks/Crypto)</SelectItem>
                  <SelectItem value="property" className="cursor-pointer">Property / Physical</SelectItem>
                  <SelectItem value="other" className="cursor-pointer">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="asset-value" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.form.value}</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                <Input id="asset-value" placeholder="0" className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus-visible:ring-emerald-500 pl-11 h-11" />
              </div>
            </div>
            <Button 
              onClick={handleRegister}
              type="submit" 
              className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 mt-2 shadow-lg shadow-emerald-100 dark:shadow-none cursor-pointer transition-all active:scale-95 border-none"
            >
              {t.registerBtn}
            </Button>
          </div>
        </ResponsiveModal>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <AssetMiniCard title={t.liquid} amount="Rp 62,300,000" icon={Landmark} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-950/20" border="border-emerald-100 dark:border-emerald-800" />
        <AssetMiniCard title={t.nonLiquid} amount="Rp 121,900,000" icon={Briefcase} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-950/20" border="border-blue-100 dark:border-blue-800" />
        <AssetMiniCard title={t.total} amount="Rp 184,200,000" icon={TrendingUp} color="text-violet-600" bg="bg-violet-50 dark:bg-violet-950/20" border="border-violet-100 dark:border-violet-800" />
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-3xl bg-white dark:bg-slate-900 overflow-hidden border transition-colors">
        <CardHeader className="p-6 md:p-10 pb-4">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center">
                <PiggyBank className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
             </div>
             <div>
               <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">{t.breakdown}</CardTitle>
               <CardDescription className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">{t.breakdownDesc}</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-10 pt-6 space-y-6">
           {[
             { name: "Emergency Fund (BCA)", type: "Liquid", value: "Rp 25,000,000", change: "+Rp 1.2M (Interest)", icon: BankIcon, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
             { name: "Digital Wallet (Gopay/OVO)", type: "Liquid", value: "Rp 2,300,000", change: "-Rp 450k (Spending)", icon: Wallet, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20" },
             { name: "Family Home (DP Paid)", type: "Physical", value: "Rp 115,000,000", change: "+12.5% vs Market", icon: Home, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/20" },
             { name: "Stocks Portfolio (Bibit)", type: "Investment", value: "Rp 35,000,000", change: "-2.4% (Market Dip)", icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/20" },
             { name: "Gold Investment (Antam)", type: "Investment", value: "Rp 6,900,000", change: "+Rp 800k (Gain)", icon: PiggyBank, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/20" },
           ].map((item, idx) => (
             <div key={idx} className="flex items-center group cursor-pointer border-b border-slate-50 dark:border-slate-800 pb-5 last:border-0 last:pb-0">
               <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mr-5 transition-all border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700", item.bg)}>
                 <item.icon className={cn("w-6 h-6", item.color)} />
               </div>
               <div className="flex-1">
                 <h4 className="font-bold text-base text-slate-800 dark:text-white leading-none mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{item.name}</h4>
                 <div className="flex items-center gap-2">
                   <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none">{item.type}</p>
                   <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                   <p className={cn("text-[10px] font-bold uppercase tracking-wide", item.change.startsWith("+") ? "text-emerald-500" : "text-rose-500")}>
                     {item.change}
                   </p>
                 </div>
               </div>
               <div className="text-right">
                 <div className="font-black text-base text-slate-900 dark:text-white tracking-tight">
                   {item.value}
                 </div>
               </div>
             </div>
           ))}
        </CardContent>
      </Card>
    </div>
  )
}

function AssetMiniCard({ title, amount, icon: Icon, color, bg, border }: any) {
  return (
    <Card className={cn("border-slate-200 dark:border-slate-800 shadow-none rounded-3xl bg-white dark:bg-slate-900 p-8 group transition-all border hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer relative overflow-hidden")}>
       <div className={cn("absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20", bg)} />
       <div className="flex items-center gap-4 mb-5 relative z-10">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all border shadow-xs group-hover:scale-105", bg, border)}>
             <Icon className={cn("w-6 h-6", color)} />
          </div>
          <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</span>
       </div>
       <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight relative z-10">{amount}</div>
    </Card>
  )
}
