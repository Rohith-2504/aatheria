import React, { useEffect, useState } from 'react';
import './Preloader.css';

export default function Preloader({ fade }) {
  const [logIndex, setLogIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const logs = [
    'INITIALIZING HYPER-GT POWERGRID...',
    'CALIBRATING TRI-MOTOR SYSTEM CHECKS...',
    'SYNCHRONIZING ACTIVE DIFFERENTIAL VECTORING...',
    'INGESTING DRIVER CALIBRATIONS & SUSPENSION GEOMETRY...',
    'AETHERIA SYSTEM ONLINE. DRIVE READY.'
  ];

  useEffect(() => {
    const logIntervals = [
      setTimeout(() => setLogIndex(1), 500),
      setTimeout(() => setLogIndex(2), 1000),
      setTimeout(() => setLogIndex(3), 1500),
      setTimeout(() => setLogIndex(4), 2100),
    ];

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 22);

    return () => {
      logIntervals.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className={`preloader-overlay ${fade ? 'fade-out' : ''}`}>
      <div className="preloader-matrix-overlay" />
      <div className="preloader-glow preloader-glow-purple" />
      <div className="preloader-glow preloader-glow-cyan" />

      <div className="preloader-content">
        <div className="preloader-logo-wrapper">
          <svg className="preloader-logo" viewBox="0 0 100 100" width="100" height="100">
            <path className="layer-path layer-3" d="M50,15 L85,32.5 L50,50 L15,32.5 Z" fill="none" stroke="url(#preloader-logo-grad)" strokeWidth="2.5" />
            <path className="layer-path layer-2" d="M50,30 L85,47.5 L50,65 L15,47.5 Z" fill="none" stroke="url(#preloader-logo-grad)" strokeWidth="2.5" />
            <path className="layer-path layer-1" d="M50,45 L85,62.5 L50,80 L15,62.5 Z" fill="none" stroke="url(#preloader-logo-grad)" strokeWidth="2.5" />
            <defs>
              <linearGradient id="preloader-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="preloader-title">
          <span>AETHERIA</span>
        </h1>
        
        <p className="preloader-subtitle text-gradient">ALL-ELECTRIC VELOCITY</p>

        <div className="preloader-progress-container">
          <div className="preloader-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <div className="preloader-terminal">
          <div className="terminal-cursor" />
          <span className="terminal-text">&gt; {logs[logIndex]}</span>
        </div>
      </div>
    </div>
  );
}
