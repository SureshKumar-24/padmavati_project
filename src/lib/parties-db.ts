import { query } from './db';

export interface Party {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    gst_number: string | null;
    type: string;
    discount: number;
    created_at: Date;
    updated_at: Date;
}

// Get all parties with pagination and search
export async function getAllParties(
    page: number = 1,
    limit: number = 10,
    search: string = ''
) {
    try {
        const offset = (page - 1) * limit;
        let countQuery = 'SELECT COUNT(*) FROM parties';
        let dataQuery = 'SELECT * FROM parties';
        const params: any[] = [];

        if (search) {
            const searchCondition = ' WHERE name ILIKE $1 OR city ILIKE $1 OR type ILIKE $1';
            countQuery += searchCondition;
            dataQuery += searchCondition;
            params.push(`%${search}%`);
        }

        // Get total count
        const countResult = await query(countQuery, search ? [`%${search}%`] : []);
        const total = parseInt(countResult.rows[0].count);

        // Get paginated data
        dataQuery += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const dataResult = await query(dataQuery, params);

        return {
            parties: dataResult.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error('Error getting parties:', error);
        throw error;
    }
}

// Get party by ID
export async function getPartyById(id: number) {
    try {
        const result = await query('SELECT * FROM parties WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error getting party:', error);
        throw error;
    }
}

// Create party
export async function createParty(data: Omit<Party, 'id' | 'created_at' | 'updated_at'>) {
    try {
        const result = await query(
            `INSERT INTO parties (name, email, phone, address, city, state, gst_number, type, discount) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [data.name, data.email, data.phone, data.address, data.city, data.state, data.gst_number, data.type, data.discount]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating party:', error);
        throw error;
    }
}

// Update party
export async function updateParty(id: number, data: Partial<Party>) {
    try {
        const fields: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        if (data.name !== undefined) { fields.push(`name = $${paramIndex++}`); params.push(data.name); }
        if (data.email !== undefined) { fields.push(`email = $${paramIndex++}`); params.push(data.email); }
        if (data.phone !== undefined) { fields.push(`phone = $${paramIndex++}`); params.push(data.phone); }
        if (data.address !== undefined) { fields.push(`address = $${paramIndex++}`); params.push(data.address); }
        if (data.city !== undefined) { fields.push(`city = $${paramIndex++}`); params.push(data.city); }
        if (data.state !== undefined) { fields.push(`state = $${paramIndex++}`); params.push(data.state); }
        if (data.gst_number !== undefined) { fields.push(`gst_number = $${paramIndex++}`); params.push(data.gst_number); }
        if (data.type !== undefined) { fields.push(`type = $${paramIndex++}`); params.push(data.type); }
        if (data.discount !== undefined) { fields.push(`discount = $${paramIndex++}`); params.push(data.discount); }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        const result = await query(
            `UPDATE parties SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            params
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating party:', error);
        throw error;
    }
}

// Delete party
export async function deleteParty(id: number) {
    try {
        const result = await query('DELETE FROM parties WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting party:', error);
        throw error;
    }
}
