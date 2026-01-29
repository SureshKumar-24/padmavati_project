import { query } from './db';

export interface Catalogue {
    id: number;
    name: string;
    description: string;
    party_id: number | null;
    party_name?: string;
    product_ids: string[];
    status: 'Draft' | 'Generated' | 'Shared';
    pdf_url: string | null;
    created_at: Date;
    updated_at: Date;
}

// Get all catalogues with party names
export async function getAllCatalogues(page: number = 1, limit: number = 10, search: string = '') {
    try {
        const offset = (page - 1) * limit;
        let countQuery = `SELECT COUNT(*) FROM catalogues c LEFT JOIN parties p ON c.party_id = p.id`;
        let dataQuery = `SELECT c.*, p.name as party_name FROM catalogues c LEFT JOIN parties p ON c.party_id = p.id`;
        const params: any[] = [];

        if (search) {
            const searchCondition = ` WHERE c.name ILIKE $1 OR p.name ILIKE $1`;
            countQuery += searchCondition;
            dataQuery += searchCondition;
            params.push(`%${search}%`);
        }

        const countResult = await query(countQuery, search ? [`%${search}%`] : []);
        const total = parseInt(countResult.rows[0].count);

        dataQuery += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const dataResult = await query(dataQuery, params);

        return {
            catalogues: dataResult.rows,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    } catch (error) {
        console.error('Error getting catalogues:', error);
        throw error;
    }
}

// Get catalogue by ID
export async function getCatalogueById(id: number) {
    try {
        const result = await query(
            `SELECT c.*, p.name as party_name FROM catalogues c LEFT JOIN parties p ON c.party_id = p.id WHERE c.id = $1`,
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error getting catalogue:', error);
        throw error;
    }
}

// Create catalogue
export async function createCatalogue(data: {
    name: string;
    description?: string;
    party_id?: number | null;
    product_ids: string[];
    status?: string;
}) {
    try {
        const result = await query(
            `INSERT INTO catalogues (name, description, party_id, product_ids, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [data.name, data.description || '', data.party_id || null, data.product_ids, data.status || 'Draft']
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating catalogue:', error);
        throw error;
    }
}

// Update catalogue
export async function updateCatalogue(id: number, data: Partial<Catalogue>) {
    try {
        const fields: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        if (data.name !== undefined) { fields.push(`name = $${paramIndex++}`); params.push(data.name); }
        if (data.description !== undefined) { fields.push(`description = $${paramIndex++}`); params.push(data.description); }
        if (data.party_id !== undefined) { fields.push(`party_id = $${paramIndex++}`); params.push(data.party_id); }
        if (data.product_ids !== undefined) { fields.push(`product_ids = $${paramIndex++}`); params.push(data.product_ids); }
        if (data.status !== undefined) { fields.push(`status = $${paramIndex++}`); params.push(data.status); }
        if (data.pdf_url !== undefined) { fields.push(`pdf_url = $${paramIndex++}`); params.push(data.pdf_url); }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        const result = await query(
            `UPDATE catalogues SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            params
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating catalogue:', error);
        throw error;
    }
}

// Delete catalogue
export async function deleteCatalogue(id: number) {
    try {
        const result = await query('DELETE FROM catalogues WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting catalogue:', error);
        throw error;
    }
}
