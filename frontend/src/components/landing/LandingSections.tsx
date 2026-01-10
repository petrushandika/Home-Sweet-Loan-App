"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  ShieldCheck, 
  Target, 
  Users, 
  Star,
  Sparkles,
  TrendingUp,
  Wallet,
  PieChart,
  Briefcase
} from "lucide-react"
import Link from "next/link"

export const financeLogos = [
  { name: "Bank Central", icon: Wallet },
  { name: "Global Equity", icon: TrendingUp },
  { name: "Secure Asset", icon: ShieldCheck },
  { name: "Smart Wealth", icon: PieChart },
  { name: "Elite Loan", icon: Briefcase },
  { name: "Wealth Flow", icon: BarChart3 },
];

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-20 overflow-hidden bg-[radial-gradient(circle_at_top_left,var(--tw-gradient-stops))] from-emerald-50/30 via-white to-white">
      <div className="absolute top-0 right-0 -mr-40 -mt-20 w-[600px] h-[600px] bg-emerald-50/40 rounded-full blur-[120px] opacity-60 -z-10" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-20 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[120px] opacity-60 -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 animate-smooth-in">
          <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 animate-bounce">
            <Badge className="bg-emerald-600 font-black tracking-widest text-[9px] sm:text-[10px] uppercase">New</Badge>
            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-emerald-800">Next Gen Financial AI Assistant</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] md:leading-[0.9] text-slate-900">
            Manage Your <span className="text-gradient-money italic">Wealth</span> Faster Than Ever.
          </h1>
          
          <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
            Take full control of your family's finances. Automated budgeting, smart asset tracking, and deep insights to achieve your dream home faster.
          </p>
          
          <div className="flex flex-col xs:flex-row gap-4 pt-4">
            <Link href="/auth/register" className="w-full xs:w-auto">
              <Button size="lg" className="w-full rounded-full px-8 sm:px-10 h-14 sm:h-16 text-base sm:text-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-2xl shadow-emerald-200 transition-all hover:scale-105 active:scale-95 group">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full xs:w-auto">
              <Button variant="outline" size="lg" className="w-full rounded-full px-8 sm:px-10 h-14 sm:h-16 text-base sm:text-lg border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 shadow-sm transition-all active:scale-95">
                Watch Demo
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-6 pt-10">
             <div className="flex -space-x-3 sm:-space-x-4">
                {[
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
                  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100&q=80",
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80"
                ].map((src, i) => (
                  <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 sm:border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm hover:z-10 hover:scale-110 transition-all cursor-pointer">
                     <img src={src} alt="Trust Avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <div>
                <div className="flex items-center gap-1">
                   {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-widest mt-1">Join 10,000+ Happy Users</p>
             </div>
          </div>
        </div>
        
        <div className="relative lg:block hidden animate-smooth-in" style={{ animationDelay: '0.2s' }}>
           <div className="bg-slate-900 rounded-[2rem] p-4 shadow-3xl rotate-2 relative z-10 overflow-hidden border-8 border-slate-800">
              <div className="aspect-4/3 bg-slate-800 rounded-[1.5rem] relative overflow-hidden">
                 <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/20 to-blue-500/20" />
                 <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-emerald-400/30 animate-pulse" />
                 <p className="absolute inset-x-0 bottom-8 text-center text-white/50 font-black text-xs uppercase tracking-[0.3em]">System Interactive Proof</p>
              </div>
           </div>
           <div className="absolute top-1/2 -left-12 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-3 z-20 -rotate-6 animate-bounce">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center transition-transform hover:scale-110">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                 </div>
                 <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Profit Grow</span>
              </div>
              <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-3/4 animate-[shimmer_2s_infinite]" />
              </div>
           </div>
        </div>
      </div>
    </section>
  )
}

export function PartnersSection() {
  return (
    <section id="partners" className="py-12 bg-slate-50/80 border-y border-slate-100/50 overflow-hidden pause-on-hover">
      <div className="max-w-7xl mx-auto px-6 relative">
        <p className="text-center text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-6 italic">Trusted by Global Financial Institutions</p>
        <div className="animate-marquee whitespace-nowrap">
          {[...financeLogos, ...financeLogos].map((logo, idx) => (
            <div key={idx} className="inline-flex items-center gap-3 sm:gap-4 mx-8 md:mx-20 opacity-40 hover:opacity-100 transition-opacity group cursor-pointer">
               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-200 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <logo.icon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 group-hover:text-emerald-600" />
               </div>
               <span className="text-lg sm:text-2xl font-black text-slate-800 italic tracking-tighter uppercase">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-emerald-50/20 via-white to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 sm:space-y-6 mb-10 sm:mb-12">
          <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] text-emerald-600 italic">Core Features</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[0.95] md:leading-[0.9]">Everything you need to <br/> <span className="text-gradient-money">Build Wealth</span> effortlessly.</h3>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            We've built all the tools required for a modern family to track, analyze, and optimize every single rupiah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={BarChart3} 
            title="Real-time Tracking" 
            desc="Monitor your recurring expenses and income sources with live updates and beautiful charts." 
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <FeatureCard 
            icon={Target} 
            title="Smart Budgeting" 
            desc="Set monthly goals based on your income and let our AI suggest the best allocation strategy." 
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="Wealth Security" 
            desc="Manage your long-term assets, from property to liquid savings, in one secure vault." 
            color="text-violet-600"
            bg="bg-violet-50"
          />
        </div>
      </div>
    </section>
  )
}

export function PlatformSection() {
  return (
    <section id="platform" className="py-20 bg-emerald-50/50 relative overflow-hidden">
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-80" />
       
       <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 text-center lg:text-left">
             <div className="flex-1 space-y-8 lg:space-y-10 w-full">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[0.95] md:leading-[0.9]">Meet the most <br/><span className="text-emerald-600 italic font-medium">intuitive dashboard</span> on the market.</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
                   {[
                     "Interactive Cash Flow Projections",
                     "Automated Expense Categorization",
                     "Visual Goal Progress Indicators",
                     "One-click PDF Financial Audits"
                   ].map(item => (
                     <div key={item} className="flex items-center gap-4 group">
                        <div className="w-6 h-6 rounded-full bg-white border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-all">
                           <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
                        </div>
                        <span className="text-slate-600 font-bold tracking-tight">{item}</span>
                     </div>
                   ))}
                </div>
                <Link href="/auth/register" className="inline-block">
                  <Button className="rounded-full px-10 h-14 bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-all hover:scale-105 shadow-xl shadow-emerald-200">
                     Go To Dashboard
                  </Button>
                </Link>
             </div>
             
             <div className="flex-1 w-full max-w-2xl">
                <div className="rounded-[2.5rem] border-8 border-slate-950 p-2 bg-slate-900 shadow-3xl shadow-emerald-200">
                   <div className="bg-slate-950 rounded-[2rem] overflow-hidden aspect-video relative border border-slate-800">
                      <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/10 to-blue-500/10 opacity-30" />
                      <div className="p-8 flex items-center justify-center h-full">
                         <div className="text-center space-y-4">
                            <Sparkles className="w-16 h-16 text-emerald-400 mx-auto opacity-50 mb-4" />
                            <p className="text-white font-black text-2xl tracking-tighter uppercase italic">Professional Analytics</p>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Institutional Grade Dashboard</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </section>
  )
}

export function TestimonialsPlaceholder() {
  return (
    <section id="testimonials" className="bg-white">
      {/* Testimonials content goes here */}
    </section>
  )
}

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-emerald-600 relative overflow-hidden">
       {/* Decorative Background Elements */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40" />
       <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -ml-40 -mb-40" />
       
       <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 sm:mb-8 leading-[0.95] md:leading-[0.9]">Ready for Financial <br/><span className="underline decoration-emerald-300 decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8 italic">Freedom</span>?</h2>
          <p className="text-sm sm:text-lg md:text-xl text-emerald-50 mb-8 sm:mb-12 font-medium leading-relaxed max-w-2xl mx-auto opacity-90">
             Start managing your loan and assets like a professional. No credit card required. Clean, simple, and powerful.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="rounded-full px-8 sm:px-12 h-16 sm:h-20 text-lg sm:text-xl bg-white text-emerald-600 font-black hover:bg-emerald-50 shadow-2xl shadow-emerald-900/20 transition-all hover:scale-110 active:scale-95 group">
               Launch Dashboard <Sparkles className="ml-3 w-5 sm:w-6 h-5 sm:h-6 animate-pulse" />
            </Button>
          </Link>
        </div>
      </section>
  )
}

export function FeatureCard({ icon: Icon, title, desc, color, bg }: any) {
  return (
    <div className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-100 hover:border-emerald-100 transition-all group cursor-default">
       <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${bg} flex items-center justify-center mb-6 sm:mb-8 border border-transparent group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color}`} />
       </div>
       <h4 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 sm:mb-4 tracking-tighter italic uppercase">{title}</h4>
       <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed mb-4 sm:mb-6">
          {desc}
       </p>
       <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">
          Learn More <ArrowRight className="w-3 h-3" />
       </div>
    </div>
  )
}
