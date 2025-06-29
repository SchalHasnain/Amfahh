import React, { useEffect, useState } from 'react';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => {
        setTestimonials(data.filter(fb => fb.show_on_home));
      });
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="fw-bold mb-3 text-primary" data-aos="fade-up">What Our Clients Say</h2>
            <p className="lead" data-aos="fade-up" data-aos-delay="200">
              Testimonials from healthcare professionals who trust our products
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-12" data-aos="fade-up">
            <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                {testimonials.map((fb, idx) => (
                  <div className={`carousel-item${idx === 0 ? ' active' : ''}`} key={fb.id}>
                    <div className="row justify-content-center">
                      <div className="col-lg-8">
                        <div className="p-4 bg-white rounded shadow text-center">
                          <div className="mb-2">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fa fa-star${i < fb.rating ? '' : '-o'} text-warning`}></i>
                            ))}
                          </div>
                          <p className="mb-4"><i>"{fb.comment}"</i></p>
                          <h5 className="fw-bold mb-1">{fb.name}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {testimonials.length > 1 && (
                <>
                  <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon bg-primary rounded-circle" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon bg-primary rounded-circle" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;