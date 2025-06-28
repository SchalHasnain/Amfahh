import React, { useEffect, useState } from 'react';

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

const clearCart = () => {
  localStorage.removeItem('cart');
  window.dispatchEvent(new Event('cartUpdated'));
};

const CartModal = () => {
  const [cart, setCart] = useState(getCartFromStorage());
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

  const handleBuyNow = async (e) => {
    e.preventDefault();
    if (!name || !contact || !email) {
      setError('Please fill all fields.');
      return;
    }
    setSending(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          email,
          items: cart
        })
      });
      if (!res.ok) throw new Error('Failed to send order');
      clearCart();
      setSuccess(true);
      setToastMsg('Order placed successfully! Our team will contact you soon.');
      setShowToast(true);
      setName('');
      setContact('');
      setEmail('');
    } catch (err) {
      setError('Failed to send order. Please try again.');
    }
    setSending(false);
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
              <div className="alert alert-info text-center mb-3">
                Our team will get back to you on your order details and then your order can get confirmed.
              </div>
              {success && (
                <div className="alert alert-success text-center">Order placed successfully! Our team will contact you soon.</div>
              )}
              {cart.length === 0 ? (
                <p className="text-center">Your cart is empty</p>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th></th>
                          <th>Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map(item => (
                          <tr key={item.id}>
                            <td style={{ width: 80 }}>
                              <img src={Array.isArray(item.images) ? item.images[0] : item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                            </td>
                            <td>{item.name}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantity(item.id, -1)}>-</button>
                                <span>{item.quantity}</span>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantity(item.id, 1)}>+</button>
                              </div>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-danger" onClick={() => handleRemove(item.id)}>&times;</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <form onSubmit={handleBuyNow} className="mt-3">
                    <h5 className="mb-3">Add your details</h5>
                    <div className="row g-2 mb-2">
                      <div className="col-md-4">
                        <input type="text" className="form-control" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                      </div>
                      <div className="col-md-4">
                        <input type="text" className="form-control" placeholder="Contact Number" value={contact} onChange={e => setContact(e.target.value)} required />
                      </div>
                      <div className="col-md-4">
                        <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                      </div>
                    </div>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <div className="d-flex justify-content-end">
                      <button type="submit" className="btn btn-primary" disabled={sending || cart.length === 0}>{sending ? 'Ordering...' : 'Buy Now'}</button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
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