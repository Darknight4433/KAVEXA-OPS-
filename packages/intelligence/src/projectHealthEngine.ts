import { Project, Task, HealthAssessment, ProjectHealthStatus } from '@kavexa/shared-types';
import { getDaysUntil } from '@kavexa/utils';

export function evaluateProjectHealth(
  project: Project,
  projectTasks: Task[]
): HealthAssessment {
  const warnings: string[] = [];
  const daysUntilDeadline = getDaysUntil(project.deadline);

  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((t) => t.status === 'Completed').length;
  const blockedTasks = projectTasks.filter((t) => t.status === 'Blocked').length;
  const overdueTasks = projectTasks.filter(
    (t) => t.status !== 'Completed' && getDaysUntil(t.deadline) < 0
  ).length;

  const progressRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : project.progress;

  let deadlineProximity: 'Safe' | 'Approaching' | 'Critical' = 'Safe';
  if (daysUntilDeadline < 0) {
    deadlineProximity = 'Critical';
    warnings.push(`Project deadline passed ${Math.abs(daysUntilDeadline)} days ago!`);
  } else if (daysUntilDeadline <= 3) {
    deadlineProximity = 'Critical';
    warnings.push(`Deadline is in ${daysUntilDeadline} day(s)`);
  } else if (daysUntilDeadline <= 7) {
    deadlineProximity = 'Approaching';
    warnings.push(`Deadline is in 1 week`);
  }

  if (blockedTasks > 0) {
    warnings.push(`${blockedTasks} task(s) currently blocked by dependencies`);
  }

  if (overdueTasks > 0) {
    warnings.push(`${overdueTasks} internal task(s) overdue`);
  }

  // Calculate Health Score (0 to 100)
  let healthScore = 100;

  // Penalties
  if (deadlineProximity === 'Critical' && progressRate < 80) healthScore -= 35;
  else if (deadlineProximity === 'Approaching' && progressRate < 50) healthScore -= 20;

  healthScore -= blockedTasks * 10;
  healthScore -= overdueTasks * 15;

  if (progressRate === 100) healthScore = 100;
  healthScore = Math.max(10, Math.min(100, healthScore));

  let status: ProjectHealthStatus = 'Healthy';
  if (healthScore < 45 || deadlineProximity === 'Critical' && progressRate < 60) {
    status = 'Critical';
  } else if (healthScore < 75 || blockedTasks > 1 || overdueTasks > 0) {
    status = 'At Risk';
  }

  return {
    status,
    score: healthScore,
    factors: {
      deadlineProximity,
      progressRate,
      remainingTasksCount: totalTasks - completedTasks,
      blockedTasksCount: blockedTasks,
      overdueTasksCount: overdueTasks
    },
    warnings
  };
}
