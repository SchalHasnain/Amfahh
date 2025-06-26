import React, { useEffect, useState } from "react";

const Counter = ({ endValue, duration }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = endValue / (duration / 10);
    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        clearInterval(timer);
        setCount(endValue);
      } else {
        setCount(Math.ceil(start));
      }
    }, 10);
    
    return () => clearInterval(timer);
  }, [endValue, duration]);

  return <span>{count}</span>;
};

const Statistics = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-3" data-aos="fade-up">
            <div className="counter-box text-center">
              <h2 className="counter-number">
                <Counter endValue={18} duration={2000} />
              </h2>
              <p className="counter-text">Years of Excellence</p>
            </div>
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="200">
            <div className="counter-box text-center">
              <h2 className="counter-number">
                <Counter endValue={5000} duration={2500} />
              </h2>
              <p className="counter-text">Healthcare Partners</p>
            </div>
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="300">
            <div className="counter-box text-center">
              <h2 className="counter-number">
                <Counter endValue={500} duration={2200} />
              </h2>
              <p className="counter-text">Products</p>
            </div>
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="400">
            <div className="counter-box text-center">
              <h2 className="counter-number">
                <Counter endValue={30} duration={1800} />
              </h2>
              <p className="counter-text">Countries Served</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
