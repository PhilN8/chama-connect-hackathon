import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/LoginForm";
import { getSessionFromCookiesStore } from "@/lib/auth-server";

export default async function LoginPage() {
  const session = await getSessionFromCookiesStore();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-cyan-50 dark:from-emerald-950 dark:via-zinc-950 dark:to-cyan-950 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between text-sm font-medium">
          <Link
            href="/"
            className="text-emerald-800 dark:text-emerald-200 hover:underline"
          >
            ← Back to Home
          </Link>
          {/* <Link
            href="/register"
            className="text-emerald-700 dark:text-emerald-300 hover:underline"
          >
            Need an account? Register
          </Link> */}
        </div>
        <p className="rounded-lg border border-emerald-200 bg-white/80 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
          This login includes a prefilled test account for demo purposes.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
