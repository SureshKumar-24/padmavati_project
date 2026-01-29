import { NextRequest, NextResponse } from 'next/server';
import { getCatalogueById, updateCatalogue, deleteCatalogue } from '@/lib/catalogues-db';

// GET - Get catalogue by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const catalogue = await getCatalogueById(id);

        if (!catalogue) {
            return NextResponse.json({ error: 'Catalogue not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, catalogue });
    } catch (error) {
        console.error('Get catalogue error:', error);
        return NextResponse.json({ error: 'Failed to fetch catalogue' }, { status: 500 });
    }
}

// PUT - Update catalogue
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const body = await request.json();

        const catalogue = await updateCatalogue(id, body);

        if (!catalogue) {
            return NextResponse.json({ error: 'Catalogue not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, catalogue });
    } catch (error) {
        console.error('Update catalogue error:', error);
        return NextResponse.json({ error: 'Failed to update catalogue' }, { status: 500 });
    }
}

// DELETE - Delete catalogue
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const catalogue = await deleteCatalogue(id);

        if (!catalogue) {
            return NextResponse.json({ error: 'Catalogue not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Catalogue deleted successfully' });
    } catch (error) {
        console.error('Delete catalogue error:', error);
        return NextResponse.json({ error: 'Failed to delete catalogue' }, { status: 500 });
    }
}
