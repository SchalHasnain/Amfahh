import React from 'react';

const Testimonials = () => {
  return (
    <section className="py-5">
      <div class="container">
            <div class="row justify-content-center mb-5">
                <div class="col-lg-8 text-center">
                    <h2 class="fw-bold mb-3" data-aos="fade-up">What Our Clients Say</h2>
                    <p class="lead" data-aos="fade-up" data-aos-delay="200">
                        Testimonials from healthcare professionals who trust our products
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col-12" data-aos="fade-up">
                    <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <div class="row justify-content-center">
                                    <div class="col-lg-8">
                                        <div class="p-4 bg-white rounded shadow text-center">
                                            <p class="mb-4"><i>"Amfahh's surgical instruments have significantly improved our operating room efficiency. The quality is exceptional, and their customer service is outstanding."</i></p>
                                            <h5 class="fw-bold mb-1">Dr. James Williams</h5>
                                            <p class="text-muted">Chief of Surgery, Memorial Hospital</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="carousel-item">
                                <div class="row justify-content-center">
                                    <div class="col-lg-8">
                                        <div class="p-4 bg-white rounded shadow text-center">
                                            <p class="mb-4"><i>"We've been using Amfahh products for over a decade. Their commitment to innovation has helped us provide better care to our patients."</i></p>
                                            <h5 class="fw-bold mb-1">Dr. Lisa Thompson</h5>
                                            <p class="text-muted">Director of Medical Services, City General Hospital</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="carousel-item">
                                <div class="row justify-content-center">
                                    <div class="col-lg-8">
                                        <div class="p-4 bg-white rounded shadow text-center">
                                            <p class="mb-4"><i>"The specialty products from Amfahh have transformed our approach to complex procedures. Their attention to detail and precision engineering is unmatched."</i></p>
                                            <h5 class="fw-bold mb-1">Dr. Michael Chen</h5>
                                            <p class="text-muted">Neurosurgeon, Advanced Surgical Center</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon bg-primary rounded-circle" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon bg-primary rounded-circle" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Testimonials;