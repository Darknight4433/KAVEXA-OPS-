import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MobileBottomNav, MobileTab } from './MobileBottomNav';
import { MobileTodayView } from './MobileTodayView';
import { MobileTasksView } from './MobileTasksView';
import { MobileProjectsView } from './MobileProjectsView';
import { MobileProfileTeamView } from './MobileProfileTeamView';
import { MobileQuickAddModal } from './MobileQuickAddModal';
import { FocusTimerHUD } from '../layout/FocusTimerHUD';

export const MobileLayout: React.FC = () => {
  const { tasks } = useApp();
  const [mobileTab, setMobileTab] = useState<MobileTab>('today');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050505',
        color: '#F5F5F5',
        fontFamily: 'var(--font-sans)',
        position: 'relative'
      }}
    >
      {/* Active Screen Content */}
      <main>
        {mobileTab === 'today' && (
          <MobileTodayView
            onGoToTasks={() => setMobileTab('tasks')}
            onGoToProjects={() => setMobileTab('projects')}
          />
        )}
        {mobileTab === 'tasks' && <MobileTasksView />}
        {mobileTab === 'projects' && <MobileProjectsView />}
        {mobileTab === 'profile' && <MobileProfileTeamView />}
      </main>

      {/* Floating Deep Work Timer */}
      <FocusTimerHUD />

      {/* Quick Add Bottom Sheet / Modal */}
      <MobileQuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      {/* Native-feel Bottom Navigation */}
      <MobileBottomNav
        activeTab={mobileTab}
        setActiveTab={setMobileTab}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        pendingTasksCount={pendingTasksCount}
      />
    </div>
  );
};
