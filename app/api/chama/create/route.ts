import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/lib/api-store';
import type { ApiResponse, CreateChamaResponse } from '@/lib/types';
import { createChamaRequestSchema } from '@/lib/validation';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<CreateChamaResponse>>> {
    try {
        const session = await getSessionFromRequest(request);
        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized',
                },
                { status: 401 }
            );
        }

        const parseResult = createChamaRequestSchema.safeParse(await request.json());
        if (!parseResult.success) {
            const issue = parseResult.error.issues[0];
            return NextResponse.json(
                {
                    success: false,
                    message: issue?.message ?? 'Invalid chama payload',
                },
                { status: 400 }
            );
        }

        const { chamaName, chamaType, members, description } = parseResult.data;

        // Create chama
        const chama = apiStore.createChama(session.userId, chamaName, chamaType, members, description);

        return NextResponse.json(
            {
                success: true,
                data: {
                    chamaId: chama.id,
                    chamaName: chama.name,
                    memberCount: chama.members.length,
                },
                message: 'Chama created successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create chama';

        return NextResponse.json(
            {
                success: false,
                message: errorMessage,
            },
            { status: 500 }
        );
    }
}
