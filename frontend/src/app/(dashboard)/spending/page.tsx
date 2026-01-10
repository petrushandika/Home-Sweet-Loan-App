
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Filter, ArrowUpRight, History, CalendarIcon } from "lucide-react"
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

export default function SpendingPage() {
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
  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Spending <span className="text-gradient-money">Tracker</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Log your daily transactions and monitor budget usage.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
           <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-white rounded-full border border-slate-200 shadow-sm focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/5 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search logs..." className="bg-transparent border-none outline-none text-sm w-32 text-slate-700 placeholder:text-slate-400 font-medium" />
           </div>
           
           <ResponsiveModal
             title="New Transaction"
             description="Record a new expense or income."
             trigger={
               <Button className="w-full sm:w-auto rounded-full px-6 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-bold shadow-sm transition-all hover:scale-105 active:scale-95">
                 <Plus className="mr-2 h-4 w-4" /> Add Transaction
               </Button>
             }
           >
             <TransactionForm />
             <Button 
               onClick={handleSave}
               type="submit" 
               className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 mt-6 shadow-lg shadow-emerald-100 cursor-pointer transition-all active:scale-95"
             >
               Save Transaction
             </Button>
           </ResponsiveModal>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 xl:grid-cols-12">
        <Card className="xl:col-span-4 border-slate-200 shadow-none rounded-3xl bg-white overflow-hidden border">
          <CardHeader className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
               <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-orange-600" />
               </div>
                <Button 
                  onClick={handleReset}
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer"
                >
                  Reset Form
                </Button>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Quick Log</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Enter spending details manually.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-0">
             <TransactionForm />
             <Button 
               onClick={handleSave}
               className="w-full mt-6 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold h-12 shadow-sm transition-all active:scale-95 cursor-pointer"
             >
               Proceed to Log
             </Button>
          </CardContent>
        </Card>

        <Card className="xl:col-span-8 border-slate-200 shadow-none rounded-3xl bg-white overflow-hidden border">
          <CardHeader className="p-6 md:p-8 pb-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                     <History className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-800">Transaction History</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">Your spending logs for this month.</CardDescription>
                  </div>
               </div>
               <Button variant="outline" size="sm" className="rounded-full border-slate-200 bg-white font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
                  <Filter className="mr-2 h-3.5 w-3.5" /> Filter
               </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-10 pt-4">
             <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 bg-slate-50/50 font-medium italic">
               <History className="w-12 h-12 mb-4 opacity-20" />
               <p>No transactions recorded for this period.</p>
               <Button variant="link" className="text-emerald-600 font-bold mt-2">Import from CSV</Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TransactionForm() {
  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="desc" className="text-slate-700 font-bold ml-1">Description</Label>
        <Input id="desc" placeholder="What did you buy?" className="rounded-2xl border-slate-200 focus-visible:ring-emerald-500 h-11" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="amount" className="text-slate-700 font-bold ml-1">Amount</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
            <Input id="amount" placeholder="0" className="rounded-2xl border-slate-200 focus-visible:ring-emerald-500 pl-11 h-11" />
          </div>
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
              <SelectItem value="housing">Housing</SelectItem>
              <SelectItem value="ent">Entertainment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
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
    </div>
  )
}
