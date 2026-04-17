"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const newsletterSchema = z.object({
  email: z.email("Enter a valid email address"),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    mode: "onTouched",
  });

  const onSubmit = async (values: NewsletterValues) => {
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        toast.error(result.message || "Subscription failed");
        return;
      }

      toast.success("You are subscribed", {
        description: "Expect occasional product and launch updates.",
      });
      reset();
    } catch {
      toast.error("Network error", {
        description: "Please try again in a moment.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-4 flex w-full max-w-xl flex-col gap-2 sm:flex-row"
    >
      <div className="flex-1">
        <label htmlFor="newsletterEmail" className="sr-only">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="newsletterEmail"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className={cn(
            "w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-emerald-900 outline-none ring-emerald-500 transition focus:ring-2",
            errors.email && "border-red-500 focus:ring-red-500",
          )}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="mt-1 text-left text-xs text-red-200">
            {errors.email.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-emerald-950 px-6 py-3 font-semibold text-emerald-50 transition-colors hover:bg-emerald-900 disabled:opacity-50"
      >
        {isSubmitting ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
