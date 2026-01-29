import { NextRequest, NextResponse } from 'next/server';
import { getRateById, updateRate } from '@/lib/rates-db';

// GET - Get rate by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const rate = await getRateById(id);

        if (!rate) {
            return NextResponse.json(
                { error: 'Rate not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            rate,
        });
    } catch (error) {
        console.error('Get rate error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rate' },
            { status: 500 }
        );
    }
}

// PUT - Update rate
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const body = await request.json();

        const rate = await updateRate(id, body);

        if (!rate) {
            return NextResponse.json(
                { error: 'Rate not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            rate,
        });
    } catch (error) {
        console.error('Update rate error:', error);
        return NextResponse.json(
            { error: 'Failed to update rate' },
            { status: 500 }
        );
    }
}
