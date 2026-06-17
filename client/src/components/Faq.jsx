import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Faq.css';

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: 'How does the digital allocation registry secure my reservation?',
      a: 'When you submit your configuration build, a secure registry token is generated and bound to your details in our database ledger. This reserves a physical chassis and VIN slot on our assembly line in chronological order of submission.'
    },
    {
      q: 'What details can I customize in my bespoke GT commission?',
      a: 'Aetheria offers a complete styling configurator. You can request bespoke paint options (such as liquid carbon tints), specific interior cabin materials (such as hand-stitched Alcantara), steering wheel ergonomics, and track-suspension tuning characteristics.'
    },
    {
      q: 'How can I view and monitor my active allocation status?',
      a: 'Once registered, your submission status is logged live in the Active Allocation Registry at the bottom of this page. As manufacturing steps begin (from chassis alignment to paint applications), you can track progress directly.'
    },
    {
      q: 'Is the deposit fully refundable if my plans change?',
      a: 'Yes. Standard and Track Edition allocation deposits are 100% refundable up until the physical chassis registry takes place (typically 14 days post-validation). Bespoke Signature commissions require a non-refundable custom panel deposit once engineering blueprints are signed.'
    },
    {
      q: 'What charging standards does Aetheria support?',
      a: 'Our quantum-battery energy cells utilize a dual-voltage high-capacity battery pack compatible with both NACS (Tesla Supercharger network) and CCS high-speed charging protocols, allowing for a 10% to 80% charge in just 15 minutes.'
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
          <p>Everything you need to know about the allocation process, design customizations, active vehicle support, and battery charging.</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`faq-item glassmorphic-panel ${activeIndex === idx ? 'open' : ''}`}
              onClick={() => toggleAccordion(idx)}
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
