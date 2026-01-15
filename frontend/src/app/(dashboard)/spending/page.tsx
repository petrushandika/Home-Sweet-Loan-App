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
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { getSetup, SetupConfig } from "@/lib/api/setup";
import {
  getSpending,
  createSpending,
  updateSpending,
  deleteSpending,
  Spending,
  SpendingFilters,
} from "@/lib/api/spending";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

// Mock constants removed and replaced with state

export default function SpendingPage() {
  const { language } = useLanguageStore();
  const t = translations[language].dashboard.spending;
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    clearQuery,
  } = useSearchStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [setup, setSetup] = useState<SetupConfig | null>(null);
  const [spending, setSpending] = useState<Spending[]>([]);
  const [filterCategory, setFilterCategory] = useState("All");

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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [setupData, spendingData] = await Promise.all([
        getSetup(),
        getSpending(),
      ]);
      setSetup(setupData);
      setSpending(spendingData.spending);
    } catch (error: any) {
      toast.error("Failed to fetch data", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    return spending.filter((item) => {
      const matchesSearch = item.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      // Mapping categories for filter
      const matchesCategory =
        filterCategory === "All" || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [spending, searchQuery, filterCategory]);

  const handleSave = async () => {
    if (!formData.description || !formData.amount || !formData.category) {
      toast.error("Invalid Input", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const newRecord = await createSpending({
        description: formData.description,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
      });

      setSpending((prev) => [newRecord, ...prev]);
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
      setSpending((prev) => prev.filter((s) => s.id !== id));
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
    if (
      !editingTransaction ||
      !formData.description ||
      !formData.amount ||
      !formData.category
    )
      return;

    try {
      const amountNum = Number(formData.amount);
      const updated = await updateSpending(editingTransaction.id, {
        description: formData.description,
        amount: amountNum,
        category: formData.category,
        date: formData.date,
      });

      setSpending((prev) =>
        prev.map((s) => (s.id === editingTransaction.id ? updated : s))
      );
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
              className="w-full mt-6 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100 text-white font-bold h-12 shadow-sm transition-all active:scale-95 cursor-pointer border-none"
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
                  {["All", "Income", "Needs", "Wants", "Savings", "Assets"].map(
                    (cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="cursor-pointer font-bold rounded-xl m-1 text-xs text-slate-600 dark:text-slate-400 focus:bg-emerald-50 dark:focus:bg-emerald-900/20 focus:text-emerald-600"
                      >
                        {cat}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:px-10 md:pt-2 md:pb-8">
            <div className="max-h-[420px] overflow-y-auto pr-2 emerald-scrollbar space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
                  <p className="font-medium">Loading history...</p>
                </div>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((item, idx) => {
                  // Logic to determine icon and color based on category/amount
                  const isIncome = item.amount > 0;
                  const colorClass = isIncome
                    ? "text-emerald-600"
                    : "text-rose-600";
                  const bgClass = isIncome
                    ? "bg-emerald-50 dark:bg-emerald-950/20"
                    : "bg-rose-50 dark:bg-rose-950/20";

                  return (
                    <div
                      key={item.id}
                      className="flex items-center group cursor-pointer border-b border-slate-50 dark:border-slate-800 pb-4 last:border-0 last:pb-0"
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center mr-4 transition-all border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 shrink-0",
                          bgClass
                        )}
                      >
                        {isIncome ? (
                          <TrendingUp className={cn("w-6 h-6", colorClass)} />
                        ) : (
                          <TrendingDown className={cn("w-6 h-6", colorClass)} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-none mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                          {item.description}
                        </h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">
                          {item.category} •{" "}
                          {format(new Date(item.date), "MMM dd, HH:mm")}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "font-black text-sm text-right flex items-center gap-4",
                          isIncome
                            ? "text-emerald-600"
                            : "text-slate-700 dark:text-slate-300"
                        )}
                      >
                        <div className="tabular-nums">
                          {isIncome ? "+" : "-"} Rp{" "}
                          {Math.abs(item.amount).toLocaleString("id-ID")}
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
          className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 h-11"
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
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 pl-11 h-11"
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
            <SelectTrigger className="rounded-2xl border-border dark:bg-slate-900 focus:ring-emerald-500 h-11">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border dark:bg-slate-900 max-h-60">
              {categoryOptions.map((opt) => (
                <SelectItem
                  key={`${opt.type}-${opt.value}`}
                  value={opt.value}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {opt.type}
                    </span>
                    {opt.label}
                  </span>
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
            className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 pl-11 h-11 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
