import React from 'react';
import './ContactUs.css';

export default function ContactUsStyleTwo() {
  return (
    <div className="contact-container style-two">
      <div className="contact-main-section">
        <div className="contact-header">
          <h2>Contactez-nous</h2>
          <p>
            Le lorem ipsum est, en imprimerie Le lorem ipsum est, en imprimerie.<br />
            Le lorem ipsum est, en imprimerie.
          </p>
        </div>
        <div className="contact-form-two">
          <div className="form-row">
            <input type="text" placeholder="Name *" required />
            <input type="email" placeholder="Email *" required />
          </div>
          <div className="form-row">
            <input type="text" placeholder="Phone *" required />
            <input type="text" placeholder="Sujet *" required />
          </div>
          <div className="form-row">
            <input type="text" placeholder="Société" />
            <button type="submit">SEND NOW</button>
          </div>
        </div>
      </div>

      <div className="contact-top-section">
        <div className="newsletter">
          <h3>Newsletter</h3>
          <div className="newsletter-form">
            <input type="email" placeholder="E-MAIL TYPE ..." />
            <button>SUBSCRIBE</button>
          </div>
        </div>
        
        
        <div className="footer-column">
            <h4>Links</h4>
            <ul>
              <li>Home</li>
              <li>About Us</li>
              <li>Services</li>
              <li>Jobs</li>
              <li>Contact us</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Location</h4>
            <ul>
              <li>Tunisie</li>
              <li>Tunisie</li>
              <li>France</li>
              <li>Benin</li>
              <li>RDC</li>
            </ul>
          </div>

          <div className="footer-column">
          <h4>Information</h4>
          <ul>
            <li>+216 71 963 453</li>
            <li>+216 71 963 453</li>
            <li>contact@abshore.com</li>
          </ul>
        </div>
      </div>

      <div className="contact-footer">
        <div className="social-icons-two">
          <h4>Follow Us On:</h4>
          <div className="icons">
            <i className="fab fa-facebook"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-pinterest"></i>
            <i className="fab fa-youtube"></i>
          </div>
        </div>
        <div className="footer-columns">
          
          
        </div>
      </div>
    </div>
  );
}
