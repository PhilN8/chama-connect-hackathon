"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingState, OnboardingAction } from "@/lib/onboarding-store";
import type { ChamaMemberRole } from "@/lib/types";

interface AddMembersStepProps {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
}

const ROLE_OPTIONS: { value: ChamaMemberRole; label: string }[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "TREASURER", label: "Treasurer" },
  { value: "SECRETARY", label: "Secretary" },
  { value: "MEMBER", label: "Member" },
];

export function AddMembersStep({ state, dispatch }: AddMembersStepProps) {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<ChamaMemberRole>("MEMBER");
  const [inputError, setInputError] = useState("");

  const hasAdmin = state.members.some((m) => m.role === "ADMIN");
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddMember = () => {
    setInputError("");

    if (!newMemberEmail.trim()) {
      setInputError("Email is required");
      return;
    }

    if (!isValidEmail(newMemberEmail)) {
      setInputError("Invalid email address");
      return;
    }

    if (state.members.some((m) => m.email === newMemberEmail)) {
      setInputError("This member is already added");
      return;
    }

    dispatch({
      type: "ADD_MEMBER",
      payload: { email: newMemberEmail, role: newMemberRole },
    });

    setNewMemberEmail("");
    setNewMemberRole("MEMBER");
  };

  const handleRemoveMember = (email: string) => {
    dispatch({ type: "REMOVE_MEMBER", payload: email });
  };

  const handleUpdateRole = (email: string, role: ChamaMemberRole) => {
    dispatch({ type: "UPDATE_MEMBER_ROLE", payload: { email, role } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
          <Users className="size-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Add Team Members</h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          Invite members to your chama. Each member needs a role for governance.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 sm:grid-cols-[1fr_auto_auto]">
          <label htmlFor="newMemberEmail">
            Member Email <span className="text-red-500">*</span>
          </label>
          <label htmlFor="newMemberRole" className="sm:justify-self-start">
            Role <span className="text-red-500">*</span>
          </label>
          <span className="sr-only">Add member action</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex flex-col gap-1.5">
            <input
              id="newMemberEmail"
              type="email"
              value={newMemberEmail}
              onChange={(e) => {
                setNewMemberEmail(e.target.value);
                setInputError("");
              }}
              placeholder="member@example.com"
              className={cn(
                "w-full px-4 py-2 rounded-lg border bg-zinc-50 dark:bg-zinc-800 outline-none focus:border-emerald-700 dark:focus:border-emerald-300 transition-all",
                inputError
                  ? "border-red-500"
                  : "border-zinc-200 dark:border-zinc-700",
              )}
              aria-invalid={inputError ? "true" : "false"}
              aria-describedby={inputError ? "member-error" : undefined}
            />
            {inputError && (
              <span
                id="member-error"
                className="text-xs text-red-600 dark:text-red-400"
                role="alert"
              >
                {inputError}
              </span>
            )}
          </div>
          <select
            id="newMemberRole"
            value={newMemberRole}
            onChange={(e) =>
              setNewMemberRole(e.target.value as ChamaMemberRole)
            }
            className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:border-emerald-700 dark:focus:border-emerald-300 transition-all"
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddMember}
            className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-md shadow-emerald-700/30"
          >
            <Plus className="size-4" /> Add
          </button>
        </div>

        <div className="space-y-2">
          {state.members.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-6 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No members added yet. Add at least one admin to continue.
              </p>
            </div>
          ) : (
            state.members.map((member) => (
              <div
                key={member.email}
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/50 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.email}</p>
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleUpdateRole(
                        member.email,
                        e.target.value as ChamaMemberRole,
                      )
                    }
                    className="mt-1.5 text-xs px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:border-emerald-700 dark:focus:border-emerald-300 transition-all"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => handleRemoveMember(member.email)}
                  className="ml-2 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-red-600 dark:text-red-400"
                  aria-label={`Remove ${member.email}`}
                >
                  <X className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div
        className={cn(
          "rounded-lg p-3 text-sm",
          hasAdmin
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300"
            : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300",
        )}
        role="status"
        aria-live="polite"
      >
        {hasAdmin
          ? `✓ ${state.members.length} member(s) added - Ready to continue`
          : "⚠ You need at least one admin to create a chama"}
      </div>
    </motion.div>
  );
}
