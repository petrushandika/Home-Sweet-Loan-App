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
  PiggyBank,
  Landmark,
  Briefcase,
  TrendingUp,
  Trash2,
  Edit2,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useSearchStore } from "@/store/use-search-store";
import { useMemo } from "react";
import { useSetupStore } from "@/store/use-setup-store";
import { useAssetsStore } from "@/store/use-assets-store";
import { Asset, AssetType } from "@/lib/api/assets";
import { Loader2 } from "lucide-react";

export default function AssetsPage() {
  const { language } = useLanguageStore();
  const langKey = language as keyof typeof translations;
  const t = translations[langKey].dashboard.assets;
  const { query: searchQuery } = useSearchStore();
  const [mounted, setMounted] = useState(false);

  // Global Stores
  const { setup, fetchSetup } = useSetupStore();
  const {
    assets,
    summary,
    isLoading,
    fetchAssets,
    addAsset,
    updateAsset,
    deleteAsset,
  } = useAssetsStore();

  // Registration Form State
  const [formData, setFormData] = useState({
    name: "",
    type: "LIQUID" as AssetType,
    value: "",
    account: "",
  });

  // Edit State
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Privacy State - Hide/Show Amounts
  const [hiddenAmounts, setHiddenAmounts] = useState(false);

  // Load hidden preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('assets-hidden-amounts');
    if (saved === 'true') {
      setHiddenAmounts(true);
    }
  }, []);

  // Toggle visibility
  const toggleAmountsVisibility = () => {
    const newValue = !hiddenAmounts;
    setHiddenAmounts(newValue);
    localStorage.setItem('assets-hidden-amounts', String(newValue));
  };

  useEffect(() => {
    setMounted(true);
    fetchSetup();
    fetchAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter(
      (asset: Asset) =>
        asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [assets, searchQuery]);

  const handleRegister = async () => {
    if (!formData.name || !formData.value || !formData.account) {
      toast.error("Invalid Input", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      await addAsset({
        type: formData.type,
        description: formData.name,
        value: Number(formData.value),
        account: formData.account,
      });

      resetForm();
      toast.success("Asset Registered", {
        description: "Successfully added new item to your wealth portfolio.",
      });
    } catch (error: any) {
      toast.error("Failed to register asset", {
        description: error.message,
      });
    }
  };

  const handleUpdateValue = async (id: string, newValue: string) => {
    if (isNaN(Number(newValue))) return;

    try {
      await updateAsset(id, { value: Number(newValue) });
      toast.success("Asset Updated", {
        description: "Refreshed your portfolio valuation.",
      });
    } catch (error: any) {
      toast.error("Failed to update asset", { description: error.message });
    }
  };

  const handleOpenEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.description,
      type: asset.type,
      value: asset.value.toString(),
      account: asset.account,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingAsset || !formData.name || !formData.value || !formData.account)
      return;

    try {
      await updateAsset(editingAsset.id, {
        description: formData.name,
        type: formData.type,
        value: Number(formData.value),
        account: formData.account,
      });

      setIsEditModalOpen(false);
      setEditingAsset(null);
      resetForm();

      toast.success("Asset Updated", {
        description: "Your asset details have been saved.",
      });
    } catch (error: any) {
      toast.error("Failed to update asset", { description: error.message });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAsset(id);
      toast.success("Asset Removed", {
        description: "Portfolio has been adjusted.",
      });
    } catch (error: any) {
      toast.error("Failed to delete asset", { description: error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "LIQUID",
      value: "",
      account: "",
    });
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

        <ResponsiveModal
          title={t.modalTitle}
          description={t.modalDesc}
          trigger={
            <Button className="w-full sm:w-auto rounded-full px-6 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-bold transition-all hover:scale-105 active:scale-95 border-none duration-300">
              <Plus className="mr-2 h-4 w-4" /> {t.addBtn}
            </Button>
          }
        >
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label
                htmlFor="asset-name"
                className="text-slate-700 dark:text-slate-300 font-bold ml-1"
              >
                {t.form.name}
              </Label>
              <Input
                id="asset-name"
                placeholder={t.form.namePlaceholder}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 h-11 transition-all duration-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="asset-type"
                  className="text-slate-700 dark:text-slate-300 font-bold ml-1"
                >
                  {t.form.type}
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(val: AssetType) =>
                    setFormData({ ...formData, type: val })
                  }
                >
                  <SelectTrigger className="rounded-2xl border-border dark:bg-slate-900 focus:ring-emerald-500 h-11 transition-all duration-300">
                    <SelectValue placeholder={t.form.typePlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border dark:bg-slate-900">
                    <SelectItem value="LIQUID" className="cursor-pointer">
                      Liquid / Cash
                    </SelectItem>
                    <SelectItem value="NON_LIQUID" className="cursor-pointer">
                      Non-Liquid / Property
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="asset-account"
                  className="text-slate-700 dark:text-slate-300 font-bold ml-1"
                >
                  Account / Provider
                </Label>
                <Select
                  value={formData.account}
                  onValueChange={(val) =>
                    setFormData({ ...formData, account: val })
                  }
                >
                  <SelectTrigger className="rounded-2xl border-border dark:bg-slate-900 focus:ring-emerald-500 h-11">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border dark:bg-slate-900">
                    {(setup?.accountAssets || []).map((acc: string) => (
                      <SelectItem
                        key={acc}
                        value={acc}
                        className="cursor-pointer"
                      >
                        {acc}
                      </SelectItem>
                    ))}
                    <SelectItem
                      value="Other/Manual"
                      className="cursor-pointer font-italic"
                    >
                      Other (Manual)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="asset-value"
                className="text-slate-700 dark:text-slate-300 font-bold ml-1"
              >
                {t.form.value}
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  Rp
                </span>
                <Input
                  id="asset-value"
                  placeholder="0"
                  value={formData.value}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setFormData({ ...formData, value: value });
                  }}
                  className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 pl-11 h-11 transition-all duration-300"
                />
              </div>
            </div>
            <Button
              onClick={handleRegister}
              type="submit"
              className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 mt-2 cursor-pointer transition-all active:scale-95 border-none duration-300 hover:shadow-sm"
            >
              {t.registerBtn}
            </Button>
          </div>
        </ResponsiveModal>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <AssetMiniCard
          title={t.liquid}
          amount={`Rp ${(summary?.totalLiquidAssets || 0).toLocaleString()}`}
          icon={Landmark}
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/20"
          border="border-emerald-100 dark:border-emerald-800"
          isHidden={hiddenAmounts}
        />
        <AssetMiniCard
          title={t.nonLiquid}
          amount={`Rp ${(summary?.totalNonLiquidAssets || 0).toLocaleString()}`}
          icon={Briefcase}
          color="text-blue-600"
          bg="bg-blue-50 dark:bg-blue-950/20"
          border="border-blue-100 dark:border-blue-800"
          isHidden={hiddenAmounts}
        />
        <AssetMiniCard
          title={t.total}
          amount={`Rp ${(summary?.totalAssets || 0).toLocaleString()}`}
          icon={TrendingUp}
          color="text-violet-600"
          bg="bg-violet-50 dark:bg-violet-950/20"
          border="border-violet-100 dark:border-violet-800"
          isHidden={hiddenAmounts}
        />
      </div>

      <Card className="border-border rounded-3xl bg-white dark:bg-slate-900 overflow-hidden border transition-all duration-500 hover:shadow-sm">
        <CardHeader className="p-6 md:px-10 md:pt-8 md:pb-4 border-b border-border/50">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0">
                <PiggyBank className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">
                  {t.breakdown}
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 font-medium tracking-tight transition-colors duration-300">
                  {t.breakdownDesc}
                </CardDescription>
              </div>
            </div>
            {/* Hide/Show Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAmountsVisibility}
              className="h-10 w-10 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors shrink-0"
            >
              {hiddenAmounts ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:px-10 md:pt-6 md:pb-8 space-y-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
              <p className="font-medium">Loading assets...</p>
            </div>
          ) : filteredAssets.length > 0 ? (
            filteredAssets.map((item: Asset) => {
              const isLiquid = item.type === "LIQUID";
              const IconComp = isLiquid ? Landmark : Briefcase;
              const colorClass = isLiquid
                ? "text-emerald-600"
                : "text-blue-600";
              const bgClass = isLiquid
                ? "bg-emerald-50 dark:bg-emerald-950/20"
                : "bg-blue-50 dark:bg-blue-950/20";

              return (
                <div
                  key={item.id}
                  className="flex items-center group cursor-pointer border-b border-slate-50 dark:border-slate-800 pb-5 last:border-0 last:pb-0"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mr-5 transition-all border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 shrink-0",
                      bgClass
                    )}
                  >
                    <IconComp className={cn("w-6 h-6", colorClass)} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base text-slate-800 dark:text-white leading-none mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                      {item.description}
                    </h4>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none">
                        {item.type} • {item.account}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {hiddenAmounts ? (
                        <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-100 dark:border-slate-800">
                          <span className="text-sm font-black text-slate-400 tabular-nums">
                            ••••••
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-100 dark:border-slate-800 group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all">
                          <span className="text-xs font-black text-slate-500 mr-1 tabular-nums">
                            Rp
                          </span>
                          <input
                            type="text"
                            defaultValue={item.value}
                            onInput={(e) => {
                              e.currentTarget.value =
                                e.currentTarget.value.replace(/[^0-9]/g, "");
                            }}
                            onBlur={(e) =>
                              handleUpdateValue(item.id, e.target.value)
                            }
                            className="bg-transparent border-none outline-none w-24 text-right font-bold text-slate-700 dark:text-slate-300 text-sm"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        onClick={() => handleOpenEdit(item)}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-slate-400 italic">
              <p>No assets found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <ResponsiveModal
        title="Edit Asset"
        description="Modify your asset details below."
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      >
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label
              htmlFor="edit-asset-name"
              className="text-slate-700 dark:text-slate-300 font-bold ml-1"
            >
              {t.form.name}
            </Label>
            <Input
              id="edit-asset-name"
              placeholder={t.form.namePlaceholder}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 h-11 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label
                htmlFor="edit-asset-type"
                className="text-slate-700 dark:text-slate-300 font-bold ml-1"
              >
                {t.form.type}
              </Label>
              <Select
                value={formData.type}
                onValueChange={(val: AssetType) =>
                  setFormData({ ...formData, type: val })
                }
              >
                <SelectTrigger className="rounded-2xl border-border dark:bg-slate-900 focus:ring-emerald-500 h-11 transition-all">
                  <SelectValue placeholder={t.form.typePlaceholder} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border dark:bg-slate-900">
                  <SelectItem value="LIQUID" className="cursor-pointer">
                    Liquid / Cash
                  </SelectItem>
                  <SelectItem value="NON_LIQUID" className="cursor-pointer">
                    Non-Liquid / Property
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="edit-asset-account"
                className="text-slate-700 dark:text-slate-300 font-bold ml-1"
              >
                Account
              </Label>
              <Select
                value={formData.account}
                onValueChange={(val) =>
                  setFormData({ ...formData, account: val })
                }
              >
                <SelectTrigger className="rounded-2xl border-border dark:bg-slate-900 focus:ring-emerald-500 h-11">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border dark:bg-slate-900">
                  {(setup?.accountAssets || []).map((acc: string) => (
                    <SelectItem
                      key={acc}
                      value={acc}
                      className="cursor-pointer"
                    >
                      {acc}
                    </SelectItem>
                  ))}
                  <SelectItem
                    value="Other/Manual"
                    className="cursor-pointer font-italic"
                  >
                    Other (Manual)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="edit-asset-value"
              className="text-slate-700 dark:text-slate-300 font-bold ml-1"
            >
              {t.form.value}
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                Rp
              </span>
              <Input
                id="edit-asset-value"
                placeholder="0"
                value={formData.value}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setFormData({ ...formData, value: value });
                }}
                className="rounded-2xl border-border dark:bg-slate-900 focus-visible:ring-emerald-500 pl-11 h-11 transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingAsset(null);
                resetForm();
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

function AssetMiniCard({
  title,
  amount,
  icon: Icon,
  color,
  bg,
  border,
  isHidden,
}: {
  title: string;
  amount: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  isHidden?: boolean;
}) {
  return (
    <Card
      className={cn(
        "border-border shadow-none rounded-3xl bg-white dark:bg-slate-900 p-8 group transition-all border hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer relative overflow-hidden"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20",
          bg
        )}
      />
      <div className="flex items-center gap-4 mb-5 relative z-10">
        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border shadow-xs group-hover:scale-105 shrink-0",
            bg,
            border
          )}
        >
          <Icon className={cn("w-6 h-6", color)} />
        </div>
        <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {title}
        </span>
      </div>
      <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight relative z-10">
        {isHidden ? "••••••" : amount}
      </div>
    </Card>
  );
}
