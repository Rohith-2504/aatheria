import React from 'react';
import { Check } from 'lucide-react';
import './Benefits.css';
import printerImage from './aatheria_printer.png';

export default function Benefits() {
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
            <div className="benefit-item" data-cursor-lock>
              <div className="benefit-icon">
                <Check size={18} />
              </div>
              <div className="benefit-details">
                <h4>Zero Tooling Setup Costs</h4>
                <p>Skip expensive CNC machining start-up overheads. Go straight from CAD file upload to physical printing.</p>
              </div>
            </div>

            <div className="benefit-item" data-cursor-lock>
              <div className="benefit-icon">
                <Check size={18} />
              </div>
              <div className="benefit-details">
                <h4>Infinite Geometric Complexity</h4>
                <p>Print hollow internal chambers, cooling channels, and nested assemblies that are impossible with subtractive tools.</p>
              </div>
            </div>

            <div className="benefit-item" data-cursor-lock>
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
          <div className="benefits-image-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img 
              src={printerImage} 
              alt="Aatheria Industrial SLS Printer" 
              data-cursor-lock
              style={{
                width: '100%',
                maxWidth: '520px',
                borderRadius: '16px',
                border: '1px solid rgba(124, 58, 237, 0.25)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.55), 0 0 30px rgba(124, 58, 237, 0.12)',
                display: 'block'
              }} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
