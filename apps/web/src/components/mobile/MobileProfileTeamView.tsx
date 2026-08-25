import React from 'react';
import {
  Users,
  ShieldCheck,
  RotateCcw,
  Bell,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileProfileTeamView: React.FC = () => {
  const {
    members,
    currentMember,
    updateMemberAvailability,
    setCurrentMemberId,
    notifications,
    markAllNotificationsRead,
    setIsConfigSettingsOpen,
    resetDemoData
  } = useApp();

  const availabilityOptions: Array<'Available' | 'Busy' | 'Studying' | 'School' | 'Offline'> = [
    'Available',
    'Busy',
    'Studying',
    'School',
    'Offline'
  ];

  return (
    <div style={{ padding: '1rem', paddingBottom: '90px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.2rem' }}>
          Team & Operational Profile
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Manage your live status and review co-founder availability.
        </p>
      </div>

      {/* Active Founder Persona Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.08))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
          <img
            src={currentMember.avatarUrl}
            alt={currentMember.name}
            style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
          />
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
              {currentMember.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
              {currentMember.role}
            </div>
          </div>
        </div>

        {/* Live Availability Toggle */}
        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          Update Your Live Status
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {availabilityOptions.map((status) => (
            <button
              key={status}
              onClick={() => updateMemberAvailability(currentMember.id, status)}
              className={`availability-pill avail-${status}`}
              style={{
                cursor: 'pointer',
                border: currentMember.availability === status ? '2px solid #ffffff' : 'none',
                padding: '0.25rem 0.6rem',
                fontSize: '0.7rem'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={async () => {
              try {
                const { signInWithGoogle } = await import('@kavexa/firebase');
                await signInWithGoogle();
                alert('⚡ Successfully authenticated with Google on Firebase!');
              } catch (err: any) {
                alert(err?.message || 'Google Sign-In ready. (Enable Google Provider in Firebase Console)');
              }
            }}
            style={{
              width: '100%',
              padding: '0.55rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>

      {/* Switch Persona */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.85rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
          Switch Co-Founder Persona
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => setCurrentMemberId(m.id)}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '8px',
                border: currentMember.id === m.id ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.08)',
                background: currentMember.id === m.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.02)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: currentMember.id === m.id ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
            <Bell size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>Recent Activity ({notifications.length})</span>
          </div>
          <button
            onClick={markAllNotificationsRead}
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.7rem', cursor: 'pointer' }}
          >
            Clear
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {notifications.slice(0, 3).map((n) => (
            <div key={n.id} style={{ fontSize: '0.75rem', color: '#cbd5e1', padding: '0.4rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
              <strong>{n.title}:</strong> {n.message}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={() => setIsConfigSettingsOpen(true)}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Sliders size={15} />
          <span>Services & Cloud Status</span>
        </button>

        <button
          onClick={() => {
            if (confirm('Reset workspace to clean startup demonstration state?')) {
              resetDemoData();
            }
          }}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'center', color: 'var(--text-muted)' }}
        >
          <RotateCcw size={14} />
          <span>Reset Sample Workspace Data</span>
        </button>
      </div>
    </div>
  );
};
