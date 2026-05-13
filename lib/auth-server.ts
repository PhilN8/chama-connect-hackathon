import { cookies, headers } from 'next/headers';
import { auth } from '@/lib/auth';
import type { SessionUser } from '@/lib/auth';
import { cache } from 'react';

export const getSessionFromCookiesStore = cache(async (): Promise<SessionUser | null> => {
    const session = await auth.api.getSession({ headers: await headers() });

    return session?.user as SessionUser | null;
})
