import React, { useState } from 'react';
import { Printer, Github, Twitter, Linkedin, Sparkles } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#" className="footer-logo" onClick={handleLogoClick}>
            <Printer className="logo-icon" size={24} />
            <span>AATHERIA</span>
          </a>
          <p className="footer-brand-desc">
            Experience the pinnacle of high-precision additive manufacturing. Ultra-fine microstructures, engineering-grade materials, and rapid SLS/DMLS metal printing.
          </p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <div className="footer-links-column">
          <h4>Product</h4>
          <a href="#features">Materials</a>
          <a href="#benefits">Process</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Feedback</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="footer-links-column">
          <h4>Resources</h4>
          <a href="#features">Technical Specs</a>
          <a href="#benefits">Slicing Engine</a>
          <a href="#lead-form">Quote Builder</a>
          <a href="#faq">System Status</a>
        </div>

        <div className="footer-newsletter">
          <h4>Stay Configured</h4>
          <p>Subscribe to receive engineering updates, printing queue status, and new material tier announcements.</p>
          {subscribed ? (
            <div className="newsletter-success">
              <Sparkles size={14} />
              <span>Subscribed successfully!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="operator@aatheria.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address for newsletter"
              />
              <button type="submit" className="btn btn-primary">Join</button>
            </form>
          )}
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Aatheria 3D Printing Services. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#faq">Privacy Policy</a>
          <a href="#faq">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
