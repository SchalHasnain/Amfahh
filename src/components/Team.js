import React from 'react';

const Team = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="fw-bold mb-3" data-aos="fade-up">Our Leadership Team</h2>
            <p className="lead" data-aos="fade-up" data-aos-delay="200">
              Meet the experienced professionals who guide our company
            </p>
          </div>
        </div>
        <div className="row justify-content-center g-4">
          <div className="col-lg-3 col-md-6" data-aos="fade-up">
            <div className="team-member">
              <img src="/images/humaira.jpg" alt="Team Member" className="w-100" />
              <div className="team-info">
                <h5>Dr. Humaira Rashid</h5>
                <span>Chief Executive</span>
                <div className="social-icons">
                  <a href="#"><i className="fab fa-linkedin"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div className="team-member">
              <img src="/images/rashid.jpg" alt="Team Member" className="w-100" />
              <div className="team-info">
                <h5>Dr. Rashid Khan</h5>
                <span>Chief Advisor</span>
                <div className="social-icons">
                  <a href="#"><i className="fab fa-linkedin"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div className="team-member">
              <img src="/images/hasnain.jpg" alt="Team Member" className="w-100" />
              <div className="team-info">
                <h5>Hasnain Rafiq</h5>
                <span>Head of Operations</span>
                <div className="social-icons">
                  <a href="#"><i className="fab fa-linkedin"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;