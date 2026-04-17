import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/lib/api-store';
import type { ApiResponse, RegisterResponse } from '@/lib/types';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<RegisterResponse>>> {
    try {
        const body = await request.json();
        const { fullName, email, phone, password } = body;

        // Validation
        if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Full name is required and must be at least 2 characters',
                },
                { status: 400 }
            );
        }

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Valid email address is required',
                },
                { status: 400 }
            );
        }

        if (!phone || typeof phone !== 'string') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Phone number is required',
                },
                { status: 400 }
            );
        }

        if (!password || typeof password !== 'string' || password.length < 8) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Password must be at least 8 characters',
                },
                { status: 400 }
            );
        }

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

        return NextResponse.json(
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
