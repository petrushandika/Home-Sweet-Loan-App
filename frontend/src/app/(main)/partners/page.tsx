"use client"

import { PartnersSection, CTASection } from "@/components/landing/LandingSections"

export default function PartnersPage() {
  return (
    <div className="flex flex-col">
      <div className="bg-slate-50 py-16 text-center border-b border-slate-100">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4 italic uppercase">Our Partners</h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto px-6">
          Collaborating with the world's most trusted financial institutions to provide you with secure and seamless wealth management.
        </p>
      </div>
      <PartnersSection />
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              A Global Network of <span className="text-emerald-600">Secure</span> Banking.
            </h2>
            <p className="text-slate-500 leading-relaxed font-medium">
              We integrate directly with leading banks to provide real-time data synchronization. Your security is our top priority, which is why we only partner with institutions that meet our rigorous safety standards.
            </p>
          </div>
          <div className="bg-slate-100 rounded-[2.5rem] p-12 aspect-square flex items-center justify-center border-4 border-white shadow-xl">
             <div className="text-center space-y-4">
                <div className="w-24 h-24 rounded-3xl bg-emerald-600 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
                   <span className="text-white text-4xl font-black italic">H</span>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Institutional Grade</p>
             </div>
          </div>
        </div>
      </div>
      <CTASection />
    </div>
  )
}
