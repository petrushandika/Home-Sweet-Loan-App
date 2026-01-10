"use client"

import { PlatformSection, CTASection } from "@/components/landing/landing-sections"

export default function PlatformPage() {
  return (
    <div className="flex flex-col">
      <div className="bg-emerald-50/30 py-16 text-center border-b border-emerald-100/50">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4 italic uppercase">The Platform</h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto px-6">
          Experience the most intuitive financial dashboard. Built for speed, precision, and complete control over your wealth.
        </p>
      </div>
      <PlatformSection />
      <CTASection />
    </div>
  )
}
