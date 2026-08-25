import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  Zap,
  Plus,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getDoFirstTask } from '@kavexa/intelligence';
import { formatDuration, getDaysUntil } from '@kavexa/utils';

export const MobileSimulatorHUD: React.FC = () => {
  const {
    isMobileSimulatorOpen,
    setIsMobileSimulatorOpen,
    tasks,
    projects,
    members,
    schedules,
    currentMember,
    toggleTaskComplete,
    createTask,
    updateMemberAvailability
  } = useApp();

  const [mobileTab, setMobileTab] = useState<'today' | 'tasks' | 'schedule' | 'team'>('today');
  const [quickTitle, setQuickTitle] = useState('');

  if (!isMobileSimulatorOpen) return null;

  const doFirstTask = getDoFirstTask(tasks, {
    allTasks: tasks,
    projects,
    members,
    schedules,
    activeMemberId: currentMember.id
  });

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    createTask({
      title: quickTitle.trim(),
      category: 'KAVEXA Work',
      priority: 'High',
      assignedMemberId: currentMember.id
    });
    setQuickTitle('');
  };

  return (
    <div className="mobile-simulator-dock">
      <div className="mobile-phone-frame">
        {/* Notch */}
        <div className="phone-notch" />

        {/* Mobile Header Bar */}
        <div
          style={{
            padding: '1.25rem 1rem 0.75rem',
            background: '#0f172a',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={14} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc' }}>KAVEXA MOBILE</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.65rem',
                color: 'var(--accent-emerald)',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '0.1rem 0.4rem',
                borderRadius: '999px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              LIVE SYNC
            </span>
            <button
              onClick={() => setIsMobileSimulatorOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem' }}>
          {mobileTab === 'today' && (
            <div>
              {/* Daily Header */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TODAY'S ACTION</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  Hi, {currentMember.name.split(' ')[0]} 🚀
                </div>
              </div>

              {/* Do First Card */}
              {doFirstTask ? (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.08))',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    borderRadius: '12px',
                    padding: '0.85rem',
                    marginBottom: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span className="priority-score-badge score-urgent" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                      DO FIRST • {doFirstTask.priorityScore}/100
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>
                      ⏱️ {formatDuration(doFirstTask.estimatedDuration)}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                    {doFirstTask.title}
                  </div>

                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                    {doFirstTask.recommendationReason}
                  </div>

                  <button
                    onClick={() => toggleTaskComplete(doFirstTask.id)}
                    className="btn btn-primary"
                    style={{ width: '100%', fontSize: '0.75rem', padding: '0.45rem', justifyContent: 'center' }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark Done (Sync to Desktop)</span>
                  </button>
                </div>
              ) : (
                <div style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '0.85rem' }}>
                  <Sparkles size={20} style={{ color: 'var(--accent-emerald)', margin: '0 auto 0.4rem' }} />
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>All Priority Tasks Clear!</div>
                </div>
              )}

              {/* Quick Task Capture */}
              <form onSubmit={handleQuickAdd} style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.85rem' }}>
                <input
                  type="text"
                  placeholder="+ Quick add task from phone..."
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#0f172a',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    padding: '0.4rem 0.6rem',
                    fontSize: '0.75rem',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                >
                  Add
                </button>
              </form>

              {/* Upcoming Today Timeline */}
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.4rem' }}>
                TODAY'S TIMELINE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {schedules.slice(0, 3).map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      padding: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff' }}>{ev.title}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{ev.startTime} - {ev.endTime}</div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.6rem',
                        padding: '0.1rem 0.35rem',
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
            </div>
          )}

          {mobileTab === 'tasks' && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Tasks ({pendingTasks.length} Pending)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {tasks.slice(0, 7).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTaskComplete(t.id)}
                    style={{
                      padding: '0.55rem',
                      background: t.status === 'Completed' ? 'rgba(255,255,255,0.01)' : 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid',
                      borderColor: t.status === 'Completed' ? 'transparent' : 'var(--border-subtle)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={t.status === 'Completed'}
                      onChange={() => {}}
                      style={{ marginTop: '2px', accentColor: 'var(--accent-emerald)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: t.status === 'Completed' ? 'var(--text-muted)' : '#ffffff',
                          textDecoration: t.status === 'Completed' ? 'line-through' : 'none'
                        }}
                      >
                        {t.title}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', gap: '0.4rem', marginTop: '0.15rem' }}>
                        <span>Due: {t.deadline}</span>
                        <span>•</span>
                        <span style={{ color: 'var(--accent-cyan)' }}>{t.priorityScore} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mobileTab === 'schedule' && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Schedule & Timetable
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {schedules.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      padding: '0.6rem',
                      background: '#0f172a',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff' }}>{ev.title}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', marginTop: '0.15rem' }}>
                      {ev.startTime} - {ev.endTime} ({ev.date})
                    </div>
                    {ev.location && (
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>📍 {ev.location}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {mobileTab === 'team' && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Co-Founder Live Status
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {members.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: '0.65rem',
                      background: '#0f172a',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <img src={m.avatarUrl} alt={m.name} style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>{m.name}</span>
                      </div>
                      <span className={`availability-pill avail-${m.availability}`} style={{ fontSize: '0.6rem' }}>
                        {m.availability}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      Weekly Workload: {m.weeklyWorkloadHours}h ({m.assignedTasksCount} tasks assigned)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Tab Bar */}
        <div
          style={{
            display: 'flex',
            background: '#0b101b',
            borderTop: '1px solid var(--border-subtle)',
            padding: '0.35rem 0'
          }}
        >
          <button
            onClick={() => setMobileTab('today')}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: mobileTab === 'today' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.65rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.15rem'
            }}
          >
            <Zap size={14} />
            <span>Today</span>
          </button>
          <button
            onClick={() => setMobileTab('tasks')}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: mobileTab === 'tasks' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.65rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.15rem'
            }}
          >
            <CheckCircle2 size={14} />
            <span>Tasks</span>
          </button>
          <button
            onClick={() => setMobileTab('schedule')}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: mobileTab === 'schedule' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.65rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.15rem'
            }}
          >
            <Calendar size={14} />
            <span>Schedule</span>
          </button>
          <button
            onClick={() => setMobileTab('team')}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: mobileTab === 'team' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.65rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.15rem'
            }}
          >
            <Users size={14} />
            <span>Team</span>
          </button>
        </div>
      </div>
    </div>
  );
};
