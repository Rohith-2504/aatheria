// Aatheria Client App Shell - Dynamic Routing & State Controller
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Benefits from './components/Benefits';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import LeadForm from './components/LeadForm';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [highlightForm, setHighlightForm] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(false);

  // Authentication and Routing States
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState('auth'); // 'auth' | 'user-portal' | 'admin-dashboard'

  useEffect(() => {
    // Check local storage for active user session
    const savedUser = localStorage.getItem('aatheria_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.role === 'admin') {
          setRoute('admin-dashboard');
        } else {
          setRoute('user-portal');
        }
      } catch (err) {
        console.error('Failed to parse saved session:', err);
      }
    }
  }, []);

  useEffect(() => {
    // Start fading out the preloader after 2.5s
    const fadeTimeout = setTimeout(() => {
      setFadeLoader(true);
    }, 2500);

    // Fully unmount the preloader from DOM after transition completes (3.1s)
    const unmountTimeout = setTimeout(() => {
      setShowLoader(false);
    }, 3100);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(unmountTimeout);
    };
  }, []);

  const triggerFormHighlight = () => {
    setHighlightForm(true);
    // Automatically turn off highlight class after animation finishes
    setTimeout(() => {
      setHighlightForm(false);
    }, 2000);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    localStorage.setItem('aatheria_user', JSON.stringify(authenticatedUser));
    if (authenticatedUser.role === 'admin') {
      setRoute('admin-dashboard');
    } else {
      setRoute('user-portal');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aatheria_user');
    setRoute('auth');
  };

  return (
    <>
      {showLoader && <Preloader fade={fadeLoader} />}
      
      <div className={`app-layout-wrapper ${fadeLoader ? 'loaded' : ''}`}>
        <div className="app-layout">
          {route === 'auth' && (
            <Auth onAuthSuccess={handleAuthSuccess} />
          )}

          {route === 'admin-dashboard' && (
            <AdminDashboard user={user} onLogout={handleLogout} />
          )}

          {route === 'user-portal' && (
            <>
              <Navbar onCtaClick={triggerFormHighlight} user={user} onLogout={handleLogout} />
              <Hero onCtaClick={triggerFormHighlight} />
              <Features />
              <Benefits />
              <Pricing />
              <Testimonials />
              <Faq />
              <LeadForm isHighlighted={highlightForm} user={user} />
              <Footer />
            </>
          )}
        </div>
      </div>
    </>
  );
}
