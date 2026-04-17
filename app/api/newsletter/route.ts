import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';
import { newsletterSubscribeSchema } from '@/lib/validation';

export async function POST(
    request: NextRequest
): Promise<NextResponse<ApiResponse<{ subscribed: boolean }>>> {
    try {
        const parseResult = newsletterSubscribeSchema.safeParse(await request.json());
        if (!parseResult.success) {
            const issue = parseResult.error.issues[0];
            return NextResponse.json(
                {
                    success: false,
                    message: issue?.message ?? 'Invalid newsletter payload',
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: { subscribed: true },
                message: 'Subscribed successfully to ChamaConnect updates.',
            },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe';
        return NextResponse.json(
            {
                success: false,
                message: errorMessage,
            },
            { status: 500 }
        );
    }
}
