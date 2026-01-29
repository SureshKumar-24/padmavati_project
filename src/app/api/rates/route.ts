import { NextRequest, NextResponse } from 'next/server';
import { getAllRates, createRate } from '@/lib/rates-db';

// GET - Get all rates
export async function GET() {
    try {
        const rates = await getAllRates();

        return NextResponse.json({
            success: true,
            rates,
        });
    } catch (error) {
        console.error('Get rates error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rates' },
            { status: 500 }
        );
    }
}

// POST - Create new rate
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { metal, rate_per_kg, labour_charge_percent, gst_percent } = body;

        if (!metal || !rate_per_kg) {
            return NextResponse.json(
                { error: 'Metal and rate per kg are required' },
                { status: 400 }
            );
        }

        const rate = await createRate({
            metal,
            rate_per_kg,
            labour_charge_percent: labour_charge_percent || 30,
            gst_percent: gst_percent || 18,
            effective_from: new Date(),
        });

        return NextResponse.json({
            success: true,
            rate,
        });
    } catch (error) {
        console.error('Create rate error:', error);
        return NextResponse.json(
            { error: 'Failed to create rate' },
            { status: 500 }
        );
    }
}
