import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  Alert
} from 'react-native';

interface MobileTask {
  id: string;
  title: string;
  category: 'KAVEXA Work' | 'Study' | 'Personal';
  priority: 'Critical' | 'High' | 'Medium';
  completed: boolean;
  project?: string;
  dueDate?: string;
}

interface MobileProject {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: string;
  health: 'Healthy' | 'Caution' | 'Critical';
}

interface MobileFile {
  id: string;
  fileName: string;
  fileType: 'PDF' | 'Image' | 'DOCX';
  uploadedBy: string;
  size: string;
  projectId: string;
}

interface MobileStudyTask {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
}

interface MobileMember {
  id: string;
  name: string;
  role: string;
  availability: 'Available' | 'Busy' | 'Studying' | 'Offline';
  activeIde: string;
  activeProject: string;
  hoursSpent: number;
}

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState<'today' | 'tasks' | 'projects' | 'profile'>('today');

  // Modals
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<MobileTask | null>(null);
  const [selectedProject, setSelectedProject] = useState<MobileProject | null>(null);
  const [activeProjectTab, setActiveProjectTab] = useState<'overview' | 'tasks' | 'files'>('overview');
  const [activeFilePreview, setActiveFilePreview] = useState<MobileFile | null>(null);

  // Active Founder Persona
  const [currentMember, setCurrentMember] = useState({
    name: 'Harish R',
    email: 'harish@kavexa.io',
    role: 'Founder & Technical Lead',
    domain: 'Autonomous Systems & Robotics',
    university: 'B.Tech Robotics & Automation',
    bio: 'Pioneering intelligent educational robotics and autonomous hardware.',
    availability: 'Available' as 'Available' | 'Busy' | 'Studying' | 'Offline'
  });

  // Projects
  const [projects, setProjects] = useState<MobileProject[]>([
    {
      id: 'proj-1',
      name: 'ORION (School Assistant Robot)',
      description: 'Autonomous mechanical and AI assistant for educational administration.',
      progress: 68,
      status: 'Active',
      health: 'Healthy'
    },
    {
      id: 'proj-2',
      name: 'KAVEXA OPS Core',
      description: 'Operations, cloud synchronization, and developer telemetry architecture.',
      progress: 84,
      status: 'Active',
      health: 'Healthy'
    }
  ]);

  // Tasks
  const [tasks, setTasks] = useState<MobileTask[]>([
    {
      id: 't-1',
      title: 'Finalize ORION Mechanical Chassis 3D CAD',
      category: 'KAVEXA Work',
      priority: 'Critical',
      completed: false,
      project: 'ORION (School Assistant Robot)',
      dueDate: 'Today at 6:00 PM'
    },
    {
      id: 't-2',
      title: 'Calibrate LIDAR Navigation & Obstacle Avoidance',
      category: 'KAVEXA Work',
      priority: 'High',
      completed: false,
      project: 'ORION (School Assistant Robot)',
      dueDate: 'Tomorrow'
    },
    {
      id: 't-3',
      title: 'Operating Systems Kernel Multi-threading HW',
      category: 'Study',
      priority: 'High',
      completed: false,
      dueDate: 'In 2 days'
    }
  ]);

  // Files
  const [files, setFiles] = useState<MobileFile[]>([
    {
      id: 'f-1',
      fileName: 'School_Principal_Assistant_Robot_Mechanical_Proposal.pdf',
      fileType: 'PDF',
      uploadedBy: 'Harish R',
      size: '2.4 MB',
      projectId: 'proj-1'
    },
    {
      id: 'f-2',
      fileName: 'ORION_Chassis_Exploded_View_v3.png',
      fileType: 'Image',
      uploadedBy: 'Harish R',
      size: '1.8 MB',
      projectId: 'proj-1'
    }
  ]);

  // Study
  const [studyTasks, setStudyTasks] = useState<MobileStudyTask[]>([
    {
      id: 'st-1',
      title: 'OS Virtual Memory & Paging Problem Set',
      subject: 'Operating Systems',
      dueDate: 'Tomorrow at 11:59 PM',
      completed: false
    },
    {
      id: 'st-2',
      title: 'Robotics Kinematics Jacobian Matrix Lab',
      subject: 'Robotics & Control',
      dueDate: 'In 3 days',
      completed: false
    }
  ]);

  // Quick Add State
  const [quickType, setQuickType] = useState<'task' | 'file' | 'study'>('task');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickProject, setQuickProject] = useState('proj-1');

  const focusTask = tasks.find((t) => !t.completed);
  const nextTasks = tasks.filter((t) => !t.completed && t.id !== focusTask?.id).slice(0, 3);

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleQuickCreate = () => {
    if (!quickTitle.trim()) return;

    if (quickType === 'task') {
      const newTask: MobileTask = {
        id: 't_' + Date.now(),
        title: quickTitle.trim(),
        category: 'KAVEXA Work',
        priority: 'High',
        completed: false,
        project: projects.find((p) => p.id === quickProject)?.name
      };
      setTasks([newTask, ...tasks]);
    } else if (quickType === 'file') {
      const newFile: MobileFile = {
        id: 'f_' + Date.now(),
        fileName: quickTitle.trim().endsWith('.pdf') ? quickTitle.trim() : quickTitle.trim() + '.png',
        fileType: quickTitle.trim().endsWith('.pdf') ? 'PDF' : 'Image',
        uploadedBy: currentMember.name,
        size: '1.2 MB',
        projectId: quickProject
      };
      setFiles([newFile, ...files]);
    } else {
      const newStudy: MobileStudyTask = {
        id: 'st_' + Date.now(),
        title: quickTitle.trim(),
        subject: 'Robotics Engineering',
        dueDate: 'In 2 days',
        completed: false
      };
      setStudyTasks([newStudy, ...studyTasks]);
    }

    setQuickTitle('');
    setIsQuickAddOpen(false);
    Alert.alert('⚡ Created & Synced', 'Updated across Cloud Firestore and Desktop App.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>K</Text>
          </View>
          <Text style={styles.brandTitle}>KAVEXA OPS</Text>
        </View>

        <TouchableOpacity
          style={styles.authBadge}
          onPress={() => setIsAuthModalOpen(true)}
        >
          <Text style={styles.authBadgeText}>✓ {currentMember.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ================= 1. TODAY SCREEN ================= */}
        {activeTab === 'today' && (
          <View style={{ paddingBottom: 110 }}>
            <View style={{ marginBottom: 18 }}>
              <Text style={styles.greetingTitle}>Good day, {currentMember.name.split(' ')[0]}</Text>
              <Text style={styles.greetingSubtitle}>Here is your operational focus for today.</Text>
            </View>

            {/* Today's Focus Card */}
            <View style={{ marginBottom: 20 }}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTagIndigo}>TODAY'S FOCUS</Text>
                {focusTask && (
                  <TouchableOpacity onPress={() => setIsWhyModalOpen(true)}>
                    <Text style={styles.whyText}>Why this task?</Text>
                  </TouchableOpacity>
                )}
              </View>

              {focusTask ? (
                <View style={styles.focusCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={styles.priorityBadge}>{focusTask.priority} Priority</Text>
                    <Text style={styles.focusMeta}>{focusTask.dueDate || 'Today'}</Text>
                  </View>

                  <Text style={styles.focusTitle}>{focusTask.title}</Text>
                  <Text style={styles.focusProject}>{focusTask.project || focusTask.category}</Text>

                  <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={() => {
                      toggleTask(focusTask.id);
                      Alert.alert('🎉 Deliverable Completed', 'Milestone recorded.');
                    }}
                  >
                    <Text style={styles.btnPrimaryText}>✓ Mark Focus Done</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>All Priority Deliverables Done</Text>
                  <Text style={styles.emptySub}>Nothing urgent requires attention right now.</Text>
                </View>
              )}
            </View>

            {/* Important Next */}
            <View style={{ marginBottom: 20 }}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTagMuted}>IMPORTANT NEXT</Text>
                <TouchableOpacity onPress={() => setActiveTab('tasks')}>
                  <Text style={styles.linkText}>View All →</Text>
                </TouchableOpacity>
              </View>

              {nextTasks.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={styles.taskRow}
                  onPress={() => setSelectedTask(t)}
                >
                  <TouchableOpacity
                    style={styles.miniCheckbox}
                    onPress={() => toggleTask(t.id)}
                  >
                    {t.completed && <Text style={{ color: '#10B981', fontSize: 10 }}>✓</Text>}
                  </TouchableOpacity>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.taskRowTitle} numberOfLines={1}>{t.title}</Text>
                    <Text style={styles.taskRowSub}>{t.project || t.category}</Text>
                  </View>
                  <Text style={styles.taskRowPri}>{t.priority}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Today's Schedule */}
            <View>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTagMuted}>TODAY'S SCHEDULE</Text>
              </View>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleTime}>14:00 - 17:00</Text>
                <Text style={styles.scheduleTitle}>Collaborative Deep Work Sprint</Text>
              </View>
            </View>
          </View>
        )}

        {/* ================= 2. TASKS SCREEN ================= */}
        {activeTab === 'tasks' && (
          <View style={{ paddingBottom: 110 }}>
            <View style={styles.screenHeaderRow}>
              <Text style={styles.screenTitle}>Tasks</Text>
              <TouchableOpacity
                style={styles.btnSmall}
                onPress={() => {
                  setQuickType('task');
                  setIsQuickAddOpen(true);
                }}
              >
                <Text style={styles.btnSmallText}>+ New</Text>
              </TouchableOpacity>
            </View>

            {tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskRow}
                onPress={() => setSelectedTask(task)}
              >
                <TouchableOpacity
                  style={[styles.miniCheckbox, task.completed && styles.miniCheckboxDone]}
                  onPress={() => toggleTask(task.id)}
                >
                  {task.completed && <Text style={{ color: '#ffffff', fontSize: 10 }}>✓</Text>}
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.taskRowTitle, task.completed && styles.taskDoneText]}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskRowSub}>{task.project || task.category}</Text>
                </View>
                <Text style={styles.taskRowPri}>{task.priority}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ================= 3. PROJECTS SCREEN ================= */}
        {activeTab === 'projects' && (
          <View style={{ paddingBottom: 110 }}>
            {selectedProject ? (
              <View>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => setSelectedProject(null)}
                >
                  <Text style={styles.backBtnText}>← Back to Projects</Text>
                </TouchableOpacity>

                <Text style={styles.projectDetailTitle}>{selectedProject.name}</Text>
                <Text style={styles.projectDetailSub}>{selectedProject.description}</Text>

                {/* Sub-tabs */}
                <View style={styles.tabPillRow}>
                  {(['overview', 'tasks', 'files'] as const).map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.tabPill, activeProjectTab === tab && styles.tabPillActive]}
                      onPress={() => setActiveProjectTab(tab)}
                    >
                      <Text style={[styles.tabPillText, activeProjectTab === tab && styles.tabPillTextActive]}>
                        {tab.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {activeProjectTab === 'overview' && (
                  <View>
                    <View style={styles.card}>
                      <Text style={styles.cardSub}>MILESTONE PROGRESS</Text>
                      <Text style={styles.progressBig}>{selectedProject.progress}%</Text>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${selectedProject.progress}%` }]} />
                      </View>
                    </View>
                  </View>
                )}

                {activeProjectTab === 'tasks' && (
                  <View>
                    {tasks.filter((t) => t.project?.includes(selectedProject.name)).map((t) => (
                      <View key={t.id} style={styles.taskRow}>
                        <Text style={styles.taskRowTitle}>{t.title}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {activeProjectTab === 'files' && (
                  <View>
                    {files.filter((f) => f.projectId === selectedProject.id).map((f) => (
                      <TouchableOpacity
                        key={f.id}
                        style={styles.fileRow}
                        onPress={() => setActiveFilePreview(f)}
                      >
                        <Text style={{ fontSize: 18 }}>{f.fileType === 'Image' ? '🖼️' : '📄'}</Text>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.taskRowTitle} numberOfLines={1}>{f.fileName}</Text>
                          <Text style={styles.taskRowSub}>{f.size} • {f.uploadedBy}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <View>
                <View style={styles.screenHeaderRow}>
                  <Text style={styles.screenTitle}>Projects</Text>
                </View>

                {projects.map((proj) => (
                  <TouchableOpacity
                    key={proj.id}
                    style={styles.projectCard}
                    onPress={() => setSelectedProject(proj)}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={styles.projectCardName}>{proj.name}</Text>
                      <Text style={styles.healthBadge}>{proj.health}</Text>
                    </View>
                    <Text style={styles.projectCardDesc}>{proj.description}</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${proj.progress}%` }]} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ================= 4. PROFILE & SYSTEM ================= */}
        {activeTab === 'profile' && (
          <View style={{ paddingBottom: 110 }}>
            <Text style={styles.screenTitle}>Profile & System</Text>

            <View style={styles.card}>
              <Text style={styles.profileName}>{currentMember.name}</Text>
              <Text style={styles.profileRole}>{currentMember.role}</Text>
              <Text style={styles.profileEmail}>✓ {currentMember.email}</Text>
            </View>

            {/* Study Hub Shortcut */}
            <View style={styles.card}>
              <Text style={styles.cardSub}>PRIVATE STUDY HUB</Text>
              {studyTasks.map((s) => (
                <View key={s.id} style={{ marginTop: 8 }}>
                  <Text style={styles.taskRowTitle}>{s.title}</Text>
                  <Text style={styles.taskRowSub}>{s.subject} • {s.dueDate}</Text>
                </View>
              ))}
            </View>

            {/* Status Switcher */}
            <View style={styles.card}>
              <Text style={styles.cardSub}>LIVE STATUS</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                {(['Available', 'Busy', 'Studying', 'Offline'] as const).map((st) => (
                  <TouchableOpacity
                    key={st}
                    style={[styles.statusPill, currentMember.availability === st && styles.statusPillActive]}
                    onPress={() => setCurrentMember({ ...currentMember, availability: st })}
                  >
                    <Text style={[styles.statusPillText, currentMember.availability === st && styles.statusPillTextActive]}>
                      {st}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ================= QUICK ADD MODAL ================= */}
      <Modal visible={isQuickAddOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Quick Add</Text>
            <Text style={styles.modalSub}>Fast operational capture from anywhere.</Text>

            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
              {(['task', 'file', 'study'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typePill, quickType === t && styles.typePillActive]}
                  onPress={() => setQuickType(t)}
                >
                  <Text style={[styles.typePillText, quickType === t && styles.typePillTextActive]}>
                    {t.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter title or deliverable name..."
              placeholderTextColor="#666666"
              value={quickTitle}
              onChangeText={setQuickTitle}
              autoFocus
            />

            <TouchableOpacity style={styles.btnPrimary} onPress={handleQuickCreate}>
              <Text style={styles.btnPrimaryText}>Create</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSecondary, { marginTop: 8 }]}
              onPress={() => setIsQuickAddOpen(false)}
            >
              <Text style={styles.btnSecondaryText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= WHY THIS TASK MODAL ================= */}
      <Modal visible={isWhyModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Why This Task Is Recommended</Text>
            <Text style={styles.modalSub}>Backend algorithm evaluation breakdown.</Text>

            <View style={{ gap: 8, marginVertical: 12 }}>
              <Text style={styles.scoreText}>Deadline Urgency: 28 / 30</Text>
              <Text style={styles.scoreText}>Project Impact: 18 / 20</Text>
              <Text style={styles.scoreText}>Dependency Unlocking: 14 / 15</Text>
              <Text style={styles.scoreText}>Schedule Fit: 9 / 10</Text>
            </View>

            <TouchableOpacity style={styles.btnPrimary} onPress={() => setIsWhyModalOpen(false)}>
              <Text style={styles.btnPrimaryText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= FILE PREVIEW MODAL ================= */}
      <Modal visible={!!activeFilePreview} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>📄 {activeFilePreview?.fileName}</Text>
            <Text style={styles.modalSub}>{activeFilePreview?.fileType} Document • {activeFilePreview?.size}</Text>

            <View style={styles.previewBox}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>
                {activeFilePreview?.fileType === 'Image' ? '🖼️' : '📑'}
              </Text>
              <Text style={{ color: '#F5F5F5', fontWeight: '700' }}>Synchronized with Desktop</Text>
            </View>

            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => {
                Alert.alert('📥 Download Initialized', 'Saved to device storage.');
                setActiveFilePreview(null);
              }}
            >
              <Text style={styles.btnPrimaryText}>Download Asset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSecondary, { marginTop: 8 }]}
              onPress={() => setActiveFilePreview(null)}
            >
              <Text style={styles.btnSecondaryText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= BOTTOM NAVIGATION BAR ================= */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[styles.navIcon, activeTab === 'today' && styles.navIconActive]}>⚡</Text>
          <Text style={[styles.navLabel, activeTab === 'today' && styles.navLabelActive]}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => setActiveTab('tasks')}
        >
          <Text style={[styles.navIcon, activeTab === 'tasks' && styles.navIconActive]}>✅</Text>
          <Text style={[styles.navLabel, activeTab === 'tasks' && styles.navLabelActive]}>Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAddCenterBtn}
          onPress={() => setIsQuickAddOpen(true)}
        >
          <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '800' }}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => {
            setSelectedProject(null);
            setActiveTab('projects');
          }}
        >
          <Text style={[styles.navIcon, activeTab === 'projects' && styles.navIconActive]}>📁</Text>
          <Text style={[styles.navLabel, activeTab === 'projects' && styles.navLabelActive]}>Projects</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.navIcon, activeTab === 'profile' && styles.navIconActive]}>👤</Text>
          <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
    backgroundColor: '#0A0A0A'
  },
  brandBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  brandBadgeText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14
  },
  brandTitle: {
    color: '#F5F5F5',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  authBadge: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#242424',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },
  authBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700'
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  greetingTitle: {
    color: '#F5F5F5',
    fontSize: 20,
    fontWeight: '800'
  },
  greetingSubtitle: {
    color: '#A3A3A3',
    fontSize: 12,
    marginTop: 2
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  sectionTagIndigo: {
    color: '#6366F1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  sectionTagMuted: {
    color: '#A3A3A3',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  whyText: {
    color: '#666666',
    fontSize: 11
  },
  linkText: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: '700'
  },
  focusCard: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 14,
    padding: 16
  },
  priorityBadge: {
    color: '#818CF8',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  focusMeta: {
    color: '#666666',
    fontSize: 11
  },
  focusTitle: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '800',
    marginVertical: 6,
    lineHeight: 22
  },
  focusProject: {
    color: '#A3A3A3',
    fontSize: 12,
    marginBottom: 14
  },
  emptyCard: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center'
  },
  emptyTitle: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: '700'
  },
  emptySub: {
    color: '#666666',
    fontSize: 11,
    marginTop: 2
  },
  taskRow: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  miniCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#444444',
    justifyContent: 'center',
    alignItems: 'center'
  },
  miniCheckboxDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981'
  },
  taskRowTitle: {
    color: '#F5F5F5',
    fontSize: 13,
    fontWeight: '600'
  },
  taskDoneText: {
    color: '#666666',
    textDecorationLine: 'line-through'
  },
  taskRowSub: {
    color: '#666666',
    fontSize: 10,
    marginTop: 1
  },
  taskRowPri: {
    color: '#A3A3A3',
    fontSize: 10,
    fontWeight: '700'
  },
  scheduleRow: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 10,
    padding: 12
  },
  scheduleTime: {
    color: '#6366F1',
    fontSize: 11,
    fontWeight: '700'
  },
  scheduleTitle: {
    color: '#F5F5F5',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2
  },
  screenHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  screenTitle: {
    color: '#F5F5F5',
    fontSize: 18,
    fontWeight: '800'
  },
  btnSmall: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  btnSmallText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  projectCard: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10
  },
  projectCardName: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: '800'
  },
  healthBadge: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700'
  },
  projectCardDesc: {
    color: '#A3A3A3',
    fontSize: 11,
    marginVertical: 6
  },
  progressBar: {
    height: 4,
    backgroundColor: '#171717',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1'
  },
  backBtn: {
    marginBottom: 10
  },
  backBtnText: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: '700'
  },
  projectDetailTitle: {
    color: '#F5F5F5',
    fontSize: 18,
    fontWeight: '800'
  },
  projectDetailSub: {
    color: '#A3A3A3',
    fontSize: 12,
    marginVertical: 4
  },
  tabPillRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 12
  },
  tabPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#242424'
  },
  tabPillActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366F1'
  },
  tabPillText: {
    color: '#666666',
    fontSize: 10,
    fontWeight: '700'
  },
  tabPillTextActive: {
    color: '#F5F5F5'
  },
  card: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10
  },
  cardSub: {
    color: '#666666',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  progressBig: {
    color: '#F5F5F5',
    fontSize: 22,
    fontWeight: '900',
    marginVertical: 4
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 10,
    padding: 10,
    marginBottom: 6
  },
  profileName: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '800'
  },
  profileRole: {
    color: '#6366F1',
    fontSize: 12,
    marginTop: 2
  },
  profileEmail: {
    color: '#10B981',
    fontSize: 11,
    marginTop: 4
  },
  statusPill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#111111',
    alignItems: 'center'
  },
  statusPillActive: {
    backgroundColor: '#6366F1'
  },
  statusPillText: {
    color: '#666666',
    fontSize: 10,
    fontWeight: '700'
  },
  statusPillTextActive: {
    color: '#ffffff'
  },
  btnPrimary: {
    backgroundColor: '#6366F1',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13
  },
  btnSecondary: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#242424',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  btnSecondaryText: {
    color: '#A3A3A3',
    fontSize: 12,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalBox: {
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: 16,
    padding: 18,
    width: '100%',
    maxWidth: 380
  },
  modalTitle: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '800'
  },
  modalSub: {
    color: '#666666',
    fontSize: 11,
    marginBottom: 12
  },
  typePill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#242424',
    alignItems: 'center'
  },
  typePillActive: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.2)'
  },
  typePillText: {
    color: '#666666',
    fontSize: 10,
    fontWeight: '700'
  },
  typePillTextActive: {
    color: '#F5F5F5'
  },
  input: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F5F5F5',
    fontSize: 13,
    marginBottom: 12
  },
  scoreText: {
    color: '#A3A3A3',
    fontSize: 12
  },
  previewBox: {
    backgroundColor: '#111111',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginVertical: 12
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1,
    borderTopColor: '#242424',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navIcon: {
    fontSize: 16,
    opacity: 0.4
  },
  navIconActive: {
    opacity: 1
  },
  navLabel: {
    color: '#666666',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2
  },
  navLabelActive: {
    color: '#6366F1',
    fontWeight: '800'
  },
  quickAddCenterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#6366F1',
    shadowOpacity: 0.4,
    shadowRadius: 8
  }
});
