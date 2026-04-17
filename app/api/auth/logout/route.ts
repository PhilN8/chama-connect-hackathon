import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST(): Promise<NextResponse<{ success: boolean; message: string }>> {
    const response = NextResponse.json({
        success: true,
        message: 'Logged out successfully',
    });

    clearSessionCookie(response);
    return response;
}
