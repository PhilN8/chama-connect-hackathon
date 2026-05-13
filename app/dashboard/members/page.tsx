import type { Metadata } from "next";
import { DashboardMembersTable } from "@/components/dashboard/dashboard-members-table";
import { getSessionFromCookiesStore } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { chamas, chamaMemberships, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Members | ChamaConnect Dashboard",
  description: "Manage your chama members",
};

export default async function DashboardMembersPage() {
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

  if (!primaryChama) {
    return <DashboardMembersTable members={[]} chamaName="No Chama Found" />;
  }

  // Get all members of this chama
  const allMembersRows = await db
    .select({
      user: users,
      membership: chamaMemberships,
    })
    .from(chamaMemberships)
    .innerJoin(users, eq(users.id, chamaMemberships.userId))
    .where(eq(chamaMemberships.chamaId, primaryChama.id));

  const members = allMembersRows.map((row) => ({
    userId: row.user.id,
    name: row.user.name,
    email: row.user.email,
    role: row.membership.role,
    joinedAt: row.membership.joinedAt,
    status: row.membership.status,
  }));

  return (
    <DashboardMembersTable members={members} chamaName={primaryChama.name} />
  );
}
