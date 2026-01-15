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
  X,
  Edit2,
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
import { useSetupStore } from "@/store/use-setup-store";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function SetupPage() {
  const { language } = useLanguageStore();
  const t = translations[language].dashboard.setup;
  const [mounted, setMounted] = useState(false);

  // Use global store
  const { setup, isLoading, fetchSetup, addItem, removeItem, updateItem } =
    useSetupStore();

  // State for showing add item input
  const [showAddInput, setShowAddInput] = useState<{ [key: string]: boolean }>(
    {}
  );

  // State for new item input value
  const [newItemValue, setNewItemValue] = useState<{ [key: string]: string }>(
    {}
  );

  // State for editing item
  const [editingItem, setEditingItem] = useState<{
    categoryId: string;
    oldName: string;
    newName: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    // Only fetch if not already loaded or simple forced refresh
    fetchSetup();
  }, []);

  // State for Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    type: "",
  });

  const handleSaveCategory = async () => {
    if (!addFormData.name || !addFormData.type) {
      toast.error("Incomplete", {
        description: "Please fill in all fields.",
      });
      return;
    }

    // Map user-friendly types to backend store keys
    // Backend Enum: accountSummary, incomeSources, needs, wants, savings, accountAssets
    const categoryMap: Record<string, string> = {
      account: "accountSummary", // Added account mapping
      income: "incomeSources",
      needs: "needs",
      wants: "wants",
      savings: "savings",
      assets: "accountAssets",
    };

    const storeKey = categoryMap[addFormData.type];

    if (!storeKey) {
      toast.error("Invalid Type", {
        description: "Please select a valid category type.",
      });
      return;
    }

    try {
      await addItem(storeKey, addFormData.name);

      setIsAddModalOpen(false);
      setAddFormData({ name: "", type: "" });

      toast.success("Item Added", {
        description: `Successfully added ${addFormData.name} to ${addFormData.type}.`,
      });
    } catch (error: any) {
      toast.error("Failed to add", { description: error.message });
    }
  };

  const handleRemove = async (categoryId: string, itemName: string) => {
    try {
      await removeItem(categoryId, itemName);
      toast.success("Item Removed", {
        description: `${itemName} has been deleted from this category.`,
      });
    } catch (error: any) {
      toast.error("Failed to remove item", {
        description: error.message,
      });
    }
  };

  const handleAddItem = async (categoryId: string) => {
    const newItem = newItemValue[categoryId]?.trim();

    if (!newItem) {
      toast.error("Invalid Input", {
        description: "Please enter a valid item name.",
      });
      return;
    }

    try {
      // Optimistic update handled in store
      await addItem(categoryId, newItem);

      // Reset input and hide
      setNewItemValue((prev) => ({ ...prev, [categoryId]: "" }));
      setShowAddInput((prev) => ({ ...prev, [categoryId]: false }));

      toast.success("Item Added", {
        description: `${newItem} has been added to this category.`,
      });
    } catch (error: any) {
      toast.error("Failed to add item", {
        description: error.message,
      });
    }
  };

  const handleEditItem = async (categoryId: string) => {
    if (!editingItem || !editingItem.newName.trim()) return;

    const { oldName, newName } = editingItem;

    try {
      // Optimistic update handled in store
      await updateItem(categoryId, oldName, newName.trim());

      setEditingItem(null);

      toast.success("Item Updated", {
        description: `${oldName} has been renamed to ${newName}.`,
      });
    } catch (error: any) {
      toast.error("Failed to update item", {
        description: error.message,
      });
    }
  };

  const toggleAddInput = (categoryTitle: string) => {
    setShowAddInput((prev) => ({
      ...prev,
      [categoryTitle]: !prev[categoryTitle],
    }));

    // Reset input value when closing
    if (showAddInput[categoryTitle]) {
      setNewItemValue((prev) => ({ ...prev, [categoryTitle]: "" }));
    }
  };

  if (!mounted) return null;

  const setupItems = [
    {
      id: "accountSummary",
      title: t.items.account,
      icon: CreditCard,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "hover:border-blue-200 dark:hover:border-blue-800",
    },
    {
      id: "incomeSources",
      title: t.items.income,
      icon: Coins,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      borderColor: "hover:border-emerald-200 dark:hover:border-emerald-800",
    },
    {
      id: "needs",
      title: t.items.needs,
      icon: ShieldCheck,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "hover:border-orange-200 dark:hover:border-orange-800",
    },
    {
      id: "wants",
      title: t.items.wants,
      icon: PieChart,
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/20",
      borderColor: "hover:border-violet-200 dark:hover:border-violet-800",
    },
    {
      id: "savings",
      title: t.items.savings,
      icon: Settings2,
      color: "text-pink-500",
      bg: "bg-pink-50 dark:bg-pink-950/20",
      borderColor: "hover:border-pink-200 dark:hover:border-pink-800",
    },
    {
      id: "accountAssets",
      title: t.items.assets,
      icon: Briefcase,
      color: "text-sky-500",
      bg: "bg-sky-50 dark:bg-sky-950/20",
      borderColor: "hover:border-sky-200 dark:hover:border-sky-800",
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
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
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
                value={addFormData.name}
                onChange={(e) =>
                  setAddFormData({ ...addFormData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="type"
                className="text-slate-700 dark:text-slate-300 font-bold ml-1"
              >
                {t.form.type}
              </Label>
              <Select
                value={addFormData.type}
                onValueChange={(val) =>
                  setAddFormData({ ...addFormData, type: val })
                }
              >
                <SelectTrigger className="rounded-2xl border-border dark:bg-slate-900 focus:ring-emerald-500 h-11">
                  <SelectValue placeholder={t.form.typePlaceholder} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border dark:bg-slate-900">
                  <SelectItem value="account" className="cursor-pointer">
                    Account (Wallet/Bank)
                  </SelectItem>
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
        {isLoading || !setup ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
            <p className="font-medium">Loading your setup...</p>
          </div>
        ) : (
          setupItems.map((item) => {
            const itemList =
              (setup[item.id as keyof typeof setup] as string[]) || [];

            return (
              <ResponsiveModal
                key={item.id}
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
                          {itemList.length}
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
                  <div className="flex-1 space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto emerald-scrollbar pr-2">
                    {itemList.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                          No items yet. Add your first item below!
                        </p>
                      </div>
                    ) : (
                      itemList.map((itemName, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
                        >
                          {editingItem?.categoryId === item.id &&
                          editingItem?.oldName === itemName ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                value={editingItem.newName}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    newName: e.target.value,
                                  })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleEditItem(item.id);
                                  if (e.key === "Escape") setEditingItem(null);
                                }}
                                className="h-9 rounded-xl border-emerald-200 focus-visible:ring-emerald-500 flex-1"
                                autoFocus
                              />
                              <Button
                                onClick={() => handleEditItem(item.id)}
                                size="sm"
                                className="h-9 w-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-0"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => setEditingItem(null)}
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 text-slate-400 hover:bg-slate-100 rounded-xl p-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <span className="font-bold text-slate-700 dark:text-slate-300 flex-1">
                                {itemName}
                              </span>
                              <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <Button
                                  onClick={() =>
                                    setEditingItem({
                                      categoryId: item.id,
                                      oldName: itemName,
                                      newName: itemName,
                                    })
                                  }
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg p-0"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleRemove(item.id, itemName)
                                  }
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg p-0"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="shrink-0 pt-4 space-y-3">
                    {showAddInput[item.id] && (
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 space-y-4 animate-smooth-in">
                        <Label
                          htmlFor={`new-item-${item.id}`}
                          className="text-slate-700 dark:text-slate-300 font-bold text-sm block mb-2"
                        >
                          New Item Name
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={`new-item-${item.id}`}
                            placeholder={`Enter ${item.title.toLowerCase()} name...`}
                            value={newItemValue[item.id] || ""}
                            onChange={(e) =>
                              setNewItemValue((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddItem(item.id);
                              }
                            }}
                            className="flex-1 rounded-xl border-emerald-200 dark:border-emerald-800 dark:bg-slate-900 focus-visible:ring-emerald-500 h-11"
                            autoFocus
                          />
                          <Button
                            onClick={() => handleAddItem(item.id)}
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-4 cursor-pointer transition-all active:scale-95 border-none"
                          >
                            Add
                          </Button>
                        </div>
                        <Button
                          onClick={() => toggleAddInput(item.id)}
                          variant="ghost"
                          size="sm"
                          className="w-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                    {!showAddInput[item.id] && (
                      <div className="p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 transition-all">
                        <Button
                          onClick={() => toggleAddInput(item.id)}
                          variant="outline"
                          className="rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold h-11 px-6 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all"
                        >
                          <Plus className="w-4 h-4 mr-2" /> Add custom item
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </ResponsiveModal>
            );
          })
        )}
      </div>
    </div>
  );
}
