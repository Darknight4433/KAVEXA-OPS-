import React from 'react';
import {
  Compass,
  CheckSquare,
  Plus,
  Calendar,
  User,
  Users
} from 'lucide-react';

export type MobileTab = 'today' | 'tasks' | 'schedule' | 'profile';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  setActiveTab: (tab: MobileTab) => void;
  onOpenQuickAdd: () => void;
  pendingTasksCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickAdd,
  pendingTasksCount
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65px',
        backgroundColor: 'rgba(8, 11, 17, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 999,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      {/* Today */}
      <button
        onClick={() => setActiveTab('today')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: activeTab === 'today' ? 'var(--accent-primary)' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px 12px'
        }}
      >
        <Compass size={20} />
        <span style={{ fontSize: '0.65rem', fontWeight: activeTab === 'today' ? 700 : 500 }}>
          Today
        </span>
      </button>

      {/* Tasks */}
      <button
        onClick={() => setActiveTab('tasks')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          position: 'relative',
          color: activeTab === 'tasks' ? 'var(--accent-cyan)' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px 12px'
        }}
      >
        <CheckSquare size={20} />
        {pendingTasksCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '12px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              fontSize: '0.55rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {pendingTasksCount}
          </span>
        )}
        <span style={{ fontSize: '0.65rem', fontWeight: activeTab === 'tasks' ? 700 : 500 }}>
          Tasks
        </span>
      </button>

      {/* Center Quick Add Floating Trigger */}
      <button
        onClick={onOpenQuickAdd}
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          border: 'none',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          cursor: 'pointer',
          transform: 'translateY(-10px)'
        }}
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {/* Schedule */}
      <button
        onClick={() => setActiveTab('schedule')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: activeTab === 'schedule' ? 'var(--accent-emerald)' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px 12px'
        }}
      >
        <Calendar size={20} />
        <span style={{ fontSize: '0.65rem', fontWeight: activeTab === 'schedule' ? 700 : 500 }}>
          Schedule
        </span>
      </button>

      {/* Profile & Team */}
      <button
        onClick={() => setActiveTab('profile')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: activeTab === 'profile' ? 'var(--accent-amber)' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px 12px'
        }}
      >
        <Users size={20} />
        <span style={{ fontSize: '0.65rem', fontWeight: activeTab === 'profile' ? 700 : 500 }}>
          Team
        </span>
      </button>
    </div>
  );
};
