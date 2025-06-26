import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

const getCartFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
};

const clearCart = () => {
  localStorage.removeItem('cart');
  window.dispatchEvent(new Event('cartUpdated'));
};

// EmailJS credentials from ContactUs.js
const EMAILJS_SERVICE_ID = 'service_pez9035';
const EMAILJS_TEMPLATE_ID = 'template_jkhxfe8';
const EMAILJS_USER_ID = 'NF3zELHejbd242DU3';

const CheckoutModal = ({ show, onHide }) => {
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({ name: '', address: '', email: '', phone: '' });
  const [payment, setPayment] = useState({ card: '', expiry: '', cvc: '' });
  const [sending, setSending] = useState(false);
  const cart = getCartFromStorage();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (show) {
      setStep(1);
      setShipping({ name: '', address: '', email: '', phone: '' });
      setPayment({ card: '', expiry: '', cvc: '' });
      setSending(false);
    }
  }, [show]);

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };
  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };
  const handlePlaceOrder = async () => {
    setSending(true);
    const orderDetails = cart.map(item => `${item.name} x${item.quantity} ($${item.price})`).join(', ');
    const templateParams = {
      to_email: 'schal901@gmail.com',
      from_name: shipping.name,
      from_email: shipping.email,
      phone: shipping.phone,
      address: shipping.address,
      order: orderDetails,
      total: total.toFixed(2)
    };
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_USER_ID);
      clearCart();
      onHide();
      window.dispatchEvent(new CustomEvent('cartToast', { detail: 'Order placed successfully. Our team will get in touch with you soon.' }));
    } catch (err) {
      alert('Failed to send order. Please try again.');
    }
    setSending(false);
  };
  const handleClose = () => {
    setStep(1);
    onHide();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Checkout</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            {step === 1 && (
              <div>
                <h5>Shipping Information</h5>
                <div className="row g-2">
                  <div className="col-md-6">
                    <input type="text" className="form-control mb-2" name="name" placeholder="Full Name" value={shipping.name} onChange={handleShippingChange} required disabled={false} />
                  </div>
                  <div className="col-md-6">
                    <input type="email" className="form-control mb-2" name="email" placeholder="Email" value={shipping.email} onChange={handleShippingChange} required disabled={false} />
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control mb-2" name="phone" placeholder="Phone" value={shipping.phone} onChange={handleShippingChange} required disabled={false} />
                  </div>
                  <div className="col-md-12">
                    <input type="text" className="form-control mb-2" name="address" placeholder="Address" value={shipping.address} onChange={handleShippingChange} required disabled={false} />
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h5>Payment Information</h5>
                <div className="row g-2">
                  <div className="col-md-6">
                    <input type="text" className="form-control mb-2" name="card" placeholder="Card Number" value={payment.card} onChange={handlePaymentChange} required />
                  </div>
                  <div className="col-md-3">
                    <input type="text" className="form-control mb-2" name="expiry" placeholder="MM/YY" value={payment.expiry} onChange={handlePaymentChange} required />
                  </div>
                  <div className="col-md-3">
                    <input type="text" className="form-control mb-2" name="cvc" placeholder="CVC" value={payment.cvc} onChange={handlePaymentChange} required />
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h5>Review & Confirm</h5>
                <div className="mb-3">
                  <strong>Shipping:</strong> {shipping.name}, {shipping.address}, {shipping.email}, {shipping.phone}
                </div>
                <div className="mb-3">
                  <strong>Order:</strong>
                  <ul className="list-group">
                    {cart.map(item => (
                      <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                        {item.name} <span>x{item.quantity}</span> <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-end">
                  <h5>Total: <span className="text-primary">${total.toFixed(2)}</span></h5>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>Back</button>}
            {step < 3 && <button className="btn btn-primary" onClick={() => setStep(step + 1)} disabled={step === 1 && (!shipping.name || !shipping.address || !shipping.email || !shipping.phone) || step === 2 && (!payment.card || !payment.expiry || !payment.cvc)}>
              Next
            </button>}
            {step === 3 && <button className="btn btn-success" onClick={handlePlaceOrder} disabled={sending}>{sending ? 'Ordering...' : 'Order'}</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;