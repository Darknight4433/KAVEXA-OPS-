import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from '../layout/Sidebar';
import { Topbar } from '../layout/Topbar';
import { CommandPalette } from '../layout/CommandPalette';
import { FocusTimerHUD } from '../layout/FocusTimerHUD';

import { CommandCenter } from '../modules/CommandCenter/CommandCenter';
import { ProjectsHub } from '../modules/Projects/ProjectsHub';
import { TasksHub } from '../modules/Tasks/TasksHub';
import { StudyHub } from '../modules/StudyHub/StudyHub';
import { ScheduleHub } from '../modules/Schedule/ScheduleHub';
import { TeamHub } from '../modules/Team/TeamHub';
import { IdeaVault } from '../modules/IdeaVault/IdeaVault';
import { AnalyticsHub } from '../modules/Analytics/AnalyticsHub';

import { TaskModal } from '../modals/TaskModal';
import { ProjectModal } from '../modals/ProjectModal';
import { DocumentModal } from '../modals/DocumentModal';
import { DiagramModal } from '../modals/DiagramModal';
import { ResearchModal } from '../modals/ResearchModal';
import { ResourceModal } from '../modals/ResourceModal';
import { FileUploadModal } from '../modals/FileUploadModal';
import { IdeaModal } from '../modals/IdeaModal';
import { ConfigSettingsModal } from '../modals/ConfigSettingsModal';
import { UserProfileModal } from '../modals/UserProfileModal';
import { VSCodeTrackerModal } from '../modules/Analytics/VSCodeTrackerModal';

export const DesktopLayout: React.FC = () => {
  const {
    activeTab,
    isUserProfileModalOpen,
    setIsUserProfileModalOpen,
    isVSCodeTrackerOpen,
    setIsVSCodeTrackerOpen
  } = useApp();

  return (
    <div className="app-container">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Dynamic Main Workspace Area */}
      <div className="app-main">
        <Topbar />

        {activeTab === 'dashboard' && <CommandCenter />}
        {activeTab === 'projects' && <ProjectsHub />}
        {activeTab === 'tasks' && <TasksHub />}
        {activeTab === 'study' && <StudyHub />}
        {activeTab === 'schedule' && <ScheduleHub />}
        {activeTab === 'team' && <TeamHub />}
        {activeTab === 'ideas' && <IdeaVault />}
        {activeTab === 'analytics' && <AnalyticsHub />}
      </div>

      {/* Global Utilities & Floating Deep Work HUD */}
      <CommandPalette />
      <FocusTimerHUD />

      {/* Global Desktop Workspace Modals */}
      <TaskModal />
      <ProjectModal />
      <DocumentModal />
      <DiagramModal />
      <ResearchModal />
      <ResourceModal />
      <FileUploadModal />
      <IdeaModal />
      <ConfigSettingsModal />
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
      />
      <VSCodeTrackerModal
        isOpen={isVSCodeTrackerOpen}
        onClose={() => setIsVSCodeTrackerOpen(false)}
      />
    </div>
  );
};
