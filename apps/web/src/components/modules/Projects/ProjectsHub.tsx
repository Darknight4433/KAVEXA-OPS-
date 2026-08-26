import React, { useState } from 'react';
import {
  FolderKanban,
  LayoutGrid,
  Columns,
  List,
  Calendar,
  Plus,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Github,
  Figma
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ProjectKnowledgeHub } from './ProjectKnowledgeHub';
import { Project, ProjectStatus } from '@kavexa/shared-types';
import { formatDate, getDaysUntil } from '@kavexa/utils';

export const ProjectsHub: React.FC = () => {
  const {
    projects,
    tasks,
    selectedProjectId,
    setSelectedProjectId,
    setIsNewProjectModalOpen
  } = useApp();

  type ViewMode = 'grid' | 'kanban' | 'list' | 'timeline';
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // If a project is selected, render the full Project Knowledge Hub workspace
  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  if (selectedProject) {
    return (
      <ProjectKnowledgeHub
        project={selectedProject}
        onBack={() => setSelectedProjectId(null)}
      />
    );
  }

  const statuses: { label: string; value: string }[] = [
    { label: 'All Projects', value: 'all' },
    { label: 'Active / In Progress', value: 'In Progress' },
    { label: 'Planning', value: 'Planning' },
    { label: 'Completed', value: 'Completed' },
    { label: 'On Hold', value: 'On Hold' }
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="workspace-content">
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <FolderKanban size={22} style={{ color: 'var(--accent-primary)' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              Project Knowledge Workspaces
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            One Project = One Complete Workspace. Centralized tasks, PRDs, architecture, research & links.
          </p>
        </div>

        {/* View Switcher & Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '0.2rem'
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className={`btn-icon ${viewMode === 'grid' ? 'btn-primary' : ''}`}
              style={{ width: '32px', height: '32px', borderRadius: '6px' }}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`btn-icon ${viewMode === 'kanban' ? 'btn-primary' : ''}`}
              style={{ width: '32px', height: '32px', borderRadius: '6px' }}
              title="Kanban Board"
            >
              <Columns size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn-icon ${viewMode === 'list' ? 'btn-primary' : ''}`}
              style={{ width: '32px', height: '32px', borderRadius: '6px' }}
              title="List View"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`btn-icon ${viewMode === 'timeline' ? 'btn-primary' : ''}`}
              style={{ width: '32px', height: '32px', borderRadius: '6px' }}
              title="Gantt Timeline"
            >
              <Calendar size={15} />
            </button>
          </div>

          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2rem', height: '36px', fontSize: '0.8rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {statuses.map((st) => (
            <button
              key={st.value}
              onClick={() => setStatusFilter(st.value)}
              className={`btn ${statusFilter === st.value ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.2) 100%)',
            border: '1px dashed var(--border-medium)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: 'var(--accent-primary)'
            }}
          >
            <FolderKanban size={32} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
            No Projects in Workspace
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
            Your workspace is clean and ready. Create your first operational project workspace to start tracking tasks, PRDs, architecture, and live synchronization.
          </p>

          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem', margin: '0 auto', gap: '0.5rem' }}
          >
            <Plus size={16} />
            <span>Create First Project</span>
          </button>
        </div>
      ) : (
        <>
          {/* VIEW 1: GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid-3">
              {filteredProjects.map((proj) => {
                const projTasks = tasks.filter((t) => t.projectId === proj.id);
                const daysLeft = getDaysUntil(proj.deadline);

                return (
                  <div
                    key={proj.id}
                    className="card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderTop: `3px solid ${proj.accentColor || 'var(--accent-primary)'}`
                    }}
                    onClick={() => setSelectedProjectId(proj.id)}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: '#818cf8'
                          }}
                        >
                          {proj.status}
                        </span>

                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            background: proj.health.status === 'Healthy' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: proj.health.status === 'Healthy' ? '#10b981' : '#f59e0b'
                          }}
                        >
                          Health: {proj.health.status}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                        {proj.name}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1rem', minHeight: '38px' }}>
                        {proj.description}
                      </p>

                      {/* Links icons */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        {proj.githubUrl && <Github size={15} style={{ color: 'var(--text-muted)' }} />}
                        {proj.figmaUrl && <Figma size={15} style={{ color: 'var(--text-muted)' }} />}
                      </div>
                    </div>

                <div>
                  {/* Progress */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      <span>{projTasks.filter(t => t.status === 'Completed').length}/{projTasks.length} Tasks Complete</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                        {proj.progress}%
                      </span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${proj.progress}%`, height: '100%', background: proj.accentColor || 'var(--accent-primary)', borderRadius: '999px' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: daysLeft < 0 ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
                      📅 Due: {proj.deadline}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>Enter Workspace</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="kanban-board">
          {(['Planning', 'In Progress', 'Completed', 'On Hold'] as ProjectStatus[]).map((colStatus) => {
            const colProjects = filteredProjects.filter((p) => p.status === colStatus);
            return (
              <div key={colStatus} className="kanban-col">
                <div className="kanban-col-header">
                  <span>{colStatus}</span>
                  <span className="nav-badge">{colProjects.length}</span>
                </div>
                <div className="kanban-cards">
                  {colProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.id)}
                      className="card"
                      style={{ padding: '0.85rem', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                        {p.description}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                        <span style={{ color: 'var(--accent-cyan)' }}>{p.progress}% Done</span>
                        <span style={{ color: 'var(--text-muted)' }}>Due {p.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Project</th>
                <th style={{ padding: '0.85rem' }}>Status</th>
                <th style={{ padding: '0.85rem' }}>Health</th>
                <th style={{ padding: '0.85rem' }}>Progress</th>
                <th style={{ padding: '0.85rem' }}>Deadline</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                >
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: '#f8fafc' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.description}</div>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <span className="priority-score-badge score-normal" style={{ fontSize: '0.65rem' }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <span style={{ color: p.health.status === 'Healthy' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                      {p.health.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '60px', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${p.progress}%`, height: '100%', background: p.accentColor || 'var(--accent-primary)' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{p.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem', color: 'var(--text-secondary)' }}>{p.deadline}</td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                    <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                      Open Hub →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 4: GANTT / TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="card">
          <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>
            Project Roadmap & Milestone Gantt Timeline
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredProjects.map((p) => (
              <div key={p.id} onClick={() => setSelectedProjectId(p.id)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>{p.name} ({p.progress}%)</span>
                  <span style={{ color: 'var(--text-muted)' }}>{p.startDate} → {p.deadline}</span>
                </div>
                <div style={{ height: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', overflow: 'hidden', padding: '2px', border: '1px solid var(--border-subtle)' }}>
                  <div
                    style={{
                      width: `${Math.max(15, p.progress)}%`,
                      height: '100%',
                      background: p.accentColor || 'linear-gradient(90deg, #6366f1, #06b6d4)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#ffffff'
                    }}
                  >
                    {p.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )}
</div>
  );
};
