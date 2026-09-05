# Code Templates for Quick Start

## 🚀 Copy-Paste Ready Code Snippets

---

## 1. Firebase Service (firebase.ts)

```typescript
// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
```

---

## 2. Authentication Hook (useAuth.ts)

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return { user, loading, signInWithGoogle, signOut };
};
```

---

## 3. Login Page Component

```typescript
// src/components/auth/LoginPage.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-app)'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        padding: '3rem',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '0.5rem',
          color: 'var(--text-main)'
        }}>
          KAVEXA OPS
        </h1>
        <p style={{ 
          color: 'var(--text-secondary)', 
          marginBottom: '2rem' 
        }}>
          Operations & Productivity Dashboard
        </p>
        
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          <LogIn size={20} />
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};
```

---

## 4. Protected Route Component

```typescript
// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-app)',
        color: 'var(--text-main)'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

---

## 5. Firestore Service (firestoreService.ts)

```typescript
// src/services/firestoreService.ts
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface WorkspaceData {
  projects: any[];
  tasks: any[];
  members: any[];
  schedules: any[];
  subjects: any[];
  studyTasks: any[];
  ideas: any[];
  notifications: any[];
  activityLogs: any[];
  documents: any[];
  diagrams: any[];
  research: any[];
  resources: any[];
  files: any[];
  notices: any[];
  lastUpdated: string;
}

const WORKSPACE_ID = 'kavexa_main';

// Subscribe to real-time updates
export const subscribeToWorkspace = (
  callback: (data: WorkspaceData) => void
) => {
  const workspaceRef = doc(db, 'workspaces', WORKSPACE_ID);
  
  return onSnapshot(workspaceRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as WorkspaceData);
    } else {
      // Initialize with empty data
      const emptyData: WorkspaceData = {
        projects: [],
        tasks: [],
        members: [],
        schedules: [],
        subjects: [],
        studyTasks: [],
        ideas: [],
        notifications: [],
        activityLogs: [],
        documents: [],
        diagrams: [],
        research: [],
        resources: [],
        files: [],
        notices: [],
        lastUpdated: new Date().toISOString()
      };
      callback(emptyData);
    }
  }, (error) => {
    console.error('Firestore subscription error:', error);
  });
};

// Save workspace data
export const saveWorkspace = async (data: Partial<WorkspaceData>) => {
  try {
    const workspaceRef = doc(db, 'workspaces', WORKSPACE_ID);
    await setDoc(workspaceRef, {
      ...data,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    console.log('Workspace data saved successfully');
  } catch (error) {
    console.error('Error saving workspace:', error);
    throw error;
  }
};

// Get workspace data once
export const getWorkspace = async (): Promise<WorkspaceData | null> => {
  try {
    const workspaceRef = doc(db, 'workspaces', WORKSPACE_ID);
    const docSnap = await getDoc(workspaceRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as WorkspaceData;
    }
    return null;
  } catch (error) {
    console.error('Error getting workspace:', error);
    throw error;
  }
};
```

---

## 6. App Context Provider

```typescript
// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subscribeToWorkspace, saveWorkspace, WorkspaceData } from '../services/firestoreService';
import { Project, Task, TeamMember } from '../types';

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  members: TeamMember[];
  loading: boolean;
  createProject: (project: Partial<Project>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  createTask: (task: Partial<Task>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToWorkspace((data) => {
      setWorkspaceData(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createProject = (project: Partial<Project>) => {
    if (!workspaceData) return;

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: project.name || 'New Project',
      description: project.description || '',
      objective: project.objective || '',
      status: project.status || 'Planning',
      priority: project.priority || 'Medium',
      startDate: project.startDate || new Date().toISOString().split('T')[0],
      deadline: project.deadline || '',
      progress: 0,
      assignedMemberIds: project.assignedMemberIds || [],
      taskIds: [],
      dependencies: [],
      media: [],
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
      accentColor: project.accentColor || '#3b82f6'
    };

    const updatedProjects = [...workspaceData.projects, newProject];
    saveWorkspace({ projects: updatedProjects });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    if (!workspaceData) return;

    const updatedProjects = workspaceData.projects.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    saveWorkspace({ projects: updatedProjects });
  };

  const deleteProject = (id: string) => {
    if (!workspaceData) return;

    const updatedProjects = workspaceData.projects.filter(p => p.id !== id);
    const updatedTasks = workspaceData.tasks.filter(t => t.projectId !== id);
    saveWorkspace({ projects: updatedProjects, tasks: updatedTasks });
  };

  const createTask = (task: Partial<Task>) => {
    if (!workspaceData) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: task.title || 'New Task',
      description: task.description || '',
      category: task.category || 'KAVEXA Work',
      priority: task.priority || 'Medium',
      status: task.status || 'Not Started',
      assignedMemberId: task.assignedMemberId || '',
      projectId: task.projectId,
      deadline: task.deadline || '',
      estimatedDuration: task.estimatedDuration || 60,
      dependencies: task.dependencies || [],
      impactLevel: task.impactLevel || 'Medium',
      difficultyLevel: task.difficultyLevel || 'Medium',
      priorityScore: 50,
      createdAt: new Date().toISOString(),
      tags: task.tags || []
    };

    const updatedTasks = [...workspaceData.tasks, newTask];
    saveWorkspace({ tasks: updatedTasks });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    if (!workspaceData) return;

    const updatedTasks = workspaceData.tasks.map(t =>
      t.id === id ? { ...t, ...updates } : t
    );
    saveWorkspace({ tasks: updatedTasks });
  };

  const deleteTask = (id: string) => {
    if (!workspaceData) return;

    const updatedTasks = workspaceData.tasks.filter(t => t.id !== id);
    saveWorkspace({ tasks: updatedTasks });
  };

  const value: AppContextType = {
    projects: workspaceData?.projects || [],
    tasks: workspaceData?.tasks || [],
    members: workspaceData?.members || [],
    loading,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    updateTask,
    deleteTask
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
```

