"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^(?:254|\+254|0)?(7|1)\d{8}$/, "Invalid Kenyan phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirm: z.string().min(8, "Password confirmation required"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

interface ApiErrorResponse {
  success: false;
  message: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterValues) => {
    setApiError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific API errors
        if (response.status === 409) {
          setFieldErrors({ email: "Email is already registered" });
        } else {
          setApiError(
            result.message || "Registration failed. Please try again.",
          );
        }
        return;
      }

      // Success: store userId and show success state
      localStorage.setItem("userId", result.data.userId);
      localStorage.setItem("userEmail", result.data.email);
      localStorage.setItem("userFullName", result.data.fullName);

      setShowSuccess(true);

      // Redirect to onboarding after brief delay
      setTimeout(() => {
        router.push("/onboard-chama");
      }, 1500);
    } catch (error) {
      setApiError("Network error. Please check your connection and try again.");
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-md p-8 bg-white/95 dark:bg-emerald-950/25 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-800/40 text-center backdrop-blur-sm">
        <div className="flex justify-center">
          <CheckCircle className="size-16 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome to ChamaConnect!
          </h2>
          <p className="text-emerald-900/70 dark:text-emerald-200/70 text-sm">
            Your account has been created successfully. Let&lsquo;s onboard your
            chama.
          </p>
        </div>
        <div className="pt-2 text-xs text-emerald-800/60 dark:text-emerald-200/60">
          Redirecting to onboarding...
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-md p-8 bg-white/95 dark:bg-emerald-950/25 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-800/40 backdrop-blur-sm"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
        <p className="text-emerald-900/70 dark:text-emerald-200/70 text-sm">
          Join the future of African savings groups.
        </p>
      </div>

      {apiError && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
          <p className="text-sm text-red-700 dark:text-red-300">{apiError}</p>
        </div>
      )}

      <div className="space-y-4">
        {[
          {
            name: "fullName",
            label: "Full Name",
            type: "text",
            placeholder: "John Doe",
          },
          {
            name: "email",
            label: "Email Address",
            type: "email",
            placeholder: "john@example.com",
          },
          {
            name: "phone",
            label: "Phone Number",
            type: "text",
            placeholder: "0712345678",
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "••••••••",
          },
          {
            name: "passwordConfirm",
            label: "Confirm Password",
            type: "password",
            placeholder: "••••••••",
          },
        ].map((field) => {
          const fieldError =
            errors[field.name as keyof RegisterValues] ||
            (fieldErrors[field.name]
              ? { message: fieldErrors[field.name] }
              : undefined);
          const isTouched = touchedFields[field.name as keyof RegisterValues];

          return (
            <div key={field.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor={field.name}>
                {field.label}
              </label>
              <div className="relative">
                <input
                  {...register(field.name as keyof RegisterValues)}
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  aria-invalid={fieldError ? "true" : "false"}
                  aria-describedby={
                    fieldError ? `${field.name}-error` : undefined
                  }
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border transition-all outline-none bg-emerald-50/60 dark:bg-emerald-900/20",
                    fieldError
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : isTouched
                        ? "border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        : "border-emerald-200 dark:border-emerald-800/50 focus:border-emerald-700 dark:focus:border-emerald-300",
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {fieldError && (
                    <AlertCircle className="size-4 text-red-500" />
                  )}
                  {!fieldError && isTouched && (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  )}
                </div>
              </div>
              {fieldError && (
                <span
                  id={`${field.name}-error`}
                  className="text-xs text-red-500 font-medium"
                  role="alert"
                >
                  {fieldError.message}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full mt-2 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-500 text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 shadow-md shadow-emerald-700/30"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? "Creating Account..." : "Register"}
      </button>

      <p className="text-xs text-center text-emerald-900/70 dark:text-emerald-200/70">
        Already have an account?{" "}
        <Link
          href="/register"
          className="font-semibold underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
