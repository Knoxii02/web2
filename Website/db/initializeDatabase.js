const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    // Create products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image TEXT,
        category TEXT NOT NULL
    )`);

    // Insert sample data into products table
    db.run(`INSERT INTO products (name, description, price, image, category) VALUES
        ('Arbeitsheft Zahlenraum 20', 'Ein Arbeitsheft für den Zahlenraum bis 20.', 12.99, 'workbook_1/workbook_1_1.jpg', 'Arbeitsheft'),
        ('Cuipsi Platten Set', 'Ein Set von Cuipsi Platten für kreatives Lernen.', 24.99, 'workmaterial_1/workmaterial_1_1.jpg', 'Arbeitsmaterial'),
        ('Mit Cuipsi den Mengen auf der Spur', 'Didaktischer Leitfaden zur Einführung der Cuisenaire-Methode.', 24.99, 'book_1/book_1_1.jpg', 'Buch'),
        ('Arbeitsheft Zahlenraum 100', 'Übungen und Aufgaben zum Rechnen im Zahlenraum bis 100.', 12.49, 'workbook_3/workbook_3_1.jpg', 'Arbeitsheft'),
        ('Cuipsi-Quader - Komplettpaket', 'Anschauungsmittel im Zahlenraum bis 1000.', 19.99, 'workmaterial_1/workmaterial_1_3.jpg', 'Arbeitsmaterial')
    `);

    console.log('Database initialized with sample data.');
});

db.close();
