import React from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Zap,
  Clock,
  PieChart
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AnalyticsHub: React.FC = () => {
  const { tasks, projects, studyTasks, members } = useApp();

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
          <BarChart3 size={22} style={{ color: 'var(--accent-cyan)' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
            System Analytics & Productivity Velocity
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Performance metrics, work-study balance ratios, and project health distributions.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Task Completion Velocity
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            {completionRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {completedTasks} / {totalTasks} Tasks Shipped
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Total Work in Progress
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
            {totalTasks - completedTasks}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Active operational queue
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Study / Work Balance Ratio
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            {Math.round((studyHours / (studyHours + kavexaHours || 1)) * 100)}% / {Math.round((kavexaHours / (studyHours + kavexaHours || 1)) * 100)}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Academic vs Ops Distribution
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Blocked Dependency Items
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: blockedTasks > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            {blockedTasks}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {blockedTasks === 0 ? '0 Blockers' : 'Prerequisites incomplete'}
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Weekly Productivity Velocity Bar Chart */}
        <div className="card">
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingUp size={16} style={{ color: 'var(--accent-primary)' }} />
            <span>Weekly Sprint Velocity (Tasks Completed)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            {[
              { day: 'Mon', count: 4, height: '40%' },
              { day: 'Tue', count: 7, height: '70%' },
              { day: 'Wed', count: 5, height: '50%' },
              { day: 'Thu', count: 9, height: '90%' },
              { day: 'Fri', count: 6, height: '60%' },
              { day: 'Sat', count: 8, height: '80%' },
              { day: 'Sun (Today)', count: 10, height: '100%' }
            ].map((bar) => (
              <div key={bar.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{bar.count}</span>
                <div
                  style={{
                    width: '32px',
                    height: bar.height,
                    background: 'linear-gradient(180deg, #6366f1, rgba(99, 102, 241, 0.2))',
                    borderRadius: '6px 6px 0 0',
                    boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)'
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Level Breakdown */}
        <div className="card">
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={16} style={{ color: 'var(--accent-amber)' }} />
            <span>Priority Level Distribution</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <span style={{ color: '#f87171' }}>⚡ Critical ({criticalCount})</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round((criticalCount / (totalTasks || 1)) * 100)}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(criticalCount / (totalTasks || 1)) * 100}%`, height: '100%', background: '#ef4444' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <span style={{ color: '#fbbf24' }}>High Priority ({highCount})</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round((highCount / (totalTasks || 1)) * 100)}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(highCount / (totalTasks || 1)) * 100}%`, height: '100%', background: '#f59e0b' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <span style={{ color: '#818cf8' }}>Medium Priority ({mediumCount})</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round((mediumCount / (totalTasks || 1)) * 100)}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(mediumCount / (totalTasks || 1)) * 100}%`, height: '100%', background: '#6366f1' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <span style={{ color: '#94a3b8' }}>Low Priority ({lowCount})</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round((lowCount / (totalTasks || 1)) * 100)}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(lowCount / (totalTasks || 1)) * 100}%`, height: '100%', background: '#64748b' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
