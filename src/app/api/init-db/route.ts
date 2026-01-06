import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/init-db';
import { initializeCategoriesTable } from '@/lib/categories-db';

export async function GET() {
    try {
        await initializeDatabase();
        await initializeCategoriesTable();
        return NextResponse.json({
            success: true,
            message: 'Database initialized successfully',
        });
    } catch (error) {
        console.error('Database initialization error:', error);
        return NextResponse.json(
            { error: 'Failed to initialize database', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
