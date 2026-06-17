// Aatheria Entrance Auth Panel - Client and Registry Controller Gateways
import React, { useState } from 'react';
import { Shield, User, Lock, Mail, ArrowRight, Loader2, Key } from 'lucide-react';
import './Auth.css';

export default function Auth({ onAuthSuccess }) {
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [formData, setFormData] = useState({
    username: 'client',
    password: 'client123'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { username, password } = formData;

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = '/api/auth/signin';
      const payload = { username, password, role: isAdmin ? 'admin' : 'user' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess('Sign in successful!');
        setTimeout(() => {
          onAuthSuccess(result.user);
        }, 1000);
      } else {
        setError(result.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('Unable to reach the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay animate-fadeIn">
      <div className="auth-matrix" />
      <div className="auth-glow auth-glow-purple" />
      <div className="auth-glow auth-glow-cyan" />

      <div className="auth-container glassmorphic-panel">
        <div className="auth-header">
          <div className="auth-logo-icon">
            {isAdmin ? <Shield size={28} /> : <User size={28} />}
          </div>
          <h2>AATHERIA</h2>
          <p className="text-gradient">HIGH-PRECISION FABRICATION</p>
        </div>

        {/* Portal Role Selector */}
        <div className="role-selector-wrapper">
          <button 
            type="button"
            className={`role-btn ${!isAdmin ? 'active' : ''}`}
            onClick={() => {
              setIsAdmin(false);
              setError('');
              setFormData({
                username: 'client',
                password: 'client123'
              });
            }}
          >
            Client Portal
          </button>
          <button 
            type="button"
            className={`role-btn ${isAdmin ? 'active' : ''}`}
            onClick={() => {
              setIsAdmin(true);
              setError('');
              setFormData({
                username: 'admin',
                password: 'admin123'
              });
            }}
          >
            Operator Dashboard
          </button>
        </div>

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="auth-form">
          <h3 className="auth-form-title">
            {isAdmin ? 'Admin ' : 'Client '} Access Gate
          </h3>

          {error && <div className="auth-alert error">{error}</div>}
          {success && <div className="auth-alert success">{success}</div>}

          <div className="auth-credentials-hint" style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '0.85rem',
            color: '#94a3b8',
            lineHeight: '1.4'
          }}>
            <strong>Default Access Credentials:</strong><br />
            Username: <code style={{color: '#22d3ee', fontWeight: 'bold'}}>{isAdmin ? 'admin' : 'client'}</code><br />
            Password: <code style={{color: '#22d3ee', fontWeight: 'bold'}}>{isAdmin ? 'admin123' : 'client123'}</code>
          </div>

          <div className="auth-group">
            <label htmlFor="username">Username</label>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                required
              />
            </div>
          </div>

          <div className="auth-group">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="spinner" /> Authenticating...
              </>
            ) : (
              <>
                Gain Entrance <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
