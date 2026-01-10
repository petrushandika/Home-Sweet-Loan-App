"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Language = "en" | "id"

interface LanguageStore {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "id",
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "language-storage",
    }
  )
)

export const translations = {
  id: {
    nav: {
      partners: "Mitra",
      features: "Fitur",
      platform: "Platform",
      testimonials: "Testimoni",
      signIn: "Masuk",
      getStarted: "Mulai Sekarang",
      dashboard: "Dasbor",
    },
    hero: {
      new: "Baru",
      ai: "Asisten AI Finansial Generasi Terbaru",
      title: "Kelola <span class='text-gradient-money italic'>Kekayaan</span> Anda Lebih Cepat.",
      desc: "Ambil kendali penuh atas keuangan keluarga Anda. Penganggaran otomatis, pelacakan aset pintar, dan wawasan mendalam untuk mencapai rumah impian lebih cepat.",
      cta: "Mulai Perjalanan Anda",
      demo: "Lihat Demo",
      join: "Bergabung dengan 10.000+ Pengguna Puas",
    },
    dashboard: {
      budgeting: {
        title: "Anggaran <span class='text-gradient-money'>Bulanan</span>",
        subtitle: "Rencanakan alokasi pendapatan Anda untuk siklus berikutnya.",
        guidelines: "Panduan",
        createPlan: "Buat Rencana",
        modalTitle: "Rencana Anggaran Baru",
        modalDesc: "Tetapkan target keuangan Anda untuk bulan ini.",
        periodLabel: "Periode Anggaran",
        incomeLabel: "Estimasi Pendapatan Bersih",
        currentMonth: "Bulan Ini",
        nextMonth: "Bulan Depan",
        tip: "Tips Ahli: Coba gunakan aturan 50/30/20 (Kebutuhan/Keinginan/Tabungan) untuk kehidupan finansial yang seimbang.",
        initializeBtn: "Inisialisasi Rencana",
        planCardTitle: "Perencanaan Anggaran",
        planCardDesc: "Alokasikan dana Anda ke berbagai kategori.",
        emptyState: "Tidak ada rencana anggaran aktif untuk bulan ini.",
        importBtn: "Impor dari Bulan Lalu",
        goalTrackerTitle: "Pelacak Target",
        goalTrackerDesc: "Status target tabungan bulanan",
        savingTarget: "Target Tabungan",
        encouragement: "Luar biasa! Anda telah mengalokasikan <b class='text-white'>Rp 3.500.000</b> untuk tabungan Anda sejauh ini bulan ini.",
        viewGoalsBtn: "Lihat Target Kekayaan",
        toastTitle: "Rencana Diinisialisasi",
        toastDesc: "Siap mengalokasikan dana Anda untuk siklus baru."
      },
      summary: {
        title: "Ringkasan <span class='text-gradient-money'>Finansial</span>",
        welcome: "Selamat datang kembali, User! Berikut adalah kondisi keuangan Anda hari ini.",
        exportBtn: "Ekspor Data",
        addBtn: "Tambah Transaksi",
        modalTitle: "Tambah Transaksi",
        modalDesc: "Catat pengeluaran atau pemasukan Anda dengan cepat.",
        descLabel: "Deskripsi",
        amountLabel: "Jumlah (Rp)",
        catLabel: "Kategori",
        dateLabel: "Tanggal",
        completeBtn: "Selesaikan Transaksi",
        income: "Pendapatan Bulanan",
        spending: "Pengeluaran Bulanan",
        savings: "Total Tabungan",
        networth: "Kekayaan Bersih",
        target: "Target",
        cashflow: "Arus Kas",
        cashflowDesc: "Pendapatan vs pengeluaran",
        activity: "Aktivitas Terbaru",
        viewAll: "Lihat Semua",
        toastTitle: "Mengekspor data...",
        toastDesc: "Data keuangan Anda sedang disiapkan untuk diunduh."
      }
    },
    partners: {
      title: "Dipercaya oleh Institusi Finansial Global",
    },
    features: {
      badge: "Precision Core",
      title: "Semua yang Anda butuhkan untuk <br/> <span class='text-gradient-money'>Membangun Kekayaan</span>.",
      cards: [
        {
          title: "Pelacakan Real-time",
          desc: "Pantau pengeluaran rutin dan sumber pendapatan Anda dengan pembaruan langsung dan bagan yang indah."
        },
        {
          title: "Penganggaran Pintar",
          desc: "Tetapkan target bulanan berdasarkan pendapatan Anda dan biarkan AI kami menyarankan strategi alokasi terbaik."
        },
        {
          title: "Keamanan Aset",
          desc: "Kelola aset jangka panjang Anda, dari properti hingga tabungan likuid, dalam satu brankas yang aman."
        }
      ],
      more: "Pelajari Lebih Lanjut"
    },
    platform: {
      title: "Dasbor paling <span class='text-emerald-600 italic font-medium'>intuitif</span> di pasar.",
      desc: "Didesain untuk kejelasan. Dibangun untuk aksi. Pantau setiap aset di pusat komando yang indah.",
      items: [
        "Proyeksi Arus Kas Interaktif",
        "Kategorisasi Pengeluaran Otomatis",
        "Indikator Kemajuan Tujuan Visual",
        "Audit Finansial PDF Sekali Klik"
      ],
      cta: "Buka Dasbor"
    },
    cta: {
      title: "Siap untuk <br/><span class='underline decoration-emerald-300 decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8 italic'>Kebebasan</span> Finansial?",
      desc: "Mulai kelola pinjaman dan aset Anda seperti profesional. Tanpa kartu kredit. Bersih, sederhana, dan kuat.",
      button: "Buka Dasbor"
    },
    footer: {
      desc: "Pendamping finansial utama untuk keluarga Indonesia. Penganggaran, pelacakan aset, dan manajemen pinjaman cerdas menjadi mudah.",
      solution: "Solusi",
      company: "Perusahaan",
      support: "Dukungan",
      rights: "© 2026 Home Sweet Loan. Hak cipta dilindungi undang-undang.",
    }
  },
  en: {
    nav: {
      partners: "Partners",
      features: "Features",
      platform: "Platform",
      testimonials: "Testimonials",
      signIn: "Sign In",
      getStarted: "Get Started",
      dashboard: "Dashboard",
    },
    hero: {
      new: "New",
      ai: "Next Gen Financial AI Assistant",
      title: "Manage Your <span class='text-gradient-money italic'>Wealth</span> Faster Than Ever.",
      desc: "Take full control of your family's finances. Automated budgeting, smart asset tracking, and deep insights to achieve your dream home faster.",
      cta: "Start Your Journey",
      demo: "Watch Demo",
      join: "Join 10,000+ Happy Users",
    },
    dashboard: {
      budgeting: {
        title: "Monthly <span class='text-gradient-money'>Budgeting</span>",
        subtitle: "Plan your income allocation for the next cycle.",
        guidelines: "Guidelines",
        createPlan: "Create Plan",
        modalTitle: "New Budget Plan",
        modalDesc: "Set your financial targets for the month.",
        periodLabel: "Budget Period",
        incomeLabel: "Estimated Net Income",
        currentMonth: "Current Month",
        nextMonth: "Next Month",
        tip: "Expert Tip: Try using the 50/30/20 rule (Needs/Wants/Savings) for a balanced financial life.",
        initializeBtn: "Initialize Plan",
        planCardTitle: "Budget Planning",
        planCardDesc: "Allocate your funds across different categories.",
        emptyState: "No active budget plan found for this month.",
        importBtn: "Import from Last Month",
        goalTrackerTitle: "Goal Tracker",
        goalTrackerDesc: "Monthly saving target status",
        savingTarget: "Saving Target",
        encouragement: "You're doing great! You've allocated <b class='text-white'>Rp 3.500.000</b> to your savings so far this month.",
        viewGoalsBtn: "View Wealth Goals",
        toastTitle: "Plan Initialized",
        toastDesc: "Ready to allocate your funds for the new cycle."
      },
      summary: {
        title: "Financial <span class='text-gradient-money'>Summary</span>",
        welcome: "Welcome back, User! Here's what's happening today.",
        exportBtn: "Export Data",
        addBtn: "Add Transaction",
        modalTitle: "Add Transaction",
        modalDesc: "Capture your spending or income quickly.",
        descLabel: "Description",
        amountLabel: "Amount (Rp)",
        catLabel: "Category",
        dateLabel: "Date",
        completeBtn: "Complete Transaction",
        income: "Monthly Income",
        spending: "Monthly Spending",
        savings: "Total Savings",
        networth: "Net Worth",
        target: "Target",
        cashflow: "Cash Flow",
        cashflowDesc: "Income vs expenses",
        activity: "Recent Activity",
        viewAll: "View All",
        toastTitle: "Exporting data...",
        toastDesc: "Your financial data is being prepared for download."
      }
    },
    partners: {
      title: "Trusted by Global Financial Institutions",
    },
    features: {
      badge: "Precision Core",
      title: "Everything you need to <br/> <span class='text-gradient-money'>Build Wealth</span>.",
      cards: [
        {
          title: "Real-time Tracking",
          desc: "Monitor your recurring expenses and income sources with live updates and beautiful charts."
        },
        {
          title: "Smart Budgeting",
          desc: "Set monthly goals based on your income and let our AI suggest the best allocation strategy."
        },
        {
          title: "Wealth Security",
          desc: "Manage your long-term assets, from property to liquid savings, in one secure vault."
        }
      ],
      more: "Dive Deeper"
    },
    platform: {
      title: "The most <span class='text-emerald-600 italic font-medium'>intuitive</span> dashboard on the market.",
      desc: "Designed for clarity. Built for action. Monitor every asset in a beautiful command center.",
      items: [
        "Interactive Cash Flow Projections",
        "Automated Expense Categorization",
        "Visual Goal Progress Indicators",
        "One-click PDF Financial Audits"
      ],
      cta: "Go To Dashboard"
    },
    cta: {
      title: "Ready for Financial <br/><span class='underline decoration-emerald-300 decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8 italic'>Freedom</span>?",
      desc: "Start managing your loan and assets like a professional. No credit card required. Clean, simple, and powerful.",
      button: "Launch Dashboard"
    },
    footer: {
      desc: "The ultimate financial companion for Indonesian families. Budgeting, asset tracking, and smart loan management made easy.",
      solution: "Solution",
      company: "Company",
      support: "Support",
      rights: "© 2026 Home Sweet Loan. All rights reserved.",
    }
  }
}
