import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = '';

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

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const carouselRef = useRef(null);
  // For thumbnail slider
  const [thumbIndex, setThumbIndex] = useState(0);
  const thumbsPerView = 5;
  const thumbTotalSlides = product && product.images ? Math.ceil(product.images.length / thumbsPerView) : 1;
  const handleThumbPrev = () => setThumbIndex(idx => Math.max(0, idx - 1));
  const handleThumbNext = () => setThumbIndex(idx => Math.min(thumbTotalSlides - 1, idx + 1));

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

  // Sync carousel when selectedImage changes
  useEffect(() => {
    if (!carouselRef.current || !product || !product.images) return;
    const idx = product.images.findIndex(img => img === selectedImage);
    if (window.bootstrap && carouselRef.current && idx !== -1) {
      const carousel = window.bootstrap.Carousel.getOrCreateInstance(carouselRef.current);
      carousel.to(idx);
    }
  }, [selectedImage, product]);

  // Listen for carousel slide event to update selectedImage
  useEffect(() => {
    if (!carouselRef.current || !product || !product.images) return;
    const handleSlide = (e) => {
      const idx = Array.from(carouselRef.current.querySelectorAll('.carousel-item')).findIndex(item => item.classList.contains('active'));
      if (idx !== -1 && product.images[idx] !== selectedImage) {
        setSelectedImage(product.images[idx]);
      }
    };
    carouselRef.current.addEventListener('slid.bs.carousel', handleSlide);
    return () => {
      carouselRef.current.removeEventListener('slid.bs.carousel', handleSlide);
    };
  }, [product, selectedImage]);

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
        <div className="col-md-6 text-center mb-4 mb-md-0">
          {/* Bootstrap Carousel for images */}
          {product.images.length > 0 ? (
            <div id="productDetailCarousel" className="carousel slide mb-3" data-bs-ride="carousel" ref={carouselRef}>
              <div className="carousel-inner">
                {product.images.map((img, idx) => (
                  <div className={`carousel-item${selectedImage === img ? ' active' : ''}`} key={idx}>
                    <img
                      src={getImageUrl(img)}
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
                    <span className="carousel-control-prev-icon" aria-hidden="true" style={{ backgroundColor: '#007bff', borderRadius: '50%' }}></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#productDetailCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" style={{ backgroundColor: '#007bff', borderRadius: '50%' }}></span>
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
          <div className="d-flex justify-content-center align-items-center mt-3 position-relative" style={{minHeight: '70px'}}>
            {product.images.length > thumbsPerView && (
              <button className="btn btn-sm btn-outline-primary me-2" onClick={handleThumbPrev} disabled={thumbIndex === 0}>&lt;</button>
            )}
            {product.images.slice(thumbIndex * thumbsPerView, (thumbIndex + 1) * thumbsPerView).map((img, index) => (
              <img
                key={index}
                src={getImageUrl(img)}
                className={`img-thumbnail mx-1 ${selectedImage === img ? 'border border-success border-3' : ''}`}
                alt={`Thumbnail ${index + 1}`}
                style={{ width: '60px', cursor: 'pointer' }}
                onClick={() => setSelectedImage(img)}
              />
            ))}
            {product.images.length > thumbsPerView && (
              <button className="btn btn-sm btn-outline-primary ms-2" onClick={handleThumbNext} disabled={thumbIndex === thumbTotalSlides - 1}>&gt;</button>
            )}
          </div>
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2 className="mb-3">{product.name}</h2>
          <p className="text-muted mb-2"><strong>Category:</strong> {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1).toLowerCase() : 'Uncategorized'}</p>
          <div className="mb-4" style={{minHeight: '60px'}}>{product.description}</div>
          <div className="d-flex gap-2 mt-2 flex-wrap">
            <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>Add to Cart</button>
            <button className="btn btn-success btn-lg" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>
      {/* Related Products Carousel (multi-item) */}
      {suggestedProducts.length > 0 && (
        <div className="mt-5" data-aos="fade-up" style={{ minHeight: 320 }}>
          <h3>Related Products</h3>
          <div id="relatedProductsCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {suggestedProducts.map((suggestedProduct, idx) => (
                <div className={`carousel-item${idx === 0 ? ' active' : ''}`} key={suggestedProduct.id}>
                  <div className="d-flex flex-row justify-content-center gap-3">
                    {suggestedProducts.slice(idx, idx + 4).map((prod, i) => (
                      <div className="card shadow-sm mx-2 d-flex align-items-stretch" style={{ maxWidth: 200, minWidth: 200, minHeight: 260, height: 260 }} key={prod.id}>
                        <img
                          src={getImageUrl(Array.isArray(prod.images) ? prod.images[0] : prod.image)}
                          className="card-img-top"
                          alt={prod.name}
                          style={{ height: '120px', objectFit: 'cover' }}
                        />
                        <div className="card-body text-center d-flex flex-column justify-content-between" style={{ height: 100 }}>
                          <h6 className="card-title" style={{ minHeight: 40, maxHeight: 40, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={prod.name}>
                            {prod.name}
                          </h6>
                          <div className="text-muted" style={{ fontSize: 13, minHeight: 18 }}>
                            {prod.category ? prod.category.charAt(0).toUpperCase() + prod.category.slice(1).toLowerCase() : 'Uncategorized'}
                          </div>
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
                  <span className="carousel-control-prev-icon" aria-hidden="true" style={{ backgroundColor: '#007bff', borderRadius: '50%' }}></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#relatedProductsCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true" style={{ backgroundColor: '#007bff', borderRadius: '50%' }}></span>
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