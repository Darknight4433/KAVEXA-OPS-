import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Timer,
  Scale,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { StudySubject, StudyTask } from '@kavexa/shared-types';
import { formatDuration, getDaysUntil } from '@kavexa/utils';

export const StudyHub: React.FC = () => {
  const {
    subjects,
    studyTasks,
    toggleStudyTask,
    createStudyTask,
    setIsFocusModeOpen,
    tasks
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'homework' | 'exams' | 'revision'>('all');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || 'sub_ds');
  const [newType, setNewType] = useState<StudyTask['type']>('Homework');
  const [newDeadline, setNewDeadline] = useState('');
  const [newEstTime, setNewEstTime] = useState(60);

  // Compute Work-Study Balance
  const studyHours = studyTasks.reduce((acc, st) => acc + (st.isCompleted ? 0 : st.estimatedStudyTime / 60), 0);
  const kavexaHours = tasks
    .filter((t) => t.category === 'KAVEXA Work' && t.status !== 'Completed')
    .reduce((acc, t) => acc + t.estimatedDuration / 60, 0);

  const totalHours = studyHours + kavexaHours || 1;
  const studyPercent = Math.round((studyHours / totalHours) * 100);
  const kavexaPercent = 100 - studyPercent;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createStudyTask({
      title: newTitle.trim(),
      subjectId: newSubjectId,
      type: newType,
      deadline: newDeadline || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      estimatedStudyTime: Number(newEstTime) || 60
    });
    setNewTitle('');
    setIsNewTaskOpen(false);
  };

  const filteredStudyTasks = studyTasks.filter((st) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'homework') return st.type === 'Homework' || st.type === 'Assignment';
    if (activeTab === 'exams') return st.type === 'Exam';
    if (activeTab === 'revision') return st.type === 'Revision';
    return true;
  });

  return (
    <div className="workspace-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <GraduationCap size={22} style={{ color: 'var(--accent-amber)' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              Academic Study Hub
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Balance coursework, exam countdowns, and homework alongside KAVEXA startup sprints.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setIsFocusModeOpen(true)} className="btn btn-secondary">
            <Timer size={15} style={{ color: 'var(--accent-cyan)' }} />
            <span>Study Timer (Pomodoro)</span>
          </button>
          <button onClick={() => setIsNewTaskOpen(true)} className="btn btn-primary">
            <Plus size={15} />
            <span>Add Study Item</span>
          </button>
        </div>
      </div>

      {/* Work-Study Balance Gauge */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(245, 158, 11, 0.06))',
          border: '1px solid rgba(6, 182, 212, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Scale size={18} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Work-Study Balance Radar
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
            {studyPercent >= 35 && studyPercent <= 65 ? '⚖️ Healthy Balanced Schedule' : '⚠️ Schedule Skew Detected'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
          <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${studyPercent}%`, height: '100%', background: '#06b6d4', transition: 'width 0.3s ease' }} />
            <div style={{ width: `${kavexaPercent}%`, height: '100%', background: '#6366f1', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--accent-cyan)' }}>
            📚 Academics / Studies: <strong>{studyHours.toFixed(1)} hrs ({studyPercent}%)</strong>
          </span>
          <span style={{ color: '#818cf8' }}>
            ⚡ KAVEXA Startup Ops: <strong>{kavexaHours.toFixed(1)} hrs ({kavexaPercent}%)</strong>
          </span>
        </div>
      </div>

      {/* University Subject Cards */}
      <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
        Enrolled University Courses
      </div>
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {subjects.map((sub) => {
          const subTasks = studyTasks.filter((t) => t.subjectId === sub.id && !t.isCompleted);
          return (
            <div
              key={sub.id}
              className="card"
              style={{ borderTop: `3px solid ${sub.color || 'var(--accent-cyan)'}`, padding: '1rem 1.25rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{sub.code}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-amber)', background: 'rgba(245,158,11,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  {sub.credits} Credits
                </span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>{sub.name}</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                {sub.instructor}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {subTasks.length} pending assignment(s)
              </div>
            </div>
          );
        })}
      </div>

      {/* Academic Tasks & Exams Section */}
      <div className="card">
        <div className="tabs-header" style={{ marginBottom: '1rem' }}>
          <button onClick={() => setActiveTab('all')} className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}>
            All Coursework ({studyTasks.length})
          </button>
          <button onClick={() => setActiveTab('homework')} className={`tab-btn ${activeTab === 'homework' ? 'active' : ''}`}>
            Homework & Assignments
          </button>
          <button onClick={() => setActiveTab('exams')} className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}>
            Upcoming Exams
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filteredStudyTasks.map((st) => {
            const subject = subjects.find((s) => s.id === st.subjectId);
            const daysLeft = getDaysUntil(st.deadline);

            return (
              <div
                key={st.id}
                style={{
                  padding: '0.85rem 1rem',
                  background: st.isCompleted ? 'rgba(255,255,255,0.01)' : 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid',
                  borderColor: st.isCompleted ? 'transparent' : 'var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={st.isCompleted}
                    onChange={() => toggleStudyTask(st.id)}
                    style={{ accentColor: 'var(--accent-emerald)', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: st.isCompleted ? 'var(--text-muted)' : '#ffffff',
                          textDecoration: st.isCompleted ? 'line-through' : 'none'
                        }}
                      >
                        {st.title}
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          background: 'rgba(245, 158, 11, 0.12)',
                          color: '#fbbf24'
                        }}
                      >
                        {st.type}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: subject?.color || 'var(--accent-cyan)' }}>{subject?.name}</span>
                      <span>•</span>
                      <span>⏱️ {formatDuration(st.estimatedStudyTime)}</span>
                      <span>•</span>
                      <span>📅 Due: {st.deadline} ({daysLeft >= 0 ? `In ${daysLeft} days` : 'Overdue'})</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleStudyTask(st.id)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                >
                  <CheckCircle2 size={13} style={{ color: st.isCompleted ? 'var(--accent-emerald)' : undefined }} />
                  <span>{st.isCompleted ? 'Done' : 'Mark Complete'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Study Item Modal */}
      {isNewTaskOpen && (
        <div className="modal-overlay" onClick={() => setIsNewTaskOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              Add Academic Study Item
            </h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="form-select"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assignment / Exam Title</label>
                <input
                  type="text"
                  placeholder="e.g. Midterm Revision, Lab 4..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="Homework">Homework</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Exam">Exam</option>
                    <option value="Revision">Revision</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Estimated Hours</label>
                  <input
                    type="number"
                    value={newEstTime}
                    onChange={(e) => setNewEstTime(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setIsNewTaskOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Study Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
