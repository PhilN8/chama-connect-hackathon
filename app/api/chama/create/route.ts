import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chamas, chamaMemberships, invitations, users } from "@/lib/db/schema";
import { createChamaRequestSchema } from "@/lib/validation";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export async function POST(
  request: NextRequest
): Promise<NextResponse<{ success: boolean; data?: { chamaId: string; chamaName: string; memberCount: number }; message: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const parseResult = createChamaRequestSchema.safeParse(await request.json());
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, message: issue?.message ?? "Invalid chama payload" },
        { status: 400 }
      );
    }

    const { chamaName, chamaType: _chamaType, members, description } = parseResult.data;
    const chamaId = uuid();
    const now = new Date();

    await db.insert(chamas).values({
      id: chamaId,
      name: chamaName,
      description: description ?? null,
      minContributionAmount: 0,
      createdAt: now,
      updatedAt: now,
    });

    await db.insert(chamaMemberships).values({
      id: uuid(),
      chamaId,
      userId: session.user.id,
      role: "ADMIN",
      status: "ACTIVE",
      joinedAt: now,
      updatedAt: now,
    });

    const invitedMembers: { email: string; role: "ADMIN" | "TREASURER" | "SECRETARY" | "MEMBER" }[] = [];
    if (members && members.length > 0) {
      for (const member of members) {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, member.email),
        });

        if (existingUser) {
          await db.insert(chamaMemberships).values({
            id: uuid(),
            chamaId,
            userId: existingUser.id,
            role: member.role,
            status: "ACTIVE",
            joinedAt: now,
            updatedAt: now,
          });
        } else {
          await db.insert(invitations).values({
            id: uuid(),
            chamaId,
            inviterId: session.user.id,
            email: member.email,
            role: member.role,
            status: "PENDING",
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
            createdAt: now,
          });
          invitedMembers.push(member);
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          chamaId,
          chamaName,
          memberCount: 1 + invitedMembers.length,
        },
        message: invitedMembers.length > 0
          ? `Chama created. ${invitedMembers.length} invitation(s) sent.`
          : "Chama created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create chama";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
