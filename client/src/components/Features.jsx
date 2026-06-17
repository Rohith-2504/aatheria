import React from 'react';
import { Layers, Activity, Sliders, Shield, Zap, Target } from 'lucide-react';
import './Features.css';

export default function Features() {
  const features = [
    {
      icon: <Target size={24} />,
      title: 'Ultra-Fine 20µm Layer Height',
      desc: 'Micrometer precision for stereolithography (SLA) and DMLS builds, matching industrial injection molding tolerances.'
    },
    {
      icon: <Layers size={24} />,
      title: 'PEEK & Titanium Metallurgy',
      desc: 'Print with aerospace-grade carbon fiber filaments, PEEK polymers, or direct-metal sintered titanium and steel alloys.'
    },
    {
      icon: <Sliders size={24} />,
      title: 'Active Heated Chambers',
      desc: 'Real-time chamber temperature regulation up to 200°C to eliminate warping, layer separation, and mechanical weaknesses.'
    },
    {
      icon: <Zap size={24} />,
      title: 'AI Toolpath Correction',
      desc: 'High-speed optical scanners verify extrusion paths in real-time, instantly adjusting feed rates to avoid nozzle errors.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Soluble Support Matrix',
      desc: 'Dual-nozzle printing handles complex internal geometries using water-soluble polymers for clean hollow assemblies.'
    },
    {
      icon: <Activity size={24} />,
      title: 'Secure Print Telemetry',
      desc: 'Spool weights, laser frequencies, and layer-by-layer diagnostic logs are cryptographically written to our secure ledger.'
    }
  ];

  return (
    <section id="features" className="features-section section">
      <div className="container">
        <div className="section-header">
          <span className="tagline">Capabilities</span>
          <h2>Additive Precision at Scale</h2>
          <p>The Aatheria manufacturing portal provides state-of-the-art multi-material printing with micron-level tolerance checks.</p>
        </div>

        <div className="features-grid">
          {features.map((feat, idx) => (
            <div key={idx} className="feature-card glassmorphic-panel">
              <div className="feature-icon-box">
                {feat.icon}
              </div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
