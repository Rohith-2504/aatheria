import React, { useState } from 'react';
import { Check, Code, Zap, ShieldAlert, Printer } from 'lucide-react';
import './Benefits.css';

export default function Benefits() {
  const [activeTab, setActiveTab] = useState('aether');

  const legacyCode = `; 🚫 Legacy Manual G-Code Coordinates
G21 ; Set units to millimeters
G90 ; Absolute positioning
M104 S200 ; Set extruder temp
G28 X0 Y0 Z0 ; Home all axes
G1 F1200 X45.2 Y78.4 Z0.2 E0.035 ; Brittle manual extrusion
G1 F1500 X47.8 Y80.2 Z0.2 E0.078 ; Hardcoded toolpath`;

  const aetherCode = `//  Aatheria Dynamic Print Profile
const printJob = {
  jobId: "AATH-PRNT-830-2026",
  materials: {
    primary: "PEEK-Carbon",
    supports: "PVA-Soluble"
  },
  slicerParameters: {
    layerHeight: 0.02,   // mm (20 microns)
    infillDensity: 0.40, // 40% Gyroid infill
    chamberTemp: 80      // °C active control
  },
  queueStatus: "JOB_LOCKED"
};`;

  return (
    <section id="benefits" className="benefits-section section">
      <div className="container benefits-grid">
        <div className="benefits-content">
          <span className="tagline">Process & Efficiency</span>
          <h2>Reinventing Manufacturing</h2>
          <p className="benefits-lead-text">
            Break free from tooling limitations. Aatheria replaces traditional injection molds and CNC subtractive milling with software-driven additive fabrication.
          </p>

          <div className="benefit-items">
            <div className="benefit-item">
              <div className="benefit-icon">
                <Check size={18} />
              </div>
              <div className="benefit-details">
                <h4>Zero Tooling Setup Costs</h4>
                <p>Skip expensive CNC machining start-up overheads. Go straight from CAD file upload to physical printing.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <Check size={18} />
              </div>
              <div className="benefit-details">
                <h4>Infinite Geometric Complexity</h4>
                <p>Print hollow internal chambers, cooling channels, and nested assemblies that are impossible with subtractive tools.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <Check size={18} />
              </div>
              <div className="benefit-details">
                <h4>90% Less Material Waste</h4>
                <p>Additive layering deposits raw filaments and powders exactly where needed, reducing high-end composite scrap.</p>
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
                <Printer size={14} /> Aatheria Software
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
