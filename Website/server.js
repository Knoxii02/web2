const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const db = new sqlite3.Database('./db/database.sqlite');

app.use(express.static(path.join(__dirname)));

function getFirstImageInFolder(folderName) {
    try {
        const folderPath = path.join(__dirname, 'pictures', folderName);
        
        const files = fs.readdirSync(folderPath);
        
        const imageFiles = files
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
            .sort();
        
        return imageFiles.length > 0 ? imageFiles[0] : null;
    } catch (error) {
        console.error(`Error finding images in ${folderName}:`, error);
        return null;
    }
}

app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const productsWithImages = rows.map(product => {
            return {
                ...product,
                firstImage: getFirstImageInFolder(product.image_folder)
            };
        });
        
        res.json(productsWithImages);
    });
});

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
        
        row.firstImage = getFirstImageInFolder(row.image_folder);
        res.json(row);
    });
});

app.get('/api/products/firstImage/:folder', (req, res) => {
  const folderName = req.params.folder;
  const firstImage = getFirstImageInFolder(folderName);
  
  if (firstImage) {
    res.json({ imagePath: `${folderName}/${firstImage}` });
  } else {
    res.status(404).json({ error: 'No images found' });
  }
});

app.get('/api/products/images/:folder', (req, res) => {
  const folderName = req.params.folder;
  
  try {
    const folderPath = path.join(__dirname, 'pictures', folderName);
    
    const files = fs.readdirSync(folderPath);
    
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