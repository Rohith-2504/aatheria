import React from 'react';
import { Star } from 'lucide-react';
import './Testimonials.css';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Dr. Aris Vance',
      role: 'Chief Engineer at AeroOrbit',
      text: "Aatheria's titanium DMLS prints were a complete game-changer for our satellite brackets. The micrometer precision achieved weight-savings and micro-tolerances we couldn't get from subtractive tooling.",
      stars: 5,
      initials: 'AV',
      gradient: 'linear-gradient(135deg, #7c3aed, #06b6d4)'
    },
    {
      name: 'Clara Dubois',
      role: 'Hardware Lead at BioMed Labs',
      text: 'We printed microfluidic valves using their soluble support structures. The internal cavities came out perfectly smooth, clean, and completely free of composite residues. Outstanding detail.',
      stars: 5,
      initials: 'CD',
      gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)'
    },
    {
      name: 'Viktor Sterling',
      role: 'Founder of VeloDesigns',
      text: 'Uploading STL mesh profiles, selecting our spool parameters, and registering the print job was done in minutes. The active heated chamber kept our carbon fiber shells perfectly straight.',
      stars: 5,
      initials: 'VS',
      gradient: 'linear-gradient(135deg, #ec4899, #7c3aed)'
    }
  ];

  return (
    <section id="testimonials" className="testimonials-section section">
      <div className="container">
        <div className="section-header">
          <span className="tagline">Client Feedback</span>
          <h2>What Product Designers Say</h2>
          <p>Read reviews from aerospace engineers, industrial designers, and medical device hardware architects.</p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((rev, idx) => (
            <div key={idx} className="testimonial-card glassmorphic-panel" data-cursor-lock>
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
