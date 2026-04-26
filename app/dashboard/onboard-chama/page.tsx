"use client";

import { OnboardingFlow } from "@/components/forms/OnboardingFlow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function OnboardChamaPage() {
  return (
    <div className="w-full px-2 py-8 sm:px-4 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="rounded-xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50 p-6 dark:border-emerald-900/30 dark:from-emerald-950/20 dark:to-teal-950/20 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
              <svg
                className="size-6 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Onboard Your Chama
              </h1>
              <p className="mt-1 text-base text-emerald-700 dark:text-emerald-300">
                Create a new savings group and invite members to get started.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <Card className="border-emerald-200 dark:border-emerald-800/40">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Quick Start Guide</CardTitle>
          <CardDescription>
            Follow the steps to set up your chama in minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                1
              </div>
              <div>
                <p className="font-medium">Choose Action</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Create new or link existing
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                2
              </div>
              <div>
                <p className="font-medium">Chama Details</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Name, type & description
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                3
              </div>
              <div>
                <p className="font-medium">Add Members</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Invite team with roles
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                4
              </div>
              <div>
                <p className="font-medium">Confirm & Create</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Review and launch
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <OnboardingFlow />
      </div>
    </div>
  );
}