"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Github, LayoutDashboard, ArrowUp, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { BrandGate } from "@/components/brand-gate"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguageStore, translations } from "@/store/use-language-store"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { language } = useLanguageStore()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const t = translations[language]

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  if (!mounted) return <BrandGate>{children}</BrandGate>

  const navLinks = [
    { name: t.nav.partners, href: "#partners" },
    { name: t.nav.features, href: "#features" },
    { name: t.nav.platform, href: "#platform" },
    { name: t.nav.testimonials, href: "#testimonials" }
  ]

  return (
    <BrandGate
      fixed={
        <Button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl transition-all duration-300 border-none ${showScrollTop ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-50 pointer-events-none'}`}
        >
          <ArrowUp className="w-6 h-6" />
        </Button>
      }
    >
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-300">
        {/* Landing Navbar */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
                Home Sweet <span className="text-emerald-600">Loan</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-10">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 sm:gap-6">
               <div className="hidden md:flex items-center gap-3 pr-2 border-r border-slate-200 dark:border-slate-800">
                 <LanguageToggle />
                 <ThemeToggle />
               </div>
               
               {isLoggedIn ? (
                 <div className="flex items-center gap-4">
                   <div className="hidden sm:flex flex-col items-end">
                      <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">User</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Pro Member</p>
                   </div>
                   <Link href="/dashboard" className="relative group">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-100 dark:border-emerald-900/30 p-0.5 group-hover:border-emerald-500 transition-all overflow-hidden bg-slate-50 dark:bg-slate-900">
                         <img 
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80" 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover"
                         />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
                   </Link>
                   <Link href="/dashboard" className="hidden sm:block">
                      <Button className="rounded-full px-6 bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-white font-black shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border-none">
                        <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                        {t.nav.dashboard}
                      </Button>
                   </Link>
                 </div>
               ) : (
                 <>
                   <Link href="/auth/login" className="hidden sm:block text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 px-4 transition-colors">
                      {t.nav.signIn}
                   </Link>
                   <Link href="/auth/register" className="hidden sm:block">
                      <Button className="rounded-full px-6 sm:px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-100 dark:shadow-none transition-all hover:scale-105 active:scale-95 border-none">
                        {t.nav.getStarted}
                      </Button>
                   </Link>
                 </>
               )}

               {/* Mobile Menu */}
               <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                 <SheetTrigger asChild>
                   <Button variant="ghost" size="icon" className="xl:hidden hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800">
                     <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
                   </Button>
                 </SheetTrigger>
                 <SheetContent side="right" className="w-80 sm:w-96 dark:bg-slate-950 dark:border-slate-800">
                   <nav className="flex flex-col gap-6 mt-8">
                     <div className="space-y-1">
                       {navLinks.map((item) => (
                         <Link
                           key={item.name}
                           href={item.href}
                           onClick={() => setMobileMenuOpen(false)}
                           className="block py-3 px-4 text-base font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors uppercase tracking-widest"
                         >
                           {item.name}
                         </Link>
                       ))}
                     </div>
                     
                     <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                       <div className="flex items-center gap-3">
                         <LanguageToggle />
                         <ThemeToggle />
                       </div>
                       
                       {!isLoggedIn && (
                         <div className="flex flex-col gap-3 pt-4">
                           <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                             <Button variant="outline" className="w-full rounded-full border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold h-12">
                               {t.nav.signIn}
                             </Button>
                           </Link>
                           <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                             <Button className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg h-12 border-none">
                               {t.nav.getStarted}
                             </Button>
                           </Link>
                         </div>
                       )}
                     </div>
                   </nav>
                 </SheetContent>
               </Sheet>
            </div>
          </div>
        </header>

        <main className="flex-1 pt-16 bg-white dark:bg-slate-950 transition-colors">
          {children}
        </main>

        {/* Landing Footer */}
        <footer className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white py-12 md:py-16 px-6 border-t border-emerald-100 dark:border-slate-800 transition-colors">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
                  Home Sweet <span className="text-emerald-600">Loan</span>
                </span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
                {t.footer.desc}
              </p>
            </div>
            
            <div>
              <h4 className="font-black uppercase tracking-widest text-emerald-600 text-[10px] mb-6 italic">{t.footer.solution}</h4>
              <ul className="space-y-3">
                {["Budgeting Tools", "Asset Management", "Financial Reports", "AI Advisor"].map((item) => (
                  <li key={item}><Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors text-sm font-bold">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black uppercase tracking-widest text-emerald-600 text-[10px] mb-6 italic">{t.footer.company}</h4>
              <ul className="space-y-3">
                {["About Us", "Our Story", "Careers", "Press Kit"].map((item) => (
                  <li key={item}><Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors text-sm font-bold">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black uppercase tracking-widest text-emerald-600 text-[10px] mb-6 italic">{t.footer.support}</h4>
              <ul className="space-y-3">
                {["Help Center", "Status Area"].map((item) => (
                  <li key={item}><Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors text-sm font-bold">{item}</Link></li>
                ))}
                <li><Link href="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors text-sm font-bold">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors text-sm font-bold">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto border-t border-slate-100 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
              {t.footer.rights}
            </p>
            <div className="flex items-center gap-3">
               {[
                 { icon: Facebook, href: "#" },
                 { icon: Twitter, href: "#" },
                 { icon: Instagram, href: "#" },
                 { icon: Linkedin, href: "#" },
                 { icon: Github, href: "#" }
               ].map((social, i) => (
                 <Link key={i} href={social.href} className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 transition-all group">
                    <social.icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                 </Link>
               ))}
            </div>
          </div>
        </footer>
      </div>
    </BrandGate>
  )
}
