"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingState, OnboardingAction } from "@/lib/onboarding-store";

interface AddMembersStepProps {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
}

export function AddMembersStep({ state, dispatch }: AddMembersStepProps) {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"admin" | "member">(
    "member",
  );
  const [inputError, setInputError] = useState("");

  const hasAdmin = state.members.some((m) => m.role === "admin");
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
    setNewMemberRole("member");
  };

  const handleRemoveMember = (email: string) => {
    dispatch({ type: "REMOVE_MEMBER", payload: email });
  };

  const handleUpdateRole = (email: string, role: "admin" | "member") => {
    dispatch({ type: "UPDATE_MEMBER_ROLE", payload: { email, role } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Add Team Members</h2>
        <p className="text-zinc-500">
          Invite members to your chama (minimum 1 admin required)
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex flex-col gap-1.5">
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => {
                setNewMemberEmail(e.target.value);
                setInputError("");
              }}
              placeholder="member@example.com"
              className={cn(
                "w-full px-4 py-2 rounded-lg border bg-zinc-50 dark:bg-zinc-800 outline-none focus:border-zinc-900 dark:focus:border-zinc-50 transition-all",
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
            value={newMemberRole}
            onChange={(e) =>
              setNewMemberRole(e.target.value as "admin" | "member")
            }
            className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:border-zinc-900 dark:focus:border-zinc-50 transition-all"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleAddMember}
            className="px-6 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="size-4" /> Add
          </button>
        </div>

        <div className="space-y-2">
          {state.members.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-4">
              No members added yet. Add at least one admin.
            </p>
          ) : (
            state.members.map((member) => (
              <div
                key={member.email}
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.email}</p>
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleUpdateRole(
                        member.email,
                        e.target.value as "admin" | "member",
                      )
                    }
                    className="mt-1 text-xs px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:border-zinc-900 dark:focus:border-zinc-50 transition-all"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
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

      <p
        className={cn(
          "text-xs font-medium",
          hasAdmin
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-amber-600 dark:text-amber-400",
        )}
        role="status"
        aria-live="polite"
      >
        {hasAdmin
          ? `✓ ${state.members.length} member(s) added - Ready to continue`
          : "⚠ You need at least one admin"}
      </p>
    </motion.div>
  );
}
