import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ResearchCategory } from '@kavexa/shared-types';

export const ResearchModal: React.FC = () => {
  const { isNewResearchModalOpen, setIsNewResearchModalOpen, createResearch, selectedProjectId, projects, currentMember } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResearchCategory>('Technology Research');
  const [summary, setSummary] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [projectId, setProjectId] = useState(selectedProjectId || projects[0]?.id || '');

  if (!isNewResearchModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createResearch({
      title: title.trim(),
      category,
      summary: summary.trim(),
      sourceUrl: sourceUrl.trim() || undefined,
      notes: notes.trim(),
      projectId,
      createdBy: currentMember.name
    });

    setIsNewResearchModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsNewResearchModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={20} style={{ color: 'var(--accent-amber)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Add Research / Market Intelligence
            </h2>
          </div>
          <button onClick={() => setIsNewResearchModalOpen(false)} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Research Topic / Title</label>
            <input
              type="text"
              placeholder="e.g. Whisper vs Deepgram Latency Benchmark"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="form-select"
              >
                <option value="Technology Research">Technology Research</option>
                <option value="Competitor Research">Competitor Research</option>
                <option value="Problem Research">Problem Research</option>
                <option value="Market Research">Market Research</option>
                <option value="User Research">User Research</option>
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
            <label className="form-label">Source URL / Reference Paper</label>
            <input
              type="url"
              placeholder="https://arxiv.org/... or https://benchmark.io"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Findings Summary</label>
            <textarea
              rows={3}
              placeholder="Summary of findings, metrics, and comparisons..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="form-textarea"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Actionable Conclusion for KAVEXA</label>
            <input
              type="text"
              placeholder="e.g. Recommended stack decision: use Whisper on self-hosted RunPod"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setIsNewResearchModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Log Research
            </button>
        </div>
        </form>
      </div>
    </div>
  );  
};
