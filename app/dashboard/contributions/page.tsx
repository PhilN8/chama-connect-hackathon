import type { Metadata } from "next";
import { DashboardContributionsTable } from "@/components/dashboard/dashboard-contributions-table";
import { getSessionFromCookiesStore } from "@/lib/auth-server";
import { db } from "@/lib/db";
import {
  contributions,
  chamas,
  users,
  chamaMemberships,
} from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Contributions | ChamaConnect Dashboard",
  description: "Track and filter chama contributions",
};

export default async function DashboardContributionsPage() {
  const session = await getSessionFromCookiesStore();
  if (!session) {
    return null;
  }

  const cookieStore = await cookies();
  const activeChamaId = cookieStore.get("activeChamaId")?.value;

  // Get user's active membership
  const [membership] = await db
    .select({
      role: chamaMemberships.role,
      chamaId: chamaMemberships.chamaId,
    })
    .from(chamaMemberships)
    .where(
      and(
        eq(chamaMemberships.userId, session.id),
        eq(chamaMemberships.status, "ACTIVE"),
        activeChamaId ? eq(chamaMemberships.chamaId, activeChamaId) : undefined,
      ),
    )
    .limit(1);

  if (!membership) {
    return <DashboardContributionsTable contributions={[]} />;
  }

  const isAdminOrTreasurer =
    membership.role === "ADMIN" || membership.role === "TREASURER";

  const sqlQuery = db
    .select({
      id: contributions.id,
      amount: contributions.amount,
      status: contributions.status,
      createdAt: contributions.createdAt,
      paymentMethod: contributions.paymentMethod,
      chamaName: chamas.name,
      memberName: users.name,
    })
    .from(contributions)
    .innerJoin(chamas, eq(chamas.id, contributions.chamaId))
    .innerJoin(users, eq(users.id, contributions.memberId))
    .orderBy(desc(contributions.createdAt));

  // Access control: Admins/Treasurers see all chama contributions, others see only theirs
  if (isAdminOrTreasurer) {
    sqlQuery.where(eq(contributions.chamaId, membership.chamaId));
  } else {
    sqlQuery.where(
      and(
        eq(contributions.chamaId, membership.chamaId),
        eq(contributions.memberId, session.id),
      ),
    );
  }

  const userContributions = await sqlQuery;

  return <DashboardContributionsTable contributions={userContributions} />;
}
