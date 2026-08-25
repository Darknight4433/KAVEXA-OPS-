import React, { useState } from 'react';
import {
  User,
  Palette,
  Sparkles,
  Shield,
  Upload,
  Check,
  Briefcase,
  GraduationCap,
  Sliders,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TeamMember } from '@kavexa/shared-types';

const THEME_OPTIONS = [
  {
    id: 'midnight',
    name: 'Cyberpunk Obsidian',
    description: 'Electric cyan and indigo on deep obsidian dark slate.',
    primary: '#6366f1',
    accent: '#06b6d4',
    bg: '#080b11'
  },
  {
    id: 'emerald',
    name: 'Matrix Emerald',
    description: 'Vibrant neon emerald & mint on dark obsidian green.',
    primary: '#10b981',
    accent: '#34d399',
    bg: '#040d0a'
  },
  {
    id: 'amber',
    name: 'Solarized Amber',
    description: 'Warm amber glow & volcanic cocoa tones.',
    primary: '#f59e0b',
    accent: '#fbbf24',
    bg: '#0e0a05'
  },
  {
    id: 'violet',
    name: 'Synthwave Violet',
    description: 'High-contrast neon purple & magenta space aesthetic.',
    primary: '#8b5cf6',
    accent: '#c084fc',
    bg: '#0b0714'
  },
  {
    id: 'arctic',
    name: 'Nordic Glacier',
    description: 'Arctic sky blue & deep icy navy command deck.',
    primary: '#0284c7',
    accent: '#38bdf8',
    bg: '#060e18'
  },
  {
    id: 'crimson',
    name: 'Crimson Core',
    description: 'Sleek ruby red & carbon dark aesthetic.',
    primary: '#e11d48',
    accent: '#fb7185',
    bg: '#0f0507'
  }
];

const SUGGESTED_ROLES = [
  'Founder & CEO',
  'Technical Lead & Robotics',
  'AI & Machine Learning Lead',
  'Hardware & Mechanical Engineer',
  'Full-Stack Systems Engineer',
  'Product & Operations Lead',
  'Embedded Systems & Firmware'
];

export const UserProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isFirstLogin?: boolean;
}> = ({ isOpen, onClose, isFirstLogin = false }) => {
  const { currentMember, updateMember, triggerConfetti } = useApp();

  const [name, setName] = useState(currentMember?.name || '');
  const [role, setRole] = useState(currentMember?.role || 'Founder & Technical Lead');
  const [focusDomain, setFocusDomain] = useState(currentMember?.focusDomain || 'Robotics, AI Hardware & Web Systems');
  const [university, setUniversity] = useState(currentMember?.university || 'Computer Science & Engineering');
  const [bio, setBio] = useState(currentMember?.bio || 'Building revolutionary autonomous systems at KAVEXA.');
  const [selectedTheme, setSelectedTheme] = useState(currentMember?.themePreference || 'midnight');
  const [avatarUrl, setAvatarUrl] = useState(currentMember?.avatarUrl || '');
  const [skillsStr, setSkillsStr] = useState(currentMember?.skills?.join(', ') || 'Robotics, React, Firebase, AI Hardware, CAD');

  if (!isOpen) return null;

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    if (themeId === 'midnight') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const skillsArray = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateMember(currentMember.id, {
      name: name.trim(),
      role: role.trim(),
      focusDomain: focusDomain.trim(),
      university: university.trim(),
      bio: bio.trim(),
      themePreference: selectedTheme,
      avatarUrl: avatarUrl || currentMember.avatarUrl,
      skills: skillsArray.length > 0 ? skillsArray : ['Operations']
    });

    handleThemeSelect(selectedTheme);
    triggerConfetti();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', width: '92vw', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
              <User size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                {isFirstLogin ? 'Welcome to KAVEXA OPS — Setup Profile' : 'Founder Profile & Theme Settings'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Customize your founder role and select your personal command deck UI theme.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Avatar & Basic Info Row */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.05)',
                  border: '2px solid var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={30} style={{ color: 'var(--text-secondary)' }} />
                )}
              </div>
              <label
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px solid #080b11'
                }}
                title="Upload Photo"
              >
                <Upload size={11} color="#ffffff" />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setAvatarUrl(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            <div style={{ flex: 1 }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="e.g. Vaishnavi L."
                required
              />
            </div>
          </div>

          {/* Role in Kavexa */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Role in KAVEXA *</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Visible to all team members</span>
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
              placeholder="e.g. Founder & Technical Lead"
              required
            />
            {/* Quick role suggestions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
              {SUGGESTED_ROLES.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    fontSize: '0.65rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    background: role === r ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                    color: role === r ? '#ffffff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Domain Focus & Academic Focus */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Specialization / Domain</label>
              <input
                type="text"
                value={focusDomain}
                onChange={(e) => setFocusDomain(e.target.value)}
                className="form-input"
                placeholder="e.g. Robotics & Autonomous Hardware"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">University / Major</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="form-input"
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>
          </div>

          {/* Core Skills Chips */}
          <div className="form-group">
            <label className="form-label">Core Skills (comma-separated)</label>
            <input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              className="form-input"
              placeholder="Robotics, Python, React, CAD, Embedded C"
            />
          </div>

          {/* Personal Bio */}
          <div className="form-group">
            <label className="form-label">Founder Bio / Objective</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="form-textarea"
              rows={2}
              placeholder="What are you focused on building at KAVEXA?"
            />
          </div>

          {/* UI Theme & Color Choice */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
              <Palette size={14} style={{ color: 'var(--accent-cyan)' }} />
              <span>Personal Command Deck UI Theme</span>
            </label>
            <div className="grid-3" style={{ gap: '0.6rem' }}>
              {THEME_OPTIONS.map((th) => {
                const isSelected = selectedTheme === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => handleThemeSelect(th.id)}
                    style={{
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      background: th.bg,
                      border: isSelected ? `2px solid ${th.accent}` : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? `0 0 15px -3px ${th.primary}` : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: th.primary }} />
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: th.accent }} />
                      </div>
                      {isSelected && <Check size={14} style={{ color: th.accent }} />}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.15rem' }}>
                      {th.name}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', lineHeight: 1.3 }}>
                      {th.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={14} />
              <span>Save & Apply Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
