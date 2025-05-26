const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db', 'database.sqlite');
const setupSQLPath = path.join(__dirname, '..', 'db', 'database_setup.sql');

// Ensure the db directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});

fs.readFile(setupSQLPath, 'utf8', (err, sql) => {
    if (err) {
        console.error('Error reading SQL setup file:', err.message);
        db.close();
        return;
    }

    db.exec(sql, (execErr) => {
        if (execErr) {
            console.error('Error executing SQL script:', execErr.message);
        } else {
            console.log('Database setup script executed successfully.');
        }

        db.close((closeErr) => {
            if (closeErr) {
                console.error('Error closing the database:', closeErr.message);
            } else {
                console.log('Database connection closed.');
            }
        });
    });
});
