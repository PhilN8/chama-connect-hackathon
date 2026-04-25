"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { LoginForm } from "@/components/forms/LoginForm";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function SignInContent() {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.session) {
      router.push("/dashboard");
    }
  }, [data?.session, router]);

  if (data?.session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-cyan-50 dark:from-emerald-950 dark:via-zinc-950 dark:to-cyan-950 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center text-sm font-medium">
          <Link
            href="/"
            className="text-emerald-800 dark:text-emerald-200 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
