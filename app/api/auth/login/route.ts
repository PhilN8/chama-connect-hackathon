import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/lib/api-store';
import type { ApiResponse, LoginResponse } from '@/lib/types';
import { loginRequestSchema } from '@/lib/validation';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<LoginResponse>>> {
    try {
        const parseResult = loginRequestSchema.safeParse(await request.json());
        if (!parseResult.success) {
            const issue = parseResult.error.issues[0];
            return NextResponse.json(
                {
                    success: false,
                    message: issue?.message ?? 'Invalid login payload',
                },
                { status: 400 }
            );
        }

        const { email, password } = parseResult.data;
        const user = apiStore.getUserByEmail(email);

        if (!user || user.password !== password) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid email or password',
                },
                { status: 401 }
            );
        }

        const response = NextResponse.json(
            {
                success: true,
                data: {
                    userId: user.id,
                    email: user.email,
                    fullName: user.fullName,
                },
                message: 'Login successful',
            },
            { status: 200 }
        );

        response.cookies.set('cc_user_id', user.id, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';

        return NextResponse.json(
            {
                success: false,
                message: errorMessage,
            },
            { status: 500 }
        );
    }
}
