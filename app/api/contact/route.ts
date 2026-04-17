import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';
import { contactRequestSchema } from '@/lib/validation';

export async function POST(
    request: NextRequest
): Promise<NextResponse<ApiResponse<{ received: boolean }>>> {
    try {
        const parseResult = contactRequestSchema.safeParse(await request.json());
        if (!parseResult.success) {
            const issue = parseResult.error.issues[0];
            return NextResponse.json(
                {
                    success: false,
                    message: issue?.message ?? 'Invalid contact request',
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: { received: true },
                message: 'Message received. We will get back to you soon.',
            },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        return NextResponse.json(
            {
                success: false,
                message: errorMessage,
            },
            { status: 500 }
        );
    }
}
