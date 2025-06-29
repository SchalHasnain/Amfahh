import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const MissionValues = () => (
  <section className="position-relative bg-white py-5">
    <div className="container">
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="fw-bold display-5 mb-4 text-primary"
          >
            Vision
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            viewport={{ once: true }}
            className="lead px-md-4"
          >
            At Amfahh, our vision is to be the foremost online destination for dental and surgical instruments worldwide, recognized for our unwavering commitment to quality, innovation, and customer satisfaction. We envision a future where every healthcare professional has seamless access to the most advanced and reliable instruments, empowering them to deliver superior patient outcomes and elevate global healthcare standards. We aim to foster a healthier world, one precise instrument at a time.
          </motion.p>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="card shadow border-0 p-4 mb-4 bg-light"
            style={{ borderRadius: "1.5rem" }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
              className="fw-bold mb-3 text-primary"
            >
              Mission
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              viewport={{ once: true }}
              className="lead mb-0"
            >
              Our mission at Amfahh is to empower healthcare professionals by providing them with meticulously sourced, high-quality dental and surgical instruments through a user-friendly and reliable online platform. We are dedicated to ensuring every product meets rigorous international standards for precision, durability, and safety. We strive to offer an extensive and ever-evolving inventory, supported by exceptional customer service and efficient delivery. By constantly innovating our offerings and streamlining the procurement process, we aim to be the trusted partner that enables our clients to perform with confidence and excellence, ultimately contributing to better patient care globally.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

export default MissionValues;