import {
  Project,
  Task,
  TeamMember,
  ScheduleEvent,
  StudySubject,
  StudyTask,
  Idea,
  Notification,
  ActivityLog,
  ProjectDocument,
  ProjectDiagram,
  ProjectResearch,
  ProjectResource,
  ProjectFile
} from '@kavexa/shared-types';

export const SEED_MEMBERS: TeamMember[] = [];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj_sample_1',
    name: 'Sample Project',
    description: 'This is a sample project to get you started',
    objective: 'Complete the initial setup and configuration',
    status: 'In Progress',
    priority: 'High',
    startDate: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    progress: 25,
    assignedMemberIds: [],
    taskIds: [],
    dependencies: [],
    media: [],
    notes: [],
    ideas: [],
    health: {
      status: 'Healthy',
      score: 85,
      factors: {
        deadlineProximity: 'Safe',
        progressRate: 25,
        remainingTasksCount: 3,
        blockedTasksCount: 0,
        overdueTasksCount: 0
      },
      warnings: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    accentColor: '#3b82f6'
  }
];

export const SEED_TASKS: Task[] = [];
export const SEED_SCHEDULE: ScheduleEvent[] = [];
export const SEED_SUBJECTS: StudySubject[] = [];
export const SEED_STUDY_TASKS: StudyTask[] = [];
export const SEED_IDEAS: Idea[] = [];
export const SEED_NOTIFICATIONS: Notification[] = [];
export const SEED_ACTIVITY: ActivityLog[] = [];
export const SEED_DOCUMENTS: ProjectDocument[] = [];
export const SEED_DIAGRAMS: ProjectDiagram[] = [];
export const SEED_RESEARCH: ProjectResearch[] = [];
export const SEED_RESOURCES: ProjectResource[] = [];
export const SEED_FILES: ProjectFile[] = [];
