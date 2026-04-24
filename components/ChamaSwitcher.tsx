"use client";

import { useState, useEffect } from "react";
import { useSession } from "./auth-client";

export function ChamaSwitcher() {
  const { data: session } = useSession();
  const [activeChamaId, setActiveChamaId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("activeChamaId");
    if (saved) setActiveChamaId(saved);
  }, []);

  const switchChama = (id: string) => {
    setActiveChamaId(id);
    localStorage.setItem("activeChamaId", id);
    window.location.reload(); // Force refresh to update ABAC context
  };

  if (!session) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/40">
      <select 
        value={activeChamaId || ""} 
        onChange={(e) => switchChama(e.target.value)}
        className="bg-transparent text-sm font-medium outline-none"
      >
        <option value="" disabled>Select Chama</option>
        {/* In real app, we'd map over session.user.memberships here */}
        <option value="demo-chama">Demo Chama</option>
      </select>
    </div>
  );
}
