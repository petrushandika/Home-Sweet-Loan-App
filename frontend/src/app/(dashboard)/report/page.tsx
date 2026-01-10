
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { ResponsiveModal } from "@/components/responsive-modal"
import { useState } from "react"
import { toast } from "sonner"

export default function ReportPage() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = () => {
    toast.success("Report generation started", {
      description: "Your PDF report will be ready in a few seconds.",
    })
  }

  const handleSimulateAI = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      toast.success("AI Analysis Complete", {
        description: "We've generated new insights for your budget.",
      })
    }, 2000)
  }

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Financial <span className="text-gradient-money">Reports</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Deep dive into your financial habits and trends.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="w-full sm:w-auto rounded-full px-6 border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 shadow-sm cursor-pointer">
            <Calendar className="mr-2 h-4 w-4 text-slate-400" /> This Month
          </Button>
          <Button 
            onClick={handleDownload}
            className="w-full sm:w-auto rounded-full px-6 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-slate-200 shadow-none rounded-3xl bg-white overflow-hidden border group transition-all hover:border-slate-300">
          <CardHeader className="p-6 md:p-10">
            <div className="flex items-center gap-5 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center transition-transform group-hover:scale-105">
                <FileText className="w-7 h-7 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">Monthly Analysis</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Comparison between budget and real spending.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-10 pt-0">
             <div className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-sm text-slate-400 bg-slate-50/50 font-medium italic">
               <FileText className="w-12 h-12 mb-4 opacity-20" />
               Comparison Chart Placeholder
             </div>
             <Button variant="ghost" className="w-full mt-8 rounded-2xl group/btn py-6 font-bold text-slate-600 border border-transparent hover:border-slate-100 hover:bg-slate-50 cursor-pointer">
                Detailed Analysis <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
             </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-none rounded-3xl bg-white overflow-hidden border group transition-all hover:border-slate-300">
          <CardHeader className="p-6 md:p-10">
            <div className="flex items-center gap-5 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center transition-transform group-hover:scale-105">
                <FileText className="w-7 h-7 text-rose-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">Category Distribution</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Where does your money go exactly?</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-10 pt-0">
             <div className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-sm text-slate-400 bg-slate-50/50 font-medium italic">
               <Sparkles className="w-12 h-12 mb-4 opacity-20" />
               Pie Chart Placeholder
             </div>
             <Button variant="ghost" className="w-full mt-8 rounded-2xl group/btn py-6 font-bold text-slate-600 border border-transparent hover:border-slate-100 hover:bg-slate-50 cursor-pointer">
                Optimize Spending <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
             </Button>
          </CardContent>
        </Card>
      </div>

      <ResponsiveModal
        title="AI Financial Advisor"
        description="Personalized insights based on your transaction history."
        trigger={
          <Card className="border-indigo-700 shadow-none rounded-3xl bg-linear-to-r from-indigo-600 to-violet-700 p-8 md:p-12 text-white overflow-hidden relative border shadow-sm cursor-pointer group hover:shadow-xl transition-all">
             <div className="absolute top-0 right-0 p-12 opacity-10 transition-transform group-hover:scale-110">
                <FileText className="w-64 h-64 text-white" />
             </div>
             <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-black mb-5 tracking-tight group-hover:translate-x-1 transition-transform">Smart Financial Insights</h2>
                <p className="text-indigo-50 text-base leading-relaxed mb-10 font-medium">
                  Based on your habits, you could save up to <b className="text-white underline underline-offset-4 decoration-indigo-300">Rp 1.500.000</b> more each month by reducing lifestyle spending in the "Coffee Shop" category.
                </p>
                <Button className="rounded-full px-10 bg-white text-indigo-700 font-black hover:bg-indigo-50 border border-transparent shadow-sm py-6 active:scale-95 transition-all">
                   Generate AI Advice
                </Button>
             </div>
          </Card>
        }
      >
        <div className="space-y-4">
          <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 italic text-indigo-900 font-medium leading-relaxed">
            "We noticed that you spend 15% more on weekends. Try setting a specific weekend budget to increase your monthly savings by Rp 400.000."
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Potential Savings</p>
                <p className="text-lg font-bold text-emerald-600">Rp 1.2M / mo</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Advice Type</p>
                <p className="text-lg font-bold text-indigo-600">Lifestyle</p>
             </div>
          </div>
          <Button 
            onClick={handleSimulateAI}
            disabled={isGenerating}
            className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 shadow-lg shadow-indigo-100 mt-4"
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {isGenerating ? "Analyzing Patterns..." : "Refresh Insights"}
          </Button>
        </div>
      </ResponsiveModal>
    </div>
  )
}
