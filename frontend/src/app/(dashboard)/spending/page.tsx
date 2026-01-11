"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Filter, ArrowUpRight, History, CalendarIcon, Wallet, TrendingUp, TrendingDown, PiggyBank, X } from "lucide-react"
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useLanguageStore, translations } from "@/store/use-language-store"
import { cn } from "@/lib/utils"
import { useEffect, useState, useMemo } from "react"

const ALL_TRANSACTIONS = [
  { name: "Sembako Bulanan", category: "Needs", amount: -850000, date: "Today, 14:20", color: "text-orange-500", icon: Wallet, bg: "bg-orange-50 dark:bg-orange-950/20" },
  { name: "Coffee & Chill", category: "Wants", amount: -45000, date: "Today, 10:15", color: "text-violet-500", icon: TrendingDown, bg: "bg-violet-50 dark:bg-violet-950/20" },
  { name: "Salary Transfer", category: "Income", amount: 15400000, date: "Jan 25", color: "text-emerald-600", icon: TrendingUp, bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  { name: "Netflix Subscription", category: "Wants", amount: -186000, date: "Jan 25", color: "text-violet-500", icon: TrendingDown, bg: "bg-violet-50 dark:bg-violet-950/20" },
  { name: "Supermarket Plaza", category: "Needs", amount: -1240000, date: "Jan 24", color: "text-orange-500", icon: Wallet, bg: "bg-orange-50 dark:bg-orange-950/20" },
  { name: "Listrik & Air", category: "Needs", amount: -450000, date: "Jan 24", color: "text-orange-500", icon: Wallet, bg: "bg-orange-50 dark:bg-orange-950/20" },
  { name: "Tabungan Emas", category: "Savings", amount: -1000000, date: "Jan 23", color: "text-rose-500", icon: PiggyBank, bg: "bg-rose-50 dark:bg-rose-950/20" },
  { name: "Gopay Topup", category: "Wants", amount: -200000, date: "Jan 22", color: "text-violet-500", icon: TrendingDown, bg: "bg-violet-50 dark:bg-violet-950/20" },
  { name: "Investasi Saham", category: "Assets", amount: -2500000, date: "Jan 21", color: "text-sky-600", icon: TrendingUp, bg: "bg-sky-50 dark:bg-sky-950/20" },
  { name: "Dividen Saham", category: "Income", amount: 350000, date: "Jan 20", color: "text-emerald-600", icon: TrendingUp, bg: "bg-emerald-50 dark:bg-emerald-950/20" },
]

export default function SpendingPage() {
  const { language } = useLanguageStore()
  const t = translations[language].dashboard.spending
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredTransactions = useMemo(() => {
    return ALL_TRANSACTIONS.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === "All" || t.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, filterCategory])

  const handleSave = () => {
    toast.success("Transaction Logged", {
      description: "Successfully updated your monthly spending history."
    })
  }

  const handleReset = () => {
    toast.info("Form Cleared", {
      description: "You can now start fresh with a new entry."
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
        <div className="flex flex-col sm:flex-row gap-3">
           <div className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm focus-within:border-emerald-500/40 focus-within:ring-2 focus-within:ring-emerald-500/5 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full sm:w-32 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 font-medium" 
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <X className="w-3 h-3 text-slate-400" />
                </button>
              )}
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
             <TransactionForm t={t} />
             <Button 
               onClick={handleSave}
               type="submit" 
               className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 mt-6 shadow-lg shadow-emerald-100 dark:shadow-none cursor-pointer transition-all active:scale-95 border-none"
             >
               {t.saveBtn}
             </Button>
           </ResponsiveModal>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 xl:grid-cols-12">
        <Card className="xl:col-span-4 border-slate-200 dark:border-slate-800 shadow-none rounded-3xl bg-white dark:bg-slate-900 overflow-hidden border transition-colors">
          <CardHeader className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
               <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-800 flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-orange-600 dark:text-orange-400" />
               </div>
                <Button 
                  onClick={handleReset}
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer"
                >
                  Reset Form
                </Button>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">{t.quickLog}</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">{t.quickLogDesc}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-0">
             <TransactionForm t={t} />
             <Button 
               onClick={handleSave}
               className="w-full mt-6 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100 text-white font-bold h-12 shadow-sm transition-all active:scale-95 cursor-pointer border-none"
             >
               {t.form.proceed}
             </Button>
          </CardContent>
        </Card>

        <Card className="xl:col-span-8 border-slate-200 dark:border-slate-800 shadow-none rounded-3xl bg-white dark:bg-slate-900 overflow-hidden border transition-colors">
          <CardHeader className="p-6 md:p-8 pb-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-800 flex items-center justify-center">
                     <History className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">{t.history}</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">{t.historyDesc}</CardDescription>
                  </div>
               </div>
               
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className={cn("rounded-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm", filterCategory !== "All" && "border-emerald-500 text-emerald-600")}>
                      <Filter className="mr-2 h-3.5 w-3.5" /> {filterCategory === "All" ? "Filter" : filterCategory}
                    </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent className="rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 w-48 p-2">
                   <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-slate-400 px-3 py-2">Select Category</DropdownMenuLabel>
                   <DropdownMenuSeparator />
                   {["All", "Income", "Needs", "Wants", "Savings", "Assets"].map((cat) => (
                     <DropdownMenuItem 
                       key={cat} 
                       onClick={() => setFilterCategory(cat)}
                       className={cn("rounded-xl font-bold text-sm px-3 py-2.5 cursor-pointer transition-colors", filterCategory === cat ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800")}
                     >
                       {cat}
                     </DropdownMenuItem>
                   ))}
                 </DropdownMenuContent>
               </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-10 pt-4">
             <div className="max-h-[500px] overflow-y-auto pr-6 emerald-scrollbar space-y-6">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((item, idx) => (
                    <div key={idx} className="flex items-center group cursor-pointer border-b border-slate-50 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mr-4 transition-all border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700", item.bg)}>
                        <item.icon className={cn("w-6 h-6", item.color)} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-none mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{item.name}</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">{item.category} • {item.date}</p>
                      </div>
                      <div className={cn("font-black text-sm text-right", item.amount > 0 ? "text-emerald-600" : "text-slate-700 dark:text-slate-300")}>
                        {item.amount > 0 ? "+" : "-"} Rp {Math.abs(item.amount).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400 italic">
                    <p>No transactions found for "{searchQuery}" in {filterCategory}</p>
                  </div>
                )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TransactionForm({ t }: { t: any }) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="desc" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.form.desc}</Label>
        <Input id="desc" placeholder={t.form.descPlaceholder} className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus-visible:ring-emerald-500 h-11" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.form.amount}</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
            <Input id="amount" placeholder="0" className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus-visible:ring-emerald-500 pl-11 h-11" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.form.category}</Label>
          <Select>
            <SelectTrigger className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus:ring-emerald-500 h-11">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
              <SelectItem value="food" className="cursor-pointer">Food & Drinks</SelectItem>
              <SelectItem value="transport" className="cursor-pointer">Transport</SelectItem>
              <SelectItem value="housing" className="cursor-pointer">Housing</SelectItem>
              <SelectItem value="ent" className="cursor-pointer">Entertainment</SelectItem>
              <SelectItem value="other" className="cursor-pointer">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="date" className="text-slate-700 dark:text-slate-300 font-bold ml-1">{t.form.date}</Label>
        <div className="relative">
          <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input id="date" type="date" className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus-visible:ring-emerald-500 pl-11 h-11" defaultValue={new Date().toISOString().split('T')[0]} />
        </div>
      </div>
    </div>
  )
}
