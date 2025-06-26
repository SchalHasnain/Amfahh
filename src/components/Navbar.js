import React, { useState, useEffect } from "react";

const Navbar = () => {
  // State to track which tab is active
  const [activeTab, setActiveTab] = useState("");
  const [cartCount, setCartCount] = useState(0);
  
  // Set active tab based on current path when component mounts
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/") {
      setActiveTab("home");
    } else if (path === "/products") {
      setActiveTab("products");
    } else if (path === "/contact") {
      setActiveTab("contact");
    }
  }, []);
  
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
      } catch {
        setCartCount(0);
      }
    };
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);
  
  // Style for active tab
  const activeStyle = {
    color: "#0d6efd", // Bootstrap primary color
    borderBottom: "2px solid #0d6efd",
    paddingBottom: "2px"
  };
  
  // Style for navigation links - larger font and modern font family
  const navLinkStyle = {
    fontSize: "1.2rem",
    fontFamily: "'Poppins', 'Montserrat', sans-serif"
  };

  const openCart = (e) => {
    e.preventDefault();
    const cartModal = window.bootstrap && window.bootstrap.Modal.getOrCreateInstance(document.getElementById('cartModal'));
    if (cartModal) cartModal.show();
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img src="/images/FinalLogo.ico" alt="Logo" className="me-2" />
        </a>

        {/* Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav gap-3">
            <li className="nav-item">
              <a 
                className="nav-link text-dark fw-semibold position-relative" 
                href="/"
                style={{...navLinkStyle, ...(activeTab === "home" ? activeStyle : {})}}
                onClick={() => setActiveTab("home")}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link text-dark fw-semibold position-relative" 
                href="/products"
                style={{...navLinkStyle, ...(activeTab === "products" ? activeStyle : {})}}
                onClick={() => setActiveTab("products")}
              >
                Products
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link text-dark fw-semibold position-relative" 
                href="/contact"
                style={{...navLinkStyle, ...(activeTab === "contact" ? activeStyle : {})}}
                onClick={() => setActiveTab("contact")}
              >
                Contact
              </a>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-primary position-relative ms-2" onClick={openCart} style={{ border: 'none', background: 'none' }}>
                <i className="fa fa-shopping-cart fa-lg"></i>
                {cartCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{cartCount}</span>}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;