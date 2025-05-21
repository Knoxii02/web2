const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.sqlite'));

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS products');
    
    // Create products table with image_folder instead of image
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        short_description TEXT,
        long_description TEXT,
        price REAL NOT NULL,
        image_folder TEXT,
        category TEXT NOT NULL
    )`);

    // Update insert statement to use image_folder
    const insertProduct = db.prepare(`
        INSERT INTO products (name, short_description, long_description, price, image_folder, category) 
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Product data with image_folder instead of image
    const products = [
        {
            name: 'Arbeitsheft Zahlenraum 20',
            long_description: 'Das Arbeitsheft für den ZR -20 enthält alle nötigen Schritte, um den ZR - 20 fundiert aufzubauen. Das Arbeitsheft mit praktischer Spiralbindung ist für den differenzierenden Einsatz in der Grundschule geeignet und damit auch für den Einsatz in der Förderschule. Der Umfang beträgt 161 Seiten.',
            price: 24.95,
            image_folder: 'workbook_1/',
            category: 'Arbeitsheft'
        },
        {
            name: 'Cuipsi Platten Set',
            long_description: 'Die Cuispi-Platten aus Holz wurden neu entwickelt und erleichtern das operative Handeln im Zahlenraum bis 100. Sie wirken dem Zählen entgegen. Ein Satz enthält 3x die 20er-Platte und je 2x die weiteren Platten bis zur 100er-Platte.',
            price: 27.80,
            image_folder: 'workmaterial_1/',
            category: 'Arbeitsmaterial'
        },
        {
            name: 'Mit Cuipsi den Mengen auf der Spur',
            long_description: 'Mit Cuipsi den Mengen auf der Spur (2. Auflage) richtet sich an Erzieherinnen in Kindertagesstätten und Lehrkräfte. Das Werk bietet eine theoretische Einführung und praktische Arbeitsblätter. Inkl. CD mit Vorlagen.',
            price: 39.90,
            image_folder: 'book_1/',
            category: 'Buch'
        },
        {
            name: 'Arbeitsheft Zahlenraum 100',
            long_description: 'Dieses Werk baut auf dem Material "Mit Cuipsi die Zahlen bis 20 entdecken" auf und eignet sich besonders für inklusive Klassen. Inkl. CD mit farbigen Materialien zum Selbstausdrucken.',
            price: 39.90,
            image_folder: 'workbook_3/',
            category: 'Arbeitsheft'
        },
        {
            name: 'Cuipsi-Quader - Komplettpaket',
            long_description: 'Das Cuipsi-Quader-Komplettpaket enthält verschiedene Quader für den Zahlenraum bis 1000. Hergestellt aus biologisch abbaubarem Kunststoff. Inklusive Vorlagen für Tafelmaterial und Bastelanleitungen.',
            price: 69.95,
            image_folder: 'workmaterial_1/',
            category: 'Arbeitsmaterial'
        }
    ];

    // Insert each product
    products.forEach(product => {
        insertProduct.run(
            product.name,
            product.long_description,
            product.short_description,
            product.price,
            product.image_folder,
            product.category
        );
    });

    insertProduct.finalize();
    console.log('Database initialized with sample data.');
});

db.close();
