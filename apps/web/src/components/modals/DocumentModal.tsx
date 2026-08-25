import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentType } from '@kavexa/shared-types';

export const DocumentModal: React.FC = () => {
  const { isNewDocModalOpen, setIsNewDocModalOpen, createDocument, selectedProjectId, projects, currentMember } = useApp();

  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('PRD');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState(selectedProjectId || projects[0]?.id || '');

  if (!isNewDocModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createDocument({
      title: title.trim(),
      documentType,
      description: description.trim(),
      content: content.trim() || `# ${title}\n\n## Overview\n${description}`,
      projectId,
      createdBy: currentMember.name
    });

    setIsNewDocModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsNewDocModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Create Project Documentation (PRD / Tech Spec)
            </h2>
          </div>
          <button onClick={() => setIsNewDocModalOpen(false)} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Document Title</label>
            <input
              type="text"
              placeholder="e.g. StageFlow v1.0 PRD, Authentication Spec"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="form-select"
              >
                <option value="PRD">PRD (Product Requirements)</option>
                <option value="Problem Statement">Problem Statement</option>
                <option value="Solution Document">Solution Document</option>
                <option value="Technical Documentation">Technical Documentation</option>
                <option value="Implementation Plan">Implementation Plan</option>
                <option value="Meeting Notes">Meeting Notes</option>
                <option value="Pitch Content">Pitch Content</option>
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
            <label className="form-label">Summary / Description</label>
            <input
              type="text"
              placeholder="Short summary of this document..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Markdown Content</label>
            <textarea
              rows={6}
              placeholder="# Heading\n\n## 1. Requirements\n- Feature A\n- Feature B"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-textarea"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setIsNewDocModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
