import React, { useState } from 'react';
import {
  Lightbulb,
  Plus,
  ArrowRight,
  Sparkles,
  Zap,
  Tag,
  FolderKanban,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Idea, IdeaStatus } from '@kavexa/shared-types';
import { formatDate } from '@kavexa/utils';

export const IdeaVault: React.FC = () => {
  const {
    ideas,
    createIdea,
    convertIdeaToProject,
    setIsNewIdeaModalOpen
  } = useApp();

  const [filter, setFilter] = useState<string>('all');

  const filteredIdeas = ideas.filter((i) => {
    if (filter === 'all') return true;
    return i.status === filter;
  });

  return (
    <div className="workspace-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <Lightbulb size={22} style={{ color: 'var(--accent-amber)' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              Idea Vault & Incubation Canvas
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Capture and validate raw concepts before promoting them into full KAVEXA Projects.
          </p>
        </div>

        <button onClick={() => setIsNewIdeaModalOpen(true)} className="btn btn-primary">
          <Plus size={15} />
          <span>Capture Idea</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="tabs-header">
        <button onClick={() => setFilter('all')} className={`tab-btn ${filter === 'all' ? 'active' : ''}`}>
          All Ideas ({ideas.length})
        </button>
        <button onClick={() => setFilter('New')} className={`tab-btn ${filter === 'New' ? 'active' : ''}`}>
          New
        </button>
        <button onClick={() => setFilter('Exploring')} className={`tab-btn ${filter === 'Exploring' ? 'active' : ''}`}>
          Exploring
        </button>
        <button onClick={() => setFilter('Planning')} className={`tab-btn ${filter === 'Planning' ? 'active' : ''}`}>
          Planning
        </button>
        <button onClick={() => setFilter('Converted to Project')} className={`tab-btn ${filter === 'Converted to Project' ? 'active' : ''}`}>
          Converted to Projects
        </button>
      </div>

      {/* Grid of Idea Cards */}
      <div className="grid-3">
        {filteredIdeas.map((idea) => {
          const isConverted = idea.status === 'Converted to Project';

          return (
            <div
              key={idea.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `3px solid ${idea.potentialImpact === 'High' ? 'var(--accent-amber)' : 'var(--accent-primary)'}`
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#fbbf24'
                    }}
                  >
                    {idea.potentialImpact} Impact
                  </span>

                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {idea.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                  {idea.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.85rem' }}>
                  {idea.description}
                </p>

                {idea.notes && (
                  <div style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                    <strong>Feasibility Note:</strong> {idea.notes}
                  </div>
                )}

                {/* Tags */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {idea.tags.map((t) => (
                    <span key={t} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.04)', padding: '0.1rem 0.35rem', borderRadius: '4px', color: 'var(--text-muted)' }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Conversion Action Footer */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>By {idea.createdBy}</span>

                {isConverted ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={13} />
                    <span>Live Project</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      if (confirm(`Promote idea "${idea.title}" into a full KAVEXA Project?`)) {
                        convertIdeaToProject(idea.id);
                      }
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                  >
                    <FolderKanban size={13} />
                    <span>Convert to Project →</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
