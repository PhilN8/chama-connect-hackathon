"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { AlertCircle, CheckCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";

const DEMO_EMAIL = "demo@chamaconnect.io";
const DEMO_PASSWORD = "Demo@12345";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const handleDemoSignIn = async () => {
    setApiError("");
    try {
      const { error } = await signIn.email({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });

      if (error) {
        setApiError(error.message || "Demo login failed");
        toast.error(error.message || "Demo login failed");
        return;
      }

      setIsSuccess(true);
      toast.success("Signed in as demo user", {
        description: "Welcome back. Redirecting to your dashboard.",
      });
      setTimeout(() => {
        const nextPath = searchParams.get("next") || "/dashboard";
        router.push(nextPath);
      }, 800);
    } catch {
      setApiError("Network error. Please try again.");
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
    }
  };

  const onSubmit = async (values: LoginValues) => {
    setApiError("");

    try {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setApiError("Login failed");
        toast.error(error.message || "Login failed");
        return;
      }

      setIsSuccess(true);
      toast.success("Signed in", {
        description: "Welcome back. Redirecting to your dashboard.",
      });
      setTimeout(() => {
        const nextPath = searchParams.get("next") || "/dashboard";
        router.push(nextPath);
      }, 800);
    } catch {
      setApiError("Network error. Please try again.");
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full p-8 bg-white/95 dark:bg-emerald-950/25 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-800/40 backdrop-blur-sm"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
        <p className="text-emerald-900/70 dark:text-emerald-200/70 text-sm">
          Sign in to continue managing your chama.
        </p>
      </div>

      <div className="rounded-lg border border-sky-200 bg-sky-50/80 p-3 dark:border-sky-900/40 dark:bg-sky-950/25">
        <p className="text-xs font-semibold text-sky-900 dark:text-sky-100">
          Demo Account
        </p>
        <p className="mt-1 text-xs text-sky-800/90 dark:text-sky-200/90">
          Email: {DEMO_EMAIL}
        </p>
        <button
          type="button"
          onClick={handleDemoSignIn}
          disabled={isSubmitting}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-sky-300 bg-white/80 px-3 py-1.5 text-xs font-semibold text-sky-900 transition-colors hover:bg-white dark:border-sky-700 dark:bg-sky-900/40 dark:text-sky-100 dark:hover:bg-sky-900/60 disabled:opacity-50"
        >
          <User className="size-3" />
          Sign in as Demo User
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 dark:bg-zinc-900">
            Or continue with
          </span>
        </div>
      </div>

      {apiError && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
          <AlertCircle className="size-4 mt-0.5" />
          <span>{apiError}</span>
        </div>
      )}

      {isSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-sm text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
          <CheckCircle className="size-4 mt-0.5" />
          <span>Login successful. Redirecting...</span>
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className={cn(
              "w-full px-4 py-2 rounded-lg border bg-emerald-50/60 dark:bg-emerald-900/20 outline-none transition-all",
              errors.email
                ? "border-red-500 focus:border-red-500"
                : "border-emerald-200 dark:border-emerald-800/50 focus:border-emerald-700 dark:focus:border-emerald-300",
            )}
          />
          {errors.email && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={cn(
              "w-full px-4 py-2 rounded-lg border bg-emerald-50/60 dark:bg-emerald-900/20 outline-none transition-all",
              errors.password
                ? "border-red-500 focus:border-red-500"
                : "border-emerald-200 dark:border-emerald-800/50 focus:border-emerald-700 dark:focus:border-emerald-300",
            )}
          />
          {errors.password && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-1 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-500 text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 shadow-md shadow-emerald-700/30"
      >
        {isSubmitting ? "Signing In..." : "Login"}
      </button>

      <p className="text-xs text-center text-emerald-900/70 dark:text-emerald-200/70">
        New here?{" "}
        <Link
          href="/sign-up"
          className="font-semibold underline-offset-2 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
