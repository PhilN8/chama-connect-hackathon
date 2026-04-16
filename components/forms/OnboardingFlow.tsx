"use client";

import { useState } from "react";
import { Search, Plus, Building2, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function OnboardingFlow() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; name: string; county: string }[]>([]);

  const handleSearch = (val: string) => {
    setQuery(val);
    // Simulate search logic
    if (val.length > 2 && "stima sacco".includes(val.toLowerCase())) {
      setResults([{ id: "1", name: "Stima SACCO", county: "Nairobi" }]);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Onboard your Chama</h1>
        <p className="text-zinc-500">Connect your group to the blockchain-powered future.</p>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="size-5 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-50 transition-colors" />
        </div>
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for an existing SACCO record..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none focus:border-zinc-900 dark:focus:border-zinc-50 transition-all text-lg shadow-sm"
        />
      </div>

      <AnimatePresence mode="wait">
        {query.length > 0 && results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-center space-y-4"
          >
            <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto">
              <Plus className="size-6 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">No record found for "{query}"</h3>
              <p className="text-zinc-500 text-sm">Don't worry! You can start fresh and create your digital Chama in seconds.</p>
            </div>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-bold hover:scale-105 transition-transform shadow-lg">
              Create "{query}" Chama <ArrowRight className="size-4" />
            </button>
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-2">Matches Found</p>
            {results.map((sacco) => (
              <div key={sacco.id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between hover:border-zinc-900 dark:hover:border-zinc-50 transition-colors cursor-pointer group shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Building2 className="size-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-bold">{sacco.name}</h4>
                    <div className="flex items-center gap-1 text-zinc-500 text-sm">
                      <MapPin className="size-3" /> {sacco.county}
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-full bg-zinc-50 dark:bg-zinc-800 group-hover:bg-zinc-900 dark:group-hover:bg-zinc-50 group-hover:text-zinc-50 dark:group-hover:text-zinc-900 transition-colors">
                  <ArrowRight className="size-5" />
                </button>
              </div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
