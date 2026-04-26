"use client";

import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { User, Mail, Phone, Shield, Clock } from "lucide-react";

interface SessionUser {
  id: string;
  name?: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  phoneNumber?: string;
  globalRole: "USER" | "SYSTEM_ADMIN";
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-zinc-500">Loading profile...</p>
      </div>
    );
  }

  const user = session.user as SessionUser;
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="w-full px-2 py-8 sm:px-4 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Profile
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              <User className="size-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name || "User"}</h2>
              <p className="text-sm text-zinc-500">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-zinc-100 p-4 dark:border-zinc-800">
              <Mail className="size-5 text-zinc-400" />
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  Email
                </p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-zinc-100 p-4 dark:border-zinc-800">
              <Phone className="size-5 text-zinc-400" />
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  Phone
                </p>
                <p className="font-medium">{user.phoneNumber || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-zinc-100 p-4 dark:border-zinc-800">
              <Shield className="size-5 text-zinc-400" />
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  Role
                </p>
                <p className="font-medium">{user.globalRole || "USER"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-zinc-100 p-4 dark:border-zinc-800">
              <Clock className="size-5 text-zinc-400" />
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  Member Since
                </p>
                <p className="font-medium">{joinDate}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg bg-zinc-100 p-3 font-semibold transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                <span>Edit Profile</span>
                <User className="size-4" />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg bg-zinc-100 p-3 font-semibold transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                <span>Change Password</span>
                <Shield className="size-4" />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg bg-zinc-100 p-3 font-semibold transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                <span>Notification Settings</span>
                <Phone className="size-4" />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Account Status
            </p>
            <p className="mt-2 text-sm text-amber-900/80 dark:text-amber-200/85">
              {user.emailVerified
                ? "Your email is verified. You have full access to all features."
                : "Your email is not yet verified. Please check your inbox for the verification link."}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}