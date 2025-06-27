import React from 'react';

const QuickViewModal = ({ show, onHide, product }) => {
  if (!show || !product) return null;
  const images = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []);

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product.name}</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                {images.length > 0 ? (
                  <div id="quickViewCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      {images.map((img, idx) => (
                        <div className={`carousel-item${idx === 0 ? ' active' : ''}`} key={idx}>
                          <img src={img} className="d-block w-100 rounded" alt="Product" style={{ maxHeight: 300, objectFit: 'contain' }} />
                        </div>
                      ))}
                    </div>
                    {images.length > 1 && (
                      <>
                        <button className="carousel-control-prev" type="button" data-bs-target="#quickViewCarousel" data-bs-slide="prev">
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#quickViewCarousel" data-bs-slide="next">
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
              </div>
              <div className="col-md-6">
                <h4>{product.name}</h4>
                <p className="text-muted">{product.category}</p>
                <p>{product.description}</p>
                <button className="btn btn-primary me-2">Add to Cart</button>
                <button className="btn btn-success">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal; 