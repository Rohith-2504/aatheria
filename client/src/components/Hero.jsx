import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Database, MessageSquare, Zap, Cpu } from 'lucide-react';
import './Hero.css';

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
      // Step 1: Lead Captured
      setProcessingState('captured');

      // Step 2: AI Classifier (starts after 1.2s)
      setTimeout(() => {
        setProcessingState('classifying');
      }, 1200);

      // Step 3: SQLite Storage (starts after 2.4s)
      setTimeout(() => {
        setProcessingState('storing');
      }, 2400);

      // Step 4: Auto-Response (starts after 3.6s)
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
      title: 'Lead Captured',
      icon: <MessageSquare size="1.2em" />,
      desc: processingState === 'captured' ? 'Lead captured via /api/submissions' : 'Form submission received',
      color: '#06b6d4',
      isActiveState: processingState === 'captured'
    },
    {
      id: 2,
      title: 'AI Classifier',
      icon: <Cpu size="1.2em" />,
      desc: processingState === 'classifying' ? "Urgency: High - Tagged: 'Growth Lead'" : 'Checks sentiment & intent',
      color: '#7c3aed',
      isActiveState: processingState === 'classifying'
    },
    {
      id: 3,
      title: 'SQLite Database',
      icon: <Database size="1.2em" />,
      desc: processingState === 'storing' ? 'Row inserted in submissions.db successfully' : 'Saves lead details securely',
      color: '#10b981',
      isActiveState: processingState === 'storing'
    },
    {
      id: 4,
      title: 'Auto-Response',
      icon: <Zap size="1.2em" />,
      desc: processingState === 'responding' ? 'Slack alert dispatched in 40ms' : 'Dispatches instant alert',
      color: '#f59e0b',
      isActiveState: processingState === 'responding'
    }
  ];

  // Helper to determine the status text at the footer of the canvas
  const getStatusText = () => {
    switch (processingState) {
      case 'captured':
        return 'Submission detected, orchestrating flow...';
      case 'classifying':
        return 'Running AI classification sequence...';
      case 'storing':
        return 'SQLite write transaction committed...';
      case 'responding':
        return 'Slack webhook response executed successfully.';
      default:
        return 'Workflow Listening on /api/submissions';
    }
  };

  return (
    <section id="hero" className="hero-section section animate-fadeIn">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="tagline">Introducing AetherFlow 2.0</span>
          <h1 className="hero-title">
            Orchestrate Your Workflows with <span className="text-gradient">AI Intellect</span>
          </h1>
          <p className="hero-desc">
            AetherFlow bridges the gap between raw data streams and automated SaaS execution. Capture leads, classify insights, and write data directly to your SQLite core database in real-time.
          </p>
          <div className="hero-actions">
            <a href="#lead-form" onClick={handleCTA} className="btn btn-primary">
              Build a Flow <ArrowRight size="1.1em" />
            </a>
            <a href="#features" onClick={handleSecondary} className="btn btn-secondary">
              <Play size="1em" /> Explore Features
            </a>
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
              <span className="window-title">AetherFlow Builder — lead_ingestion.flow</span>
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
