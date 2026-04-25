import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import type { SessionUser } from '@/lib/auth';

export async function getSessionFromCookiesStore(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const headers = new Headers();
    cookieStore.getAll().forEach(({ name, value }) => {
        headers.append('cookie', `${name}=${value}`);
    });

    const session = await auth.api.getSession({
        headers,
    });

    return session?.user as SessionUser | null;
}
