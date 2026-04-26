import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  phoneNumber: z
    .string()
    .regex(/^(?:254|\+254|0)?(7|1)\d{8}$/, "Invalid Kenyan phone number")
    .optional(),
});

export async function PUT(
  request: NextRequest
): Promise<NextResponse<{ success: boolean; message: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const parseResult = updateProfileSchema.safeParse(await request.json());
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, message: issue?.message ?? "Invalid data" },
        { status: 400 }
      );
    }

    const { name, phoneNumber } = parseResult.data;
    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (name !== undefined) {
      updates.name = name;
    }
    if (phoneNumber !== undefined) {
      updates.phoneNumber = phoneNumber;
    }

    await db
      .update(users)
      .set(updates)
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}