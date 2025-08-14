import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="contact-info2">
          <div className="contact-item">
            <i className="footer-icon">✉</i>
            <a href="mailto:playerlytics@gmail.com">playerlytics@gmail.com</a>
          </div>
          <div className="contact-item">
            <i className="footer-icon">📞</i>
            <a href="tel:+21672485627">+216 72 485 627</a>
          </div>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} Playerlytics. Tous les droits sont réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;