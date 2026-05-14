import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chamas, chamaMemberships } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
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

        const memberships = await db
            .select({
                chamaId: chamas.id,
                chamaName: chamas.name,
                role: chamaMemberships.role,
            })
            .from(chamaMemberships)
            .innerJoin(chamas, eq(chamas.id, chamaMemberships.chamaId))
            .where(
                and(
                    eq(chamaMemberships.userId, session.user.id),
                    eq(chamaMemberships.status, "ACTIVE")
                )
            );

        return NextResponse.json({
            success: true,
            data: memberships,
        });
    } catch (error) {
        console.error("Failed to fetch memberships:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
