import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSessionCookieName, verifySessionToken } from '@/lib/auth';

const protectedRoutes = ['/dashboard'];
const guestOnlyRoutes = ['/login', '/register'];

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const token = request.cookies.get(getSessionCookieName())?.value;
    const session = token ? await verifySessionToken(token) : null;

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    if (isProtectedRoute && !session) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    const isGuestOnlyRoute = guestOnlyRoutes.some((route) => pathname.startsWith(route));
    if (isGuestOnlyRoute && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
