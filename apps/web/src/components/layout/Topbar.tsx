import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  Smartphone,
  Timer,
  Clock,
  ChevronDown,
  CheckCheck,
  FolderKanban,
  CheckSquare,
  Calendar,
  GraduationCap,
  Lightbulb,
  Palette,
  Sliders,
  Code,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfileModal } from '../modals/UserProfileModal';
import { VSCodeTrackerModal } from '../modules/Analytics/VSCodeTrackerModal';

export const Topbar: React.FC = () => {
  const {
    currentMember,
    currentMemberId,
    setCurrentMemberId,
    members,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsCommandPaletteOpen,
    isMobileSimulatorOpen,
    setIsMobileSimulatorOpen,
    isFocusModeOpen,
    setIsFocusModeOpen,
    setIsNewTaskModalOpen,
    setIsNewProjectModalOpen,
    setIsNewIdeaModalOpen,
    updateMemberAvailability,
    authUser,
    loginWithGoogle,
    logoutGoogle,
    isUserProfileModalOpen,
    setIsUserProfileModalOpen,
    isVSCodeTrackerOpen,
    setIsVSCodeTrackerOpen
  } = useApp();

  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setDateStr(
        now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const availabilityOptions: Array<'Available' | 'Busy' | 'Studying' | 'School' | 'Offline'> = [
    'Available',
    'Busy',
    'Studying',
    'School',
    'Offline'
  ];

  return (
    <header className="app-topbar">
      {/* Topbar Left: Date & Time */}
      <div className="topbar-left">
        <div className="clock-widget">
          <Clock size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span>{dateStr}</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{timeStr}</span>
        </div>

        {/* Global Search Bar Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 0.85rem', gap: '0.75rem', borderRadius: 'var(--radius-md)' }}
        >
          <Search size={15} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Search workspace...</span>
          <kbd
            style={{
              fontSize: '0.7rem',
              padding: '0.1rem 0.35rem',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '4px',
              color: 'var(--text-muted)'
            }}
          >
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Topbar Right: Actions, Simulator, Notifications, User Switcher */}
      <div className="topbar-right">
        {/* Focus Timer Button */}
        <button
          onClick={() => setIsFocusModeOpen(!isFocusModeOpen)}
          className={`btn ${isFocusModeOpen ? 'btn-primary' : 'btn-secondary'}`}
          title="Deep Work Focus HUD"
          style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
        >
          <Timer size={15} />
          <span>Focus HUD</span>
        </button>

        {/* VS Code & Developer Coding Time Tracker Button */}
        <button
          onClick={() => setIsVSCodeTrackerOpen(true)}
          className="btn btn-secondary"
          title="VS Code & Developer Focus Engine"
          style={{
            fontSize: '0.8rem',
            padding: '0.45rem 0.75rem',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            background: 'rgba(6, 182, 212, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Code size={15} style={{ color: 'var(--accent-cyan)' }} />
          <span>VS Code</span>
        </button>



        {/* Quick Action Launcher (+ New) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className="btn btn-primary"
            style={{ padding: '0.45rem 0.85rem' }}
          >
            <Plus size={16} />
            <span>New</span>
            <ChevronDown size={14} />
          </button>

          {isNewMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '210px',
                background: '#0f172a',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                padding: '0.5rem',
                zIndex: 60
              }}
            >
              <div
                onClick={() => {
                  setIsNewMenuOpen(false);
                  setIsNewTaskModalOpen(true);
                }}
                className="nav-item"
                style={{ fontSize: '0.825rem', padding: '0.5rem 0.65rem' }}
              >
                <CheckSquare size={15} style={{ color: 'var(--accent-primary)' }} />
                <span>Add Task</span>
              </div>
              <div
                onClick={() => {
                  setIsNewMenuOpen(false);
                  setIsNewProjectModalOpen(true);
                }}
                className="nav-item"
                style={{ fontSize: '0.825rem', padding: '0.5rem 0.65rem' }}
              >
                <FolderKanban size={15} style={{ color: 'var(--accent-cyan)' }} />
                <span>Create Project</span>
              </div>
              <div
                onClick={() => {
                  setIsNewMenuOpen(false);
                  setIsNewIdeaModalOpen(true);
                }}
                className="nav-item"
                style={{ fontSize: '0.825rem', padding: '0.5rem 0.65rem' }}
              >
                <Lightbulb size={15} style={{ color: 'var(--accent-amber)' }} />
                <span>Capture Idea</span>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Center */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="btn-icon"
            title="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && <span className="badge-counter">{unreadCount}</span>}
          </button>

          {isNotifOpen && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '340px',
                background: '#0f172a',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                padding: '1rem',
                zIndex: 60
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Workspace Alerts</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <CheckCheck size={14} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {notifications.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
                    No active notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        background: n.read ? 'rgba(255,255,255,0.02)' : 'rgba(99, 102, 241, 0.08)',
                        border: '1px solid',
                        borderColor: n.read ? 'transparent' : 'rgba(99, 102, 241, 0.25)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {n.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Co-Founder Profile Switcher */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="user-switcher"
          >
            <img
              src={currentMember.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={currentMember.name}
              className="user-avatar-small"
            />
            <span className="user-name-label">{currentMember.name}</span>
            <span className={`availability-pill avail-${currentMember.availability}`}>
              {currentMember.availability}
            </span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </div>

          {isProfileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '260px',
                background: '#0f172a',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                padding: '0.85rem',
                zIndex: 60
              }}
            >
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '0.5rem' }}>
                Switch Active Perspective
              </div>

              {members.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setCurrentMemberId(m.id);
                    setIsProfileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.65rem',
                    borderRadius: 'var(--radius-md)',
                    background: currentMemberId === m.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    cursor: 'pointer',
                    marginBottom: '0.25rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={m.avatarUrl} alt={m.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc' }}>{m.name}</span>
                  </div>
                  <span className={`availability-pill avail-${m.availability}`} style={{ fontSize: '0.6rem' }}>
                    {m.availability}
                  </span>
                </div>
              ))}

              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.65rem', paddingTop: '0.65rem' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Set My Live Status
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  {availabilityOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateMemberAvailability(currentMemberId, status);
                        setIsProfileMenuOpen(false);
                      }}
                      className={`availability-pill avail-${status}`}
                      style={{ cursor: 'pointer', border: 'none', padding: '0.25rem 0.55rem' }}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setIsUserProfileModalOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.75rem', justifyContent: 'center', marginBottom: '0.65rem', gap: '0.4rem', border: '1px solid rgba(6, 182, 212, 0.3)' }}
                >
                  <Sliders size={13} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Personalize Role & Theme</span>
                </button>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
                  {authUser ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                        ✓ {authUser.email || authUser.displayName}
                      </div>
                      <button
                        onClick={async () => {
                          await logoutGoogle();
                          setIsProfileMenuOpen(false);
                        }}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={async () => {
                        try {
                          await loginWithGoogle();
                          setIsProfileMenuOpen(false);
                        } catch (err: any) {
                          alert(err?.message || 'Google Sign-In initialized. (Enable Google Provider in Firebase Console to complete)');
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-md)',
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
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
      />

      <VSCodeTrackerModal
        isOpen={isVSCodeTrackerOpen}
        onClose={() => setIsVSCodeTrackerOpen(false)}
      />
    </header>
  );
};
