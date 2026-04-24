"use server";

import { db } from "../db";
import { invitations } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { chamaMemberships } from "../db/schema";
import { eq, and, lt } from "drizzle-orm";

export async function createInvitation(data: {
  chamaId: string;
  inviterId: string;
  email?: string;
  phoneNumber?: string;
  role: "ADMIN" | "TREASURER" | "SECRETARY" | "MEMBER";
}) {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  const invitation = await db.insert(invitations).values({
    id: uuidv4(),
    chamaId: data.chamaId,
    inviterId: data.inviterId,
    email: data.email,
    phoneNumber: data.phoneNumber,
    role: data.role,
    status: "PENDING",
    expiresAt,
    createdAt: new Date(),
  }).returning();

  return invitation[0];
}

export async function acceptInvitation(invitationId: string, userId: string) {
  const invitation = await db.query.invitations.findFirst({
    where: and(
      eq(invitations.id, invitationId),
      eq(invitations.status, "PENDING")
    ),
  });

  if (!invitation) throw new Error("Invitation not found or not pending");
  if (new Date() > invitation.expiresAt) {
    await db.update(invitations).set({ status: "EXPIRED" }).where(eq(invitations.id, invitationId));
    throw new Error("Invitation expired");
  }

  await db.transaction(async (tx) => {
    await tx.update(invitations).set({ status: "ACCEPTED" }).where(eq(invitations.id, invitationId));
    await tx.insert(chamaMemberships).values({
      id: uuidv4(),
      chamaId: invitation.chamaId,
      userId: userId,
      role: invitation.role,
      status: "ACTIVE",
      joinedAt: new Date(),
      updatedAt: new Date(),
    });
  });

  return { success: true };
}

export async function cleanupExpiredInvitations() {
  await db.update(invitations)
    .set({ status: "EXPIRED" })
    .where(
      and(
        eq(invitations.status, "PENDING"),
        lt(invitations.expiresAt, new Date())
      )
    );
}

export async function deactivateMember(chamaId: string, userId: string) {
  await db.update(chamaMemberships)
    .set({ status: "DEACTIVATED", updatedAt: new Date() })
    .where(
      and(
        eq(chamaMemberships.chamaId, chamaId),
        eq(chamaMemberships.userId, userId)
      )
    );
}
