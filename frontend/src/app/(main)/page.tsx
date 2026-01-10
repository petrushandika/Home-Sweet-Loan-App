
"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Target, 
  Users, 
  Star,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-40 overflow-hidden bg-white">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -mr-40 -mt-20 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-20 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-smooth-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 animate-bounce">
              <Badge className="bg-emerald-600 font-black tracking-widest text-[10px] uppercase">New</Badge>
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800">Next Gen Financial AI Assistant</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] text-slate-900">
              Manage Your <span className="text-gradient-money italic">Wealth</span> Faster Than Ever.
            </h1>
            
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
              Take full control of your family's finances. Automated budgeting, smart asset tracking, and deep insights to achieve your dream home faster.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-10 h-16 text-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-2xl shadow-emerald-200 transition-all hover:scale-105 active:scale-95 group">
                  Start Your Journey <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#product">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-10 h-16 text-lg border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 shadow-sm transition-all active:scale-95">
                  Watch Demo
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 pt-10">
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                       <Users className="w-6 h-6 text-slate-400" />
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
                <div className="aspect-[4/3] bg-slate-800 rounded-[1.5rem] relative overflow-hidden">
                   {/* This is where the generated mockup image goes */}
                   <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/20 to-blue-500/20" />
                   <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-emerald-400/30 animate-pulse" />
                   <p className="absolute inset-x-0 bottom-8 text-center text-white/50 font-black text-xs uppercase tracking-[0.3em]">System Interactive Proof</p>
                </div>
             </div>
             {/* Decorative Elements */}
             <div className="absolute top-1/2 -left-12 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-3 z-20 -rotate-6 animate-bounce">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-emerald-600" />
                   </div>
                   <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Instant Save</span>
                </div>
                <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-2/3" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-12 italic">Powered by Advanced Technologies</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all">
             {["NEXT.JS 15", "PRISMA ORM", "TAILWIND CSS", "SHADCN UI", "RADIX PRIMITIVES"].map((t) => (
                <span key={t} className="text-xl font-black text-slate-800 italic tracking-tighter">{t}</span>
             ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-24">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-emerald-600 italic">Core Features</h2>
            <h3 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[0.9]">Everything you need to <br/> <span className="text-gradient-money">Build Wealth</span> effortlessly.</h3>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
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

      {/* Product Preview Section */}
      <section id="product" className="py-32 bg-slate-900 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-600/10 via-transparent to-transparent opacity-50" />
         
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20">
               <div className="flex-1 space-y-10">
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[0.9]">Meet the most <br/><span className="text-emerald-400 italic font-medium">intuitive dashboard</span> on the market.</h2>
                  <div className="space-y-6">
                     {[
                       "Interactive Cash Flow Projections",
                       "Automated Expense Categorization",
                       "Visual Goal Progress Indicators",
                       "One-click PDF Financial Audits"
                     ].map(item => (
                       <div key={item} className="flex items-center gap-4 group">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500 transition-all">
                             <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white" />
                          </div>
                          <span className="text-slate-300 font-bold tracking-tight">{item}</span>
                       </div>
                     ))}
                  </div>
                  <Link href="/dashboard" className="inline-block">
                    <Button className="rounded-full px-10 h-14 bg-white text-slate-900 font-black hover:bg-emerald-50 transition-all hover:scale-105">
                       Go To Dashboard
                    </Button>
                  </Link>
               </div>
               
               <div className="flex-1 w-full max-w-2xl">
                  <div className="rounded-[2.5rem] border-8 border-slate-800 p-2 bg-slate-950 shadow-3xl shadow-emerald-900/10">
                     <div className="bg-slate-900 rounded-[2rem] overflow-hidden aspect-video relative">
                        {/* Placeholder for dashboard mockup */}
                        <div className="absolute inset-0 bg-linear-to-tr from-emerald-600 to-blue-600 opacity-10" />
                        <div className="p-8 flex items-center justify-center h-full">
                           <div className="text-center space-y-4">
                              <Sparkles className="w-16 h-16 text-emerald-400 mx-auto opacity-50 mb-4" />
                              <p className="text-white font-black text-2xl tracking-tighter uppercase italic">Ready to Transform?</p>
                              <p className="text-slate-400 text-sm font-medium">Join 500+ users this week</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 bg-white overflow-hidden relative">
         <div className="absolute inset-0 bg-emerald-600 -skew-y-3 translate-y-20 z-0" />
         
         <div className="max-w-4xl mx-auto text-center relative z-10 p-12 md:p-24 rounded-[3rem] bg-emerald-600 text-white shadow-3xl shadow-emerald-200">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">Ready for Financial <br/><span className="underline decoration-emerald-300 decoration-8 underline-offset-8 italic">Freedom</span>?</h2>
            <p className="text-lg md:text-xl text-emerald-50 mb-12 font-medium leading-relaxed max-w-2xl mx-auto opacity-90">
               Start managing your loan and assets like a professional. No credit card required. Clean, simple, and powerful.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="rounded-full px-12 h-20 text-xl bg-white text-emerald-600 font-black hover:bg-emerald-50 shadow-2xl shadow-emerald-900/20 transition-all hover:scale-110 active:scale-95 group">
                 Launch Dashboard <Sparkles className="ml-3 w-6 h-6 animate-pulse" />
              </Button>
            </Link>
         </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc, color, bg }: any) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-100 hover:border-emerald-100 transition-all group cursor-default">
       <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-8 border border-transparent group-hover:scale-110 transition-transform`}>
          <Icon className={`w-7 h-7 ${color}`} />
       </div>
       <h4 className="text-2xl font-black text-slate-800 mb-4 tracking-tight uppercase tracking-tighter italic">{title}</h4>
       <p className="text-slate-500 font-medium leading-relaxed mb-6">
          {desc}
       </p>
       <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">
          Learn More <ArrowRight className="w-3 h-3" />
       </div>
    </div>
  )
}
