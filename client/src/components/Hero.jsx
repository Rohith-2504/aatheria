import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Database, Car, Zap, Paintbrush } from 'lucide-react';
import './Hero.css';
import carImage from './aetheria_hypercar.png';

export default function Hero({ onCtaClick }) {
  const [activeNode, setActiveNode] = useState(null);
  const [processingState, setProcessingState] = useState('idle');

  const handleCTA = (e) => {
    e.preventDefault();
    const element = document.getElementById('lead-form');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });

      if (onCtaClick) {
        onCtaClick();
      }
    }
  };

  const handleSecondary = (e) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  // Listen to form submission events to trigger the interactive processing sequence
  useEffect(() => {
    const handleFormSubmit = () => {
      // Step 1: Spec Selected
      setProcessingState('captured');

      // Step 2: Custom Paint (starts after 1.2s)
      setTimeout(() => {
        setProcessingState('classifying');
      }, 1200);

      // Step 3: Chassis Registered (starts after 2.4s)
      setTimeout(() => {
        setProcessingState('storing');
      }, 2400);

      // Step 4: Delivery Dispatched (starts after 3.6s)
      setTimeout(() => {
        setProcessingState('responding');
      }, 3600);

      // Reset back to idle (starts after 5.0s)
      setTimeout(() => {
        setProcessingState('idle');
      }, 5000);
    };

    window.addEventListener('lead-submitted', handleFormSubmit);
    return () => {
      window.removeEventListener('lead-submitted', handleFormSubmit);
    };
  }, []);

  const nodes = [
    {
      id: 1,
      title: 'Spec Selected',
      icon: <Car size="1.2em" />,
      desc: processingState === 'captured' ? 'Specification initialized via direct build' : 'Powertrain & package selected',
      color: '#06b6d4',
      isActiveState: processingState === 'captured'
    },
    {
      id: 2,
      title: 'Bespoke Paint',
      icon: <Paintbrush size="1.2em" />,
      desc: processingState === 'classifying' ? "Finish: Liquid Carbon-Purple weave" : 'Custom trim & aero panels selected',
      color: '#7c3aed',
      isActiveState: processingState === 'classifying'
    },
    {
      id: 3,
      title: 'Chassis Registered',
      icon: <Database size="1.2em" />,
      desc: processingState === 'storing' ? 'Allocation committed to security ledger' : 'Secure allocation registry log',
      color: '#10b981',
      isActiveState: processingState === 'storing'
    },
    {
      id: 4,
      title: 'Booking Confirmed',
      icon: <Zap size="1.2em" />,
      desc: processingState === 'responding' ? 'Bespoke build slot confirmed' : 'Instant allocation confirmation',
      color: '#f59e0b',
      isActiveState: processingState === 'responding'
    }
  ];

  // Helper to determine the status text at the footer of the canvas
  const getStatusText = () => {
    switch (processingState) {
      case 'captured':
        return 'Specification initialized, compiling config...';
      case 'classifying':
        return 'Applying bespoke visual trims & aerodynamics...';
      case 'storing':
        return 'Registering vehicle VIN and chassis slot...';
      case 'responding':
        return 'Logistics locked. Order confirmation dispatched.';
      default:
        return 'Configurator Online / Direct Allocation';
    }
  };

  return (
    <section id="hero" className="hero-section section animate-fadeIn">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="tagline">The Future of Velocity</span>
          <h1 className="hero-title">
            Bespoke Engineering. <span className="text-gradient">Pure Power.</span>
          </h1>
          <p className="hero-desc">
            Aetheria Hyper-GT combines carbon-fiber monocoque aerodynamics with a 1,900 HP tri-motor electric powertrain. Custom built to your specifications, registered securely, and delivered globally.
          </p>
          <div className="hero-actions">
            <a href="#lead-form" onClick={handleCTA} className="btn btn-primary">
              Build Your Spec <ArrowRight size="1.1em" />
            </a>
            <a href="#features" onClick={handleSecondary} className="btn btn-secondary">
              <Play size="1em" /> Explore Specs
            </a>
          </div>
          <div className="hero-car-preview" style={{ marginTop: '2.5rem' }}>
            <img 
              src={carImage} 
              alt="Aetheria Hyper-GT Preview" 
              style={{
                width: '100%',
                maxWidth: '480px',
                borderRadius: '14px',
                border: '1px solid rgba(124, 58, 237, 0.25)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 25px rgba(124, 58, 237, 0.1)',
                display: 'block'
              }} 
            />
          </div>
        </div>

        <div className="hero-visual animate-float">
          <div className="flow-canvas glassmorphic-panel">
            <div className="flow-canvas-header">
              <div className="window-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <span className="window-title">Aetheria Configurator — build_pipeline.spec</span>
            </div>

            <div className="flow-nodes">
              {nodes.map((node) => {
                const isCurrentActive = node.isActiveState || activeNode === node.id;
                return (
                  <div 
                    key={node.id} 
                    className={`flow-node ${isCurrentActive ? 'active' : ''}`}
                    onMouseEnter={() => {
                      if (processingState === 'idle') {
                        setActiveNode(node.id);
                      }
                    }}
                    onMouseLeave={() => {
                      if (processingState === 'idle') {
                        setActiveNode(null);
                      }
                    }}
                    style={{ '--node-theme': node.color }}
                  >
                    <div className="node-icon-wrapper" style={{ backgroundColor: node.color + '15', color: node.color }}>
                      {node.icon}
                    </div>
                    <div className="node-details">
                      <h4>{node.title}</h4>
                      <p>{node.desc}</p>
                    </div>
                    {node.id < 4 && (
                      <div className="node-connection-line">
                        <span className={`connection-pulse ${processingState !== 'idle' ? 'fast' : ''}`}></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flow-canvas-footer">
              <span className={`status-indicator ${processingState !== 'idle' ? 'thinking' : 'live'}`}></span>
              <span className="status-text">{getStatusText()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
