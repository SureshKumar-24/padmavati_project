import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct, getNextProductId } from '@/lib/products-db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const metal = searchParams.get('metal') || undefined;
        const category = searchParams.get('category') || undefined;
        const priceMin = searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined;
        const priceMax = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined;
        const search = searchParams.get('search') || undefined;

        const result = await getAllProducts(page, limit, { metal, category, priceMin, priceMax, search });

        return NextResponse.json({
            success: true,
            products: result.products,
            total: result.pagination.total,
            pagination: result.pagination,
        });
    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, metal, category, price, weight_kg, height_inch, finish_type, stock, images } = body;

        if (!name) {
            return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
        }

        const id = await getNextProductId();
        const product = await createProduct({
            id,
            name,
            description: description || '',
            metal: metal || 'Brass',
            category: category || 'Ganesh',
            price: price || 0,
            weight_kg: weight_kg || 0,
            height_inch: height_inch || 0,
            finish_type: finish_type || 'Antique',
            stock: stock || 0,
            images: images || [],
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
