
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const router = useRouter()
  const handleReset = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Password updated!", {
      description: "You can now login with your new password."
    })
    setTimeout(() => router.push("/auth/login"), 2000)
  }

  return (
    <div className="w-full">
      <Card className="rounded-3xl bg-white border border-slate-200">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pass" className="font-bold text-sm text-slate-700 ml-1">New Password</Label>
              <Input id="pass" type="password" placeholder="••••••••" required className="h-12 rounded-2xl border-slate-200 focus:ring-emerald-500 bg-slate-50/30 px-6 font-medium tracking-widest shadow-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="font-bold text-sm text-slate-700 ml-1">Confirm Password</Label>
              <Input id="confirm" type="password" placeholder="••••••••" required className="h-12 rounded-2xl border-slate-200 focus:ring-emerald-500 bg-slate-50/30 px-6 font-medium tracking-widest shadow-sm" />
            </div>
            
            <Button type="submit" className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg transition-all hover:scale-[1.02] active:scale-95 mt-2">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}
