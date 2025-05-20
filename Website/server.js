const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./db/database.sqlite');

// Serve static files from the current directory (Website folder)
app.use(express.static(path.join(__dirname)));

// API endpoint to fetch products
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// API endpoint to fetch a single product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Produkt nicht gefunden' });
            return;
        }
        res.json(row);
    });
});

// API endpoint to fetch cart items
app.get('/api/cart', (req, res) => {
    db.all('SELECT * FROM cart', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Serve the checkout page dynamically
app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'checkout.html'));
});

// Serve the shop page dynamically
app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'shop.html'));
});

// Serve the product page dynamically
app.get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'product.html'));
});

// Serve the index page dynamically
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Serve the index page dynamically
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Serve the index page dynamically
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Serve the contact page dynamically
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'contact.html'));
});

// Serve the imprint page dynamically
app.get('/imprint', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'imprint.html'));
});

// Serve the payment terms page dynamically
app.get('/payment-terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'payment-terms.html'));
});

// Serve the privacy policy page dynamically
app.get('/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'privacy-policy.html'));
});

// Serve the shopping cart page dynamically
app.get('/shopping-cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'shopping-cart.html'));
});

// Serve the confirmation page dynamically
app.get('/confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'confirmation.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});