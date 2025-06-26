import React from 'react';

const Timeline = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="fw-bold mb-3" data-aos="fade-up">
              Our Journey
            </h2>
            <p className="lead" data-aos="fade-up" data-aos-delay="200">
              From humble beginnings to industry leadership
            </p>
          </div>
        </div>
        <div className="timeline">
          <div className="timeline-item" data-aos="fade-up">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>2005</h4>
              <p>Amfahh was founded with a focus on distributing basic surgical supplies</p>
            </div>
          </div>
          <div class="timeline-item" data-aos="fade-up">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h4>2008</h4>
                        <p>Expanded product line to include specialty medical devices</p>
                    </div>
                </div>
                <div class="timeline-item" data-aos="fade-up">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h4>2012</h4>
                        <p>Opened our first manufacturing facility to produce proprietary products</p>
                    </div>
                </div>
                <div class="timeline-item" data-aos="fade-up">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h4>2015</h4>
                        <p>Launched our online platform, making it easier for healthcare providers to access our products</p>
                    </div>
                </div>
                <div class="timeline-item" data-aos="fade-up">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h4>2020</h4>
                        <p>Responded to global health crisis by rapidly scaling production of essential medical supplies</p>
                    </div>
                </div>
                <div class="timeline-item" data-aos="fade-up">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h4>2023</h4>
                        <p>Expanded operations internationally, serving healthcare providers in over 30 countries</p>
                    </div>
                </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;