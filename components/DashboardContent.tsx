"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Users,
  TrendingUp,
  ArrowRight,
  Home,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface UserData {
  fullName: string;
  email: string;
  chamaName: string;
  chamaType: string;
  memberCount: number;
}

export function DashboardContent() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userFullName = localStorage.getItem("userFullName");
    const userEmail = localStorage.getItem("userEmail");
    const chamaName = localStorage.getItem("chamaName");
    const chamaType = localStorage.getItem("chamaType") || "SACCO";
    const memberCount = parseInt(localStorage.getItem("memberCount") || "1");

    if (!userId || !userFullName || !userEmail) {
      router.push("/register");
      return;
    }

    setUserData({
      fullName: userFullName,
      email: userEmail,
      chamaName: chamaName || "Your Chama",
      chamaType: chamaType,
      memberCount: memberCount,
    });

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin">
            <div className="size-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-50 rounded-full" />
          </div>
          <p className="text-zinc-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Success Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl p-6 sm:p-8 text-center space-y-3">
          <div className="flex justify-center">
            <CheckCircle className="size-16 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome to ChamaConnect, {userData.fullName}!
          </h1>
          <p className="text-lg text-emerald-700 dark:text-emerald-300">
            Your chama is now live and ready to manage your group's finances.
          </p>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Chama Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6"
        >
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <h2 className="text-2xl font-bold mb-4">Your Chama</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 uppercase font-medium">
                  Group Name
                </p>
                <p className="text-xl font-bold mt-1">{userData.chamaName}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 uppercase font-medium">
                  Type
                </p>
                <p className="text-xl font-bold mt-1">
                  {userData.chamaType === "SACCO"
                    ? "SACCO (Savings & Credit)"
                    : userData.chamaType === "TableBanking"
                      ? "Table Banking"
                      : "Merry-Go-Round"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="size-5" /> Members
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {userData.email}
                </p>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  Admin
                </span>
              </div>
              <p className="text-sm text-zinc-500 pt-2">
                Total: {userData.memberCount} member
                {userData.memberCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="size-5" /> Next Steps
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  ✓
                </span>
                <span>Account created and verified</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  ✓
                </span>
                <span>Chama group set up</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  →
                </span>
                <span>Invite more members using email links</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  →
                </span>
                <span>Set up contribution schedules and savings goals</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <h3 className="text-lg font-bold">Quick Actions</h3>

            <button
              className={cn(
                "w-full p-3 rounded-lg font-semibold transition-all flex items-center justify-between",
                "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:opacity-90",
              )}
            >
              <span>Manage Members</span>
              <Users className="size-4" />
            </button>

            <button
              className={cn(
                "w-full p-3 rounded-lg font-semibold transition-all flex items-center justify-between",
                "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700",
              )}
            >
              <span>Group Settings</span>
              <Settings className="size-4" />
            </button>

            <Link
              href="/"
              className={cn(
                "w-full p-3 rounded-lg font-semibold transition-all flex items-center justify-between",
                "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-center",
              )}
            >
              <span>Back to Home</span>
              <Home className="size-4" />
            </Link>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 uppercase">
              Coming Soon
            </p>
            <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Real-time financial dashboards</li>
              <li>• Loan management system</li>
              <li>• Automated contributions</li>
              <li>• Blockchain verification</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6">Platform Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Secure & Transparent",
              description: "Blockchain-powered transaction records",
            },
            {
              title: "Easy Contributions",
              description: "Flexible payment schedules and methods",
            },
            {
              title: "Smart Loans",
              description: "Quick approval & transparent terms",
            },
            {
              title: "Real-time Reports",
              description: "Instant financial insights & analytics",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-2"
            >
              <h4 className="font-semibold">{feature.title}</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
