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
import {
  SEED_PROJECTS,
  SEED_TASKS,
  SEED_MEMBERS,
  SEED_SCHEDULE,
  SEED_SUBJECTS,
  SEED_STUDY_TASKS,
  SEED_IDEAS,
  SEED_NOTIFICATIONS,
  SEED_ACTIVITY,
  SEED_DOCUMENTS,
  SEED_DIAGRAMS,
  SEED_RESEARCH,
  SEED_RESOURCES,
  SEED_FILES
} from './seedData';
import {
  rankAllTasks,
  resolveTaskDependencies,
  evaluateProjectHealth
} from '@kavexa/intelligence';
import { generateId } from '@kavexa/utils';

import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './config';

type Listener = () => void;

class WorkspaceFirestoreStore {
  private projects: Project[] = [];
  private tasks: Task[] = [];
  private members: TeamMember[] = [];
  private schedules: ScheduleEvent[] = [];
  private subjects: StudySubject[] = [];
  private studyTasks: StudyTask[] = [];
  private ideas: Idea[] = [];
  private notifications: Notification[] = [];
  private activityLogs: ActivityLog[] = [];
  private documents: ProjectDocument[] = [];
  private diagrams: ProjectDiagram[] = [];
  private research: ProjectResearch[] = [];
  private resources: ProjectResource[] = [];
  private files: ProjectFile[] = [];

  private listeners: Set<Listener> = new Set();
  private storageKey = 'kavexa_ops_workspace_v3_clean';
  private firestoreDocName = 'kavexa_main';
  private isSyncingFromCloud = false;
  private hasLoadedInitialData = false;

  constructor() {
    this.loadState();
    this.recomputeSystemIntelligence();
    this.initRealtimeFirestoreSync();
  }

  public isInitialized(): boolean {
    return this.hasLoadedInitialData;
  }

