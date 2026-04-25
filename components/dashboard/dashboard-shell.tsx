"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChartNoAxesCombined,
  Home,
  PiggyBank,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";

interface DashboardShellProps {
  children: React.ReactNode;
  name: string;
  email: string;
}

const navigationItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: Home,
  },
  {
    href: "/dashboard/members",
    label: "Members",
    icon: Users,
  },
  {
    href: "/dashboard/contributions",
    label: "Contributions",
    icon: PiggyBank,
  },
  {
    href: "/onboard-chama",
    label: "Onboarding",
    icon: ChartNoAxesCombined,
  },
];

export function DashboardShell({
  children,
  name,
  email,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/sign-in");
    } catch {
      toast.error("Could not sign out", {
        description: "Please try again.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50 dark:from-emerald-950 dark:via-zinc-950 dark:to-cyan-950">
      <div className="flex h-screen w-full overflow-hidden">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 border-r border-zinc-200 bg-white/95 p-5 backdrop-blur-sm transition-transform dark:border-zinc-800 dark:bg-zinc-950/95 md:sticky md:top-0 md:h-screen md:shrink-0 md:translate-x-0 md:overflow-y-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                ChamaConnect
              </p>
              <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              className="rounded-md p-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navigationItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <p className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-200">
              Signed in as
            </p>
            <p className="mt-2 text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">
              {email}
            </p>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center justify-between rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 dark:bg-red-950/20 dark:text-red-300"
            >
              <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
              <LogOut className="size-4" />
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden md:pl-0">
          <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70">
            <div className="flex h-16 items-center gap-3 px-4 md:px-6">
              <button
                type="button"
                aria-label="Open menu"
                className="rounded-md p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="size-5" />
              </button>
              <div>
                <p className="text-sm font-semibold">
                  Hey, {name.split(" ")[0]}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Welcome back to your dashboard
                </p>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
