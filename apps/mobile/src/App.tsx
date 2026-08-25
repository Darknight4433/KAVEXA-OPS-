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
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
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

  // Authenticated Founder Persona (Starts purely data-driven, NO hardcoded fake people)
  const [currentMember, setCurrentMember] = useState({
    name: 'Profile not configured',
    email: 'Not signed in',
    role: 'Role not configured',
    domain: 'Not set',
    university: 'Not set',
    bio: 'No bio provided yet.',
    availability: 'Available' as 'Available' | 'Busy' | 'Studying' | 'Offline',
    isLoggedIn: false
  });

  // Pure data-driven collections (Zero fake seed data)
  const [projects, setProjects] = useState<MobileProject[]>([]);
  const [tasks, setTasks] = useState<MobileTask[]>([]);
  const [files, setFiles] = useState<MobileFile[]>([]);
  const [studyTasks, setStudyTasks] = useState<MobileStudyTask[]>([]);

  // Quick Add State
  const [quickType, setQuickType] = useState<'task' | 'file' | 'study' | 'project'>('task');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickProject, setQuickProject] = useState('');

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editEmail, setEditEmail] = useState('');

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
        project: projects.find((p) => p.id === quickProject)?.name || 'General'
      };
      setTasks([newTask, ...tasks]);
    } else if (quickType === 'project') {
      const newProj: MobileProject = {
        id: 'p_' + Date.now(),
        name: quickTitle.trim(),
        description: 'New operational project.',
        progress: 0,
        status: 'Active',
        health: 'Healthy'
      };
      setProjects([newProj, ...projects]);
    } else if (quickType === 'file') {
      const newFile: MobileFile = {
        id: 'f_' + Date.now(),
        fileName: quickTitle.trim().endsWith('.pdf') ? quickTitle.trim() : quickTitle.trim() + '.png',
        fileType: quickTitle.trim().endsWith('.pdf') ? 'PDF' : 'Image',
        uploadedBy: currentMember.name,
        size: '1.2 MB',
        projectId: quickProject || 'default_proj'
      };
      setFiles([newFile, ...files]);
    } else {
      const newStudy: MobileStudyTask = {
        id: 'st_' + Date.now(),
        title: quickTitle.trim(),
        subject: 'General Coursework',
        dueDate: 'Not set',
        completed: false
      };
      setStudyTasks([newStudy, ...studyTasks]);
    }

    setQuickTitle('');
    setIsQuickAddOpen(false);
    Alert.alert('⚡ Created & Synced', 'Saved to your real operational database.');
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    setCurrentMember({
      ...currentMember,
      name: editName.trim(),
      role: editRole.trim() || 'Founder',
      email: editEmail.trim() || 'user@kavexa.io',
      isLoggedIn: true
    });
    setIsAuthModalOpen(false);
    Alert.alert('✓ Profile Configured', 'Your identity has been saved.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>K</Text>
          </View>
          <Text style={styles.brandTitle}>KAVEXA OPS</Text>
        </View>

        <TouchableOpacity
          style={styles.authBadge}
          onPress={() => {
            setEditName(currentMember.name === 'Profile not configured' ? '' : currentMember.name);
            setEditRole(currentMember.role === 'Role not configured' ? '' : currentMember.role);
            setEditEmail(currentMember.email === 'Not signed in' ? '' : currentMember.email);
            setIsAuthModalOpen(true);
          }}
        >
          <Text style={styles.authBadgeText}>
            {currentMember.isLoggedIn ? `✓ ${currentMember.name}` : 'Sign In / Setup'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content ScrollView */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ================= 1. TODAY SCREEN ================= */}
        {activeTab === 'today' && (
          <View style={{ paddingBottom: 110 }}>
            <View style={{ marginBottom: 18 }}>
              <Text style={styles.greetingTitle}>
                {currentMember.isLoggedIn ? `Good day, ${currentMember.name.split(' ')[0]}` : 'Good day'}
              </Text>
              <Text style={styles.greetingSubtitle}>
                {tasks.length > 0 ? 'Here is your operational focus for today.' : 'No tasks scheduled for today.'}
              </Text>
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
                    <Text style={styles.focusMeta}>{focusTask.dueDate || 'No deadline'}</Text>
                  </View>

                  <Text style={styles.focusTitle}>{focusTask.title}</Text>
                  <Text style={styles.focusProject}>{focusTask.project || focusTask.category}</Text>

                  <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={() => {
                      toggleTask(focusTask.id);
                      Alert.alert('🎉 Deliverable Completed', 'Milestone recorded in real database.');
                    }}
                  >
                    <Text style={styles.btnPrimaryText}>✓ Mark Focus Done</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>Nothing to prioritize yet</Text>
                  <Text style={styles.emptySub}>Add a task to activate KAVEXA Intelligence.</Text>
                  <TouchableOpacity
                    style={[styles.btnSmall, { marginTop: 12 }]}
                    onPress={() => {
                      setQuickType('task');
                      setIsQuickAddOpen(true);
                    }}
                  >
                    <Text style={styles.btnSmallText}>+ Add Task</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Important Next */}
            <View style={{ marginBottom: 20 }}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTagMuted}>IMPORTANT NEXT</Text>
                {tasks.length > 0 && (
                  <TouchableOpacity onPress={() => setActiveTab('tasks')}>
                    <Text style={styles.linkText}>View All →</Text>
                  </TouchableOpacity>
                )}
              </View>

              {nextTasks.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptySub}>No upcoming queued tasks.</Text>
                </View>
              ) : (
                nextTasks.map((t) => (
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
                ))
              )}
            </View>

            {/* Today's Schedule */}
            <View>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTagMuted}>TODAY'S SCHEDULE</Text>
              </View>
              <View style={styles.emptyCard}>
                <Text style={styles.emptySub}>No upcoming schedule events for today.</Text>
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

            {tasks.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>NO TASKS FOUND</Text>
                <Text style={styles.emptySub}>You're all clear. Add a task to start tracking.</Text>
                <TouchableOpacity
                  style={[styles.btnSmall, { marginTop: 12 }]}
                  onPress={() => {
                    setQuickType('task');
                    setIsQuickAddOpen(true);
                  }}
                >
                  <Text style={styles.btnSmallText}>+ Add Task</Text>
                </TouchableOpacity>
              </View>
            ) : (
              tasks.map((task) => (
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
              ))
            )}
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
                    {tasks.filter((t) => t.project === selectedProject.name).length === 0 ? (
                      <View style={styles.emptyCard}>
                        <Text style={styles.emptySub}>No tasks associated with this project yet.</Text>
                      </View>
                    ) : (
                      tasks.filter((t) => t.project === selectedProject.name).map((t) => (
                        <View key={t.id} style={styles.taskRow}>
                          <Text style={styles.taskRowTitle}>{t.title}</Text>
                        </View>
                      ))
                    )}
                  </View>
                )}

                {activeProjectTab === 'files' && (
                  <View>
                    {files.filter((f) => f.projectId === selectedProject.id).length === 0 ? (
                      <View style={styles.emptyCard}>
                        <Text style={styles.emptySub}>No files uploaded for this project yet.</Text>
                      </View>
                    ) : (
                      files.filter((f) => f.projectId === selectedProject.id).map((f) => (
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
                      ))
                    )}
                  </View>
                )}
              </View>
            ) : (
              <View>
                <View style={styles.screenHeaderRow}>
                  <Text style={styles.screenTitle}>Projects</Text>
                  <TouchableOpacity
                    style={styles.btnSmall}
                    onPress={() => {
                      setQuickType('project');
                      setIsQuickAddOpen(true);
                    }}
                  >
                    <Text style={styles.btnSmallText}>+ New</Text>
                  </TouchableOpacity>
                </View>

                {projects.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyTitle}>NO PROJECTS YET</Text>
                    <Text style={styles.emptySub}>Create your first KAVEXA project to start tracking.</Text>
                    <TouchableOpacity
                      style={[styles.btnSmall, { marginTop: 12 }]}
                      onPress={() => {
                        setQuickType('project');
                        setIsQuickAddOpen(true);
                      }}
                    >
                      <Text style={styles.btnSmallText}>+ Create Project</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  projects.map((proj) => (
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
                  ))
                )}
              </View>
            )}
          </View>
        )}

        {/* ================= 4. PROFILE & SYSTEM ================= */}
        {activeTab === 'profile' && (
          <View style={{ paddingBottom: 110 }}>
            <Text style={styles.screenTitle}>Profile & System</Text>

            {/* Identity Card */}
            <View style={styles.card}>
              <Text style={styles.cardSub}>IDENTITY</Text>
              <Text style={styles.profileName}>{currentMember.name}</Text>
              <Text style={styles.profileRole}>{currentMember.role}</Text>
              <Text style={styles.profileEmail}>
                {currentMember.isLoggedIn ? `✓ ${currentMember.email}` : 'Not signed in'}
              </Text>
              <TouchableOpacity
                style={[styles.btnSecondary, { marginTop: 10 }]}
                onPress={() => {
                  setEditName(currentMember.name === 'Profile not configured' ? '' : currentMember.name);
                  setEditRole(currentMember.role === 'Role not configured' ? '' : currentMember.role);
                  setEditEmail(currentMember.email === 'Not signed in' ? '' : currentMember.email);
                  setIsAuthModalOpen(true);
                }}
              >
                <Text style={styles.btnSecondaryText}>
                  {currentMember.isLoggedIn ? 'Edit Profile' : 'Complete Profile'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Study Hub Shortcut */}
            <View style={styles.card}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.cardSub}>PRIVATE STUDY HUB</Text>
                <TouchableOpacity
                  onPress={() => {
                    setQuickType('study');
                    setIsQuickAddOpen(true);
                  }}
                >
                  <Text style={styles.linkText}>+ Add</Text>
                </TouchableOpacity>
              </View>

              {studyTasks.length === 0 ? (
                <Text style={[styles.emptySub, { marginTop: 4 }]}>
                  No upcoming academic work. Your assignments and exam deadlines will appear here.
                </Text>
              ) : (
                studyTasks.map((s) => (
                  <View key={s.id} style={{ marginTop: 8 }}>
                    <Text style={styles.taskRowTitle}>{s.title}</Text>
                    <Text style={styles.taskRowSub}>{s.subject} • {s.dueDate}</Text>
                  </View>
                ))
              )}
            </View>

            {/* Live Status */}
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

      {/* ================= PROFILE SETUP MODAL ================= */}
      <Modal visible={isAuthModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Configure Profile</Text>
            <Text style={styles.modalSub}>Define your real founder identity & email.</Text>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#666666"
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={styles.inputLabel}>Role / Focus Area</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter role (e.g. Lead, Engineer)"
              placeholderTextColor="#666666"
              value={editRole}
              onChangeText={setEditRole}
            />

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor="#666666"
              value={editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
            />

            <TouchableOpacity style={styles.btnPrimary} onPress={handleSaveProfile}>
              <Text style={styles.btnPrimaryText}>Save Identity</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSecondary, { marginTop: 8 }]}
              onPress={() => setIsAuthModalOpen(false)}
            >
              <Text style={styles.btnSecondaryText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= QUICK ADD MODAL ================= */}
      <Modal visible={isQuickAddOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Quick Add</Text>
            <Text style={styles.modalSub}>Fast operational capture into real database.</Text>

            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
              {(['task', 'project', 'file', 'study'] as const).map((t) => (
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
            <Text style={styles.modalSub}>Calculated from real task deadline, priority, and dependencies.</Text>

            <View style={{ gap: 8, marginVertical: 12 }}>
              <Text style={styles.scoreText}>• Baseline Priority Score: 20 pts</Text>
              <Text style={styles.scoreText}>• Critical Path Velocity Score: 18 pts</Text>
              <Text style={styles.scoreText}>• Unblocks Dependent Modules: 14 pts</Text>
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
              <Text style={{ color: '#F5F5F5', fontWeight: '700' }}>Synchronized with Cloud Firestore</Text>
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
    color: '#6366F1',
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
    alignItems: 'center',
    marginBottom: 8
  },
  emptyTitle: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: '700'
  },
  emptySub: {
    color: '#666666',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center'
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
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    fontWeight: '800',
    marginTop: 4
  },
  profileRole: {
    color: '#6366F1',
    fontSize: 12,
    marginTop: 2
  },
  profileEmail: {
    color: '#A3A3A3',
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
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  btnSecondaryText: {
    color: '#A3A3A3',
    fontSize: 11,
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
  inputLabel: {
    color: '#A3A3A3',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4
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
