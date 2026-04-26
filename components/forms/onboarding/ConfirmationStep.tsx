"use client";

import { motion } from "framer-motion";
import { Building2, Users, MapPin, CheckCircle } from "lucide-react";
import type { OnboardingState } from "@/lib/onboarding-store";

interface ConfirmationStepProps {
  state: OnboardingState;
}

export function ConfirmationStep({ state }: ConfirmationStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Review & Confirm</h2>
        <p className="text-zinc-500">Make sure everything looks correct</p>
      </div>

      <div className="space-y-4">
        {state.selectedSacco ? (
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/10">
            <div className="flex items-start gap-3">
              <CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-300">
                  Joining Existing SACCO
                </h3>
                <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                  <strong>{state.selectedSacco.name}</strong>
                </p>
                <div className="flex items-center gap-1 text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                  <MapPin className="size-3" />
                  {state.selectedSacco.location}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-start gap-3">
                <Building2 className="size-5 text-zinc-600 dark:text-zinc-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
                    Chama Name
                  </p>
                  <h3 className="font-semibold text-lg mt-1">
                    {state.chamaName}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
                Type
              </p>
              <p className="font-semibold mt-1">
                {state.chamaType === "SACCO"
                  ? "SACCO (Savings & Credit)"
                  : state.chamaType === "TableBanking"
                    ? "Table Banking Group"
                    : "Merry-Go-Round"}
              </p>
            </div>

            {state.chamaDescription && (
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
                  Description
                </p>
                <p className="text-sm mt-1">{state.chamaDescription}</p>
              </div>
            )}
          </div>
        )}

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-start gap-3">
            <Users className="size-5 text-zinc-600 dark:text-zinc-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
                Team Members ({state.members.length})
              </p>
              <div className="space-y-2 mt-2">
                {state.members.map((member) => (
                  <div
                    key={member.email}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{member.email}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.role === "ADMIN"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {member.role === "ADMIN" ? "Admin" : "Member"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-500 text-center">
        Click "Complete Onboarding" to finish setting up your chama
      </p>
    </motion.div>
  );
}