---

## 7. Main App.tsx with Routing

```typescript
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './components/Dashboard';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
};
```

---

## 8. Basic Dashboard Layout

```typescript
// src/components/Dashboard.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users,
  LogOut 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { projects, tasks, loading } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'tasks' | 'team'>('dashboard');

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="app-sidebar">
        <div className="sidebar-header">
          <div className="brand-badge">
            <div className="brand-logo-icon">K</div>
            <div className="brand-info">
              <div className="brand-name">KAVEXA OPS</div>
              <div className="brand-tag">Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="nav-item-left">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
          </div>

          <div
            className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <div className="nav-item-left">
              <FolderKanban size={20} />
              <span>Projects</span>
            </div>
            <span className="nav-badge">{projects.length}</span>
          </div>

          <div
            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <div className="nav-item-left">
              <CheckSquare size={20} />
              <span>Tasks</span>
            </div>
            <span className="nav-badge">{tasks.length}</span>
          </div>

          <div
            className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <div className="nav-item-left">
              <Users size={20} />
              <span>Team</span>
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button onClick={signOut} className="btn btn-secondary" style={{width: '100%'}}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="app-main">
        <div className="app-topbar">
          <div className="topbar-left">
            <h2 style={{margin: 0, color: 'var(--text-main)'}}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
          </div>
          <div className="topbar-right">
            <div className="user-switcher">
              <img 
                src={user?.photoURL || ''} 
                alt={user?.displayName || ''} 
                className="user-avatar-small"
              />
              <span className="user-name-label">{user?.displayName}</span>
            </div>
          </div>
        </div>

        <div className="workspace-content">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'team' && <TeamView />}
        </div>
      </div>
    </div>
  );
};

const DashboardView = () => (
  <div>
    <h3>Welcome to your Dashboard</h3>
    <p>This is where your overview will be displayed.</p>
  </div>
);

const ProjectsView = () => {
  const { projects, createProject } = useApp();

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <h3>Projects</h3>
        <button 
          className="btn btn-primary"
          onClick={() => createProject({ name: 'New Project' })}
        >
          + Create Project
        </button>
      </div>
      <div className="grid-3">
        {projects.map(project => (
          <div key={project.id} className="card">
            <h4>{project.name}</h4>
            <p style={{color: 'var(--text-secondary)'}}>{project.description}</p>
            <div style={{marginTop: '1rem'}}>
              <span className="priority-score-badge score-normal">
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TasksView = () => {
  const { tasks, createTask } = useApp();

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <h3>Tasks</h3>
        <button 
          className="btn btn-primary"
          onClick={() => createTask({ title: 'New Task' })}
        >
          + Create Task
        </button>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
        {tasks.map(task => (
          <div key={task.id} className="card">
            <h4>{task.title}</h4>
            <p style={{color: 'var(--text-secondary)'}}>{task.description}</p>
            <div style={{marginTop: '0.5rem', display: 'flex', gap: '0.5rem'}}>
              <span className="priority-score-badge score-normal">
                {task.status}
              </span>
              <span className="priority-score-badge score-elevated">
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamView = () => (
  <div>
    <h3>Team Management</h3>
    <p>Team member management coming soon...</p>
  </div>
);
```

---

## 9. TypeScript Interfaces

```typescript
// src/types/index.ts
export interface Project {
  id: string;
  name: string;
  description: string;
  objective: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  startDate: string;
  deadline: string;
  progress: number;
  assignedMemberIds: string[];
  taskIds: string[];
  dependencies: string[];
  media: string[];
  notes: string[];
  ideas: string[];
  health: {
    status: 'Healthy' | 'At Risk' | 'Critical';
    score: number;
    factors: {
      deadlineProximity: string;
      progressRate: number;
      remainingTasksCount: number;
      blockedTasksCount: number;
      overdueTasksCount: number;
    };
    warnings: string[];
  };
  createdAt: string;
  updatedAt: string;
  accentColor: string;
  githubUrl?: string;
  websiteUrl?: string;
  figmaUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'KAVEXA Work' | 'Personal' | 'Study';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Blocked' | 'Completed';
  assignedMemberId: string;
  projectId?: string;
  studySubjectId?: string;
  deadline: string;
  estimatedDuration: number;
  dependencies: string[];
  impactLevel: 'High' | 'Medium' | 'Low';
  difficultyLevel: 'Hard' | 'Medium' | 'Easy';
  priorityScore: number;
  createdAt: string;
  completedAt?: string;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  availability: 'Available' | 'Busy' | 'Studying' | 'School' | 'Offline';
  currentProject?: string;
  tasksAssigned: number;
  tasksCompleted: number;
  bio?: string;
  joinedDate: string;
  skills: string[];
  isActive: boolean;
}
```

---

## 10. Package.json Scripts

```json
{
  "name": "kavexa-ops",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.20.0",
    "firebase": "^10.13.1",
    "lucide-react": "^0.439.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}
```

---

## 🚀 Quick Start Steps

1. **Install Dependencies:**
```bash
npm install
```

2. **Create all the files above** with the respective code

3. **Update Firebase config** in `firebase.ts`

4. **Import global CSS** (use the one from the existing project)

5. **Run the app:**
```bash
npm run dev
```

6. **Test:**
   - Go to http://localhost:5173
   - Click "Sign in with Google"
   - Create a project
   - Create a task
   - Check Firebase Console to see data syncing

---

**These templates give you a working foundation. Build on top of this! 🎯**
