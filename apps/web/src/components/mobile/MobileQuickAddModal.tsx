import React, { useState } from 'react';
import {
  X,
  Zap,
  Lightbulb,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileQuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileQuickAddModal: React.FC<MobileQuickAddModalProps> = ({
  isOpen,
  onClose
}) => {
  const { createTask, createIdea, projects, currentMember, triggerConfetti } = useApp();

  const [mode, setMode] = useState<'task' | 'idea'>('task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [category, setCategory] = useState<'KAVEXA Work' | 'Study' | 'Personal'>('KAVEXA Work');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [potentialImpact, setPotentialImpact] = useState<'High' | 'Medium' | 'Low'>('High');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (mode === 'task') {
      createTask({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        impactLevel: 'High',
        difficultyLevel: 'Medium',
        estimatedDuration: 45,
        deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        assignedMemberId: currentMember.id,
        projectId: projectId || undefined
      });
    } else {
      createIdea({
        title: title.trim(),
        description: description.trim(),
        category: 'Product Feature',
        potentialImpact,
        notes: '',
        createdBy: currentMember.name,
        tags: ['MobileCapture']
      });
    }

    triggerConfetti();
    onClose();
    setTitle('');
    setDescription('');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: '100%',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setMode('task')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                border: mode === 'task' ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.08)',
                background: mode === 'task' ? 'rgba(99, 102, 241, 0.2)' : 'none',
                color: mode === 'task' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Zap size={14} />
              <span>Quick Task</span>
            </button>

            <button
              onClick={() => setMode('idea')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                border: mode === 'idea' ? '1px solid var(--accent-amber)' : '1px solid rgba(255,255,255,0.08)',
                background: mode === 'idea' ? 'rgba(245, 158, 11, 0.2)' : 'none',
                color: mode === 'idea' ? '#fbbf24' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Lightbulb size={14} />
              <span>Startup Idea</span>
            </button>
          </div>

          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{mode === 'task' ? 'Deliverable Title' : 'Concept Title'}</label>
            <input
              type="text"
              placeholder={mode === 'task' ? 'e.g. Test Webhook on Staging' : 'e.g. AI Prompt Auto-Debugger'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quick Notes / Context</label>
            <textarea
              rows={2}
              placeholder="Brief details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          {mode === 'task' ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Priority</label>
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
                <label className="form-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="form-select"
                >
                  <option value="KAVEXA Work">KAVEXA Work</option>
                  <option value="Study">Study</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Potential Impact</label>
              <select
                value={potentialImpact}
                onChange={(e) => setPotentialImpact(e.target.value as any)}
                className="form-select"
              >
                <option value="High">High Impact</option>
                <option value="Medium">Medium Impact</option>
                <option value="Low">Low Impact</option>
              </select>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
              <Sparkles size={14} />
              <span>{mode === 'task' ? 'Score & Create' : 'Log Idea'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
