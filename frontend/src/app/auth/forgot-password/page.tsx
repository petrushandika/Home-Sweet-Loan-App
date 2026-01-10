
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const handleReset = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Reset link sent!", { description: "Check your email for instructions." })
  }

  return (
    <div className="w-full">
      <Card className="rounded-3xl bg-white border border-slate-200">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-bold text-sm text-slate-700 ml-1">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                className="h-12 rounded-2xl border-slate-200 focus:ring-emerald-500 bg-slate-50/30 px-5 font-medium" 
              />
            </div>
            
            <Button type="submit" className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg transition-all active:scale-95">
              Send Reset Link
            </Button>
          </form>

          <Link href="/auth/login" className="mt-6 flex items-center justify-center lg:justify-start gap-3 text-sm font-bold text-slate-400 hover:text-emerald-600 transition-all pt-6 border-t border-slate-50">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>
        </CardContent>
      </Card>
      
    </div>
  )
}
