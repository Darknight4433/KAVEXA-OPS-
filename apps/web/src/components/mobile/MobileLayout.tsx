import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MobileBottomNav, MobileTab } from './MobileBottomNav';
import { MobileTodayView } from './MobileTodayView';
import { MobileTasksView } from './MobileTasksView';
import { MobileScheduleView } from './MobileScheduleView';
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
        backgroundColor: 'var(--bg-base)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        position: 'relative'
      }}
    >
      {/* Active Screen Content */}
      <main>
        {mobileTab === 'today' && (
          <MobileTodayView
            onGoToTasks={() => setMobileTab('tasks')}
            onGoToSchedule={() => setMobileTab('schedule')}
          />
        )}
        {mobileTab === 'tasks' && <MobileTasksView />}
        {mobileTab === 'schedule' && <MobileScheduleView />}
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
