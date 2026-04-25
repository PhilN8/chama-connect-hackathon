import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getSessionFromCookiesStore } from "@/lib/auth-server";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSessionFromCookiesStore();

  if (!session) {
    redirect("/sign-in?next=/dashboard");
  }

  return (
    <DashboardShell name={session.name ?? session.email} email={session.email}>
      {children}
    </DashboardShell>
  );
}
