const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure public/images directory exists
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
app.use('/images', express.static(imagesDir));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Hardcoded admin credentials
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'password123';

// Cloudinary config
cloudinary.config({
  cloud_name: 'dr778huli',
  api_key: '272854279151821',
  api_secret: 'VfcDXoVBHL2PI-h_s9A0SbMiUUY',
});

// Postgres config
const pool = new Pool({
  // connectionString: 'postgresql://postgres:NKxneAopCjDiTBmJeFmgTLQATwgNrrNp@postgres.railway.internal:5432/railway',
  connectionString: 'postgresql://postgres:NKxneAopCjDiTBmJeFmgTLQATwgNrrNp@maglev.proxy.rlwy.net:46885/railway',
});

// Helper: ensure products table exists
async function ensureTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price TEXT,
    category TEXT,
    images TEXT[]
  )`);
}
ensureTable();

// Login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get products
app.get('/api/products', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM products ORDER BY id DESC');
  res.json(rows);
});

// Add product (with Cloudinary image upload)
app.post('/api/products', upload.array('images'), async (req, res) => {
  const { name, description, price, category } = req.body;
  let images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, { folder: 'amfahh-products' });
      images.push(result.secure_url);
      fs.unlinkSync(file.path); // Remove local file after upload
    }
  }
  const result = await pool.query(
    'INSERT INTO products (name, description, price, category, images) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, description, price, category || 'uncategorized', images]
  );
  res.json(result.rows[0]);
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  if (!rows.length) return res.status(404).json({ message: 'Product not found' });
  await pool.query('DELETE FROM products WHERE id = $1', [id]);
  res.json({ success: true });
});

// Edit product
app.put('/api/products/:id', upload.array('images'), async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, price, category, removeImages } = req.body;
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  if (!rows.length) return res.status(404).json({ message: 'Product not found' });
  let images = Array.isArray(rows[0].images) ? [...rows[0].images] : [];
  // Remove selected images
  if (removeImages) {
    let toRemove = [];
    try { toRemove = JSON.parse(removeImages); } catch {}
    images = images.filter(img => !toRemove.includes(img));
  }
  // Add new images
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, { folder: 'amfahh-products' });
      images.push(result.secure_url);
      fs.unlinkSync(file.path);
    }
  }
  const result = await pool.query(
    'UPDATE products SET name=$1, description=$2, price=$3, category=$4, images=$5 WHERE id=$6 RETURNING *',
    [name || rows[0].name, description || rows[0].description, price || rows[0].price, category || rows[0].category, images, id]
  );
  res.json(result.rows[0]);
});

// Serve React frontend static files
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  // Catch-all to serve index.html for client-side routing
  app.get('*', (req, res) => {
    // Only serve index.html if the request is not for an API or static asset
    if (!req.path.startsWith('/api') && !req.path.startsWith('/images')) {
      res.sendFile(path.join(buildPath, 'index.html'));
    } else {
      res.status(404).send('Not found');
    }
  });
}

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
}); 