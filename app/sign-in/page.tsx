import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSessionFromCookiesStore } from "@/lib/auth-server";
import { SignInForm } from "@/components/forms/LoginForm";

export default async function SignInPage() {
  const session = await getSessionFromCookiesStore();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-cyan-50 dark:from-emerald-950 dark:via-zinc-950 dark:to-cyan-950 p-4">
      <div className="w-full max-w-md space-y-4">
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
