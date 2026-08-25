import React, { useState } from 'react';
import { X, FolderKanban } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectStatus, TaskPriority } from '@kavexa/shared-types';

export const ProjectModal: React.FC = () => {
  const { isNewProjectModalOpen, setIsNewProjectModalOpen, createProject, setSelectedProjectId } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Planning');
  const [priority, setPriority] = useState<TaskPriority>('High');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]);
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [githubUrl, setGithubUrl] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');

  if (!isNewProjectModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const proj = createProject({
      name: name.trim(),
      description: description.trim(),
      objective: objective.trim() || description.trim(),
      status,
      priority,
      deadline,
      accentColor,
      githubUrl: githubUrl || undefined,
      figmaUrl: figmaUrl || undefined
    });

    setIsNewProjectModalOpen(false);
    setSelectedProjectId(proj.id);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsNewProjectModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FolderKanban size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Create Project Knowledge Workspace
            </h2>
          </div>
          <button onClick={() => setIsNewProjectModalOpen(false)} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input
              type="text"
              placeholder="e.g. StageFlow AI, Smart Classroom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={2}
              placeholder="Summary of what this project accomplishes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Milestone Objective</label>
            <input
              type="text"
              placeholder="e.g. Ship v1.0 beta with live canvas sync"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="form-select"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

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
              <label className="form-label">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">GitHub Repository URL (Optional)</label>
              <input
                type="url"
                placeholder="https://github.com/kavexa/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Figma Design URL (Optional)</label>
              <input
                type="url"
                placeholder="https://figma.com/..."
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setIsNewProjectModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Initialize Project Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
