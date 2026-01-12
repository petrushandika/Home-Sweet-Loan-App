"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setIsVerifying(true);
    setVerificationStatus("loading");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/verify-email",
        {
          token: verificationToken,
        }
      );

      if (response.data.success) {
        setVerificationStatus("success");
        toast.success("Email Verified!", {
          description:
            "Your email has been verified successfully. Redirecting to login...",
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (error: any) {
      setVerificationStatus("error");
      const message =
        error.response?.data?.message ||
        "Failed to verify email. The link may be invalid or expired.";
      setErrorMessage(message);
      toast.error("Verification Failed", {
        description: message,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      // You'll need to get the email from somewhere (localStorage, or ask user to input)
      const email = localStorage.getItem("pendingVerificationEmail");

      if (!email) {
        toast.error("Email not found", {
          description: "Please register again or enter your email.",
        });
        return;
      }

      await axios.post("http://localhost:8000/api/auth/resend-verification", {
        email,
      });

      toast.success("Verification Sent", {
        description: "A new verification link has been sent to your email.",
      });
    } catch (error: any) {
      toast.error("Failed to resend", {
        description:
          error.response?.data?.message ||
          "Could not resend verification email.",
      });
    } finally {
      setIsResending(false);
    }
  };

  // If verifying with token
  if (token && verificationStatus === "loading") {
    return (
      <div className="w-full">
        <Card className="rounded-3xl bg-white border border-slate-200">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-16 w-16 text-emerald-600 animate-spin" />
              <h2 className="text-xl font-bold text-slate-700">
                Verifying your email...
              </h2>
              <p className="text-sm text-slate-500">
                Please wait while we verify your email address.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If verification successful
  if (verificationStatus === "success") {
    return (
      <div className="w-full">
        <Card className="rounded-3xl bg-white border border-slate-200">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle className="h-16 w-16 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-700">
                Email Verified!
              </h2>
              <p className="text-sm text-slate-500 text-center">
                Your email has been verified successfully. You will be
                redirected to login shortly.
              </p>
              <Link href="/auth/login">
                <Button className="mt-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  Go to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If verification failed
  if (verificationStatus === "error") {
    return (
      <div className="w-full">
        <Card className="rounded-3xl bg-white border border-slate-200">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <XCircle className="h-16 w-16 text-red-600" />
              <h2 className="text-xl font-bold text-slate-700">
                Verification Failed
              </h2>
              <p className="text-sm text-slate-500 text-center">
                {errorMessage}
              </p>

              <div className="space-y-3 w-full mt-6">
                <Button
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg transition-all active:scale-95"
                >
                  {isResending ? "Resending..." : "Resend Verification Link"}
                </Button>

                <Link href="/auth/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-2xl border-slate-200 hover:bg-slate-50 font-bold uppercase tracking-widest text-xs text-slate-500"
                  >
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default: Show resend email UI (no token in URL)
  return (
    <div className="w-full">
      <Card className="rounded-3xl bg-white border border-slate-200">
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Mail className="h-16 w-16 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-700">
              Check Your Email
            </h2>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 italic text-sm text-center font-bold text-slate-400">
            Didn't receive the email? Check your spam folder or resend below.
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleResend}
              disabled={isResending}
              className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg transition-all active:scale-95"
            >
              {isResending ? "Resending..." : "Resend Link"}
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl border-slate-200 hover:bg-slate-50 font-bold uppercase tracking-widest text-xs text-slate-500 group bg-white hover:border-emerald-200 transition-all px-0"
            >
              Change Email
            </Button>
          </div>

          <div className="pt-6 border-t border-slate-50 text-center">
            <Link
              href="/auth/login"
              className="text-sm font-bold text-slate-400 hover:text-emerald-600"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
