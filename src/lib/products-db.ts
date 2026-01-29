import { query } from './db';

export interface Product {
    id: string;
    name: string;
    description: string;
    metal: string;
    category: string;
    price: number;
    weight_kg: number;
    height_inch: number;
    finish_type: string;
    stock: number;
    images: string[];
    created_at: Date;
    updated_at: Date;
}

// Get all products with filters and pagination
export async function getAllProducts(
    page: number = 1,
    limit: number = 50,
    filters?: {
        metal?: string;
        category?: string;
        priceMin?: number;
        priceMax?: number;
        search?: string;
    }
) {
    try {
        const offset = (page - 1) * limit;
        const conditions: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        if (filters?.metal) {
            conditions.push(`metal = $${paramIndex++}`);
            params.push(filters.metal);
        }
        if (filters?.category) {
            conditions.push(`category = $${paramIndex++}`);
            params.push(filters.category);
        }
        if (filters?.priceMin) {
            conditions.push(`price >= $${paramIndex++}`);
            params.push(filters.priceMin);
        }
        if (filters?.priceMax) {
            conditions.push(`price <= $${paramIndex++}`);
            params.push(filters.priceMax);
        }
        if (filters?.search) {
            conditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
            params.push(`%${filters.search}%`);
            paramIndex++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Get total count
        const countResult = await query(
            `SELECT COUNT(*) FROM products ${whereClause}`,
            params
        );
        const total = parseInt(countResult.rows[0].count);

        // Get paginated data
        const dataResult = await query(
            `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            [...params, limit, offset]
        );

        return {
            products: dataResult.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error('Error getting products:', error);
        throw error;
    }
}

// Get product by ID
export async function getProductById(id: string) {
    try {
        const result = await query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error getting product:', error);
        throw error;
    }
}

// Create product
export async function createProduct(data: Omit<Product, 'created_at' | 'updated_at'>) {
    try {
        const result = await query(
            `INSERT INTO products (id, name, description, metal, category, price, weight_kg, height_inch, finish_type, stock, images) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [data.id, data.name, data.description, data.metal, data.category, data.price, data.weight_kg, data.height_inch, data.finish_type, data.stock, data.images]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

// Update product
export async function updateProduct(id: string, data: Partial<Product>) {
    try {
        const fields: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        if (data.name !== undefined) { fields.push(`name = $${paramIndex++}`); params.push(data.name); }
        if (data.description !== undefined) { fields.push(`description = $${paramIndex++}`); params.push(data.description); }
        if (data.metal !== undefined) { fields.push(`metal = $${paramIndex++}`); params.push(data.metal); }
        if (data.category !== undefined) { fields.push(`category = $${paramIndex++}`); params.push(data.category); }
        if (data.price !== undefined) { fields.push(`price = $${paramIndex++}`); params.push(data.price); }
        if (data.weight_kg !== undefined) { fields.push(`weight_kg = $${paramIndex++}`); params.push(data.weight_kg); }
        if (data.height_inch !== undefined) { fields.push(`height_inch = $${paramIndex++}`); params.push(data.height_inch); }
        if (data.finish_type !== undefined) { fields.push(`finish_type = $${paramIndex++}`); params.push(data.finish_type); }
        if (data.stock !== undefined) { fields.push(`stock = $${paramIndex++}`); params.push(data.stock); }
        if (data.images !== undefined) { fields.push(`images = $${paramIndex++}`); params.push(data.images); }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        const result = await query(
            `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            params
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

// Delete product
export async function deleteProduct(id: string) {
    try {
        const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

// Generate next product ID
export async function getNextProductId() {
    try {
        const result = await query(
            `SELECT id FROM products ORDER BY id DESC LIMIT 1`
        );
        if (result.rows.length === 0) return 'PROD-001';
        const lastId = result.rows[0].id;
        const num = parseInt(lastId.replace('PROD-', '')) + 1;
        return `PROD-${String(num).padStart(3, '0')}`;
    } catch (error) {
        console.error('Error getting next product ID:', error);
        return `PROD-${Date.now()}`;
    }
}
