import React from 'react';
import { Zap, Battery, Wind, Sliders, Shield, Activity } from 'lucide-react';
import './Features.css';

export default function Features() {
  const features = [
    {
      icon: <Zap size={24} />,
      title: '1,900 HP Tri-Motor Drivetrain',
      desc: 'An ultra-high performance tri-motor setup delivering instant all-wheel vectoring, achieving 0-60 mph in a blistering 1.8 seconds.'
    },
    {
      icon: <Battery size={24} />,
      title: 'Quantum Battery Core',
      desc: 'Next-generation solid-state battery architecture offering 500+ miles of range with 15-minute ultra-fast DC charging.'
    },
    {
      icon: <Wind size={24} />,
      title: 'Active Aero Dynamics',
      desc: 'Dynamic carbon splitters, active rear wing spoilers, and ground-effect venturi channels that automatically adapt to velocity.'
    },
    {
      icon: <Sliders size={24} />,
      title: 'AI Active Suspensions',
      desc: 'Track-reading active dampers adjusting torque vectoring and ride height 1,000 times per second for unmatched stability.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Monocoque Carbon Core',
      desc: 'Ultra-lightweight pre-preg carbon-fiber tub designed for maximum structural rigidity, ensuring F1-level crash protection.'
    },
    {
      icon: <Activity size={24} />,
      title: 'Secure Telemetry Ledger',
      desc: 'Cryptographically signed telematics, lap performance, and diagnostic logs committed directly to the secure onboard registry.'
    }
  ];

  return (
    <section id="features" className="features-section section">
      <div className="container">
        <div className="section-header">
          <span className="tagline">Specifications</span>
          <h2>Engineered for Absolute Performance</h2>
          <p>The Aetheria Hyper-GT combines race-ready aerodynamics with bleeding-edge electric powertrain engineering.</p>
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
