import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  GraduationCap,
  CalendarDays,
  Users,
  Lightbulb,
  BarChart3,
  Zap,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setSelectedProjectId,
    tasks,
    projects,
    studyTasks,
    ideas,
    setIsConfigSettingsOpen,
    resetDemoData,
    clearAllWorkspaceData
  } = useApp();

  const activeProjectsCount = projects.filter((p) => p.status === 'In Progress' || p.status === 'Planning').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const pendingStudyCount = studyTasks.filter((st) => !st.isCompleted).length;
  const activeIdeasCount = ideas.filter((i) => i.status !== 'Archived' && i.status !== 'Converted to Project').length;

  const handleNav = (tab: NavTab) => {
    setSelectedProjectId(null);
    setActiveTab(tab);
  };

  const navItems: { id: NavTab; name: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      name: 'Command Center',
      icon: <LayoutDashboard size={18} />
    },
    {
      id: 'projects',
      name: 'Projects',
      icon: <FolderKanban size={18} />,
      badge: activeProjectsCount
    },
    {
      id: 'tasks',
      name: 'Intelligent Tasks',
      icon: <CheckSquare size={18} />,
      badge: pendingTasksCount
    },
    {
      id: 'study',
      name: 'Study Hub',
      icon: <GraduationCap size={18} />,
      badge: pendingStudyCount
    },
    {
      id: 'schedule',
      name: 'Unified Schedule',
      icon: <CalendarDays size={18} />
    },
    {
      id: 'team',
      name: 'Team & Sync',
      icon: <Users size={18} />
    },
    {
      id: 'ideas',
      name: 'Idea Vault',
      icon: <Lightbulb size={18} />,
      badge: activeIdeasCount
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: <BarChart3 size={18} />
    }
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <a href="#dashboard" onClick={(e) => { e.preventDefault(); handleNav('dashboard'); }} className="brand-badge" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/app-icon.png"
            alt="KAVEXA"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              objectFit: 'cover',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              boxShadow: '0 0 14px rgba(6, 182, 212, 0.35)'
            }}
          />
          <div className="brand-info">
            <span className="brand-name" style={{ fontSize: '1.05rem', letterSpacing: '0.04em', fontWeight: 800 }}>KAVEXA OPS</span>
            <span className="brand-tag" style={{ color: 'var(--accent-cyan)', fontSize: '0.65rem', fontWeight: 600 }}>OPERATIONS SYSTEM</span>
          </div>
        </a>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Core Operations</div>
        {navItems.slice(0, 3).map((item) => (
          <div
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <div className="nav-item-left">
              {item.icon}
              <span className="nav-item-text">{item.name}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </div>
        ))}

        <div className="nav-section-title" style={{ marginTop: '0.75rem' }}>Balance & Team</div>
        {navItems.slice(3, 6).map((item) => (
          <div
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <div className="nav-item-left">
              {item.icon}
              <span className="nav-item-text">{item.name}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </div>
        ))}

        <div className="nav-section-title" style={{ marginTop: '0.75rem' }}>Insights & Growth</div>
        {navItems.slice(6).map((item) => (
          <div
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <div className="nav-item-left">
              {item.icon}
              <span className="nav-item-text">{item.name}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </div>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <div
            onClick={() => setIsConfigSettingsOpen(true)}
            className="nav-item"
            style={{ color: 'var(--text-muted)' }}
          >
            <div className="nav-item-left">
              <Sliders size={16} />
              <span className="nav-item-text">Services & Cloud</span>
            </div>
          </div>
          <div
            onClick={() => {
              if (confirm('Wipe all sample data and start with a completely empty, fresh workspace for your real projects?')) {
                clearAllWorkspaceData();
              }
            }}
            className="nav-item"
            style={{ color: '#ef4444', fontSize: '0.8rem' }}
          >
            <div className="nav-item-left">
              <RotateCcw size={15} />
              <span className="nav-item-text">Start Fresh (Clear All)</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer Status */}
      <div className="sidebar-footer">
        <div className="live-sync-indicator">
          <div className="pulse-dot" />
          <span>Firestore Sync Live</span>
        </div>
      </div>
    </aside>
  );
};
