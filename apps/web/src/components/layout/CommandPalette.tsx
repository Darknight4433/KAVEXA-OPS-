import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  CheckSquare,
  FolderKanban,
  GraduationCap,
  Lightbulb,
  Plus,
  ArrowRight,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    tasks,
    projects,
    studyTasks,
    ideas,
    setActiveTab,
    setSelectedProjectId,
    setSelectedTaskId,
    setIsNewTaskModalOpen,
    setIsNewProjectModalOpen,
    setIsNewIdeaModalOpen
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedProjects = projects.filter(
    (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );

  const matchedTasks = tasks.filter(
    (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
  );

  const matchedStudy = studyTasks.filter((s) => s.title.toLowerCase().includes(q));
  const matchedIdeas = ideas.filter((i) => i.title.toLowerCase().includes(q));

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setActiveTab('projects');
    setIsCommandPaletteOpen(false);
  };

  const handleSelectTask = (id: string) => {
    setSelectedTaskId(id);
    setActiveTab('tasks');
    setIsCommandPaletteOpen(false);
  };

  const handleSelectStudy = () => {
    setActiveTab('study');
    setIsCommandPaletteOpen(false);
  };

  const handleSelectIdea = () => {
    setActiveTab('ideas');
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCommandPaletteOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px', padding: 0, overflow: 'hidden' }}
      >
        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(255,255,255,0.02)'
          }}
        >
          <Search size={18} style={{ color: 'var(--accent-primary)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search tasks, projects, ideas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <kbd
            style={{
              fontSize: '0.7rem',
              padding: '0.2rem 0.4rem',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '4px',
              color: 'var(--text-muted)'
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.75rem' }}>
          {/* Quick Actions */}
          {!query && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, padding: '0.25rem 0.5rem' }}>
                Quick Actions
              </div>
              <div
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  setIsNewTaskModalOpen(true);
                }}
                className="nav-item"
                style={{ padding: '0.5rem 0.65rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={15} style={{ color: 'var(--accent-primary)' }} />
                  <span>Create new Task</span>
                </div>
                <ArrowRight size={14} style={{ color: 'var(--text-dim)' }} />
              </div>
              <div
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  setIsNewProjectModalOpen(true);
                }}
                className="nav-item"
                style={{ padding: '0.5rem 0.65rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FolderKanban size={15} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Start new Project</span>
                </div>
                <ArrowRight size={14} style={{ color: 'var(--text-dim)' }} />
              </div>
            </div>
          )}

          {/* Matched Projects */}
          {matchedProjects.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, padding: '0.25rem 0.5rem' }}>
                Projects ({matchedProjects.length})
              </div>
              {matchedProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProject(p.id)}
                  className="nav-item"
                  style={{ padding: '0.5rem 0.65rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FolderKanban size={15} style={{ color: p.accentColor || 'var(--accent-cyan)' }} />
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {p.status}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {p.progress}%
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Matched Tasks */}
          {matchedTasks.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, padding: '0.25rem 0.5rem' }}>
                Tasks ({matchedTasks.length})
              </div>
              {matchedTasks.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleSelectTask(t.id)}
                  className="nav-item"
                  style={{ padding: '0.5rem 0.65rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    <CheckSquare size={15} style={{ color: 'var(--accent-primary)' }} />
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {t.title}
                    </span>
                  </div>
                  <span className={`priority-score-badge score-${t.priorityBreakdown.urgencyLevel.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                    {t.priorityScore}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Matched Study */}
          {matchedStudy.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, padding: '0.25rem 0.5rem' }}>
                Study Hub ({matchedStudy.length})
              </div>
              {matchedStudy.map((s) => (
                <div
                  key={s.id}
                  onClick={handleSelectStudy}
                  className="nav-item"
                  style={{ padding: '0.5rem 0.65rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={15} style={{ color: 'var(--accent-amber)' }} />
                    <span>{s.title}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.type}</span>
                </div>
              ))}
            </div>
          )}

          {/* Matched Ideas */}
          {matchedIdeas.length > 0 && (
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, padding: '0.25rem 0.5rem' }}>
                Idea Vault ({matchedIdeas.length})
              </div>
              {matchedIdeas.map((i) => (
                <div
                  key={i.id}
                  onClick={handleSelectIdea}
                  className="nav-item"
                  style={{ padding: '0.5rem 0.65rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lightbulb size={15} style={{ color: 'var(--accent-amber)' }} />
                    <span>{i.title}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-amber)' }}>{i.potentialImpact} Impact</span>
                </div>
              ))}
            </div>
          )}

          {query &&
            matchedProjects.length === 0 &&
            matchedTasks.length === 0 &&
            matchedStudy.length === 0 &&
            matchedIdeas.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No results found for "{query}"
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
