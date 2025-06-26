import React from 'react';

const MissionValues = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="fw-bold mb-3" data-aos="fade-up">
              Our Mission & Values
            </h2>
            <p className="lead" data-aos="fade-up" data-aos-delay="200">
              Dedicated to improving healthcare outcomes through innovative medical solutions
            </p>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-md-4" data-aos="fade-up">
            <div className="feature-box">
              <div className="feature-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h4>Quality First</h4>
              <p>
                We never compromise on the quality of our products. Each item undergoes rigorous
                testing to ensure it meets our stringent standards and regulatory requirements.
              </p>
            </div>
          </div>
          <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
            <div className="feature-box">
              <div className="feature-icon">
                <i className="fas fa-microscope"></i>
              </div>
              <h4>Innovation</h4>
              <p>
                We continuously invest in research and development to create innovative
                solutions that address emerging healthcare challenges and improve patient care.
              </p>
            </div>
          </div>
          <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
            <div className="feature-box">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h4>Customer Focus</h4>
              <p>
                We listen to our customers and work collaboratively to understand their needs,
                providing responsive support and tailored solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionValues;