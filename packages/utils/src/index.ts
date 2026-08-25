// Shared helper functions for KAVEXA OPS

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function formatTime(timeString: string): string {
  if (!timeString) return '';
  if (timeString.includes('T')) {
    const d = new Date(timeString);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  // Check if it's "HH:MM"
  const parts = timeString.split(':');
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const mins = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    return `${h12}:${mins} ${ampm}`;
  }
  return timeString;
}

export function formatDuration(minutes: number): string {
  if (!minutes && minutes !== 0) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

export function getDaysUntil(dateString: string): number {
  if (!dateString) return 999;
  const target = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDeadlineBadge(dateString: string): { label: string; urgency: 'critical' | 'warning' | 'normal' | 'overdue' } {
  const days = getDaysUntil(dateString);
  if (days < 0) {
    return { label: `${Math.abs(days)}d overdue`, urgency: 'overdue' };
  }
  if (days === 0) {
    return { label: 'Due Today', urgency: 'critical' };
  }
  if (days === 1) {
    return { label: 'Due Tomorrow', urgency: 'warning' };
  }
  if (days <= 3) {
    return { label: `In ${days} days`, urgency: 'warning' };
  }
  return { label: `In ${days} days`, urgency: 'normal' };
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function getInitials(name: string): string {
  if (!name) return 'K';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
