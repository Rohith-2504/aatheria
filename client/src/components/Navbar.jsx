import React, { useState, useEffect } from 'react';
import { Menu, X, Printer } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onCtaClick, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (window.location.pathname !== '/') {
      // If we are not on home path, go home first, then scroll
      window.history.pushState({}, '', '/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          window.scrollTo({
            top: elementRect - bodyRect - offset,
            behavior: 'smooth'
          });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of the navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      if (id === 'lead-form' && onCtaClick) {
        onCtaClick();
      }
    }
  };

  const handleHobbiesClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    window.history.pushState({}, '', '/Hobbies');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#" className="nav-logo" onClick={(e) => handleNavClick(e, 'hero')} data-cursor-lock>
          <Printer className="logo-icon" size={24} />
          <span>AATHERIA</span>
        </a>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <a href="#features" onClick={(e) => handleNavClick(e, 'features')} data-cursor-lock>Materials</a>
          <a href="#benefits" onClick={(e) => handleNavClick(e, 'benefits')} data-cursor-lock>Process</a>
          <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} data-cursor-lock>Pricing</a>
          <a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')} data-cursor-lock>Feedback</a>
          <a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} data-cursor-lock>FAQ</a>
          <a href="/Hobbies" onClick={handleHobbiesClick} data-cursor-lock>Hobbies</a>
          <a 
            href="#lead-form" 
            className="btn btn-primary nav-cta" 
            onClick={(e) => handleNavClick(e, 'lead-form')}
            data-cursor-lock
          >
            Build Quote
          </a>
          {user && (
            <div className="nav-user-section">
              <span className="nav-username">Hi, {user.full_name || user.username}</span>
              <button onClick={onLogout} className="btn-nav-logout" data-cursor-lock>
                Logout
              </button>
            </div>
          )}
        </div>

        <button className="nav-hamburger" onClick={toggleMenu} aria-label="Toggle navigation" data-cursor-lock>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
