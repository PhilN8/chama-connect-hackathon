"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { ChevronDown, Loader2 } from "lucide-react";

interface ChamaSwitcherProps {
  activeChama: string | null;
  onChamaSelect: (chamaId: string) => void;
}

interface Membership {
  chamaId: string;
  chamaName: string;
  role: string;
}

export function ChamaSwitcher({
  activeChama,
  onChamaSelect,
}: ChamaSwitcherProps) {
  const { data: session } = useSession();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    const fetchMemberships = async () => {
      try {
        const response = await fetch("/api/chama/memberships");
        const json = await response.json();
        if (json.success) {
          setMemberships(json.data);
          // Set active chama to first one if none set
          if (!activeChama && json.data.length > 0) {
            onChamaSelect(json.data[0].chamaId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch chama memberships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, [session, activeChama, onChamaSelect]);

  if (!session) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5">
        <Loader2 className="size-4 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (memberships.length === 0) {
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
        className="cursor-pointer appearance-none rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 pr-8 text-sm font-medium text-emerald-800 outline-none transition-colors hover:border-emerald-300 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:border-emerald-700"
      >
        <option value="" disabled>
          Select Chama
        </option>
        {memberships.map((m) => (
          <option key={m.chamaId} value={m.chamaId}>
            {m.chamaName} ({m.role})
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
    </div>
  );
}
