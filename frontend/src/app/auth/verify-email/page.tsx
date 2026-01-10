
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, RefreshCcw } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)

  const handleResend = () => {
    setIsResending(true)
    setTimeout(() => {
        setIsResending(false)
        toast.success("Verification Sent", {
          description: "A new link has been sent to your inbox."
        })
    }, 1500)
  }

  return (
    <div className="w-full">
      <Card className="rounded-3xl bg-white border border-slate-200">
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 italic text-sm text-center font-bold text-slate-400">
             Didn't receive the email? Check your spam folder or resend below.
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleResend}
              disabled={isResending}
              className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg transition-all active:scale-95"
            >
              {isResending ? "Resending..." : "Resend Link"}
            </Button>

            <Button 
              variant="outline"
              className="w-full h-12 rounded-2xl border-slate-200 hover:bg-slate-50 font-bold uppercase tracking-widest text-xs text-slate-500 group bg-white hover:border-emerald-200 transition-all px-0"
            >
               Change Email
            </Button>
          </div>
          
          <div className="pt-6 border-t border-slate-50 text-center">
             <Link href="/auth/login" className="text-sm font-bold text-slate-400 hover:text-emerald-600">Back to Login</Link>
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
