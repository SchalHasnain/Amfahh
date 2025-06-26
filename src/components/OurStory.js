import React from 'react';

const OurStory = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
            <img src="images/image1.jpg" alt="Our Story" className="img-fluid rounded shadow" />
          </div>
          <div className="col-lg-6" data-aos="fade-left">
            <h2 className="fw-bold mb-4">Our Story</h2>
            <p>
              Amfahh was founded in 2005 with a vision to revolutionize the medical supply
              industry. What started as a small distribution company has grown into a leading
              supplier of high-quality medical equipment and products.
            </p>
            <p>
              Our journey has been guided by a commitment to innovation, quality, and improving
              patient outcomes. We work closely with healthcare professionals to understand their
              needs and develop solutions that address real-world challenges.
            </p>
            <p>
              Today, Amfahh serves thousands of healthcare facilities across the country,
              providing essential surgical tools and specialty products that healthcare
              professionals rely on every day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;