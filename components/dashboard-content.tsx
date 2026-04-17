"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  CheckCircle,
  Home,
  LogOut,
  PiggyBank,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ChamaType = "SACCO" | "TableBanking" | "MerryGoRound";

interface DashboardContentProps {
  user: {
    fullName: string;
    email: string;
  };
  chama: {
    name: string;
    type: ChamaType;
    memberCount: number;
  } | null;
}

function formatChamaType(chamaType: ChamaType): string {
  if (chamaType === "SACCO") {
    return "SACCO (Savings & Credit)";
  }

  if (chamaType === "TableBanking") {
    return "Table Banking";
  }

  return "Merry-Go-Round";
}

export function DashboardContent({ user, chama }: DashboardContentProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const membersCount = chama?.memberCount ?? 1;
  const monthlyContributions = membersCount * 2500;
  const growthRate = Math.max(8, Math.min(32, membersCount * 2));

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!response.ok) {
        toast.error("Could not sign out", {
          description: "Please try again.",
        });
      } else {
        toast.success("Signed out successfully");
      }
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <div className="w-full px-2 py-8 sm:px-4 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="space-y-3 rounded-xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50 p-6 text-center dark:border-emerald-900/30 dark:from-emerald-950/20 dark:to-teal-950/20 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="size-16 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {user.fullName}!
          </h1>
          <p className="text-lg text-emerald-700 dark:text-emerald-300">
            Here is a quick view of your chama performance and membership.
          </p>
        </div>
      </motion.div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-2 flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
            <Users className="size-4" />
            <span className="text-sm font-medium">Members</span>
          </div>
          <p className="text-3xl font-bold">{membersCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-2 flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
            <PiggyBank className="size-4" />
            <span className="text-sm font-medium">Monthly Savings</span>
          </div>
          <p className="text-3xl font-bold">
            KES {monthlyContributions.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-2 flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
            <TrendingUp className="size-4" />
            <span className="text-sm font-medium">Growth Rate</span>
          </div>
          <p className="text-3xl font-bold">+{growthRate}%</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-2 flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
            <BarChart3 className="size-4" />
            <span className="text-sm font-medium">Status</span>
          </div>
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
            Active
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 sm:p-8 lg:col-span-2"
        >
          <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
            <h2 className="mb-4 text-2xl font-bold">Your Chama</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  Group Name
                </p>
                <p className="mt-1 text-xl font-bold">
                  {chama?.name ?? "No chama onboarded yet"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  Type
                </p>
                <p className="mt-1 text-xl font-bold">
                  {chama ? formatChamaType(chama.type) : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Users className="size-5" /> Members
            </h3>
            <div className="space-y-3">
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {user.email}
                </p>
                <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  Admin
                </span>
              </div>
              <p className="pt-2 text-sm text-zinc-500">
                Total: {membersCount} member{membersCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <TrendingUp className="size-5" /> Next Steps
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                  ✓
                </span>
                <span>Account secured with signed session authentication</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                  ✓
                </span>
                <span>Dashboard access protected on the server</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  →
                </span>
                <span>Add members and assign treasurer/secretary roles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  →
                </span>
                <span>Set contribution schedules and savings targets</span>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-bold">Quick Actions</h3>

            <Link
              href="/dashboard/members"
              className={cn(
                "flex w-full items-center justify-between rounded-lg p-3 font-semibold transition-all",
                "bg-zinc-900 text-zinc-50 hover:opacity-90 dark:bg-zinc-50 dark:text-zinc-900",
              )}
            >
              <span>Manage Members</span>
              <Users className="size-4" />
            </Link>

            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-between rounded-lg p-3 font-semibold transition-all",
                "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
              )}
            >
              <span>Group Settings</span>
              <Settings className="size-4" />
            </button>

            <Link
              href="/"
              className={cn(
                "flex w-full items-center justify-between rounded-lg p-3 text-center font-semibold transition-all",
                "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
              )}
            >
              <span>Back to Home</span>
              <Home className="size-4" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center justify-between rounded-lg bg-red-50 p-3 font-semibold text-red-700 transition-all hover:bg-red-100 disabled:opacity-60 dark:bg-red-950/20 dark:text-red-300"
            >
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
              <LogOut className="size-4" />
            </button>
          </div>

          <div className="space-y-2 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
            <p className="text-xs font-semibold uppercase text-blue-900 dark:text-blue-300">
              Demo Insights
            </p>
            <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-300">
              <li>• Contribution trend is up compared to last cycle</li>
              <li>• Member engagement score is currently strong</li>
              <li>• Cashflow forecast remains positive</li>
              <li>• Fraud signals: no anomalies detected</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
