"use client";

import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster richColors position="top-right" closeButton />
    </QueryProvider>
  );
}