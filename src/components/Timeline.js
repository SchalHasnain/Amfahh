import React from 'react';

const timelinePoints = [
  'High-Quality Products: Commitment to providing high-quality dental and surgical instruments.',
  'Precision Tools for Professionals: Equipping healthcare professionals with precise tools.',
  'Exceptional Patient Care: Instruments designed for quality patient care.',
  'Meticulous Selection: Carefully selected instruments for superior craftsmanship, durability, and performance.',
  'Adherence to Industry Standards: Products meet the highest industry standards.',
  'Seamless & Efficient Procurement: Smooth online buying process.',
  'User-Friendly Online Experience: Easy-to-use website.',
  'Exceptional Customer Service: Strong customer support.',
  'Global Sourcing: Bridging the gap between professionals and global manufacturers.',
  'Extensive Catalog: Wide array of products for various specialties.',
  'Rigorous Quality Checks: Strict quality checks for every instrument.'
];

const Timeline = () => {
  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10 text-center">
            <h2 className="fw-bold mb-3 text-primary" data-aos="fade-up">
              Why choose Amfahh?
            </h2>
            <p className="lead" data-aos="fade-up" data-aos-delay="200">
              Our values, vision, and mission at a glance
            </p>
          </div>
        </div>
        <div className="timeline" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {timelinePoints.map((point, idx) => (
            <div className="timeline-item" data-aos="fade-up" key={idx} style={{ marginBottom: '2.5rem' }}>
              <div className="timeline-dot bg-primary"></div>
              <div className="timeline-content" style={{ minWidth: '400px', maxWidth: '1000px', margin: '0 auto', padding: '2rem 2.5rem' }}>
                <p className="mb-0" style={{ lineHeight: '2.2', fontSize: '1.15rem', fontWeight: 500 }}>
                  {point}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;