import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = 'https://amfah-server-production.up.railway.app';

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

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        const selectedProduct = data.find((p) => p.id === parseInt(id));
        if (!selectedProduct) {
          throw new Error('Product not found');
        }
        let imagesArr = [];
        if (Array.isArray(selectedProduct.images)) imagesArr = selectedProduct.images;
        else if (selectedProduct.image) imagesArr = [selectedProduct.image];
        setProduct({ ...selectedProduct, images: imagesArr });
        setSelectedImage(imagesArr[0] || '');
        const sameCategoryProducts = data.filter(
          (p) => (p.category || 'uncategorized') === (selectedProduct.category || 'uncategorized') && p.id !== selectedProduct.id
        );
        setSuggestedProducts(sameCategoryProducts.sort(() => 0.5 - Math.random()).slice(0, 8));
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!product) return;
    addToCartHelper(product);
    window.dispatchEvent(new CustomEvent('cartToast', { detail: 'Added to cart!' }));
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (!product) return;
    addToCartHelper(product);
    const cartModal = window.bootstrap && window.bootstrap.Modal.getOrCreateInstance(document.getElementById('cartModal'));
    if (cartModal) cartModal.show();
    window.dispatchEvent(new CustomEvent('cartToast', { detail: 'Added to cart!' }));
  };

  if (loading) return <div className="text-center my-5">Loading product details...</div>;
  if (error) return <div className="text-center my-5 text-danger">Error: {error}</div>;

  return (
    <div className="container my-4">
      <div className="row" data-aos="fade-up">
        <div className="col-md-6 text-center">
          {/* Bootstrap Carousel for images */}
          {product.images.length > 0 ? (
            <div id="productDetailCarousel" className="carousel slide mb-3" data-bs-ride="carousel">
              <div className="carousel-inner">
                {product.images.map((img, idx) => (
                  <div className={`carousel-item${selectedImage === img ? ' active' : ''}`} key={idx}>
                    <img
                      src={img}
                      className="d-block w-100 rounded shadow border border-primary"
                      alt={product.name}
                      style={{ maxHeight: '400px', objectFit: 'contain' }}
                    />
                  </div>
                ))}
              </div>
              {product.images.length > 1 && (
                <>
                  <button className="carousel-control-prev" type="button" data-bs-target="#productDetailCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#productDetailCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 300 }}>
              <span>No Image</span>
            </div>
          )}
          {/* Thumbnails */}
          <div className="d-flex justify-content-center mt-3">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                className={`img-thumbnail mx-1 ${selectedImage === img ? 'border border-success border-3' : ''}`}
                alt={`Thumbnail ${index + 1}`}
                style={{ width: '60px', cursor: 'pointer' }}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">{product.name}</h2>
          <p className="text-muted">{product.category}</p>
          <h4 className="text-primary mb-3">${product.price}</h4>
          <p>{product.description}</p>
          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>Add to Cart</button>
            <button className="btn btn-success btn-lg" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>
      {/* Related Products Carousel (multi-item) */}
      {suggestedProducts.length > 0 && (
        <div className="mt-5" data-aos="fade-up">
          <h3>Related Products</h3>
          <div id="relatedProductsCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {suggestedProducts.map((suggestedProduct, idx) => (
                <div className={`carousel-item${idx === 0 ? ' active' : ''}`} key={suggestedProduct.id}>
                  <div className="d-flex flex-row justify-content-center gap-3">
                    {suggestedProducts.slice(idx, idx + 4).map((prod, i) => (
                      <div className="card shadow-sm mx-2" style={{ maxWidth: 200 }} key={prod.id}>
                        <img
                          src={Array.isArray(prod.images) ? prod.images[0] : prod.image}
                          className="card-img-top"
                          alt={prod.name}
                          style={{ height: '120px', objectFit: 'cover' }}
                        />
                        <div className="card-body text-center">
                          <h6 className="card-title">{prod.name}</h6>
                          <Link to={`/product/${prod.id}`} className="btn btn-outline-primary btn-sm mt-2">View</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {suggestedProducts.length > 4 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#relatedProductsCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#relatedProductsCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;