
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CheckCircle2, Star, Users, TrendingUp } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  const getContent = () => {
    if (pathname.includes("login")) return { title: "Secure Access", desc: "Sign in to securely manage your assets and monitor your financial growth." }
    if (pathname.includes("register")) return { title: "Join Elite", desc: "Register your financial account today and start your journey towards total freedom." }
    if (pathname.includes("forgot-password")) return { title: "Account Recovery", desc: "Recover your account access by entering your registered email address below." }
    if (pathname.includes("reset-password")) return { title: "New Protocol", desc: "Establish your new secure master password for all future dashboard access." }
    if (pathname.includes("verify-email")) return { title: "Identity Check", desc: "A verification link has been dispatched. Please check your inbox to continue." }
    if (pathname.includes("verified")) return { title: "Access Granted", desc: "Your identity integrity has been confirmed. You are now authorized to enter." }
    return { title: "Welcome back", desc: "Precision tracking for families who value financial freedom." }
  }

  const page = getContent()

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative selection:bg-emerald-100 selection:text-emerald-900 border-none">

      {/* Background Decorative Gradients - Subtle */}
      <div className="absolute top-0 right-0 -mr-40 -mt-20 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[100px] opacity-40 -z-10" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-20 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-40 -z-10" />
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
        {/* Left Side: Branding & Dynamic Heading */}
        <div className="flex flex-col justify-center py-4 space-y-8 sm:space-y-10 animate-smooth-in">
          <div className="space-y-10">
            <Link href="/" className="inline-block group">
              <span className="text-3xl font-black tracking-tighter text-slate-900 group-hover:text-emerald-600 transition-colors">
                Home Sweet <span className="text-emerald-600 group-hover:text-slate-900 transition-colors">Loan</span>
              </span>
            </Link>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[9px] sm:text-[10px] italic">{page.title}</p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95] md:leading-[0.9] italic">
                   Master Your <br/>
                   <span className="text-emerald-600 underline underline-offset-8 decoration-emerald-100 decoration-4">Financial</span> Destiny.
                </h1>
              </div>
              <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                {page.desc}
              </p>
            </div>

            <div className="space-y-5">
              {[
                { title: "AI-Powered Analysis", desc: "Smarter spending insights" },
                { title: "Wealth Projection", desc: "Predict your future portfolio" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group cursor-default">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-emerald-600 transition-all">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 tracking-tight leading-none uppercase text-xs">{item.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 flex flex-wrap items-center gap-6 justify-between">
             <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                    {[
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
                      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100&q=80"
                    ].map((src, i) => (
                      <div key={i} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center shadow-sm overflow-hidden hover:scale-110 transition-transform cursor-pointer">
                         <img src={src} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                </div>
                <div>
                   <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                   </div>
                   <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Global Trust Index: 4.9/5</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Centered Form Card */}
        <div className="flex flex-col items-center justify-center relative w-full lg:pt-2">
            {/* Mobile-only page header */}
            <div className="lg:hidden mb-6 text-center w-full">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{page.title}</h2>
            </div>
            <div className="w-full max-w-md animate-smooth-in">
                {children}
            </div>
        </div>
      </div>
    </div>
  )
}
