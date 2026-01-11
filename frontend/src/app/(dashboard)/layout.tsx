"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Menu, Bell, Search, Sidebar as SidebarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { useState, useEffect } from "react"

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { BrandGate } from "@/components/brand-gate"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"

import { useSearchStore } from "@/store/use-search-store"
import { useLanguageStore, translations } from "@/store/use-language-store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { language } = useLanguageStore()
  const t = translations[language].dashboard
  const { query, setQuery } = useSearchStore()
  const [open, setOpen] = useState(false) // Mobile sheet state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Desktop sidebar state
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Ctrl+B shortcut to toggle sidebar
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        setIsSidebarOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!mounted) return null

  const handleLogout = () => {
    toast.success("Signed out successfully")
  }

  return (
    <BrandGate>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        {/* Desktop Sidebar with Transition */}
        <div 
           className={`hidden md:flex flex-col border-r border-border bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out w-fit`}
        >
           <Sidebar isCollapsed={!isSidebarOpen} onToggleCollapse={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden relative">
          {/* Header */}
          <header className="h-20 border-b border-border bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 z-30 sticky top-0 transition-all duration-300">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Trigger */}
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden rounded-xl transition-all duration-300 active:scale-95">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 border-r border-border animate-in slide-in-from-left duration-300 [&>button]:hidden">
                  <Sidebar onItemClick={() => setOpen(false)} onClose={() => setOpen(false)} />
                </SheetContent>
              </Sheet>

            {/* Desktop Sidebar Toggle - Removed as it's now internal to sidebar */}
              <div className="hidden md:flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/50 px-4 py-2 rounded-2xl border border-border group focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-emerald-500/50 focus-within:shadow-sm transition-all duration-300">
                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search your finance..." 
                  className="bg-transparent border-none outline-none text-sm font-medium w-64 text-slate-600 dark:text-slate-300 placeholder:text-slate-400"
                />
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-slate-50 dark:bg-slate-900 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="hidden md:flex items-center gap-3">
                 <LanguageToggle />
                 <ThemeToggle />
               </div>
                {/* Desktop Notifications */}
               <div className="hidden md:block">
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl relative hover:bg-slate-100 dark:hover:bg-slate-800 group transition-all duration-300 hover:shadow-sm active:scale-95">
                           <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-emerald-500 transition-colors duration-300" />
                           <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-80 rounded-2xl border-border bg-white dark:bg-slate-900 p-0 shadow-xl animate-in fade-in-0 zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-4 border-b border-border flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
                           <span className="font-black text-xs uppercase tracking-widest text-slate-500">Notifications</span>
                           <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">2 New</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto emerald-scrollbar">
                           {[
                              { id: 1, title: "Payment Successful", desc: "Your payment for Pro Plan was successful.", time: "2m ago", unread: true, type: "success" },
                              { id: 2, title: "New Feature", desc: "Check out the new budgeting tools!", time: "1h ago", unread: true, type: "info" },
                           ].map((notif) => (
                              <div key={notif.id} className={`p-4 border-b border-border last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 ${notif.unread ? 'bg-emerald-50/30 dark:bg-emerald-900/5' : ''}`}>
                                 <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.unread ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                 <div className="space-y-1">
                                    <p className={`text-sm ${notif.unread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-400'}`}>{notif.title}</p>
                                    <p className="text-xs text-slate-500 line-clamp-2">{notif.desc}</p>
                                    <p className="text-[10px] text-slate-400 font-medium pt-1">{notif.time}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                        <div className="p-3 border-t border-border bg-slate-50/50 dark:bg-slate-900 text-center">
                           <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Mark all as read</button>
                        </div>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>

               {/* Mobile Notifications (Sheet) */}
               <div className="md:hidden">
                  <Sheet>
                     <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl relative hover:bg-slate-100 dark:hover:bg-slate-800 group transition-all duration-300 hover:shadow-sm active:scale-95">
                           <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-emerald-500 transition-colors duration-300" />
                           <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
                        </Button>
                     </SheetTrigger>
                     <SheetContent side="bottom" className="rounded-t-[2rem] border-t border-border p-0 bg-white dark:bg-slate-900 h-[85vh]">
                        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-10 rounded-t-[2rem]">
                           <div>
                              <h2 className="text-xl font-black text-slate-900 dark:text-white">Notifications</h2>
                              <p className="text-sm text-slate-500 font-medium">You have 2 unread messages</p>
                           </div>
                           <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                           </div>
                        </div>
                        <div className="overflow-y-auto h-full pb-20 p-4 space-y-2">
                           {[
                              { id: 1, title: "Payment Successful", desc: "Your payment for Pro Plan was successful.", time: "2m ago", unread: true, type: "success" },
                              { id: 2, title: "New Feature", desc: "Check out the new budgeting tools!", time: "1h ago", unread: true, type: "info" },
                           ].map((notif) => (
                              <div key={notif.id} className={`p-5 rounded-2xl border transition-all active:scale-[0.98] flex gap-4 ${notif.unread ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30' : 'bg-white dark:bg-slate-800 border-border'}`}>
                                 <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${notif.unread ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-slate-300'}`} />
                                 <div className="space-y-1.5">
                                    <div className="flex justify-between items-start w-full gap-4">
                                       <p className={`text-base ${notif.unread ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-700 dark:text-slate-300'}`}>{notif.title}</p>
                                       < span className="text-[10px] font-bold text-slate-400 whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{notif.desc}</p>
                                 </div>
                              </div>
                           ))}
                           <div className="pt-4 text-center">
                              <Button variant="outline" className="rounded-full w-full font-bold border-border">{t.markAllRead || "Mark all as read"}</Button>
                           </div>
                        </div>
                     </SheetContent>
                  </Sheet>
               </div>
               
               {/* Desktop User Menu */}
               <div className="hidden md:block">
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-2xl border border-border bg-white/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-500/30 hover:shadow-sm transition-all duration-300 cursor-pointer group active:scale-[0.98]">
                           <div className="flex flex-col items-end">
                              <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">User Petrus</span>
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 rounded-md leading-tight">PREMIUM</span>
                           </div>
                           <div className="w-9 h-9 rounded-xl border border-emerald-100 dark:border-emerald-800 p-0.5 overflow-hidden bg-white dark:bg-slate-900 group-hover:scale-105 transition-transform duration-300">
                              <img 
                                 src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80" 
                                 alt="Profile" 
                                 className="w-full h-full rounded-lg object-cover"
                              />
                           </div>
                        </div>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-2xl border-border bg-white dark:bg-slate-900 p-2 shadow-xl animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 duration-300">
                        <DropdownMenuLabel className="font-bold text-slate-400 text-[10px] uppercase tracking-widest px-3 py-2">{t.accountSettings}</DropdownMenuLabel>
                        <DropdownMenuItem asChild className="rounded-xl cursor-pointer font-bold text-slate-700 dark:text-slate-300 focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-emerald-600 py-2.5 transition-all duration-200">
                           <Link href="/profile" className="flex items-center gap-3 w-full">
                              <User className="w-4 h-4" /> {t.profile.personalInfo}
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl cursor-pointer font-bold text-slate-700 dark:text-slate-300 focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-emerald-600 py-2.5 transition-all duration-200">
                           <Link href="/subscription" className="flex items-center gap-3 w-full">
                              <CreditCard className="w-4 h-4" /> {t.subscription.title.replace(/<[^>]*>/g, '')}
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl cursor-pointer font-bold text-slate-700 dark:text-slate-300 focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-emerald-600 gap-3 py-2.5 transition-all duration-200">
                           <Settings className="w-4 h-4" /> {t.displaySettings}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-2" />
                        <DropdownMenuItem 
                           onClick={handleLogout}
                           className="rounded-xl cursor-pointer font-bold text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30 focus:text-rose-700 gap-3 py-2.5 transition-all duration-200"
                        >
                           <LogOut className="w-4 h-4" /> Sign Out
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>

               {/* Mobile User Menu (Sheet) */}
               <div className="md:hidden">
                  <Sheet>
                     <SheetTrigger asChild>
                        <div className="w-9 h-9 rounded-xl border border-emerald-100 dark:border-emerald-800 p-0.5 overflow-hidden bg-white dark:bg-slate-900 active:scale-95 transition-transform duration-300 cursor-pointer">
                           <img 
                              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80" 
                              alt="Profile" 
                              className="w-full h-full rounded-lg object-cover"
                           />
                        </div>
                     </SheetTrigger>
                     <SheetContent side="bottom" className="rounded-t-[2rem] border-t border-border p-6 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl">
                        <div className="flex flex-col gap-6">
                           <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-border">
                              <div className="w-16 h-16 rounded-2xl border-2 border-emerald-100 dark:border-emerald-800 p-0.5 overflow-hidden bg-white dark:bg-slate-900">
                                 <img 
                                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80" 
                                    alt="Profile" 
                                    className="w-full h-full rounded-xl object-cover"
                                 />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">User Petrus</span>
                                 <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg leading-tight w-fit mt-1">PREMIUM PLAN</span>
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-3">
                              <SheetClose asChild>
                                 <Link href="/profile" className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-border active:scale-95 transition-all hover:border-emerald-500/50 hover:shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                       <User className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-xs text-slate-700 dark:text-site-200">{t.profile.personalInfo}</span>
                                 </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                 <Link href="/subscription" className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-border active:scale-95 transition-all hover:border-emerald-500/50 hover:shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                       <CreditCard className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-xs text-slate-700 dark:text-site-200">Subscription</span>
                                 </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                 <Link href="/profile" className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-border active:scale-95 transition-all hover:border-emerald-500/50 hover:shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                       <Settings className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-xs text-slate-700 dark:text-site-200">{t.displaySettings}</span>
                                 </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                 <button onClick={handleLogout} className="flex flex-col items-center justify-center gap-2 p-4 bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900 active:scale-95 transition-all hover:border-rose-300">
                                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center">
                                       <LogOut className="w-5 h-5" />
                                    </div>
                                    <span className="font-black text-xs text-rose-600">Sign Out</span>
                                 </button>
                              </SheetClose>
                           </div>
                        </div>
                     </SheetContent>
                  </Sheet>
               </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-5 md:p-10 bg-background dark:bg-slate-950 transition-colors duration-500 emerald-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </div>
      </div>
      <ChatbotWidget />
    </BrandGate>
  )
}

