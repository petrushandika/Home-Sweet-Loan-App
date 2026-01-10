"use client"

import { CTASection } from "@/components/landing/LandingSections"
import { Star, Quote } from "lucide-react"

export default function TestimonialsPage() {
  return (
    <div className="flex flex-col">
      <div className="bg-slate-50 py-16 text-center border-b border-slate-100">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4 italic uppercase">Success Stories</h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto px-6">
          Real stories from families who transformed their financial future using Home Sweet Loan.
        </p>
      </div>
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Andi Wijaya", role: "Homeowner", text: "Finally a tool that understands the Indonesian market. Managing my KPR has never been easier." },
            { name: "Siti Aminah", role: "Business Owner", text: "The cross-asset tracking is a lifesaver. I can see my business equity and personal savings in one place." },
            { name: "Budi Santoso", role: "Investor", text: "The AI assistant suggested a better repayment plan for my loan that saved me millions." }
          ].map((t, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 relative group hover:bg-white hover:shadow-2xl hover:border-emerald-100 transition-all">
              <Quote className="absolute top-6 right-8 w-10 h-10 text-emerald-100 group-hover:text-emerald-500/20 transition-colors" />
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-600 font-medium leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex flex-col">
                <span className="font-black text-slate-900 uppercase tracking-tighter">{t.name}</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </div>
  )
}
