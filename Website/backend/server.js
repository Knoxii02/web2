const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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

// POST /api/orders - Create a new order
app.post('/api/orders', (req, res) => {
    const { customerDetails, paymentMethod, cartItems, totals } = req.body;

    // Basic validation (can be expanded)
    if (!customerDetails || !paymentMethod || !cartItems || cartItems.length === 0 || !totals) {
        return res.status(400).json({ error: 'Missing required order data.' });
    }

    const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.sqlite')); // Local DB connection for this endpoint

    const generateOrderNumber = () => {
        // Simple order number generation, e.g., ELF-YYYYMMDD-HHMMSS-RANDOM
        const d = new Date();
        const datePart = `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}`;
        const timePart = `${d.getHours().toString().padStart(2, '0')}${d.getMinutes().toString().padStart(2, '0')}${d.getSeconds().toString().padStart(2, '0')}`;
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ELF-${datePart}-${timePart}-${randomPart}`;
    };

    const orderNumber = generateOrderNumber();
    const orderDate = new Date().toISOString();

    // Start a database transaction
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        const orderSql = `
            INSERT INTO orders (
                order_number, customer_name, customer_email,
                address_street, address_zip, address_city, address_country,
                payment_method, total_net_amount, total_gross_amount, shipping_costs, order_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const orderParams = [
            orderNumber,
            customerDetails.firstName + ' ' + customerDetails.lastName,
            customerDetails.email,
            customerDetails.address,
            customerDetails.zip,
            customerDetails.city,
            customerDetails.country,
            paymentMethod,
            totals.subtotal_net,
            totals.final_total, // This should be the grand total including shipping and all VAT
            totals.shippingCost,
            orderDate
        ];

        db.run(orderSql, orderParams, function(err) {
            if (err) {
                db.run('ROLLBACK', () => {
                    db.close(); // Close DB after rollback
                });
                console.error('Error inserting order:', err.message);
                return res.status(500).json({ error: 'Failed to create order.', details: err.message });
            }

            const orderId = this.lastID; // Get the ID of the inserted order

            const itemSql = `
                INSERT INTO order_items (
                    order_id, product_id, quantity,
                    net_price_at_purchase, vat_percentage_at_purchase, gross_price_at_purchase
                ) VALUES (?, ?, ?, ?, ?, ?)
            `;

            let itemsProcessed = 0;
            let itemInsertionError = null;

            cartItems.forEach(item => {
                if (res.headersSent || itemInsertionError) return; // Stop processing if response already sent or error occurred

                const productGrossPrice = item.net_price * (1 + item.vat_percentage / 100);
                db.run(itemSql, [
                    orderId,
                    item.productId,
                    item.quantity,
                    item.net_price,
                    item.vat_percentage,
                    productGrossPrice
                ], function(itemErr) {
                    if (itemErr && !itemInsertionError) {
                        itemInsertionError = itemErr; // Capture first error
                        db.run('ROLLBACK', () => {
                            db.close(); // Close DB after rollback
                        });
                        console.error('Error inserting order item:', itemErr.message);
                        if (!res.headersSent) {
                            res.status(500).json({ error: 'Failed to create order item.', details: itemErr.message });
                        }
                        return;
                    }

                    if (itemInsertionError) return; // Don't proceed if an error has occurred

                    itemsProcessed++;
                    if (itemsProcessed === cartItems.length) {
                        // All items inserted successfully
                        db.run('COMMIT', (commitErr) => {
                            db.close(); // Close DB after commit or commit error
                            if (commitErr) {
                                console.error('Error committing transaction:', commitErr.message);
                                if (!res.headersSent) {
                                     // Attempt rollback if commit fails, though it might not be possible
                                    db.run('ROLLBACK'); // Best effort
                                    res.status(500).json({ error: 'Failed to finalize order.', details: commitErr.message });
                                }
                                return;
                            }
                            if (!res.headersSent) {
                                res.status(201).json({
                                    message: 'Order created successfully',
                                    orderNumber: orderNumber,
                                    orderId: orderId
                                });
                            }
                        });
                    }
                });
            });
             // Handle case where cartItems is empty after validation (should not happen due to initial check)
            if (cartItems.length === 0 && !res.headersSent) {
                 db.run('COMMIT', () => db.close()); // Or ROLLBACK if an empty order is invalid
                 res.status(201).json({
                    message: 'Order created successfully (no items)', // Or appropriate response
                    orderNumber: orderNumber,
                    orderId: orderId // orderId would be set if orderSql ran
                });
            }
        });
    });
});

// GET /api/orders/:order_number - Fetch order details
app.get('/api/orders/:order_number', (req, res) => {
    const orderNumber = req.params.order_number;
    const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.sqlite')); // Local DB connection

    const orderSql = `SELECT * FROM orders WHERE order_number = ?`;
    db.get(orderSql, [orderNumber], (err, orderRow) => {
        if (err) {
            db.close();
            return res.status(500).json({ error: 'Database error fetching order.', details: err.message });
        }
        if (!orderRow) {
            db.close();
            return res.status(404).json({ error: 'Order not found.' });
        }

        const itemsSql = `
            SELECT oi.*, p.name as product_name, p.image_folder
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `;
        db.all(itemsSql, [orderRow.id], (itemErr, itemRows) => {
            db.close(); // Close DB after fetching items or if an error occurs
            if (itemErr) {
                return res.status(500).json({ error: 'Database error fetching order items.', details: itemErr.message });
            }

            const itemsWithImages = itemRows.map(item => {
                const imageName = getFirstImageInFolder(item.image_folder);
                return {
                    ...item,
                    firstImage: imageName ? `../frontend/pictures/${item.image_folder}/${imageName}` : null
                };
            });

            res.json({ ...orderRow, items: itemsWithImages });
        });
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});