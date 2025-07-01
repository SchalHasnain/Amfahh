import React, { useEffect, useState } from 'react';

const Footer = () => {
  const [footer, setFooter] = useState({});

  useEffect(() => {
    fetch('/api/footer-details')
      .then(res => res.json())
      .then(data => setFooter(data || {}));
  }, []);

  return (
    <footer>
       <div class="container">
            <div class="row g-4">
                <div class="col-lg-4 col-md-6">
                    <h4 class="footer-heading">About Amfahh</h4>
                    <p>
                        {footer.about_text || 'Leading provider of high-quality surgical, dental and special medical products serving healthcare professionals worldwide.'}
                    </p>
                    <div class="social-media mt-4">
                        {footer.facebook && <a href={footer.facebook} target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook-f"></i></a>}
                        {footer.instagram && <a href={footer.instagram} target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>}
                        {footer.linkedin && <a href={footer.linkedin} target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin-in"></i></a>}
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
                    <a href="/products" class="footer-link">Dental Products</a>
                </div>
                <div class="col-lg-3 col-md-6">
                    <h4 class="footer-heading">Contact Information</h4>
                    <p><i class="fas fa-envelope me-2"></i> {footer.email || 'amfahhsurgical@gmail.com'}</p>
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