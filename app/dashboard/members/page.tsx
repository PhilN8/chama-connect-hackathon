import type { Metadata } from "next";
import { DashboardMembersTable } from "@/components/dashboard-members-table";
import { getSessionFromCookiesStore } from "@/lib/auth-server";
import { apiStore } from "@/lib/api-store";

export const metadata: Metadata = {
  title: "Members | ChamaConnect Dashboard",
  description: "Manage your chama members",
};

export default async function DashboardMembersPage() {
  const session = await getSessionFromCookiesStore();
  if (!session) {
    return null;
  }

  const chamas = apiStore.getChamasForUser(session.userId);
  const primaryChama = chamas[0];

  return (
    <DashboardMembersTable
      members={primaryChama?.members ?? []}
      chamaName={primaryChama?.name}
    />
  );
}
