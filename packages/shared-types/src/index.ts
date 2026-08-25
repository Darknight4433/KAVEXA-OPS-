// KAVEXA OPS - Master Shared Types & Domain Models

export type TaskCategory = 'KAVEXA Work' | 'Study' | 'Personal';
export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Not Started' | 'Ready to Start' | 'In Progress' | 'Waiting' | 'Blocked' | 'Review' | 'Completed';
export type ImpactLevel = 'High' | 'Medium' | 'Low';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface PriorityBreakdown {
  totalScore: number;          // 0 to 100
  deadlineScore: number;       // 0 to 30 (30% weight)
  priorityScore: number;       // 0 to 20 (20% weight)
  dependencyScore: number;     // 0 to 15 (15% weight)
  impactScore: number;         // 0 to 15 (15% weight)
  scheduleScore: number;       // 0 to 10 (10% weight)
  workloadScore: number;       // 0 to 10 (10% weight)
  reasons: string[];           // Human-readable rationale bullets
  urgencyLevel: 'Urgent' | 'Elevated' | 'Normal' | 'Low';
  recommendedSlot?: string;    // e.g. "Today at 2:00 PM - 3:30 PM"
  recommendedMemberId?: string; // Best person for this task
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  assignedMemberId: string;
  projectId?: string;
  studySubjectId?: string;
  deadline: string;             // ISO string or YYYY-MM-DD
  estimatedDuration: number;    // In minutes
  actualDuration?: number;      // In minutes
  dependencies: string[];       // Array of Task IDs that MUST be completed before this task
  blockedBy?: string[];         // Active uncompleted dependency task IDs
  blocksTasks?: string[];       // Tasks that depend on this task
  impactLevel: ImpactLevel;
  difficultyLevel: DifficultyLevel;
  priorityScore: number;        // Calculated priority score (0-100)
  priorityBreakdown: PriorityBreakdown;
  recommendationReason: string;
  createdAt: string;
  completedAt?: string;
  tags?: string[];
  // Resource Linking
  linkedDocumentIds?: string[];
  linkedDiagramIds?: string[];
  linkedResearchIds?: string[];
  linkedResourceIds?: string[];
}

export type ProjectStatus = 'Idea' | 'Planning' | 'Pending' | 'In Progress' | 'Review' | 'Completed' | 'On Hold';
export type ProjectHealthStatus = 'Healthy' | 'At Risk' | 'Critical';

export interface HealthAssessment {
  status: ProjectHealthStatus;
  score: number;               // 0 to 100 health score
  factors: {
    deadlineProximity: 'Safe' | 'Approaching' | 'Critical';
    progressRate: number;      // 0 to 100
    remainingTasksCount: number;
    blockedTasksCount: number;
    overdueTasksCount: number;
  };
  warnings: string[];
}

export interface CloudinaryMedia {
  publicId: string;
  secureUrl: string;
  resourceType: 'image' | 'video' | 'raw';
  width?: number;
  height?: number;
  format?: string;
  caption?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ProjectNote {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  objective: string;
  status: ProjectStatus;
  priority: TaskPriority;
  startDate: string;
  deadline: string;
  progress: number;            // 0 to 100 percentage
  assignedMemberIds: string[];
  taskIds: string[];
  dependencies: string[];      // Dependent Project IDs
  media: CloudinaryMedia[];
  notes: ProjectNote[];
  ideas: string[];             // Linked Idea IDs
  health: HealthAssessment;
  createdAt: string;
  updatedAt: string;
  accentColor?: string;
  githubUrl?: string;
  websiteUrl?: string;
  figmaUrl?: string;
}

// -------------------------------------------------------------
// PROJECT KNOWLEDGE HUB TYPES
// -------------------------------------------------------------

export type DocumentType =
  | 'PRD'
  | 'Problem Statement'
  | 'Solution Document'
  | 'Implementation Plan'
  | 'Technical Documentation'
  | 'Meeting Notes'
  | 'Pitch Content'
  | 'Project Proposal'
  | 'Other';

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  documentType: DocumentType;
  description: string;
  content: string;             // Markdown content
  fileUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  linkedTaskIds?: string[];
}

export type DiagramType =
  | 'System Architecture'
  | 'Database Diagram'
  | 'User Flow'
  | 'Process Flow'
  | 'Wireframe'
  | 'Mind Map'
  | 'Other';

export interface ProjectDiagram {
  id: string;
  projectId: string;
  title: string;
  diagramType: DiagramType;
  description: string;
  imageUrl: string;
  publicId?: string;
  createdBy: string;
  createdAt: string;
  tags: string[];
  linkedTaskIds?: string[];
}

