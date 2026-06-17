import React from 'react';
import { Check, HelpCircle } from 'lucide-react';
import './Pricing.css';

export default function Pricing() {
  const tiers = [
    {
      name: 'Rapid Prototyping',
      price: '$49',
      period: 'per print job',
      desc: 'Lightweight FDM prints using standard PLA, PETG, and ABS polymers.',
      features: [
        'FDM (Fused Deposition Modeling)',
        'Standard filaments (PLA, ABS, PETG)',
        'Layer resolution down to 100 microns',
        'Standard infill structures (Rectilinear)',
        'Next-day local pickup/delivery'
      ],
      cta: 'Configure FDM Job',
      popular: false
    },
    {
      name: 'Engineering Grade',
      price: '$199',
      period: 'per print job',
      desc: 'High-strength SLA resin and FDM composite parts using carbon fiber.',
      features: [
        'Dual-nozzle PEEK & Carbon Fiber spools',
        'SLA (Stereolithography) liquid photopolymer',
        'Layer resolution down to 20 microns',
        'Dynamic infill structures (Gyroid/Hexagonal)',
        'Soluble polymer supports package',
        'Priority print queue scheduling'
      ],
      cta: 'Configure SLA Job',
      popular: true
    },
    {
      name: 'Industrial Metals',
      price: 'Custom',
      period: 'tailored blueprints',
      desc: 'Direct Metal Laser Sintering (DMLS) for production steel and titanium.',
      features: [
        'Direct Metal Laser Sintering (DMLS)',
        'Sintered titanium, steel, and aluminum',
        'Aerospace-certified structural density',
        'Post-print CNC threading and finishing',
        '1-on-1 print engineer file validation',
        'Global enclosed shipping logistics'
      ],
      cta: 'Request Metal Quote',
      popular: false
    }
  ];

  const handleCTAClick = (e) => {
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
    }
  };

  return (
    <section id="pricing" className="pricing-section section">
      <div className="container">
        <div className="section-header">
          <span className="tagline">Printing Tiers</span>
          <h2>Select Your Configuration</h2>
          <p>Choose your material and technology tier. Every request instantiates a secure spool allocation.</p>
        </div>

        <div className="pricing-grid">
          {tiers.map((tier, idx) => (
            <div key={idx} className={`pricing-card ${tier.popular ? 'popular glassmorphic-panel' : 'glassmorphic-panel'}`}>
              {tier.popular && <span className="popular-badge">Highly Requested</span>}
              <div className="tier-header">
                <h3>{tier.name}</h3>
                <p className="tier-desc">{tier.desc}</p>
                <div className="price-container">
                  <span className="price-value">{tier.price}</span>
                  {tier.price !== 'Custom' && <span className="price-period"> | {tier.period}</span>}
                </div>
              </div>

              <div className="tier-divider"></div>

              <ul className="tier-features">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx}>
                    <Check size={16} className="feature-check-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a 
                href="#lead-form" 
                onClick={handleCTAClick}
                className={`btn pricing-cta ${tier.popular ? 'btn-primary' : 'btn-secondary'}`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
