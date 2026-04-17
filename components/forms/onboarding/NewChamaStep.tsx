"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { OnboardingState, OnboardingAction } from "@/lib/onboarding-store";

interface NewChamaStepProps {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
}

export function NewChamaStep({ state, dispatch }: NewChamaStepProps) {
  const isValid = state.chamaName.trim().length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Create Your Chama</h2>
        <p className="text-zinc-500">
          Set up the basics for your new group
          {state.selectedSacco ? " (prefilled from linked SACCO)" : ""}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="chamaName">
            Chama Name <span className="text-red-500">*</span>
          </label>
          <input
            id="chamaName"
            type="text"
            value={state.chamaName}
            onChange={(e) =>
              dispatch({
                type: "SET_CHAMA_NAME",
                payload: e.target.value,
              })
            }
            placeholder="e.g., Nairobi Tech Workers SACCO"
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:border-zinc-900 dark:focus:border-zinc-50 transition-all"
            aria-invalid={
              !isValid && state.chamaName.length > 0 ? "true" : "false"
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="chamaType">
            Chama Type <span className="text-red-500">*</span>
          </label>
          <select
            id="chamaType"
            value={state.chamaType}
            onChange={(e) =>
              dispatch({
                type: "SET_CHAMA_TYPE",
                payload: e.target.value as any,
              })
            }
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:border-zinc-900 dark:focus:border-zinc-50 transition-all"
          >
            <option value="SACCO">SACCO (Savings & Credit)</option>
            <option value="TableBanking">Table Banking Group</option>
            <option value="MerryGoRound">Merry-Go-Round</option>
          </select>
          <p className="text-xs text-zinc-500">
            {state.chamaType === "SACCO"
              ? "Best for structured savings and loans"
              : state.chamaType === "TableBanking"
                ? "Great for regular meetings and contributions"
                : "Perfect for rotating savings distribution"}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="chamaDescription">
            Description <span className="text-zinc-500">(optional)</span>
          </label>
          <textarea
            id="chamaDescription"
            value={state.chamaDescription}
            onChange={(e) =>
              dispatch({
                type: "SET_CHAMA_DESCRIPTION",
                payload: e.target.value,
              })
            }
            placeholder="Tell us about your group..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:border-zinc-900 dark:focus:border-zinc-50 transition-all resize-none"
          />
        </div>
      </div>

      <p
        className={cn(
          "text-xs font-medium",
          isValid
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-600 dark:text-red-400",
        )}
        role="status"
        aria-live="polite"
      >
        {isValid
          ? "✓ Ready to add members"
          : "Chama name required (minimum 2 characters)"}
      </p>
    </motion.div>
  );
}
