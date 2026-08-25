import React from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Zap,
  Clock,
  PieChart,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AnalyticsHub: React.FC = () => {
  const { tasks, projects, studyTasks, members, setActiveTab } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const blockedTasks = tasks.filter((t) => t.status === 'Blocked').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Study vs Work Hours
  const studyHours = studyTasks.reduce((acc, st) => acc + (st.isCompleted ? 0 : st.estimatedStudyTime / 60), 0);
  const kavexaHours = tasks
    .filter((t) => t.category === 'KAVEXA Work' && t.status !== 'Completed')
    .reduce((acc, t) => acc + t.estimatedDuration / 60, 0);

  // Priority Distribution
  const criticalCount = tasks.filter((t) => t.priority === 'Critical').length;
  const highCount = tasks.filter((t) => t.priority === 'High').length;
  const mediumCount = tasks.filter((t) => t.priority === 'Medium').length;
  const lowCount = tasks.filter((t) => t.priority === 'Low').length;

  return (
    <div className="workspace-content">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <BarChart3 size={22} style={{ color: '#6366F1' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F5F5F5' }}>
            System Analytics & Velocity
          </h1>
        </div>
        <p style={{ color: '#A3A3A3', fontSize: '0.85rem' }}>
          Calculated from real task completions, project velocity, and logged IDE hours.
        </p>
      </div>

      {totalTasks === 0 ? (
        <div
          style={{
            backgroundColor: '#0A0A0A',
            border: '1px solid #242424',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 2rem',
            textAlign: 'center',
            maxWidth: '560px',
            margin: '2rem auto'
          }}
        >
          <BarChart3 size={40} style={{ color: '#444444', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F5F5F5', marginBottom: '0.4rem' }}>
            Not enough data yet
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#666666', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Complete tasks, log IDE sessions, and progress through active projects to generate real operational insights.
          </p>
          <button
            onClick={() => setActiveTab('tasks')}
            className="btn btn-primary"
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
          >
            <span>Go to Tasks</span>
            <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <>
          {/* Top 4 Metric Cards */}
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <div className="card">
              <div style={{ fontSize: '0.75rem', color: '#666666', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Task Completion Velocity
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                {completionRate}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#A3A3A3', marginTop: '0.2rem' }}>
                {completedTasks} / {totalTasks} Tasks Shipped
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.75rem', color: '#666666', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Total Work in Progress
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#6366F1', fontFamily: 'var(--font-mono)' }}>
                {totalTasks - completedTasks}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#A3A3A3', marginTop: '0.2rem' }}>
                Active operational queue
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.75rem', color: '#666666', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Study / Work Ratio
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#06B6D4', fontFamily: 'var(--font-mono)' }}>
                {Math.round((studyHours / (studyHours + kavexaHours || 1)) * 100)}% / {Math.round((kavexaHours / (studyHours + kavexaHours || 1)) * 100)}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#A3A3A3', marginTop: '0.2rem' }}>
                Academic vs Ops Distribution
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.75rem', color: '#666666', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Blocked Items
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: blockedTasks > 0 ? '#F59E0B' : '#10B981', fontFamily: 'var(--font-mono)' }}>
                {blockedTasks}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#A3A3A3', marginTop: '0.2rem' }}>
                {blockedTasks === 0 ? '0 Blockers' : 'Prerequisites incomplete'}
              </div>
            </div>
          </div>

          {/* Visual Analytics Charts */}
          <div className="grid-2" style={{ gap: '1.5rem' }}>
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F5F5F5', marginBottom: '1rem' }}>
                Priority Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#EF4444', fontWeight: 700 }}>Critical</span>
                    <span style={{ color: '#F5F5F5', fontFamily: 'var(--font-mono)' }}>{criticalCount}</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#171717', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${(criticalCount / (totalTasks || 1)) * 100}%`, height: '100%', backgroundColor: '#EF4444' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#F59E0B', fontWeight: 700 }}>High</span>
                    <span style={{ color: '#F5F5F5', fontFamily: 'var(--font-mono)' }}>{highCount}</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#171717', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${(highCount / (totalTasks || 1)) * 100}%`, height: '100%', backgroundColor: '#F59E0B' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#6366F1', fontWeight: 700 }}>Medium</span>
                    <span style={{ color: '#F5F5F5', fontFamily: 'var(--font-mono)' }}>{mediumCount}</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#171717', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${(mediumCount / (totalTasks || 1)) * 100}%`, height: '100%', backgroundColor: '#6366F1' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>Low</span>
                    <span style={{ color: '#F5F5F5', fontFamily: 'var(--font-mono)' }}>{lowCount}</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#171717', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${(lowCount / (totalTasks || 1)) * 100}%`, height: '100%', backgroundColor: '#10B981' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F5F5F5', marginBottom: '1rem' }}>
                Project Health Distribution
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {projects.length === 0 ? (
                  <div style={{ color: '#666666', fontSize: '0.8rem', textAlign: 'center', padding: '2rem 0' }}>
                    No active projects to evaluate.
                  </div>
                ) : (
                  projects.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: '#111111',
                        border: '1px solid #242424',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F5F5F5' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#666666' }}>{p.status} • {p.progress}%</div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          backgroundColor: p.health?.status === 'Healthy' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: p.health?.status === 'Healthy' ? '#10B981' : '#F59E0B'
                        }}
                      >
                        {p.health?.status || 'Healthy'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
