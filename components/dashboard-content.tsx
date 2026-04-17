"use client";

import Link from "next/link";
import {
  BarChart3,
  CheckCircle,
  PiggyBank,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    totalContributions: number;
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
  const membersCount = chama?.memberCount ?? 0;
  const totalContributions = chama?.totalContributions ?? 0;
  const growthRate =
    membersCount === 0 ? 0 : Math.max(8, Math.min(32, membersCount * 2));

  return (
    <div className="w-full px-2 py-8 sm:px-4 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="rounded-xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50 p-6 dark:border-emerald-900/30 dark:from-emerald-950/20 dark:to-teal-950/20 sm:p-8">
          <div className="mb-3 flex items-center gap-3">
            <CheckCircle className="size-8 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Dashboard Overview
            </p>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {user.fullName}!
          </h1>
          <p className="mt-2 text-base text-emerald-700 dark:text-emerald-300 sm:text-lg">
            {membersCount > 0
              ? "Quick snapshot of your chama performance, membership, and savings."
              : "This account has no members yet. Use the demo credentials to see preloaded member data."}
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
            <span className="text-sm font-medium">Total Contributions</span>
          </div>
          <p className="text-3xl font-bold">
            KES {totalContributions.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-2 flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
            <TrendingUp className="size-4" />
            <span className="text-sm font-medium">Growth Rate</span>
          </div>
          <p className="text-3xl font-bold">
            {growthRate === 0 ? "-" : `+${growthRate}%`}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-2 flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
            <BarChart3 className="size-4" />
            <span className="text-sm font-medium">Status</span>
          </div>
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
            {membersCount > 0 ? "Active" : "No data"}
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2"
        >
          <h2 className="text-2xl font-bold">Your Chama</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
              <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                Group Name
              </p>
              <p className="mt-1 text-lg font-bold">
                {chama?.name ?? "No chama onboarded yet"}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
              <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                Type
              </p>
              <p className="mt-1 text-lg font-bold">
                {chama ? formatChamaType(chama.type) : "-"}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50 sm:col-span-2">
              <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                Primary Admin Email
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                {user.email}
              </p>
            </div>
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
                "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
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
              href="/onboard-chama"
              className={cn(
                "flex w-full items-center justify-between rounded-lg p-3 text-center font-semibold transition-all",
                "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
              )}
            >
              <span>Onboard Another Chama</span>
              <TrendingUp className="size-4" />
            </Link>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Snapshot
            </p>
            <p className="mt-2 text-sm text-emerald-900/80 dark:text-emerald-200/85">
              {membersCount > 0
                ? `Your chama is active with ${membersCount} member${membersCount === 1 ? "" : "s"} and KES ${totalContributions.toLocaleString()} in total contributions.`
                : "No members are available for this account yet. Onboard a chama or use the test user to preview a populated dashboard."}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
