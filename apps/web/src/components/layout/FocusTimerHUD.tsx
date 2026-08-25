import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, CheckCircle2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDuration } from '@kavexa/utils';

export const FocusTimerHUD: React.FC = () => {
  const { isFocusModeOpen, setIsFocusModeOpen, tasks, toggleTaskComplete } = useApp();

  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      alert('⚡ Deep Work Sprint Completed! Time for a recharge.');
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  if (!isFocusModeOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);

  const activeFocusTask = tasks.find((t) => t.status === 'In Progress') || tasks[0];

  const setDuration = (mins: number) => {
    setIsActive(false);
    setTotalSeconds(mins * 60);
    setSecondsLeft(mins * 60);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        width: '360px',
        background: '#0d1322',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.25)',
        padding: '1.25rem',
        zIndex: 85,
        backdropFilter: 'blur(16px)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>KAVEXA Deep Work HUD</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-icon"
            style={{ width: '28px', height: '28px' }}
            title={soundEnabled ? 'Mute ambient' : 'Enable ambient white noise'}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button
            onClick={() => setIsFocusModeOpen(false)}
            className="btn-icon"
            style={{ width: '28px', height: '28px' }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Preset Duration Buttons */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setDuration(25)}
          className={`btn ${totalSeconds === 25 * 60 ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem', justifyContent: 'center' }}
        >
          25m Pomodoro
        </button>
        <button
          onClick={() => setDuration(50)}
          className={`btn ${totalSeconds === 50 * 60 ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem', justifyContent: 'center' }}
        >
          50m Sprint
        </button>
        <button
          onClick={() => setDuration(90)}
          className={`btn ${totalSeconds === 90 * 60 ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem', justifyContent: 'center' }}
        >
          90m Deep
        </button>
      </div>

      {/* Big Timer Display */}
      <div
        style={{
          textAlign: 'center',
          padding: '1.25rem 0',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1rem'
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            color: isActive ? '#818cf8' : '#f8fafc',
            textShadow: isActive ? '0 0 20px rgba(99, 102, 241, 0.5)' : 'none'
          }}
        >
          {timeFormatted}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          {isActive ? '⚡ Deep Focus In Progress' : 'Paused / Ready'}
        </div>

        {/* Progress Bar */}
        <div style={{ width: '80%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', margin: '0.75rem auto 0', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', transition: 'width 1s linear' }} />
        </div>
      </div>

      {/* Timer Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setIsActive(!isActive)}
          className="btn btn-primary"
          style={{ flex: 1, justifyContent: 'center', padding: '0.55rem' }}
        >
          {isActive ? <Pause size={16} /> : <Play size={16} />}
          <span>{isActive ? 'Pause Sprint' : 'Start Focus'}</span>
        </button>
        <button
          onClick={() => {
            setIsActive(false);
            setSecondsLeft(totalSeconds);
          }}
          className="btn btn-secondary"
          style={{ padding: '0.55rem 0.85rem' }}
          title="Reset timer"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Active Focus Target Task */}
      {activeFocusTask && (
        <div
          style={{
            padding: '0.75rem',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.35rem' }}>
            Current Target
          </div>
          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.4rem', lineHeight: 1.3 }}>
            {activeFocusTask.title}
          </div>
          <button
            onClick={() => toggleTaskComplete(activeFocusTask.id)}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.35rem', fontSize: '0.75rem', justifyContent: 'center', gap: '0.35rem' }}
          >
            <CheckCircle2 size={13} style={{ color: 'var(--accent-emerald)' }} />
            <span>Mark Task Complete</span>
          </button>
        </div>
      )}
    </div>
  );
};
