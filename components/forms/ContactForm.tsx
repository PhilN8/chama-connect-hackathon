"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const contactFormSchema = z.object({
  fullName: z
    .union([
      z.string().trim().min(2, "Full name must be at least 2 characters"),
      z.literal(""),
    ])
    .transform((value) => value.trim())
    .optional(),
  email: z.email("Enter a valid email address"),
  subject: z
    .string()
    .trim()
    .min(2, "Subject is required")
    .max(120, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters")
    .max(2000, "Message is too long"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    const payload = {
      fullName: values.fullName?.trim() || undefined,
      email: values.email,
      subject: values.subject,
      message: values.message,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        toast.error(result.message || "Failed to send message");
        return;
      }

      toast.success("Message sent", {
        description: "Thanks for reaching out. We will contact you soon.",
      });
      reset();
    } catch {
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 md:grid-cols-2"
    >
      <label className="flex flex-col gap-1.5 text-sm font-medium md:col-span-1">
        <span>
          Full Name <span className="text-zinc-500">(optional)</span>
        </span>
        <input
          type="text"
          placeholder="Your full name"
          {...register("fullName")}
          className={cn(
            "rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2 dark:border-emerald-800/40 dark:bg-emerald-950/40",
            errors.fullName && "border-red-500 focus:ring-red-500",
          )}
          aria-invalid={errors.fullName ? "true" : "false"}
        />
        {errors.fullName && (
          <span className="text-xs text-red-600 dark:text-red-400">
            {errors.fullName.message}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium md:col-span-1">
        <span>
          Email <span className="text-red-500">*</span>
        </span>
        <input
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className={cn(
            "rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2 dark:border-emerald-800/40 dark:bg-emerald-950/40",
            errors.email && "border-red-500 focus:ring-red-500",
          )}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <span className="text-xs text-red-600 dark:text-red-400">
            {errors.email.message}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium md:col-span-2">
        <span>
          Subject <span className="text-red-500">*</span>
        </span>
        <input
          type="text"
          placeholder="How can we help?"
          {...register("subject")}
          className={cn(
            "rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2 dark:border-emerald-800/40 dark:bg-emerald-950/40",
            errors.subject && "border-red-500 focus:ring-red-500",
          )}
          aria-invalid={errors.subject ? "true" : "false"}
        />
        {errors.subject && (
          <span className="text-xs text-red-600 dark:text-red-400">
            {errors.subject.message}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium md:col-span-2">
        <span>
          Message <span className="text-red-500">*</span>
        </span>
        <textarea
          rows={6}
          placeholder="Share your request, question, or feedback"
          {...register("message")}
          className={cn(
            "rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2 dark:border-emerald-800/40 dark:bg-emerald-950/40",
            errors.message && "border-red-500 focus:ring-red-500",
          )}
          aria-invalid={errors.message ? "true" : "false"}
        />
        {errors.message && (
          <span className="text-xs text-red-600 dark:text-red-400">
            {errors.message.message}
          </span>
        )}
      </label>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-linear-to-r from-emerald-600 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-700/30 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}
