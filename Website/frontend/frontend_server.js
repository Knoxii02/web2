const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'checkout.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'shop.html'));
});

app.get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'product.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'contact.html'));
});

app.get('/imprint', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'imprint.html'));
});

app.get('/payment-terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'payment-terms.html'));
});

app.get('/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'privacy-policy.html'));
});

app.get('/shopping-cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'shopping-cart.html'));
});

app.get('/confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'confirmation.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});