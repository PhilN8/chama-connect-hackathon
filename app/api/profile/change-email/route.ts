import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";

const changeEmailSchema = z.object({
  newEmail: z.string().email("Invalid email address").trim().toLowerCase(),
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

    const parseResult = changeEmailSchema.safeParse(await request.json());
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, message: issue?.message ?? "Invalid data" },
        { status: 400 }
      );
    }

    const { newEmail } = parseResult.data;

    if (newEmail === session.user.email) {
      return NextResponse.json(
        { success: false, message: "New email must be different from current email" },
        { status: 400 }
      );
    }

    const result = await auth.api.sendVerificationEmail({
      headers: request.headers,
      body: { email: newEmail },
    });

    if (result.status) {
      return NextResponse.json(
        { success: false, message: "Failed to send verification email" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent. Please check your new email inbox.",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to change email";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}