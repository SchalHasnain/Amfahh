import React, { useEffect, useState } from 'react';
import CheckoutModal from './CheckoutModal';

const getCartFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const CartModal = () => {
  const [cart, setCart] = useState(getCartFromStorage());
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const handler = () => setCart(getCartFromStorage());
    window.addEventListener('cartUpdated', handler);
    return () => window.removeEventListener('cartUpdated', handler);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    saveCartToStorage(newCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemove = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    updateCart(newCart);
    setToastMsg('Removed from cart');
    setShowToast(true);
  };

  const handleQuantity = (id, delta) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    updateCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckoutClose = () => {
    setShowCheckout(false);
    setToastMsg('Order placed successfully!');
    setShowToast(true);
    // Optionally close cart modal
    const cartModal = window.bootstrap && window.bootstrap.Modal.getOrCreateInstance(document.getElementById('cartModal'));
    if (cartModal) cartModal.hide();
  };

  return (
    <>
      <div className="modal fade" id="cartModal" tabIndex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="cartModalLabel">Your Cart</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {cart.length === 0 ? (
                <p className="text-center">Your cart is empty</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th></th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map(item => (
                        <tr key={item.id}>
                          <td style={{ width: 80 }}>
                            <img src={Array.isArray(item.images) ? item.images[0] : item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                          </td>
                          <td>{item.name}</td>
                          <td>${item.price}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantity(item.id, -1)}>-</button>
                              <span>{item.quantity}</span>
                              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantity(item.id, 1)}>+</button>
                            </div>
                          </td>
                          <td>${(item.price * item.quantity).toFixed(2)}</td>
                          <td>
                            <button className="btn btn-sm btn-danger" onClick={() => handleRemove(item.id)}>&times;</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-3 text-end">
                <h5>Total: <span className="text-primary">${total.toFixed(2)}</span></h5>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Continue Shopping
              </button>
              <button type="button" className="btn btn-primary" id="checkout-btn" disabled={cart.length === 0} onClick={() => setShowCheckout(true)}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <CheckoutModal show={showCheckout} onHide={handleCheckoutClose} />
      {/* Toast Notification */}
      <div className={`toast position-fixed bottom-0 end-0 m-3${showToast ? ' show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true" style={{ zIndex: 9999 }}>
        <div className="toast-header">
          <strong className="me-auto">Cart</strong>
          <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
        </div>
        <div className="toast-body">{toastMsg}</div>
      </div>
    </>
  );
};

export default CartModal;