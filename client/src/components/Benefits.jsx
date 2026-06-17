import React, { useState } from 'react';
import { Check, Code, Zap, ShieldAlert, Car } from 'lucide-react';
import './Benefits.css';

export default function Benefits() {
  const [activeTab, setActiveTab] = useState('aether');

  const legacyCode = `// 🚫 Legacy Supercar Analog Configuration
struct VehicleSettings {
  float mechanical_diff_bias = 0.65; // Fixed front-rear
  float wastegate_pressure = 1.2;     // Turbo mechanical lag
  int damping_clicks = 8;             // Manual shock adjuster
  
  // No real-time sensor network integration
  char vin_ledger[17] = "LEGACY_DEALER_ID";
};`;

  const aetherCode = `//  Aetheria Active Torque & Aero Matrix
const chassisAllocation = {
  vin: "AETH-GT-092-2026",
  torqueVectoring: {
    frontLeft: 450,  // Nm dynamic
    frontRight: 450, // Nm dynamic
    rearActive: 1000 // Nm track bias
  },
  aerodynamics: {
    spoilerAngle: 24.5, // degrees dynamic
    venturiVentOpen: true
  },
  registryStatus: "CHASSIS_LOCKED"
};`;

  return (
    <section id="benefits" className="benefits-section section">
      <div className="container benefits-grid">
        <div className="benefits-content">
          <span className="tagline">Design & Architecture</span>
          <h2>Reinventing Hypercar Design</h2>
          <p className="benefits-lead-text">
            Break free from mechanical limitations. The Aetheria Hyper-GT replaces traditional mechanics with software-defined performance and active electric vectoring.
          </p>

          <div className="benefit-items">
            <div className="benefit-item">
              <div className="benefit-icon">
                <Check size={18} />
              </div>
              <div className="benefit-details">
                <h4>Instant Dynamic Torque Vectoring</h4>
                <p>Three high-torque electric motors adjust output per-wheel every microsecond, defeating physical turbo lag.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <Check size={18} />
              </div>
              <div className="benefit-details">
                <h4>Active Aerodynamics Package</h4>
                <p>Venturi ground-effect wind tunnels open and close automatically to stick the vehicle to the road during high-speed cornering.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <Check size={18} />
              </div>
              <div className="benefit-details">
                <h4>Direct Secure Registry Allocation</h4>
                <p>Skip intermediate dealership markups. Build your vehicle configurations directly into our persistent SQLite digital registry.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="benefits-visual">
          <div className="code-card glassmorphic-panel">
            <div className="code-card-tabs">
              <button 
                className={`code-tab-btn legacy ${activeTab === 'legacy' ? 'active' : ''}`}
                onClick={() => setActiveTab('legacy')}
              >
                <ShieldAlert size={14} /> Legacy Analog
              </button>
              <button 
                className={`code-tab-btn aether ${activeTab === 'aether' ? 'active' : ''}`}
                onClick={() => setActiveTab('aether')}
              >
                <Car size={14} /> Aetheria Software
              </button>
            </div>
            <div className="code-body">
              <pre>
                <code>
                  {activeTab === 'legacy' ? legacyCode : aetherCode}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
