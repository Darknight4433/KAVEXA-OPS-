import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Plus,
  Sparkles,
  AlertCircle,
  MapPin,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ScheduleEvent, EventType } from '@kavexa/shared-types';
import { findSmartSlotForTask } from '@kavexa/intelligence';

export const ScheduleHub: React.FC = () => {
  const {
    schedules,
    tasks,
    createScheduleEvent,
    deleteScheduleEvent,
    currentMember
  } = useApp();

  type ViewType = 'day' | 'week' | 'month';
  const [viewType, setViewType] = useState<ViewType>('day');
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<EventType>('KAVEXA Work');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStartTime, setNewStartTime] = useState('16:00');
  const [newEndTime, setNewEndTime] = useState('17:30');
  const [newLocation, setNewLocation] = useState('');

  const topTask = tasks.find((t) => t.status !== 'Completed');
  const smartSlot = topTask ? findSmartSlotForTask(topTask, schedules) : null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createScheduleEvent({
      title: newTitle.trim(),
      type: newType,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      location: newLocation || undefined,
      memberId: currentMember.id
    });
    setNewTitle('');
    setIsNewEventModalOpen(false);
  };

  const handleApplySmartSlot = () => {
    if (!smartSlot || !topTask) return;
    createScheduleEvent({
      title: `Sprint: ${topTask.title}`,
      type: 'KAVEXA Work',
      date: smartSlot.suggestedDate,
      startTime: smartSlot.startTime,
      endTime: smartSlot.endTime,
      linkedTaskId: topTask.id,
      memberId: currentMember.id
    });
    alert(`⚡ Scheduled sprint for "${topTask.title}" at ${smartSlot.startTime} - ${smartSlot.endTime}`);
  };

  return (
    <div className="workspace-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <CalendarDays size={22} style={{ color: 'var(--accent-emerald)' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              Unified Schedule & Timetable
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Consolidated calendar merging school hours, study blocks, KAVEXA sprints, and team meetings.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-md)', padding: '0.2rem' }}>
            <button
              onClick={() => setViewType('day')}
              className={`btn-icon ${viewType === 'day' ? 'btn-primary' : ''}`}
              style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
            >
              Day
            </button>
            <button
              onClick={() => setViewType('week')}
              className={`btn-icon ${viewType === 'week' ? 'btn-primary' : ''}`}
              style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
            >
              Week
            </button>
            <button
              onClick={() => setViewType('month')}
              className={`btn-icon ${viewType === 'month' ? 'btn-primary' : ''}`}
              style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
            >
              Month
            </button>
          </div>

          <button onClick={() => setIsNewEventModalOpen(true)} className="btn btn-primary">
            <Plus size={15} />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>

      {/* AI Smart Slot Allocation Banner */}
      {smartSlot && (
        <div
          className="card card-spotlight"
          style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                AI Smart Slot Recommendation: {smartSlot.startTime} - {smartSlot.endTime}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {smartSlot.reason}
              </div>
            </div>
          </div>

          <button
            onClick={handleApplySmartSlot}
            className="btn btn-primary"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
          >
            ⚡ Block This Slot
          </button>
        </div>
      )}

      {/* Schedule Timeline View */}
      <div className="card">
        <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>Timeline View ({schedules.length} Scheduled Blocks)</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto Conflict Detection: Active</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {schedules.map((ev) => {
            const colorMap: Record<EventType, string> = {
              School: '#f59e0b',
              Study: '#06b6d4',
              'KAVEXA Work': '#6366f1',
              Meeting: '#a855f7',
              Deadline: '#ef4444',
              Personal: '#10b981'
            };
            const accent = colorMap[ev.type] || '#6366f1';

            return (
              <div
                key={ev.id}
                style={{
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.02)',
                  borderLeft: `4px solid ${accent}`,
                  borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                      {ev.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        background: `${accent}25`,
                        color: accent
                      }}
                    >
                      {ev.type}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} />
                      <span>{ev.startTime} - {ev.endTime}</span>
                    </span>
                    <span>•</span>
                    <span>Date: {ev.date}</span>
                    {ev.location && (
                      <>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={12} />
                          <span>{ev.location}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Remove event "${ev.title}"?`)) deleteScheduleEvent(ev.id);
                  }}
                  className="btn-icon"
                  style={{ width: '28px', height: '28px' }}
                >
                  <Trash2 size={13} style={{ color: 'var(--accent-rose)' }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {isNewEventModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewEventModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              Schedule Calendar Block
            </h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Event / Block Title</label>
                <input
                  type="text"
                  placeholder="e.g. StageFlow Canvas Sprint, CS 452 Lecture..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Event Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="KAVEXA Work">KAVEXA Work</option>
                    <option value="School">School / Lecture</option>
                    <option value="Study">Study / Homework</option>
                    <option value="Meeting">Meeting / Sync</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Room (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Hall 302, Discord Voice, Library..."
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setIsNewEventModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
