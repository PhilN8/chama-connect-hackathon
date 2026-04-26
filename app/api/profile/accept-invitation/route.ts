import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { invitations, chamaMemberships, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { v4 as uuid } from "uuid";

const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Invitation token is required"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

export async function POST(
  request: NextRequest
): Promise<NextResponse<{ success: boolean; message: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const parseResult = acceptInvitationSchema.safeParse(await request.json());
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, message: issue?.message ?? "Invalid data" },
        { status: 400 }
      );
    }

    const { token, password } = parseResult.data;

    const invitation = await db.query.invitations.findFirst({
      where: (invitations, { and, eq, gt }) =>
        and(
          eq(invitations.id, token),
          eq(invitations.status, "PENDING"),
          gt(invitations.expiresAt, new Date())
        ),
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired invitation" },
        { status: 400 }
      );
    }

    if (!invitation.email) {
      return NextResponse.json(
        { success: false, message: "Invitation has no associated email" },
        { status: 400 }
      );
    }

    let userId = session?.user.id;

    if (!userId) {
      if (!password) {
        return NextResponse.json(
          { success: false, message: "Password required to create account" },
          { status: 400 }
        );
      }

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, invitation.email),
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        userId = uuid();
        await db.insert(users).values({
          id: userId,
          name: invitation.email.split("@")[0],
          email: invitation.email,
          emailVerified: false,
          globalRole: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    const existingMembership = await db.query.chamaMemberships.findFirst({
      where: (memberships, { and, eq }) =>
        and(eq(memberships.chamaId, invitation.chamaId), eq(memberships.userId, userId)),
    });

    if (existingMembership) {
      return NextResponse.json(
        { success: false, message: "You are already a member of this chama" },
        { status: 400 }
      );
    }

    await db
      .update(invitations)
      .set({ status: "ACCEPTED" })
      .where(eq(invitations.id, token));

    await db.insert(chamaMemberships).values({
      id: uuid(),
      chamaId: invitation.chamaId,
      userId,
      role: invitation.role,
      status: "ACTIVE",
      joinedAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "You have successfully joined the chama!",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to accept invitation";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}