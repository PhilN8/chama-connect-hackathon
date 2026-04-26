"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  initialOnboardingState,
  onboardingReducer,
} from "@/lib/onboarding-store";
import { SearchStep } from "./onboarding/SearchStep";
import { NewChamaStep } from "./onboarding/NewChamaStep";
import { AddMembersStep } from "./onboarding/AddMembersStep";
import { ConfirmationStep } from "./onboarding/ConfirmationStep";

const createChamaApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      chamaId: z.string(),
      chamaName: z.string(),
      memberCount: z.number(),
    })
    .optional(),
});

export function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(
    onboardingReducer,
    initialOnboardingState,
  );

  useEffect(() => {
    const inviteId = searchParams.get("inviteId");
    if (inviteId) {
      dispatch({ type: "SET_INVITATION_ID", payload: inviteId });
      dispatch({ type: "SET_ACTION", payload: "create" });
      dispatch({ type: "SET_STEP", payload: 2 });
    }
  }, [searchParams]);

  const handleNext = () => {
    if (state.step < 4) {
      dispatch({
        type: "SET_STEP",
        payload: (state.step + 1) as 1 | 2 | 3 | 4,
      });
    }
  };

  const handleBack = () => {
    if (state.step === 1) {
      // Reset to initial search state
      if (state.action !== null) {
        dispatch({ type: "SET_ACTION", payload: null });
      }
    } else if (state.step > 1) {
      dispatch({
        type: "SET_STEP",
        payload: (state.step - 1) as 1 | 2 | 3 | 4,
      });
    }
  };

  const handleSubmit = async () => {
    dispatch({ type: "SET_SUBMITTING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const payload = {
        chamaName: state.chamaName,
        chamaType: state.chamaType,
        description: state.chamaDescription,
        members: state.members,
      };

      const response = await fetch("/api/chama/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const rawResult = await response.json();
      const parsedResult = createChamaApiResponseSchema.safeParse(rawResult);
      if (!parsedResult.success) {
        toast.error("Unexpected server response", {
          description: "Please try again in a moment.",
        });
        dispatch({
          type: "SET_ERROR",
          payload: "Received an unexpected response from server.",
        });
        return;
      }

      const result = parsedResult.data;

      if (!response.ok || !result.success || !result.data) {
        toast.error(result.message || "Failed to create chama");
        dispatch({
          type: "SET_ERROR",
          payload: result.message || "Failed to create chama",
        });
        return;
      }

      localStorage.setItem("chamaId", result.data.chamaId);
      localStorage.setItem("chamaName", result.data.chamaName);
      localStorage.setItem("memberCount", result.data.memberCount.toString());
      localStorage.setItem("chamaType", state.chamaType);

      toast.success("Chama created successfully", {
        description: `${result.data.chamaName} is ready on your dashboard.`,
      });

      router.push(`/dashboard?chamaId=${result.data.chamaId}`);
    } catch {
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
      dispatch({
        type: "SET_ERROR",
        payload: "Network error. Please try again.",
      });
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  const canGoBack = state.step > 1 || state.action !== null;
  const canGoNext =
    (state.step === 1 && state.action !== null) ||
    (state.step === 2 && state.chamaName.trim().length >= 2) ||
    (state.step === 3 && state.members.length > 0);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Onboard Your Chama
          </h1>
          <div className="text-sm font-medium text-emerald-800/70 dark:text-emerald-200/70">
            Step {state.step} of 4
          </div>
        </div>
        <div className="w-full bg-emerald-200/70 dark:bg-emerald-900/40 rounded-full h-2">
          <motion.div
            initial={{ width: "25%" }}
            animate={{ width: `${(state.step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-linear-to-r from-emerald-600 to-teal-500 rounded-full"
          />
        </div>
      </div>

      {/* Error message */}
      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30"
        >
          <p className="text-sm text-red-700 dark:text-red-300">
            {state.error}
          </p>
        </motion.div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        <div
          key={state.step}
          className="bg-white/95 dark:bg-emerald-950/25 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-800/40 p-6 sm:p-8 backdrop-blur-sm"
        >
          {state.step === 1 && (
            <SearchStep state={state} dispatch={dispatch} onNext={handleNext} />
          )}
          {state.step === 2 && state.action === "create" && (
            <NewChamaStep state={state} dispatch={dispatch} />
          )}
          {state.step === 3 && (
            <AddMembersStep state={state} dispatch={dispatch} />
          )}
          {state.step === 4 && <ConfirmationStep state={state} />}
        </div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={handleBack}
          disabled={!canGoBack || state.isSubmitting}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all",
            canGoBack && !state.isSubmitting
              ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 hover:opacity-90"
              : "opacity-50 cursor-not-allowed bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100",
          )}
        >
          <ChevronLeft className="size-4" /> Back
        </button>

        <button
          onClick={state.step === 4 ? handleSubmit : handleNext}
          disabled={!canGoNext || state.isSubmitting}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all",
            canGoNext && !state.isSubmitting
              ? "bg-linear-to-r from-emerald-600 to-teal-500 text-white hover:opacity-90 shadow-md shadow-emerald-700/30"
              : "opacity-50 cursor-not-allowed bg-linear-to-r from-emerald-600 to-teal-500 text-white",
          )}
          aria-busy={state.isSubmitting}
        >
          {state.isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {state.step === 4
            ? state.isSubmitting
              ? "Completing..."
              : "Complete Onboarding"
            : state.isSubmitting
              ? "Loading..."
              : "Next"}
        </button>
      </div>

      {/* Help text */}
      {state.selectedSacco && state.step === 2 && (
        <p className="mt-4 text-xs text-emerald-800/70 dark:text-emerald-200/70 text-center">
          Linked SACCO: {state.selectedSacco.name}. You can edit all profile
          fields before continuing.
        </p>
      )}
    </div>
  );
}
