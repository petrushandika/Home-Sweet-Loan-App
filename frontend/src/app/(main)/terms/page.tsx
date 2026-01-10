"use client"

import { useLanguageStore, translations } from "@/store/use-language-store"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { FileText } from "lucide-react"

export default function TermsPage() {
  const { language } = useLanguageStore()
  const t = translations[language].legal.terms
  const [activeSection, setActiveSection] = useState(0)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-20 px-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 mb-6">
            <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4 px-4">
                {language === "id" ? "Daftar Isi" : "Table of Contents"}
              </h2>
              <nav className="space-y-1">
                {t.sections.map((section, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSection(idx)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition-all border",
                      activeSection === idx
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                    )}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm transition-colors">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {t.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "mb-10 pb-10 border-b border-slate-100 dark:border-slate-800 last:border-0 last:mb-0 last:pb-0 transition-all",
                      activeSection === idx ? "opacity-100" : "opacity-40 hover:opacity-70"
                    )}
                  >
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                      {section.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-base">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {language === "id" 
                  ? "Jika Anda memiliki pertanyaan tentang Syarat Ketentuan ini, silakan hubungi kami di support@homesweetloan.com"
                  : "If you have any questions about these Terms, please contact us at support@homesweetloan.com"}
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
