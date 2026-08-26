import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Plus,
  ArrowRight,
  Sparkles,
  CheckSquare,
  FileText,
  GitGraph,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Activity,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '@kavexa/shared-types';
import { ProjectKnowledgeHub } from '../modules/Projects/ProjectKnowledgeHub';

export const MobileProjectsView: React.FC = () => {
  const { projects, tasks, setIsNewProjectModalOpen, deleteProject } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Planning' | 'On Hold'>('All');
  const [activeProjectWorkspace, setActiveProjectWorkspace] = useState<Project | null>(null);

  if (activeProjectWorkspace) {
    return (
      <div style={{ padding: '0.75rem', paddingBottom: '90px', maxWidth: '640px', margin: '0 auto' }}>
        <ProjectKnowledgeHub
          project={activeProjectWorkspace}
          onBack={() => setActiveProjectWorkspace(null)}
        />
      </div>
    );
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' ? true :
                          filterStatus === 'Active' ? p.status === 'In Progress' || p.status === 'Review' :
                          filterStatus === 'Planning' ? p.status === 'Planning' :
                          p.status === 'On Hold';
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '1rem', paddingBottom: '90px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F5F5F5', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
            Projects
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#A3A3A3' }}>
            Dedicated hardware, robotics & software workspaces.
          </p>
        </div>
        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="btn btn-primary"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', gap: '0.35rem' }}
        >
          <Plus size={14} />
          <span>New</span>
        </button>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: '#666666' }} />
        <input
          type="text"
          placeholder="Search projects by name or objective..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.55rem 0.75rem 0.55rem 2.25rem',
            backgroundColor: '#111111',
            border: '1px solid #242424',
            borderRadius: 'var(--radius-md)',
            color: '#F5F5F5',
            fontSize: '0.8rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '2px' }}>
        {(['All', 'Active', 'Planning', 'On Hold'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              border: `1px solid ${filterStatus === status ? '#6366F1' : '#242424'}`,
              backgroundColor: filterStatus === status ? 'rgba(99, 102, 241, 0.15)' : '#111111',
              color: filterStatus === status ? '#F5F5F5' : '#A3A3A3',
              fontSize: '0.75rem',
              fontWeight: filterStatus === status ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredProjects.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', background: '#0A0A0A', border: '1px solid #242424', borderRadius: 'var(--radius-lg)' }}>
            <FolderKanban size={36} style={{ color: '#444444', marginBottom: '0.75rem' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F5F5F5', marginBottom: '0.3rem' }}>
              No projects found
            </div>
            <p style={{ fontSize: '0.75rem', color: '#666666', maxWidth: '280px', margin: '0 auto 1.25rem auto' }}>
              Your project workspaces start here. Create your first project to unlock docs, diagrams, and files.
            </p>
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.75rem', padding: '0.45rem 1rem' }}
            >
              <Plus size={14} />
              <span>Create Project</span>
            </button>
          </div>
        ) : (
          filteredProjects.map((p) => {
            const projectTasks = tasks.filter((t) => t.projectId === p.id);
            const activeCount = projectTasks.filter((t) => t.status !== 'Completed').length;

            return (
              <div
                key={p.id}
                onClick={() => setActiveProjectWorkspace(p)}
                style={{
                  backgroundColor: '#111111',
                  border: '1px solid #242424',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.15rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6366F1'
                      }}
                    >
                      <FolderKanban size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#F5F5F5' }}>{p.name}</h3>
                      <div style={{ fontSize: '0.7rem', color: '#666666' }}>{p.status}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        backgroundColor: p.health?.status === 'Healthy' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: p.health?.status === 'Healthy' ? '#10B981' : '#F59E0B',
                        border: `1px solid ${p.health?.status === 'Healthy' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                      }}
                    >
                      {p.health?.status || 'Healthy'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete project "${p.name}"?`)) {
                          deleteProject(p.id);
                        }
                      }}
                      className="btn-icon"
                      style={{ width: '22px', height: '22px', border: 'none', background: 'transparent' }}
                      title="Delete Project"
                    >
                      <Trash2 size={13} style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#A3A3A3', lineHeight: 1.45, marginBottom: '0.85rem' }}>
                  {p.description}
                </p>

                {/* Progress Bar */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#666666' }}>Milestone Velocity</span>
                    <span style={{ color: '#F5F5F5', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{p.progress || 68}%</span>
                  </div>
                  <div style={{ height: '5px', backgroundColor: '#171717', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${p.progress || 68}%`,
                        height: '100%',
                        backgroundColor: '#6366F1',
                        borderRadius: '999px'
                      }}
                    />
                  </div>
                </div>

                {/* Card Footer Link */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #242424', paddingTop: '0.65rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#666666' }}>
                    {activeCount} active tasks
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#818CF8', fontSize: '0.75rem', fontWeight: 600 }}>
                    <span>Open Workspace</span>
                    <ChevronRight size={13} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
