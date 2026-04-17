import { jwtVerify, SignJWT } from 'jose';
import type { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'cc_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export interface SessionUser {
    userId: string;
    email: string;
    fullName: string;
}

interface SessionPayload {
    sub: string;
    email: string;
    fullName: string;
    iat?: number;
    exp?: number;
}

function getSessionSecret(): Uint8Array {
    const secret = process.env.AUTH_SECRET;

    if (!secret && process.env.NODE_ENV === 'production') {
        throw new Error('AUTH_SECRET is required in production');
    }

    return new TextEncoder().encode(secret ?? 'dev-only-demo-auth-secret-change-me');
}

export function getSessionCookieName(): string {
    return SESSION_COOKIE_NAME;
}

export async function createSessionToken(user: SessionUser): Promise<string> {
    return new SignJWT({ email: user.email, fullName: user.fullName })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(user.userId)
        .setIssuedAt()
        .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
        .sign(getSessionSecret());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
    try {
        const verified = await jwtVerify<SessionPayload>(token, getSessionSecret(), {
            algorithms: ['HS256'],
        });

        const userId = verified.payload.sub;
        const email = verified.payload.email;
        const fullName = verified.payload.fullName;

        if (!userId || !email || !fullName) {
            return null;
        }

        return {
            userId,
            email,
            fullName,
        };
    } catch {
        return null;
    }
}

export async function getSessionFromRequest(request: NextRequest): Promise<SessionUser | null> {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
        return null;
    }

    return verifySessionToken(token);
}

export function setSessionCookie(response: NextResponse, token: string): void {
    response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: SESSION_DURATION_SECONDS,
    });
}

export function clearSessionCookie(response: NextResponse): void {
    response.cookies.set(SESSION_COOKIE_NAME, '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
    });
}
