import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  ProjectFile,
  WorkspaceNotice
} from '@kavexa/shared-types';
import { workspaceFirestore } from '@kavexa/firebase';
import confetti from 'canvas-confetti';

export type NavTab =
  | 'dashboard'
  | 'projects'
  | 'tasks'
  | 'study'
  | 'schedule'
  | 'team'
  | 'ideas'
  | 'analytics';

interface AppContextType {
  // Navigation & View State
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  
  // Active Persona / Founder
  currentMemberId: string;
  setCurrentMemberId: (id: string) => void;
  currentMember: TeamMember;

  // Search & Global Modals
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isMobileSimulatorOpen: boolean;
  setIsMobileSimulatorOpen: (open: boolean) => void;
  isFocusModeOpen: boolean;
  setIsFocusModeOpen: (open: boolean) => void;
  isConfigSettingsOpen: boolean;
  setIsConfigSettingsOpen: (open: boolean) => void;

  // Specific Modals
  isNewTaskModalOpen: boolean;
  setIsNewTaskModalOpen: (open: boolean) => void;
  isNewProjectModalOpen: boolean;
  setIsNewProjectModalOpen: (open: boolean) => void;
  isNewNoticeModalOpen: boolean;
  setIsNewNoticeModalOpen: (open: boolean) => void;
  isNewDocModalOpen: boolean;
  setIsNewDocModalOpen: (open: boolean) => void;
  isNewDiagramModalOpen: boolean;
  setIsNewDiagramModalOpen: (open: boolean) => void;
  isNewResearchModalOpen: boolean;
  setIsNewResearchModalOpen: (open: boolean) => void;
  isNewResourceModalOpen: boolean;
  setIsNewResourceModalOpen: (open: boolean) => void;
  isNewFileModalOpen: boolean;
  setIsNewFileModalOpen: (open: boolean) => void;
  isNewIdeaModalOpen: boolean;
  setIsNewIdeaModalOpen: (open: boolean) => void;
  isConvertIdeaModalOpen: boolean;
  setIsConvertIdeaModalOpen: (open: boolean) => void;
  selectedIdeaId: string | null;
  setSelectedIdeaId: (id: string | null) => void;

  // Data Collections
  projects: Project[];
  tasks: Task[];
  members: TeamMember[];
  schedules: ScheduleEvent[];
  subjects: StudySubject[];
  studyTasks: StudyTask[];
  ideas: Idea[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  documents: ProjectDocument[];
  diagrams: ProjectDiagram[];
  research: ProjectResearch[];
  resources: ProjectResource[];
  files: ProjectFile[];
  notices: WorkspaceNotice[];

  // Mutations
  createTask: (task: Partial<Task>) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;

  createNotice: (notice: Partial<WorkspaceNotice>) => WorkspaceNotice;
  deleteNotice: (noticeId: string) => void;
  togglePinNotice: (noticeId: string) => void;

  createProject: (project: Partial<Project>) => Project;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;

  createDocument: (doc: Partial<ProjectDocument>) => ProjectDocument;
  updateDocument: (docId: string, updates: Partial<ProjectDocument>) => void;
  deleteDocument: (docId: string) => void;

  createDiagram: (diag: Partial<ProjectDiagram>) => ProjectDiagram;
  updateDiagram: (diagId: string, updates: Partial<ProjectDiagram>) => void;
  deleteDiagram: (diagId: string) => void;

  createResearch: (res: Partial<ProjectResearch>) => ProjectResearch;
  deleteResearch: (resId: string) => void;

  createResource: (res: Partial<ProjectResource>) => ProjectResource;
  deleteResource: (resId: string) => void;
  togglePinResource: (resId: string) => void;

  createFile: (file: Partial<ProjectFile>) => ProjectFile;
  deleteFile: (fileId: string) => void;

  createSubject: (subject: Partial<StudySubject>) => StudySubject;
  deleteSubject: (subjectId: string) => void;
  createStudyTask: (task: Partial<StudyTask>) => StudyTask;
  toggleStudyTask: (taskId: string) => void;
  deleteStudyTask: (taskId: string) => void;

  createScheduleEvent: (event: Partial<ScheduleEvent>) => ScheduleEvent;
  deleteScheduleEvent: (eventId: string) => void;

  createIdea: (idea: Partial<Idea>) => Idea;
  convertIdeaToProject: (ideaId: string) => Project;
  authUser: any;
  loginWithGoogle: () => Promise<void>;
  logoutGoogle: () => Promise<void>;
  isUserProfileModalOpen: boolean;
  setIsUserProfileModalOpen: (open: boolean) => void;
  isVSCodeTrackerOpen: boolean;
  setIsVSCodeTrackerOpen: (open: boolean) => void;
  updateMember: (memberId: string, updates: Partial<TeamMember>) => TeamMember;
  createMember: (member: Partial<TeamMember>) => TeamMember;
  deleteMember: (memberId: string) => void;
  updateMemberAvailability: (memberId: string, availability: TeamMember['availability']) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
  clearAllWorkspaceData: () => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentMemberId, setCurrentMemberId] = useState<string>('');

