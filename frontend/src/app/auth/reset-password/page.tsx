"use client";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Suspense } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newPassword = (e.target as HTMLFormElement).pass.value;
    const confirmPassword = (e.target as HTMLFormElement).confirm.value;

    if (newPassword !== confirmPassword) {
      toast.error("Error", {
        description: "Passwords do not match",
      });
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      toast.success("Password updated!", {
        description: "You can now login with your new password.",
      });
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast.error("Error", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="rounded-3xl bg-card border border-border">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="pass"
                className="font-bold text-sm text-foreground ml-1"
              >
                New Password
              </Label>
              <PasswordInput
                id="pass"
                placeholder="••••••••"
                required
                className="tracking-widest shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="confirm"
                className="font-bold text-sm text-foreground ml-1"
              >
                Confirm Password
              </Label>
              <PasswordInput
                id="confirm"
                placeholder="••••••••"
                required
                className="tracking-widest shadow-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg transition-all hover:scale-[1.02] active:scale-95 mt-2"
            >
              {loading ? (
                <>
                  Updating... <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
