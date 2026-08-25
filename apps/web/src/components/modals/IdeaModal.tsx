import React, { useState } from 'react';
import { X, Lightbulb, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const IdeaModal: React.FC = () => {
  const { isNewIdeaModalOpen, setIsNewIdeaModalOpen, createIdea, currentMember } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Product Feature');
  const [potentialImpact, setPotentialImpact] = useState<'High' | 'Medium' | 'Low'>('High');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isNewIdeaModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createIdea({
      title: title.trim(),
      description: description.trim(),
      category,
      potentialImpact,
      notes: notes.trim(),
      createdBy: currentMember.name,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    });

    setIsNewIdeaModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsNewIdeaModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lightbulb size={20} style={{ color: 'var(--accent-amber)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Capture Startup Concept / Idea
            </h2>
          </div>
          <button onClick={() => setIsNewIdeaModalOpen(false)} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Idea Title</label>
            <input
              type="text"
              placeholder="e.g. AI Flowchart Live Execution Engine"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              placeholder="What is the concept? What problem does it solve for users?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                <option value="Product Feature">Product Feature</option>
                <option value="New Startup Concept">New Startup Concept</option>
                <option value="Internal Tooling">Internal Tooling</option>
                <option value="Marketing / Growth">Marketing / Growth</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
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
          </div>

          <div className="form-group">
            <label className="form-label">Feasibility / Research Notes (Optional)</label>
            <textarea
              rows={2}
              placeholder="Preliminary implementation thoughts..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="AI, Canvas, Growth, StageFlow..."
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setIsNewIdeaModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Sparkles size={14} />
              <span>Log Idea in Vault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
