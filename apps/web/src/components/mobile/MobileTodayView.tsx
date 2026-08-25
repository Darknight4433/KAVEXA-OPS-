import React, { useState } from 'react';
import {
  Zap,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  AlertTriangle,
  Play,
  Bell,
  HelpCircle,
  X,
  ChevronRight,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getDoFirstTask, calculateTeamSync } from '@kavexa/intelligence';
import { formatDuration, getDaysUntil } from '@kavexa/utils';

interface MobileTodayViewProps {
  onGoToTasks: () => void;
  onGoToProjects: () => void;
}

export const MobileTodayView: React.FC<MobileTodayViewProps> = ({
  onGoToTasks,
  onGoToProjects
}) => {
  const {
    currentMember,
    tasks,
    projects,
    members,
    schedules,
    toggleTaskComplete,
    triggerConfetti,
    setIsFocusModeOpen,
    setSelectedTaskId
  } = useApp();

  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);

  const doFirstTask = getDoFirstTask(tasks, {
    allTasks: tasks,
    projects,
    members,
    schedules,
    activeMemberId: currentMember.id
  });

  const nextTasks = tasks
    .filter((t) => t.status !== 'Completed' && t.id !== doFirstTask?.id)
    .slice(0, 3);

  // Current or next schedule event
  const nextEvent = schedules
    .filter((s) => s.memberId === currentMember.id || !s.memberId)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: '1.25rem 1rem', paddingBottom: '90px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img
            src="/app-icon.png"
            alt="KAVEXA"
            style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#F5F5F5', letterSpacing: '0.05em' }}>
              KAVEXA OPS
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => alert('All workspace alerts are up to date.')}
            style={{
              background: 'none',
              border: 'none',
              color: '#A3A3A3',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Bell size={18} />
          </button>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#111111',
              border: '1px solid #303030',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F5F5F5',
              fontSize: '0.75rem',
              fontWeight: 800
            }}
          >
            {currentMember.name.charAt(0)}
          </div>
        </div>
      </div>

      {/* Greeting Section */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F5F5F5', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
          {greeting}, {currentMember.name.split(' ')[0]}
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#A3A3A3' }}>
          Here is your high-impact operational focus for today.
        </p>
      </div>

      {/* ================= TODAY'S FOCUS CARD ================= */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6366F1' }}>
            TODAY'S FOCUS
          </span>
          {doFirstTask && (
            <button
              onClick={() => setIsWhyModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#666666',
                fontSize: '0.7rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <HelpCircle size={12} />
              <span>Why this task?</span>
            </button>
          )}
        </div>

        {doFirstTask ? (
          <div
            style={{
              backgroundColor: '#0A0A0A',
              border: '1px solid #242424',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: '#818CF8',
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}
              >
                {doFirstTask.priority} Priority
              </span>
              <span style={{ fontSize: '0.7rem', color: '#666666' }}>
                Est: {doFirstTask.estimatedMinutes || 45} mins
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F5F5F5', lineHeight: 1.4, marginBottom: '0.5rem' }}>
              {doFirstTask.title}
            </h3>

            <div style={{ fontSize: '0.75rem', color: '#A3A3A3', marginBottom: '1.25rem' }}>
              {doFirstTask.category} • Due {doFirstTask.dueDate ? new Date(doFirstTask.dueDate).toLocaleDateString() : 'Today'}
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                onClick={() => {
                  setIsFocusModeOpen(true);
                  setSelectedTaskId(doFirstTask.id);
                }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', justifyContent: 'center' }}
              >
                <Play size={14} fill="#ffffff" />
                <span>Start Focus</span>
              </button>
              <button
                onClick={() => {
                  toggleTaskComplete(doFirstTask.id);
                  triggerConfetti();
                }}
                className="btn btn-secondary"
                style={{ padding: '0.6rem 0.9rem', fontSize: '0.8rem' }}
                title="Mark Completed"
              >
                <CheckCircle2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#0A0A0A',
              border: '1px solid #242424',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem 1.25rem',
              textAlign: 'center'
            }}
          >
            <CheckCircle2 size={32} style={{ color: '#10B981', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F5F5F5', marginBottom: '0.25rem' }}>
              All Priority Tasks Completed
            </div>
            <p style={{ fontSize: '0.75rem', color: '#666666', marginBottom: '1rem' }}>
              Nothing urgent needs your attention right now.
            </p>
            <button
              onClick={onGoToTasks}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
            >
              Browse All Tasks
            </button>
          </div>
        )}
      </div>

      {/* ================= IMPORTANT NEXT ================= */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A3A3A3' }}>
            IMPORTANT NEXT
          </span>
          <button
            onClick={onGoToTasks}
            style={{
              background: 'none',
              border: 'none',
              color: '#6366F1',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontWeight: 600
            }}
          >
            <span>View All</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {nextTasks.length === 0 ? (
            <div style={{ padding: '1rem', backgroundColor: '#0A0A0A', border: '1px solid #242424', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: '#666666', textAlign: 'center' }}>
              No upcoming tasks pending.
            </div>
          ) : (
            nextTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTaskId(t.id);
                  onGoToTasks();
                }}
                style={{
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #242424',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskComplete(t.id);
                      triggerConfetti();
                    }}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      border: '1.5px solid #444444',
                      background: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#F5F5F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#666666', marginTop: '0.1rem' }}>
                      {t.category}
                    </div>
                  </div>
                </div>

                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: t.priority === 'Critical' ? '#EF4444' : t.priority === 'High' ? '#F59E0B' : '#666666', marginLeft: '0.5rem' }}>
                  {t.priority}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= TODAY'S SCHEDULE ================= */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A3A3A3' }}>
            TODAY'S SCHEDULE
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#0A0A0A',
            border: '1px solid #242424',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem'
          }}
        >
          {nextEvent ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    padding: '0.4rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    color: '#818CF8'
                  }}
                >
                  <Calendar size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F5F5F5' }}>
                    {nextEvent.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#666666', marginTop: '0.1rem' }}>
                    {nextEvent.startTime} - {nextEvent.endTime} • {nextEvent.type}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: '#666666', textAlign: 'center', padding: '0.5rem 0' }}>
              No more scheduled events for today. Open for deep work.
            </div>
          )}
        </div>
      </div>

      {/* ================= WHY THIS TASK BOTTOM SHEET MODAL ================= */}
      {isWhyModalOpen && doFirstTask && (
        <div className="modal-overlay" onClick={() => setIsWhyModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#171717',
              border: '1px solid #303030',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '460px',
              width: '92vw',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F5F5F5' }}>
                Why This Task Is Recommended
              </h3>
              <button onClick={() => setIsWhyModalOpen(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#A3A3A3' }}>Deadline Urgency (30%)</span>
                  <span style={{ color: '#F5F5F5', fontWeight: 700 }}>{doFirstTask.priorityBreakdown?.deadlineScore ?? 28} / 30</span>
                </div>
                <div style={{ height: '5px', backgroundColor: '#111111', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${((doFirstTask.priorityBreakdown?.deadlineScore ?? 28) / 30) * 100}%`, height: '100%', backgroundColor: '#6366F1' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#A3A3A3' }}>Project Impact (20%)</span>
                  <span style={{ color: '#F5F5F5', fontWeight: 700 }}>{doFirstTask.priorityBreakdown?.impactScore ?? 18} / 20</span>
                </div>
                <div style={{ height: '5px', backgroundColor: '#111111', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${((doFirstTask.priorityBreakdown?.impactScore ?? 18) / 20) * 100}%`, height: '100%', backgroundColor: '#6366F1' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#A3A3A3' }}>Dependency Unlocking (15%)</span>
                  <span style={{ color: '#F5F5F5', fontWeight: 700 }}>{doFirstTask.priorityBreakdown?.dependencyScore ?? 14} / 15</span>
                </div>
                <div style={{ height: '5px', backgroundColor: '#111111', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${((doFirstTask.priorityBreakdown?.dependencyScore ?? 14) / 15) * 100}%`, height: '100%', backgroundColor: '#6366F1' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#A3A3A3' }}>Schedule Fit (10%)</span>
                  <span style={{ color: '#F5F5F5', fontWeight: 700 }}>{doFirstTask.priorityBreakdown?.scheduleScore ?? 9} / 10</span>
                </div>
                <div style={{ height: '5px', backgroundColor: '#111111', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${((doFirstTask.priorityBreakdown?.scheduleScore ?? 9) / 10) * 100}%`, height: '100%', backgroundColor: '#6366F1' }} />
                </div>
              </div>
            </div>

            {/* Rationale Text */}
            <div style={{ padding: '0.75rem', backgroundColor: '#111111', borderRadius: 'var(--radius-md)', border: '1px solid #242424', fontSize: '0.75rem', color: '#A3A3A3', lineHeight: 1.45, marginBottom: '1.25rem' }}>
              💡 <strong>AI Rationale:</strong> {doFirstTask.priorityBreakdown?.reasons?.join(' • ') || 'Highest weighted deliverable on your critical path. Completing this unlocks next milestones.'}
            </div>

            <button
              onClick={() => setIsWhyModalOpen(false)}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
