import React from 'react';

const API_BASE = 'http://localhost:5000';

const addToCartHelper = (product, quantity = 1) => {
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  } catch {}
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
};

const getImageUrl = (img) => img && img.startsWith('/images/') ? API_BASE + img : img;

const Product = ({ product }) => {
  // Defensive: get the first image from images array or fallback to image string or a placeholder
  let imageSrc = '';
  if (Array.isArray(product.images) && product.images.length > 0) imageSrc = getImageUrl(product.images[0]);
  else if (product.image) imageSrc = getImageUrl(product.image);
  else imageSrc = '/images/placeholder.png'; // You can add a placeholder image in public/images

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCartHelper(product);
    // Show toast
    window.dispatchEvent(new CustomEvent('cartToast', { detail: 'Added to cart!' }));
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    addToCartHelper(product);
    // Show cart modal
    const cartModal = window.bootstrap && window.bootstrap.Modal.getOrCreateInstance(document.getElementById('cartModal'));
    if (cartModal) cartModal.show();
    window.dispatchEvent(new CustomEvent('cartToast', { detail: 'Added to cart!' }));
  };

  return (
    <div className="card h-100 shadow-sm">
      <img
        src={imageSrc}
        className="card-img-top"
        alt={product.name}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <button
          className="btn btn-primary me-2"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
        <button className="btn btn-success" onClick={handleBuyNow}>Buy Now</button>
      </div>
    </div>
  );
};

export default Product;