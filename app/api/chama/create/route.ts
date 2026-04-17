import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/lib/api-store';
import type { ApiResponse, CreateChamaResponse } from '@/lib/types';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<CreateChamaResponse>>> {
    try {
        const body = await request.json();
        const { userId, chamaName, chamaType, members, description } = body;

        // Validation
        if (!userId || typeof userId !== 'string') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID is required',
                },
                { status: 400 }
            );
        }

        // Verify user exists
        const user = apiStore.getUserById(userId);
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }

        if (!chamaName || typeof chamaName !== 'string' || chamaName.trim().length < 2) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Chama name is required and must be at least 2 characters',
                },
                { status: 400 }
            );
        }

        const validTypes = ['SACCO', 'TableBanking', 'MerryGoRound'];
        if (!chamaType || !validTypes.includes(chamaType)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid chama type',
                },
                { status: 400 }
            );
        }

        if (!Array.isArray(members) || members.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'At least one member (admin) is required',
                },
                { status: 400 }
            );
        }

        // Ensure admin exists in members
        const hasAdmin = members.some(m => m.role === 'admin');
        if (!hasAdmin) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'At least one member must be an admin',
                },
                { status: 400 }
            );
        }

        // Create chama
        const chama = apiStore.createChama(userId, chamaName, chamaType, members, description);

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
