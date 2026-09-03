import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, FileText, Globe, Upload, Loader2, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { uploadService } from '../../api/uploadService';
import { authService } from '../../api/authService';
import { useToast } from '../components/Toast';

export default function SettingsManager() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState({
    siteTitle: 'Dinesh M | Full Stack Developer',
    metaDescription: 'Personal portfolio of Dinesh M - Final-year Computer Science Engineering student specializing in Java, Spring Boot, React, Node.js, and MySQL.',
    resumeUrl: '/Dinesh_M_Resume.pdf',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getSettings();
      if (data) setSettings(data);
    } catch (err) {
      console.warn('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminService.updateSettings(settings);
      addToast('Settings saved to MySQL database successfully!', 'success');
    } catch (err) {
      addToast('Failed to save settings: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      addToast('Please upload a PDF file only', 'error');
      return;
    }

    setUploadingResume(true);
    try {
      const result = await uploadService.uploadResume(file);
      if (result && result.url) {
        setSettings((prev) => ({ ...prev, resumeUrl: result.url }));
        addToast('Resume PDF uploaded and published to Cloudinary successfully!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload resume PDF', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      addToast('Please fill in current and new password', 'error');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('New password and confirmation do not match', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      addToast('New password must be at least 6 characters', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      addToast('Administrator password updated successfully in MySQL!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Global Portfolio Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure SEO metadata, resume asset storage on Cloudinary, and administrator credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving || loading}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* SEO & Meta Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Globe className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Search Engine Optimization (SEO) & Title Tags
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Browser Page Title
            </label>
            <input
              type="text"
              name="siteTitle"
              value={settings.siteTitle || ''}
              onChange={handleChange}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Meta Description (Search Snippet)
            </label>
            <textarea
              name="metaDescription"
              rows={3}
              value={settings.metaDescription || ''}
              onChange={handleChange}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>
        </div>

        {/* Resume PDF File Management via Cloudinary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Official Resume Asset (Cloudinary Raw Storage)
            </h3>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Active Resume URL / Path
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                name="resumeUrl"
                value={settings.resumeUrl || ''}
                onChange={handleChange}
                placeholder="/Dinesh_M_Resume.pdf"
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <label className="px-4 py-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 shrink-0 transition-colors">
                {uploadingResume ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{uploadingResume ? 'Uploading to Cloudinary...' : 'Upload PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[11px] text-slate-400">
              Uploading a new PDF immediately stores it on Cloudinary and updates public download buttons.
            </p>
          </div>
        </div>

        {/* Administrator Security & Password Change */}
        <form onSubmit={handlePasswordChange} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <KeyRound className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Change Administrator Password
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Current password"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all inline-flex items-center gap-1.5"
            >
              {passwordLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
