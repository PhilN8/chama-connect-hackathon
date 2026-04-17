"use client";

import { useState } from "react";
import { Search, Plus, ArrowRight, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { OnboardingState, OnboardingAction } from "@/lib/onboarding-store";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchStepProps {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  onNext: () => void;
}

interface SaccoSearchResult {
  id: string;
  name: string;
  location: string;
  memberCount: number;
}

export function SearchStep({ state, dispatch, onNext }: SearchStepProps) {
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<SaccoSearchResult>>(
    [],
  );

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
          result.data.results.map((sacco: SaccoSearchResult) => ({
            id: sacco.id,
            name: sacco.name,
            location: sacco.location,
            memberCount: sacco.memberCount,
          })),
        );
      }
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "Search failed. Please try again.",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectSacco = (sacco: SaccoSearchResult) => {
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

  const handleSelectExisting = (sacco: SaccoSearchResult) => {
    setSearchOpen(false);
    handleSelectSacco(sacco);
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
        <p className="text-emerald-900/70 dark:text-emerald-200/70">
          {state.action === null
            ? "Select a SACCO to prefill profile fields, or continue with manual entry"
            : "Setting up a new digital chama"}
        </p>
      </div>

      <Popover open={searchOpen} onOpenChange={setSearchOpen}>
        <PopoverTrigger
          disabled={state.action === "create"}
          className={cn(
            "w-full rounded-2xl border-2 border-emerald-100 bg-white/90 px-4 py-4 text-left shadow-sm transition-all dark:border-emerald-800/50 dark:bg-emerald-950/25",
            "flex items-center justify-between",
            "hover:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:outline-none",
            state.action === "create" && "cursor-not-allowed opacity-50",
          )}
        >
          <span className="flex items-center gap-3">
            {searchLoading ? (
              <Loader2 className="size-5 animate-spin text-emerald-500" />
            ) : (
              <Search className="size-5 text-emerald-500/70" />
            )}
            <span className="text-base text-emerald-900/80 dark:text-emerald-200/80">
              {state.searchQuery.length > 0
                ? state.searchQuery
                : "Search for an existing SACCO record..."}
            </span>
          </span>
          <ChevronDown className="size-4 text-emerald-700/70 dark:text-emerald-300/70" />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[min(44rem,90vw)] border border-emerald-200/80 p-1 dark:border-emerald-800/50"
        >
          <Command>
            <CommandInput
              value={state.searchQuery}
              onValueChange={handleSearch}
              placeholder="Type SACCO name or location..."
            />
            <CommandList className="max-h-64">
              {searchLoading && (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> Searching
                  SACCOs...
                </div>
              )}
              {!searchLoading && state.searchQuery.length < 2 && (
                <CommandEmpty>
                  Type at least 2 characters to search.
                </CommandEmpty>
              )}
              {!searchLoading && state.searchQuery.length >= 2 && (
                <CommandEmpty>
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="mx-auto inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-500 px-4 py-2 text-xs font-bold text-white"
                  >
                    Create "{state.searchQuery}" Chama
                    <ArrowRight className="size-3.5" />
                  </button>
                </CommandEmpty>
              )}
              <CommandGroup heading="SACCO Matches">
                {searchResults.map((sacco) => (
                  <CommandItem
                    key={sacco.id}
                    value={`${sacco.name} ${sacco.location}`}
                    onSelect={() => handleSelectExisting(sacco)}
                    className="py-2"
                  >
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-semibold">
                        {sacco.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {sacco.location} • {sacco.memberCount} members
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {state.action === null && state.searchQuery.length === 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleCreateNew}
          className="w-full p-6 rounded-xl border-2 border-dashed border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-600 transition-colors text-center space-y-2 group"
        >
          <div className="flex justify-center">
            <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
              <Plus className="size-5 text-emerald-700 dark:text-emerald-300 group-hover:text-white transition-colors" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Create New Chama</h4>
            <p className="text-sm text-emerald-900/70 dark:text-emerald-200/70">
              Start a fresh group with your own settings
            </p>
          </div>
        </motion.button>
      )}
    </div>
  );
}
