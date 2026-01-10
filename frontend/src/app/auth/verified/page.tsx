
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function VerifiedPage() {
  return (
    <div className="w-full">
      <Card className="rounded-3xl bg-white border border-slate-200">
        <CardContent className="p-6 md:p-8 text-center text-slate-600">
          <div className="space-y-6">
             <div className="text-center py-8 space-y-3 bg-emerald-50/30 rounded-[2.5rem] border border-emerald-100/50 relative overflow-hidden group">
                <Sparkles className="w-16 h-16 text-emerald-400/20 mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                <p className="font-black text-emerald-800 tracking-tight uppercase italic text-2xl relative z-10">Verification Complete</p>
                <p className="text-xs font-black text-emerald-600/60 uppercase tracking-[0.4em] relative z-10">VAULT STATUS: ACTIVE</p>
             </div>
             
             <Link href="/dashboard" className="block">
                <Button className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg transition-all active:scale-95">
                  Go to Dashboard
                </Button>
             </Link>
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
