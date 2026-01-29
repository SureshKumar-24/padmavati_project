import { NextRequest, NextResponse } from 'next/server';
import { getAllParties, createParty } from '@/lib/parties-db';

// GET - Get all parties with pagination and search
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        const result = await getAllParties(page, limit, search);

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error('Get parties error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch parties' },
            { status: 500 }
        );
    }
}

// POST - Create new party
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, address, city, state, gst_number, type, discount } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Party name is required' },
                { status: 400 }
            );
        }

        const party = await createParty({
            name,
            email: email || '',
            phone: phone || '',
            address: address || '',
            city: city || '',
            state: state || '',
            gst_number: gst_number || null,
            type: type || 'Retailer',
            discount: discount || 0,
        });

        return NextResponse.json({
            success: true,
            party,
        });
    } catch (error) {
        console.error('Create party error:', error);
        return NextResponse.json(
            { error: 'Failed to create party' },
            { status: 500 }
        );
    }
}
