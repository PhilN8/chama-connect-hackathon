import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getSessionFromCookiesStore } from "@/lib/auth-server";
import { apiStore } from "@/lib/api-store";

export const metadata: Metadata = {
  title: "Dashboard | ChamaConnect",
  description: "Manage your chama",
};

export default async function DashboardPage() {
  const session = await getSessionFromCookiesStore();
  if (!session) {
    return null;
  }

  const chamas = apiStore.getChamasForUser(session.userId);
  const primaryChama = chamas[0];
  const contributions = apiStore.getContributionsForUser(session.userId);
  const memberCount = primaryChama?.members.length ?? 0;
  const totalContributions = contributions.reduce(
    (sum, contribution) => sum + contribution.amountKes,
    0,
  );

  return (
    <DashboardContent
      user={{
        fullName: session.fullName,
        email: session.email,
      }}
      chama={
        primaryChama
          ? {
              name: primaryChama.name,
              type: primaryChama.type,
              memberCount,
              totalContributions,
            }
          : null
      }
    />
  );
}
