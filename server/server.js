const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
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

// Remove nodemailer config from .env, use DB instead
let transporter = null;

// Helper to get latest SMTP credentials from DB
async function getSmtpConfig() {
  const { rows } = await pool.query('SELECT * FROM smtp_credentials ORDER BY id DESC LIMIT 1');
  if (!rows.length) throw new Error('No SMTP credentials configured');
  const cred = rows[0];
  return {
    host: cred.host,
    port: cred.port,
    secure: cred.port === 465,
    auth: {
      user: cred.smtp_user,
      pass: cred.pass,
    },
    from: cred.from_email
  };
}

// SMTP credentials endpoints
app.get('/api/smtp-credentials', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM smtp_credentials ORDER BY id DESC');
  res.json(rows);
});
app.post('/api/smtp-credentials', async (req, res) => {
  const { host, port, smtp_user, pass, from_email } = req.body;
  if (!host || !port || !smtp_user || !pass || !from_email) return res.status(400).json({ error: 'All fields required' });
  try {
    const result = await pool.query('INSERT INTO smtp_credentials (host, port, smtp_user, pass, from_email) VALUES ($1, $2, $3, $4, $5) RETURNING *', [host, port, smtp_user, pass, from_email]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete('/api/smtp-credentials/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM smtp_credentials WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
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
  // Create categories table if not exists
  await pool.query(`CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_order INTEGER NOT NULL DEFAULT 0
  )`);
  // Create feedback table if not exists
  await pool.query(`CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    show_on_home BOOLEAN DEFAULT FALSE
  )`);
  // Create system_emails table if not exists
  await pool.query(`CREATE TABLE IF NOT EXISTS system_emails (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS smtp_credentials (
    id SERIAL PRIMARY KEY,
    host TEXT NOT NULL,
    port INTEGER NOT NULL,
    smtp_user TEXT NOT NULL,
    pass TEXT NOT NULL,
    from_email TEXT NOT NULL
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS footer_details (
    id SERIAL PRIMARY KEY,
    about_text TEXT,
    email TEXT,
    facebook TEXT,
    instagram TEXT,
    linkedin TEXT
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

// Category endpoints
// Get all categories (ordered)
app.get('/api/categories', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM categories ORDER BY display_order ASC, id ASC');
  res.json(rows);
});
// Add a new category
app.post('/api/categories', async (req, res) => {
  const { name, display_order } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (name, display_order) VALUES ($1, $2) RETURNING *',
      [name, display_order || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Update a category (name or order)
app.put('/api/categories/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, display_order } = req.body;
  try {
    const result = await pool.query(
      'UPDATE categories SET name = COALESCE($1, name), display_order = COALESCE($2, display_order) WHERE id = $3 RETURNING *',
      [name, display_order, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Reorder categories (admin only)
app.post('/api/categories/reorder', async (req, res) => {
  const { order } = req.body; // order: [{id, display_order}, ...]
  try {
    for (const cat of order) {
      await pool.query('UPDATE categories SET display_order = $1 WHERE id = $2', [cat.display_order, cat.id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Feedback endpoints
// Submit feedback
app.post('/api/feedback', async (req, res) => {
  const { name, comment, rating } = req.body;
  if (!name || !comment || !rating) return res.status(400).json({ error: 'All fields required' });
  try {
    const result = await pool.query(
      'INSERT INTO feedback (name, comment, rating) VALUES ($1, $2, $3) RETURNING *',
      [name, comment, rating]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Get all feedback
app.get('/api/feedback', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
  res.json(rows);
});
// Update feedback (admin can set show_on_home)
app.put('/api/feedback/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { show_on_home } = req.body;
  try {
    const result = await pool.query(
      'UPDATE feedback SET show_on_home = $1 WHERE id = $2 RETURNING *',
      [show_on_home, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// System emails endpoints
app.get('/api/system-emails', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM system_emails ORDER BY id ASC');
  res.json(rows);
});
app.post('/api/system-emails', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const result = await pool.query('INSERT INTO system_emails (email) VALUES ($1) RETURNING *', [email]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete('/api/system-emails/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM system_emails WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Send order email endpoint
app.post('/api/order', async (req, res) => {
  const { name, contact, email, items } = req.body;
  if (!name || !contact || !email || !items) return res.status(400).json({ error: 'All fields required' });
  try {
    const smtp = await getSmtpConfig();
    const { rows } = await pool.query('SELECT email FROM system_emails');
    if (!rows.length) return res.status(500).json({ error: 'No system emails configured' });
    const toEmails = rows.map(r => r.email).join(',');
    const now = new Date();
    const subject = `New order - ${now.toLocaleString()}`;
    const itemList = items.map(item => `${item.name} x${item.quantity}`).join(', ');
    const body = `Customer Name: ${name}\nContact: ${contact}\nEmail: ${email}\nOrder: ${itemList}`;
    const mailer = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: smtp.auth
    });
    await mailer.sendMail({
      from: smtp.from,
      to: toEmails,
      subject,
      text: body,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send contact email endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'All fields required' });
  try {
    const smtp = await getSmtpConfig();
    const { rows } = await pool.query('SELECT email FROM system_emails');
    if (!rows.length) return res.status(500).json({ error: 'No system emails configured' });
    const toEmails = rows.map(r => r.email).join(',');
    const now = new Date();
    const subject = `Contact Form - ${now.toLocaleString()}`;
    const body = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
    const mailer = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: smtp.auth
    });
    await mailer.sendMail({
      from: smtp.from,
      to: toEmails,
      subject,
      text: body,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Footer details endpoints
app.get('/api/footer-details', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM footer_details ORDER BY id DESC LIMIT 1');
  res.json(rows[0] || {});
});
app.post('/api/footer-details', async (req, res) => {
  const { about_text, email, facebook, instagram, linkedin } = req.body;
  // Only one row allowed, so upsert
  const { rows } = await pool.query('SELECT id FROM footer_details ORDER BY id DESC LIMIT 1');
  if (rows.length) {
    // Update
    const id = rows[0].id;
    const result = await pool.query(
      'UPDATE footer_details SET about_text=$1, email=$2, facebook=$3, instagram=$4, linkedin=$5 WHERE id=$6 RETURNING *',
      [about_text, email, facebook, instagram, linkedin, id]
    );
    res.json(result.rows[0]);
  } else {
    // Insert
    const result = await pool.query(
      'INSERT INTO footer_details (about_text, email, facebook, instagram, linkedin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [about_text, email, facebook, instagram, linkedin]
    );
    res.json(result.rows[0]);
  }
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