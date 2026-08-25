import React from 'react';
import {
  Zap,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  AlertTriangle,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getDoFirstTask, calculateTeamSync } from '@kavexa/intelligence';
import { formatDuration, getDaysUntil } from '@kavexa/utils';

interface MobileTodayViewProps {
  onGoToTasks: () => void;
  onGoToSchedule: () => void;
}

export const MobileTodayView: React.FC<MobileTodayViewProps> = ({
  onGoToTasks,
  onGoToSchedule
}) => {
  const {
    currentMember,
    tasks,
    projects,
    members,
    schedules,
    studyTasks,
    toggleTaskComplete,
    triggerConfetti,
    setIsFocusModeOpen
  } = useApp();

  const doFirstTask = getDoFirstTask(tasks, {
    allTasks: tasks,
    projects,
    members,
    schedules,
    activeMemberId: currentMember.id
  });

  const teamSync = calculateTeamSync(members, schedules);

  // Top 3 high priority tasks for today
  const todaysTasks = tasks
    .filter((t) => t.status !== 'Completed' && t.id !== doFirstTask?.id)
    .slice(0, 3);

  const pendingCount = tasks.filter((t) => t.status !== 'Completed').length;
  const completedTodayCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div style={{ padding: '1rem', paddingBottom: '90px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Mobile Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/app-icon.png"
            alt="KAVEXA"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              objectFit: 'cover',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              boxShadow: '0 0 10px rgba(6, 182, 212, 0.25)'
            }}
          />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Welcome back,
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
              {currentMember.name}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`availability-pill avail-${currentMember.availability}`}>
            {currentMember.availability}
          </span>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          marginBottom: '1.25rem'
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Pending</div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            {completedTodayCount}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Completed</div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            {teamSync.bestCollaborationWindow ? '16:30' : 'Synced'}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Free Slot</div>
        </div>
      </div>

      {/* #1 DO FIRST AI Spotlight Card */}
      {doFirstTask ? (
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.18), rgba(6, 182, 212, 0.08))',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.15rem',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(239, 68, 68, 0.35)'
                }}
              >
                DO FIRST
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {doFirstTask.priorityBreakdown?.totalScore || 94}/100
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <Clock size={12} />
              <span>{formatDuration(doFirstTask.estimatedDuration)}</span>
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.35, marginBottom: '0.45rem' }}>
            {doFirstTask.title}
          </h3>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', lineHeight: 1.4 }}>
            {doFirstTask.description}
          </p>

          {/* Algorithmic Reason */}
          {doFirstTask.priorityBreakdown?.reasons && doFirstTask.priorityBreakdown.reasons.length > 0 && (
            <div
              style={{
                fontSize: '0.7rem',
                color: '#cbd5e1',
                background: 'rgba(0, 0, 0, 0.35)',
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Sparkles size={12} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span>{doFirstTask.priorityBreakdown.reasons[0]}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => {
                toggleTaskComplete(doFirstTask.id);
                triggerConfetti();
              }}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Complete</span>
            </button>

            <button
              onClick={() => setIsFocusModeOpen(true)}
              style={{
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
            >
              <Play size={14} style={{ color: 'var(--accent-cyan)' }} />
              <span>Focus</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <CheckCircle2 size={32} style={{ color: 'var(--accent-emerald)', margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>All Caught Up!</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>0 pending high priority tasks</div>
        </div>
      )}

      {/* Up Next Section */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Up Next Today
          </span>
          <button
            onClick={onGoToTasks}
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}
          >
            <span>View All</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {todaysTasks.map((t) => (
            <div
              key={t.id}
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                <button
                  onClick={() => toggleTaskComplete(t.id)}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    background: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{t.category}</span>
                    <span>•</span>
                    <span>{formatDuration(t.estimatedDuration)}</span>
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                  background: t.priority === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                  color: t.priority === 'Critical' ? '#f87171' : '#818cf8',
                  fontWeight: 700,
                  flexShrink: 0
                }}
              >
                {t.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Schedule Highlight */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Next Schedule Block
          </span>
          <button
            onClick={onGoToSchedule}
            style={{ background: 'none', border: 'none', color: 'var(--accent-emerald)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}
          >
            <span>Full Schedule</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div
          style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)'
            }}
          >
            <Calendar size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
              Co-Founder Sprint & Canvas Sync
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              16:30 - 18:30 (Today) • Vaish & Alex
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
