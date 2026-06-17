import React, { useState, useEffect } from 'react';
import { Database, AlertCircle, CheckCircle2, Loader2, RefreshCw, LogOut, DollarSign, ShoppingBag, Clock, FileText } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard({ user, onLogout }) {
  const [leadsList, setLeadsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  
  const fetchAllocations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/submissions');
      const result = await response.json();
      if (result.success) {
        setLeadsList(result.data);
      } else {
        setError(result.message || 'Failed to fetch allocations.');
      }
    } catch (err) {
      setError('Unable to connect to the server to fetch allocations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const handleStatusToggle = async (id, currentStatus) => {
    setUpdatingId(id);
    const nextStatus = currentStatus === 'pending' ? 'sold' : 'pending';
    try {
      const response = await fetch(`/api/submissions/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        // Refresh local items list state
        setLeadsList(prev => prev.map(lead => lead.id === id ? { ...lead, status: nextStatus } : lead));
      } else {
        alert(result.message || 'Failed to update allocation status.');
      }
    } catch (err) {
      alert('Unable to reach server. Status update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Compute metrics
  const totalRequests = leadsList.length;
  const pendingOrders = leadsList.filter(item => item.status === 'pending').length;
  const soldOrders = leadsList.filter(item => item.status === 'sold').length;

  const calculateEarnings = () => {
    return leadsList.reduce((sum, item) => {
      if (item.status !== 'sold') return sum;
      if (item.tier === 'track') return sum + 320000;
      if (item.tier === 'bespoke') return sum + 450000;
      return sum + 240000; // standard
    }, 0);
  };

  const totalEarnings = calculateEarnings();

  return (
    <div className="admin-container animate-fadeIn">
      <div className="admin-header glassmorphic-panel">
        <div className="admin-title-row">
          <div>
            <span className="tagline">Registry Management</span>
            <h2>Aetheria Registry Control</h2>
          </div>
          <div className="admin-user-badge">
            <span className="user-indicator admin"></span>
            <span>Admin: <strong>{user?.full_name || user?.username}</strong></span>
            <button onClick={onLogout} className="btn-logout" title="Exit Dashboard">
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card glassmorphic-panel">
          <div className="metric-icon earnings">
            <DollarSign size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Total Earnings</span>
            <h3 className="metric-val">${totalEarnings.toLocaleString()}</h3>
            <span className="metric-meta">From sold configurations</span>
          </div>
        </div>

        <div className="metric-card glassmorphic-panel">
          <div className="metric-icon sold">
            <ShoppingBag size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Allocations Sold</span>
            <h3 className="metric-val">{soldOrders}</h3>
            <span className="metric-meta">Chassis registry locked</span>
          </div>
        </div>

        <div className="metric-card glassmorphic-panel">
          <div className="metric-icon pending">
            <Clock size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Pending Builds</span>
            <h3 className="metric-val">{pendingOrders}</h3>
            <span className="metric-meta">Needs validation & registration</span>
          </div>
        </div>

        <div className="metric-card glassmorphic-panel">
          <div className="metric-icon total">
            <FileText size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Total Requests</span>
            <h3 className="metric-val">{totalRequests}</h3>
            <span className="metric-meta">Build configurator entries</span>
          </div>
        </div>
      </div>

      {/* Main Allocations Table */}
      <div className="admin-table-card glassmorphic-panel">
        <div className="card-header-row">
          <h3>Active Allocation Requests</h3>
          <button onClick={fetchAllocations} disabled={loading} className="btn btn-secondary refresh-btn">
            {loading ? <Loader2 size={14} className="spinner" /> : <RefreshCw size={14} />} Refresh Registry
          </button>
        </div>

        {error && (
          <div className="form-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {leadsList.length === 0 ? (
          <div className="empty-table-state">
            <p>{loading ? 'Retrieving records...' : 'No allocations found in database. Lead form entries will show here.'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Build ID</th>
                  <th>Client Profile</th>
                  <th>Contact info</th>
                  <th>City</th>
                  <th>Configuration Spec</th>
                  <th>Chassis Tier</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leadsList.map((lead) => {
                  const isSold = lead.status === 'sold';
                  const tierLabel = lead.tier === 'track' ? 'Track Edition' : lead.tier === 'bespoke' ? 'Bespoke Signature' : 'Chassis Standard';
                  const tierPrice = lead.tier === 'track' ? '$320,000' : lead.tier === 'bespoke' ? '$450,000' : '$240,000';

                  return (
                    <tr key={lead.id} className="table-row">
                      <td className="lead-id">#AETH-{String(lead.id).padStart(3, '0')}</td>
                      <td className="lead-name">
                        <div className="profile-cell">
                          <strong>{lead.full_name}</strong>
                          <span>{lead.email}</span>
                        </div>
                      </td>
                      <td>{lead.mobile_number}</td>
                      <td>{lead.city}</td>
                      <td className="lead-message" title={lead.message}>{lead.message}</td>
                      <td>
                        <span className={`badge-tier ${lead.tier}`}>
                          {tierLabel} ({tierPrice})
                        </span>
                      </td>
                      <td>
                        <span className={`badge-status ${lead.status}`}>
                          {isSold ? 'Sold' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button
                          disabled={updatingId === lead.id}
                          onClick={() => handleStatusToggle(lead.id, lead.status)}
                          className={`btn-action-status ${isSold ? 'revert' : 'confirm'}`}
                        >
                          {updatingId === lead.id ? (
                            <Loader2 size={12} className="spinner" />
                          ) : isSold ? (
                            'Revert Pending'
                          ) : (
                            'Confirm Sale'
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Raw SQLite Database Inspector */}
      <div className="admin-table-card inspector-card glassmorphic-panel">
        <div className="card-header-row">
          <div className="inspector-header-title">
            <Database size={18} className="database-icon-heading" />
            <h3>Raw Database Ledger</h3>
            <span className="database-indicator online"></span>
          </div>
        </div>
        <p className="inspector-desc">
          Direct SQLite read interface of table <code>submissions</code> inside <code>server/data/submissions.db</code>.
        </p>

        {leadsList.length === 0 ? (
          <div className="empty-table-state">
            <p>No rows in submissions table.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="inspector-raw-table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>full_name</th>
                  <th>mobile_number</th>
                  <th>email</th>
                  <th>city</th>
                  <th>message</th>
                  <th>tier</th>
                  <th>status</th>
                  <th>created_at</th>
                </tr>
              </thead>
              <tbody>
                {leadsList.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.full_name}</td>
                    <td>{row.mobile_number}</td>
                    <td>{row.email}</td>
                    <td>{row.city}</td>
                    <td className="raw-message-cell">{row.message}</td>
                    <td>{row.tier}</td>
                    <td>{row.status}</td>
                    <td>{row.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
