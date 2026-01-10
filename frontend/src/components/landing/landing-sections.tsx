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
import { cn } from "@/lib/utils"
import { useLanguageStore, translations } from "@/store/use-language-store"

export const financeLogos = [
  { name: "Bank Central", icon: Wallet },
  { name: "Global Equity", icon: TrendingUp },
  { name: "Secure Asset", icon: ShieldCheck },
  { name: "Smart Wealth", icon: PieChart },
  { name: "Elite Loan", icon: Briefcase },
  { name: "Wealth Flow", icon: BarChart3 },
];

export function HeroSection() {
  const { language } = useLanguageStore()
  const t = translations[language].hero

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-20 overflow-hidden bg-white dark:bg-slate-950 noise transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,var(--tw-gradient-stops))] from-emerald-50/30 dark:from-emerald-950/20 via-white dark:via-slate-950 to-white dark:to-slate-950 -z-10" />
      <div className="absolute top-0 right-0 -mr-40 -mt-20 w-[600px] h-[600px] bg-emerald-50/40 dark:bg-emerald-900/10 rounded-full blur-[120px] opacity-60 -z-10 float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-20 w-[600px] h-[600px] bg-blue-50/40 dark:bg-blue-900/10 rounded-full blur-[120px] opacity-60 -z-10 float" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 animate-smooth-in">
          <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 animate-bounce transition-colors">
            <Badge className="bg-emerald-600 font-black tracking-widest text-[9px] sm:text-[10px] uppercase border-none">{t.new}</Badge>
            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400">{t.ai}</span>
          </div>
          
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] md:leading-[0.9] text-slate-900 dark:text-white transition-colors"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl transition-colors">
            {t.desc}
          </p>
          
          <div className="flex flex-col xs:flex-row gap-4 pt-4">
            <Link href="/auth/register" className="w-full xs:w-auto">
              <Button size="lg" className="w-full rounded-full px-8 sm:px-10 h-14 sm:h-16 text-base sm:text-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 group border-none">
                {t.cta} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full xs:w-auto">
              <Button variant="outline" size="lg" className="w-full rounded-full px-8 sm:px-10 h-14 sm:h-16 text-base sm:text-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all active:scale-95">
                {t.demo}
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
                   <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 sm:border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-sm hover:z-10 hover:scale-110 transition-all cursor-pointer">
                      <img src={src} alt="Trust Avatar" className="w-full h-full object-cover" />
                   </div>
                ))}
             </div>
             <div>
                <div className="flex items-center gap-1">
                   {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mt-1 transition-colors">{t.join}</p>
             </div>
          </div>
        </div>
        
        <div className="relative lg:block hidden animate-smooth-in" style={{ animationDelay: '0.2s' }}>
           <div className="bg-slate-900 dark:bg-black rounded-[2rem] p-4 shadow-3xl rotate-2 relative z-10 overflow-hidden border-8 border-slate-800 dark:border-slate-800/50 transition-colors">
              <div className="aspect-4/3 bg-slate-800 dark:bg-slate-900 rounded-[1.5rem] relative overflow-hidden">
                 <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/20 to-blue-500/20" />
                 <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-emerald-400/30 animate-pulse" />
                 <p className="absolute inset-x-0 bottom-8 text-center text-white/50 font-black text-xs uppercase tracking-[0.3em]">System Interactive Proof</p>
              </div>
           </div>
           <div className="absolute top-1/2 -left-12 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-3 z-20 -rotate-6 animate-bounce transition-colors">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center transition-transform hover:scale-110">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                 </div>
                 <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter">Profit Grow</span>
              </div>
              <div className="h-1.5 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-3/4 animate-[shimmer_2s_infinite]" />
              </div>
           </div>
        </div>
      </div>
    </section>
  )
}

