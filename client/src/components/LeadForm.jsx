import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import './LeadForm.css';

export default function LeadForm({ isHighlighted, user }) {
  // Form fields state
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    city: '',
    message: '',
    tier: 'standard'
  });

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Submission lifecycle states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  // Prefill details from authenticated user
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.username ? `${user.username}@aatheria.com` : ''
      }));
    }
  }, [user]);

  // Validation helper
  const validateField = (name, value) => {
    let errorMsg = '';
    const cleanValue = String(value || '').trim();

    switch (name) {
      case 'full_name':
        if (!cleanValue) {
          errorMsg = 'Full Name is required.';
        } else if (cleanValue.length < 2) {
          errorMsg = 'Full Name must be at least 2 characters.';
        } else if (cleanValue.length > 100) {
          errorMsg = 'Full Name must be under 100 characters.';
        } else if (!/^[a-zA-Z\s\-'.]+$/.test(cleanValue)) {
          errorMsg = 'Full Name contains invalid characters (letters, spaces, hyphens, and dots only).';
        }
        break;
      case 'mobile_number':
        const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
        const digitsOnly = cleanValue.replace(/\D/g, '');
        if (!cleanValue) {
          errorMsg = 'Mobile Number is required.';
        } else if (!phoneRegex.test(cleanValue) || digitsOnly.length < 7 || digitsOnly.length > 15) {
          errorMsg = 'Enter a valid mobile number (7-15 digits).';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!cleanValue) {
          errorMsg = 'Email Address is required.';
        } else if (!emailRegex.test(cleanValue)) {
          errorMsg = 'Please enter a valid email address.';
        }
        break;
      case 'city':
        if (!cleanValue) {
          errorMsg = 'City is required.';
        } else if (cleanValue.length < 2) {
          errorMsg = 'City must be at least 2 characters.';
        } else if (cleanValue.length > 50) {
          errorMsg = 'City must be under 50 characters.';
        }
        break;
      case 'message':
        if (!cleanValue) {
          errorMsg = 'Bespoke specifications are required.';
        } else if (cleanValue.length < 10) {
          errorMsg = 'Bespoke specifications must be at least 10 characters.';
        } else if (cleanValue.length > 1000) {
          errorMsg = 'Bespoke specifications must be under 1000 characters.';
        }
        break;
      default:
        break;
    }
    return errorMsg;
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on-the-fly once the user has interacted with the field
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Blur handler to trigger validation when leaving field
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Mark all fields as touched and validate
    const newErrors = {};
    const touchedState = {};
    Object.keys(formData).forEach(key => {
      touchedState[key] = true;
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setTouched(touchedState);
    setErrors(newErrors);

    // If there are validation errors, block submission
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitSuccess(true);
        setFormData(prev => ({
          ...prev,
          mobile_number: '',
          city: '',
          message: '',
          tier: 'standard'
        }));
        setErrors({});
        setTouched({});
        
        // Trigger live WebGL 3D configurator animation pipeline in Hero.jsx
        window.dispatchEvent(new CustomEvent('lead-submitted'));
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        setServerError(result.message || 'Server validation failed. Please check inputs.');
      }
    } catch (err) {
      setServerError('Unable to connect to the server. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmitSuccess(false);
  };

  return (
    <section id="lead-form" className="lead-section section">
      <div className="container lead-container">
        <div className="section-header">
          <span className="tagline">Secure Print Queue</span>
          <h2>Aatheria 3D Print Quote Builder</h2>
          <p>Complete your print profile to register your bespoke print job slot. Spool weight and parameters are logged live to our active print queue.</p>
        </div>

        <div className={`lead-card-wrapper glassmorphic-panel ${isHighlighted ? 'highlighted' : ''}`}>
          {submitSuccess ? (
            <div className="success-screen">
              <CheckCircle2 className="success-icon" size={64} />
              <h3>Print Request Registered!</h3>
              <p className="success-message">
                Your print specifications were successfully validated and committed to the Aatheria queue.
              </p>
              <div className="success-details">
                <p><strong>Queue Database:</strong> server/data/submissions.db</p>
                <p><strong>Queue Table:</strong> submissions</p>
              </div>
              <button onClick={handleResetForm} className="btn btn-primary" data-cursor-lock>
                Configure Another Job
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="lead-form">
              {serverError && (
                <div className="form-alert error">
                  <AlertCircle size={18} />
                  <span>{serverError}</span>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="full_name">Full Name</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Jane Doe"
                    className={touched.full_name && errors.full_name ? 'invalid' : ''}
                  />
                  {touched.full_name && errors.full_name && (
                    <span className="error-message">{errors.full_name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="mobile_number">Mobile Number</label>
                  <input
                    type="text"
                    id="mobile_number"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+1 (555) 019-2834"
                    className={touched.mobile_number && errors.mobile_number ? 'invalid' : ''}
                  />
                  {touched.mobile_number && errors.mobile_number && (
                    <span className="error-message">{errors.mobile_number}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="jane@company.com"
                    className={touched.email && errors.email ? 'invalid' : ''}
                  />
                  {touched.email && errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="San Francisco"
                    className={touched.city && errors.city ? 'invalid' : ''}
                  />
                  {touched.city && errors.city && (
                    <span className="error-message">{errors.city}</span>
                  )}
                </div>
              </div>

              {/* Tier Selection Dropdown */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tier">Spool Material & Tech Tier</label>
                  <select
                    id="tier"
                    name="tier"
                    value={formData.tier}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      color: '#f1f5f9',
                      fontSize: '0.95rem',
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="standard" style={{ background: '#03000a' }}>Rapid Prototyping - FDM PLA ($49 base)</option>
                    <option value="track" style={{ background: '#03000a' }}>Engineering Grade - SLA Resin ($199 base)</option>
                    <option value="bespoke" style={{ background: '#03000a' }}>Industrial Metals - SLS Titanium (Custom)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Print Dimensions, Structural Density, or layer height goals (cc)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  placeholder="Describe your printing goals (e.g. 40% Gyroid infill density, SLA clear resin, STL file download link - minimum 10 characters)..."
                  className={touched.message && errors.message ? 'invalid' : ''}
                ></textarea>
                {touched.message && errors.message && (
                  <span className="error-message">{errors.message}</span>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="btn btn-primary submit-btn"
                data-cursor-lock
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="spinner" /> Queueing Print Job...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Queue Print Job
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
