import React, { useState } from 'react';
import { X, Link as LinkIcon, Pin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ResourceType } from '@kavexa/shared-types';

export const ResourceModal: React.FC = () => {
  const { isNewResourceModalOpen, setIsNewResourceModalOpen, createResource, selectedProjectId, projects, currentMember } = useApp();

  const [title, setTitle] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('GitHub Repository');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [isPinned, setIsPinned] = useState(true);
  const [projectId, setProjectId] = useState(selectedProjectId || projects[0]?.id || '');

  if (!isNewResourceModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    createResource({
      title: title.trim(),
      resourceType,
      description: description.trim(),
      url: url.trim(),
      isPinned,
      projectId,
      createdBy: currentMember.name
    });

    setIsNewResourceModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsNewResourceModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LinkIcon size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Add Connected Resource / External Link
            </h2>
          </div>
          <button onClick={() => setIsNewResourceModalOpen(false)} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Resource Title</label>
            <input
              type="text"
              placeholder="e.g. GitHub Repository, Figma Tokens, Staging Demo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Resource Type</label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value as any)}
                className="form-select"
              >
                <option value="GitHub Repository">GitHub Repository</option>
                <option value="Figma Design">Figma Design System</option>
                <option value="Project Website">Project Website</option>
                <option value="Live Demo">Live Demo</option>
                <option value="Documentation">API / Docs</option>
                <option value="External Tool">External Tool</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Project Workspace</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="form-select"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Destination URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <input
              type="text"
              placeholder="Brief note about this link..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="pinToggle"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
            />
            <label htmlFor="pinToggle" style={{ fontSize: '0.825rem', color: '#cbd5e1', cursor: 'pointer' }}>
              Pin to Project Knowledge Hub Overview
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setIsNewResourceModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Connect Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
