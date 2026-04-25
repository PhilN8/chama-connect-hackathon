import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, ExistingSacco } from '@/lib/types';
import { searchQuerySchema } from '@/lib/validation';
import { getMockSaccos } from '@/lib/mock-saccos';

const mockSaccos = getMockSaccos();

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<{ results: ExistingSacco[]; total: number }>>> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const parseResult = searchQuerySchema.safeParse({ q: searchParams.get('q') ?? '' });
        if (!parseResult.success) {
            const issue = parseResult.error.issues[0];
            return NextResponse.json(
                {
                    success: false,
                    message: issue?.message ?? 'Invalid search query',
                },
                { status: 400 }
            );
        }

        const { q: query } = parseResult.data;

        if (query.length < 2) {
            return NextResponse.json(
                {
                    success: true,
                    data: {
                        results: [],
                        total: 0,
                    },
                    message: 'Search query too short',
                },
                { status: 200 }
            );
        }

        const results = mockSaccos.filter(sacco =>
            sacco.name.toLowerCase().includes(query.toLowerCase()) ||
            sacco.location.toLowerCase().includes(query.toLowerCase())
        );

        return NextResponse.json(
            {
                success: true,
                data: {
                    results,
                    total: results.length,
                },
                message: `Found ${results.length} SACCO(s)`,
            },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Search failed';

        return NextResponse.json(
            {
                success: false,
                message: errorMessage,
            },
            { status: 500 }
        );
    }
}
