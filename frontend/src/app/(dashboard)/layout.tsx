"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Separator } from "@/components/ui/separator"
import { Menu, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    toast.success("Logging out...", {
      description: "You have been successfully signed out."
    })
  }

  return (
    <BrandGate>
      <div className="flex h-screen overflow-hidden bg-background dark:bg-slate-950 transition-colors duration-300">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden xl:flex" />

        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Header */}
          <header className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm sticky top-0 z-30">
            <div className="flex items-center gap-4 flex-1">
               {/* Mobile Menu Trigger */}
               <Sheet open={open} onOpenChange={setOpen}>
                 <SheetTrigger asChild>
                   <Button variant="ghost" size="icon" className="xl:hidden hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 cursor-pointer">
                     <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                   </Button>
                 </SheetTrigger>
                 <SheetContent side="left" className="p-0 w-72 dark:bg-slate-900 dark:border-slate-800">
                   <Sidebar className="w-full border-none" onItemClick={() => setOpen(false)} />
                 </SheetContent>
               </Sheet>

               <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-full w-72 border border-slate-200 dark:border-slate-800 focus-within:border-primary/40 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Quick search..." 
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
                  />
               </div>
            </div>

            <div className="flex items-center gap-4">
               {mounted && (
                 <div className="flex items-center gap-3 pr-2 border-r border-slate-200 dark:border-slate-800">
                   <LanguageToggle />
                   <ThemeToggle />
                 </div>
               )}
               
               <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950" />
               </Button>
               <Separator orientation="vertical" className="h-6 dark:bg-slate-800" />
               
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <div className="flex items-center gap-3 pl-2 cursor-pointer group outline-none">
                        <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 p-0.5 group-hover:border-primary/30 transition-colors">
                           <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                              <div className="w-full h-full bg-linear-to-tr from-emerald-500 to-emerald-700" />
                           </div>
                        </div>
                        <div className="hidden sm:flex flex-col">
                           <span className="text-sm font-bold text-slate-800 dark:text-white">User</span>
                           <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Verified User</span>
                        </div>
                     </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl animate-in fade-in-0 zoom-in-95">
                     <DropdownMenuLabel className="font-bold text-slate-400 text-[10px] uppercase tracking-widest px-3 py-2">Account Settings</DropdownMenuLabel>
                     <DropdownMenuItem className="rounded-xl cursor-pointer font-bold text-slate-700 dark:text-slate-300 focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-emerald-600 gap-3 py-2.5">
                        <User className="w-4 h-4" /> Profile Details
                     </DropdownMenuItem>
                     <DropdownMenuItem className="rounded-xl cursor-pointer font-bold text-slate-700 dark:text-slate-300 focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-emerald-600 gap-3 py-2.5">
                        <CreditCard className="w-4 h-4" /> Subscription Plan
                     </DropdownMenuItem>
                     <DropdownMenuItem className="rounded-xl cursor-pointer font-bold text-slate-700 dark:text-slate-300 focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-emerald-600 gap-3 py-2.5">
                        <Settings className="w-4 h-4" /> Display Settings
                     </DropdownMenuItem>
                     <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-2" />
                     <DropdownMenuItem 
                        onClick={handleLogout}
                        className="rounded-xl cursor-pointer font-bold text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30 focus:text-rose-700 gap-3 py-2.5"
                     >
                        <LogOut className="w-4 h-4" /> Sign Out
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-10 bg-background dark:bg-slate-950 transition-colors duration-300 emerald-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </BrandGate>
  )
}
