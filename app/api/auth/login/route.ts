import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { apiStore } from '@/lib/api-store';
import type { ApiResponse, LoginResponse } from '@/lib/types';
import { loginRequestSchema } from '@/lib/validation';
import { createSessionToken, setSessionCookie } from '@/lib/auth';

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

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid email or password',
                },
                { status: 401 }
            );
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
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

        const sessionToken = await createSessionToken({
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
        });

        setSessionCookie(response, sessionToken);

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
