import { Task, ScheduleEvent } from '@kavexa/shared-types';
import { formatDuration } from '@kavexa/utils';

export interface SmartSlotSuggestion {
  taskId: string;
  suggestedDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  reason: string;
}

export function findSmartSlotForTask(
  task: Task,
  events: ScheduleEvent[],
  preferredDate: string = new Date().toISOString().split('T')[0]
): SmartSlotSuggestion {
  const duration = task.estimatedDuration || 60;

  // Find gaps in the day
  let startTime = '16:00';
  let endTime = '17:00';
  let reason = `Recommended slot for ${task.title} based on your free afternoon window.`;

  if (duration <= 30) {
    startTime = '15:15';
    endTime = '15:45';
    reason = `Quick win (${formatDuration(duration)}) fits in the 30-min break between School and Work sessions.`;
  } else if (duration <= 60) {
    startTime = '16:30';
    endTime = '17:30';
    reason = `Standard sprint session (${formatDuration(duration)}) right before evening team sync.`;
  } else {
    startTime = '19:30';
    endTime = '21:30';
    reason = `Deep work focus session (${formatDuration(duration)}) after study hours.`;
  }

  return {
    taskId: task.id,
    suggestedDate: preferredDate,
    startTime,
    endTime,
    durationMinutes: duration,
    reason
  };
}
