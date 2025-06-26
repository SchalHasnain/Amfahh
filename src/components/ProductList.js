import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Product from './Product';
import QuickViewModal from './QuickViewModal';

const API_BASE = 'http://localhost:5000';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        const validProducts = data.filter(product => product.name && (Array.isArray(product.images) ? product.images.length : !!product.image));
        setProducts(validProducts);
        setFilteredProducts(validProducts);
        const uniqueCategories = [...new Set(validProducts.map((product) => product.category || 'uncategorized'))];
        setCategories(['all', ...uniqueCategories]);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = products;
    if (activeCategory !== 'all') {
      filtered = filtered.filter((product) => (product.category || 'uncategorized') === activeCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [activeCategory, searchQuery, products]);

  const addToCart = (product) => {
    console.log('Added to cart:', product);
  };

  if (loading) {
    return <div className="text-center my-5">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center my-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container">
      {/* Category Tabs */}
      <ul className="nav nav-tabs mb-4" data-aos="fade-up">
        {categories.map((category) => (
          <li className="nav-item" key={category}>
            <button
              className={`nav-link ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* Search Bar */}
      <div className="mb-4" data-aos="fade-up">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="row g-4">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="position-relative h-100">
              <Link
                to={`/product/${product.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Product product={product} addToCart={() => {}} />
              </Link>
              <button
                className="btn btn-outline-primary quick-view-btn position-absolute top-0 end-0 m-2"
                style={{ zIndex: 2, borderRadius: '50%' }}
                onClick={(e) => {
                  e.preventDefault();
                  setQuickViewProduct(product);
                  setShowQuickView(true);
                }}
                title="Quick View"
              >
                <i className="fa fa-eye"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      <QuickViewModal
        show={showQuickView}
        onHide={() => setShowQuickView(false)}
        product={quickViewProduct}
      />
    </div>
  );
};

export default ProductList;