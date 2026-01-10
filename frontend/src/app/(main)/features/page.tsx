"use client"

import { FeaturesSection, CTASection } from "@/components/landing/LandingSections"

export default function FeaturesPage() {
  return (
    <div className="flex flex-col">
      <div className="bg-emerald-50/30 py-16 text-center border-b border-emerald-100/50">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4 italic uppercase">Core Features</h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto px-6">
          Explore the powerful tools designed to simplify your financial life. From automated tracking to AI-driven insights, we've got you covered.
        </p>
      </div>
      <FeaturesSection />
      <div className="py-20 bg-slate-50">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {[
              { title: "Smart Alerts", desc: "Get notified before you overspend." },
              { title: "Multi-Currency", desc: "Track assets across any border." },
              { title: "Family Sharing", desc: "Collaborate with your partner." }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:translate-y-[-5px] transition-transform">
                <h4 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight italic">{f.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
         </div>
      </div>
      <CTASection />
    </div>
  )
}
