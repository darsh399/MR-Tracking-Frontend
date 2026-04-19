import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/logo.svg';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-brand">
              <img src={logo} alt="MediTrack Pro Logo" className="footer-logo-image" />
              <p>Revolutionizing medical representative workflows with intelligent visit tracking and analytics.</p>
            </div>
            <div className="footer-social">
              <a href="#" aria-label="Facebook" className="social-link">📘</a>
              <a href="#" aria-label="Twitter" className="social-link">🐦</a>
              <a href="#" aria-label="LinkedIn" className="social-link">💼</a>
              <a href="#" aria-label="Instagram" className="social-link">📷</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-list">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/doctors">Find Doctors</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3 className="footer-heading">Services</h3>
            <ul className="footer-list">
              <li><span>Visit Tracking</span></li>
              <li><span>Location Intelligence</span></li>
              <li><span>Doctor Management</span></li>
              <li><span>Analytics & Reporting</span></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="footer-section">
            <h3 className="footer-heading">Contact & Support</h3>
            <div className="footer-contact">
              <p>📧 support@meditrackpro.com</p>
              <p>📞 +91-9876543210</p>
              <p>📍 Mumbai, Maharashtra</p>
            </div>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {new Date().getFullYear()} MediTrack Pro. All rights reserved.
            </p>
            <p className="footer-tagline">
              Built with ❤️ for healthcare professionals
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
