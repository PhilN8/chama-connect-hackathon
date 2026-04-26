"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChartNoAxesCombined,
  Home,
  PiggyBank,
  LogOut,
  Users,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";
import { ChamaSwitcher } from "@/components/ChamaSwitcher";
import { NotificationBell } from "@/components/notification-bell";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface DashboardShellProps {
  children: React.ReactNode;
  name: string;
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
    href: "/dashboard/onboard-chama",
    label: "Onboarding",
    icon: ChartNoAxesCombined,
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: UserCircle,
  },
];

function SidebarNav({
  onItemClick,
}: {
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
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
            onClick={onItemClick}
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
  );
}

function SidebarContent({
  onItemClick,
  onLogout,
  isLoggingOut,
}: {
  onItemClick?: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  return (
    <>
      <div className="mb-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            ChamaConnect
          </p>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        </div>
      </div>

      <SidebarNav onItemClick={onItemClick} />

      <div className="mt-auto flex flex-col gap-4 pt-4">
        <div className="flex-1" />
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center justify-between rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 dark:bg-red-950/20 dark:text-red-300"
        >
          <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
          <LogOut className="size-4" />
        </button>
      </div>
    </>
  );
}

export function DashboardShell({ children, name }: DashboardShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeChama, setActiveChama] = useState<string | null>(null);

  const handleChamaSelect = (chamaId: string) => {
    setActiveChama(chamaId);
    localStorage.setItem("activeChamaId", chamaId);
    router.refresh();
  };

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
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="flex h-screen w-full overflow-hidden">
        <aside className="hidden md:flex md:w-72 md:flex-col md:border-r md:border-zinc-200 md:bg-white/95 md:p-5 md:dark:border-zinc-800 md:dark:bg-zinc-950/95">
          <SidebarContent
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-200/70 bg-white/80 px-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70 md:px-6">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="rounded-md p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 md:hidden"
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-5">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex h-full flex-col">
                  <SidebarContent
                    onItemClick={() => setSidebarOpen(false)}
                    onLogout={handleLogout}
                    isLoggingOut={isLoggingOut}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex flex-1 items-center gap-4">
              <ChamaSwitcher
                activeChama={activeChama}
                onChamaSelect={handleChamaSelect}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  Hey, {name.split(" ")[0]}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Welcome back to your dashboard
                </p>
              </div>
            </div>
            <NotificationBell />
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}