import { NextRequest, NextResponse } from 'next/server';
import { getPartyById, updateParty, deleteParty } from '@/lib/parties-db';

// GET - Get party by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const party = await getPartyById(id);

        if (!party) {
            return NextResponse.json(
                { error: 'Party not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            party,
        });
    } catch (error) {
        console.error('Get party error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch party' },
            { status: 500 }
        );
    }
}

// PUT - Update party
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const body = await request.json();

        const party = await updateParty(id, body);

        if (!party) {
            return NextResponse.json(
                { error: 'Party not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            party,
        });
    } catch (error) {
        console.error('Update party error:', error);
        return NextResponse.json(
            { error: 'Failed to update party' },
            { status: 500 }
        );
    }
}

// DELETE - Delete party
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const party = await deleteParty(id);

        if (!party) {
            return NextResponse.json(
                { error: 'Party not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Party deleted successfully',
        });
    } catch (error) {
        console.error('Delete party error:', error);
        return NextResponse.json(
            { error: 'Failed to delete party' },
            { status: 500 }
        );
    }
}
