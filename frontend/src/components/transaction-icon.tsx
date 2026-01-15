import {
  Coffee,
  ShoppingBag,
  Home,
  Bus,
  Zap,
  Gamepad2,
  Stethoscope,
  GraduationCap,
  Plane,
  Gift,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Smartphone,
  Wifi,
  Car,
  Utensils,
  Music,
  ShoppingCart,
  Briefcase,
  Heart,
  PiggyBank,
  Wallet,
  Coins,
  ShieldCheck,
  PieChart,
  Settings2,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const getCategoryIcon = (category: string) => {
  const normalized = category.toLowerCase();

  // Income Sources -> Coins
  if (
    normalized.includes("salary") ||
    normalized.includes("wage") ||
    normalized.includes("income") ||
    normalized.includes("bonus")
  )
    return Coins;

  // Needs -> ShieldCheck (Protection/Essentials)
  if (
    normalized.includes("insurance") ||
    normalized.includes("security") ||
    normalized.includes("tax")
  )
    return ShieldCheck;

  // Specific Needs mapping
  if (
    normalized.includes("food") ||
    normalized.includes("dining") ||
    normalized.includes("restaurant") ||
    normalized.includes("groceries")
  )
    return Utensils;
  if (
    normalized.includes("transport") ||
    normalized.includes("fuel") ||
    normalized.includes("taxi") ||
    normalized.includes("car")
  )
    return Bus;
  if (
    normalized.includes("home") ||
    normalized.includes("rent") ||
    normalized.includes("mortgage")
  )
    return Home;
  if (
    normalized.includes("utility") ||
    normalized.includes("bill") ||
    normalized.includes("electricity") ||
    normalized.includes("water")
  )
    return Zap;
  if (
    normalized.includes("internet") ||
    normalized.includes("phone") ||
    normalized.includes("wifi")
  )
    return Wifi;
  if (
    normalized.includes("health") ||
    normalized.includes("doctor") ||
    normalized.includes("medical")
  )
    return Stethoscope;
  if (
    normalized.includes("education") ||
    normalized.includes("course") ||
    normalized.includes("school")
  )
    return GraduationCap;

  // Wants -> PieChart (Lifestyle)
  if (
    normalized.includes("entertainment") ||
    normalized.includes("movie") ||
    normalized.includes("game")
  )
    return Gamepad2;
  if (normalized.includes("shopping") || normalized.includes("clothing"))
    return ShoppingBag;
  if (
    normalized.includes("travel") ||
    normalized.includes("vacation") ||
    normalized.includes("hotel")
  )
    return Plane;
  if (normalized.includes("gift") || normalized.includes("donation"))
    return Gift;
  if (normalized.includes("music") || normalized.includes("spotify"))
    return Music;
  if (normalized.includes("coffee") || normalized.includes("cafe"))
    return Coffee;

  // Savings -> Settings2 / PiggyBank
  if (
    normalized.includes("saving") ||
    normalized.includes("invest") ||
    normalized.includes("deposit")
  )
    return PiggyBank;

  // Assets -> Briefcase / Wallet
  if (
    normalized.includes("asset") ||
    normalized.includes("stock") ||
    normalized.includes("crypto")
  )
    return Briefcase;

  // Catch-all based on broader keywords
  if (normalized.includes("card") || normalized.includes("bank"))
    return CreditCard;

  return DollarSign;
};

export const TransactionIcon = ({
  category,
  isIncome,
  className,
}: {
  category: string;
  isIncome: boolean;
  className?: string;
}) => {
  const Icon = getCategoryIcon(category);
  const colorClass = isIncome
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";
  const bgClass = isIncome
    ? "bg-emerald-50 dark:bg-emerald-950/30 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50"
    : "bg-rose-50 dark:bg-rose-950/30 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/50";

  return (
    <div
      className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border border-transparent group-hover:scale-105",
        bgClass,
        className
      )}
    >
      <Icon
        className={cn(
          "w-6 h-6 transition-transform duration-300 group-hover:rotate-6",
          colorClass
        )}
      />
    </div>
  );
};
