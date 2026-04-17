"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Building2,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { OnboardingState, OnboardingAction } from "@/lib/onboarding-store";

interface SearchStepProps {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  onNext: () => void;
}

export function SearchStep({ state, dispatch, onNext }: SearchStepProps) {
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; name: string; location: string; memberCount: number }>
  >([]);

  const handleSearch = async (query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `/api/chama/search?q=${encodeURIComponent(query)}`,
      );
      const result = await response.json();

      if (result.success) {
        setSearchResults(
          result.data.results.map((sacco: any) => ({
            id: sacco.id,
            name: sacco.name,
            location: sacco.location,
            memberCount: sacco.memberCount,
          })),
        );
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Search failed. Please try again.",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectSacco = (sacco: any) => {
    dispatch({
      type: "SET_SELECTED_SACCO",
      payload: { id: sacco.id, name: sacco.name, location: sacco.location },
    });
    dispatch({ type: "SET_CHAMA_NAME", payload: sacco.name });
    dispatch({ type: "SET_CHAMA_TYPE", payload: "SACCO" });
    dispatch({
      type: "SET_CHAMA_DESCRIPTION",
      payload: `Linked SACCO record: ${sacco.name} (${sacco.location})`,
    });
    dispatch({ type: "SET_ACTION", payload: "create" });
    onNext();
  };

  const handleCreateNew = () => {
    dispatch({ type: "SET_ACTION", payload: "create" });
    onNext();
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {state.action === null
            ? "Link a SACCO (Optional)"
            : "Create New Chama"}
        </h2>
        <p className="text-zinc-500">
          {state.action === null
            ? "Select a SACCO to prefill profile fields, or continue with manual entry"
            : "Setting up a new digital chama"}
        </p>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          {searchLoading ? (
            <Loader2 className="size-5 text-zinc-400 animate-spin" />
          ) : (
            <Search className="size-5 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-50 transition-colors" />
          )}
        </div>
        <input
          disabled={state.action === "create"}
          value={state.searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for an existing SACCO record..."
          className={cn(
            "w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none focus:border-zinc-900 dark:focus:border-zinc-50 transition-all text-lg shadow-sm",
            state.action === "create" && "opacity-50 cursor-not-allowed",
          )}
        />
      </div>

      <AnimatePresence mode="wait">
        {state.searchQuery.length > 0 &&
        searchResults.length === 0 &&
        state.action !== "create" ? (
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
              <h3 className="font-semibold text-lg">
                No record found for "{state.searchQuery}"
              </h3>
              <p className="text-zinc-500 text-sm">
                Don't worry! You can start fresh and create your digital Chama
                in seconds.
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Create "{state.searchQuery}" Chama{" "}
              <ArrowRight className="size-4" />
            </button>
          </motion.div>
        ) : searchResults.length > 0 && state.action !== "create" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-2">
              Matches Found ({searchResults.length})
            </p>
            {searchResults.map((sacco) => (
              <button
                key={sacco.id}
                onClick={() => handleSelectSacco(sacco)}
                className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between hover:border-zinc-900 dark:hover:border-zinc-50 transition-colors group shadow-sm text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Building2 className="size-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-bold">{sacco.name}</h4>
                    <div className="flex items-center gap-1 text-zinc-500 text-sm">
                      <MapPin className="size-3" /> {sacco.location} •{" "}
                      {sacco.memberCount} members
                    </div>
                  </div>
                </div>
                <ArrowRight className="size-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-colors" />
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {state.action === null && state.searchQuery.length === 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleCreateNew}
          className="w-full p-6 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-50 transition-colors text-center space-y-2 group"
        >
          <div className="flex justify-center">
            <div className="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-zinc-50 transition-colors">
              <Plus className="size-5 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-50 dark:group-hover:text-zinc-900 transition-colors" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Create New Chama</h4>
            <p className="text-sm text-zinc-500">
              Start a fresh group with your own settings
            </p>
          </div>
        </motion.button>
      )}
    </div>
  );
}
