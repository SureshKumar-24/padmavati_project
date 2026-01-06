import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories, createCategory } from '@/lib/categories-db';

// GET - Get all categories with pagination and search
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        const result = await getAllCategories(page, limit, search);

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST - Create new category
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, tags } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Category name is required' },
                { status: 400 }
            );
        }

        const tagsArray = Array.isArray(tags) ? tags : [];
        const category = await createCategory(name, tagsArray);

        return NextResponse.json({
            success: true,
            category,
        });
    } catch (error) {
        console.error('Create category error:', error);
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
