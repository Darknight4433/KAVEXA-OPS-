import React, { useState } from 'react';
import {
  X,
  Plus,
  Link,
  FileText,
  FlaskConical,
  Upload,
  Lightbulb,
  CheckCircle2,
  FolderKanban
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileQuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type QuickAddType = 'menu' | 'task' | 'resource' | 'document' | 'research' | 'file' | 'idea';

export const MobileQuickAddModal: React.FC<MobileQuickAddModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    createTask,
    createIdea,
    createResource,
    createDocument,
    createResearch,
    createFile,
    projects,
    currentMember,
    triggerConfetti
  } = useApp();

  const [activeType, setActiveType] = useState<QuickAddType>('menu');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [category, setCategory] = useState<'KAVEXA Work' | 'Study' | 'Personal'>('KAVEXA Work');

  if (!isOpen) return null;

  const handleReset = () => {
    setActiveType('menu');
    setTitle('');
    setUrl('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetProjId = projectId || (projects[0]?.id ?? 'default_proj');

    if (activeType === 'task') {
      createTask({
        title: title.trim(),
        description: 'Captured via Quick Add.',
        category,
        priority: 'High',
        impactLevel: 'High',
        difficultyLevel: 'Medium',
        estimatedDuration: 45,
        deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        assignedMemberId: currentMember.id,
        projectId: targetProjId
      });
    } else if (activeType === 'resource') {
      createResource({
        title: title.trim(),
        url: url.trim() || 'https://kavexa.io',
        resourceType: 'Reference Website',
        projectId: targetProjId,
        isPinned: true,
        createdBy: currentMember.name,
        description: 'Captured resource',
        tags: ['QuickAdd']
      });
    } else if (activeType === 'document') {
      createDocument({
        title: title.trim(),
        content: '# ' + title.trim() + '\n\nInitial draft notes.',
        projectId: targetProjId,
        documentType: 'PRD',
        description: 'Quick draft',
        createdBy: currentMember.name,
        tags: ['QuickAdd']
      });
    } else if (activeType === 'research') {
      createResearch({
        title: title.trim(),
        category: 'Technology Research',
        summary: 'Investigation notes.',
        notes: '',
        projectId: targetProjId,
        createdBy: currentMember.name,
        tags: ['QuickAdd'],
        sourceUrl: url.trim() || undefined
      });
    } else if (activeType === 'file') {
      createFile({
        fileName: title.trim().endsWith('.pdf') ? title.trim() : title.trim() + '.png',
        fileType: 'Image',
        fileUrl: 'https://kavexa.io/assets/' + title.trim(),
        fileSize: '1.4 MB',
        projectId: targetProjId,
        uploadedBy: currentMember.name
      });
    } else if (activeType === 'idea') {
      createIdea({
        title: title.trim(),
        description: 'Captured via mobile quick add.',
        category: 'Product Feature',
        potentialImpact: 'High',
        notes: '',
        createdBy: currentMember.name,
        tags: ['MobileCapture']
      });
    }

    triggerConfetti();
    handleReset();
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        handleReset();
        onClose();
      }}
      style={{ zIndex: 10000 }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: '100%',
          backgroundColor: '#171717',
          borderTop: '1px solid #303030',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          padding: '1.5rem',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F5F5F5' }}>
              {activeType === 'menu' ? 'Quick Add' : `Add ${activeType.charAt(0).toUpperCase() + activeType.slice(1)}`}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#666666' }}>
              Fast operational capture from anywhere.
            </p>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="btn-icon"
          >
            <X size={16} />
          </button>
        </div>

        {/* Action Menu */}
        {activeType === 'menu' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveType('task')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                backgroundColor: '#111111',
                border: '1px solid #242424',
                borderRadius: 'var(--radius-md)',
                color: '#F5F5F5',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.15)', color: '#6366F1' }}>
                <Plus size={18} />
              </div>
              <span>Add Task</span>
            </button>

            <button
              onClick={() => setActiveType('resource')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                backgroundColor: '#111111',
                border: '1px solid #242424',
                borderRadius: 'var(--radius-md)',
                color: '#F5F5F5',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
                <Link size={18} />
              </div>
              <span>Add Resource</span>
            </button>

            <button
              onClick={() => setActiveType('document')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                backgroundColor: '#111111',
                border: '1px solid #242424',
                borderRadius: 'var(--radius-md)',
                color: '#F5F5F5',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                <FileText size={18} />
              </div>
              <span>Add Document</span>
            </button>

            <button
              onClick={() => setActiveType('research')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                backgroundColor: '#111111',
                border: '1px solid #242424',
                borderRadius: 'var(--radius-md)',
                color: '#F5F5F5',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
                <FlaskConical size={18} />
              </div>
              <span>Add Research</span>
            </button>

            <button
              onClick={() => setActiveType('file')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                backgroundColor: '#111111',
                border: '1px solid #242424',
                borderRadius: 'var(--radius-md)',
                color: '#F5F5F5',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
                <Upload size={18} />
              </div>
              <span>Upload File</span>
            </button>

            <button
              onClick={() => setActiveType('idea')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                backgroundColor: '#111111',
                border: '1px solid #242424',
                borderRadius: 'var(--radius-md)',
                color: '#F5F5F5',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.15)', color: '#A855F7' }}>
                <Lightbulb size={18} />
              </div>
              <span>Capture Idea</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.7rem', color: '#666666', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Title or Deliverable Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  backgroundColor: '#111111',
                  border: '1px solid #242424',
                  borderRadius: 'var(--radius-sm)',
                  color: '#F5F5F5',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {(activeType === 'resource' || activeType === 'research') && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.7rem', color: '#666666', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  External URL / Reference Link
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    backgroundColor: '#111111',
                    border: '1px solid #242424',
                    borderRadius: 'var(--radius-sm)',
                    color: '#F5F5F5',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            )}

            {projects.length > 0 && activeType !== 'idea' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.7rem', color: '#666666', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Target Project
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    backgroundColor: '#111111',
                    border: '1px solid #242424',
                    borderRadius: 'var(--radius-sm)',
                    color: '#F5F5F5',
                    fontSize: '0.8rem'
                  }}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setActiveType('menu')}
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2, justifyContent: 'center', fontSize: '0.8rem' }}
              >
                Create {activeType.charAt(0).toUpperCase() + activeType.slice(1)}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
