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
      },
      spending: {
        title: "Pelacak <span class='text-gradient-money'>Pengeluaran</span>",
        desc: "Catat transaksi harian Anda dan pantau penggunaan anggaran.",
        addBtn: "Tambah Transaksi",
        modalTitle: "Transaksi Baru",
        modalDesc: "Catat pengeluaran atau pemasukan baru.",
        saveBtn: "Simpan Transaksi",
        quickLog: "Catat Cepat",
        quickLogDesc: "Masukkan detail pengeluaran secara manual.",
        history: "Riwayat Transaksi",
        historyDesc: "Log pengeluaran Anda untuk bulan ini.",
        emptyState: "Tidak ada transaksi yang tercatat untuk periode ini.",
        importBtn: "Impor dari CSV",
        form: {
          desc: "Deskripsi",
          descPlaceholder: "Apa yang Anda beli?",
          amount: "Jumlah",
          category: "Kategori",
          date: "Tanggal",
          proceed: "Lanjutkan Mencatat"
        }
      },
      assets: {
        title: "Manajemen <span class='text-gradient-money'>Aset</span>",
        desc: "Pantau kekayaan jangka panjang dan pertumbuhan portofolio Anda.",
        addBtn: "Tambah Aset",
        modalTitle: "Aset Baru",
        modalDesc: "Tambah item baru ke portofolio kekayaan Anda.",
        registerBtn: "Daftarkan Aset",
        breakdown: "Rincian Aset",
        breakdownDesc: "Daftar terperinci kepemilikan dan distribusi kekayaan Anda.",
        liquid: "Aset Likuid",
        nonLiquid: "Non-Likuid",
        total: "Total Kekayaan",
        form: {
          name: "Nama Aset",
          namePlaceholder: "misal. Dana Darurat, Saham",
          type: "Tipe Aset",
          typePlaceholder: "Pilih tipe",
          value: "Nilai Saat Ini"
        }
      },
      report: {
        title: "Laporan <span class='text-gradient-money'>Finansial</span>",
        desc: "Pelajari lebih dalam kebiasaan dan tren keuangan Anda.",
        thisMonth: "Bulan Ini",
        downloadBtn: "Unduh PDF",
        analysisTitle: "Analisis Bulanan",
        analysisDesc: "Perbandingan antara anggaran dan pengeluaran riil.",
        distTitle: "Distribusi Kategori",
        distDesc: "Ke mana tepatnya uang Anda pergi?",
        aiTitle: "Wawasan Finansial Pintar",
        aiDesc: "Berdasarkan kebiasaan Anda, Anda bisa menghemat hingga <b class='text-white underline underline-offset-4 decoration-indigo-300'>Rp 1.500.000</b> lebih banyak setiap bulan dengan mengurangi pengeluaran gaya hidup.",
        aiBtn: "Hasilkan Saran AI",
        detailedBtn: "Analisis Terperinci",
        optimizeBtn: "Optimalkan Pengeluaran",
        advisorTitle: "Penasihat Keuangan AI",
        advisorDesc: "Wawasan personal berdasarkan riwayat transaksi Anda.",
        refreshBtn: "Perbarui Wawasan",
        analyzing: "Menganalisis Pola..."
      },
      setup: {
        title: "Setup <span class='text-gradient-money'>Proyek</span>",
        desc: "Konfigurasi ruang kerja dan kategori keuangan Anda.",
        addBtn: "Kategori Baru",
        modalTitle: "Tambah Kategori Baru",
        modalDesc: "Buat kategori baru untuk transaksi atau aset Anda.",
        saveBtn: "Simpan Kategori",
        module: "Modul Arsitektur",
        form: {
          name: "Nama Kategori",
          namePlaceholder: "misal. Langganan, Sampingan",
          type: "Tipe Kategori",
          typePlaceholder: "Pilih tipe"
        },
        items: {
          account: "Ringkasan Akun",
          income: "Sumber Pendapatan",
          needs: "Kategori Kebutuhan",
          wants: "Kategori Keinginan",
          savings: "Kategori Tabungan",
          assets: "Aset Akun"
        }
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
      rights: "© 2026 Copyright By Petrus Handika",
    },
    legal: {
      terms: {
        title: "Syarat Ketentuan Layanan",
        sections: [
          { title: "1. Penerimaan Ketentuan", content: "Dengan mengakses dan menggunakan Home Sweet Loan, Anda setuju untuk terikat oleh Syarat Ketentuan Layanan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami." },
          { title: "2. Akun Pengguna", content: "Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda. Anda menyetujui untuk menerima tanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda." },
          { title: "3. Layanan Keuangan", content: "Home Sweet Loan menyediakan alat manajemen keuangan. Kami bukan penasihat keuangan berlisensi. Harap konsultasikan dengan profesional sebelum membuat keputusan keuangan besar." },
          { title: "4. Batasan Tanggung Jawab", content: "Kami berusaha memberikan data yang paling akurat, namun kami tidak bertanggung jawab atas kerugian finansial yang mungkin terjadi akibat penggunaan aplikasi ini." },
          { title: "5. Perubahan Layanan", content: "Kami berhak untuk mengubah atau menghentikan layanan (atau bagian mana pun darinya) kapan saja tanpa pemberitahuan sebelumnya." }
        ]
      },
      privacy: {
        title: "Kebijakan Privasi",
        sections: [
          { title: "1. Pengumpulan Data", content: "Kami mengumpulkan informasi yang Anda berikan saat mendaftar, seperti nama, email, dan data transaksi keuangan yang Anda masukkan secara manual." },
          { title: "2. Penggunaan Informasi", content: "Data Anda digunakan untuk memberikan analisis keuangan yang dipersonalisasi dan meningkatkan pengalaman pengguna di dalam aplikasi." },
          { title: "3. Keamanan Data", content: "Kami menggunakan enkripsi tingkat institusi untuk melindungi data sensitif Anda. Keamanan privasi Anda adalah prioritas utama kami." },
          { title: "4. Berbagi Data", content: "Kami tidak menjual data pribadi Anda kepada pihak ketiga. Data hanya dibagikan jika diperlukan oleh hukum atau untuk menyediakan layanan inti kami." },
          { title: "5. Hak Pengguna", content: "Anda memiliki hak untuk mengakses, memperbarui, atau menghapus data pribadi Anda kapan saja melalui pengaturan profil Anda." }
        ]
      }
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
      },
      spending: {
        title: "Spending <span class='text-gradient-money'>Tracker</span>",
        desc: "Log your daily transactions and monitor budget usage.",
        addBtn: "Add Transaction",
        modalTitle: "New Transaction",
        modalDesc: "Record a new expense or income.",
        saveBtn: "Save Transaction",
        quickLog: "Quick Log",
        quickLogDesc: "Enter spending details manually.",
        history: "Transaction History",
        historyDesc: "Your spending logs for this month.",
        emptyState: "No transactions recorded for this period.",
        importBtn: "Import from CSV",
        form: {
          desc: "Description",
          descPlaceholder: "What did you buy?",
          amount: "Amount",
          category: "Category",
          date: "Date",
          proceed: "Proceed to Log"
        }
      },
      assets: {
        title: "Asset <span class='text-gradient-money'>Management</span>",
        desc: "Monitor your long-term wealth and portfolio growth.",
        addBtn: "Add Asset",
        modalTitle: "New Asset",
        modalDesc: "Add a new item to your wealth portfolio.",
        registerBtn: "Register Asset",
        breakdown: "Asset Breakdown",
        breakdownDesc: "Detailed list of your holdings and wealth distribution.",
        liquid: "Liquid Assets",
        nonLiquid: "Non-Liquid",
        total: "Total Wealth",
        form: {
          name: "Asset Name",
          namePlaceholder: "e.g. Emergency Fund, Stocks",
          type: "Asset Type",
          typePlaceholder: "Select type",
          value: "Current Value"
        }
      },
      report: {
        title: "Financial <span class='text-gradient-money'>Reports</span>",
        desc: "Deep dive into your financial habits and trends.",
        thisMonth: "This Month",
        downloadBtn: "Download PDF",
        analysisTitle: "Monthly Analysis",
        analysisDesc: "Comparison between budget and real spending.",
        distTitle: "Category Distribution",
        distDesc: "Where does your money go exactly?",
        aiTitle: "Smart Financial Insights",
        aiDesc: "Based on your habits, you could save up to <b class='text-white underline underline-offset-4 decoration-indigo-300'>Rp 1.500.000</b> more each month by reducing lifestyle spending.",
        aiBtn: "Generate AI Advice",
        detailedBtn: "Detailed Analysis",
        optimizeBtn: "Optimize Spending",
        advisorTitle: "AI Financial Advisor",
        advisorDesc: "Personalized insights based on your transaction history.",
        refreshBtn: "Refresh Insights",
        analyzing: "Analyzing Patterns..."
      },
      setup: {
        title: "Project <span class='text-gradient-money'>Setup</span>",
        desc: "Configure your financial workspace and categories.",
        addBtn: "New Category",
        modalTitle: "Add New Category",
        modalDesc: "Create a new category for your transactions or assets.",
        saveBtn: "Save Category",
        module: "Architecture Module",
        form: {
          name: "Category Name",
          namePlaceholder: "e.g. Subscriptions, Side Hustle",
          type: "Category Type",
          typePlaceholder: "Select a type"
        },
        items: {
          account: "Account Summary",
          income: "Income Sources",
          needs: "Needs Categories",
          wants: "Wants Categories",
          savings: "Savings Categories",
          assets: "Account Assets"
        }
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
      rights: "© 2026 Copyright By Petrus Handika",
    },
    legal: {
      terms: {
        title: "Terms of Service",
        sections: [
          { title: "1. Acceptance of Terms", content: "By accessing and using Home Sweet Loan, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services." },
          { title: "2. User Accounts", content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account." },
          { title: "3. Financial Services", content: "Home Sweet Loan provides financial management tools. We are not licensed financial advisors. Please consult with a professional before making major financial decisions." },
          { title: "4. Limitation of Liability", content: "We strive to provide the most accurate data, but we are not responsible for any financial losses that may occur from using this application." },
          { title: "5. Changes to Service", content: "We reserve the right to modify or discontinue the service (or any part thereof) at any time without prior notice." }
        ]
      },
      privacy: {
        title: "Privacy Policy",
        sections: [
          { title: "1. Data Collection", content: "We collect information you provide when registering, such as name, email, and financial transaction data that you enter manually." },
          { title: "2. Use of Information", content: "Your data is used to provide personalized financial analysis and improve the user experience within the application." },
          { title: "3. Data Security", content: "We use institution-grade encryption to protect your sensitive data. Your privacy security is our top priority." },
          { title: "4. Data Sharing", content: "We do not sell your personal data to third parties. Data is only shared if required by law or to provide our core services." },
          { title: "5. User Rights", content: "You have the right to access, update, or delete your personal data at any time via your profile settings." }
        ]
      }
    }
  }
}
