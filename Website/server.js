const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs').promises; // Import fs.promises

const app = express();
const db = new sqlite3.Database('./db/database.sqlite');

app.use(express.static(path.join(__dirname)));

async function getFirstImageInFolder(folderName) { // Make function async
    try {
        const folderPath = path.join(__dirname, 'pictures', folderName);
        
        const files = await fs.readdir(folderPath); // Use await and fs.readdir
        
        const imageFiles = files
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
            .sort();
        
        return imageFiles.length > 0 ? imageFiles[0] : null;
    } catch (error) {
        console.error(`Error finding images in ${folderName}:`, error);
        return null;
    }
}

app.get('/api/products', async (req, res) => { // Make route handler async
    db.all('SELECT * FROM products', [], async (err, rows) => { // Make callback async
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const productsWithImages = await Promise.all(rows.map(async product => { // Use Promise.all and await
            return {
                ...product,
                firstImage: await getFirstImageInFolder(product.image_folder) // Use await
            };
        }));
        
        res.json(productsWithImages);
    });
});

app.get('/api/products/:id', async (req, res) => { // Make route handler async
    const productId = req.params.id;
    db.get('SELECT * FROM products WHERE id = ?', [productId], async (err, row) => { // Make callback async
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Produkt nicht gefunden' });
            return;
        }
        
        row.firstImage = await getFirstImageInFolder(row.image_folder); // Use await
        res.json(row);
    });
});

app.get('/api/products/images/:folder', async (req, res) => { // Make route handler async
  const folderName = req.params.folder;
  
  try {
    const folderPath = path.join(__dirname, 'pictures', folderName);
    
    const files = await fs.readdir(folderPath); // Use await and fs.readdir
    
    const imageFiles = files
      .filter(file => /\.(jpg|png)$/i.test(file))
      .sort();
    
    if (imageFiles.length > 0) {
      const imagePaths = imageFiles.map(file => `${folderName}/${file}`);
      res.json({ images: imagePaths });
    } else {
      res.status(404).json({ error: 'No images found' });
    }
  } catch (error) {
    console.error(`Error finding images in ${folderName}:`, error);
    res.status(500).json({ error: 'Error accessing image folder' });
  }
});

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});