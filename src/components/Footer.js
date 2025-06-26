import React from 'react';

const Footer = () => {
  return (
    <footer>
       <div class="container">
            <div class="row g-4">
                <div class="col-lg-4 col-md-6">
                    <h4 class="footer-heading">About Amfahh</h4>
                    <p>
                        Leading provider of high-quality surgical and specialty medical products serving healthcare professionals worldwide.
                    </p>
                    <div class="social-media mt-4">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                <div class="col-lg-2 col-md-6">
                    <h4 class="footer-heading">Quick Links</h4>
                    <a href="/" class="footer-link">Home</a>
                    <a href="/products" class="footer-link">Products</a>
                    <a href="/contact" class="footer-link">Contact</a>
                </div>
                <div class="col-lg-3 col-md-6">
                    <h4 class="footer-heading">Products</h4>
                    <a href="/products" class="footer-link">Surgical Products</a>
                    <a href="/products" class="footer-link">Special Products</a>
                </div>
                <div class="col-lg-3 col-md-6">
                    <h4 class="footer-heading">Contact Information</h4>
                    <p><i class="fas fa-envelope me-2"></i> info@Amfahh.com</p>
                </div>
            </div>
            <div class="copyright">
                <p>&copy; 2025 Amfahh. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
  );
};

export default Footer;