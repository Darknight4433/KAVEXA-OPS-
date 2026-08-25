import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
  BookOpen,
  FolderKanban,
  CheckSquare,
  Code,
  Calendar,
  ChevronRight,
  LogOut,
  Moon,
  Laptop
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileProfileTeamView: React.FC = () => {
  const {
    members,
    currentMember,
    updateMemberAvailability,
    setCurrentMemberId,
    authUser,
    loginWithGoogle,
    logoutGoogle,
    setIsUserProfileModalOpen,
    setIsVSCodeTrackerOpen,
    setActiveTab
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
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F5F5F5', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
          Profile & System
        </h2>
        <p style={{ fontSize: '0.75rem', color: '#A3A3A3' }}>
          Manage your founder identity, team availability, and shortcuts.
        </p>
      </div>

      {/* Founder Identity Card */}
      <div
        style={{
          backgroundColor: '#0A0A0A',
          border: '1px solid #242424',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#111111',
                border: '1.5px solid #6366F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F5F5F5',
                fontWeight: 800,
                fontSize: '1rem'
              }}
            >
              {currentMember.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F5F5F5' }}>
                {currentMember.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6366F1' }}>
                {currentMember.role}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsUserProfileModalOpen(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.7rem', padding: '0.25rem 0.55rem', gap: '0.3rem' }}
          >
            <Sliders size={12} style={{ color: '#818CF8' }} />
            <span>Customize</span>
          </button>
        </div>

        {/* Live Availability Toggle */}
        <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#666666', marginBottom: '0.4rem' }}>
          LIVE STATUS
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {availabilityOptions.map((status) => (
            <button
              key={status}
              onClick={() => updateMemberAvailability(currentMember.id, status)}
              style={{
                padding: '0.25rem 0.6rem',
                borderRadius: '999px',
                border: currentMember.availability === status ? '1px solid #F5F5F5' : '1px solid #242424',
                backgroundColor: currentMember.availability === status ? '#171717' : '#0e0e0e',
                color: currentMember.availability === status ? '#F5F5F5' : '#666666',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Google Auth Status Bar */}
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #242424' }}>
          {authUser ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                ✓ {authUser.email || authUser.displayName}
              </div>
              <button
                onClick={logoutGoogle}
                className="btn btn-secondary"
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              style={{
                width: '100%',
                padding: '0.55rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#111111',
                border: '1px solid #242424',
                color: '#F5F5F5',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <span>Sign in with Google Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Module Shortcuts Menu */}
      <div style={{ backgroundColor: '#0A0A0A', border: '1px solid #242424', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1.25rem' }}>
        <div
          onClick={() => setActiveTab('study')}
          style={{
            padding: '0.85rem 1rem',
            borderBottom: '1px solid #242424',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen size={16} style={{ color: '#F59E0B' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F5F5F5' }}>Private Study Hub</div>
              <div style={{ fontSize: '0.65rem', color: '#666666' }}>University courses and exam tracker</div>
            </div>
          </div>
          <ChevronRight size={14} style={{ color: '#666666' }} />
        </div>

        <div
          onClick={() => setIsVSCodeTrackerOpen(true)}
          style={{
            padding: '0.85rem 1rem',
            borderBottom: '1px solid #242424',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Laptop size={16} style={{ color: '#06B6D4' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F5F5F5' }}>Universal IDE Tracker</div>
              <div style={{ fontSize: '0.65rem', color: '#666666' }}>VS Code, Cursor AI, and SolidWorks CAD</div>
            </div>
          </div>
          <ChevronRight size={14} style={{ color: '#666666' }} />
        </div>

        <div
          onClick={() => setActiveTab('schedule')}
          style={{
            padding: '0.85rem 1rem',
            borderBottom: '1px solid #242424',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={16} style={{ color: '#10B981' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F5F5F5' }}>Unified Schedule</div>
              <div style={{ fontSize: '0.65rem', color: '#666666' }}>Collaborative calendar & sprint windows</div>
            </div>
          </div>
          <ChevronRight size={14} style={{ color: '#666666' }} />
        </div>

        <div
          onClick={() => setIsUserProfileModalOpen(true)}
          style={{
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Moon size={16} style={{ color: '#6366F1' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F5F5F5' }}>Appearance & UI Theme</div>
              <div style={{ fontSize: '0.65rem', color: '#666666' }}>Black First & custom color palettes</div>
            </div>
          </div>
          <ChevronRight size={14} style={{ color: '#666666' }} />
        </div>
      </div>

      {/* Switch Co-Founder Persona */}
      <div style={{ backgroundColor: '#0A0A0A', border: '1px solid #242424', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F5F5F5', marginBottom: '0.5rem' }}>
          Co-Founder Persona Switcher
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => setCurrentMemberId(m.id)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: m.id === currentMember.id ? '1px solid #6366F1' : '1px solid #242424',
                backgroundColor: m.id === currentMember.id ? 'rgba(99, 102, 241, 0.15)' : '#111111',
                color: m.id === currentMember.id ? '#F5F5F5' : '#666666',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
