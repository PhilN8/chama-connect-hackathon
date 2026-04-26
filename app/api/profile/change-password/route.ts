import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
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

    const parseResult = changePasswordSchema.safeParse(await request.json());
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, message: issue?.message ?? "Invalid data" },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parseResult.data;

    const result = await auth.api.changePassword({
      headers: request.headers,
      body: {
        currentPassword,
        newPassword,
      },
    });

    if (!result.user) {
      return NextResponse.json(
        { success: false, message: "Failed to change password" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to change password";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}