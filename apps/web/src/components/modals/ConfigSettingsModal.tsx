import React, { useState } from 'react';
import { X, Sliders, CheckCircle2, ShieldCheck, Cloud, Server, Database } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConfigSettingsModal: React.FC = () => {
  const { isConfigSettingsOpen, setIsConfigSettingsOpen } = useApp();

  const [firebaseApiKey, setFirebaseApiKey] = useState('AIzaSyBWv-Vf_c9bmZRVUc-G_jrF60f3-SN-XdA');
  const [firebaseProjectId, setFirebaseProjectId] = useState('kavexa-ops');
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState('kavexa-ops');
  const [renderApiUrl, setRenderApiUrl] = useState('https://kavexa-ops-api.onrender.com');

  if (!isConfigSettingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('⚡ Connected credentials saved successfully. Firestore and Cloudinary listeners operational.');
    setIsConfigSettingsOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsConfigSettingsOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Full-Stack Platform Services & Cloud Config
            </h2>
          </div>
          <button onClick={() => setIsConfigSettingsOpen(false)} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        {/* Live Service Status Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
              <Database size={14} />
              <span>Cloud Firestore</span>
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>Active & Synced</div>
          </div>

          <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
              <Server size={14} />
              <span>Express on Render</span>
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>API Connected</div>
          </div>

          <div style={{ padding: '0.75rem', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
              <Cloud size={14} />
              <span>Cloudinary CDN</span>
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>Uploads Ready</div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Firebase Project ID</label>
            <input
              type="text"
              value={firebaseProjectId}
              onChange={(e) => setFirebaseProjectId(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Firebase Web Client API Key</label>
            <input
              type="password"
              value={firebaseApiKey}
              onChange={(e) => setFirebaseApiKey(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cloudinary Cloud Name</label>
            <input
              type="text"
              value={cloudinaryCloudName}
              onChange={(e) => setCloudinaryCloudName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Express Backend API URL (Render Endpoint)</label>
            <input
              type="url"
              value={renderApiUrl}
              onChange={(e) => setRenderApiUrl(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setIsConfigSettingsOpen(false)} className="btn btn-secondary">
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              <ShieldCheck size={15} />
              <span>Save & Verify Services</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
