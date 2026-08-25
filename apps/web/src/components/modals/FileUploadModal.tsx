import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectFileType } from '@kavexa/shared-types';

export const FileUploadModal: React.FC = () => {
  const { isNewFileModalOpen, setIsNewFileModalOpen, createFile, selectedProjectId, projects, currentMember } = useApp();

  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<ProjectFileType>('PDF');
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState('1.2 MB');
  const [projectId, setProjectId] = useState(selectedProjectId || projects[0]?.id || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isNewFileModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Format file size
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMb} MB`);

      // Determine type
      if (file.type.includes('pdf')) setFileType('PDF');
      else if (file.type.includes('image')) setFileType('Image');
      else if (file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) setFileType('PPTX');
      else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) setFileType('DOCX');
      else setFileType('Project Asset');

      const reader = new FileReader();
      reader.onload = (event) => {
        setFileUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    createFile({
      fileName: fileName.trim(),
      fileType,
      fileUrl: fileUrl.trim() || 'https://kavexa.io/assets/' + fileName.trim(),
      fileSize,
      projectId: projectId || (projects[0]?.id ?? 'default_proj'),
      uploadedBy: currentMember.name
    });

    setIsNewFileModalOpen(false);
    setFileName('');
    setFileUrl('');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsNewFileModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UploadCloud size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Upload Project Asset / Document
            </h2>
          </div>
          <button onClick={() => setIsNewFileModalOpen(false)} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* File Picker Drag & Drop Box */}
          <div className="form-group">
            <label className="form-label">Select File From Computer</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed rgba(6, 182, 212, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(6, 182, 212, 0.05)',
                marginBottom: '0.75rem'
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Upload size={24} style={{ color: 'var(--accent-cyan)', marginBottom: '0.4rem' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                {fileName ? `Selected: ${fileName} (${fileSize})` : 'Click to browse files (PDF, DOCX, PPTX, Images, ZIP)'}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">File Display Name</label>
            <input
              type="text"
              placeholder="e.g. StageFlow_PitchDeck_v2.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">File Category</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
                className="form-select"
              >
                <option value="PDF">PDF Document</option>
                <option value="DOCX">DOCX Document</option>
                <option value="PPTX">Presentation PPTX</option>
                <option value="Image">Image Asset</option>
                <option value="Screenshot">Screenshot</option>
                <option value="Project Asset">Project Asset</option>
              </select>
            </div>

            {projects.length > 0 && (
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Project Workspace</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="form-select"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => setIsNewFileModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <UploadCloud size={16} />
              <span>Save File</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
