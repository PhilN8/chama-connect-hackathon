import { RegisterForm } from "@/components/forms/RegisterForm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionFromCookiesStore } from "@/lib/auth-server";

export default async function RegisterPage() {
  const session = await getSessionFromCookiesStore();
  if (session) {
    redirect("/dashboard");
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
        <RegisterForm />
      </div>
    </div>
  );
}
