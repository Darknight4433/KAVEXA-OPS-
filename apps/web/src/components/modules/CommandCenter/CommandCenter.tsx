import React from 'react';
import {
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  GraduationCap,
  Calendar,
  Users,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Play,
  Radio,
  Video,
  Pin,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { getDoFirstTask, calculateTeamSync } from '@kavexa/intelligence';
import { formatDuration, getDaysUntil, formatTime } from '@kavexa/utils';

export const CommandCenter: React.FC = () => {
  const {
    currentMember,
    tasks,
    projects,
    members,
    schedules,
    studyTasks,
    notices,
    deleteNotice,
    togglePinNotice,
    setSelectedProjectId,
    setSelectedTaskId,
    setActiveTab,
    toggleTaskComplete,
    setIsNewTaskModalOpen,
    setIsNewProjectModalOpen,
    setIsNewNoticeModalOpen,
    setIsFocusModeOpen
  } = useApp();

  // Compute Do First task
  const doFirstTask = getDoFirstTask(tasks, {
    allTasks: tasks,
    projects,
    members,
    schedules,
    activeMemberId: currentMember.id
  });

  // Compute Team Sync
  const teamSync = calculateTeamSync(members, schedules);

  // Attention Required items
  const overdueTasks = tasks.filter((t) => t.status !== 'Completed' && getDaysUntil(t.deadline) < 0);
  const blockedTasks = tasks.filter((t) => t.status === 'Blocked');
  const atRiskProjects = projects.filter((p) => p.health.status === 'At Risk' || p.health.status === 'Critical');
  const upcomingDeadlines = tasks.filter((t) => {
    const days = getDaysUntil(t.deadline);
    return t.status !== 'Completed' && days >= 0 && days <= 3;
  });

  // Stats
  const activeProjectsCount = projects.filter((p) => p.status === 'In Progress' || p.status === 'Planning').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;
  const avgProjectProgress = projects.length > 0
    ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
    : 0;

  return (
    <div className="workspace-content">
      {/* Daily Header & Metric Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1.25rem', padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.06))', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px'
            }}
          >
            <img
              src="/app-icon.png"
              alt="KAVEXA OPS"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                KAVEXA Command Center
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-cyan)',
                  background: 'rgba(6, 182, 212, 0.15)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  fontWeight: 700
                }}
              >
                OPERATIONS SYSTEM
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
              Operating perspective: <strong style={{ color: '#ffffff' }}>{currentMember.name}</strong> ({currentMember.role}) • All intelligence engines active & connected to Firebase.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setIsNewNoticeModalOpen(true)}
            className="btn btn-secondary"
          >
            <Video size={15} style={{ color: '#818cf8' }} />
            <span>+ Schedule VC / Notice</span>
          </button>
          <button
            onClick={() => setIsFocusModeOpen(true)}
            className="btn btn-secondary"
          >
            <Play size={15} style={{ color: 'var(--accent-cyan)' }} />
            <span>Deep Work</span>
          </button>
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="btn btn-primary"
          >
            <Zap size={15} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Team Notices & Scheduled VC Meetings */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Radio size={18} style={{ color: '#818cf8' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f8fafc' }}>
              Broadcasts & Scheduled VC Calls
            </span>
            <span className="nav-badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
              {notices.length} Active
            </span>
          </div>

          <button
            onClick={() => setIsNewNoticeModalOpen(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
          >
            <Video size={13} style={{ color: '#818cf8' }} />
            <span>+ Schedule VC / Post Notice</span>
          </button>
        </div>

        {notices.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.015)',
              border: '1px dashed var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                <Radio size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>No Active Broadcasts or Meetings</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Need to arrange a team VC call or broadcast an announcement? Post a notice for all co-founders.</div>
              </div>
            </div>
            <button onClick={() => setIsNewNoticeModalOpen(true)} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>
              + Schedule Call / Notice
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: notices.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.85rem' }}>
            {notices.map((n) => {
              const isVC = n.type === 'Voice / Video Call (VC)';
              return (
                <div
                  key={n.id}
                  className="card"
                  style={{
                    padding: '1rem 1.25rem',
                    background: isVC
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(15, 23, 42, 0.8))'
                      : n.type === 'Urgent Alert'
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(15, 23, 42, 0.8))'
                      : 'rgba(15, 23, 42, 0.65)',
                    border: isVC
                      ? '1px solid rgba(99, 102, 241, 0.35)'
                      : n.type === 'Urgent Alert'
                      ? '1px solid rgba(239, 68, 68, 0.35)'
                      : '1px solid var(--border-subtle)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          background: isVC ? 'rgba(99, 102, 241, 0.2)' : n.type === 'Urgent Alert' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.15)',
                          color: isVC ? '#818cf8' : n.type === 'Urgent Alert' ? '#ef4444' : 'var(--accent-cyan)'
                        }}
                      >
                        {isVC ? '📞 VC Meeting' : n.type}
                      </span>
                      {n.startTime && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          ⏰ {n.startTime} {n.endTime ? `- ${n.endTime}` : ''}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        onClick={() => togglePinNotice(n.id)}
                        className="btn-icon"
                        style={{ width: '22px', height: '22px' }}
                        title={n.isPinned ? 'Unpin notice' : 'Pin notice'}
                      >
                        <Pin size={12} style={{ color: n.isPinned ? 'var(--accent-amber)' : 'var(--text-muted)' }} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove notice "${n.title}"?`)) {
                            deleteNotice(n.id);
                          }
                        }}
                        className="btn-icon"
                        style={{ width: '22px', height: '22px' }}
                        title="Delete notice"
                      >
                        <Trash2 size={12} style={{ color: 'var(--accent-rose)' }} />
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
                    {n.title}
                  </h3>

                  {n.message && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                      {n.message}
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>👤 {n.postedBy}</span>
                      <span>•</span>
                      <span>📅 {n.date}</span>
                    </div>

                    {n.meetingLink && (
                      <a
                        href={n.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.75rem',
                          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          textDecoration: 'none'
                        }}
                      >
                        <Video size={13} />
                        <span>Join VC Meeting ➔</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Tasks Due Soon
            </span>
            <AlertTriangle size={16} style={{ color: 'var(--accent-amber)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
            {upcomingDeadlines.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : '0 overdue'}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Active Projects
            </span>
            <FolderKanban size={16} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
            {activeProjectsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
            Avg. {avgProjectProgress}% Complete
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Pending Tasks
            </span>
            <CheckCircle2 size={16} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
            {pendingTasksCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
            {completedTasksCount} completed total
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Team Free Window
            </span>
            <Users size={16} style={{ color: 'var(--accent-emerald)' }} />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', marginTop: '0.3rem' }}>
            {teamSync.bestCollaborationWindow ? `${teamSync.bestCollaborationWindow.startTime} - ${teamSync.bestCollaborationWindow.endTime}` : 'Solo Mode'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {teamSync.bestCollaborationWindow?.label || 'No team members added'}
          </div>
        </div>
      </div>

      {/* Main Grid: Do First AI Spotlight & Attention Required */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* DO FIRST AI SPOTLIGHT */}
        <div className="card card-spotlight">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#818cf8' }}>
                AI Recommendation Spotlight
              </span>
            </div>
            {doFirstTask && (
              <span className="priority-score-badge score-urgent">
                PRIORITY SCORE: {doFirstTask.priorityScore}/100
              </span>
            )}
          </div>

          {doFirstTask ? (
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                {doFirstTask.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                {doFirstTask.description}
              </p>

              {/* Rationale breakdown */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Why This Task Right Now?
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {doFirstTask.priorityBreakdown.reasons.map((r, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--accent-primary)' }}>•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>⏱️ Duration: <strong>{formatDuration(doFirstTask.estimatedDuration)}</strong></span>
                  <span>📅 Slot: <strong>{doFirstTask.priorityBreakdown.recommendedSlot}</strong></span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setSelectedTaskId(doFirstTask.id);
                      setActiveTab('tasks');
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
                  >
                    View Breakdown
                  </button>
                  <button
                    onClick={() => toggleTaskComplete(doFirstTask.id)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                  >
                    <CheckCircle2 size={15} />
                    <span>Complete Task</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No critical pending tasks. Everything is on schedule!
            </div>
          )}
        </div>

        {/* ATTENTION REQUIRED MATRIX */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} style={{ color: 'var(--accent-rose)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#f87171' }}>
                Attention Required ({overdueTasks.length + blockedTasks.length + atRiskProjects.length})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {/* Overdue */}
            {overdueTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTaskId(t.id);
                  setActiveTab('tasks');
                }}
                style={{
                  padding: '0.75rem',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#fca5a5' }}>{t.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overdue deadline • Assigned to {members.find((m) => m.id === t.assignedMemberId)?.name || 'Team'}</div>
                </div>
                <span className="priority-score-badge score-urgent" style={{ fontSize: '0.7rem' }}>
                  OVERDUE
                </span>
              </div>
            ))}

            {/* Blocked */}
            {blockedTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTaskId(t.id);
                  setActiveTab('tasks');
                }}
                style={{
                  padding: '0.75rem',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#fde68a' }}>{t.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Blocked by incomplete prerequisite tasks</div>
                </div>
                <span className="priority-score-badge score-elevated" style={{ fontSize: '0.7rem' }}>
                  BLOCKED
                </span>
              </div>
            ))}

            {/* At Risk Projects */}
            {atRiskProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProjectId(p.id);
                  setActiveTab('projects');
                }}
                style={{
                  padding: '0.75rem',
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#c7d2fe' }}>Project: {p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Health Status: {p.health.status} ({p.health.warnings[0] || 'Approaching deadline'})</div>
                </div>
                <span className="priority-score-badge score-elevated" style={{ fontSize: '0.7rem' }}>
                  {p.health.status}
                </span>
              </div>
            ))}

            {overdueTasks.length === 0 && blockedTasks.length === 0 && atRiskProjects.length === 0 && (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ✓ No immediate blocker alerts. All systems running smooth.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Grid: Project Snapshot & Today's Unified Timeline */}
      <div className="grid-2">
        {/* Project Snapshot */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FolderKanban size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Project Knowledge Workspaces ({projects.length})
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedProjectId(null);
                setActiveTab('projects');
              }}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setSelectedProjectId(proj.id);
                  setActiveTab('projects');
                }}
                style={{
                  padding: '0.85rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>{proj.name}</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: proj.health.status === 'Healthy' ? '#10b981' : proj.health.status === 'At Risk' ? '#f59e0b' : '#ef4444',
                      background: 'rgba(255,255,255,0.04)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px'
                    }}
                  >
                    {proj.health.status}
                  </span>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.65rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {proj.description}
                </p>

                {/* Progress bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${proj.progress}%`,
                        height: '100%',
                        background: proj.accentColor || 'var(--accent-primary)',
                        borderRadius: '999px'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {proj.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Unified Timeline & Team Pulse */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} style={{ color: 'var(--accent-emerald)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Today's Unified Timeline
              </span>
            </div>
            <button
              onClick={() => setActiveTab('schedule')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <span>Full Schedule</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
            {schedules.map((ev) => (
              <div
                key={ev.id}
                style={{
                  padding: '0.7rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderLeft: `3px solid ${ev.type === 'School' ? 'var(--accent-amber)' : ev.type === 'Study' ? 'var(--accent-cyan)' : 'var(--accent-primary)'}`,
                  borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc' }}>{ev.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {ev.startTime} - {ev.endTime} {ev.location ? `• 📍 ${ev.location}` : ''}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    background: ev.type === 'School' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    color: ev.type === 'School' ? '#fbbf24' : '#818cf8'
                  }}
                >
                  {ev.type}
                </span>
              </div>
            ))}
          </div>

          {/* Team Pulse Footer */}
          <div
            style={{
              padding: '0.75rem',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '0.8rem', color: '#f8fafc' }}>
                <strong>Team Sync:</strong> {teamSync.workloadBalanceRatio.recommendation}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('team')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              Sync Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
