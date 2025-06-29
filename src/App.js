import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import HeroSection from './components/HeroSection';
import OurStory from './components/OurStory';
import MissionValues from './components/MissionValues';
import Timeline from './components/Timeline';
import Statistics from './components/Statistics';
import Team from './components/Team';
import Certifications from './components/Certifications';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import ContactUs from './components/ContactUs';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import FeedbackModal from './components/FeedbackModal';
import FeedbackFloatingButton from './components/FeedbackFloatingButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'aos/dist/aos.css';
import './styles.css';
import AOS from 'aos';

function App() {
  // Initialize AOS (Animate On Scroll)
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const [adminLoggedIn, setAdminLoggedIn] = React.useState(() => localStorage.getItem('adminLoggedIn') === 'true');
  const [showFeedback, setShowFeedback] = React.useState(false);

  const handleLoginSuccess = () => {
    setAdminLoggedIn(true);
    localStorage.setItem('adminLoggedIn', 'true');
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <OurStory />
                  <MissionValues />
                  <Team />
                  <Timeline />
                  <Testimonials />
                </>
              }
            />
            {/* Product Listing Page */}
            <Route path="/products" element={<ProductList />} />
            {/* Product Detail Page */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/admin" element={
              adminLoggedIn
                ? <AdminDashboard onLogout={handleLogout} />
                : <AdminLogin onLoginSuccess={handleLoginSuccess} />
            } />
          </Routes>
        </div>
        <Footer />
        <CartModal />
      </Router>
      <FeedbackFloatingButton onShow={() => setShowFeedback(true)} />
      <FeedbackModal show={showFeedback} onHide={() => setShowFeedback(false)} />
    </div>
  );
}

export default App;