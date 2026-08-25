import React from 'react';
import {
  Compass,
  CheckSquare,
  Plus,
  FolderKanban,
  User
} from 'lucide-react';

export type MobileTab = 'today' | 'tasks' | 'projects' | 'profile';

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
        backgroundColor: 'rgba(10, 10, 10, 0.96)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid #242424',
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
          color: activeTab === 'today' ? '#6366F1' : '#666666',
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
          color: activeTab === 'tasks' ? '#6366F1' : '#666666',
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
              backgroundColor: '#6366F1',
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
          background: '#6366F1',
          border: 'none',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          cursor: 'pointer',
          transform: 'translateY(-8px)'
        }}
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {/* Projects */}
      <button
        onClick={() => setActiveTab('projects')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: activeTab === 'projects' ? '#6366F1' : '#666666',
          cursor: 'pointer',
          padding: '6px 12px'
        }}
      >
        <FolderKanban size={20} />
        <span style={{ fontSize: '0.65rem', fontWeight: activeTab === 'projects' ? 700 : 500 }}>
          Projects
        </span>
      </button>

      {/* Profile */}
      <button
        onClick={() => setActiveTab('profile')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: activeTab === 'profile' ? '#6366F1' : '#666666',
          cursor: 'pointer',
          padding: '6px 12px'
        }}
      >
        <User size={20} />
        <span style={{ fontSize: '0.65rem', fontWeight: activeTab === 'profile' ? 700 : 500 }}>
          Profile
        </span>
      </button>
    </div>
  );
};