export function PartnersSection() {
  const { language } = useLanguageStore()
  const t = translations[language].partners

  return (
    <section id="partners" className="py-12 bg-slate-50/80 dark:bg-slate-900/50 border-y border-slate-100/50 dark:border-slate-800/50 overflow-hidden pause-on-hover transition-colors">
      <div className="max-w-7xl mx-auto px-6 relative text-center">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mb-6 italic transition-colors">{t.title}</p>
        <div className="animate-marquee whitespace-nowrap">
          {[...financeLogos, ...financeLogos].map((logo, idx) => (
            <div key={idx} className="inline-flex items-center gap-3 sm:gap-4 mx-8 md:mx-20 opacity-40 hover:opacity-100 transition-opacity group cursor-pointer">
               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
                  <logo.icon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
               </div>
               <span className="text-lg sm:text-2xl font-black text-slate-800 dark:text-slate-200 italic tracking-tighter uppercase transition-colors">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  const { language } = useLanguageStore()
  const t = translations[language].features

  const icons = [BarChart3, Target, ShieldCheck]
  const colors = [
    "text-blue-600 dark:text-blue-400",
    "text-emerald-600 dark:text-emerald-400",
    "text-violet-600 dark:text-violet-400"
  ]
  const bgs = [
    "bg-blue-50 dark:bg-blue-900/20",
    "bg-emerald-50 dark:bg-emerald-900/20",
    "bg-violet-50 dark:bg-violet-900/20"
  ]

  return (
    <section id="features" className="py-20 px-6 bg-white dark:bg-slate-950 transition-colors duration-300 noise">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-emerald-50/20 dark:from-emerald-950/10 via-white dark:via-slate-950 to-white dark:to-slate-950 -z-10" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 sm:space-y-6 mb-16 sm:mb-20">
          <div className="inline-block py-1 px-4 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100/50 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] italic transition-colors">{t.badge}</div>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[0.95] md:leading-[0.9] transition-colors"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.cards.map((card, i) => (
            <FeatureCard 
              key={i}
              icon={icons[i]} 
              title={card.title} 
              desc={card.desc} 
              color={colors[i]}
              bg={bgs[i]}
              moreText={t.more}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function PlatformSection() {
  const { language } = useLanguageStore()
  const t = translations[language].platform

  return (
    <section id="platform" className="py-20 bg-emerald-50/50 dark:bg-slate-900/50 relative overflow-hidden noise transition-colors duration-300">
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white dark:from-slate-900 via-transparent to-transparent opacity-80" />
       
       <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 text-center lg:text-left">
             <div className="flex-1 space-y-8 lg:space-y-12 w-full">
                <div className="space-y-4">
                  <h2 
                    className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[0.95] md:leading-[0.9] transition-colors"
                    dangerouslySetInnerHTML={{ __html: t.title }}
                  />
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-xl transition-colors">{t.desc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
                   {t.items.map(item => (
                     <div key={item} className="flex items-center gap-4 group">
                        <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center group-hover:bg-emerald-600 transition-all cursor-pointer">
                           <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 font-bold tracking-tight transition-colors">{item}</span>
                     </div>
                   ))}
                </div>
                <Link href="/auth/register" className="inline-block">
                  <Button className="rounded-full px-10 h-14 bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-all hover:scale-105 shadow-xl shadow-emerald-200 dark:shadow-none border-none">
                     {t.cta}
                  </Button>
                </Link>
             </div>
             
             <div className="flex-1 w-full max-w-2xl">
                <div className="rounded-[2.5rem] border-8 border-slate-950 dark:border-white/5 p-2 bg-slate-900 dark:bg-black shadow-3xl shadow-emerald-200/20 dark:shadow-none transition-colors">
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
    <section id="testimonials" className="bg-white dark:bg-slate-950 transition-colors">
      {/* Testimonials content goes here */}
    </section>
  )
}

export function CTASection() {
  const { language } = useLanguageStore()
  const t = translations[language].cta

  return (
    <section className="py-20 px-4 sm:px-6 bg-emerald-600 relative overflow-hidden transition-colors">
       {/* Decorative Background Elements */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40" />
       <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -ml-40 -mb-40" />
       
       <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
          <h2 
            className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 sm:mb-8 leading-[0.95] md:leading-[0.9]"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="text-sm sm:text-lg md:text-xl text-emerald-50 mb-8 sm:mb-12 font-medium leading-relaxed max-w-2xl mx-auto opacity-90">
             {t.desc}
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="rounded-full px-8 sm:px-12 h-16 sm:h-20 text-lg sm:text-xl bg-white text-emerald-600 font-black hover:bg-emerald-50 shadow-2xl shadow-emerald-900/20 transition-all hover:scale-110 active:scale-95 group border-none">
               {t.button} <Sparkles className="ml-3 w-5 sm:w-6 h-5 sm:h-6 animate-pulse" />
            </Button>
          </Link>
        </div>
      </section>
  )
}

export function FeatureCard({ icon: Icon, title, desc, color, bg, moreText }: any) {
  return (
    <div className="p-8 sm:p-12 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgb(5,150,105,0.08)] hover:border-emerald-200 dark:hover:border-emerald-700 transition-all group cursor-default relative overflow-hidden text-left">
       <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
       
       <div className={cn(
         "w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-all border-none",
         bg
        )}>
          <Icon className={cn("w-7 h-7 sm:w-8 sm:h-8", color)} />
       </div>
       <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter italic uppercase transition-colors">{title}</h4>
       <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 transition-colors">
          {desc}
       </p>
       <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] transform transition-all group-hover:translate-x-2">
          {moreText} <ArrowRight className="w-3.5 h-3.5" />
       </div>
    </div>
  )
}

export function FeatureCardSkeleton() {
  return (
    <div className="p-8 sm:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-8">
       <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 animate-pulse" />
       <div className="space-y-4">
          <div className="h-8 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="space-y-2">
             <div className="h-4 w-full bg-slate-50 dark:bg-slate-800/50 rounded-md animate-pulse" />
             <div className="h-4 w-5/6 bg-slate-50 dark:bg-slate-800/50 rounded-md animate-pulse" />
             <div className="h-4 w-2/3 bg-slate-50 dark:bg-slate-800/50 rounded-md animate-pulse" />
          </div>
       </div>
       <div className="h-4 w-24 bg-slate-50 dark:bg-slate-800 rounded-md animate-pulse" />
    </div>
  )
}
