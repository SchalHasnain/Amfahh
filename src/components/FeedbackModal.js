import React, { useState } from 'react';

const FeedbackModal = ({ show, onHide }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment || !rating) {
      setError('Please fill all fields and select a rating.');
      return;
    }
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, comment, rating })
      });
      if (!res.ok) throw new Error('Failed to submit feedback');
      setSubmitted(true);
      setError('');
    } catch (err) {
      setError('Failed to submit feedback.');
    }
  };

  const handleClose = () => {
    setRating(0);
    setHover(0);
    setName('');
    setComment('');
    setSubmitted(false);
    setError('');
    onHide();
  };

  return (
    <div className={`modal fade${show ? ' show d-block' : ''}`} tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">We value your feedback!</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            {submitted ? (
              <div className="text-center py-4">
                <i className="fa fa-check-circle text-success fa-3x mb-3"></i>
                <h5>Thank you for your feedback!</h5>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3 text-center">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fa fa-star${(hover || rating) > i ? '' : '-o'} fa-2x text-warning`}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHover(i + 1)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(i + 1)}
                    ></i>
                  ))}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Your Feedback"
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  ></textarea>
                </div>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <div className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={handleClose}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal; 