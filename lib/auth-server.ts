import { cookies } from 'next/headers';
import { getSessionCookieName, verifySessionToken } from '@/lib/auth';
import type { SessionUser } from '@/lib/auth';

export async function getSessionFromCookiesStore(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(getSessionCookieName())?.value;

    if (!token) {
        return null;
    }

    return verifySessionToken(token);
}
