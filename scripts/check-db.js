#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

async function checkDatabase() {
    try {
        console.log('🔍 Connecting to Neon database...\n');

        // Test connection
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Database connected successfully!');
        console.log('📅 Server time:', result.rows[0].now);
        console.log('');

        // Check users table
        const usersCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);

        if (usersCheck.rows.length > 0) {
            console.log('✅ Users table exists');

            // Get all users
            const users = await pool.query('SELECT id, email, name, role, created_at FROM users');
            console.log(`\n👥 Total users: ${users.rows.length}\n`);

            users.rows.forEach(user => {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log(`ID: ${user.id}`);
                console.log(`Email: ${user.email}`);
                console.log(`Name: ${user.name}`);
                console.log(`Role: ${user.role}`);
                console.log(`Created: ${user.created_at}`);
            });
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        } else {
            console.log('❌ Users table does not exist');
            console.log('💡 Run: curl http://localhost:3001/api/init-db to initialize');
        }

        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkDatabase();
