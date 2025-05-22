const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const db = new sqlite3.Database('./db/database.sqlite');

// Serve static files from the current directory (Website folder)
app.use(express.static(path.join(__dirname)));

// Function to get first image alphabetically from a folder
function getFirstImageInFolder(folderName) {
    try {
        const folderPath = path.join(__dirname, 'pictures', folderName);
        
        // Read directory contents
        const files = fs.readdirSync(folderPath);
        
        // Filter for image files and sort alphabetically
        const imageFiles = files
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
            .sort();
        
        // Return first image or null if none found
        return imageFiles.length > 0 ? imageFiles[0] : null;
    } catch (error) {
        console.error(`Error finding images in ${folderName}:`, error);
        return null;
    }
}

// API endpoint to fetch products
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Add firstImage to each product
        const productsWithImages = rows.map(product => {
            return {
                ...product,
                firstImage: getFirstImageInFolder(product.image_folder)
            };
        });
        
        res.json(productsWithImages);
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
        
        // Add firstImage to product
        row.firstImage = getFirstImageInFolder(row.image_folder);
        res.json(row);
    });
});

// Endpoint to get the first image from a folder
app.get('/api/products/firstImage/:folder', (req, res) => {
  const folderName = req.params.folder;
  const firstImage = getFirstImageInFolder(folderName);
  
  if (firstImage) {
    res.json({ imagePath: `${folderName}/${firstImage}` });
  } else {
    res.status(404).json({ error: 'No images found' });
  }
});

// New endpoint to get all images from a folder
app.get('/api/products/images/:folder', (req, res) => {
  const folderName = req.params.folder;
  
  try {
    const folderPath = path.join(__dirname, 'pictures', folderName);
    
    // Read directory contents
    const files = fs.readdirSync(folderPath);
    
    // Filter for image files and sort alphabetically
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .sort();
    
    if (imageFiles.length > 0) {
      // Return all image paths
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

// Hinweis: Die Cart-API wurde entfernt, da die Warenkorb-Funktionalität jetzt ausschließlich
// mit localStorage im Client umgesetzt ist.

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