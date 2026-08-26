import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileAuthBridge: React.FC = () => {
  const { authUser, loginWithGoogle } = useApp();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  useEffect(() => {
    if (authUser) {
      const deepLink = `kavexa://auth?uid=${encodeURIComponent(authUser.uid)}&name=${encodeURIComponent(authUser.displayName || '')}&email=${encodeURIComponent(authUser.email || '')}&photo=${encodeURIComponent(authUser.photoURL || '')}`;
      setRedirectUrl(deepLink);
      setIsRedirecting(true);
      
      // Auto-trigger deep link redirect to native phone app
      const timer = setTimeout(() => {
        window.location.href = deepLink;
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [authUser]);

  const handleManualReturn = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

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
          maxWidth: '440px',
          width: '100%',
          backgroundColor: '#0A0A0A',
          border: '1px solid #242424',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: '#111111',
              border: '1px solid #303030',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Smartphone size={28} style={{ color: '#6366F1' }} />
          </div>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Mobile Phone Authorization
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#A3A3A3', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          Authorize your KAVEXA OPS native Android application with your verified Google identity.
        </p>

        {!authUser ? (
          <div>
            <button
              onClick={loginWithGoogle}
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem',
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
        ) : (
          <div>
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <CheckCircle2 size={22} style={{ color: '#10B981', flexShrink: 0 }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F5F5F5' }}>
                  {authUser.displayName || 'Authorized User'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#A3A3A3' }}>
                  {authUser.email}
                </div>
              </div>
            </div>

            <button
              onClick={handleManualReturn}
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem',
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
                marginBottom: '0.75rem'
              }}
            >
              <span>📱 Open KAVEXA Phone App</span>
              <ArrowRight size={18} />
            </button>

            <a
              href="/"
              style={{ fontSize: '0.8rem', color: '#A3A3A3', textDecoration: 'none' }}
            >
              Go to Web Dashboard instead →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
