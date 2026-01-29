const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function seedDatabase() {
    const client = await pool.connect();
    
    try {
        console.log('🌱 Starting database seeding...\n');

        // Create all tables
        console.log('📦 Creating tables...');
        
        // Users table
        await client.query(`
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
        console.log('✅ Users table ready');

        // Categories table
        await client.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                tags TEXT[] DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Categories table ready');

        // Rates table
        await client.query(`
            CREATE TABLE IF NOT EXISTS rates (
                id SERIAL PRIMARY KEY,
                metal VARCHAR(50) NOT NULL UNIQUE,
                rate_per_kg DECIMAL(10,2) NOT NULL,
                labour_charge_percent DECIMAL(5,2) DEFAULT 30,
                gst_percent DECIMAL(5,2) DEFAULT 18,
                effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Rates table ready');

        // Parties table
        await client.query(`
            CREATE TABLE IF NOT EXISTS parties (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                phone VARCHAR(50),
                address TEXT,
                city VARCHAR(100),
                state VARCHAR(100),
                gst_number VARCHAR(50),
                type VARCHAR(50) DEFAULT 'Retailer',
                discount DECIMAL(5,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Parties table ready');

        // Products table
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                metal VARCHAR(50),
                category VARCHAR(100),
                price DECIMAL(10,2),
                weight_kg DECIMAL(10,3),
                height_inch DECIMAL(10,2),
                finish_type VARCHAR(50),
                stock INTEGER DEFAULT 0,
                images TEXT[] DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Products table ready');

        // Catalogues table
        await client.query(`
            CREATE TABLE IF NOT EXISTS catalogues (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                party_id INTEGER REFERENCES parties(id),
                product_ids TEXT[] DEFAULT '{}',
                status VARCHAR(50) DEFAULT 'Draft',
                pdf_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Catalogues table ready');

        console.log('\n📝 Inserting sample data...');

        // Insert categories
        const categories = [
            { name: 'Ganesh', tags: ['God', 'Prosperity', 'Wisdom'] },
            { name: 'Laxmi', tags: ['Goddess', 'Wealth', 'Fortune'] },
            { name: 'Hanuman', tags: ['God', 'Strength', 'Devotion'] },
            { name: 'Buddha', tags: ['Peace', 'Meditation', 'Enlightenment'] },
            { name: 'Krishna', tags: ['God', 'Love', 'Divine'] },
            { name: 'Diyas', tags: ['Puja', 'Festival', 'Light'] },
            { name: 'Brackets', tags: ['Decor', 'Wall Hanging', 'Traditional'] },
            { name: 'Shiva', tags: ['God', 'Destroyer', 'Meditation'] },
        ];

        for (const cat of categories) {
            await client.query(
                `INSERT INTO categories (name, tags) VALUES ($1, $2) 
                 ON CONFLICT DO NOTHING`,
                [cat.name, cat.tags]
            );
        }
        console.log('✅ Categories inserted');

        // Insert rates
        const rates = [
            { metal: 'Brass', rate: 450, labour: 30, gst: 18 },
            { metal: 'Copper', rate: 750, labour: 35, gst: 18 },
            { metal: 'Panchdhatu', rate: 1200, labour: 40, gst: 18 },
            { metal: 'Bronze', rate: 650, labour: 35, gst: 18 },
        ];

        for (const rate of rates) {
            await client.query(
                `INSERT INTO rates (metal, rate_per_kg, labour_charge_percent, gst_percent) 
                 VALUES ($1, $2, $3, $4) 
                 ON CONFLICT (metal) DO UPDATE SET 
                 rate_per_kg = $2, labour_charge_percent = $3, gst_percent = $4`,
                [rate.metal, rate.rate, rate.labour, rate.gst]
            );
        }
        console.log('✅ Rates inserted');

        // Insert parties
        const parties = [
            { name: 'Shree Krishna Traders', email: 'krishna.traders@email.com', phone: '+91 98765 43210', address: '123 Temple Street', city: 'Jaipur', state: 'Rajasthan', gst: '08AABCU9603R1ZM', type: 'Wholesaler', discount: 15 },
            { name: 'Divine Gifts Store', email: 'divine.gifts@email.com', phone: '+91 87654 32109', address: '456 Market Road', city: 'Mumbai', state: 'Maharashtra', gst: '27AABCU9603R1ZM', type: 'Retailer', discount: 10 },
            { name: 'Shri Siddhivinayak Temple', email: 'temple@siddhivinayak.org', phone: '+91 76543 21098', address: 'Prabhadevi', city: 'Mumbai', state: 'Maharashtra', gst: null, type: 'Temple', discount: 20 },
            { name: 'Brass World Distributors', email: 'info@brassworld.com', phone: '+91 65432 10987', address: '789 Industrial Area', city: 'Moradabad', state: 'Uttar Pradesh', gst: '09AABCU9603R1ZM', type: 'Distributor', discount: 25 },
        ];

        for (const party of parties) {
            await client.query(
                `INSERT INTO parties (name, email, phone, address, city, state, gst_number, type, discount) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                 ON CONFLICT DO NOTHING`,
                [party.name, party.email, party.phone, party.address, party.city, party.state, party.gst, party.type, party.discount]
            );
        }
        console.log('✅ Parties inserted');

        // Insert products
        const products = [
            { id: 'PROD-001', name: 'Lord Ganesha Brass Idol - Large', description: 'Handcrafted brass Ganesha idol with intricate detailing and antique finish.', metal: 'Brass', category: 'Ganesh', price: 4500, weight: 2.5, height: 12, finish: 'Antique', stock: 15, images: ['/Ganesha/AA2790YA-Photoroom.webp'] },
            { id: 'PROD-002', name: 'Beautifully Crafted Brass Ganesha', description: 'Beautiful brass Ganesha with glossy golden finish.', metal: 'Brass', category: 'Ganesh', price: 3200, weight: 1.5, height: 8, finish: 'Glossy', stock: 20, images: ['/Ganesha/Beautifully_Crafted_Brass_Ganesha_Idol_720x.webp'] },
            { id: 'PROD-003', name: 'Goddess Laxmi Brass Statue', description: 'Beautiful brass Laxmi statue with glossy golden finish.', metal: 'Brass', category: 'Laxmi', price: 3800, weight: 1.8, height: 10, finish: 'Glossy', stock: 12, images: ['/Laxmi/41O-7cmWkaL._AC_UF894,1000_QL80_.jpg'] },
            { id: 'PROD-004', name: 'Laxmi Ji Premium Idol', description: 'Premium Laxmi idol with detailed craftsmanship.', metal: 'Brass', category: 'Laxmi', price: 5500, weight: 3.0, height: 14, finish: 'Antique', stock: 8, images: ['/Laxmi/811Nf8Dko6L.jpg'] },
            { id: 'PROD-005', name: 'Lord Hanuman Copper Statue', description: 'Majestic copper Hanuman statue with matte finish.', metal: 'Copper', category: 'Hanuman', price: 6200, weight: 4.0, height: 16, finish: 'Matte', stock: 5, images: ['/Hanuman/81ugO2iR3lL.jpg'] },
            { id: 'PROD-006', name: 'Buddha Meditation Brass Idol', description: 'Peaceful Buddha idol perfect for meditation spaces.', metal: 'Brass', category: 'Buddha', price: 4200, weight: 2.2, height: 11, finish: 'Antique', stock: 18, images: ['/Buddha/brass13.webp'] },
            { id: 'PROD-007', name: 'Brass Diya Set - 5 Pieces', description: 'Traditional brass diya set for puja and festivals.', metal: 'Brass', category: 'Diyas', price: 1200, weight: 0.8, height: 3, finish: 'Polished', stock: 50, images: ['/Diyas/39733345-15721618.webp'] },
            { id: 'PROD-008', name: 'Panchdhatu Ganesh Premium', description: 'Premium Panchdhatu Ganesh idol for prosperity.', metal: 'Panchdhatu', category: 'Ganesh', price: 8500, weight: 2.0, height: 9, finish: 'Glossy', stock: 6, images: ['/Ganesha/Vintage_Brass_Large_Ganesha_Statue_Antique_Chola_Finish_35_Inch_463324.webp'] },
            { id: 'PROD-009', name: 'Wall Hanging Bracket with Bells', description: 'Decorative wall bracket with traditional bells.', metal: 'Brass', category: 'Brackets', price: 2800, weight: 1.3, height: 15, finish: 'Antique', stock: 25, images: ['/Brackets/mahaganpati-hand-etched-wall-decor-hanging-with-bells-in-brass-9-bells-1300-grams_1.webp'] },
            { id: 'PROD-010', name: 'Bronze Krishna Statue', description: 'Elegant bronze Krishna playing flute.', metal: 'Bronze', category: 'Krishna', price: 7200, weight: 3.5, height: 13, finish: 'Antique', stock: 4, images: ['/Buddha/29_1e4cfc00-1e03-4b7b-b162-a829b25aae19_1200x1200.webp'] },
            { id: 'PROD-011', name: 'Copper Laxmi Ganesh Set', description: 'Beautiful copper Laxmi Ganesh set for Diwali.', metal: 'Copper', category: 'Laxmi', price: 5800, weight: 2.8, height: 10, finish: 'Polished', stock: 10, images: ['/Laxmi/miw156.jpg'] },
            { id: 'PROD-012', name: 'Small Brass Diya', description: 'Traditional small brass diya for daily puja.', metal: 'Brass', category: 'Diyas', price: 350, weight: 0.2, height: 2, finish: 'Polished', stock: 100, images: ['/Diyas/5_f4eb7586-851d-45df-93a0-e2e640545a61.webp'] },
        ];

        for (const prod of products) {
            await client.query(
                `INSERT INTO products (id, name, description, metal, category, price, weight_kg, height_inch, finish_type, stock, images) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
                 ON CONFLICT (id) DO UPDATE SET 
                 name = $2, description = $3, metal = $4, category = $5, price = $6, 
                 weight_kg = $7, height_inch = $8, finish_type = $9, stock = $10, images = $11`,
                [prod.id, prod.name, prod.description, prod.metal, prod.category, prod.price, prod.weight, prod.height, prod.finish, prod.stock, prod.images]
            );
        }
        console.log('✅ Products inserted');

        console.log('\n🎉 Database seeding completed successfully!');
        
        // Show counts
        const counts = await client.query(`
            SELECT 
                (SELECT COUNT(*) FROM categories) as categories,
                (SELECT COUNT(*) FROM rates) as rates,
                (SELECT COUNT(*) FROM parties) as parties,
                (SELECT COUNT(*) FROM products) as products
        `);
        console.log('\n📊 Database Summary:');
        console.log(`   Categories: ${counts.rows[0].categories}`);
        console.log(`   Rates: ${counts.rows[0].rates}`);
        console.log(`   Parties: ${counts.rows[0].parties}`);
        console.log(`   Products: ${counts.rows[0].products}`);

    } catch (error) {
        console.error('❌ Seeding error:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

seedDatabase();
