import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/lib/api-store';
import type { ApiResponse, ExistingSacco } from '@/lib/types';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<{ results: ExistingSacco[]; total: number }>>> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';

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

        const results = apiStore.searchSaccos(query);

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
