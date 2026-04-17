import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/lib/api-store';
import type { ApiResponse, RegisterResponse } from '@/lib/types';
import { registerRequestSchema } from '@/lib/validation';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<RegisterResponse>>> {
    try {
        const parseResult = registerRequestSchema.safeParse(await request.json());
        if (!parseResult.success) {
            const issue = parseResult.error.issues[0];
            return NextResponse.json(
                {
                    success: false,
                    message: issue?.message ?? 'Invalid registration payload',
                },
                { status: 400 }
            );
        }

        const { fullName, email, phone, password } = parseResult.data;

        // Check if email already registered
        if (apiStore.getUserByEmail(email)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email address is already registered',
                },
                { status: 409 }
            );
        }

        // In real app, hash password here with bcrypt
        // For now, store plaintext (demo only!)
        const user = apiStore.registerUser(fullName, email, phone, password);

        const response = NextResponse.json(
            {
                success: true,
                data: {
                    userId: user.id,
                    email: user.email,
                    fullName: user.fullName,
                },
                message: 'Registration successful',
            },
            { status: 201 }
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
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';

        return NextResponse.json(
            {
                success: false,
                message: errorMessage,
            },
            { status: 500 }
        );
    }
}