  // Search & Modals
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState<boolean>(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState<boolean>(false);
  const [isConfigSettingsOpen, setIsConfigSettingsOpen] = useState<boolean>(false);

  // Specific Action Modals
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [isNewNoticeModalOpen, setIsNewNoticeModalOpen] = useState<boolean>(false);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState<boolean>(false);
  const [isNewDiagramModalOpen, setIsNewDiagramModalOpen] = useState<boolean>(false);
  const [isNewResearchModalOpen, setIsNewResearchModalOpen] = useState<boolean>(false);
  const [isNewResourceModalOpen, setIsNewResourceModalOpen] = useState<boolean>(false);
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState<boolean>(false);
  const [isNewIdeaModalOpen, setIsNewIdeaModalOpen] = useState<boolean>(false);
  const [isConvertIdeaModalOpen, setIsConvertIdeaModalOpen] = useState<boolean>(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  // Reactive state synced with Firestore Store
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [subjects, setSubjects] = useState<StudySubject[]>([]);
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [diagrams, setDiagrams] = useState<ProjectDiagram[]>([]);
  const [research, setResearch] = useState<ProjectResearch[]>([]);
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [notices, setNotices] = useState<WorkspaceNotice[]>([]);

  const syncStateFromStore = () => {
    setProjects(workspaceFirestore.getProjects());
    setTasks(workspaceFirestore.getTasks());
    setMembers(workspaceFirestore.getMembers());
    setSchedules(workspaceFirestore.getSchedules());
    setSubjects(workspaceFirestore.getSubjects());
    setStudyTasks(workspaceFirestore.getStudyTasks());
    setIdeas(workspaceFirestore.getIdeas());
    setNotifications(workspaceFirestore.getNotifications());
    setActivityLogs(workspaceFirestore.getActivityLogs());
    setDocuments(workspaceFirestore.getDocuments());
    setDiagrams(workspaceFirestore.getDiagrams());
    setResearch(workspaceFirestore.getResearch());
    setResources(workspaceFirestore.getResources());
    setFiles(workspaceFirestore.getFiles());
    setNotices(workspaceFirestore.getNotices());
  };

  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState<boolean>(false);
  const [isVSCodeTrackerOpen, setIsVSCodeTrackerOpen] = useState<boolean>(false);

  const [authUser, setAuthUser] = useState<any>(null);

  const loginWithGoogle = async () => {
    // 1. If running inside Electron Desktop App: Open real external browser for 100% Google compliance
    if (typeof window !== 'undefined' && (window as any).electronAPI?.isElectron) {
      (window as any).electronAPI.openExternalBrowser('http://localhost:5173/?desktop_auth=1');
      return;
    }

    // 2. Standard Web browser flow
    try {
      const { signInWithGoogle } = await import('@kavexa/firebase');
      const user = await signInWithGoogle();
      if (user) {
        setAuthUser(user);
        setCurrentMemberId(user.uid);
        workspaceFirestore.syncGoogleUser(user);
        triggerConfetti();
      }
    } catch (e: any) {
      console.error('Google login error:', e);
      if (e?.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'kavexa-ops.onrender.com';
        alert(`🔒 Firebase Domain Authorization Required\n\nDomain "${domain}" is not in your Firebase Authorized Domains.\n\nTo enable Google Sign-In:\n1. Open Firebase Console (https://console.firebase.google.com)\n2. Select project "kavexa-ops"\n3. Go to Build > Authentication > Settings > Authorized domains\n4. Click "Add domain" and add: ${domain}`);
      } else {
        alert('Authentication Notice: ' + (e?.message || 'Sign in could not complete.'));
      }
    }
  };

  const logoutGoogle = async () => {
    try {
      const { signOutUser } = await import('@kavexa/firebase');
      await signOutUser();
      setAuthUser(null);
      setCurrentMemberId('');
    } catch (e: any) {
      console.error('Google sign out error:', e);
    }
  };

  useEffect(() => {
    syncStateFromStore();
    const unsubscribe = workspaceFirestore.subscribe(() => {
      syncStateFromStore();
    });

    // Real Firebase Auth listener
    let unsubscribeAuth: any = null;
    import('@kavexa/firebase').then(({ subscribeToAuthChanges }) => {
      unsubscribeAuth = subscribeToAuthChanges((user) => {
        setAuthUser(user);
        if (user) {
          setCurrentMemberId(user.uid);
          workspaceFirestore.syncGoogleUser(user);
        }
      });
    }).catch((e) => console.warn('Auth sync listener:', e));

    // Electron Desktop Auth loopback bridge listener
    let unsubscribeElectron: any = null;
    if (typeof window !== 'undefined' && (window as any).electronAPI?.onAuthSuccess) {
      unsubscribeElectron = (window as any).electronAPI.onAuthSuccess((user: any) => {
        if (user) {
          setAuthUser(user);
          setCurrentMemberId(user.uid);
          workspaceFirestore.syncGoogleUser(user);
          triggerConfetti();
        }
      });
    }

    return () => {
      unsubscribe();
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeElectron) unsubscribeElectron();
    };
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const memberInStore = members.find(
    (m) => (authUser && (m.id === authUser.uid || (m.email && authUser.email && m.email.toLowerCase().trim() === authUser.email.toLowerCase().trim()))) ||
           (currentMemberId && (m.id === currentMemberId || (m.email && m.email.toLowerCase().trim() === currentMemberId.toLowerCase().trim())))
  );

  const currentMember: TeamMember = authUser
    ? {
        id: authUser.uid,
        name: authUser.displayName || memberInStore?.name || (authUser.email ? authUser.email.split('@')[0] : 'Team Member'),
        role: memberInStore?.role || 'Founder & Lead',
        email: authUser.email || memberInStore?.email || '',
        avatarUrl: authUser.photoURL || memberInStore?.avatarUrl || '/app-icon.png',
        availability: memberInStore?.availability || 'Available',
        weeklyWorkloadHours: memberInStore?.weeklyWorkloadHours || 0,
        assignedTasksCount: memberInStore?.assignedTasksCount || 0,
        completedTasksCount: memberInStore?.completedTasksCount || 0,
        skills: memberInStore?.skills || ['Operations'],
        todayFreeSlots: memberInStore?.todayFreeSlots || [],
        focusDomain: memberInStore?.focusDomain,
        university: memberInStore?.university,
        bio: memberInStore?.bio,
        themePreference: memberInStore?.themePreference
      }
    : memberInStore || {
        id: 'guest',
        name: 'Not Signed In',
        role: 'Sign in to access workspace',
        email: '',
        avatarUrl: '/app-icon.png',
        availability: 'Offline',
        weeklyWorkloadHours: 0,
        assignedTasksCount: 0,
        completedTasksCount: 0,
        skills: [],
        todayFreeSlots: []
      };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        selectedTaskId,
        setSelectedTaskId,
        currentMemberId,
        setCurrentMemberId,
        currentMember,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isMobileSimulatorOpen,
        setIsMobileSimulatorOpen,
        isFocusModeOpen,
        setIsFocusModeOpen,
        isConfigSettingsOpen,
        setIsConfigSettingsOpen,

        isNewTaskModalOpen,
        setIsNewTaskModalOpen,
        isNewProjectModalOpen,
        setIsNewProjectModalOpen,
        isNewNoticeModalOpen,
        setIsNewNoticeModalOpen,
        isNewDocModalOpen,
        setIsNewDocModalOpen,
        isNewDiagramModalOpen,
        setIsNewDiagramModalOpen,
        isNewResearchModalOpen,
        setIsNewResearchModalOpen,
        isNewResourceModalOpen,
        setIsNewResourceModalOpen,
        isNewFileModalOpen,
        setIsNewFileModalOpen,
        isNewIdeaModalOpen,
        setIsNewIdeaModalOpen,
        isConvertIdeaModalOpen,
        setIsConvertIdeaModalOpen,
        selectedIdeaId,
        setSelectedIdeaId,

        projects,
        tasks,
        members,
        schedules,
        subjects,
        studyTasks,
        ideas,
        notifications,
        activityLogs,
        documents,
        diagrams,
        research,
        resources,
        files,
        notices,

        createTask: (task) => workspaceFirestore.createTask(task),
        updateTask: (taskId, updates) => workspaceFirestore.updateTask(taskId, updates),
        deleteTask: (taskId) => workspaceFirestore.deleteTask(taskId),
        toggleTaskComplete: (taskId) => {
          workspaceFirestore.toggleTaskComplete(taskId);
          triggerConfetti();
        },

        createNotice: (notice) => workspaceFirestore.createNotice(notice, currentMember.name),
        deleteNotice: (noticeId) => workspaceFirestore.deleteNotice(noticeId),
        togglePinNotice: (noticeId) => workspaceFirestore.togglePinNotice(noticeId),

        createProject: (project) => workspaceFirestore.createProject(project),
        updateProject: (projectId, updates) => workspaceFirestore.updateProject(projectId, updates),
        deleteProject: (projectId) => workspaceFirestore.deleteProject(projectId),

        createDocument: (doc) => workspaceFirestore.createDocument(doc),
        updateDocument: (docId, updates) => workspaceFirestore.updateDocument(docId, updates),
        deleteDocument: (docId) => workspaceFirestore.deleteDocument(docId),

        createDiagram: (diag) => workspaceFirestore.createDiagram(diag),
        updateDiagram: (diagId, updates) => workspaceFirestore.updateDiagram(diagId, updates),
        deleteDiagram: (diagId) => workspaceFirestore.deleteDiagram(diagId),

        createResearch: (res) => workspaceFirestore.createResearch(res),
        deleteResearch: (resId) => workspaceFirestore.deleteResearch(resId),

        createResource: (res) => workspaceFirestore.createResource(res),
        deleteResource: (resId) => workspaceFirestore.deleteResource(resId),
        togglePinResource: (resId) => workspaceFirestore.togglePinResource(resId),

        createFile: (file) => workspaceFirestore.createFile(file),
        deleteFile: (fileId) => workspaceFirestore.deleteFile(fileId),

        createSubject: (subject) => workspaceFirestore.createSubject(subject),
        deleteSubject: (subjectId) => workspaceFirestore.deleteSubject(subjectId),
        createStudyTask: (task) => workspaceFirestore.createStudyTask(task),
        toggleStudyTask: (taskId) => {
          workspaceFirestore.toggleStudyTask(taskId);
          triggerConfetti();
        },
        deleteStudyTask: (taskId) => workspaceFirestore.deleteStudyTask(taskId),

        createScheduleEvent: (event) => workspaceFirestore.createScheduleEvent(event),
        deleteScheduleEvent: (eventId) => workspaceFirestore.deleteScheduleEvent(eventId),

        createIdea: (idea) => workspaceFirestore.createIdea(idea),
        convertIdeaToProject: (ideaId) => {
          const proj = workspaceFirestore.convertIdeaToProject(ideaId);
          setSelectedProjectId(proj.id);
          setActiveTab('projects');
          return proj;
        },

        authUser,
        loginWithGoogle,
        logoutGoogle,
        isUserProfileModalOpen,
        setIsUserProfileModalOpen,
        isVSCodeTrackerOpen,
        setIsVSCodeTrackerOpen,
        updateMember: (memberId, updates) => workspaceFirestore.updateMember(memberId, updates),
        createMember: (member) => workspaceFirestore.createMember(member),
        deleteMember: (memberId) => workspaceFirestore.deleteMember(memberId),
        updateMemberAvailability: (memberId, availability) =>
          workspaceFirestore.updateMemberAvailability(memberId, availability),
        markNotificationRead: (notifId) => workspaceFirestore.markNotificationRead(notifId),
        markAllNotificationsRead: () => workspaceFirestore.markAllNotificationsRead(),
        resetDemoData: () => workspaceFirestore.resetToDefaults(),
        clearAllWorkspaceData: () => workspaceFirestore.clearAllWorkspaceData(),
        triggerConfetti
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
