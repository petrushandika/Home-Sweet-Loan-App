
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
      {/* Landing Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
               <span className="text-white font-black text-xl italic leading-none">H</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">
              Home Sweet <span className="text-emerald-600">Loan</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {["Features", "Pricing", "Testimonials", "About"].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors uppercase tracking-widest"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
             <Link href="/dashboard" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-emerald-600 px-4 transition-colors">
                Sign In
             </Link>
             <Link href="/dashboard">
                <Button className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-100 transition-all hover:scale-105 active:scale-95">
                  Get Started
                </Button>
             </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {children}
      </main>

      {/* Landing Footer */}
      <footer className="bg-slate-950 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                 <span className="text-white font-black text-xl italic leading-none">H</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                Home Sweet <span className="text-emerald-400">Loan</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              The ultimate financial companion for Indonesian families. Budgeting, asset tracking, and smart loan management made easy.
            </p>
          </div>
          
          <div>
            <h4 className="font-black uppercase tracking-widest text-emerald-400 text-xs mb-8">Solution</h4>
            <ul className="space-y-4">
              {["Budgeting Tools", "Asset Management", "Financial Reports", "AI Advisor"].map((item) => (
                <li key={item}><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-emerald-400 text-xs mb-8">Company</h4>
            <ul className="space-y-4">
              {["About Us", "Our Story", "Careers", "Press Kit"].map((item) => (
                <li key={item}><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-emerald-400 text-xs mb-8">Support</h4>
            <ul className="space-y-4">
              {["Help Center", "Status Area", "Privacy Policy", "Term of Service"].map((item) => (
                <li key={item}><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-20 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            © 2026 Home Sweet Loan. All rights reserved. Built for Financial Freedom.
          </p>
          <div className="flex items-center gap-6">
             {/* Social Mockups */}
             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 cursor-pointer transition-colors shadow-sm">
                <div className="w-3 h-3 bg-white rounded-xs" />
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 cursor-pointer transition-colors shadow-sm">
                <div className="w-3 h-3 bg-white rounded-full" />
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 cursor-pointer transition-colors shadow-sm">
                <div className="w-3 h-1 bg-white" />
             </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
