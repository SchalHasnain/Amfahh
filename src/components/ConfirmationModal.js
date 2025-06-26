import React from 'react';

const ConfirmationModal = () => {
  return (
    <div className="modal fade" id="confirmationModal" tabIndex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="confirmationModalLabel">Order Placed Successfully</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="text-center">
              <i className="fas fa-check-circle text-success" style={{ fontSize: '64px' }}></i>
              <h4 className="mt-3">Thank you for your order!</h4>
              <p>
                Our team will get in touch with you shortly regarding your order details and
                delivery.
              </p>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;