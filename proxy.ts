
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};