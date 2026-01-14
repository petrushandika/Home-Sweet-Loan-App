"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Settings2,
  ShieldCheck,
  CreditCard,
  PieChart,
  Coins,
  Briefcase,
} from "lucide-react";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useLanguageStore, translations } from "@/store/use-language-store";
import { useEffect, useState } from "react";

export default function SetupPage() {
  const { language } = useLanguageStore();
  const t = translations[language].dashboard.setup;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveCategory = () => {
    toast.success("Category Saved", {
      description:
        "Successfully added new category to your financial workspace.",
    });
  };

  const handleRemove = (name: string) => {
    toast.error("Category Removed", {
      description: `${name} has been deleted from your settings.`,
    });
  };

  if (!mounted) return null;

  const setupItems = [
    {
      title: t.items.account,
      icon: CreditCard,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "hover:border-blue-200 dark:hover:border-blue-800",
      count: 4,
    },
    {
      title: t.items.income,
      icon: Coins,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      borderColor: "hover:border-emerald-200 dark:hover:border-emerald-800",
      count: 2,
    },
    {
      title: t.items.needs,
      icon: ShieldCheck,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "hover:border-orange-200 dark:hover:border-orange-800",
      count: 8,
    },
    {
      title: t.items.wants,
      icon: PieChart,
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/20",
      borderColor: "hover:border-violet-200 dark:hover:border-violet-800",
      count: 12,
    },
    {
      title: t.items.savings,
      icon: Settings2,
      color: "text-pink-500",
      bg: "bg-pink-50 dark:bg-pink-950/20",
      borderColor: "hover:border-pink-200 dark:hover:border-pink-800",
      count: 5,
    },
    {
      title: t.items.assets,
      icon: Briefcase,
      color: "text-sky-500",
      bg: "bg-sky-50 dark:bg-sky-950/20",
      borderColor: "hover:border-sky-200 dark:hover:border-sky-800",
      count: 6,
    },
  ];

  return (
    <div className="space-y-10 pb-10 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            {t.desc}
          </p>
        </div>

        <ResponsiveModal
          title={t.modalTitle}
          description={t.modalDesc}
          trigger={
            <Button className="w-full sm:w-auto rounded-full px-6 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-bold shadow-sm transition-all hover:scale-105 active:scale-95 border-none">
              <Plus className="mr-2 h-4 w-4" /> {t.addBtn}
            </Button>
          }
        >
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-slate-700 dark:text-slate-300 font-bold ml-1"
              >
                {t.form.name}
              </Label>
              <Input
                id="name"
                placeholder={t.form.namePlaceholder}
                className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="type"
                className="text-slate-700 dark:text-slate-300 font-bold ml-1"
              >
                {t.form.type}
              </Label>
              <Select>
                <SelectTrigger className="rounded-2xl border-border dark:bg-slate-900 focus:ring-emerald-500 h-11">
                  <SelectValue placeholder={t.form.typePlaceholder} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border dark:bg-slate-900">
                  <SelectItem value="income" className="cursor-pointer">
                    Income Source
                  </SelectItem>
                  <SelectItem value="needs" className="cursor-pointer">
                    Needs (Fixed)
                  </SelectItem>
                  <SelectItem value="wants" className="cursor-pointer">
                    Wants (Flex)
                  </SelectItem>
                  <SelectItem value="savings" className="cursor-pointer">
                    Savings / Investment
                  </SelectItem>
                  <SelectItem value="assets" className="cursor-pointer">
                    Assets
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSaveCategory}
              type="submit"
              className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 mt-2 cursor-pointer transition-all active:scale-95 border-none shadow-lg shadow-emerald-100 dark:shadow-none"
            >
              {t.saveBtn}
            </Button>
          </div>
        </ResponsiveModal>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {setupItems.map((item) => (
          <ResponsiveModal
            key={item.title}
            title={`${item.title} Settings`}
            description={`Manage your ${item.title.toLowerCase()} list and configurations.`}
            trigger={
              <Card
                className={`border-border shadow-none rounded-3xl bg-white dark:bg-slate-900 overflow-hidden group transition-all cursor-pointer border hover:shadow-md ${item.borderColor}`}
              >
                <CardHeader className="p-6 md:p-8">
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center transition-all border border-transparent group-hover:border-slate-100 dark:group-hover:border-slate-700 group-hover:scale-105 shadow-xs`}
                    >
                      <item.icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
                        {item.title}
                      </CardTitle>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1.5">
                        {t.module}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8 pt-0">
                  <div className="p-6 md:p-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl text-sm text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-medium italic bg-slate-50/50 dark:bg-slate-950/20 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all">
                    <span className="text-2xl font-black mb-1">
                      {item.count}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                      Active Items
                    </span>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-3 max-h-[200px] overflow-y-auto emerald-scrollbar pr-2">
                {Array.from({ length: item.count }, (_, i) => i + 1).map(
                  (i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"
                    >
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Sample {item.title} Item {i}
                      </span>
                      <Button
                        onClick={() => handleRemove(`Sample Item ${i}`)}
                        variant="ghost"
                        size="sm"
                        className="text-rose-500 font-bold hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl cursor-pointer"
                      >
                        Remove
                      </Button>
                    </div>
                  )
                )}
              </div>
              <div className="shrink-0 pt-4">
                <div className="p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">
                  <Button
                    variant="outline"
                    className="rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold h-11 px-6 hover:bg-white dark:hover:bg-slate-800"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add custom item
                  </Button>
                </div>
              </div>
            </div>
          </ResponsiveModal>
        ))}
      </div>
    </div>
  );
}
