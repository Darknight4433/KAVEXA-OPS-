import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle2, Monitor, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DesktopAuthBridge: React.FC = () => {
  const { authUser, loginWithGoogle } = useApp();
  const [status, setStatus] = useState<'prompt' | 'sending' | 'success' | 'error'>('prompt');

  useEffect(() => {
    if (authUser) {
      setStatus('sending');
      const payload = {
        uid: authUser.uid,
        displayName: authUser.displayName,
        email: authUser.email,
        photoURL: authUser.photoURL
      };

      fetch('/api/desktop-auth-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then((res) => res.json())
        .then(() => {
          setStatus('success');
          // Auto-close tab after 2.5s if allowed
          setTimeout(() => {
            try { window.close(); } catch (e) {}
          }, 2500);
        })
        .catch((err) => {
          console.warn('Desktop bridge error:', err);
          setStatus('error');
        });
    }
  }, [authUser]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        color: '#F5F5F5',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)'
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          backgroundColor: '#0A0A0A',
          border: '1px solid #242424',
          borderRadius: '16px',
          padding: '2.25rem',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '14px',
              backgroundColor: '#111111',
              border: '1px solid #303030',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Monitor size={30} style={{ color: '#6366F1' }} />
          </div>
        </div>

        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Desktop Application Sign-In
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#A3A3A3', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          Authenticate your KAVEXA OPS Desktop application securely via Google.
        </p>

        {!authUser ? (
          <div>
            <button
              onClick={loginWithGoogle}
              style={{
                width: '100%',
                padding: '0.9rem 1.25rem',
                backgroundColor: '#6366F1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
            >
              <Shield size={18} />
              <span>Continue with Google</span>
            </button>
          </div>
        ) : status === 'success' ? (
          <div>
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle2 size={32} style={{ color: '#10B981' }} />
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F5F5F5' }}>
                Signed in as {authUser.displayName || authUser.email}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#A3A3A3' }}>
                Your desktop app is now authenticated. You can return to KAVEXA OPS.
              </div>
            </div>

            <a
              href="/"
              style={{ fontSize: '0.8rem', color: '#818cf8', textDecoration: 'none' }}
            >
              Open Web Dashboard →
            </a>
          </div>
        ) : (
          <div style={{ padding: '1rem', color: '#A3A3A3', fontSize: '0.9rem' }}>
            Syncing identity with Desktop application...
          </div>
        )}
      </div>
    </div>
  );
};
