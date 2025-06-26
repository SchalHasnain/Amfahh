import React from 'react';

const Certifications = () => {
  return (
    <section className="py-5 bg-light">
      <div class="container">
            <div class="row justify-content-center mb-5">
                <div class="col-lg-8 text-center">
                    <h2 class="fw-bold mb-3" data-aos="fade-up">Our Certifications</h2>
                    <p class="lead" data-aos="fade-up" data-aos-delay="200">
                        Meeting the highest standards in quality and safety
                    </p>
                </div>
            </div>
            <div class="row g-4 justify-content-center">
                <div class="col-md-4" data-aos="fade-up">
                    <div class="feature-box text-center">
                        <div class="feature-icon">
                            <i class="fas fa-certificate"></i>
                        </div>
                        <h4>ISO 13485</h4>
                        <p>
                            Our quality management systems meet international standards for medical devices
                        </p>
                    </div>
                </div>
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
                    <div class="feature-box text-center">
                        <div class="feature-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h4>FDA Approved</h4>
                        <p>
                            Our products meet the stringent requirements of the U.S. Food and Drug Administration
                        </p>
                    </div>
                </div>
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="300">
                    <div class="feature-box text-center">
                        <div class="feature-icon">
                            <i class="fas fa-leaf"></i>
                        </div>
                        <h4>Environmental Certification</h4>
                        <p>
                            Committed to sustainable manufacturing practices and reducing environmental impact
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Certifications;