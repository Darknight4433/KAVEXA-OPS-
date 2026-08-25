import React, { useState } from 'react';
import { X, CheckSquare, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskCategory, TaskPriority, ImpactLevel, DifficultyLevel } from '@kavexa/shared-types';

export const TaskModal: React.FC = () => {
  const {
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
    createTask,
    projects,
    tasks,
    members,
    documents,
    diagrams,
    resources,
    currentMember
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('KAVEXA Work');
  const [priority, setPriority] = useState<TaskPriority>('High');
  const [impactLevel, setImpactLevel] = useState<ImpactLevel>('High');
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('Medium');
  const [estimatedDuration, setEstimatedDuration] = useState<number>(60);
  const [deadline, setDeadline] = useState<string>(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [assignedMemberId, setAssignedMemberId] = useState<string>(currentMember.id);
  const [projectId, setProjectId] = useState<string>(projects[0]?.id || '');
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);

  if (!isNewTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      impactLevel,
      difficultyLevel,
      estimatedDuration: Number(estimatedDuration) || 60,
      deadline,
      assignedMemberId,
      projectId: projectId || undefined,
      dependencies: selectedDependencies,
      linkedDocumentIds: selectedDocIds
    });

    setIsNewTaskModalOpen(false);
  };

  const toggleDependency = (depId: string) => {
    if (selectedDependencies.includes(depId)) {
      setSelectedDependencies(selectedDependencies.filter((id) => id !== depId));
    } else {
      setSelectedDependencies([...selectedDependencies, depId]);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsNewTaskModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Create Intelligent Task
            </h2>
          </div>
          <button onClick={() => setIsNewTaskModalOpen(false)} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              placeholder="e.g. Implement Real-time Canvas Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description & Acceptance Criteria</label>
            <textarea
              rows={3}
              placeholder="Provide context, constraints, and completion requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          {/* Category & Project */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="form-select"
              >
                <option value="KAVEXA Work">KAVEXA Work</option>
                <option value="Study">Study / Academics</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Associated Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="form-select"
              >
                <option value="">None / Standalone</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority & Impact */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="form-select"
              >
                <option value="Critical">⚡ Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Impact on Goals</label>
              <select
                value={impactLevel}
                onChange={(e) => setImpactLevel(e.target.value as any)}
                className="form-select"
              >
                <option value="High">High Impact</option>
                <option value="Medium">Medium Impact</option>
                <option value="Low">Low Impact</option>
              </select>
            </div>
          </div>

          {/* Assigned & Duration & Deadline */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Assigned Founder</label>
              <select
                value={assignedMemberId}
                onChange={(e) => setAssignedMemberId(e.target.value)}
                className="form-select"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Estimated Duration (Mins)</label>
              <input
                type="number"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Dependencies Selector */}
          <div className="form-group">
            <label className="form-label">Prerequisite Tasks (Dependencies)</label>
            <div style={{ maxHeight: '120px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              {tasks.filter((t) => t.status !== 'Completed').map((t) => (
                <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', padding: '0.25rem 0', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedDependencies.includes(t.id)}
                    onChange={() => toggleDependency(t.id)}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                  <span>{t.title}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setIsNewTaskModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Sparkles size={14} />
              <span>Score & Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
