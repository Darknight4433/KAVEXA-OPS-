import React, { useState, useRef } from 'react';
import {
  Users,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Zap,
  Plus,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { calculateTeamSync } from '@kavexa/intelligence';
import { formatDuration } from '@kavexa/utils';
import { TeamMember } from '@kavexa/shared-types';

export const TeamHub: React.FC = () => {
  const {
    members,
    schedules,
    tasks,
    updateMemberAvailability,
    createScheduleEvent,
    createMember,
    deleteMember,
    currentMemberId,
    setIsUserProfileModalOpen
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Co-Founder & Product Lead');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/app-icon.png');
  const [skills, setSkills] = useState('Product, Design, Strategy');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const teamSync = calculateTeamSync(members, schedules);

  const availabilityOptions: Array<'Available' | 'Busy' | 'Studying' | 'School' | 'Offline'> = [
    'Available',
    'Busy',
    'Studying',
    'School',
    'Offline'
  ];

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createMember({
      name: name.trim(),
      role: role.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@kavexa.io`,
      avatarUrl: avatarUrl || '/app-icon.png',
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      availability: 'Available',
      weeklyWorkloadHours: 0
    });

    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setAvatarUrl('/app-icon.png');
  };

  const handleScheduleSyncSession = () => {
    if (!teamSync.bestCollaborationWindow) return;
    createScheduleEvent({
      title: 'KAVEXA Co-Founder Collaborative Sprint',
      type: 'KAVEXA Work',
      date: teamSync.bestCollaborationWindow.date,
      startTime: teamSync.bestCollaborationWindow.startTime,
      endTime: teamSync.bestCollaborationWindow.endTime,
      memberId: 'all'
    });
    alert('⚡ Scheduled collaborative team session on calendar!');
  };

  return (
    <div className="workspace-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <Users size={22} style={{ color: 'var(--accent-primary)' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              Team Management & Sync Intelligence
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Coordinate live availability, detect collaborative free time windows, and manage co-founders.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Add Co-Founder</span>
        </button>
      </div>

      {/* Team Sync Intelligence Window Spotlight */}
      <div
        className="card card-spotlight"
        style={{
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}
          >
            <Sparkles size={24} />
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
              Optimal Collaborative Work Window Detected
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {teamSync.bestCollaborationWindow ? (
                <span>
                  {teamSync.bestCollaborationWindow.startTime} - {teamSync.bestCollaborationWindow.endTime} ({teamSync.bestCollaborationWindow.durationMinutes} mins)
                </span>
              ) : (
                <span>Available for Deep Work</span>
              )}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {teamSync.workloadBalanceRatio?.recommendation || 'Workloads synchronized across active founders.'}
            </div>
          </div>
        </div>

        {teamSync.bestCollaborationWindow && (
          <button
            onClick={handleScheduleSyncSession}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1rem' }}
          >
            <Calendar size={16} />
            <span>Lock In Collaborative Sprint</span>
          </button>
        )}
      </div>

      {/* Founder Profile Cards */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {members.map((member) => {
          const memberTasks = tasks.filter((t) => t.assignedMemberId === member.id && t.status !== 'Completed');
          const completedTasks = tasks.filter((t) => t.assignedMemberId === member.id && t.status === 'Completed');

          return (
            <div key={member.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                  <img
                    src={member.avatarUrl || '/app-icon.png'}
                    alt={member.name}
                    style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', objectFit: 'cover', border: '2px solid var(--border-medium)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>{member.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{member.role}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`availability-pill avail-${member.availability}`}>
                    {member.availability}
                  </span>
                  {members.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove team member "${member.name}"?`)) {
                          deleteMember(member.id);
                        }
                      }}
                      className="btn-icon"
                      title="Remove Member"
                    >
                      <Trash2 size={14} style={{ color: '#ef4444' }} />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Selector */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                  Live Status Switcher
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {availabilityOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateMemberAvailability(member.id, status)}
                      className={`availability-pill avail-${status}`}
                      style={{
                        cursor: 'pointer',
                        border: member.availability === status ? '2px solid #ffffff' : 'none',
                        padding: '0.2rem 0.5rem'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus Domain & University */}
              {(member.focusDomain || member.university) && (
                <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '0.85rem', fontSize: '0.75rem' }}>
                  {member.focusDomain && (
                    <div style={{ color: '#cbd5e1', marginBottom: member.university ? '0.2rem' : 0 }}>
                      ⚡ <strong>Focus:</strong> {member.focusDomain}
                    </div>
                  )}
                  {member.university && (
                    <div style={{ color: 'var(--accent-amber)' }}>
                      🎓 <strong>Academic:</strong> {member.university}
                    </div>
                  )}
                </div>
              )}

              {/* Founder Bio */}
              {member.bio && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', fontStyle: 'italic' }}>
                  "{member.bio}"
                </p>
              )}

              {/* Workload Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    {member.weeklyWorkloadHours}h
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Weekly Load</div>
                </div>

                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {memberTasks.length}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Active Tasks</div>
                </div>

                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                    {completedTasks.length}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completed</div>
                </div>
              </div>

              {/* Skills Tags & Customize Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {member.skills.map((skill) => (
                    <span key={skill} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.04)', padding: '0.15rem 0.45rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                      {skill}
                    </span>
                  ))}
                </div>
                {member.id === currentMemberId && (
                  <button
                    onClick={() => setIsUserProfileModalOpen(true)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
                  >
                    Edit My Profile & Theme
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} style={{ color: 'var(--accent-primary)' }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                  Add Team Member / Co-Founder
                </h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateMember}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Co-Founder & Product Lead"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    placeholder="alex@kavexa.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Avatar Image Picker */}
              <div className="form-group">
                <label className="form-label">Profile Photo / Avatar</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed rgba(99, 102, 241, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'rgba(99, 102, 241, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                      Click to upload photo from computer
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      PNG, JPG, or WebP
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Core Skills (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Python, UI/UX, Growth"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  <span>Add Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
