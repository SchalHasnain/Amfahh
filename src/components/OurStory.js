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
            <h2 className="fw-bold mb-3 text-primary">About Amfahh</h2>
            <p className="lead" data-aos="fade-up" data-aos-delay="200">
            Welcome to Amfahh, your trusted online source for high-quality dental and surgical
instruments. We are dedicated to equipping healthcare professionals with the precise tools
they need to deliver exceptional patient care. At Amfahh, we understand the critical role
that reliable instrumentation plays in successful procedures. That&#39;s why we meticulously
select and offer a comprehensive range of instruments, ensuring superior craftsmanship,
durability, and performance. Our commitment to excellence means you can expect products
that meet the highest industry standards. We strive to make your procurement process
seamless and efficient, providing a user-friendly online experience and exceptional
customer service. Partner with Amfahh for all your dental and surgical instrument needs
and experience the difference quality makes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;