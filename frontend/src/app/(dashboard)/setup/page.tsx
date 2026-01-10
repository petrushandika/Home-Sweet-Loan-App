
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings2, ShieldCheck, CreditCard, PieChart, Coins, Briefcase } from "lucide-react"
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

export default function SetupPage() {
  const handleSaveCategory = () => {
    toast.success("Category Saved", {
      description: "Successfully added new category to your financial workspace."
    })
  }

  const handleRemove = (name: string) => {
    toast.error("Category Removed", {
      description: `${name} has been deleted from your settings.`
    })
  }
  const setupItems = [
    { title: "Account Summary", icon: CreditCard, color: "text-blue-500", bg: "bg-blue-50", borderColor: "hover:border-blue-200" },
    { title: "Income Sources", icon: Coins, color: "text-emerald-500", bg: "bg-emerald-50", borderColor: "hover:border-emerald-200" },
    { title: "Needs Categories", icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-50", borderColor: "hover:border-orange-200" },
    { title: "Wants Categories", icon: PieChart, color: "text-violet-500", bg: "bg-violet-50", borderColor: "hover:border-violet-200" },
    { title: "Savings Categories", icon: Settings2, color: "text-pink-500", bg: "bg-pink-50", borderColor: "hover:border-pink-200" },
    { title: "Account Assets", icon: Briefcase, color: "text-sky-500", bg: "bg-sky-50", borderColor: "hover:border-sky-200" },
  ]

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Project <span className="text-gradient-money">Setup</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Configure your financial workspace and categories.</p>
        </div>
        
        <ResponsiveModal
          title="Add New Category"
          description="Create a new category for your transactions or assets."
          trigger={
            <Button className="w-full sm:w-auto rounded-full px-6 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-bold shadow-sm transition-all hover:scale-105 active:scale-95">
              <Plus className="mr-2 h-4 w-4" /> New Category
            </Button>
          }
        >
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-700 font-bold ml-1">Category Name</Label>
              <Input id="name" placeholder="e.g. Subscriptions, Side Hustle" className="rounded-2xl border-slate-200 focus-visible:ring-emerald-500" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type" className="text-slate-700 font-bold ml-1">Category Type</Label>
              <Select>
                <SelectTrigger className="rounded-2xl border-slate-200 focus:ring-emerald-500">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200">
                  <SelectItem value="income">Income Source</SelectItem>
                  <SelectItem value="needs">Needs (Fixed)</SelectItem>
                  <SelectItem value="wants">Wants (Flex)</SelectItem>
                  <SelectItem value="savings">Savings / Investment</SelectItem>
                  <SelectItem value="assets">Assets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleSaveCategory}
              type="submit" 
              className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 mt-2 cursor-pointer transition-all active:scale-95"
            >
              Save Category
            </Button>
          </div>
        </ResponsiveModal>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {setupItems.map((item) => (
          <ResponsiveModal 
            key={item.title}
            title={`${item.title} Settings`}
            description={`Manage your ${item.title.toLowerCase()} list and configurations.`}
            trigger={
              <Card className={`border-slate-200 shadow-none rounded-3xl bg-white overflow-hidden group transition-all cursor-pointer border hover:shadow-sm ${item.borderColor}`}>
                <CardHeader className="p-6 md:p-8">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center transition-all border border-transparent group-hover:border-slate-100 group-hover:scale-105`}>
                      <item.icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800">{item.title}</CardTitle>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Settings Module</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8 pt-0">
                  <div className="p-6 md:p-10 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-sm text-slate-400 group-hover:text-slate-600 font-medium italic bg-slate-50/50 group-hover:bg-white transition-all">
                    Configure {item.title}
                  </div>
                </CardContent>
              </Card>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-700">Sample Category 1</span>
                <Button 
                  onClick={() => handleRemove("Sample Category 1")}
                  variant="ghost" 
                  size="sm" 
                  className="text-rose-500 font-bold hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                >
                  Remove
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-700">Sample Category 2</span>
                <Button 
                  onClick={() => handleRemove("Sample Category 2")}
                  variant="ghost" 
                  size="sm" 
                  className="text-rose-500 font-bold hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                >
                  Remove
                </Button>
              </div>
              <div className="p-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 bg-slate-50/50">
                <p className="text-sm font-medium italic">No custom {item.title.toLowerCase()} added yet.</p>
                <Button variant="outline" className="mt-4 rounded-xl border-slate-200 text-slate-600 font-bold">Add One</Button>
              </div>
            </div>
          </ResponsiveModal>
        ))}
      </div>
    </div>
  )
}