export type ResearchCategory =
  | 'Problem Research'
  | 'Competitor Research'
  | 'Technology Research'
  | 'Market Research'
  | 'User Research'
  | 'Reference Material'
  | 'Other';

export interface ProjectResearch {
  id: string;
  projectId: string;
  title: string;
  category: ResearchCategory;
  summary: string;
  sourceUrl?: string;
  notes: string;
  createdBy: string;
  createdAt: string;
  tags: string[];
  linkedTaskIds?: string[];
}

export type ResourceType =
  | 'GitHub Repository'
  | 'Project Website'
  | 'Live Demo'
  | 'Figma Design'
  | 'Presentation'
  | 'Documentation'
  | 'API'
  | 'External Tool'
  | 'Reference Website'
  | 'Other';

export interface ProjectResource {
  id: string;
  projectId: string;
  title: string;
  resourceType: ResourceType;
  description: string;
  url: string;
  icon?: string;
  isPinned?: boolean;
  createdBy: string;
  createdAt: string;
  tags: string[];
  linkedTaskIds?: string[];
}

export type ProjectFileType = 'PDF' | 'DOCX' | 'PPTX' | 'Image' | 'Screenshot' | 'Project Asset' | 'Other';

export interface ProjectFile {
  id: string;
  projectId: string;
  fileName: string;
  fileType: ProjectFileType;
  fileUrl: string;
  fileSize?: string;
  publicId?: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
}

export type ProjectActivityType =
  | 'Project created'
  | 'Task created'
  | 'Task completed'
  | 'Task updated'
  | 'Document created'
  | 'Resource added'
  | 'File uploaded'
  | 'Diagram uploaded'
  | 'Research added'
  | 'Project status changed';

export interface ProjectActivity {
  id: string;
  projectId: string;
  activityType: ProjectActivityType;
  description: string;
  performedBy: string;
  timestamp: string;
  relatedEntityId?: string;
}

// -------------------------------------------------------------
// TEAM & SCHEDULE TYPES
// -------------------------------------------------------------

export type AvailabilityStatus = 'Available' | 'Busy' | 'Studying' | 'School' | 'Offline';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
  availability: AvailabilityStatus;
  currentTaskId?: string;
  weeklyWorkloadHours: number;
  assignedTasksCount: number;
  completedTasksCount: number;
  skills: string[];
  todayFreeSlots: { start: string; end: string }[];
  themePreference?: string;
  bio?: string;
  focusDomain?: string;
  university?: string;
  currentProjectId?: string;
  totalHoursSpent?: number;
  activeCodingHoursToday?: number;
}

export type EventType = 'School' | 'Study' | 'KAVEXA Work' | 'Meeting' | 'Deadline' | 'Personal';

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  startTime: string;           // ISO string or HH:MM on a date
  endTime: string;             // ISO string or HH:MM on a date
  date: string;                // YYYY-MM-DD
  memberId: string;            // 'all' or specific memberId
  linkedTaskId?: string;
  linkedProjectId?: string;
  location?: string;
  isRecurring?: boolean;
}

export interface StudySubject {
  id: string;
  name: string;
  code: string;
  instructor?: string;
  color: string;
  credits: number;
  weeklyHours: number;
  memberId?: string;
}

export type StudyTaskType = 'Homework' | 'Exam' | 'Revision' | 'Assignment' | 'Project';

export interface StudyTask {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  type: StudyTaskType;
  deadline: string;
  priority: TaskPriority;
  estimatedStudyTime: number;  // in minutes
  isCompleted: boolean;
  score?: number;              // Grade/Score if applicable
  examDate?: string;
  completedAt?: string;
  memberId?: string;
}

export type IdeaStatus = 'New' | 'Exploring' | 'Planning' | 'Converted to Project' | 'Archived';

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  createdBy: string;
  createdAt: string;
  potentialImpact: 'High' | 'Medium' | 'Low';
  notes: string;
  status: IdeaStatus;
  convertedProjectId?: string;
  media?: CloudinaryMedia[];
  tags: string[];
}

export type NotificationType = 'deadline' | 'blocked_task' | 'unblocked_task' | 'task_assigned' | 'schedule_conflict' | 'team_sync';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  urgency: 'high' | 'medium' | 'low';
  read: boolean;
  createdAt: string;
  actionPath?: string;
  entityId?: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: 'task' | 'project' | 'study' | 'idea' | 'schedule';
  targetTitle: string;
  timestamp: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  activeWorkspaceId: string;
  role: string;
  profileImage?: string;
  preferences: {
    theme: 'dark' | 'obsidian' | 'cyber';
    dailyFocusLimit: number;
    notificationsEnabled: boolean;
  };
}

export interface Workspace {
  id: string;
  name: string;
  tagline: string;
  ownerId: string;
  memberIds: string[];
}
