import React from 'react';
import { Star } from 'lucide-react';
import './Testimonials.css';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Marcus Vance',
      role: 'Chief Editor at Apex Magazine',
      text: 'The Aetheria Hyper-GT is an absolute paradigm shift. Launching this tri-motor beast out of a corner feels like breaking the laws of physics. The torque vectoring reacts faster than human synapses.',
      stars: 5,
      initials: 'MV',
      gradient: 'linear-gradient(135deg, #7c3aed, #06b6d4)'
    },
    {
      name: 'Clara Dubois',
      role: 'Pro Racing Driver & Development Pilot',
      text: 'We pushed the Track Edition at Nürburgring. The active ground-effects and AI suspension keeping 1,900 HP glued to the tarmac is a masterclass in dynamic engineering. Truly breathtaking.',
      stars: 5,
      initials: 'CD',
      gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)'
    },
    {
      name: 'Viktor Sterling',
      role: 'Bespoke Collector & Client',
      text: 'The allocation and design process was completely seamless. Ordering my one-of-one Liquid Carbon commission was done directly through their secure registry, and the delivery was pristine.',
      stars: 5,
      initials: 'VS',
      gradient: 'linear-gradient(135deg, #ec4899, #7c3aed)'
    }
  ];

  return (
    <section id="testimonials" className="testimonials-section section">
      <div className="container">
        <div className="section-header">
          <span className="tagline">Test Pilots</span>
          <h2>What the Experts Say</h2>
          <p>Read performance reports and initial driving impressions from top automotive publications and test pilots.</p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((rev, idx) => (
            <div key={idx} className="testimonial-card glassmorphic-panel">
              <div className="stars-row">
                {[...Array(rev.stars)].map((_, sIdx) => (
                  <Star key={sIdx} size={16} fill="var(--color-secondary)" color="var(--color-secondary)" />
                ))}
              </div>
              <p className="testimonial-text">"{rev.text}"</p>
              <div className="user-profile">
                <div className="profile-avatar" style={{ background: rev.gradient }}>
                  {rev.initials}
                </div>
                <div className="user-details">
                  <h4>{rev.name}</h4>
                  <p>{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
