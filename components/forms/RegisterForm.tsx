"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";

const registerSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^(?:254|\+254|0)?(7|1)\d{8}$/, "Invalid Kenyan phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
        <p className="text-zinc-500 text-sm">Join the future of African savings groups.</p>
      </div>

      <div className="space-y-4">
        {[
          { name: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
          { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
          { name: "phone", label: "Phone Number", type: "text", placeholder: "0712345678" },
          { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
        ].map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor={field.name}>{field.label}</label>
            <div className="relative">
              <input
                {...register(field.name as keyof RegisterValues)}
                type={field.type}
                placeholder={field.placeholder}
                className={cn(
                  "w-full px-4 py-2 rounded-lg border transition-all outline-none bg-zinc-50 dark:bg-zinc-800",
                  errors[field.name as keyof RegisterValues] 
                    ? "border-red-500 focus:ring-1 focus:ring-red-500" 
                    : touchedFields[field.name as keyof RegisterValues]
                      ? "border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      : "border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-50"
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {errors[field.name as keyof RegisterValues] && <AlertCircle className="size-4 text-red-500" />}
                {!errors[field.name as keyof RegisterValues] && touchedFields[field.name as keyof RegisterValues] && <CheckCircle2 className="size-4 text-emerald-500" />}
              </div>
            </div>
            {errors[field.name as keyof RegisterValues] && (
              <span className="text-xs text-red-500 font-medium">{errors[field.name as keyof RegisterValues]?.message}</span>
            )}
          </div>
        ))}
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full mt-2 py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Creating Account..." : "Register"}
      </button>
    </form>
  );
}
