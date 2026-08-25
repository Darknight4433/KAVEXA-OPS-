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
  Sparkles,
  Trash2,
  User,
  Layers
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
    deleteStudyTask,
    createSubject,
    deleteSubject,
    setIsFocusModeOpen,
    tasks,
    currentMember,
    currentMemberId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'homework' | 'exams' | 'revision'>('all');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNewSubjectOpen, setIsNewSubjectOpen] = useState(false);

  // Subject Form State
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subInstructor, setSubInstructor] = useState('');
  const [subCredits, setSubCredits] = useState(4);
  const [subColor, setSubColor] = useState('#06b6d4');

  // Personal filter: Study hub items are personal to the logged in user
  const mySubjects = subjects.filter(
    (s) => !s.memberId || s.memberId === currentMemberId || s.memberId === currentMember.id
  );

  // Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(mySubjects[0]?.id || 'sub_general');
  const [newType, setNewType] = useState<StudyTask['type']>('Homework');
  const [newDeadline, setNewDeadline] = useState('');
  const [newEstTime, setNewEstTime] = useState(60);

  // Personal study tasks
  const myStudyTasks = studyTasks.filter(
    (st) => !st.memberId || st.memberId === currentMemberId || st.memberId === currentMember.id
  );

  // Compute Work-Study Balance
  const studyHours = myStudyTasks.reduce((acc, st) => acc + (st.isCompleted ? 0 : st.estimatedStudyTime / 60), 0);
  const kavexaHours = tasks
    .filter((t) => t.category === 'KAVEXA Work' && t.status !== 'Completed' && (!t.assignedMemberId || t.assignedMemberId === currentMemberId))
    .reduce((acc, t) => acc + t.estimatedDuration / 60, 0);

  const totalHours = studyHours + kavexaHours || 1;
  const studyPercent = Math.round((studyHours / totalHours) * 100);
  const kavexaPercent = 100 - studyPercent;

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;
    const created = createSubject({
      name: subName.trim(),
      code: subCode.trim() || 'ACAD101',
      instructor: subInstructor.trim() || 'Faculty',
      credits: Number(subCredits) || 4,
      color: subColor,
      memberId: currentMemberId
    });
    setNewSubjectId(created.id);
    setSubName('');
    setSubCode('');
    setSubInstructor('');
    setIsNewSubjectOpen(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createStudyTask({
      title: newTitle.trim(),
      subjectId: newSubjectId || mySubjects[0]?.id,
      type: newType,
      deadline: newDeadline || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      estimatedStudyTime: Number(newEstTime) || 60,
      memberId: currentMemberId
    });
    setNewTitle('');
    setIsNewTaskOpen(false);
  };

  const filteredStudyTasks = myStudyTasks.filter((st) => {
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
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--accent-cyan)',
                background: 'rgba(6, 182, 212, 0.12)',
                padding: '0.2rem 0.5rem',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: '1px solid rgba(6, 182, 212, 0.25)'
              }}
            >
              <User size={11} />
              <span>Personal to {currentMember.name}</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Private academic coursework, university subjects, and homework synced exclusively for your personal schedule.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setIsFocusModeOpen(true)} className="btn btn-secondary">
            <Timer size={15} style={{ color: 'var(--accent-cyan)' }} />
            <span>Study Timer (Pomodoro)</span>
          </button>
          <button onClick={() => setIsNewSubjectOpen(true)} className="btn btn-secondary">
            <BookOpen size={15} />
            <span>Add Course</span>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          My Enrolled Courses ({mySubjects.length})
        </div>
        <button
          onClick={() => setIsNewSubjectOpen(true)}
          style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
        >
          <Plus size={13} />
          <span>Add Course</span>
        </button>
      </div>

      {mySubjects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', marginBottom: '1.5rem', border: '1px dashed var(--border-subtle)' }}>
          <BookOpen size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.3rem' }}>No Courses Added Yet</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
            Add your semester courses (e.g. Operating Systems, Calculus) to track homework and exam deadlines.
          </p>
          <button onClick={() => setIsNewSubjectOpen(true)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
            <Plus size={14} />
            <span>Add My First Course</span>
          </button>
        </div>
      ) : (
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          {mySubjects.map((sub) => {
            const subTasks = myStudyTasks.filter((t) => t.subjectId === sub.id && !t.isCompleted);
            return (
              <div
                key={sub.id}
                className="card"
                style={{
                  borderTop: `3px solid ${sub.color || 'var(--accent-cyan)'}`,
                  padding: '1rem 1.25rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{sub.code}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-amber)', background: 'rgba(245,158,11,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      {sub.credits} Credits
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete course "${sub.name}" and all its study tasks?`)) {
                          deleteSubject(sub.id);
                        }
                      }}
                      className="btn-icon"
                      style={{ width: '22px', height: '22px' }}
                      title="Delete Course"
                    >
                      <Trash2 size={12} style={{ color: 'var(--accent-rose)' }} />
                    </button>
                  </div>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>{sub.name}</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {sub.instructor}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {subTasks.length} pending task(s)
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Academic Tasks & Exams Section */}
      <div className="card">
        <div className="tabs-header" style={{ marginBottom: '1rem' }}>
          <button onClick={() => setActiveTab('all')} className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}>
            All Coursework ({myStudyTasks.length})
          </button>
          <button onClick={() => setActiveTab('homework')} className={`tab-btn ${activeTab === 'homework' ? 'active' : ''}`}>
            Homework & Assignments
          </button>
          <button onClick={() => setActiveTab('exams')} className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}>
            Upcoming Exams
          </button>
        </div>

        {filteredStudyTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <GraduationCap size={36} style={{ color: 'var(--text-dim)', margin: '0 auto 0.75rem' }} />
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '0.25rem' }}>No study items found</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              Add your homework, lab assignments, and exam review tasks.
            </p>
            <button onClick={() => setIsNewTaskOpen(true)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              <Plus size={14} />
              <span>Add Homework / Exam</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filteredStudyTasks.map((st) => {
              const subject = mySubjects.find((s) => s.id === st.subjectId);
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
                        <span style={{ color: subject?.color || 'var(--accent-cyan)' }}>{subject?.name || 'Academic'}</span>
                        <span>•</span>
                        <span>⏱️ {formatDuration(st.estimatedStudyTime)}</span>
                        <span>•</span>
                        <span>📅 Due: {st.deadline} ({daysLeft >= 0 ? `In ${daysLeft} days` : 'Overdue'})</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => toggleStudyTask(st.id)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                    >
                      <CheckCircle2 size={13} style={{ color: st.isCompleted ? 'var(--accent-emerald)' : undefined }} />
                      <span>{st.isCompleted ? 'Done' : 'Mark Complete'}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete study task "${st.title}"?`)) deleteStudyTask(st.id);
                      }}
                      className="btn-icon"
                      style={{ width: '28px', height: '28px' }}
                      title="Delete Study Task"
                    >
                      <Trash2 size={13} style={{ color: 'var(--accent-rose)' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Course / Subject Modal */}
      {isNewSubjectOpen && (
        <div className="modal-overlay" onClick={() => setIsNewSubjectOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              Add University Course / Subject
            </h3>
            <form onSubmit={handleCreateSubject}>
              <div className="form-group">
                <label className="form-label">Course Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Systems, Physics 2..."
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS-401"
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Instructor / Professor</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Roberts"
                    value={subInstructor}
                    onChange={(e) => setSubInstructor(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Credits</label>
                  <input
                    type="number"
                    value={subCredits}
                    onChange={(e) => setSubCredits(Number(e.target.value))}
                    className="form-input"
                    min="1"
                    max="10"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Accent Color</label>
                  <select
                    value={subColor}
                    onChange={(e) => setSubColor(e.target.value)}
                    className="form-select"
                  >
                    <option value="#06b6d4">Cyan</option>
                    <option value="#6366f1">Indigo</option>
                    <option value="#10b981">Emerald</option>
                    <option value="#f59e0b">Amber</option>
                    <option value="#ec4899">Pink</option>
                    <option value="#8b5cf6">Purple</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setIsNewSubjectOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Study Item Modal */}
      {isNewTaskOpen && (
        <div className="modal-overlay" onClick={() => setIsNewTaskOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              Add Academic Study Item
            </h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Course / Subject</label>
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="form-select"
                >
                  {mySubjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assignment / Exam Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Midterm Revision, Lab 4, Chapter 3 Homework..."
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
                  <label className="form-label">Estimated Time (Mins)</label>
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
