const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.sqlite'));

app.use('/pictures', express.static(path.join(__dirname, '/pictures')));

function getFirstImageInFolder(folderName) {
    try {
        const folderPath = path.join(__dirname, '/pictures', folderName);
        
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


// Add this new endpoint to handle /api/products/byCategory/:categoryId
app.get('/api/products/byCategory/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    
    if (!categoryId || isNaN(parseInt(categoryId))) {
        return res.status(400).json({ error: 'Invalid category ID' });
    }
    
    const sql = `
        SELECT 
            p.id, p.name, p.short_description, p.long_description, p.net_price, p.image_folder,
            c.name AS category_name,
            v.rate_percentage AS vat_percentage
        FROM products p
        JOIN categories c ON p.category_id = c.id
        JOIN vat_rates v ON p.vat_rate_id = v.id
        WHERE p.category_id = ?
    `;
    
    db.all(sql, [parseInt(categoryId)], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const productsWithDetails = rows.map(product => {
            const gross_price = Math.round(product.net_price * (1 + product.vat_percentage / 100) * 100) / 100;
            const imageName = getFirstImageInFolder(product.image_folder);
            return {
                ...product,
                gross_price: gross_price,
                firstImage: imageName ? `http://localhost:3000/pictures/${product.image_folder}/${imageName}` : null
            };
        });
        
        res.json(productsWithDetails);
    });
});

app.get('/api/products/related/:limit', (req, res) => {
    const limit = req.params.limit ? parseInt(req.params.limit) : 4;
    if (isNaN(limit) || limit <= 0) {
        return res.status(400).json({ error: 'Invalid limit parameter' });
    }

    const sql = `
        SELECT 
            p.id, p.name, p.short_description, p.long_description, p.net_price, p.image_folder,
            c.name AS category_name,
            v.rate_percentage AS vat_percentage
        FROM products p
        JOIN categories c ON p.category_id = c.id
        JOIN vat_rates v ON p.vat_rate_id = v.id
        ORDER BY RANDOM()
        LIMIT ?
    `;
    db.all(sql, [limit], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const productsWithDetails = rows.map(product => {
            const gross_price = Math.round(product.net_price * (1 + product.vat_percentage / 100) * 100) / 100;
            const imageName = getFirstImageInFolder(product.image_folder);
            return {
                ...product,
                gross_price: gross_price,
                firstImage: imageName ? `http://localhost:3000/pictures/${product.image_folder}/${imageName}` : null
            };
        });
        
        res.json(productsWithDetails);
    });
});

app.get('/api/categories', (req, res) => {
    db.all('SELECT id, name FROM categories', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const sql = `
        SELECT 
            p.id, p.name, p.short_description, p.long_description, p.net_price, p.image_folder,
            c.name AS category_name,
            v.rate_percentage AS vat_percentage
        FROM products p
        JOIN categories c ON p.category_id = c.id
        JOIN vat_rates v ON p.vat_rate_id = v.id
        WHERE p.id = ?
    `;
    db.get(sql, [productId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Produkt nicht gefunden' });
            return;
        }
        
        const gross_price = Math.round(row.net_price * (1 + row.vat_percentage / 100) * 100) / 100;
        const imageName = getFirstImageInFolder(row.image_folder);
        const productWithDetails = {
            ...row,
            gross_price: gross_price,
            firstImage: imageName ? `http://localhost:3000/pictures/${row.image_folder}/${imageName}` : null
        };
        res.json(productWithDetails);
    });
});

app.get('/api/products/firstImage/:folder', (req, res) => {
  const folderName = req.params.folder;
  const imageName = getFirstImageInFolder(folderName);
  
  if (imageName) {
    res.json({ imagePath: `../backend/pictures/${folderName}/${imageName}` });
  } else {
    res.status(404).json({ error: 'No images found' });
  }
});

// Add this endpoint to handle /api/products without category filter
app.get('/api/products', (req, res) => {
    const sql = `
        SELECT 
            p.id, p.name, p.short_description, p.long_description, p.net_price, p.image_folder,
            c.name AS category_name,
            v.rate_percentage AS vat_percentage
        FROM products p
        JOIN categories c ON p.category_id = c.id
        JOIN vat_rates v ON p.vat_rate_id = v.id
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const productsWithDetails = rows.map(product => {
            const gross_price = Math.round(product.net_price * (1 + product.vat_percentage / 100) * 100) / 100;
            const imageName = getFirstImageInFolder(product.image_folder);
            return {
                ...product,
                gross_price: gross_price,
                firstImage: imageName ? `http://localhost:3000/pictures/${product.image_folder}/${imageName}` : null
            };
        });
        
        res.json(productsWithDetails);
    });
});

// Fix the product images endpoint
app.get('/api/products/images/:folder', (req, res) => {
  const folderName = req.params.folder;
  
  try {
    const folderPath = path.join(__dirname, '../backend/pictures', folderName);
    
    const files = fs.readdirSync(folderPath);
    
    const imageFiles = files
      .filter(file => /\.(jpg|png)$/i.test(file))
      .sort();
    
    if (imageFiles.length > 0) {
      const imagePaths = imageFiles.map(file => `http://localhost:3000/pictures/${folderName}/${file}`);
      res.json({ images: imagePaths });
    } else {
      res.status(404).json({ error: 'No images found' });
    }
  } catch (error) {
    console.error(`Error finding images in ${folderName}:`, error);
    res.status(500).json({ error: 'Error accessing image folder' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});