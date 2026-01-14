"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/api";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const email = (e.target as HTMLFormElement).email.value;

    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset link sent!", {
        description: "Check your email for instructions.",
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to send reset link. Please try again.";
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
                htmlFor="email"
                className="font-bold text-sm text-foreground ml-1"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-12 rounded-2xl border-border focus:ring-primary bg-muted/30 px-5 font-medium"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg transition-all active:scale-95"
            >
              {loading ? (
                <>
                  Sending... <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          <Link
            href="/auth/login"
            className="mt-6 flex items-center justify-center lg:justify-start gap-3 text-sm font-bold text-muted-foreground hover:text-primary transition-all pt-6 border-t border-border"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />{" "}
            Back to Login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
