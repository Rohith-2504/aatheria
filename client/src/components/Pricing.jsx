import React from 'react';
import { Check, HelpCircle } from 'lucide-react';
import './Pricing.css';

export default function Pricing() {
  const tiers = [
    {
      name: 'Chassis Standard',
      price: '$240,000',
      period: 'base allocation',
      desc: 'High-performance all-electric hyper-GT base build with standard specifications.',
      features: [
        'Tri-Motor 1,200 HP Powertrain',
        'Liquid-cooled lithium cell core (350-mi)',
        'Standard carbon aerodynamics',
        'Factory paint palette options',
        'Secure digital VIN registry reservation'
      ],
      cta: 'Reserve Standard Spec',
      popular: false
    },
    {
      name: 'Track Edition',
      price: '$320,000',
      period: 'performance spec',
      desc: 'Track-ready performance package with active aerodynamics and suspension.',
      features: [
        'Full 1,900 HP upgrade (torque vectoring)',
        'Active ground-effects & wing spoilers',
        'Track-calibrated AI active dampers',
        'Carbon ceramic brakes + Michelin Cup 2 R',
        'Integrated telemetry & data log storage',
        'Priority build allocation (12-mo delivery)'
      ],
      cta: 'Reserve Track Spec',
      popular: true
    },
    {
      name: 'Bespoke Signature',
      price: 'Custom',
      period: 'tailored commission',
      desc: 'One-of-one custom commission built to your exact design blueprints.',
      features: [
        'Custom hand-laid colored carbon-fiber weave',
        'Tailored Italian Alcantara cabin design',
        '1-on-1 access to Aetheria design lead',
        'Dedicated trackside race engineer support',
        'Global enclosed transporter delivery',
        'Lifetime allocation maintenance support'
      ],
      cta: 'Inquire Bespoke Build',
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
          <span className="tagline">Allocation Tiers</span>
          <h2>Secure Your Commission</h2>
          <p>Select your base configuration tier. Every allocation reserves a slot in our security registry.</p>
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
