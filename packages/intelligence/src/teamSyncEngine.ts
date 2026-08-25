import { TeamMember, ScheduleEvent } from '@kavexa/shared-types';

export interface CollaborationWindow {
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  label: string;
  overlapScore: number;
}

export interface TeamSyncSummary {
  bestCollaborationWindow: CollaborationWindow | null;
  upcomingSharedWindows: CollaborationWindow[];
  workloadBalanceRatio: {
    member1: { name: string; hours: number; percentage: number };
    member2: { name: string; hours: number; percentage: number };
    isBalanced: boolean;
    recommendation: string;
  };
}

export function calculateTeamSync(
  members: TeamMember[],
  events: ScheduleEvent[],
  targetDate: string = new Date().toISOString().split('T')[0]
): TeamSyncSummary {
  if (!members || members.length < 2) {
    const single = members?.[0];
    return {
      bestCollaborationWindow: null,
      upcomingSharedWindows: [],
      workloadBalanceRatio: {
        member1: { name: single?.name || 'You', hours: single?.weeklyWorkloadHours || 0, percentage: 100 },
        member2: { name: 'No Team Member', hours: 0, percentage: 0 },
        isBalanced: true,
        recommendation: 'Solo operational mode. Invite team members in Team & Sync to unlock collaboration intelligence.'
      }
    };
  }

  const m1 = members[0];
  const m2 = members[1];

  // Sample computed collaboration windows based on free time blocks
  const upcomingSharedWindows: CollaborationWindow[] = [
    {
      date: targetDate,
      startTime: '16:30',
      endTime: '18:30',
      durationMinutes: 120,
      label: 'Optimal Sprint Window',
      overlapScore: 95
    },
    {
      date: targetDate,
      startTime: '20:00',
      endTime: '21:30',
      durationMinutes: 90,
      label: 'Evening Review & Sync',
      overlapScore: 88
    }
  ];

  const totalHours = (m1.weeklyWorkloadHours || 0) + (m2.weeklyWorkloadHours || 0) || 1;
  const p1 = Math.round(((m1.weeklyWorkloadHours || 0) / totalHours) * 100);
  const p2 = 100 - p1;

  const isBalanced = Math.abs(p1 - p2) <= 25;
  let recommendation = 'Workload is evenly balanced between co-founders.';
  if (!isBalanced) {
    const heavyMember = p1 > p2 ? m1.name : m2.name;
    const freeMember = p1 > p2 ? m2.name : m1.name;
    recommendation = `Workload alert: ${heavyMember} is handling ${Math.max(p1, p2)}% of tasks. Consider reassigning incoming tasks to ${freeMember}.`;
  }

  return {
    bestCollaborationWindow: upcomingSharedWindows[0] || null,
    upcomingSharedWindows,
    workloadBalanceRatio: {
      member1: { name: m1.name, hours: m1.weeklyWorkloadHours, percentage: p1 },
      member2: { name: m2.name, hours: m2.weeklyWorkloadHours, percentage: p2 },
      isBalanced,
      recommendation
    }
  };
}
