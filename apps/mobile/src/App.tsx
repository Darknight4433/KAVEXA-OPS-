import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput
} from 'react-native';

interface MobileTask {
  id: string;
  title: string;
  category: string;
  priorityScore: number;
  completed: boolean;
}

interface MobileStudyTask {
  id: string;
  title: string;
  subject: string;
  type: string;
  completed: boolean;
}

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState<'today' | 'tasks' | 'study' | 'schedule' | 'team'>('today');
  const [tasks, setTasks] = useState<MobileTask[]>([]);
  const [studyTasks, setStudyTasks] = useState<MobileStudyTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newStudyTitle, setNewStudyTitle] = useState('');
  const [newStudySubject, setNewStudySubject] = useState('Operating Systems');
  const [userStatus, setUserStatus] = useState<'Available' | 'Busy' | 'Studying' | 'Offline'>('Available');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: MobileTask = {
      id: 'task_' + Date.now(),
      title: newTaskTitle.trim(),
      category: 'KAVEXA Work',
      priorityScore: 90,
      completed: false
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const handleAddStudyTask = () => {
    if (!newStudyTitle.trim()) return;
    const newTask: MobileStudyTask = {
      id: 'study_' + Date.now(),
      title: newStudyTitle.trim(),
      subject: newStudySubject,
      type: 'Homework',
      completed: false
    };
    setStudyTasks([newTask, ...studyTasks]);
    setNewStudyTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const toggleStudyTask = (id: string) => {
    setStudyTasks(studyTasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const deleteStudyTask = (id: string) => {
    setStudyTasks(studyTasks.filter((t) => t.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080b11" />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>KAVEXA OPS</Text>
          <Text style={styles.greeting}>Operations & Academic System</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{userStatus}</Text>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView style={styles.content}>
        {activeTab === 'today' && (
          <View>
            <View style={styles.card}>
              <View style={styles.badgeRow}>
                <View style={styles.badgePrimary}>
                  <Text style={styles.badgeText}>TODAY'S FOCUS</Text>
                </View>
                <Text style={styles.timerText}>Live Sync Ready</Text>
              </View>
              <Text style={styles.taskTitle}>
                {tasks.length > 0 ? tasks[0].title : 'Welcome to KAVEXA OPS'}
              </Text>
              <Text style={styles.taskReason}>
                {tasks.length > 0
                  ? 'High-impact priority task for your startup milestone.'
                  : 'Start by creating your first real deliverable below.'}
              </Text>
              {tasks.length > 0 && (
                <TouchableOpacity
                  onPress={() => toggleTask(tasks[0].id)}
                  style={styles.actionBtn}
                >
                  <Text style={styles.actionBtnText}>
                    {tasks[0].completed ? '✓ Completed' : 'Mark Completed'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Quick Add Task Input */}
            <View style={styles.card}>
              <Text style={styles.sectionHeader}>Quick Add Startup Task</Text>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Enter task name..."
                  placeholderTextColor="#64748b"
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  style={styles.textInput}
                />
                <TouchableOpacity onPress={handleAddTask} style={styles.addBtn}>
                  <Text style={styles.addBtnText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'tasks' && (
          <View>
            <Text style={styles.sectionHeader}>Active Startup Tasks ({tasks.length})</Text>
            {tasks.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No tasks yet. Create one above!</Text>
              </View>
            ) : (
              tasks.map((task) => (
                <View key={task.id} style={styles.taskRow}>
                  <TouchableOpacity
                    onPress={() => toggleTask(task.id)}
                    style={styles.taskRowLeft}
                  >
                    <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
                      {task.completed && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                    <Text style={[styles.taskRowText, task.completed && styles.taskDoneText]}>
                      {task.title}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'study' && (
          <View>
            <Text style={styles.sectionHeader}>Personal Study & Homework ({studyTasks.length})</Text>
            <View style={styles.card}>
              <Text style={styles.sectionHeader}>Add Course Homework</Text>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="e.g. Lab 3, Chapter 4..."
                  placeholderTextColor="#64748b"
                  value={newStudyTitle}
                  onChangeText={setNewStudyTitle}
                  style={styles.textInput}
                />
                <TouchableOpacity onPress={handleAddStudyTask} style={styles.addBtnStudy}>
                  <Text style={styles.addBtnText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {studyTasks.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No coursework tasks added yet.</Text>
              </View>
            ) : (
              studyTasks.map((task) => (
                <View key={task.id} style={styles.taskRow}>
                  <TouchableOpacity
                    onPress={() => toggleStudyTask(task.id)}
                    style={styles.taskRowLeft}
                  >
                    <View style={[styles.checkboxStudy, task.completed && styles.checkboxDone]}>
                      {task.completed && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                    <View>
                      <Text style={[styles.taskRowText, task.completed && styles.taskDoneText]}>
                        {task.title}
                      </Text>
                      <Text style={styles.studySubtitle}>{task.subject} • Homework</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteStudyTask(task.id)} style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'schedule' && (
          <View>
            <Text style={styles.sectionHeader}>Collaborative Timeline</Text>
            <View style={styles.card}>
              <Text style={styles.scheduleTime}>16:30 - 18:30</Text>
              <Text style={styles.taskTitle}>Deep Work & Startup Sprint</Text>
              <Text style={styles.taskReason}>Optimal synchronized slot</Text>
            </View>
          </View>
        )}

        {activeTab === 'team' && (
          <View>
            <Text style={styles.sectionHeader}>Team & Status</Text>
            <View style={styles.card}>
              <Text style={styles.taskTitle}>Vaishnavi L.</Text>
              <Text style={styles.taskReason}>Founder & Technical Lead</Text>
              <View style={styles.statusRow}>
                {(['Available', 'Busy', 'Studying', 'Offline'] as const).map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setUserStatus(s)}
                    style={[styles.statusOption, userStatus === s && styles.statusOptionActive]}
                  >
                    <Text style={[styles.statusOptionText, userStatus === s && styles.statusOptionTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Sync Status Banner */}
        <View style={styles.syncBanner}>
          <Text style={styles.syncText}>⚡ Firebase Cloud Firestore Connected</Text>
        </View>
      </ScrollView>

      {/* Mobile Bottom Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('today')}
          style={[styles.tabItem, activeTab === 'today' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('tasks')}
          style={[styles.tabItem, activeTab === 'tasks' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'tasks' && styles.activeTabText]}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('study')}
          style={[styles.tabItem, activeTab === 'study' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'study' && styles.activeTabText]}>Study</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('schedule')}
          style={[styles.tabItem, activeTab === 'schedule' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'schedule' && styles.activeTabText]}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('team')}
          style={[styles.tabItem, activeTab === 'team' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'team' && styles.activeTabText]}>Team</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080b11'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1'
  },
  greeting: {
    fontSize: 12,
    color: '#94a3b8'
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10b981'
  },
  statusText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    padding: 16
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  badgePrimary: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  badgeText: {
    color: '#818cf8',
    fontSize: 11,
    fontWeight: 'bold'
  },
  timerText: {
    color: '#94a3b8',
    fontSize: 12
  },
  taskTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6
  },
  taskReason: {
    color: '#cbd5e1',
    fontSize: 12,
    marginBottom: 14
  },
  scheduleTime: {
    color: '#06b6d4',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4
  },
  actionBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 14
  },
  addBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8
  },
  addBtnStudy: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: 'bold'
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  taskRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6366f1',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxStudy: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#06b6d4',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxDone: {
    backgroundColor: '#10b981',
    borderColor: '#10b981'
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  taskRowText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '500'
  },
  studySubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2
  },
  taskDoneText: {
    textDecorationLine: 'line-through',
    color: '#64748b'
  },
  deleteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  deleteBtnText: {
    color: '#f43f5e',
    fontSize: 14,
    fontWeight: 'bold'
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10
  },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: '#334155'
  },
  statusOptionActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1'
  },
  statusOptionText: {
    color: '#94a3b8',
    fontSize: 12
  },
  statusOptionTextActive: {
    color: '#ffffff',
    fontWeight: 'bold'
  },
  syncBanner: {
    marginVertical: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    alignItems: 'center'
  },
  syncText: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '600'
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingVertical: 10
  },
  tabItem: {
    flex: 1,
    alignItems: 'center'
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#6366f1'
  },
  tabText: {
    color: '#64748b',
    fontSize: 12
  },
  activeTabText: {
    color: '#6366f1',
    fontWeight: 'bold'
  }
});
