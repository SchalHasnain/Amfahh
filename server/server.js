const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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

// Helper to read/write products.json
const productsPath = path.join(__dirname, '../public/products.json');
function readProducts() {
  if (!fs.existsSync(productsPath)) return [];
  return JSON.parse(fs.readFileSync(productsPath, 'utf8'));
}
function writeProducts(products) {
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
}

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
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Add product (with image upload)
app.post('/api/products', upload.array('images'), (req, res) => {
  const { name, description, price, category } = req.body;
  const images = req.files ? req.files.map(f => `/images/${f.filename}`) : [];
  const products = readProducts();
  const newProduct = {
    id: Date.now(),
    name,
    description,
    price,
    category: category || 'uncategorized',
    images
  };
  products.push(newProduct);
  writeProducts(products);
  res.json(newProduct);
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let products = readProducts();
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  products = products.filter(p => p.id !== id);
  writeProducts(products);
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach(imgPath => {
      const fullPath = path.join(__dirname, '../public', imgPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });
  }
  res.json({ success: true });
});

// Edit product
app.put('/api/products/:id', upload.array('images'), (req, res) => {
  const id = parseInt(req.params.id);
  let products = readProducts();
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });
  const product = products[productIndex];

  // Parse fields
  const { name, description, price, category, removeImages } = req.body;
  let images = Array.isArray(product.images) ? [...product.images] : [];

  // Remove selected images
  if (removeImages) {
    let toRemove = [];
    try {
      toRemove = JSON.parse(removeImages);
    } catch {}
    images = images.filter(img => !toRemove.includes(img));
    // Delete files from disk
    toRemove.forEach(imgPath => {
      const fullPath = path.join(__dirname, '../public', imgPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });
  }

  // Add new images
  if (req.files && req.files.length > 0) {
    images = images.concat(req.files.map(f => `/images/${f.filename}`));
  }

  // Update product
  products[productIndex] = {
    ...product,
    name: name || product.name,
    description: description || product.description,
    price: price || product.price,
    category: category || product.category,
    images
  };
  writeProducts(products);
  res.json(products[productIndex]);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
}); 