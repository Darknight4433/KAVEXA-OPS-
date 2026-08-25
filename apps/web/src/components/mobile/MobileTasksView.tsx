import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDuration } from '@kavexa/utils';

export const MobileTasksView: React.FC = () => {
  const { tasks, toggleTaskComplete, triggerConfetti } = useApp();
  const [filter, setFilter] = useState<'all' | 'critical' | 'in_progress' | 'blocked' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'critical') return t.priority === 'Critical' && t.status !== 'Completed';
    if (filter === 'in_progress') return t.status === 'In Progress';
    if (filter === 'blocked') return t.status === 'Blocked';
    if (filter === 'completed') return t.status === 'Completed';
    return t.status !== 'Completed';
  });

  return (
    <div style={{ padding: '1rem', paddingBottom: '90px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.2rem' }}>
          Tasks & Queue
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Prioritized operational and study deliverables.
        </p>
      </div>

      {/* Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-md)',
          padding: '0.55rem 0.75rem',
          marginBottom: '0.75rem'
        }}
      >
        <Search size={16} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search deliverables..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: '0.8rem',
            width: '100%'
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.35rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1rem',
          scrollbarWidth: 'none'
        }}
      >
        {[
          { id: 'all', label: 'All Active' },
          { id: 'critical', label: '⚡ Critical' },
          { id: 'in_progress', label: 'In Progress' },
          { id: 'blocked', label: 'Blocked' },
          { id: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '999px',
              border: filter === tab.id ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.08)',
              background: filter === tab.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.02)',
              color: filter === tab.id ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {filteredTasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <CheckCircle2 size={28} style={{ color: 'var(--accent-emerald)', margin: '0 auto 0.5rem' }} />
            <div style={{ fontSize: '0.85rem', color: '#f8fafc' }}>No tasks in this filter</div>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isDone = t.status === 'Completed';

            return (
              <div
                key={t.id}
                style={{
                  background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                  border: isDone ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', flex: 1 }}>
                  <button
                    onClick={() => {
                      toggleTaskComplete(t.id);
                      if (!isDone) triggerConfetti();
                    }}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      border: isDone ? '1px solid var(--accent-emerald)' : '1.5px solid rgba(255,255,255,0.25)',
                      background: isDone ? 'var(--accent-emerald)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    {isDone && <CheckCircle2 size={14} />}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: isDone ? 'var(--text-muted)' : '#ffffff',
                        textDecoration: isDone ? 'line-through' : 'none',
                        lineHeight: 1.3,
                        marginBottom: '0.25rem'
                      }}
                    >
                      {t.title}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      <span>{t.category}</span>
                      <span>•</span>
                      <span>⏱️ {formatDuration(t.estimatedDuration)}</span>
                      {t.dependencies && t.dependencies.length > 0 && (
                        <>
                          <span>•</span>
                          <span style={{ color: 'var(--accent-amber)' }}>⛓️ {t.dependencies.length} prereqs</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    background: t.priority === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                    color: t.priority === 'Critical' ? '#f87171' : '#818cf8',
                    flexShrink: 0
                  }}
                >
                  {t.priority}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
