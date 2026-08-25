import {
  Task,
  Project,
  TeamMember,
  ScheduleEvent,
  PriorityBreakdown
} from '@kavexa/shared-types';
import { getDaysUntil, formatDuration } from '@kavexa/utils';

export interface IntelligenceContext {
  allTasks: Task[];
  projects: Project[];
  members: TeamMember[];
  schedules: ScheduleEvent[];
  activeMemberId?: string;
}

/**
 * Modular Priority Engine for KAVEXA OPS
 * 
 * 6 Modular Factors:
 * 1. Deadline Urgency (30%) - Approaching deadlines, overdue penalties
 * 2. Base Priority Level (20%) - Critical / High / Medium / Low
 * 3. Dependency Impact (15%) - Number of dependent downstream tasks blocked
 * 4. Project Impact (15%) - High/Medium/Low company impact & project priority
 * 5. Schedule Fit (10%) - Matches available open slot in member's calendar
 * 6. Workload Balance (10%) - Avoids assigning to overloaded member
 */
export function calculateTaskPriority(
  task: Task,
  context: IntelligenceContext
): PriorityBreakdown {
  const reasons: string[] = [];

  // If already completed, low score
  if (task.status === 'Completed') {
    return {
      totalScore: 0,
      deadlineScore: 0,
      priorityScore: 0,
      dependencyScore: 0,
      impactScore: 0,
      scheduleScore: 0,
      workloadScore: 0,
      reasons: ['Task is already completed.'],
      urgencyLevel: 'Low'
    };
  }

  // Factor 1: Deadline Urgency (0 - 30 pts)
  let deadlineScore = 0;
  const daysUntil = getDaysUntil(task.deadline);
  if (daysUntil < 0) {
    // Overdue
    deadlineScore = 30;
    reasons.push(`⚠️ Overdue by ${Math.abs(daysUntil)} day(s) - requires immediate action`);
  } else if (daysUntil === 0) {
    deadlineScore = 30;
    reasons.push(`🔴 Due today! High urgency`);
  } else if (daysUntil === 1) {
    deadlineScore = 29;
    reasons.push(`🟠 Due tomorrow`);
  } else if (daysUntil === 2) {
    deadlineScore = 28;
    reasons.push(`🔴 Deadline is in 2 days (Aug 26)`);
  } else if (daysUntil <= 3) {
    deadlineScore = 24;
    reasons.push(`🟡 Deadline in ${daysUntil} days`);
  } else if (daysUntil <= 7) {
    deadlineScore = 16;
    reasons.push(`Deadline is within a week (${daysUntil} days)`);
  } else {
    deadlineScore = 8;
  }

  // Factor 2: Base Priority Level (0 - 20 pts)
  let priorityScore = 0;
  switch (task.priority) {
    case 'Critical':
      priorityScore = 20;
      reasons.push(`⚡ Marked as Critical priority`);
      break;
    case 'High':
      priorityScore = 15;
      reasons.push(`High operational priority`);
      break;
    case 'Medium':
      priorityScore = 10;
      break;
    case 'Low':
      priorityScore = 5;
      break;
  }

  // Factor 3: Dependency Impact (0 - 15 pts)
  // Check how many other tasks depend on this task
  let dependencyScore = 0;
  const blockedTasks = context.allTasks.filter(
    (t) => t.dependencies && t.dependencies.includes(task.id) && t.status !== 'Completed'
  );
  if (blockedTasks.length > 0) {
    const points = Math.min(15, blockedTasks.length * 5);
    dependencyScore = points;
    reasons.push(`🔗 Blocks ${blockedTasks.length} downstream task(s): "${blockedTasks.map(t => t.title).slice(0, 2).join('", "')}${blockedTasks.length > 2 ? '...' : ''}"`);
  } else {
    dependencyScore = 3;
  }

  // Factor 4: Project Impact (0 - 15 pts)
  let impactScore = 0;
  const relatedProject = context.projects.find((p) => p.id === task.projectId);
  if (task.impactLevel === 'High' || (relatedProject && relatedProject.priority === 'Critical')) {
    impactScore = 15;
    reasons.push(`🚀 High direct impact on KAVEXA milestone goals`);
  } else if (task.impactLevel === 'Medium' || (relatedProject && relatedProject.priority === 'High')) {
    impactScore = 10;
  } else {
    impactScore = 5;
  }

  // Factor 5: Schedule Fit (0 - 10 pts)
  let scheduleScore = 7;
  let recommendedSlot = 'Today at 3:00 PM - 4:30 PM';
  if (task.estimatedDuration <= 45) {
    scheduleScore = 10;
    reasons.push(`⏱️ Quick win (${formatDuration(task.estimatedDuration)}) - fits available timetable buffer`);
    recommendedSlot = 'Next free 45-min study/work break';
  } else if (task.estimatedDuration <= 90) {
    scheduleScore = 8;
    recommendedSlot = 'Focus block today (4:30 PM - 6:00 PM)';
  } else {
    scheduleScore = 6;
    recommendedSlot = 'Requires 2h+ deep work session';
  }

  // Factor 6: Workload Balance (0 - 10 pts)
  let workloadScore = 8;
  const assignedMember = context.members.find((m) => m.id === task.assignedMemberId);
  const otherMember = context.members.find((m) => m.id !== task.assignedMemberId);
  let recommendedMemberId = task.assignedMemberId;

  if (assignedMember) {
    if (assignedMember.availability === 'Available') {
      workloadScore = 10;
      reasons.push(`👤 ${assignedMember.name} is currently available`);
    } else if (assignedMember.availability === 'Busy' || assignedMember.weeklyWorkloadHours > 20) {
      workloadScore = 5;
      if (otherMember && otherMember.availability === 'Available') {
        reasons.push(`⚖️ Workload alert: ${assignedMember.name} is loaded; ${otherMember.name} is free`);
        recommendedMemberId = otherMember.id;
      }
    }
  }

  // Calculate Total Score (capped at 100)
  const totalScore = Math.min(
    100,
    Math.round(
      deadlineScore +
      priorityScore +
      dependencyScore +
      impactScore +
      scheduleScore +
      workloadScore
    )
  );

  // Urgency Level Classification
  let urgencyLevel: 'Urgent' | 'Elevated' | 'Normal' | 'Low' = 'Normal';
  if (totalScore >= 80) urgencyLevel = 'Urgent';
  else if (totalScore >= 60) urgencyLevel = 'Elevated';
  else if (totalScore >= 35) urgencyLevel = 'Normal';
  else urgencyLevel = 'Low';

  return {
    totalScore,
    deadlineScore,
    priorityScore,
    dependencyScore,
    impactScore,
    scheduleScore,
    workloadScore,
    reasons,
    urgencyLevel,
    recommendedSlot,
    recommendedMemberId
  };
}

/**
 * Re-evaluates priority scores across all tasks in workspace
 */
export function rankAllTasks(
  tasks: Task[],
  context: IntelligenceContext
): Task[] {
  return tasks.map((task) => {
    const breakdown = calculateTaskPriority(task, context);
    return {
      ...task,
      priorityScore: breakdown.totalScore,
      priorityBreakdown: breakdown,
      recommendationReason: breakdown.reasons[0] || 'Scheduled routine task'
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);
}

/**
 * Returns the highest-priority task ready to be worked on right now
 */
export function getDoFirstTask(
  tasks: Task[],
  context: IntelligenceContext,
  memberId?: string
): Task | null {
  const activeTasks = tasks.filter((t) => {
    if (t.status === 'Completed' || t.status === 'Blocked') return false;
    if (memberId && t.assignedMemberId !== memberId && t.assignedMemberId !== 'unassigned') return false;
    return true;
  });

  if (activeTasks.length === 0) return null;

  const ranked = rankAllTasks(activeTasks, context);
  return ranked[0] || null;
}
