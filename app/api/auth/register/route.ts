import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { apiStore } from '@/lib/api-store';
import type { ApiResponse, RegisterResponse } from '@/lib/types';
import { registerRequestSchema } from '@/lib/validation';
import { createSessionToken, setSessionCookie } from '@/lib/auth';

function deriveDisplayName(fullName: string | undefined, email: string): string {
    if (fullName && fullName.trim().length > 0) {
        return fullName.trim();
    }

    const localPart = email.split('@')[0] ?? 'Member';
    const cleaned = localPart.replace(/[._-]+/g, ' ').trim();
    if (!cleaned) {
        return 'Member';
    }

    return cleaned
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join(' ');
}

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

        const hashedPassword = await hash(password, 10);
        const resolvedFullName = deriveDisplayName(fullName, email);
        const user = apiStore.registerUser(resolvedFullName, email, phone, hashedPassword);

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

        const sessionToken = await createSessionToken({
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
        });

        setSessionCookie(response, sessionToken);

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
