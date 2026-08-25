import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  X,
  ChevronRight,
  Clock,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '@kavexa/shared-types';

export const MobileTasksView: React.FC = () => {
  const {
    tasks,
    currentMemberId,
    projects,
    toggleTaskComplete,
    deleteTask,
    updateTask,
    setIsNewTaskModalOpen,
    triggerConfetti
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'All' | 'Mine' | 'Today' | 'Upcoming'>('All');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterMode === 'All' ? true :
      filterMode === 'Mine' ? t.assignedMemberId === currentMemberId :
      filterMode === 'Today' ? t.deadline?.includes(new Date().toISOString().slice(0, 10)) :
      t.status !== 'Completed';

    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: '1rem', paddingBottom: '90px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F5F5F5', letterSpacing: '-0.02em' }}>
          Tasks
        </h2>
        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="btn btn-primary"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', gap: '0.35rem' }}
        >
          <Plus size={14} />
          <span>New</span>
        </button>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: '#666666' }} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.55rem 0.75rem 0.55rem 2.25rem',
            backgroundColor: '#111111',
            border: '1px solid #242424',
            borderRadius: 'var(--radius-md)',
            color: '#F5F5F5',
            fontSize: '0.8rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
        {(['All', 'Mine', 'Today', 'Upcoming'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setFilterMode(mode)}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              border: `1px solid ${filterMode === mode ? '#6366F1' : '#242424'}`,
              backgroundColor: filterMode === mode ? 'rgba(99, 102, 241, 0.15)' : '#111111',
              color: filterMode === mode ? '#F5F5F5' : '#A3A3A3',
              fontSize: '0.75rem',
              fontWeight: filterMode === mode ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', background: '#0A0A0A', border: '1px solid #242424', borderRadius: 'var(--radius-lg)' }}>
            <CheckCircle2 size={36} style={{ color: '#444444', marginBottom: '0.75rem' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F5F5F5', marginBottom: '0.3rem' }}>
              Nothing needs your attention here
            </div>
            <p style={{ fontSize: '0.75rem', color: '#666666', marginBottom: '1.25rem' }}>
              All tasks in this view are completed or no tasks match your filter.
            </p>
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.75rem', padding: '0.45rem 1rem' }}
            >
              <Plus size={14} />
              <span>Add Task</span>
            </button>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isDone = t.status === 'Completed';
            const proj = projects.find((p) => p.id === t.projectId);

            return (
              <div
                key={t.id}
                onClick={() => setSelectedTask(t)}
                style={{
                  backgroundColor: '#111111',
                  border: '1px solid #242424',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskComplete(t.id);
                      if (!isDone) triggerConfetti();
                    }}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '5px',
                      border: `1.5px solid ${isDone ? '#10B981' : '#444444'}`,
                      backgroundColor: isDone ? '#10B981' : 'transparent',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {isDone && '✓'}
                  </button>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: isDone ? '#666666' : '#F5F5F5',
                        textDecoration: isDone ? 'line-through' : 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {t.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#666666', marginTop: '0.15rem' }}>
                      {proj ? proj.name : t.category} • {t.deadline ? `Due ${new Date(t.deadline).toLocaleDateString()}` : 'No deadline'}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: t.priority === 'Critical' ? '#EF4444' : t.priority === 'High' ? '#F59E0B' : '#666666',
                    marginLeft: '0.5rem'
                  }}
                >
                  {t.priority}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* ================= TASK DETAIL SHEET ================= */}
      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#171717',
              border: '1px solid #303030',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '520px',
              width: '94vw',
              padding: '1.5rem',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#6366F1' }}>
                  TASK DETAILS
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F5F5F5', marginTop: '0.2rem' }}>
                  {selectedTask.title}
                </h3>
              </div>
              <button onClick={() => setSelectedTask(null)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            {/* Status & Priority Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: '#666666', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Status
                </label>
                <select
                  value={selectedTask.status}
                  onChange={(e) => {
                    const nextStatus = e.target.value as TaskStatus;
                    updateTask(selectedTask.id, { status: nextStatus });
                    setSelectedTask({ ...selectedTask, status: nextStatus });
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: '#111111',
                    border: '1px solid #242424',
                    borderRadius: 'var(--radius-sm)',
                    color: '#F5F5F5',
                    fontSize: '0.8rem'
                  }}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Ready to Start">Ready to Start</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: '#666666', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Priority
                </label>
                <select
                  value={selectedTask.priority}
                  onChange={(e) => {
                    const nextPri = e.target.value as TaskPriority;
                    updateTask(selectedTask.id, { priority: nextPri });
                    setSelectedTask({ ...selectedTask, priority: nextPri });
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: '#111111',
                    border: '1px solid #242424',
                    borderRadius: 'var(--radius-sm)',
                    color: '#F5F5F5',
                    fontSize: '0.8rem'
                  }}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.7rem', color: '#666666', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Description & Notes
              </label>
              <div style={{ padding: '0.75rem', backgroundColor: '#111111', borderRadius: 'var(--radius-sm)', border: '1px solid #242424', color: '#A3A3A3', fontSize: '0.8rem', lineHeight: 1.45 }}>
                {selectedTask.description || 'No detailed description provided for this task.'}
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #242424', paddingTop: '1rem' }}>
              <button
                onClick={() => {
                  if (confirm(`Delete task "${selectedTask.title}"?`)) {
                    deleteTask(selectedTask.id);
                    setSelectedTask(null);
                  }
                }}
                className="btn btn-secondary"
                style={{ color: '#EF4444', fontSize: '0.75rem' }}
              >
                Delete Task
              </button>

              <button
                onClick={() => {
                  toggleTaskComplete(selectedTask.id);
                  if (selectedTask.status !== 'Completed') triggerConfetti();
                  setSelectedTask(null);
                }}
                className="btn btn-primary"
                style={{ fontSize: '0.75rem' }}
              >
                {selectedTask.status === 'Completed' ? 'Mark Incomplete' : 'Mark Completed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
