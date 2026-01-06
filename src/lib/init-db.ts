import { query } from './db';
import bcrypt from 'bcryptjs';

export async function initializeDatabase() {
    try {
        // Create users table if it doesn't exist
        await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log('✅ Users table created or already exists');

        // Check if admin user exists
        const adminCheck = await query(
            'SELECT * FROM users WHERE email = $1',
            ['admin@example.com']
        );

        if (adminCheck.rows.length === 0) {
            // Create default admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await query(
                'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
                ['admin@example.com', hashedPassword, 'Admin User', 'admin']
            );
            console.log('✅ Default admin user created');
            console.log('📧 Email: admin@example.com');
            console.log('🔑 Password: admin123');
        } else {
            console.log('✅ Admin user already exists');
        }

        return { success: true };
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        throw error;
    }
}

export async function createUser(email: string, password: string, name: string, role: string = 'admin') {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await query(
            'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
            [email, hashedPassword, name, role]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function getUserByEmail(email: string) {
    try {
        const result = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
}
