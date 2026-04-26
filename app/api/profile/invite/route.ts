import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { invitations, chamaMemberships, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { v4 as uuid } from "uuid";

const inviteMemberSchema = z.object({
  chamaId: z.string().min(1, "Chama ID is required"),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  role: z.enum(["ADMIN", "TREASURER", "SECRETARY", "MEMBER"]).default("MEMBER"),
});

export async function POST(
  request: NextRequest
): Promise<NextResponse<{ success: boolean; message: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const parseResult = inviteMemberSchema.safeParse(await request.json());
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, message: issue?.message ?? "Invalid data" },
        { status: 400 }
      );
    }

    const { chamaId, email, role } = parseResult.data;

    const existingMembership = await db.query.chamaMemberships.findFirst({
      where: (memberships, { and, eq }) =>
        and(eq(memberships.chamaId, chamaId), eq(memberships.userId, session.user.id)),
    });

    if (!existingMembership || !["ADMIN", "TREASURER"].includes(existingMembership.role)) {
      return NextResponse.json(
        { success: false, message: "Only admins and treasurers can invite members" },
        { status: 403 }
      );
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      const existingMemberMembership = await db.query.chamaMemberships.findFirst({
        where: (memberships, { and, eq }) =>
          and(eq(memberships.chamaId, chamaId), eq(memberships.userId, existingUser.id)),
      });

      if (existingMemberMembership) {
        return NextResponse.json(
          { success: false, message: "User is already a member of this chama" },
          { status: 400 }
        );
      }

      await db.insert(chamaMemberships).values({
        id: uuid(),
        chamaId,
        userId: existingUser.id,
        role,
        status: "ACTIVE",
        joinedAt: new Date(),
        updatedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: `${email} has been added to the chama as ${role}`,
      });
    }

    const pendingInvitation = await db.query.invitations.findFirst({
      where: (invitations, { and, eq, gt }) =>
        and(
          eq(invitations.chamaId, chamaId),
          eq(invitations.email, email),
          gt(invitations.expiresAt, new Date())
        ),
    });

    if (pendingInvitation) {
      return NextResponse.json(
        { success: false, message: "An invitation has already been sent to this email" },
        { status: 400 }
      );
    }

    const invitationId = uuid();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await db.insert(invitations).values({
      id: invitationId,
      chamaId,
      inviterId: session.user.id,
      email,
      role,
      status: "PENDING",
      expiresAt,
      createdAt: new Date(),
    });

    const inviteLink = `${process.env.BETTER_AUTH_URL}/accept-invitation?token=${invitationId}`;
    console.log(`Invitation email for ${email}: ${inviteLink}`);

    return NextResponse.json({
      success: true,
      message: `Invitation sent to ${email}. They will receive instructions to join.`,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to send invitation";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}