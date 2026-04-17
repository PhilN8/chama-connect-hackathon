import type { Metadata } from "next";
import { DashboardContributionsTable } from "@/components/dashboard/dashboard-contributions-table";
import { getSessionFromCookiesStore } from "@/lib/auth-server";
import { apiStore } from "@/lib/api-store";

export const metadata: Metadata = {
  title: "Contributions | ChamaConnect Dashboard",
  description: "Track and filter chama contributions",
};

export default async function DashboardContributionsPage() {
  const session = await getSessionFromCookiesStore();
  if (!session) {
    return null;
  }

  const contributions = apiStore.getContributionsForUser(session.userId);

  return <DashboardContributionsTable contributions={contributions} />;
}
