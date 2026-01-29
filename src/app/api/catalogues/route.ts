import { NextRequest, NextResponse } from 'next/server';
import { getAllCatalogues, createCatalogue } from '@/lib/catalogues-db';

// GET - Get all catalogues
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        const result = await getAllCatalogues(page, limit, search);

        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error('Get catalogues error:', error);
        return NextResponse.json({ error: 'Failed to fetch catalogues' }, { status: 500 });
    }
}

// POST - Create new catalogue
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, party_id, product_ids, status } = body;

        if (!name) {
            return NextResponse.json({ error: 'Catalogue name is required' }, { status: 400 });
        }

        const catalogue = await createCatalogue({
            name,
            description: description || '',
            party_id: party_id || null,
            product_ids: product_ids || [],
            status: status || 'Draft',
        });

        return NextResponse.json({ success: true, catalogue });
    } catch (error) {
        console.error('Create catalogue error:', error);
        return NextResponse.json({ error: 'Failed to create catalogue' }, { status: 500 });
    }
}
