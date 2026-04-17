import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/lib/api-store';
import type { ApiResponse, CreateChamaResponse } from '@/lib/types';
import { createChamaRequestSchema } from '@/lib/validation';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<CreateChamaResponse>>> {
    try {
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

        const { userId, chamaName, chamaType, members, description } = parseResult.data;

        // Verify user exists; if not, create a demo user for onboarding-only flow.
        let resolvedUserId = userId;
        const user = apiStore.getUserById(userId);
        if (!user) {
            const fallbackAdminEmail =
                members.find((member) => member.role === 'admin')?.email ??
                `demo_${Date.now()}@demo.chamaconnect.local`;
            const existingByEmail = apiStore.getUserByEmail(fallbackAdminEmail);

            if (existingByEmail) {
                resolvedUserId = existingByEmail.id;
            } else {
                const demoUser = apiStore.registerUser(
                    'Demo User',
                    fallbackAdminEmail,
                    '0700000000',
                    'demo-password'
                );

                resolvedUserId = demoUser.id;
            }
        }

        // Create chama
        const chama = apiStore.createChama(resolvedUserId, chamaName, chamaType, members, description);

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