  private initRealtimeFirestoreSync() {
    try {
      if (db) {
        const workspaceDocRef = doc(db, 'workspaces', this.firestoreDocName);
        onSnapshot(
          workspaceDocRef,
          (docSnap) => {
            this.hasLoadedInitialData = true;
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data) {
                this.isSyncingFromCloud = true;
                if (Array.isArray(data.projects)) this.projects = data.projects;
                if (Array.isArray(data.tasks)) this.tasks = data.tasks;
                if (Array.isArray(data.members)) this.members = data.members;
                if (Array.isArray(data.schedules)) this.schedules = data.schedules;
                if (Array.isArray(data.subjects)) this.subjects = data.subjects;
                if (Array.isArray(data.studyTasks)) this.studyTasks = data.studyTasks;
                if (Array.isArray(data.ideas)) this.ideas = data.ideas;
                if (Array.isArray(data.notifications)) this.notifications = data.notifications;
                if (Array.isArray(data.activityLogs)) this.activityLogs = data.activityLogs;
                if (Array.isArray(data.documents)) this.documents = data.documents;
                if (Array.isArray(data.diagrams)) this.diagrams = data.diagrams;
                if (Array.isArray(data.research)) this.research = data.research;
                if (Array.isArray(data.resources)) this.resources = data.resources;
                if (Array.isArray(data.files)) this.files = data.files;

                this.recomputeSystemIntelligence();
                this.saveToLocalCache();
                this.notify();
                this.isSyncingFromCloud = false;
              }
            } else {
              this.notify();
            }
          },
          (error) => {
            this.hasLoadedInitialData = true;
            console.warn('[Firestore] Live listener notice:', error.message);
            this.notify();
          }
        );
      } else {
        this.hasLoadedInitialData = true;
      }
    } catch (e) {
      this.hasLoadedInitialData = true;
      console.warn('[Firestore] Real-time sync init error:', e);
    }
  }

  private loadState() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(this.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.projects = parsed.projects || SEED_PROJECTS;
          this.tasks = parsed.tasks || SEED_TASKS;
          this.members = parsed.members || SEED_MEMBERS;
          this.schedules = parsed.schedules || SEED_SCHEDULE;
          this.subjects = parsed.subjects || SEED_SUBJECTS;
          this.studyTasks = parsed.studyTasks || SEED_STUDY_TASKS;
          this.ideas = parsed.ideas || SEED_IDEAS;
          this.notifications = parsed.notifications || SEED_NOTIFICATIONS;
          this.activityLogs = parsed.activityLogs || SEED_ACTIVITY;
          this.documents = parsed.documents || SEED_DOCUMENTS;
          this.diagrams = parsed.diagrams || SEED_DIAGRAMS;
          this.research = parsed.research || SEED_RESEARCH;
          this.resources = parsed.resources || SEED_RESOURCES;
          this.files = parsed.files || SEED_FILES;
          return;
        }
      }
    } catch (e) {
      console.warn('LocalStorage error, using seed data:', e);
    }
    this.resetToDefaults();
  }

  private saveToLocalCache() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const payload = {
          projects: this.projects,
          tasks: this.tasks,
          members: this.members,
          schedules: this.schedules,
          subjects: this.subjects,
          studyTasks: this.studyTasks,
          ideas: this.ideas,
          notifications: this.notifications,
          activityLogs: this.activityLogs,
          documents: this.documents,
          diagrams: this.diagrams,
          research: this.research,
          resources: this.resources,
          files: this.files
        };
        window.localStorage.setItem(this.storageKey, JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Cache write notice:', e);
    }
  }

  public saveState() {
    this.saveToLocalCache();

    // Live Cloud Firestore sync
    if (!this.isSyncingFromCloud && db) {
      try {
        const rawPayload = {
          projects: this.projects,
          tasks: this.tasks,
          members: this.members,
          schedules: this.schedules,
          subjects: this.subjects,
          studyTasks: this.studyTasks,
          ideas: this.ideas,
          notifications: this.notifications,
          activityLogs: this.activityLogs,
          documents: this.documents,
          diagrams: this.diagrams,
          research: this.research,
          resources: this.resources,
          files: this.files,
          lastUpdated: new Date().toISOString()
        };
        // Firestore rejects undefined fields; JSON stringify/parse strips all undefined values
        const sanitizedPayload = JSON.parse(JSON.stringify(rawPayload));
        const workspaceDocRef = doc(db, 'workspaces', this.firestoreDocName);
        setDoc(workspaceDocRef, sanitizedPayload, { merge: true })
          .then(() => {
            console.log('[Firestore] Successfully synced workspace state to cloud.');
          })
          .catch((err) => {
            console.warn('[Firestore] Cloud sync write notice:', err);
          });
      } catch (err) {
        console.warn('[Firestore] Cloud sync error:', err);
      }
    }

    this.notify();
  }

  public resetToDefaults() {
    this.projects = JSON.parse(JSON.stringify(SEED_PROJECTS));
    this.tasks = JSON.parse(JSON.stringify(SEED_TASKS));
    this.members = JSON.parse(JSON.stringify(SEED_MEMBERS));
    this.schedules = JSON.parse(JSON.stringify(SEED_SCHEDULE));
    this.subjects = JSON.parse(JSON.stringify(SEED_SUBJECTS));
    this.studyTasks = JSON.parse(JSON.stringify(SEED_STUDY_TASKS));
    this.ideas = JSON.parse(JSON.stringify(SEED_IDEAS));
    this.notifications = JSON.parse(JSON.stringify(SEED_NOTIFICATIONS));
    this.activityLogs = JSON.parse(JSON.stringify(SEED_ACTIVITY));
    this.documents = JSON.parse(JSON.stringify(SEED_DOCUMENTS));
    this.diagrams = JSON.parse(JSON.stringify(SEED_DIAGRAMS));
    this.research = JSON.parse(JSON.stringify(SEED_RESEARCH));
    this.resources = JSON.parse(JSON.stringify(SEED_RESOURCES));
    this.files = JSON.parse(JSON.stringify(SEED_FILES));
    this.recomputeSystemIntelligence();
    this.saveState();
  }

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  /**
   * Runs dependency resolution, re-scores all tasks with Priority Engine,
   * and recalculates project health scores.
   */
  public recomputeSystemIntelligence() {
    // 1. Resolve task dependencies & auto-blocking
    const { updatedTasks, unblockedTaskTitles } = resolveTaskDependencies(this.tasks);
    this.tasks = updatedTasks;

    // Trigger notification if any task unblocked
    if (unblockedTaskTitles.length > 0) {
      unblockedTaskTitles.forEach((title) => {
        this.notifications.unshift({
          id: generateId('notif'),
          title: '🔓 Task Unblocked',
          message: `Prerequisites completed: "${title}" is now Ready to Start!`,
          type: 'unblocked_task',
          urgency: 'medium',
          read: false,
          createdAt: new Date().toISOString()
        });
      });
    }

    // 2. Re-score priority for all tasks
    const context = {
      allTasks: this.tasks,
      projects: this.projects,
      members: this.members,
      schedules: this.schedules
    };
    this.tasks = rankAllTasks(this.tasks, context);

    // 3. Update project progress & health assessments
    this.projects = this.projects.map((proj) => {
      const projTasks = this.tasks.filter((t) => t.projectId === proj.id);
      const total = projTasks.length;
      const completed = projTasks.filter((t) => t.status === 'Completed').length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : proj.progress;
      const health = evaluateProjectHealth(proj, projTasks);
      return {
        ...proj,
        progress,
        health,
        taskIds: projTasks.map((t) => t.id)
      };
    });
  }

  // --- GETTERS ---
  public getProjects(): Project[] { return [...this.projects]; }
  public getTasks(): Task[] { return [...this.tasks]; }
  public getMembers(): TeamMember[] { return [...this.members]; }
  public getSchedules(): ScheduleEvent[] { return [...this.schedules]; }
  public getSubjects(): StudySubject[] { return [...this.subjects]; }
  public getStudyTasks(): StudyTask[] { return [...this.studyTasks]; }
  public getIdeas(): Idea[] { return [...this.ideas]; }
  public getNotifications(): Notification[] { return [...this.notifications]; }
  public getActivityLogs(): ActivityLog[] { return [...this.activityLogs]; }
  public getDocuments(projectId?: string): ProjectDocument[] {
    if (projectId) return this.documents.filter((d) => d.projectId === projectId);
    return [...this.documents];
  }
  public getDiagrams(projectId?: string): ProjectDiagram[] {
    if (projectId) return this.diagrams.filter((d) => d.projectId === projectId);
    return [...this.diagrams];
  }
  public getResearch(projectId?: string): ProjectResearch[] {
    if (projectId) return this.research.filter((r) => r.projectId === projectId);
    return [...this.research];
  }
  public getResources(projectId?: string): ProjectResource[] {
    if (projectId) return this.resources.filter((r) => r.projectId === projectId);
    return [...this.resources];
  }
  public getFiles(projectId?: string): ProjectFile[] {
    if (projectId) return this.files.filter((f) => f.projectId === projectId);
    return [...this.files];
  }

  // --- ACTIONS: TASKS ---
  public createTask(task: Partial<Task>, actorId = 'current_user', actorName = 'Founder'): Task {
    const newTask: Task = {
      id: generateId('task'),
      title: task.title || 'Untitled Task',
      description: task.description || '',
      category: task.category || 'KAVEXA Work',
      priority: task.priority || 'Medium',
      status: task.status || 'Not Started',
      assignedMemberId: task.assignedMemberId || actorId,
      projectId: task.projectId,
      studySubjectId: task.studySubjectId,
      deadline: task.deadline || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      estimatedDuration: task.estimatedDuration || 60,
      dependencies: task.dependencies || [],
      impactLevel: task.impactLevel || 'Medium',
      difficultyLevel: task.difficultyLevel || 'Medium',
      priorityScore: 50,
      priorityBreakdown: {
        totalScore: 50,
        deadlineScore: 10,
        priorityScore: 10,
        dependencyScore: 5,
        impactScore: 10,
        scheduleScore: 8,
        workloadScore: 7,
        reasons: ['Newly added task'],
        urgencyLevel: 'Normal'
      },
      recommendationReason: 'Newly created task',
      createdAt: new Date().toISOString(),
      tags: task.tags || [],
      linkedDocumentIds: task.linkedDocumentIds || [],
      linkedDiagramIds: task.linkedDiagramIds || [],
      linkedResearchIds: task.linkedResearchIds || [],
      linkedResourceIds: task.linkedResourceIds || []
    };

    this.tasks.push(newTask);
    this.logActivity(actorId, actorName, 'Created new task', 'task', newTask.title);
    this.recomputeSystemIntelligence();
    this.saveState();
    return newTask;
  }

  public updateTask(taskId: string, updates: Partial<Task>, actorId = 'current_user', actorName = 'Founder') {
    const idx = this.tasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      this.tasks[idx] = { ...this.tasks[idx], ...updates };
      this.logActivity(actorId, actorName, 'Updated task', 'task', this.tasks[idx].title);
      this.recomputeSystemIntelligence();
      this.saveState();
    }
  }

  public deleteTask(taskId: string, actorId = 'current_user', actorName = 'Founder') {
    const task = this.tasks.find((t) => t.id === taskId);
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    // Remove from other dependencies
    this.tasks.forEach((t) => {
      if (t.dependencies) {
        t.dependencies = t.dependencies.filter((d) => d !== taskId);
      }
    });
    if (task) {
      this.logActivity(actorId, actorName, 'Deleted task', 'task', task.title);
    }
    this.recomputeSystemIntelligence();
    this.saveState();
  }

  public toggleTaskComplete(taskId: string, actorId = 'current_user', actorName = 'Founder') {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;
    const isDone = task.status === 'Completed';
    task.status = isDone ? 'In Progress' : 'Completed';
    task.completedAt = isDone ? undefined : new Date().toISOString();

    this.logActivity(
      actorId,
      actorName,
      isDone ? 'Reopened task' : 'Completed task',
      'task',
      task.title
    );

    this.recomputeSystemIntelligence();
    this.saveState();
  }

  // --- ACTIONS: PROJECTS ---
  public createProject(project: Partial<Project>, actorId = 'current_user', actorName = 'Founder'): Project {
    const newProj: Project = {
      id: generateId('proj'),
      name: project.name || 'New Project',
      description: project.description || '',
      objective: project.objective || '',
      status: project.status || 'Planning',
      priority: project.priority || 'High',
      startDate: project.startDate || new Date().toISOString().split('T')[0],
      deadline: project.deadline || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      progress: 0,
      assignedMemberIds: project.assignedMemberIds || [actorId],
      taskIds: [],
      dependencies: [],
      media: project.media || [],
      notes: [],
      ideas: [],
      health: {
        status: 'Healthy',
        score: 100,
        factors: {
          deadlineProximity: 'Safe',
          progressRate: 0,
          remainingTasksCount: 0,
          blockedTasksCount: 0,
          overdueTasksCount: 0
        },
        warnings: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accentColor: project.accentColor || '#6366f1',
      githubUrl: project.githubUrl,
      websiteUrl: project.websiteUrl,
      figmaUrl: project.figmaUrl
    };

    this.projects.push(newProj);
    this.logActivity(actorId, actorName, 'Created new project', 'project', newProj.name);
    this.recomputeSystemIntelligence();
    this.saveState();
    return newProj;
  }

  public updateProject(projectId: string, updates: Partial<Project>) {
    const idx = this.projects.findIndex((p) => p.id === projectId);
    if (idx !== -1) {
      this.projects[idx] = { ...this.projects[idx], ...updates, updatedAt: new Date().toISOString() };
      this.recomputeSystemIntelligence();
      this.saveState();
    }
  }

  public deleteProject(projectId: string) {
    const proj = this.projects.find((p) => p.id === projectId);
    this.projects = this.projects.filter((p) => p.id !== projectId);
    // clean tasks
    this.tasks = this.tasks.filter((t) => t.projectId !== projectId);
    if (proj) {
      this.logActivity('member_vaish', 'Vaish', 'Deleted project', 'project', proj.name);
    }
    this.recomputeSystemIntelligence();
    this.saveState();
  }

  // --- ACTIONS: KNOWLEDGE HUB (Documents, Diagrams, Research, Resources, Files) ---
  public createDocument(doc: Partial<ProjectDocument>): ProjectDocument {
    const newDoc: ProjectDocument = {
      id: generateId('doc'),
      projectId: doc.projectId || this.projects[0]?.id || 'proj_stageflow',
      title: doc.title || 'Untitled Document',
      documentType: doc.documentType || 'PRD',
      description: doc.description || '',
      content: doc.content || '# ' + (doc.title || 'Document Content'),
      fileUrl: doc.fileUrl,
      createdBy: doc.createdBy || 'Vaish',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: doc.tags || [],
      linkedTaskIds: doc.linkedTaskIds || []
    };
    this.documents.push(newDoc);
    this.logActivity('member_vaish', 'Vaish', 'Created document in project', 'project', newDoc.title);
    this.saveState();
    return newDoc;
  }

  public updateDocument(docId: string, updates: Partial<ProjectDocument>) {
    const idx = this.documents.findIndex((d) => d.id === docId);
    if (idx !== -1) {
      this.documents[idx] = { ...this.documents[idx], ...updates, updatedAt: new Date().toISOString() };
      this.saveState();
    }
  }

  public deleteDocument(docId: string) {
    this.documents = this.documents.filter((d) => d.id !== docId);
    this.saveState();
  }

  public createDiagram(diag: Partial<ProjectDiagram>): ProjectDiagram {
    const newDiag: ProjectDiagram = {
      id: generateId('diag'),
      projectId: diag.projectId || this.projects[0]?.id || 'proj_stageflow',
      title: diag.title || 'Architecture Diagram',
      diagramType: diag.diagramType || 'System Architecture',
      description: diag.description || '',
      imageUrl: diag.imageUrl || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80',
      publicId: diag.publicId,
      createdBy: diag.createdBy || 'Vaish',
      createdAt: new Date().toISOString(),
      tags: diag.tags || [],
      linkedTaskIds: diag.linkedTaskIds || []
    };
    this.diagrams.push(newDiag);
    this.logActivity('member_vaish', 'Vaish', 'Uploaded diagram to project', 'project', newDiag.title);
    this.saveState();
    return newDiag;
  }

  public updateDiagram(diagId: string, updates: Partial<ProjectDiagram>) {
    const diag = this.diagrams.find((d) => d.id === diagId);
    if (diag) {
      Object.assign(diag, updates);
      this.saveState();
    }
  }

  public deleteDiagram(diagId: string) {
    this.diagrams = this.diagrams.filter((d) => d.id !== diagId);
    this.saveState();
  }

  public createResearch(res: Partial<ProjectResearch>): ProjectResearch {
    const newRes: ProjectResearch = {
      id: generateId('res'),
      projectId: res.projectId || this.projects[0]?.id || 'proj_stageflow',
      title: res.title || 'Market & Tech Research',
      category: res.category || 'Technology Research',
      summary: res.summary || '',
      sourceUrl: res.sourceUrl,
      notes: res.notes || '',
      createdBy: res.createdBy || 'Alex M.',
      createdAt: new Date().toISOString(),
      tags: res.tags || [],
      linkedTaskIds: res.linkedTaskIds || []
    };
    this.research.push(newRes);
    this.logActivity('member_alex', 'Alex M.', 'Added research note to project', 'project', newRes.title);
    this.saveState();
    return newRes;
  }

  public deleteResearch(resId: string) {
    this.research = this.research.filter((r) => r.id !== resId);
    this.saveState();
  }

  public createResource(resource: Partial<ProjectResource>): ProjectResource {
    const newResource: ProjectResource = {
      id: generateId('link'),
      projectId: resource.projectId || this.projects[0]?.id || 'proj_stageflow',
      title: resource.title || 'GitHub Repository',
      resourceType: resource.resourceType || 'GitHub Repository',
      description: resource.description || '',
      url: resource.url || 'https://github.com/kavexa',
      icon: resource.icon,
      isPinned: resource.isPinned || false,
      createdBy: resource.createdBy || 'Vaish',
      createdAt: new Date().toISOString(),
      tags: resource.tags || [],
      linkedTaskIds: resource.linkedTaskIds || []
    };
    this.resources.push(newResource);
    this.logActivity('member_vaish', 'Vaish', 'Added external resource link', 'project', newResource.title);
    this.saveState();
    return newResource;
  }

  public togglePinResource(resId: string) {
    const item = this.resources.find((r) => r.id === resId);
    if (item) {
      item.isPinned = !item.isPinned;
      this.saveState();
    }
  }

  public deleteResource(resId: string) {
    this.resources = this.resources.filter((r) => r.id !== resId);
    this.saveState();
  }

  public createFile(file: Partial<ProjectFile>): ProjectFile {
    const newFile: ProjectFile = {
      id: generateId('file'),
      projectId: file.projectId || this.projects[0]?.id || 'proj_stageflow',
      fileName: file.fileName || 'Document.pdf',
      fileType: file.fileType || 'PDF',
      fileUrl: file.fileUrl || 'https://kavexa.io/document.pdf',
      fileSize: file.fileSize || '2.4 MB',
      publicId: file.publicId,
      uploadedBy: file.uploadedBy || 'Vaish',
      uploadedAt: new Date().toISOString(),
      tags: file.tags || []
    };
    this.files.push(newFile);
    this.logActivity('member_vaish', 'Vaish', 'Uploaded file to project', 'project', newFile.fileName);
    this.saveState();
    return newFile;
  }

  public deleteFile(fileId: string) {
    this.files = this.files.filter((f) => f.id !== fileId);
    this.saveState();
  }

  // --- ACTIONS: STUDY & SUBJECTS ---
  public createSubject(subject: Partial<StudySubject>): StudySubject {
    const newSubject: StudySubject = {
      id: generateId('sub'),
      name: subject.name || 'New University Subject',
      code: subject.code || 'CS101',
      instructor: subject.instructor || 'Professor',
      color: subject.color || '#06b6d4',
      credits: subject.credits || 4,
      weeklyHours: subject.weeklyHours || 6,
      memberId: subject.memberId
    };
    this.subjects.push(newSubject);
    this.logActivity('member_vaish', 'Vaish', 'Added university course', 'study', newSubject.name);
    this.saveState();
    return newSubject;
  }

  public deleteSubject(subjectId: string) {
    this.subjects = this.subjects.filter((s) => s.id !== subjectId);
    this.studyTasks = this.studyTasks.filter((t) => t.subjectId !== subjectId);
    this.saveState();
  }

  public toggleStudyTask(taskId: string) {
    const st = this.studyTasks.find((t) => t.id === taskId);
    if (st) {
      st.isCompleted = !st.isCompleted;
      st.completedAt = st.isCompleted ? new Date().toISOString() : undefined;
      this.logActivity('member_vaish', 'Vaish', st.isCompleted ? 'Completed study task' : 'Reopened study task', 'study', st.title);
      this.saveState();
    }
  }

  public deleteStudyTask(taskId: string) {
    this.studyTasks = this.studyTasks.filter((t) => t.id !== taskId);
    this.saveState();
  }

  public createStudyTask(task: Partial<StudyTask>): StudyTask {
    const newTask: StudyTask = {
      id: generateId('st'),
      subjectId: task.subjectId || this.subjects[0]?.id || 'sub_general',
      title: task.title || 'New Study Assignment',
      description: task.description || '',
      type: task.type || 'Homework',
      deadline: task.deadline || new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      priority: task.priority || 'High',
      estimatedStudyTime: task.estimatedStudyTime || 60,
      isCompleted: false,
      examDate: task.examDate,
      memberId: task.memberId
    };
    this.studyTasks.push(newTask);
    this.logActivity('member_vaish', 'Vaish', 'Added new academic study task', 'study', newTask.title);
    this.saveState();
    return newTask;
  }

  // --- ACTIONS: SCHEDULE ---
  public createScheduleEvent(event: Partial<ScheduleEvent>): ScheduleEvent {
    const newEvent: ScheduleEvent = {
      id: generateId('ev'),
      title: event.title || 'Work Session',
      description: event.description || '',
      type: event.type || 'KAVEXA Work',
      startTime: event.startTime || '16:00',
      endTime: event.endTime || '17:30',
      date: event.date || new Date().toISOString().split('T')[0],
      memberId: event.memberId || 'all',
      linkedTaskId: event.linkedTaskId,
      linkedProjectId: event.linkedProjectId,
      location: event.location
    };
    this.schedules.push(newEvent);
    this.logActivity('member_vaish', 'Vaish', 'Scheduled new calendar event', 'schedule', newEvent.title);
    this.saveState();
    return newEvent;
  }

  public deleteScheduleEvent(eventId: string) {
    this.schedules = this.schedules.filter((e) => e.id !== eventId);
    this.saveState();
  }

  // --- ACTIONS: IDEAS & CONVERSION ---
  public createIdea(idea: Partial<Idea>): Idea {
    const newIdea: Idea = {
      id: generateId('idea'),
      title: idea.title || 'New Startup Idea',
      description: idea.description || '',
      category: idea.category || 'Product Feature',
      createdBy: idea.createdBy || 'Vaish',
      createdAt: new Date().toISOString(),
      potentialImpact: idea.potentialImpact || 'High',
      notes: idea.notes || '',
      status: 'New',
      tags: idea.tags || []
    };
    this.ideas.push(newIdea);
    this.logActivity('member_vaish', 'Vaish', 'Logged new idea in Idea Vault', 'idea', newIdea.title);
    this.saveState();
    return newIdea;
  }

  public convertIdeaToProject(ideaId: string): Project {
    const idea = this.ideas.find((i) => i.id === ideaId);
    if (!idea) throw new Error('Idea not found');

    const newProj = this.createProject({
      name: idea.title,
      description: idea.description,
      objective: `Develop concept: ${idea.notes || idea.description}`,
      priority: idea.potentialImpact === 'High' ? 'Critical' : 'High',
      status: 'Planning'
    });

    idea.status = 'Converted to Project';
    idea.convertedProjectId = newProj.id;
    newProj.ideas = [idea.id];

    // Automatically create first starter task
    this.createTask({
      title: `Draft Architecture & PRD for ${newProj.name}`,
      description: `Initial planning milestone converted from Idea Vault concept.`,
      projectId: newProj.id,
      priority: 'High',
      category: 'KAVEXA Work',
      estimatedDuration: 60,
      impactLevel: 'High'
    });

    this.logActivity('member_vaish', 'Vaish', `Converted idea "${idea.title}" into Project "${newProj.name}"`, 'project', newProj.name);
    this.recomputeSystemIntelligence();
    this.saveState();
    return newProj;
  }

  public createMember(member: Partial<TeamMember>): TeamMember {
    const newMember: TeamMember = {
      id: member.id || generateId('member'),
      name: member.name || 'Co-Founder',
      role: member.role || 'Co-Founder',
      email: member.email || 'founder@kavexa.io',
      avatarUrl: member.avatarUrl || '/app-icon.png',
      availability: member.availability || 'Available',
      weeklyWorkloadHours: member.weeklyWorkloadHours || 0,
      assignedTasksCount: 0,
      completedTasksCount: 0,
      skills: member.skills || ['Startup Operations'],
      todayFreeSlots: member.todayFreeSlots || [
        { start: '09:00', end: '12:00' },
        { start: '14:00', end: '18:00' }
      ]
    };
    this.members.push(newMember);
    this.logActivity('system', 'System', `Added team member "${newMember.name}"`, 'task', 'Team');
    this.recomputeSystemIntelligence();
    this.saveState();
    return newMember;
  }

  public deleteMember(memberId: string) {
    this.members = this.members.filter((m) => m.id !== memberId);
    this.recomputeSystemIntelligence();
    this.saveState();
  }

  // --- ACTIONS: MEMBERS & AVAILABILITY ---
  public updateMember(memberId: string, updates: Partial<TeamMember>): TeamMember {
    const member = this.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member not found');
    Object.assign(member, updates);
    this.logActivity(member.id, member.name, `Updated profile & role to "${member.role}"`, 'task', 'Founder Profile');
    this.recomputeSystemIntelligence();
    this.saveState();
    return member;
  }

  public updateMemberAvailability(memberId: string, availability: TeamMember['availability']) {
    const member = this.members.find((m) => m.id === memberId);
    if (member) {
      member.availability = availability;
      this.logActivity(member.id, member.name, `Updated status to "${availability}"`, 'task', 'Team Availability');
      this.recomputeSystemIntelligence();
      this.saveState();
    }
  }

  // --- ACTIONS: NOTIFICATIONS & ACTIVITY ---
  public markNotificationRead(notifId: string) {
    const notif = this.notifications.find((n) => n.id === notifId);
    if (notif) {
      notif.read = true;
      this.saveState();
    }
  }

  public markAllNotificationsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.saveState();
  }

  public logActivity(
    actorId: string,
    actorName: string,
    action: string,
    targetType: ActivityLog['targetType'],
    targetTitle: string
  ) {
    this.activityLogs.unshift({
      id: generateId('act'),
      actorId,
      actorName,
      action,
      targetType,
      targetTitle,
      timestamp: new Date().toISOString()
    });
    if (this.activityLogs.length > 50) {
      this.activityLogs = this.activityLogs.slice(0, 50);
    }
  }

  public clearAllWorkspaceData() {
    this.projects = [];
    this.tasks = [];
    this.documents = [];
    this.diagrams = [];
    this.research = [];
    this.resources = [];
    this.files = [];
    this.ideas = [];
    this.schedules = [];
    this.studyTasks = [];
    this.notifications = [
      {
        id: generateId('notif'),
        title: 'Clean Workspace Initialized',
        message: 'Your KAVEXA OPS workspace is ready for your real projects, tasks, and data.',
        type: 'team_sync',
        urgency: 'low',
        read: false,
        createdAt: new Date().toISOString()
      }
    ];
    this.recomputeSystemIntelligence();
    this.saveState();
  }

  public syncGoogleUser(googleUser: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null }) {
    if (!googleUser.email && !googleUser.uid) return;
    const userEmail = (googleUser.email || '').toLowerCase().trim();
    
    const existingIndex = this.members.findIndex(
      (m) => (m.id && m.id === googleUser.uid) || (userEmail && m.email && m.email.toLowerCase().trim() === userEmail)
    );

    if (existingIndex !== -1) {
      // Update the authentic user profile in-place
      const existing = this.members[existingIndex];
      if (googleUser.displayName) existing.name = googleUser.displayName;
      if (googleUser.email) existing.email = googleUser.email;
      if (googleUser.photoURL) existing.avatarUrl = googleUser.photoURL;
      existing.id = googleUser.uid;
    } else {
      // Create new authentic team member entry
      const newMember: TeamMember = {
        id: googleUser.uid,
        name: googleUser.displayName || googleUser.email?.split('@')[0] || 'Team Member',
        role: this.members.length === 0 ? 'Founder & Lead' : 'Team Member',
        email: googleUser.email || '',
        avatarUrl: googleUser.photoURL || '/app-icon.png',
        availability: 'Available',
        weeklyWorkloadHours: 0,
        assignedTasksCount: 0,
        completedTasksCount: 0,
        skills: ['Operations'],
        todayFreeSlots: [
          { start: '09:00', end: '13:00' },
          { start: '14:00', end: '18:00' }
        ]
      };
      this.members.push(newMember);
    }

    // Deduplicate members cleanly
    const seen = new Set<string>();
    this.members = this.members.filter((m) => {
      const key = (m.id || m.email || m.name).toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    this.saveState();
  }
}

export const workspaceFirestore = new WorkspaceFirestoreStore();
