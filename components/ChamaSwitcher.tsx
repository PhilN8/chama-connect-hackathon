"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ChamaSwitcher() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeChamaId, setActiveChamaId] = useState<string | null>(null);

  const switchChama = (id: string) => {
    setActiveChamaId(id);
    localStorage.setItem("activeChamaId", id);
    router.refresh();
  };

  if (!session) return null;

  const memberships = (session.user as any)?.memberships || {};

  return (
    <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/40">
      <select
        value={activeChamaId || ""}
        onChange={(e) => switchChama(e.target.value)}
        className="bg-transparent text-sm font-medium outline-none"
      >
        <option value="" disabled>
          Select Chama
        </option>
        {Object.entries(memberships).map(([chamaId, role]) => (
          <option key={chamaId} value={chamaId}>
            {chamaId} ({String(role)})
          </option>
        ))}
      </select>
    </div>
  );
}
