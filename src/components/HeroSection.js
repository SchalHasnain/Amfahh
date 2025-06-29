import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const HeroSection = () => {
  return (
    <section className="position-relative bg-primary text-white py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="fw-bold display-4 mb-3"
            >
              Ready to experience the Amfahh?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1 }}
              className="lead"
            >
              Browse our extensive range of Surgical, Dental and Special medical products.
            </motion.p>
          </div>
          <div className="col-lg-4 text-lg-end text-center mt-4 mt-lg-0">
            <motion.a
              href="/products"
              className="btn btn-light btn-lg position-relative overflow-hidden px-4 py-2 fw-bold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="position-absolute top-0 start-0 w-100 h-100 bg-secondary opacity-0 transition-opacity" style={{ transition: "opacity 0.3s" }}></span>
              <span className="position-relative text-primary">Explore Products</span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;