import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getSessionFromCookiesStore } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { chamas, chamaMemberships, contributions } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Dashboard | ChamaConnect",
  description: "Manage your chama",
};

export default async function DashboardPage() {
  const session = await getSessionFromCookiesStore();
  if (!session) {
    return null;
  }

  // Get primary chama for user
  const userChamas = await db
    .select({
      chama: chamas,
    })
    .from(chamaMemberships)
    .innerJoin(chamas, eq(chamas.id, chamaMemberships.chamaId))
    .where(
      and(
        eq(chamaMemberships.userId, session.id),
        eq(chamaMemberships.status, "ACTIVE"),
      ),
    )
    .limit(1);

  const primaryChama = userChamas[0]?.chama;

  let memberCount = 0;
  let totalContributions = 0;

  if (primaryChama) {
    // Get member count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(chamaMemberships)
      .where(eq(chamaMemberships.chamaId, primaryChama.id));

    memberCount = Number(count);

    // Get total contributions for the chama
    const [{ total }] = await db
      .select({ total: sql<number>`sum(${contributions.amount})` })
      .from(contributions)
      .where(eq(contributions.chamaId, primaryChama.id));

    totalContributions = Number(total || 0);
  }

  return (
    <DashboardContent
      user={{
        fullName: session.name ?? session.email,
        email: session.email,
      }}
      chama={
        primaryChama
          ? {
              name: primaryChama.name,
              type: "TableBanking", // Defaulting to TableBanking as per schema lack of 'type'
              memberCount,
              totalContributions,
            }
          : null
      }
    />
  );
}
