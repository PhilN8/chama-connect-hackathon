import Link from "next/link";
import { OnboardingFlow } from "@/components/forms/OnboardingFlow";
import { getSessionFromCookiesStore } from "@/lib/auth-server";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default async function OnboardingPage() {
  const session = await getSessionFromCookiesStore();

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50 dark:from-emerald-950 dark:via-zinc-950 dark:to-cyan-950">
      <SiteHeader isAuthenticated={Boolean(session)} />

      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {!session && (
          <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
            <p className="font-semibold">You are onboarding as a guest.</p>
            <p className="mt-1">
              Want to save progress and access your dashboard?{" "}
              <Link href="/login" className="underline underline-offset-2">
                Sign in
              </Link>{" "}
              or{" "}
              <Link href="/" className="underline underline-offset-2">
                go back home
              </Link>
              .
            </p>
          </div>
        )}

        <OnboardingFlow />
      </div>

      <SiteFooter />
    </div>
  );
}
