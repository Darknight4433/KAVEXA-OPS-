import React, { useState, useRef } from 'react';
import { X, GitGraph, Upload, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DiagramType } from '@kavexa/shared-types';

export const DiagramModal: React.FC = () => {
  const { isNewDiagramModalOpen, setIsNewDiagramModalOpen, createDiagram, selectedProjectId, projects, currentMember } = useApp();

  const [title, setTitle] = useState('');
  const [diagramType, setDiagramType] = useState<DiagramType>('System Architecture');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [projectId, setProjectId] = useState(selectedProjectId || projects[0]?.id || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isNewDiagramModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createDiagram({
      title: title.trim(),
      diagramType,
      description: description.trim(),
      imageUrl: imageUrl.trim() || imagePreview || '/app-icon.png',
      projectId: projectId || (projects[0]?.id ?? 'default_proj'),
      createdBy: currentMember.name
    });

    setIsNewDiagramModalOpen(false);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setImagePreview(null);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsNewDiagramModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GitGraph size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Upload Architecture Diagram / Spec
            </h2>
          </div>
          <button onClick={() => setIsNewDiagramModalOpen(false)} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Diagram Title</label>
            <input
              type="text"
              placeholder="e.g. System Microservice DAG, Firestore Schema, UI Wireframe"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Diagram Type</label>
              <select
                value={diagramType}
                onChange={(e) => setDiagramType(e.target.value as any)}
                className="form-select"
              >
                <option value="System Architecture">System Architecture</option>
                <option value="Database Diagram">Database Schema</option>
                <option value="User Flow">User Flow</option>
                <option value="Process Flow">Process Flow</option>
                <option value="Wireframe">Wireframe</option>
                <option value="Mind Map">Mind Map</option>
                <option value="Other">Other Media</option>
              </select>
            </div>

            {projects.length > 0 && (
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
            )}
          </div>

          {/* Local File Upload Box */}
          <div className="form-group">
            <label className="form-label">Upload Local Image File</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed rgba(99, 102, 241, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(99, 102, 241, 0.05)',
                transition: 'border-color 0.2s',
                marginBottom: '0.5rem'
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf,.svg"
                style={{ display: 'none' }}
              />
              <Upload size={24} style={{ color: 'var(--accent-primary)', marginBottom: '0.4rem' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                Click to browse and upload image from your computer
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Supports PNG, JPG, WebP, SVG
              </div>
            </div>

            {imagePreview && (
              <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxHeight: '160px',
                    maxWidth: '100%',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    objectFit: 'contain'
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Or External Image / CDN URL</label>
            <input
              type="text"
              placeholder="https://... (Optional if uploading file above)"
              value={imageUrl.startsWith('data:') ? '' : imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImagePreview(e.target.value);
              }}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Architecture Notes</label>
            <textarea
              placeholder="Key architectural components, data flows, and technical decisions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => setIsNewDiagramModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Upload size={16} />
              <span>Save Diagram</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
