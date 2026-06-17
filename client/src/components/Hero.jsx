import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Database, Printer, Zap, FileCode } from 'lucide-react';
import './Hero.css';

export default function Hero({ onCtaClick }) {
  const [activeNode, setActiveNode] = useState(null);
  const [processingState, setProcessingState] = useState('idle');
  const [showVideoModal, setShowVideoModal] = useState(false);

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
      // Step 1: Model Ingested
      setProcessingState('captured');

      // Step 2: Mesh Sliced (starts after 1.2s)
      setTimeout(() => {
        setProcessingState('classifying');
      }, 1200);

      // Step 3: Job Registered (starts after 2.4s)
      setTimeout(() => {
        setProcessingState('storing');
      }, 2400);

      // Step 4: Printing Started (starts after 3.6s)
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
      title: 'Model Ingested',
      icon: <FileCode size="1.2em" />,
      desc: processingState === 'captured' ? 'STL/OBJ verified & bounds checked' : 'CAD mesh loaded successfully',
      color: '#06b6d4',
      isActiveState: processingState === 'captured'
    },
    {
      id: 2,
      title: 'Slicing G-Code',
      icon: <Printer size="1.2em" />,
      desc: processingState === 'classifying' ? 'Compiling 20µm layers & support structures' : 'Toolpath path compiling',
      color: '#7c3aed',
      isActiveState: processingState === 'classifying'
    },
    {
      id: 3,
      title: 'Job Registered',
      icon: <Database size="1.2em" />,
      desc: processingState === 'storing' ? 'Print parameters committed to database' : 'Securing local operation ledger',
      color: '#10b981',
      isActiveState: processingState === 'storing'
    },
    {
      id: 4,
      title: 'Printing Started',
      icon: <Zap size="1.2em" />,
      desc: processingState === 'responding' ? 'Laser SLS matrix online & firing' : 'Production queue scheduled',
      color: '#f59e0b',
      isActiveState: processingState === 'responding'
    }
  ];

  // Helper to determine the status text at the footer of the canvas
  const getStatusText = () => {
    switch (processingState) {
      case 'captured':
        return 'Ingesting CAD mesh, verifying geometry...';
      case 'classifying':
        return 'Generating toolpath layers & G-code...';
      case 'storing':
        return 'Registering job and spool allocations...';
      case 'responding':
        return 'Queue committed. Extrusion matrix online.';
      default:
        return '3D Printer Online / Queue Ingestion';
    }
  };

  return (
    <section id="hero" className="hero-section section animate-fadeIn">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="tagline">The Future of Fabrication</span>
          <h1 className="hero-title">
            Additive Precision. <span className="text-gradient">Flawless Scale.</span>
          </h1>
          <p className="hero-desc">
            Aatheria prints components with aerospace-grade carbon fiber and titanium. Upload your CAD designs, customize structural densities, and queue production immediately.
          </p>
          <div className="hero-actions">
            <a href="#lead-form" onClick={handleCTA} className="btn btn-primary">
              Upload CAD & Quote <ArrowRight size="1.1em" />
            </a>
            <button onClick={() => setShowVideoModal(true)} className="btn btn-secondary">
              <Play size="1em" /> Watch Demo
            </button>
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
              <span className="window-title">Aatheria Additive Controller — build_pipeline.gcode</span>
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

      {showVideoModal && (
        <div className="video-modal-overlay" onClick={() => setShowVideoModal(false)}>
          <div className="video-modal-content glassmorphic-panel" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setShowVideoModal(false)}>&times;</button>
            <div className="video-player-wrapper">
              <video 
                src="/Demo Video.mp4" 
                controls 
                autoPlay 
                loop
                style={{ width: '100%', height: '100%', borderRadius: '12px', display: 'block', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
