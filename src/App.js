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
  // Typewriter effect for feedback button
  const [typewriterText, setTypewriterText] = React.useState('');
  const [typewriterVisible, setTypewriterVisible] = React.useState(true);
  const typewriterFullText = 'Rate your experience with us';
  React.useEffect(() => {
    let timeout;
    let hideTimeout;
    let i = 0;
    function type() {
      setTypewriterText(typewriterFullText.slice(0, i));
      if (i < typewriterFullText.length) {
        timeout = setTimeout(() => {
          i++;
          type();
        }, 60);
      } else {
        // After typing, hide after 2s, then restart after 3s
        hideTimeout = setTimeout(() => {
          setTypewriterVisible(false);
          setTimeout(() => {
            setTypewriterText('');
            setTypewriterVisible(true);
            i = 0;
            type();
          }, 5000);
        }, 3000);
      }
    }
    if (!showFeedback) {
      setTypewriterVisible(true);
      setTypewriterText('');
      i = 0;
      type();
    } else {
      setTypewriterVisible(false);
      setTypewriterText('');
    }
    return () => {
      clearTimeout(timeout);
      clearTimeout(hideTimeout);
    };
    // eslint-disable-next-line
  }, [showFeedback]);

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
                  <Timeline />
                  <Statistics />
                  <Team />
                  <Certifications />
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
        {/* Feedback Button and Modal */}
        <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1050, display: 'flex', alignItems: 'center' }}>
          {typewriterText && typewriterVisible && (
            <span style={{
              background: 'rgba(255,255,255,0.95)',
              color: '#333',
              borderRadius: 20,
              padding: '8px 16px',
              marginRight: 12,
              fontWeight: 500,
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              whiteSpace: 'nowrap',
              border: '1px solid #eee',
              letterSpacing: '0.5px',
              transition: 'opacity 0.3s',
            }}>{typewriterText}<span className="typewriter-cursor">|</span></span>
          )}
          <button
            className="btn btn-primary"
            style={{ borderRadius: '50%', width: 56, height: 56, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
            onClick={() => setShowFeedback(true)}
            title="Give Feedback"
          >
            <i className="fa fa-commenting-o fa-lg"></i>
          </button>
        </div>
        <FeedbackModal show={showFeedback} onHide={() => setShowFeedback(false)} />
      </Router>
    </div>
  );
}

export default App;