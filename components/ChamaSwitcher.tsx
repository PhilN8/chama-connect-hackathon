"use client";

import { useSession } from "@/lib/auth-client";
import { ChevronDown } from "lucide-react";

interface ChamaSwitcherProps {
  activeChama: string | null;
  onChamaSelect: (chamaId: string) => void;
}

interface SessionUser {
  memberships?: Record<string, string>;
}

export function ChamaSwitcher({ activeChama, onChamaSelect }: ChamaSwitcherProps) {
  const { data: session } = useSession();

  if (!session) return null;

  const user = session.user as SessionUser;
  const memberships = user?.memberships || {};
  const membershipEntries = Object.entries(memberships);

  if (membershipEntries.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-300 px-3 py-1.5 text-sm text-zinc-500 dark:border-zinc-700">
        No chamas yet
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={activeChama || ""}
        onChange={(e) => onChamaSelect(e.target.value)}
        className="appearance-none rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 pr-8 text-sm font-medium text-emerald-800 outline-none transition-colors hover:border-emerald-300 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:border-emerald-700 cursor-pointer"
      >
        <option value="" disabled>
          Select Chama
        </option>
        {membershipEntries.map(([chamaId, role]) => (
          <option key={chamaId} value={chamaId}>
            {chamaId} ({role})
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
    </div>
  );
}
