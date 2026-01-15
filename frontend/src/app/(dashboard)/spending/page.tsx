"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  History,
  CalendarIcon,
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  X,
  Edit2,
  Trash2,
  Check,
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
import { useSearchStore } from "@/store/use-search-store";
import { useSetupStore } from "@/store/use-setup-store";
import { useSpendingStore } from "@/store/use-spending-store";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { SetupConfig } from "@/lib/api/setup";
import { Spending } from "@/lib/api/spending";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { TransactionIcon } from "@/components/transaction-icon";
import { transactionSchema } from "@/lib/schemas";

export default function SpendingPage() {
  const { language } = useLanguageStore();
  const t = translations[language].dashboard.spending;

  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    clearQuery,
  } = useSearchStore();

  const [mounted, setMounted] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");

  // Global Stores
  const { setup, fetchSetup } = useSetupStore();
  const {
    spending,
    isLoading,
    fetchSpending,
    addSpending,
    updateSpending,
    deleteSpending,
  } = useSpendingStore();

  // Transaction Form State
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [editingTransaction, setEditingTransaction] = useState<Spending | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchSetup();
    fetchSpending({ excludeIncome: true });
  }, []);

  const categoryOptions = useMemo(() => {
    if (!setup) return ["All"];
    // Collect all expense categories (excluding Income)
    const categories = [
      ...setup.needs,
      ...setup.wants,
      ...setup.savings,
      ...setup.accountAssets,
    ].sort();

    // Remove duplicates
    const unique = Array.from(new Set(categories));

    return ["All", ...unique];
  }, [setup]);

  const filteredTransactions = useMemo(() => {
    return spending.filter((item) => {
      const matchesSearch = item.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const isIncome = !!setup?.incomeSources?.includes(item.category);
      const matchesCategory =
        filterCategory === "All" || item.category === filterCategory;

      return matchesSearch && matchesCategory && !isIncome;
    });
  }, [spending, searchQuery, filterCategory, setup]);

  const handleSave = async () => {
    const result = transactionSchema.safeParse(formData);
    if (!result.success) {
      toast.error("Validation Error", {
        description: result.error.issues[0].message,
      });
      return;
    }

    try {
      const isIncome = setup?.incomeSources.includes(formData.category);
      const finalAmount = isIncome
        ? Math.abs(Number(formData.amount))
        : -Math.abs(Number(formData.amount));

      await addSpending({
        description: formData.description,
        amount: finalAmount,
        category: formData.category,
        date: formData.date,
      });

      handleReset();
      toast.success("Transaction Logged", {
        description: "Successfully updated your monthly spending history.",
      });
    } catch (error: any) {
      toast.error("Failed to save transaction", {
        description: error.message,
      });
    }
  };

  const handleReset = () => {
    setFormData({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSpending(id);
      toast.success("Transaction Deleted", {
        description: "The record has been permanently removed.",
      });
    } catch (error: any) {
      toast.error("Failed to delete", { description: error.message });
    }
  };

  const handleOpenEdit = (tx: Spending) => {
    setEditingTransaction(tx);
    setFormData({
      description: tx.description,
      amount: Math.abs(tx.amount).toString(),
      category: tx.category,
      date: new Date(tx.date).toISOString().split("T")[0],
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingTransaction) return;

    const result = transactionSchema.safeParse(formData);
    if (!result.success) {
      toast.error("Validation Error", {
        description: result.error.issues[0].message,
      });
      return;
    }

    try {
      const isIncome = setup?.incomeSources.includes(formData.category);
      const finalAmount = isIncome
        ? Math.abs(Number(formData.amount))
        : -Math.abs(Number(formData.amount));

      await updateSpending(editingTransaction.id, {
        description: formData.description,
        amount: finalAmount,
        category: formData.category,
        date: formData.date,
      });

      setIsEditModalOpen(false);
      setEditingTransaction(null);
      handleReset();

      toast.success("Transaction Updated", {
        description: "Your records have been updated successfully.",
      });
    } catch (error: any) {
      toast.error("Failed to update", { description: error.message });
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-10 pb-10 transition-colors duration-500 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 transition-colors duration-300">
            {t.desc}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-900 rounded-full border border-border hover:shadow-sm focus-within:border-emerald-500/40 focus-within:ring-2 focus-within:ring-emerald-500/5 transition-all duration-300">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full sm:w-32 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => clearQuery()}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors duration-300"
              >
                <X className="w-3 h-3 text-slate-400" />
              </button>
            )}
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
            <TransactionForm
              t={t}
              setup={setup}
              formData={formData}
              setFormData={setFormData}
            />
            <Button
              onClick={handleSave}
              type="submit"
              className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 mt-6 shadow-lg shadow-emerald-100 dark:shadow-none cursor-pointer transition-all active:scale-95 border-none"
            >
              {t.saveBtn}
            </Button>
          </ResponsiveModal>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 xl:grid-cols-12">
        <Card className="xl:col-span-4 border-border shadow-none rounded-3xl bg-white dark:bg-slate-900 overflow-hidden border transition-colors">
          <CardHeader className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-800 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
                className="rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer"
              >
                Reset Form
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
              {t.quickLog}
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">
              {t.quickLogDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-0">
            <TransactionForm
              t={t}
              setup={setup}
              formData={formData}
              setFormData={setFormData}
            />
            <Button
              onClick={handleSave}
              className="w-full mt-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-md hover:shadow-lg shadow-emerald-100 dark:shadow-none transition-all active:scale-95 cursor-pointer border-none"
            >
              {t.form.proceed}
            </Button>
          </CardContent>
        </Card>

        <Card className="xl:col-span-8 border-border shadow-none rounded-3xl bg-white dark:bg-slate-900 overflow-hidden border transition-colors">
          <CardHeader className="p-6 md:p-8 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-800 flex items-center justify-center shrink-0">
                  <History className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                    {t.history}
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">
                    {t.historyDesc}
                  </CardDescription>
                </div>
              </div>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-auto min-w-[140px] rounded-full px-4 border-border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all h-10">
                  <div className="flex items-center text-xs">
                    <Filter className="mr-2 h-3.5 w-3.5 text-slate-400" />
                    <SelectValue placeholder="Filter">
                      {filterCategory === "All"
                        ? "Select Category"
                        : filterCategory}
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent
                  className="rounded-2xl border-border bg-white dark:bg-slate-900 max-h-64 overflow-y-auto no-scrollbar min-w-(--radix-select-trigger-width)"
                  align="end"
                >
                  {categoryOptions.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="cursor-pointer font-bold rounded-xl m-1 text-xs text-slate-600 dark:text-slate-400 focus:bg-emerald-50 dark:focus:bg-emerald-900/20 focus:text-emerald-600"
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:px-10 md:pt-2 md:pb-8">
            <div className="max-h-[420px] overflow-y-auto pr-2 emerald-scrollbar space-y-4">
              {isLoading || spending === undefined ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
                  <p className="font-medium">Loading history...</p>
                </div>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((item, idx) => {
                  // Logic to determine icon and color based on category/amount
                  // If it's in incomeSources -> Income (+), otherwise Expense (-)
                  const isIncome = !!setup?.incomeSources?.includes(
                    item.category
                  );
                  const isSavings = !!setup?.savings?.includes(item.category);
                  const isAsset = !!setup?.accountAssets?.includes(
                    item.category
                  );

                  // Colors based on category type
                  let typeColor = "text-rose-600 dark:text-rose-400";
                  if (isIncome) typeColor = "text-emerald-600";
                  if (isSavings) typeColor = "text-sky-600";
                  if (isAsset) typeColor = "text-violet-600";

                  return (
                    <div
                      key={item.id}
                      className="flex items-center group cursor-pointer border-b border-slate-50 dark:border-slate-800 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="mr-4 shrink-0">
                        <TransactionIcon
                          category={item.category}
                          isIncome={isIncome}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-none mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                          {item.description}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={cn(
                              "text-[9px] font-black uppercase px-1.5 py-0.5 rounded",
                              isIncome
                                ? "bg-emerald-100 text-emerald-700"
                                : isSavings
                                ? "bg-sky-100 text-sky-700"
                                : isAsset
                                ? "bg-violet-100 text-violet-700"
                                : "bg-rose-100 text-rose-700"
                            )}
                          >
                            {isIncome
                              ? translations[language].dashboard.summary
                                  .badgeIncome
                              : isSavings
                              ? translations[language].dashboard.summary
                                  .badgeSavings
                              : isAsset
                              ? translations[language].dashboard.summary
                                  .badgeAsset
                              : translations[language].dashboard.summary
                                  .badgeSpending}
                          </span>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none">
                            {item.category} •{" "}
                            {format(new Date(item.date), "dd MMM")}
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "font-black text-sm text-right flex items-center gap-4 transition-colors duration-300",
                          typeColor
                        )}
                      >
                        <div className="tabular-nums">
                          {item.amount > 0 ? "+" : "-"} Rp{" "}
                          {Math.abs(item.amount).toLocaleString()}
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(item)}
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 italic">
                  <p>No transactions found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ResponsiveModal
        title="Edit Transaction"
        description="Modify your transaction details below."
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      >
        <div className="space-y-6">
          <TransactionForm
            t={t}
            setup={setup}
            formData={formData}
            setFormData={setFormData}
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingTransaction(null);
                handleReset();
              }}
              className="flex-1 rounded-2xl h-12 font-bold border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="flex-[2] rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-lg shadow-emerald-100 dark:shadow-none border-none cursor-pointer"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </ResponsiveModal>
    </div>
  );
}

function TransactionForm({
  t,
  setup,
  formData,
  setFormData,
}: {
  t: any;
  setup: SetupConfig | null;
  formData: any;
  setFormData: any;
}) {
  const categoryOptions = useMemo(() => {
    if (!setup) return [];
    return [
      ...setup.incomeSources.map((s) => ({
        label: s,
        value: s,
        type: "Income",
      })),
      ...setup.needs.map((n) => ({ label: n, value: n, type: "Needs" })),
      ...setup.wants.map((w) => ({ label: w, value: w, type: "Wants" })),
      ...setup.savings.map((s) => ({ label: s, value: s, type: "Savings" })),
      ...setup.accountAssets.map((a) => ({
        label: a,
        value: a,
        type: "Assets",
      })),
    ];
  }, [setup]);

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Label
          htmlFor="desc"
          className="text-slate-700 dark:text-slate-300 font-bold ml-1"
        >
          {t.form.desc}
        </Label>
        <Input
          id="desc"
          placeholder={t.form.descPlaceholder}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 h-12"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label
            htmlFor="amount"
            className="text-slate-700 dark:text-slate-300 font-bold ml-1"
          >
            {t.form.amount}
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              Rp
            </span>
            <Input
              id="amount"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setFormData({ ...formData, amount: value });
              }}
              className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 pl-11 h-12"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label
            htmlFor="category"
            className="text-slate-700 dark:text-slate-300 font-bold ml-1"
          >
            {t.form.category}
          </Label>
          <Select
            value={formData.category}
            onValueChange={(val) => setFormData({ ...formData, category: val })}
          >
            <SelectTrigger className="rounded-2xl border-border dark:bg-slate-900 focus:ring-emerald-500 h-12">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border dark:bg-slate-900 max-h-60">
              {categoryOptions.map((opt) => (
                <SelectItem
                  key={`${opt.type}-${opt.value}`}
                  value={opt.value}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">{opt.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label
          htmlFor="date"
          className="text-slate-700 dark:text-slate-300 font-bold ml-1"
        >
          {t.form.date}
        </Label>
        <div className="relative">
          <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 pl-11 h-12 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
