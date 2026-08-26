import React, { useState } from 'react';
import {
  X,
  Radio,
  Video,
  Users,
  Bell,
  Clock,
  Calendar,
  Link2,
  Sparkles,
  AlertTriangle,
  Pin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NoticeType } from '@kavexa/shared-types';

export const NewNoticeModal: React.FC = () => {
  const { isNewNoticeModalOpen, setIsNewNoticeModalOpen, createNotice, currentMember } = useApp();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NoticeType>('Voice / Video Call (VC)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('18:00');
  const [meetingLink, setMeetingLink] = useState('');
  const [isPinned, setIsPinned] = useState(true);

  if (!isNewNoticeModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Calculate auto-expiration time (when the meeting ends or +24h for general notices)
    let expiresAt: string | undefined = undefined;
    if (date && endTime) {
      try {
        expiresAt = new Date(`${date}T${endTime}:00`).toISOString();
      } catch (err) {
        expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
      }
    } else {
      expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    }

    createNotice({
      title: title.trim(),
      message: message.trim(),
      type,
      date,
      startTime: type === 'General Notice' && !startTime ? undefined : startTime,
      endTime: type === 'General Notice' && !endTime ? undefined : endTime,
      expiresAt,
      meetingLink: meetingLink.trim() || undefined,
      postedBy: currentMember.name,
      postedByAvatar: currentMember.avatarUrl,
      isPinned
    });

    setTitle('');
    setMessage('');
    setMeetingLink('');
    setIsNewNoticeModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsNewNoticeModalOpen(false)}>
      <div className="modal-content" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8'
              }}
            >
              {type === 'Voice / Video Call (VC)' ? <Video size={20} /> : <Radio size={20} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                {type === 'Voice / Video Call (VC)' ? 'Schedule VC / Team Call' : 'Broadcast Team Notice'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Instant broadcast to all founders • Auto-expires when time ends
              </p>
            </div>
          </div>
          <button onClick={() => setIsNewNoticeModalOpen(false)} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Notice / Meeting Type Tabs */}
          <div className="form-group">
            <label className="form-label">Broadcast Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              {(['Voice / Video Call (VC)', 'General Notice', 'Urgent Alert'] as NoticeType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t);
                    if (t === 'Voice / Video Call (VC)' && !meetingLink) {
                      setMeetingLink('https://meet.google.com/new');
                    }
                  }}
                  style={{
                    padding: '0.55rem 0.4rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    border: type === t ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: type === t ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                    color: type === t ? '#ffffff' : 'var(--text-secondary)'
                  }}
                >
                  {t === 'Voice / Video Call (VC)' && <Video size={15} style={{ color: '#818cf8' }} />}
                  {t === 'General Notice' && <Radio size={15} style={{ color: 'var(--accent-cyan)' }} />}
                  {t === 'Urgent Alert' && <AlertTriangle size={15} style={{ color: 'var(--accent-rose)' }} />}
                  <span>{t === 'Voice / Video Call (VC)' ? 'VC Call' : t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">
              {type === 'Voice / Video Call (VC)' ? 'VC Meeting Topic *' : 'Notice Title *'}
            </label>
            <input
              type="text"
              placeholder={type === 'Voice / Video Call (VC)' ? 'e.g. Weekly Product Sync & Roadmap Sprint' : 'e.g. Campus Lab Offline Today, Sync Online'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
              autoFocus
            />
          </div>

          {/* Details / Agenda */}
          <div className="form-group">
            <label className="form-label">Agenda / Details</label>
            <textarea
              placeholder="Provide context, meeting agenda, or announcements for the team..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-input"
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Date and Time / Allotted Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.65rem' }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">End / Expiry Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Video Call Link (Google Meet / Zoom / Discord / Jitsi) */}
          {(type === 'Voice / Video Call (VC)' || meetingLink) && (
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Meeting Link (Google Meet, Zoom, Jitsi, Discord)</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>🔗 Auto-opens in browser</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.2rem' }}
                />
                <Link2
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
              </div>
            </div>
          )}

          {/* Auto-Expiration Info Banner */}
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              marginBottom: '1rem',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Clock size={15} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
            <span>
              <strong>Smart Auto-Clean:</strong> This notice and notification alert will automatically disappear from the dashboard once the scheduled time ends at <strong>{endTime || '24 hours'}</strong>.
            </span>
          </div>

          {/* Pin Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              type="checkbox"
              id="isPinnedNotice"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <label htmlFor="isPinnedNotice" style={{ fontSize: '0.8rem', color: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Pin size={13} style={{ color: 'var(--accent-amber)' }} />
              <span>Pin to top of Command Center Dashboard</span>
            </label>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
            <button type="button" onClick={() => setIsNewNoticeModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Radio size={15} />
              <span>Broadcast to Team</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
