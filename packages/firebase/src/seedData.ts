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

export const SEED_MEMBERS: TeamMember[] = [
  {
    id: 'member_vaish',
    name: 'Vaishnavi L.',
    role: 'Founder & Technical Lead',
    email: 'vaish@kavexa.io',
    avatarUrl: '/app-icon.png',
    availability: 'Available',
    weeklyWorkloadHours: 0,
    assignedTasksCount: 0,
    completedTasksCount: 0,
    skills: ['System Architecture', 'Product', 'Engineering'],
    todayFreeSlots: [
      { start: '09:00', end: '13:00' },
      { start: '14:00', end: '19:00' }
    ]
  }
];

export const SEED_PROJECTS: Project[] = [];
export const SEED_TASKS: Task[] = [];
export const SEED_SCHEDULE: ScheduleEvent[] = [];
export const SEED_SUBJECTS: StudySubject[] = [];
export const SEED_STUDY_TASKS: StudyTask[] = [];
export const SEED_IDEAS: Idea[] = [];
export const SEED_NOTIFICATIONS: Notification[] = [];
export const SEED_ACTIVITY: ActivityLog[] = [
  {
    id: 'act_init',
    actorId: 'member_vaish',
    actorName: 'Vaishnavi L.',
    action: 'Initialized KAVEXA OPS workspace',
    targetType: 'task',
    targetTitle: 'KAVEXA Core',
    timestamp: new Date().toISOString()
  }
];
export const SEED_DOCUMENTS: ProjectDocument[] = [];
export const SEED_DIAGRAMS: ProjectDiagram[] = [];
export const SEED_RESEARCH: ProjectResearch[] = [];
export const SEED_RESOURCES: ProjectResource[] = [];
export const SEED_FILES: ProjectFile[] = [];
