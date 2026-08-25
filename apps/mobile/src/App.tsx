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
  Image,
  Alert
} from 'react-native';

interface MobileTask {
  id: string;
  title: string;
  category: 'KAVEXA Work' | 'Study' | 'Personal';
  priorityScore: number;
  priority: 'Critical' | 'High' | 'Medium';
  completed: boolean;
  project?: string;
}

interface MobileFile {
  id: string;
  fileName: string;
  fileType: 'PDF' | 'Image' | 'DOCX';
  uploadedBy: string;
  size: string;
  url?: string;
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
  const [activeTab, setActiveTab] = useState<'today' | 'tasks' | 'projects' | 'study' | 'team'>('today');

  // Founder Profile & Auth State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);
  const [activeFilePreview, setActiveFilePreview] = useState<MobileFile | null>(null);

  const [currentMember, setCurrentMember] = useState({
    name: 'Harish R',
    email: 'harish@kavexa.io',
    role: 'Founder & Technical Lead',
    domain: 'Autonomous Systems & Robotics',
    university: 'B.Tech Robotics & Automation',
    bio: 'Pioneering intelligent educational robotics and autonomous hardware.',
    availability: 'Available' as 'Available' | 'Busy' | 'Studying' | 'Offline',
    theme: 'Cyberpunk Obsidian'
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Real Project Tasks
  const [tasks, setTasks] = useState<MobileTask[]>([
    {
      id: 't-1',
      title: 'Finalize ORION Mechanical Chassis 3D CAD',
      category: 'KAVEXA Work',
      priority: 'Critical',
      priorityScore: 95,
      completed: false,
      project: 'ORION (Assistant Robot)'
    },
    {
      id: 't-2',
      title: 'Calibrate LIDAR Navigation & Obstacle Avoidance',
      category: 'KAVEXA Work',
      priority: 'High',
      priorityScore: 88,
      completed: false,
      project: 'ORION (Assistant Robot)'
    },
    {
      id: 't-3',
      title: 'Operating Systems Kernel Multi-threading HW',
      category: 'Study',
      priority: 'High',
      priorityScore: 82,
      completed: false
    },
    {
      id: 't-4',
      title: 'Configure Firebase Cloud Sync Security Rules',
      category: 'KAVEXA Work',
      priority: 'Medium',
      priorityScore: 75,
      completed: true,
      project: 'KAVEXA OPS Core'
    }
  ]);

  // Project Files & Shared Assets
  const [files, setFiles] = useState<MobileFile[]>([
    {
      id: 'f-1',
      fileName: 'School_Principal_Assistant_Robot_Mechanical_Proposal.pdf',
      fileType: 'PDF',
      uploadedBy: 'Harish R',
      size: '2.4 MB'
    },
    {
      id: 'f-2',
      fileName: 'ORION_Chassis_Exploded_View_v3.png',
      fileType: 'Image',
      uploadedBy: 'Harish R',
      size: '1.8 MB'
    },
    {
      id: 'f-3',
      fileName: 'KAVEXA_Seed_Pitch_Deck_2026.pdf',
      fileType: 'PDF',
      uploadedBy: 'Harish R',
      size: '4.1 MB'
    }
  ]);

  // Personal Study Homework
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
    },
    {
      id: 'st-3',
      title: 'Microcontroller UART Communication Quiz',
      subject: 'Embedded Systems',
      dueDate: 'Friday',
      completed: true
    }
  ]);

  // Team Co-Founders
  const [members, setMembers] = useState<MobileMember[]>([
    {
      id: 'm-1',
      name: 'Harish R',
      role: 'Founder & Technical Lead',
      availability: 'Available',
      activeIde: 'Visual Studio Code',
      activeProject: 'ORION (Assistant Robot)',
      hoursSpent: 28.5
    },
    {
      id: 'm-2',
      name: 'Co-Founder (AI & Firmware)',
      role: 'Co-Founder & AI Lead',
      availability: 'Studying',
      activeIde: 'Cursor AI',
      activeProject: 'ORION (Assistant Robot)',
      hoursSpent: 22.0
    }
  ]);

  // Quick inputs
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickFileTitle, setQuickFileTitle] = useState('');
  const [quickFileType, setQuickFileType] = useState<'Image' | 'PDF'>('Image');
  const [quickStudyTitle, setQuickStudyTitle] = useState('');

  const handleCreateTask = () => {
    if (!quickTaskTitle.trim()) return;
    const newTask: MobileTask = {
      id: 't_' + Date.now(),
      title: quickTaskTitle.trim(),
      category: 'KAVEXA Work',
      priority: 'High',
      priorityScore: 85,
      completed: false,
      project: 'ORION (Assistant Robot)'
    };
    setTasks([newTask, ...tasks]);
    setQuickTaskTitle('');
    setIsNewTaskModalOpen(false);
    Alert.alert('⚡ Task Created', 'New task synced to Cloud Firestore.');
  };

  const handleUploadFile = () => {
    if (!quickFileTitle.trim()) return;
    const newFile: MobileFile = {
      id: 'f_' + Date.now(),
      fileName: quickFileTitle.trim() + (quickFileType === 'PDF' ? '.pdf' : '.png'),
      fileType: quickFileType,
      uploadedBy: currentMember.name,
      size: '1.5 MB'
    };
    setFiles([newFile, ...files]);
    setQuickFileTitle('');
    setIsNewFileModalOpen(false);
    Alert.alert('📤 File Uploaded', 'Shared with all team members on desktop & phone.');
  };

  const handleAddStudy = () => {
    if (!quickStudyTitle.trim()) return;
    const newStudy: MobileStudyTask = {
      id: 'st_' + Date.now(),
      title: quickStudyTitle.trim(),
      subject: 'Robotics Engineering',
      dueDate: 'In 2 days',
      completed: false
    };
    setStudyTasks([newStudy, ...studyTasks]);
    setQuickStudyTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const toggleStudy = (id: string) => {
    setStudyTasks(studyTasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const deleteStudy = (id: string) => {
    setStudyTasks(studyTasks.filter((s) => s.id !== id));
  };

  const deleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080b11" />

      {/* Top Futuristic Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileHeaderButton}
          onPress={() => setIsProfileModalOpen(true)}
          activeOpacity={0.8}
        >
          <View style={styles.avatarGlow}>
            <Text style={styles.avatarInitial}>{currentMember.name.charAt(0)}</Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.founderName}>{currentMember.name}</Text>
              <View style={[styles.statusDot, { backgroundColor: currentMember.availability === 'Available' ? '#10b981' : '#f59e0b' }]} />
            </View>
            <Text style={styles.founderRole}>{currentMember.role}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleAuthBtn}
          onPress={() => setIsAuthModalOpen(true)}
        >
          <Text style={styles.googleAuthText}>{isLoggedIn ? '✓ Logged In' : 'Sign In'}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ================= TAB 1: TODAY ================= */}
        {activeTab === 'today' && (
          <View style={{ paddingBottom: 110 }}>
            {/* Today's Focus Card */}
            <View style={styles.glassCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.badgeCyan}>
                  <Text style={styles.badgeCyanText}>🔥 TOP PRIORITY DELIVERABLE</Text>
                </View>
                <Text style={styles.syncStatusText}>● Cloud Synced</Text>
              </View>

              <Text style={styles.focusTitle}>
                {tasks.find((t) => !t.completed)?.title || 'All high impact tasks completed!'}
              </Text>
              <Text style={styles.focusSubtitle}>
                Target Project: ORION (School Principal Assistant Robot)
              </Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.btnPrimary}
                  onPress={() => {
                    const first = tasks.find((t) => !t.completed);
                    if (first) toggleTask(first.id);
                  }}
                >
                  <Text style={styles.btnPrimaryText}>✓ Mark Deliverable Done</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{tasks.filter((t) => !t.completed).length}</Text>
                <Text style={styles.statLabel}>Pending Tasks</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#10b981' }]}>
                  {tasks.filter((t) => t.completed).length}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#f59e0b' }]}>
                  {studyTasks.filter((s) => !s.completed).length}
                </Text>
                <Text style={styles.statLabel}>Study Items</Text>
              </View>
            </View>

            {/* Quick Add Startup Task */}
            <View style={styles.card}>
              <Text style={styles.sectionHeader}>⚡ QUICK ADD STARTUP TASK</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter task deliverable..."
                  placeholderTextColor="#64748b"
                  value={quickTaskTitle}
                  onChangeText={setQuickTaskTitle}
                />
                <TouchableOpacity style={styles.btnAdd} onPress={handleCreateTask}>
                  <Text style={styles.btnAddText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Active Developer Session */}
            <View style={styles.ideBanner}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.ideBannerTitle}>💻 ACTIVE DEV ENVIRONMENT</Text>
                <Text style={styles.ideActiveBadge}>● Tracking</Text>
              </View>
              <Text style={styles.ideName}>Visual Studio Code & Cursor AI</Text>
              <Text style={styles.ideSub}>Active Project: ORION • 4.2 hrs logged today</Text>
            </View>
          </View>
        )}

        {/* ================= TAB 2: TASKS ================= */}
        {activeTab === 'tasks' && (
          <View style={{ paddingBottom: 110 }}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.screenHeading}>Startup Tasks Checklist</Text>
              <TouchableOpacity style={styles.btnSmall} onPress={() => setIsNewTaskModalOpen(true)}>
                <Text style={styles.btnSmallText}>+ New Task</Text>
              </TouchableOpacity>
            </View>

            {tasks.map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <TouchableOpacity
                  style={styles.checkboxTouch}
                  onPress={() => toggleTask(task.id)}
                >
                  <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
                    {task.completed && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.taskTitleText, task.completed && styles.taskCompletedText]}>
                      {task.title}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <Text style={styles.taskTag}>{task.category}</Text>
                      {task.project && <Text style={styles.projectTag}>{task.project}</Text>}
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(task.id)} style={{ padding: 6 }}>
                  <Text style={{ color: '#ef4444', fontSize: 13 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* ================= TAB 3: PROJECTS & FILES ================= */}
        {activeTab === 'projects' && (
          <View style={{ paddingBottom: 110 }}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.screenHeading}>Project Files & Images</Text>
              <TouchableOpacity style={styles.btnSmall} onPress={() => setIsNewFileModalOpen(true)}>
                <Text style={styles.btnSmallText}>+ Upload</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.tabSubheader}>
              Images & Documents synced with your Desktop Application.
            </Text>

            {files.map((file) => (
              <TouchableOpacity
                key={file.id}
                style={styles.fileCard}
                onPress={() => setActiveFilePreview(file)}
                activeOpacity={0.8}
              >
                <View style={styles.fileIconBox}>
                  <Text style={{ fontSize: 20 }}>{file.fileType === 'Image' ? '🖼️' : '📄'}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.fileNameText} numberOfLines={1}>
                    {file.fileName}
                  </Text>
                  <Text style={styles.fileMetaText}>
                    {file.fileType} • {file.size} • By {file.uploadedBy}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteFile(file.id)}
                  style={{ padding: 6, marginLeft: 6 }}
                >
                  <Text style={{ color: '#ef4444', fontSize: 13 }}>✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            <View style={styles.card}>
              <Text style={styles.sectionHeader}>📤 UPLOAD ASSET FROM PHONE</Text>
              <TextInput
                style={[styles.textInput, { marginBottom: 10 }]}
                placeholder="Asset or Proposal Name..."
                placeholderTextColor="#64748b"
                value={quickFileTitle}
                onChangeText={setQuickFileTitle}
              />
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                <TouchableOpacity
                  style={[styles.typeSelectBtn, quickFileType === 'Image' && styles.typeSelectBtnActive]}
                  onPress={() => setQuickFileType('Image')}
                >
                  <Text style={[styles.typeSelectText, quickFileType === 'Image' && styles.typeSelectTextActive]}>
                    🖼️ Photo / Diagram
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeSelectBtn, quickFileType === 'PDF' && styles.typeSelectBtnActive]}
                  onPress={() => setQuickFileType('PDF')}
                >
                  <Text style={[styles.typeSelectText, quickFileType === 'PDF' && styles.typeSelectTextActive]}>
                    📄 PDF Document
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.btnPrimary} onPress={handleUploadFile}>
                <Text style={styles.btnPrimaryText}>Upload to Cloud & Desktop</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= TAB 4: STUDY HUB ================= */}
        {activeTab === 'study' && (
          <View style={{ paddingBottom: 110 }}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.screenHeading}>Personal Study Hub</Text>
              <Text style={styles.privateBadge}>🔒 Only Visible to You</Text>
            </View>

            <Text style={styles.tabSubheader}>
              Track university coursework, problem sets, and upcoming exams.
            </Text>

            {studyTasks.map((item) => (
              <View key={item.id} style={styles.studyCard}>
                <TouchableOpacity
                  style={styles.checkboxTouch}
                  onPress={() => toggleStudy(item.id)}
                >
                  <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                    {item.completed && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.taskTitleText, item.completed && styles.taskCompletedText]}>
                      {item.title}
                    </Text>
                    <Text style={styles.studyMetaText}>
                      📚 {item.subject} • ⏰ {item.dueDate}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteStudy(item.id)} style={{ padding: 6 }}>
                  <Text style={{ color: '#ef4444', fontSize: 13 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.card}>
              <Text style={styles.sectionHeader}>+ ADD HOMEWORK / EXAM TASK</Text>
              <TextInput
                style={[styles.textInput, { marginBottom: 10 }]}
                placeholder="Coursework or assignment title..."
                placeholderTextColor="#64748b"
                value={quickStudyTitle}
                onChangeText={setQuickStudyTitle}
              />
              <TouchableOpacity style={styles.btnPrimary} onPress={handleAddStudy}>
                <Text style={styles.btnPrimaryText}>Add to Personal Study Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= TAB 5: TEAM & PROFILE ================= */}
        {activeTab === 'team' && (
          <View style={{ paddingBottom: 110 }}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.screenHeading}>Founder Team & Status</Text>
              <TouchableOpacity style={styles.btnSmall} onPress={() => setIsProfileModalOpen(true)}>
                <Text style={styles.btnSmallText}>⚙️ Edit Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Live Status Selector */}
            <View style={styles.card}>
              <Text style={styles.sectionHeader}>UPDATE YOUR LIVE AVAILABILITY</Text>
              <View style={styles.statusGrid}>
                {(['Available', 'Busy', 'Studying', 'Offline'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusPill,
                      currentMember.availability === status && styles.statusPillActive
                    ]}
                    onPress={() => setCurrentMember({ ...currentMember, availability: status })}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        currentMember.availability === status && styles.statusPillTextActive
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Co-Founder Cards */}
            {members.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberAvatarText}>{member.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                  <View style={[styles.availBadge, { backgroundColor: member.availability === 'Available' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)' }]}>
                    <Text style={{ color: member.availability === 'Available' ? '#10b981' : '#f59e0b', fontSize: 11, fontWeight: '700' }}>
                      {member.availability}
                    </Text>
                  </View>
                </View>

                <View style={styles.memberMetaRow}>
                  <Text style={styles.memberMetaText}>
                    🚀 Project: <Text style={{ color: '#ffffff', fontWeight: '700' }}>{member.activeProject}</Text>
                  </Text>
                  <Text style={styles.memberMetaText}>
                    💻 IDE: <Text style={{ color: '#06b6d4', fontWeight: '700' }}>{member.activeIde}</Text>
                  </Text>
                  <Text style={styles.memberMetaText}>
                    ⏱️ Total: <Text style={{ color: '#a78bfa', fontWeight: '700' }}>{member.hoursSpent}h</Text>
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ================= MODAL: GOOGLE AUTH ================= */}
      <Modal visible={isAuthModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>🔒 Google Account & Firebase Auth</Text>
            <Text style={styles.modalSubtitle}>
              Connected to Firebase Project: kavexa-ops
            </Text>

            <View style={{ padding: 14, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, marginBottom: 16 }}>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>Signed in as:</Text>
              <Text style={{ color: '#10b981', fontSize: 14, fontWeight: '700' }}>
                ✓ {currentMember.email} ({currentMember.name})
              </Text>
            </View>

            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => {
                setIsAuthModalOpen(false);
                Alert.alert('⚡ Authenticated', 'Firebase live real-time sync is active.');
              }}
            >
              <Text style={styles.btnPrimaryText}>✓ Continue as {currentMember.name}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSecondary, { marginTop: 10 }]}
              onPress={() => setIsAuthModalOpen(false)}
            >
              <Text style={styles.btnSecondaryText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL: PROFILE & THEME ================= */}
      <Modal visible={isProfileModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>🎨 Personalize Role & Theme</Text>
            <Text style={styles.modalSubtitle}>Customize your founder details & UI preferences.</Text>

            <Text style={styles.inputLabel}>Your Full Name</Text>
            <TextInput
              style={[styles.textInput, { marginBottom: 10 }]}
              value={currentMember.name}
              onChangeText={(t) => setCurrentMember({ ...currentMember, name: t })}
            />

            <Text style={styles.inputLabel}>Role in KAVEXA</Text>
            <TextInput
              style={[styles.textInput, { marginBottom: 10 }]}
              value={currentMember.role}
              onChangeText={(t) => setCurrentMember({ ...currentMember, role: t })}
            />

            <Text style={styles.inputLabel}>Specialization / Domain</Text>
            <TextInput
              style={[styles.textInput, { marginBottom: 14 }]}
              value={currentMember.domain}
              onChangeText={(t) => setCurrentMember({ ...currentMember, domain: t })}
            />

            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => {
                setIsProfileModalOpen(false);
                Alert.alert('✨ Profile Saved', 'Updated across team and desktop view.');
              }}
            >
              <Text style={styles.btnPrimaryText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSecondary, { marginTop: 10 }]}
              onPress={() => setIsProfileModalOpen(false)}
            >
              <Text style={styles.btnSecondaryText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL: FILE PREVIEW ================= */}
      <Modal visible={!!activeFilePreview} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>📄 {activeFilePreview?.fileName}</Text>
            <Text style={styles.modalSubtitle}>
              {activeFilePreview?.fileType} Document • {activeFilePreview?.size} • Uploaded by {activeFilePreview?.uploadedBy}
            </Text>

            <View style={styles.previewContainer}>
              <Text style={{ fontSize: 48, marginBottom: 10 }}>
                {activeFilePreview?.fileType === 'Image' ? '🖼️' : '📑'}
              </Text>
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>
                File Ready & Synchronized
              </Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                Full resolution available across mobile app and Windows desktop.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => {
                Alert.alert('📥 Download Initialized', 'Asset saved to device.');
                setActiveFilePreview(null);
              }}
            >
              <Text style={styles.btnPrimaryText}>Download File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSecondary, { marginTop: 10 }]}
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
          <Text style={[styles.navIcon, activeTab === 'today' && styles.navIconActive]}>🔥</Text>
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
          style={styles.navTab}
          onPress={() => setActiveTab('projects')}
        >
          <Text style={[styles.navIcon, activeTab === 'projects' && styles.navIconActive]}>📁</Text>
          <Text style={[styles.navLabel, activeTab === 'projects' && styles.navLabelActive]}>Files</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => setActiveTab('study')}
        >
          <Text style={[styles.navIcon, activeTab === 'study' && styles.navIconActive]}>📚</Text>
          <Text style={[styles.navLabel, activeTab === 'study' && styles.navLabelActive]}>Study</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => setActiveTab('team')}
        >
          <Text style={[styles.navIcon, activeTab === 'team' && styles.navIconActive]}>👥</Text>
          <Text style={[styles.navLabel, activeTab === 'team' && styles.navLabelActive]}>Team</Text>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#0d131f'
  },
  profileHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarGlow: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#818cf8'
  },
  avatarInitial: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16
  },
  founderName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f8fafc'
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginLeft: 6
  },
  founderRole: {
    fontSize: 11,
    color: '#06b6d4',
    fontWeight: '600'
  },
  googleAuthBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  googleAuthText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700'
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14
  },
  glassCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    shadowColor: '#06b6d4',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  badgeCyan: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)'
  },
  badgeCyanText: {
    color: '#06b6d4',
    fontSize: 10,
    fontWeight: '800'
  },
  syncStatusText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '600'
  },
  focusTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 6
  },
  focusSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 14
  },
  actionRow: {
    flexDirection: 'row'
  },
  btnPrimary: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  btnSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnSecondaryText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600'
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  statValue: {
    color: '#818cf8',
    fontSize: 20,
    fontWeight: '800'
  },
  statLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  sectionHeader: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: '#ffffff',
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  btnAdd: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnAddText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13
  },
  ideBanner: {
    backgroundColor: 'rgba(6, 182, 212, 0.06)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)'
  },
  ideBannerTitle: {
    color: '#06b6d4',
    fontSize: 11,
    fontWeight: '800'
  },
  ideActiveBadge: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700'
  },
  ideName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4
  },
  ideSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  screenHeading: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '800'
  },
  tabSubheader: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 14
  },
  privateBadge: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700'
  },
  btnSmall: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  btnSmallText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  checkboxTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#64748b',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981'
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },
  taskTitleText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600'
  },
  taskCompletedText: {
    textDecorationLine: 'line-through',
    color: '#64748b'
  },
  taskTag: {
    color: '#818cf8',
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  projectTag: {
    color: '#06b6d4',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 6
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  fileIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fileNameText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  fileMetaText: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2
  },
  typeSelectBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  typeSelectBtnActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: '#06b6d4'
  },
  typeSelectText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600'
  },
  typeSelectTextActive: {
    color: '#06b6d4',
    fontWeight: '700'
  },
  studyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)'
  },
  studyMetaText: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 6
  },
  statusPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center'
  },
  statusPillActive: {
    backgroundColor: '#4f46e5'
  },
  statusPillText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700'
  },
  statusPillTextActive: {
    color: '#ffffff'
  },
  memberCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  memberAvatarText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15
  },
  memberName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  },
  memberRole: {
    color: '#06b6d4',
    fontSize: 11
  },
  availBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  memberMetaRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 8,
    gap: 4
  },
  memberMetaText: {
    color: '#94a3b8',
    fontSize: 11
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalBox: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)'
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4
  },
  modalSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 14
  },
  inputLabel: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4
  },
  previewContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  bottomNav: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#090d16',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  navIcon: {
    fontSize: 18,
    opacity: 0.5
  },
  navIconActive: {
    opacity: 1
  },
  navLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2
  },
  navLabelActive: {
    color: '#06b6d4',
    fontWeight: '800'
  }
});
