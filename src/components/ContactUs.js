import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  // Lazy load the map when user scrolls near it
  useEffect(() => {
    const handleScroll = () => {
      if (!mapLoaded && window.innerHeight + window.scrollY > document.body.offsetHeight - 600) {
        setMapLoaded(true);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Also check on initial load if map is already in viewport
    if (window.innerHeight > 800) {
      setMapLoaded(true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mapLoaded]);

  // Show map with a slight delay after content is loaded
  useEffect(() => {
    if (mapLoaded) {
      const timer = setTimeout(() => {
        setMapVisible(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [mapLoaded]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setAlert({ show: true, type: "danger", message: "All fields are required!" });
      return;
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });
      if (!res.ok) throw new Error('Failed to send message');
      setAlert({ show: true, type: "success", message: "Message sent successfully!" });
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setAlert({ show: true, type: "danger", message: "Failed to send message. Try again." });
    }
  };

  // Load map button handler
  const handleLoadMap = () => {
    setMapLoaded(true);
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Contact Form */}
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Contact Us</h2>

            {alert.show && (
              <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                {alert.message}
                <button type="button" className="btn-close" onClick={() => setAlert({ show: false })}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Your Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Your Message</label>
                <textarea
                  className="form-control"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="col-md-6 d-flex flex-column align-items-center">
          <h3 className="mb-3">We are located at</h3>
          
          {!mapLoaded ? (
            <div className="map-placeholder w-100 d-flex flex-column align-items-center justify-content-center bg-light" style={{ height: "400px" }}>
              <p className="text-center mb-3">Map loading optimized to improve page performance</p>
              <button 
                className="btn btn-outline-primary" 
                onClick={handleLoadMap}
              >
                Load Map Now
              </button>
            </div>
          ) : (
            <div className="position-relative w-100" style={{ height: "400px" }}>
              {!mapVisible && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-light">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <iframe
                title="Lahore Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108611.38818107282!2d74.2530862907621!3d31.52036958419892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483a66ab62b%3A0x24c8b8b6c4e6873!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1711068905678"
                width="100%"
                height="400"
                style={{ border: 0, display: mapVisible ? "block" : "none" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapVisible(true)}
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;