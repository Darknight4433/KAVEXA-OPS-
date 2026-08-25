import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckSquare,
  FileText,
  GitGraph,
  Search as SearchIcon,
  Link as LinkIcon,
  FolderOpen,
  Lightbulb,
  History,
  Plus,
  ExternalLink,
  Copy,
  Pin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Github,
  Figma,
  Globe,
  Tag,
  Eye,
  Trash2,
  Upload,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Project, Task, ProjectDocument, ProjectDiagram, ProjectResearch, ProjectResource, ProjectFile } from '@kavexa/shared-types';
import { formatDuration, formatDate, getDaysUntil } from '@kavexa/utils';

export const ProjectKnowledgeHub: React.FC<{ project: Project; onBack: () => void }> = ({ project, onBack }) => {
  const {
    tasks,
    documents,
    diagrams,
    research,
    resources,
    files,
    ideas,
    activityLogs,
    toggleTaskComplete,
    togglePinResource,
    deleteDocument,
    deleteDiagram,
    deleteResearch,
    deleteResource,
    deleteFile,
    setSelectedTaskId,
    updateDiagram,
    setActiveTab,
    setIsNewTaskModalOpen,
    setIsNewDocModalOpen,
    setIsNewDiagramModalOpen,
    setIsNewResearchModalOpen,
    setIsNewResourceModalOpen,
    setIsNewFileModalOpen
  } = useApp();

  type HubTab = 'overview' | 'tasks' | 'documentation' | 'diagrams' | 'research' | 'resources' | 'files' | 'ideas' | 'activity';
  const [activeHubTab, setActiveHubTab] = useState<HubTab>('overview');
  const [activeDocPreview, setActiveDocPreview] = useState<ProjectDocument | null>(null);
  const [activeDiagramLightbox, setActiveDiagramLightbox] = useState<ProjectDiagram | null>(null);
  const [activeFilePreview, setActiveFilePreview] = useState<ProjectFile | null>(null);
  const [brokenDiagrams, setBrokenDiagrams] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter entities for this project
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectDocs = documents.filter((d) => d.projectId === project.id);
  const projectDiagrams = diagrams.filter((d) => d.projectId === project.id);
  const projectResearch = research.filter((r) => r.projectId === project.id);
  const projectResources = resources.filter((r) => r.projectId === project.id);
  const projectFiles = files.filter((f) => f.projectId === project.id);
  const projectIdeas = ideas.filter((i) => project.ideas?.includes(i.id) || i.convertedProjectId === project.id);
  const projectActivity = activityLogs.filter((a) => a.targetTitle.includes(project.name) || projectTasks.some((t) => a.targetTitle.includes(t.title)));

  // Next Priority Task for this project
  const nextPriorityTask = projectTasks
    .filter((t) => t.status !== 'Completed' && t.status !== 'Blocked')
    .sort((a, b) => b.priorityScore - a.priorityScore)[0];

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'GitHub Repository': return <Github size={16} style={{ color: '#ffffff' }} />;
      case 'Figma Design': return <Figma size={16} style={{ color: '#f24e1e' }} />;
      case 'Project Website':
      case 'Live Demo': return <Globe size={16} style={{ color: 'var(--accent-cyan)' }} />;
      default: return <LinkIcon size={16} style={{ color: 'var(--accent-primary)' }} />;
    }
  };

  return (
    <div className="workspace-content">
      {/* Back Button & Project Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', marginBottom: '1rem' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Projects</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
                {project.name}
              </h1>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}
              >
                {project.status}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  background: project.health.status === 'Healthy' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: project.health.status === 'Healthy' ? '#10b981' : '#f59e0b',
                  border: '1px solid',
                  borderColor: project.health.status === 'Healthy' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'
                }}
              >
                Health: {project.health.status}
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '800px', lineHeight: 1.5 }}>
              {project.description}
            </p>
          </div>

          {/* Quick Hub Action Launcher */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setIsNewTaskModalOpen(true)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              <Plus size={14} />
              <span>Add Task</span>
            </button>
            <button onClick={() => setIsNewDocModalOpen(true)} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              <FileText size={14} />
              <span>Create Doc</span>
            </button>
            <button onClick={() => setIsNewDiagramModalOpen(true)} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              <GitGraph size={14} />
              <span>Upload Diagram</span>
            </button>
            <button onClick={() => setIsNewResourceModalOpen(true)} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              <LinkIcon size={14} />
              <span>Add Resource</span>
            </button>
          </div>
        </div>

        {/* Progress & Milestone Bar */}
        <div style={{ marginTop: '1.25rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            <span>Project Milestone Progress</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              {project.progress}% Complete ({projectTasks.filter(t => t.status === 'Completed').length}/{projectTasks.length} Tasks)
            </span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${project.progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: '999px' }} />
          </div>
        </div>
      </div>

      {/* 9 Workspace Tabs */}
      <div className="tabs-header">
        <button onClick={() => setActiveHubTab('overview')} className={`tab-btn ${activeHubTab === 'overview' ? 'active' : ''}`}>
          <Sparkles size={16} />
          <span>Overview</span>
        </button>
        <button onClick={() => setActiveHubTab('tasks')} className={`tab-btn ${activeHubTab === 'tasks' ? 'active' : ''}`}>
          <CheckSquare size={16} />
          <span>Tasks ({projectTasks.length})</span>
        </button>
        <button onClick={() => setActiveHubTab('documentation')} className={`tab-btn ${activeHubTab === 'documentation' ? 'active' : ''}`}>
          <FileText size={16} />
          <span>Documentation ({projectDocs.length})</span>
        </button>
        <button onClick={() => setActiveHubTab('diagrams')} className={`tab-btn ${activeHubTab === 'diagrams' ? 'active' : ''}`}>
          <GitGraph size={16} />
          <span>Diagrams ({projectDiagrams.length})</span>
        </button>
        <button onClick={() => setActiveHubTab('research')} className={`tab-btn ${activeHubTab === 'research' ? 'active' : ''}`}>
          <SearchIcon size={16} />
          <span>Research ({projectResearch.length})</span>
        </button>
        <button onClick={() => setActiveHubTab('resources')} className={`tab-btn ${activeHubTab === 'resources' ? 'active' : ''}`}>
          <LinkIcon size={16} />
          <span>Resources & Links ({projectResources.length})</span>
        </button>
        <button onClick={() => setActiveHubTab('files')} className={`tab-btn ${activeHubTab === 'files' ? 'active' : ''}`}>
          <FolderOpen size={16} />
          <span>Files ({projectFiles.length})</span>
        </button>
        <button onClick={() => setActiveHubTab('ideas')} className={`tab-btn ${activeHubTab === 'ideas' ? 'active' : ''}`}>
          <Lightbulb size={16} />
          <span>Ideas ({projectIdeas.length})</span>
        </button>
        <button onClick={() => setActiveHubTab('activity')} className={`tab-btn ${activeHubTab === 'activity' ? 'active' : ''}`}>
          <History size={16} />
          <span>Activity</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeHubTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="grid-2">
            {/* Next Priority Task Widget */}
            <div className="card card-spotlight">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.05em' }}>
                  Next Priority Task
                </span>
                {nextPriorityTask && (
                  <span className="priority-score-badge score-urgent" style={{ fontSize: '0.7rem' }}>
                    SCORE: {nextPriorityTask.priorityScore}
                  </span>
                )}
              </div>

              {nextPriorityTask ? (
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                    {nextPriorityTask.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                    {nextPriorityTask.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ⏱️ {formatDuration(nextPriorityTask.estimatedDuration)} • Due {nextPriorityTask.deadline}
                    </span>
                    <button
                      onClick={() => toggleTaskComplete(nextPriorityTask.id)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Complete Task</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  All tasks in this project are currently complete!
                </div>
              )}
            </div>

            {/* Project Health & Diagnostics Widget */}
            <div className="card">
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Health & Diagnostics
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Deadline Proximity:</span>
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>{project.deadline} ({getDaysUntil(project.deadline)} days left)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Blocked Tasks:</span>
                  <span style={{ fontWeight: 600, color: project.health.factors.blockedTasksCount > 0 ? 'var(--accent-amber)' : '#10b981' }}>
                    {project.health.factors.blockedTasksCount}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Objective:</span>
                  <span style={{ fontWeight: 500, color: 'var(--accent-cyan)' }}>{project.objective}</span>
                </div>

                {project.health.warnings.length > 0 && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', fontSize: '0.75rem', color: '#fca5a5' }}>
                    ⚠️ {project.health.warnings.join(' • ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pinned Resources & Quick Links */}
          {projectResources.length > 0 && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Pin size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Pinned Project Resources & Links</span>
                </div>
                <button onClick={() => setIsNewResourceModalOpen(true)} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                  + Add Link
                </button>
              </div>

              <div className="grid-3">
                {projectResources.map((res) => (
                  <div
                    key={res.id}
                    style={{
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                      {getResourceIcon(res.resourceType)}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {res.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{res.resourceType}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <a href={res.url} target="_blank" rel="noopener noreferrer" className="btn-icon" style={{ width: '28px', height: '28px' }} title="Open link">
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TASKS */}
      {activeHubTab === 'tasks' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Project Task Execution</span>
            <button onClick={() => setIsNewTaskModalOpen(true)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              <Plus size={14} />
              <span>Add Task</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {projectTasks.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: '0.85rem',
                  background: t.status === 'Completed' ? 'rgba(255,255,255,0.01)' : 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid',
                  borderColor: t.status === 'Completed' ? 'transparent' : 'var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                  <input
                    type="checkbox"
                    checked={t.status === 'Completed'}
                    onChange={() => toggleTaskComplete(t.id)}
                    style={{ accentColor: 'var(--accent-emerald)', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: t.status === 'Completed' ? 'var(--text-muted)' : '#ffffff',
                          textDecoration: t.status === 'Completed' ? 'line-through' : 'none'
                        }}
                      >
                        {t.title}
                      </span>
                      {t.status === 'Blocked' && (
                        <span className="priority-score-badge score-elevated" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                          BLOCKED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                      <span>Due: {t.deadline}</span>
                      <span>•</span>
                      <span>Duration: {formatDuration(t.estimatedDuration)}</span>
                      <span>•</span>
                      <span>Assigned: {t.assignedMemberId === 'member_vaish' ? 'Vaish' : 'Alex'}</span>
                      {t.linkedDocumentIds && t.linkedDocumentIds.length > 0 && (
                        <span style={{ color: 'var(--accent-primary)' }}>📄 {t.linkedDocumentIds.length} doc linked</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`priority-score-badge score-${t.priorityBreakdown.urgencyLevel.toLowerCase()}`}>
                    {t.priorityScore} pts
                  </span>
                  <button
                    onClick={() => {
                      setSelectedTaskId(t.id);
                      setActiveTab('tasks');
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    AI Rationale
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENTATION */}
      {activeHubTab === 'documentation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>PRDs, Technical Documentation & Specs</span>
            <button onClick={() => setIsNewDocModalOpen(true)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              <Plus size={14} />
              <span>Create Document</span>
            </button>
          </div>

          <div className="grid-3">
            {projectDocs.map((doc) => (
              <div
                key={doc.id}
                className="card"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => setActiveDocPreview(doc)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#818cf8'
                      }}
                    >
                      {doc.documentType}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {formatDate(doc.updatedAt)}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                    {doc.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                    {doc.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem', marginTop: '0.65rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>By {doc.createdBy}</span>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete document "${doc.title}"?`)) deleteDocument(doc.id);
                      }}
                      className="btn-icon"
                      style={{ width: '26px', height: '26px' }}
                    >
                      <Trash2 size={12} style={{ color: 'var(--accent-rose)' }} />
                    </button>
                    <button className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                      <Eye size={12} />
                      <span>Read Doc</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Doc Preview Modal */}
          {activeDocPreview && (
            <div className="modal-overlay" onClick={() => setActiveDocPreview(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{activeDocPreview.documentType}</span>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{activeDocPreview.title}</h2>
                  </div>
                  <button onClick={() => setActiveDocPreview(null)} className="btn-icon">
                    ✕
                  </button>
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', maxHeight: '60vh', overflowY: 'auto' }}>
                  {activeDocPreview.content}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DIAGRAMS */}
      {activeHubTab === 'diagrams' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Architecture, Schemas & User Flows</span>
            <button onClick={() => setIsNewDiagramModalOpen(true)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              <Plus size={14} />
              <span>Upload Diagram</span>
            </button>
          </div>

          <div className="grid-2">
            {projectDiagrams.map((diag) => {
              const isBroken = brokenDiagrams[diag.id];
              return (
                <div key={diag.id} className="card" style={{ padding: '0.85rem' }}>
                  <div
                    onClick={() => setActiveDiagramLightbox(diag)}
                    style={{
                      height: '200px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      marginBottom: '0.75rem',
                      position: 'relative',
                      cursor: 'pointer',
                      background: '#04070d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    {!isBroken ? (
                      <img
                        src={diag.imageUrl}
                        alt={diag.title}
                        onError={() => setBrokenDiagrams((prev) => ({ ...prev, [diag.id]: true }))}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <GitGraph size={36} style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>{diag.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{diag.diagramType}</div>
                      </div>
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        gap: '0.4rem'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                    >
                      <Eye size={16} />
                      <span>View Diagram Spec</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{diag.diagramType}</span>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{diag.title}</h4>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Delete diagram "${diag.title}"?`)) deleteDiagram(diag.id);
                      }}
                      className="btn-icon"
                      style={{ width: '28px', height: '28px' }}
                    >
                      <Trash2 size={13} style={{ color: 'var(--accent-rose)' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diagram Lightbox Modal */}
          {activeDiagramLightbox && (
            <div className="modal-overlay" onClick={() => setActiveDiagramLightbox(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '950px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{activeDiagramLightbox.diagramType}</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{activeDiagramLightbox.title}</h3>
                  </div>
                  <button onClick={() => setActiveDiagramLightbox(null)} className="btn-icon">✕</button>
                </div>

                {/* Main View: Image or Architectural Blueprint Card */}
                {!brokenDiagrams[activeDiagramLightbox.id] ? (
                  <img
                    src={activeDiagramLightbox.imageUrl}
                    alt={activeDiagramLightbox.title}
                    onError={() => setBrokenDiagrams((prev) => ({ ...prev, [activeDiagramLightbox.id]: true }))}
                    style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: 'var(--radius-md)', background: '#080b11', marginBottom: '1rem' }}
                  />
                ) : (
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px dashed rgba(6, 182, 212, 0.4)',
                      borderRadius: 'var(--radius-md)',
                      padding: '2rem',
                      textAlign: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    <GitGraph size={48} style={{ color: 'var(--accent-cyan)', marginBottom: '0.75rem' }} />
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                      {activeDiagramLightbox.title}
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '600px', margin: '0 auto 1.25rem auto' }}>
                      {activeDiagramLightbox.description || 'Architecture specification and system topology overview.'}
                    </p>
                  </div>
                )}

                {/* Diagram Actions & Image Upload */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Created by <strong>{activeDiagramLightbox.createdBy}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <label className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Upload size={14} />
                      <span>{brokenDiagrams[activeDiagramLightbox.id] ? 'Upload Diagram Image' : 'Replace Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              updateDiagram(activeDiagramLightbox.id, { imageUrl: result });
                              setActiveDiagramLightbox({ ...activeDiagramLightbox, imageUrl: result });
                              setBrokenDiagrams((prev) => ({ ...prev, [activeDiagramLightbox.id]: false }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    <button
                      onClick={() => {
                        if (confirm(`Delete diagram "${activeDiagramLightbox.title}"?`)) {
                          deleteDiagram(activeDiagramLightbox.id);
                          setActiveDiagramLightbox(null);
                        }
                      }}
                      className="btn btn-secondary"
                      style={{ color: 'var(--accent-rose)', fontSize: '0.8rem' }}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: RESEARCH */}
      {activeHubTab === 'research' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Competitor & Technical Research</span>
            <button onClick={() => setIsNewResearchModalOpen(true)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              <Plus size={14} />
              <span>Add Research</span>
            </button>
          </div>

          <div className="grid-2">
            {projectResearch.map((res) => (
              <div key={res.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.15)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    {res.category}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete research "${res.title}"?`)) deleteResearch(res.id);
                    }}
                    className="btn-icon"
                    style={{ width: '26px', height: '26px' }}
                  >
                    <Trash2 size={12} style={{ color: 'var(--accent-rose)' }} />
                  </button>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                  {res.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                  {res.summary}
                </p>

                {res.notes && (
                  <div style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                    <strong>Takeaway:</strong> {res.notes}
                  </div>
                )}

                {res.sourceUrl && (
                  <a
                    href={res.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
                  >
                    <ExternalLink size={12} />
                    <span>View Reference Source</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: RESOURCES */}
      {activeHubTab === 'resources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Connected External Repositories, Designs & Tools</span>
            <button onClick={() => setIsNewResourceModalOpen(true)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              <Plus size={14} />
              <span>Add Resource Link</span>
            </button>
          </div>

          <div className="grid-3">
            {projectResources.map((r) => (
              <div key={r.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getResourceIcon(r.resourceType)}
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.resourceType}</span>
                  </div>
                  <button
                    onClick={() => togglePinResource(r.id)}
                    style={{ background: 'none', border: 'none', color: r.isPinned ? 'var(--accent-cyan)' : 'var(--text-dim)', cursor: 'pointer' }}
                    title={r.isPinned ? 'Unpin' : 'Pin to Overview'}
                  >
                    <Pin size={14} />
                  </button>
                </div>

                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.3rem' }}>{r.title}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>{r.description}</p>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem', justifyContent: 'center' }}
                  >
                    <ExternalLink size={13} />
                    <span>Open</span>
                  </a>
                  <button
                    onClick={() => handleCopyLink(r.url, r.id)}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    title="Copy URL"
                  >
                    <Copy size={13} />
                    <span>{copiedId === r.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: FILES */}
      {activeHubTab === 'files' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Project Assets, PDF Decks & Files</span>
            <button onClick={() => setIsNewFileModalOpen(true)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              <Plus size={14} />
              <span>Upload File</span>
            </button>
          </div>

          <div className="grid-3">
            {projectFiles.map((f) => (
              <div
                key={f.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: '1px solid var(--border-subtle)'
                }}
                onClick={() => setActiveFilePreview(f)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)' }}>
                      <FileText size={18} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={f.fileName}
                      >
                        {f.fileName}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {f.fileType} • {f.fileSize || '1.5 MB'}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>By {f.uploadedBy}</span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilePreview(f);
                      }}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', gap: '0.25rem' }}
                    >
                      <Eye size={12} />
                      <span>View</span>
                    </button>
                    <a
                      href={f.fileUrl}
                      download={f.fileName}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', gap: '0.25rem', textDecoration: 'none', color: '#ffffff' }}
                      title="Download File"
                    >
                      <Download size={12} />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete file "${f.fileName}"?`)) deleteFile(f.id);
                      }}
                      className="btn-icon"
                      style={{ width: '24px', height: '24px' }}
                    >
                      <Trash2 size={12} style={{ color: 'var(--accent-rose)' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* File & PDF Viewer Lightbox Modal */}
          {activeFilePreview && (
            <div className="modal-overlay" onClick={() => setActiveFilePreview(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px', width: '92vw', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <FileText size={22} style={{ color: 'var(--accent-cyan)' }} />
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>{activeFilePreview.fileName}</h3>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {activeFilePreview.fileType} • {activeFilePreview.fileSize || '1.5 MB'} • Uploaded by {activeFilePreview.uploadedBy}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <a
                      href={activeFilePreview.fileUrl}
                      download={activeFilePreview.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', gap: '0.4rem', textDecoration: 'none' }}
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </a>
                    <button onClick={() => setActiveFilePreview(null)} className="btn-icon">✕</button>
                  </div>
                </div>

                {/* PDF Viewer / Document Preview Body */}
                <div style={{ height: '72vh', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeFilePreview.fileUrl.startsWith('data:application/pdf') || activeFilePreview.fileName.toLowerCase().endsWith('.pdf') || activeFilePreview.fileType === 'PDF' ? (
                    <iframe
                      src={activeFilePreview.fileUrl}
                      title={activeFilePreview.fileName}
                      style={{ width: '100%', height: '100%', border: 'none', background: '#ffffff', borderRadius: 'var(--radius-md)' }}
                    />
                  ) : activeFilePreview.fileUrl.startsWith('data:image') || activeFilePreview.fileType === 'Image' || activeFilePreview.fileType === 'Screenshot' ? (
                    <img
                      src={activeFilePreview.fileUrl}
                      alt={activeFilePreview.fileName}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <FileText size={64} style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }} />
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                        {activeFilePreview.fileName}
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                        {activeFilePreview.fileType} Document ready for download.
                      </p>
                      <a
                        href={activeFilePreview.fileUrl}
                        download={activeFilePreview.fileName}
                        className="btn btn-primary"
                        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <Download size={16} />
                        <span>Download & Open File</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 8: IDEAS */}
      {activeHubTab === 'ideas' && (
        <div className="card">
          <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.85rem' }}>
            Connected Ideas ({projectIdeas.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {projectIdeas.map((i) => (
              <div key={i.id} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{i.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{i.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: ACTIVITY */}
      {activeHubTab === 'activity' && (
        <div className="card">
          <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>
            Project Chronological History
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {projectActivity.map((act) => (
              <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.8rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', marginTop: '6px' }} />
                <div>
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>{act.actorName}</span>{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>{act.action}</span>{' '}
                  <strong style={{ color: 'var(--accent-cyan)' }}>{act.targetTitle}</strong>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatDate(act.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
