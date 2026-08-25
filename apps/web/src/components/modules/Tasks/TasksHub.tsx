import React, { useState } from 'react';
import {
  CheckSquare,
  Sparkles,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Users,
  Plus,
  Search,
  Filter,
  ArrowRight,
  FileText,
  GitGraph,
  Link as LinkIcon,
  X,
  Share2,
  Trash2
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '@kavexa/shared-types';
import { formatDuration, getDaysUntil } from '@kavexa/utils';

export const TasksHub: React.FC = () => {
  const {
    tasks,
    projects,
    members,
    currentMember,
    selectedTaskId,
    setSelectedTaskId,
    toggleTaskComplete,
    deleteTask,
    updateTask,
    documents,
    diagrams,
    resources,
    setIsNewTaskModalOpen
  } = useApp();

  type TaskFilter = 'recommended' | 'my_tasks' | 'team_tasks' | 'today' | 'upcoming' | 'blocked' | 'completed' | 'daily_focus';
  const [filter, setFilter] = useState<TaskFilter>('recommended');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const activeTaskDrawer = tasks.find((t) => t.id === selectedTaskId);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    // Search
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    // Category
    if (categoryFilter !== 'all' && t.category !== categoryFilter) {
      return false;
    }
    // Sub-view filter
    switch (filter) {
      case 'recommended':
        return t.status !== 'Completed' && t.status !== 'Blocked';
      case 'my_tasks':
        return t.assignedMemberId === currentMember.id && t.status !== 'Completed';
      case 'team_tasks':
        return t.status !== 'Completed';
      case 'today':
        return t.status !== 'Completed' && getDaysUntil(t.deadline) <= 1;
      case 'upcoming':
        return t.status !== 'Completed' && getDaysUntil(t.deadline) > 1;
      case 'blocked':
        return t.status === 'Blocked';
      case 'completed':
        return t.status === 'Completed';
      case 'daily_focus':
        return t.status !== 'Completed';
      default:
        return true;
    }
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  // Daily Focus Quadrants
  const doFirstTasks = filteredTasks.filter((t) => t.priorityScore >= 85 && t.status !== 'Blocked');
  const importantTodayTasks = filteredTasks.filter((t) => t.priorityScore >= 70 && t.priorityScore < 85 && t.status !== 'Blocked');
  const quickWinTasks = filteredTasks.filter((t) => t.estimatedDuration <= 45 && t.status !== 'Blocked' && !doFirstTasks.includes(t) && !importantTodayTasks.includes(t));
  const ifTimeAllowsTasks = filteredTasks.filter((t) => !doFirstTasks.includes(t) && !importantTodayTasks.includes(t) && !quickWinTasks.includes(t));

  return (
    <div className="workspace-content" style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <CheckSquare size={22} style={{ color: 'var(--accent-primary)' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              Intelligent Task Management
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Live algorithmic priority engine (0–100 score), blocker dependency graph & daily focus allocation.
          </p>
        </div>

        <button onClick={() => setIsNewTaskModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Main Tabs / Subsections */}
      <div className="tabs-header">
        <button onClick={() => setFilter('recommended')} className={`tab-btn ${filter === 'recommended' ? 'active' : ''}`}>
          <Sparkles size={15} />
          <span>AI Recommended</span>
        </button>
        <button onClick={() => setFilter('daily_focus')} className={`tab-btn ${filter === 'daily_focus' ? 'active' : ''}`}>
          <Zap size={15} />
          <span>Daily Focus System</span>
        </button>
        <button onClick={() => setFilter('my_tasks')} className={`tab-btn ${filter === 'my_tasks' ? 'active' : ''}`}>
          <Users size={15} />
          <span>My Tasks ({tasks.filter(t => t.assignedMemberId === currentMember.id && t.status !== 'Completed').length})</span>
        </button>
        <button onClick={() => setFilter('team_tasks')} className={`tab-btn ${filter === 'team_tasks' ? 'active' : ''}`}>
          <span>Team Tasks</span>
        </button>
        <button onClick={() => setFilter('today')} className={`tab-btn ${filter === 'today' ? 'active' : ''}`}>
          <span>Due Today</span>
        </button>
        <button onClick={() => setFilter('blocked')} className={`tab-btn ${filter === 'blocked' ? 'active' : ''}`}>
          <Lock size={15} />
          <span>Blocked ({tasks.filter(t => t.status === 'Blocked').length})</span>
        </button>
        <button onClick={() => setFilter('completed')} className={`tab-btn ${filter === 'completed' ? 'active' : ''}`}>
          <CheckCircle2 size={15} />
          <span>Completed</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2rem', height: '36px', fontSize: '0.8rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['all', 'KAVEXA Work', 'Study', 'Personal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`btn ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* DAILY FOCUS MATRIX (4 Quadrants) */}
      {filter === 'daily_focus' ? (
        <div className="grid-2" style={{ gap: '1.25rem' }}>
          {/* Quadrant 1: Do First */}
          <div className="card card-spotlight">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="priority-score-badge score-urgent" style={{ fontSize: '0.65rem' }}>1</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#f87171' }}>
                  DO FIRST (Urgent & High Impact)
                </span>
              </div>
              <span className="nav-badge">{doFirstTasks.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {doFirstTasks.map((t) => renderTaskRow(t))}
              {doFirstTasks.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No critical blocker tasks.</div>}
            </div>
          </div>

          {/* Quadrant 2: Important Today */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="priority-score-badge score-elevated" style={{ fontSize: '0.65rem' }}>2</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#fbbf24' }}>
                  IMPORTANT TODAY (Upcoming Deadlines)
                </span>
              </div>
              <span className="nav-badge">{importantTodayTasks.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {importantTodayTasks.map((t) => renderTaskRow(t))}
              {importantTodayTasks.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No pending important tasks today.</div>}
            </div>
          </div>

          {/* Quadrant 3: Quick Wins */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="priority-score-badge score-normal" style={{ fontSize: '0.65rem' }}>3</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8' }}>
                  QUICK WINS (&lt;45 min Sprints)
                </span>
              </div>
              <span className="nav-badge">{quickWinTasks.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {quickWinTasks.map((t) => renderTaskRow(t))}
              {quickWinTasks.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No short sprint tasks pending.</div>}
            </div>
          </div>

          {/* Quadrant 4: If Time Allows */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="priority-score-badge score-low" style={{ fontSize: '0.65rem' }}>4</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>
                  IF TIME ALLOWS (Lower Urgency)
                </span>
              </div>
              <span className="nav-badge">{ifTimeAllowsTasks.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {ifTimeAllowsTasks.map((t) => renderTaskRow(t))}
              {ifTimeAllowsTasks.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No low priority queue items.</div>}
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD LIST VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filteredTasks.map((t) => renderTaskRow(t))}
          {filteredTasks.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              No tasks match the active filters.
            </div>
          )}
        </div>
      )}

      {/* AI TRANSPARENCY & PRIORITY BREAKDOWN DRAWER */}
      {activeTaskDrawer && (
        <div className="drawer-overlay" onClick={() => setSelectedTaskId(null)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <span className={`priority-score-badge score-${activeTaskDrawer.priorityBreakdown.urgencyLevel.toLowerCase()}`} style={{ marginBottom: '0.4rem' }}>
                  PRIORITY SCORE: {activeTaskDrawer.priorityScore}/100
                </span>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.3 }}>
                  {activeTaskDrawer.title}
                </h2>
              </div>
              <button onClick={() => setSelectedTaskId(null)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            {/* Recommendation Q&A Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Question 1 & 2: Why it matters */}
              <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  🧠 AI Reasoning & Why It Matters
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {activeTaskDrawer.priorityBreakdown.reasons.map((r, i) => (
                    <div key={i} style={{ fontSize: '0.825rem', color: '#cbd5e1', display: 'flex', gap: '0.4rem' }}>
                      <span>•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6 Modular Scoring Factor Bars */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Modular Priority Engine Weighting (0-100)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Deadline Urgency (30% weight)</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f87171' }}>
                        {activeTaskDrawer.priorityBreakdown.deadlineScore} / 30 pts
                      </span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(activeTaskDrawer.priorityBreakdown.deadlineScore / 30) * 100}%`, height: '100%', background: '#ef4444' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Base Priority Level (20% weight)</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#818cf8' }}>
                        {activeTaskDrawer.priorityBreakdown.priorityScore} / 20 pts
                      </span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(activeTaskDrawer.priorityBreakdown.priorityScore / 20) * 100}%`, height: '100%', background: '#6366f1' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Dependency Impact (15% weight)</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fbbf24' }}>
                        {activeTaskDrawer.priorityBreakdown.dependencyScore} / 15 pts
                      </span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(activeTaskDrawer.priorityBreakdown.dependencyScore / 15) * 100}%`, height: '100%', background: '#f59e0b' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Project Impact (15% weight)</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#06b6d4' }}>
                        {activeTaskDrawer.priorityBreakdown.impactScore} / 15 pts
                      </span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(activeTaskDrawer.priorityBreakdown.impactScore / 15) * 100}%`, height: '100%', background: '#06b6d4' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Schedule Fit & Time Slot (10% weight)</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#10b981' }}>
                        {activeTaskDrawer.priorityBreakdown.scheduleScore} / 10 pts
                      </span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(activeTaskDrawer.priorityBreakdown.scheduleScore / 10) * 100}%`, height: '100%', background: '#10b981' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Workload Balance (10% weight)</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#a855f7' }}>
                        {activeTaskDrawer.priorityBreakdown.workloadScore} / 10 pts
                      </span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(activeTaskDrawer.priorityBreakdown.workloadScore / 10) * 100}%`, height: '100%', background: '#a855f7' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dependency Chain Visualizer */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                  Dependency Chain Graph
                </div>

                {activeTaskDrawer.dependencies && activeTaskDrawer.dependencies.length > 0 && (
                  <div style={{ marginBottom: '0.65rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#fca5a5', marginBottom: '0.3rem' }}>Blocked by Prerequisite:</div>
                    {activeTaskDrawer.dependencies.map((depId) => {
                      const dep = tasks.find((t) => t.id === depId);
                      return (
                        <div key={depId} style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', color: '#f8fafc', marginBottom: '0.25rem' }}>
                          ⛔ {dep?.title || depId} ({dep?.status})
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTaskDrawer.blocksTasks && activeTaskDrawer.blocksTasks.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#fbbf24', marginBottom: '0.3rem' }}>Unlocks Downstream Tasks:</div>
                    {activeTaskDrawer.blocksTasks.map((bid) => {
                      const bt = tasks.find((t) => t.id === bid);
                      return (
                        <div key={bid} style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '4px', color: '#f8fafc', marginBottom: '0.25rem' }}>
                          🔓 {bt?.title || bid}
                        </div>
                      );
                    })}
                  </div>
                )}

                {(!activeTaskDrawer.dependencies || activeTaskDrawer.dependencies.length === 0) &&
                  (!activeTaskDrawer.blocksTasks || activeTaskDrawer.blocksTasks.length === 0) && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      No active upstream or downstream dependencies for this task.
                    </div>
                  )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  onClick={() => toggleTaskComplete(activeTaskDrawer.id)}
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <CheckCircle2 size={16} />
                  <span>{activeTaskDrawer.status === 'Completed' ? 'Reopen Task' : 'Mark Completed'}</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete task "${activeTaskDrawer.title}"?`)) {
                      deleteTask(activeTaskDrawer.id);
                      setSelectedTaskId(null);
                    }
                  }}
                  className="btn btn-secondary"
                >
                  <Trash2 size={16} style={{ color: 'var(--accent-rose)' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderTaskRow(task: Task) {
    const isDone = task.status === 'Completed';
    const isBlocked = task.status === 'Blocked';

    return (
      <div
        key={task.id}
        style={{
          padding: '0.85rem 1rem',
          background: isDone ? 'rgba(255,255,255,0.01)' : 'rgba(15, 23, 42, 0.75)',
          border: '1px solid',
          borderColor: isBlocked ? 'rgba(245, 158, 11, 0.3)' : isDone ? 'transparent' : 'var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
          <input
            type="checkbox"
            checked={isDone}
            onChange={() => toggleTaskComplete(task.id)}
            style={{ accentColor: 'var(--accent-emerald)', width: '16px', height: '16px', cursor: 'pointer' }}
          />

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isDone ? 'var(--text-muted)' : '#f8fafc',
                  textDecoration: isDone ? 'line-through' : 'none'
                }}
              >
                {task.title}
              </span>

              {isBlocked && (
                <span className="priority-score-badge score-elevated" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                  <Lock size={10} />
                  <span>BLOCKED</span>
                </span>
              )}

              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                  background: task.category === 'KAVEXA Work' ? 'rgba(99, 102, 241, 0.12)' : task.category === 'Study' ? 'rgba(6, 182, 212, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                  color: task.category === 'KAVEXA Work' ? '#818cf8' : task.category === 'Study' ? '#06b6d4' : '#10b981'
                }}
              >
                {task.category}
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span>⏱️ {formatDuration(task.estimatedDuration)}</span>
              <span>•</span>
              <span>📅 Due: {task.deadline}</span>
              <span>•</span>
              <span>👤 {members.find((m) => m.id === task.assignedMemberId)?.name || 'Unassigned'}</span>
              {task.linkedDocumentIds && task.linkedDocumentIds.length > 0 && (
                <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <FileText size={11} />
                  <span>PRD linked</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`priority-score-badge score-${task.priorityBreakdown.urgencyLevel.toLowerCase()}`}>
            {task.priorityScore} pts
          </span>
          <button
            onClick={() => setSelectedTaskId(task.id)}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
          >
            AI Breakdown
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete task "${task.title}"?`)) {
                deleteTask(task.id);
              }
            }}
            className="btn-icon"
            style={{ color: 'var(--text-dim)', padding: '0.35rem' }}
            title="Delete Task"
          >
            <Trash2 size={15} style={{ color: '#ef4444' }} />
          </button>
        </div>
      </div>
    );
  }
};
