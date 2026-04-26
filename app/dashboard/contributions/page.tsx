import type { Metadata } from "next";
import { DashboardContributionsTable } from "@/components/dashboard/dashboard-contributions-table";
import { apiStore } from "@/lib/api-store";
import { getSessionFromCookiesStore } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Contributions | ChamaConnect Dashboard",
  description: "Track and filter chama contributions",
};

export default async function DashboardContributionsPage() {
  const session = await getSessionFromCookiesStore();
  if (!session) {
    return null;
  }

  const contributions = apiStore.getContributionsForUser(session.id);

  return <DashboardContributionsTable contributions={contributions} />;
}
