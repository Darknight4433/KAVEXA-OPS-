import React from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateTeamSync } from '@kavexa/intelligence';

export const MobileScheduleView: React.FC = () => {
  const { schedules, members } = useApp();
  const teamSync = calculateTeamSync(members, schedules);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'KAVEXA Work':
        return { bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.4)', text: '#818cf8' };
      case 'School Class':
        return { bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.4)', text: 'var(--accent-cyan)' };
      case 'Study Block':
        return { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)', text: 'var(--accent-emerald)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)', text: '#cbd5e1' };
    }
  };

  return (
    <div style={{ padding: '1rem', paddingBottom: '90px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.2rem' }}>
          Unified Schedule
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Combined university lectures, study blocks, and KAVEXA sprints.
        </p>
      </div>

      {/* AI Smart Window Banner */}
      {teamSync.bestCollaborationWindow && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.08))',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}
        >
          <Sparkles size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff' }}>
              Co-Founder Free Sync Window
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>
              {teamSync.bestCollaborationWindow.startTime} - {teamSync.bestCollaborationWindow.endTime} (Today)
            </div>
          </div>
        </div>
      )}

      {/* Schedule Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {schedules.map((ev) => {
          const style = getTypeStyle(ev.type);

          return (
            <div
              key={ev.id}
              style={{
                background: style.bg,
                borderLeft: `4px solid ${style.text}`,
                borderTop: `1px solid ${style.border}`,
                borderRight: `1px solid ${style.border}`,
                borderBottom: `1px solid ${style.border}`,
                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                padding: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: style.text, textTransform: 'uppercase' }}>
                  {ev.type}
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#ffffff', fontWeight: 600 }}>
                  {ev.startTime} - {ev.endTime}
                </span>
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                {ev.title}
              </div>

              {ev.location && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  📍 {ev.location}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
