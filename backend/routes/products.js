// backend/routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

/* =========================================================
   1. GET ALL PRODUCTS
   ========================================================= */
router.get('/', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* =========================================================
   2. SEARCH PRODUCTS
   ========================================================= */
router.get('/search', (req, res) => {
  const name = `%${req.query.name || ''}%`;
  db.all("SELECT * FROM products WHERE name LIKE ?", [name], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* =========================================================
   3. CREATE NEW PRODUCT (POST /api/products)
   ========================================================= */
router.post('/', (req, res) => {
  const { name, unit, category, brand, stock = 0, status = '', image = '' } = req.body;

  if (!name || name.toString().trim() === '') {
    return res.status(400).json({ error: "Name is required" });
  }

  db.run(
    `INSERT INTO products (name, unit, category, brand, stock, status, image)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, unit, category, brand, stock, status, image],
    function (err) {
      if (err) {
        // If unique constraint fails (duplicate name), return 400
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Product added successfully",
        id: this.lastID
      });
    }
  );
});

/* =========================================================
   4. UPDATE PRODUCT (INLINE EDITING)
   ========================================================= */
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { name, unit, category, brand, stock = 0, status = '', image = '' } = req.body;

  db.get("SELECT * FROM products WHERE id = ?", [id], (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ error: "Product not found" });

    const oldStock = Number(product.stock || 0);
    const newStock = Number(stock || 0);

    db.run(
      `UPDATE products SET name=?, unit=?, category=?, brand=?, stock=?, status=?, image=? WHERE id=?`,
      [name, unit, category, brand, newStock, status, image, id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Log inventory change when stock differs
        if (oldStock !== newStock) {
          db.run(
            `INSERT INTO inventory_logs (productId, oldStock, newStock, changedBy, timestamp)
             VALUES (?, ?, ?, ?, ?)`,
            [id, oldStock, newStock, req.body.changedBy || "admin", new Date().toISOString()],
            (logErr) => {
              if (logErr) console.error("Failed to insert inventory log:", logErr);
              // return updated product
              db.get("SELECT * FROM products WHERE id = ?", [id], (err2, updated) => {
                if (err2) return res.status(500).json({ error: err2.message });
                res.json(updated);
              });
            }
          );
        } else {
          db.get("SELECT * FROM products WHERE id = ?", [id], (err2, updated) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json(updated);
          });
        }
      }
    );
  });
});

/* =========================================================
   5. DELETE PRODUCT
   ========================================================= */
router.delete('/:id', (req, res) => {
  db.run("DELETE FROM products WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  });
});

/* =========================================================
   6. IMPORT CSV
   ========================================================= */
router.post('/import', upload.single('csvFile'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const rows = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => rows.push(data))
    .on('end', () => {
      // process rows sequentially is safer; simple insert/ignore for assignment
      rows.forEach((item) => {
        // Normalize fields
        const name = (item.name || '').trim();
        const unit = item.unit || '';
        const category = item.category || '';
        const brand = item.brand || '';
        const stock = Number(item.stock || 0);
        const status = item.status || '';
        const image = item.image || '';

        if (!name) return;

        // Insert if not exists (INSERT OR IGNORE)
        db.run(
          `INSERT OR IGNORE INTO products (name, unit, category, brand, stock, status, image)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [name, unit, category, brand, stock, status, image]
        );
      });

      // Remove temp file
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }

      res.json({ message: "CSV Imported Successfully" });
    })
    .on('error', (err) => {
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
      res.status(500).json({ error: "Failed to parse CSV" });
    });
});

/* =========================================================
   7. EXPORT CSV
   ========================================================= */
router.get('/export', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const headers = ['id','name','unit','category','brand','stock','status','image'];
    const lines = [headers.join(',')];
    rows.forEach(r => {
      const vals = headers.map(h => {
        const v = r[h] == null ? '' : String(r[h]).replace(/"/g, '""');
        return `"${v}"`;
      });
      lines.push(vals.join(','));
    });
    const csv = lines.join('\n');

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");
    res.send(csv);
  });
});

/* =========================================================
   8. PRODUCT HISTORY
   ========================================================= */
router.get('/:id/history', (req, res) => {
  db.all("SELECT * FROM inventory_logs WHERE productId = ? ORDER BY timestamp DESC", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
