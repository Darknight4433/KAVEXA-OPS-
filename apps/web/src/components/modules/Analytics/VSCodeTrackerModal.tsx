import React, { useState, useEffect } from 'react';
import {
  Code,
  Terminal,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  FileCode2,
  Calendar,
  Layers,
  Cpu,
  Activity,
  X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { formatDuration } from '@kavexa/utils';

export const VSCodeTrackerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { createScheduleEvent, tasks, projects, currentMember, updateMember, triggerConfetti } = useApp();

  // Local storage persisted coding stats
  const [codingSecondsToday, setCodingSecondsToday] = useState<number>(() => {
    const saved = localStorage.getItem('kavexa_vscode_seconds_today');
    return saved ? Number(saved) : 8640; // Default ~2h 24m
  });

  const [isSessionActive, setIsSessionActive] = useState<boolean>(true);
  const [activeEditor, setActiveEditor] = useState<string>('Visual Studio Code');
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    return currentMember.currentProjectId || (projects[0]?.id || 'proj-1');
  });
  const [currentFile, setCurrentFile] = useState<string>('ProjectKnowledgeHub.tsx');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('TypeScript / React');

  // Real timer tick
  useEffect(() => {
    let interval: any = null;
    if (isSessionActive) {
      interval = setInterval(() => {
        setCodingSecondsToday((prev) => {
          const next = prev + 1;
          localStorage.setItem('kavexa_vscode_seconds_today', String(next));
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionActive]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  if (!isOpen) return null;

  const hours = Math.floor(codingSecondsToday / 3600);
  const minutes = Math.floor((codingSecondsToday % 3600) / 60);
  const seconds = codingSecondsToday % 60;

  const handleLogToSchedule = () => {
    createScheduleEvent({
      title: `💻 VS Code Coding Session (${hours}h ${minutes}m)`,
      type: 'KAVEXA Work',
      description: `Active development on ${activeProject?.name || 'KAVEXA-OPS'} (${currentFile}). Logged via VS Code Tracker.`,
      startTime: '14:00',
      endTime: '17:00'
    });
    triggerConfetti();
    alert('⚡ Coding session logged directly into your Unified Schedule!');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', width: '92vw', padding: '1.5rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <Code size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                  VS Code & Developer Time Tracker
                </h3>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '999px',
                    background: isSessionActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: isSessionActive ? '#10b981' : '#f59e0b',
                    border: `1px solid ${isSessionActive ? '#10b981' : '#f59e0b'}`
                  }}
                >
                  {isSessionActive ? '● LIVE TRACKING' : '❚❚ PAUSED'}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Real-time developer telemetry, active editor sessions, and deep work tracking.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        {/* Live Active Coding Clock Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(6, 182, 212, 0.08))',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Today's Deep Work Coding Time
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              🔥 <strong>+24%</strong> above daily target • 4 active coding intervals today
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setIsSessionActive(!isSessionActive)}
              className={isSessionActive ? 'btn btn-secondary' : 'btn btn-primary'}
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', gap: '0.35rem' }}
            >
              {isSessionActive ? <Pause size={14} /> : <Play size={14} />}
              <span>{isSessionActive ? 'Pause Tracker' : 'Resume Tracker'}</span>
            </button>
            <button
              onClick={handleLogToSchedule}
              className="btn btn-primary"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', gap: '0.35rem' }}
            >
              <Calendar size={14} />
              <span>Log to Schedule</span>
            </button>
          </div>
        </div>

        {/* Live IDE Telemetry Grid */}
        <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div className="card" style={{ padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Terminal size={16} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>Active Project & Target</span>
            </div>
            <select
              value={activeProjectId}
              onChange={(e) => {
                const newProjId = e.target.value;
                setActiveProjectId(newProjId);
                updateMember(currentMember.id, {
                  currentProjectId: newProjId,
                  totalHoursSpent: (currentMember.totalHoursSpent || 18) + 1,
                  activeCodingHoursToday: Number((codingSecondsToday / 3600).toFixed(1))
                });
              }}
              style={{
                width: '100%',
                padding: '0.4rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-medium)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '0.4rem'
              }}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                  {p.name} ({p.status})
                </option>
              ))}
            </select>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              IDE: <span style={{ color: 'var(--accent-emerald)' }}>{activeEditor} (Connected)</span>
            </div>
          </div>

          <div className="card" style={{ padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FileCode2 size={16} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>Active File & Stack</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.2rem' }}>
              {currentFile}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Primary: <span style={{ color: 'var(--accent-cyan)' }}>{selectedLanguage}</span>
            </div>
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Languages & Technology Ratio
          </div>

          <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden', display: 'flex', marginBottom: '0.75rem' }}>
            <div style={{ width: '62%', height: '100%', background: '#6366f1' }} title="TypeScript (62%)" />
            <div style={{ width: '22%', height: '100%', background: '#06b6d4' }} title="React / TSX (22%)" />
            <div style={{ width: '10%', height: '100%', background: '#10b981' }} title="Python / Robotics (10%)" />
            <div style={{ width: '6%', height: '100%', background: '#f59e0b' }} title="C++ / Firmware (6%)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', fontSize: '0.7rem' }}>
            <div style={{ color: '#818cf8' }}>● TypeScript: <strong>62%</strong></div>
            <div style={{ color: '#06b6d4' }}>● React / TSX: <strong>22%</strong></div>
            <div style={{ color: '#10b981' }}>● Python / AI: <strong>10%</strong></div>
            <div style={{ color: '#f59e0b' }}>● C++ / CAD: <strong>6%</strong></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              setCodingSecondsToday(0);
              localStorage.setItem('kavexa_vscode_seconds_today', '0');
            }}
            className="btn btn-secondary"
            style={{ color: 'var(--accent-rose)' }}
          >
            <RotateCcw size={13} />
            <span>Reset Today</span>
          </button>
        </div>
      </div>
    </div>
  );
};
