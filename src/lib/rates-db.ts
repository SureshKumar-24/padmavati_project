import { query } from './db';

export interface Rate {
    id: number;
    metal: string;
    rate_per_kg: number;
    labour_charge_percent: number;
    gst_percent: number;
    effective_from: Date;
    created_at: Date;
    updated_at: Date;
}

// Get all rates
export async function getAllRates() {
    try {
        const result = await query('SELECT * FROM rates ORDER BY metal ASC');
        return result.rows;
    } catch (error) {
        console.error('Error getting rates:', error);
        throw error;
    }
}

// Get rate by ID
export async function getRateById(id: number) {
    try {
        const result = await query('SELECT * FROM rates WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error getting rate:', error);
        throw error;
    }
}

// Get rate by metal
export async function getRateByMetal(metal: string) {
    try {
        const result = await query('SELECT * FROM rates WHERE metal = $1', [metal]);
        return result.rows[0];
    } catch (error) {
        console.error('Error getting rate by metal:', error);
        throw error;
    }
}

// Update rate
export async function updateRate(id: number, data: Partial<Rate>) {
    try {
        const fields: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        if (data.rate_per_kg !== undefined) { fields.push(`rate_per_kg = $${paramIndex++}`); params.push(data.rate_per_kg); }
        if (data.labour_charge_percent !== undefined) { fields.push(`labour_charge_percent = $${paramIndex++}`); params.push(data.labour_charge_percent); }
        if (data.gst_percent !== undefined) { fields.push(`gst_percent = $${paramIndex++}`); params.push(data.gst_percent); }
        if (data.effective_from !== undefined) { fields.push(`effective_from = $${paramIndex++}`); params.push(data.effective_from); }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        const result = await query(
            `UPDATE rates SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            params
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating rate:', error);
        throw error;
    }
}

// Create rate (for new metals)
export async function createRate(data: Omit<Rate, 'id' | 'created_at' | 'updated_at'>) {
    try {
        const result = await query(
            `INSERT INTO rates (metal, rate_per_kg, labour_charge_percent, gst_percent, effective_from) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [data.metal, data.rate_per_kg, data.labour_charge_percent, data.gst_percent, data.effective_from || new Date()]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating rate:', error);
        throw error;
    }
}
