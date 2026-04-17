import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard-content";
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
  const memberCount = primaryChama?.members.length ?? 0;
  const totalContributions = (primaryChama?.members ?? []).reduce(
    (sum, member) => sum + (member.contributionKes ?? 0),
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
