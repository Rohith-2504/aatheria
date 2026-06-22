import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Faq.css';

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: 'What file formats are supported for print uploads?',
      a: 'We support standard STL, OBJ, and STEP vector file formats. All uploads are dynamically parsed and run through automatic mesh checks before they are sliced.'
    },
    {
      q: 'How does the active temperature chamber improve print quality?',
      a: "Aatheria's printers utilize active heated build envelopes (up to 200°C). By keeping ambient heat high during printing, we reduce internal stresses, preventing composite shrinkage and delamination."
    },
    {
      q: 'How is my print queue spot and pricing calculated?',
      a: 'Pricing is based on structural volume (cc) and material selected (Rapid Prototyping, Engineering, Metals). Once you submit a quote request, the spool weight is logged to our database queue in real-time.'
    },
    {
      q: 'Can I request post-print finishing and threaded tapping?',
      a: 'Yes. For Engineering and Industrial Metal tiers, we offer high-tolerance post-processing, including CNC thread tapping, surface sandblasting, and media polishing.'
    },
    {
      q: 'What materials are available for printing?',
      a: 'We carry standard PLA, ABS, PETG, high-temp nylon, SLA resin photopolymers, carbon fiber composites, and direct-metal sintered titanium.'
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section section">
      <div className="container faq-container">
        <div className="section-header">
          <span className="tagline">Got Questions?</span>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about supported file formats, material tolerances, queue slots, and post-processing.</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`faq-item glassmorphic-panel ${activeIndex === idx ? 'open' : ''}`}
              onClick={() => toggleAccordion(idx)}
              data-cursor-lock
            >
              <button className="faq-question">
                <span>{faq.q}</span>
                <ChevronDown size={18} className="faq-chevron" />
              </button>
              <div className="faq-answer-wrapper">
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
