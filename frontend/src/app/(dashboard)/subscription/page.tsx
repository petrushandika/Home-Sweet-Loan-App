"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap, Shield, Crown, ArrowRight } from "lucide-react";
import { useLanguageStore, translations } from "@/store/use-language-store";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { initiatePayment } from "@/lib/api/payments";

export default function SubscriptionPage() {
  const { language } = useLanguageStore();
  const t = translations[language].dashboard.subscription;
  const [mounted, setMounted] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const plans = [
    {
      name: "Starter",
      price: "Rp 0",
      desc:
        language === "id"
          ? "Sempurna untuk individu yang baru mulai belajar mengelola keuangan."
          : "Perfect for individuals starting to learn financial management.",
      features:
        language === "id"
          ? [
              "Hingga 3 Aset",
              "Penganggaran Dasar",
              "Laporan Bulanan",
              "Dukungan Komunitas",
            ]
          : [
              "Up to 3 Assets",
              "Basic Budgeting",
              "Monthly Reports",
              "Community Support",
            ],
      icon: Zap,
      color: "emerald",
      popular: false,
    },
    {
      name: "Basic",
      price: "Rp 29.000",
      period: language === "id" ? "/bulan" : "/month",
      desc:
        language === "id"
          ? "Pilihan paling hemat untuk pengelola keuangan serius."
          : "The most frugal choice for serious financial managers.",
      features:
        language === "id"
          ? [
              "Aset Tak Terbatas",
              "Wawasan Finansial AI Dasar",
              "Sinkronisasi Real-time",
              "Dukungan Email",
              "Analitik Mingguan",
            ]
          : [
              "Unlimited Assets",
              "Basic AI Financial Insights",
              "Real-time Sync",
              "Email Support",
              "Weekly Analytics",
            ],
      icon: Shield,
      color: "emerald",
      popular: true,
    },
    {
      name: "Family",
      price: "Rp 59.000",
      period: language === "id" ? "/bulan" : "/month",
      desc:
        language === "id"
          ? "Satu paket untuk seluruh anggota keluarga agar kompak hemat."
          : "One package for the whole family to stay frugal together.",
      features:
        language === "id"
          ? [
              "Akses 5 Anggota Keluarga",
              "Penasihat AI Tingkat Lanjut",
              "Pelacakan Pinjaman Bersama",
              "Sinkronisasi Multi-perangkat",
              "Prioritas Dukungan",
            ]
          : [
              "Access for 5 Family Members",
              "Advanced AI Advisor",
              "Shared Loan Tracking",
              "Multi-device Sync",
              "Priority Support",
            ],
      icon: Crown,
      color: "emerald",
      popular: false,
    },
  ];

  const handleSelectPlan = async (plan: any) => {
    // Parse price
    const amount = parseInt(plan.price.replace(/[^0-9]/g, ""));

    if (amount === 0) {
      toast.info("This is a free plan.");
      return;
    }

    setLoadingPlan(plan.name);
    try {
      const result = await initiatePayment(plan.name, amount);
      if (result && result.redirect_url) {
        toast.success("Redirecting to payment...");
        window.location.href = result.redirect_url;
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error: any) {
      toast.error("Payment Error", {
        description: error.message || "Failed to connect to payment server",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-500">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1
          className="text-5xl font-black tracking-tight text-slate-900 dark:text-white"
          dangerouslySetInnerHTML={{ __html: t.title }}
        />
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative overflow-hidden border-border bg-white dark:bg-slate-900 flex flex-col hover:shadow-md transition-all duration-300 ${
              plan.popular
                ? "ring-2 ring-emerald-500 scale-105 z-10"
                : "hover:-translate-y-1"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-6 right-6 z-20">
                <div className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 animate-bounce-subtle">
                  <Zap className="w-3 h-3 fill-current" />
                  {t.popular}
                </div>
              </div>
            )}

            <CardHeader className="p-8">
              <div
                className={`w-12 h-12 rounded-2xl bg-${plan.color}-100 dark:bg-${plan.color}-900/30 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}
              >
                <plan.icon className={`w-6 h-6 text-${plan.color}-600`} />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">
                {plan.name}
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {plan.desc}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8 flex-1">
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-slate-500 dark:text-slate-400 font-bold">
                    {plan.period}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 group/feat"
                  >
                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover/feat:bg-emerald-500 group-hover/feat:text-white">
                      <Check className="w-3 h-3 text-emerald-600 group-hover/feat:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-8 pt-0">
              <Button
                onClick={() => handleSelectPlan(plan)}
                disabled={loadingPlan !== null}
                className={`w-full h-12 rounded-2xl font-black text-lg transition-all active:scale-95 ${
                  plan.popular
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-sm"
                }`}
              >
                {loadingPlan === plan.name ? (
                  <>Processing...</>
                ) : (
                  <>
                    {t.getStarted} <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-[3rem] p-10 mt-10 border border-emerald-100 dark:border-emerald-900/30 text-center">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
          {t.faq}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-8">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 underline decoration-emerald-200 decoration-2 underline-offset-4">
              Can I cancel anytime?
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Yes, you can cancel your subscription at any time without any
              hidden fees. Your pro features will remain active until the end of
              your billing cycle.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 underline decoration-emerald-200 decoration-2 underline-offset-4">
              Is my data secure?
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              We use bank-level 256-bit encryption to protect your financial
              data and never sell your information to third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
