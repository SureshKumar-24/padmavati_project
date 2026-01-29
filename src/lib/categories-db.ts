import { query } from './db';

export interface Category {
    id: number;
    name: string;
    tags: string[];
    created_at: Date;
    updated_at: Date;
}

// Initialize categories table
export async function initializeCategoriesTable() {
    try {
        await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Categories table created or already exists');
        return { success: true };
    } catch (error) {
        console.error('❌ Categories table creation error:', error);
        throw error;
    }
}

// Get all categories with pagination and search
export async function getAllCategories(
    page: number = 1,
    limit: number = 10,
    search: string = ''
) {
    try {
        const offset = (page - 1) * limit;

        let countQuery = 'SELECT COUNT(*) FROM categories';
        let dataQuery = 'SELECT * FROM categories';
        const params: any[] = [];

        // Add search filter if provided
        if (search) {
            const searchCondition = ' WHERE name ILIKE $1 OR $1 = ANY(tags)';
            countQuery += searchCondition;
            dataQuery += searchCondition;
            params.push(`%${search}%`);
        }

        // Add ordering and pagination
        dataQuery += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        // Get total count
        const countResult = await query(countQuery, search ? [`%${search}%`] : []);
        const total = parseInt(countResult.rows[0].count);

        // Get paginated data
        const dataResult = await query(dataQuery, params);

        return {
            categories: dataResult.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error('Error getting categories:', error);
        throw error;
    }
}

// Get category by ID
export async function getCategoryById(id: number) {
    try {
        const result = await query(
            'SELECT * FROM categories WHERE id = $1',
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error getting category:', error);
        throw error;
    }
}

// Create category
export async function createCategory(name: string, tags: string[]) {
    try {
        const result = await query(
            'INSERT INTO categories (name, tags) VALUES ($1, $2) RETURNING *',
            [name, tags]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
}

// Update category
export async function updateCategory(id: number, name: string, tags: string[]) {
    try {
        const result = await query(
            'UPDATE categories SET name = $1, tags = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [name, tags, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

// Delete category
export async function deleteCategory(id: number) {
    try {
        const result = await query(
            'DELETE FROM categories WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}
