
"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Github, LayoutDashboard, ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Simulated login state for frontend design phase
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
      {/* Landing Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black tracking-tighter text-slate-900">
              Home Sweet <span className="text-emerald-600">Loan</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {["Partners", "Features", "Platform", "Testimonials"].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase()}`} 
                className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors uppercase tracking-widest"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
             {isLoggedIn ? (
               <div className="flex items-center gap-4">
                 <div className="hidden sm:flex flex-col items-end">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Pandawa</p>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Pro Member</p>
                 </div>
                 <Link href="/dashboard" className="relative group">
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-100 p-0.5 group-hover:border-emerald-500 transition-all overflow-hidden bg-slate-50">
                       <img 
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80" 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                       />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                 </Link>
                 <Link href="/dashboard">
                    <Button className="hidden sm:flex rounded-full px-6 bg-slate-900 hover:bg-slate-800 text-white font-black shadow-lg transition-all hover:scale-105 active:scale-95 items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                      Dashboard
                    </Button>
                 </Link>
               </div>
             ) : (
               <>
                 <Link href="/auth/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-emerald-600 px-4 transition-colors">
                    Sign In
                 </Link>
                 <Link href="/auth/register">
                    <Button className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-100 transition-all hover:scale-105 active:scale-95">
                      Get Started
                    </Button>
                 </Link>
               </>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16 bg-white">
        {children}
      </main>

      {/* Back to Top */}
      <Button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl transition-all duration-300 ${showScrollTop ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-50'}`}
      >
        <ArrowUp className="w-6 h-6" />
      </Button>

      {/* Landing Footer */}
      <footer className="bg-white text-slate-900 py-12 md:py-16 px-6 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-black tracking-tighter text-slate-900">
                Home Sweet <span className="text-emerald-600">Loan</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
              The ultimate financial companion for Indonesian families. Budgeting, asset tracking, and smart loan management made easy.
            </p>
          </div>
          
          <div>
            <h4 className="font-black uppercase tracking-widest text-emerald-600 text-[10px] mb-6 italic">Solution</h4>
            <ul className="space-y-3">
              {["Budgeting Tools", "Asset Management", "Financial Reports", "AI Advisor"].map((item) => (
                <li key={item}><Link href="#" className="text-slate-500 hover:text-emerald-600 transition-colors text-sm font-bold">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-emerald-600 text-[10px] mb-6 italic">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Our Story", "Careers", "Press Kit"].map((item) => (
                <li key={item}><Link href="#" className="text-slate-500 hover:text-emerald-600 transition-colors text-sm font-bold">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-emerald-600 text-[10px] mb-6 italic">Support</h4>
            <ul className="space-y-3">
              {["Help Center", "Status Area", "Privacy Policy", "Term of Service"].map((item) => (
                <li key={item}><Link href="#" className="text-slate-500 hover:text-emerald-600 transition-colors text-sm font-bold">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
            © 2026 Home Sweet Loan. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
             {[
               { icon: Facebook, href: "#" },
               { icon: Twitter, href: "#" },
               { icon: Instagram, href: "#" },
               { icon: Linkedin, href: "#" },
               { icon: Github, href: "#" }
             ].map((social, i) => (
               <Link key={i} href={social.href} className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 transition-all group">
                  <social.icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
               </Link>
             ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
