"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  isAuthenticated?: boolean;
}

export function SiteHeader({ isAuthenticated = false }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/contact", label: "Contact" },
    { href: "/onboard-chama", label: "Onboard Chama" },
    isAuthenticated
      ? { href: "/dashboard", label: "Dashboard" }
      : { href: "/login", label: "Login" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-100/70 bg-white/70 backdrop-blur-sm dark:border-emerald-900/40 dark:bg-black/40">
      <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            ChamaConnect
          </Link>

          <nav className="hidden items-center gap-3 md:flex">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100"
              >
                {link.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <Link
                href="/register"
                className="rounded-lg bg-linear-to-r from-emerald-600 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-600/30 transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
            )}
          </nav>

          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-md p-2 text-emerald-900 hover:bg-emerald-100 dark:text-emerald-200 dark:hover:bg-emerald-900/40 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <div
          className={cn(
            "grid transition-all md:hidden",
            menuOpen ? "grid-rows-[1fr] pt-4" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <nav className="flex flex-col gap-2 pb-1">
              {navigationLinks.map((link) => (
                <Link
                  key={`mobile-${link.href}`}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 dark:text-emerald-200 dark:hover:bg-emerald-900/40"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-linear-to-r from-emerald-600 to-teal-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
