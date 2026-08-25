import { Task } from '@kavexa/shared-types';

export interface DependencyStatusResult {
  updatedTasks: Task[];
  unblockedTaskTitles: string[];
}

/**
 * Validates dependencies and updates status:
 * - If any prerequisite task is not 'Completed', task is set to 'Blocked'
 * - If all prerequisites are 'Completed', task is moved to 'Ready to Start' (if previously Blocked)
 * - Tracks blockedBy and blocksTasks arrays
 */
export function resolveTaskDependencies(tasks: Task[]): DependencyStatusResult {
  const taskMap = new Map<string, Task>();
  tasks.forEach((t) => taskMap.set(t.id, { ...t }));

  const unblockedTaskTitles: string[] = [];

  // Pass 1: compute blocksTasks for each task
  taskMap.forEach((task) => {
    task.blocksTasks = [];
    task.blockedBy = [];
  });

  taskMap.forEach((task) => {
    if (task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach((depId) => {
        const depTask = taskMap.get(depId);
        if (depTask) {
          if (!depTask.blocksTasks) depTask.blocksTasks = [];
          if (!depTask.blocksTasks.includes(task.id)) {
            depTask.blocksTasks.push(task.id);
          }

          if (depTask.status !== 'Completed') {
            if (!task.blockedBy) task.blockedBy = [];
            task.blockedBy.push(depId);
          }
        }
      });
    }
  });

  // Pass 2: check and update status
  taskMap.forEach((task) => {
    if (task.status === 'Completed') return;

    const hasUnresolvedDeps = task.blockedBy && task.blockedBy.length > 0;

    if (hasUnresolvedDeps) {
      task.status = 'Blocked';
    } else if (task.status === 'Blocked' && !hasUnresolvedDeps) {
      task.status = 'Ready to Start';
      unblockedTaskTitles.push(task.title);
    }
  });

  return {
    updatedTasks: Array.from(taskMap.values()),
    unblockedTaskTitles
  };
}

/**
 * Detects if adding a dependency from taskId -> targetDependencyId would create a cycle
 */
export function wouldCreateDependencyCycle(
  tasks: Task[],
  taskId: string,
  targetDependencyId: string
): boolean {
  if (taskId === targetDependencyId) return true;

  const visited = new Set<string>();
  const queue = [targetDependencyId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === taskId) return true;

    if (!visited.has(current)) {
      visited.add(current);
      const currentTask = tasks.find((t) => t.id === current);
      if (currentTask && currentTask.dependencies) {
        queue.push(...currentTask.dependencies);
      }
    }
  }

  return false;
}
