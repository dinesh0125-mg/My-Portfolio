import React, { useState, useEffect } from 'react';
import { Save, Eye, RefreshCw, CheckCircle2, ArrowRight, Download, Sparkles, Upload, Loader2 } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { uploadService } from '../../api/uploadService';
import { useToast } from '../components/Toast';

export default function HeroManager() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    subtitle: '',
    description: '',
    badge: '',
    profileImageUrl: '',
    primaryButtonText: 'View My Projects',
    primaryButtonLink: '#projects',
    secondaryButtonText: 'Download Resume',
    secondaryButtonLink: '/Dinesh_M_Resume.pdf',
    resumeUrl: '/Dinesh_M_Resume.pdf',
    location: 'Chennai, India',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    adminService
      .getHero()
      .then((hero) => {
        if (hero) {
          setFormData({
            name: hero.name || '',
            title: hero.title || '',
            subtitle: hero.subtitle || '',
            description: hero.description || '',
            badge: hero.badge || '',
            profileImageUrl: hero.profileImageUrl || '/images/hero-developer.jpg',
            primaryButtonText: hero.primaryButtonText || 'View My Projects',
            primaryButtonLink: hero.primaryButtonLink || '#projects',
            secondaryButtonText: hero.secondaryButtonText || 'Download Resume',
            secondaryButtonLink: hero.secondaryButtonLink || '/Dinesh_M_Resume.pdf',
            resumeUrl: hero.resumeUrl || '/Dinesh_M_Resume.pdf',
            location: hero.location || 'Chennai, India',
          });
        }
      })
      .catch((err) => {
        console.warn('Hero load warning:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const result = await uploadService.uploadProfileImage(file);
      if (result && result.url) {
        setFormData((prev) => ({ ...prev, profileImageUrl: result.url }));
        addToast('Profile photo uploaded to Cloudinary!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload image', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminService.updateHero(formData);
      setIsSaving(false);
      addToast('Hero section updated in database successfully!', 'success');
    } catch (err) {
      setIsSaving(false);
      addToast('Failed to update hero section: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const hero = await adminService.getHero();
      if (hero) setFormData(hero);
      addToast('Reverted to saved database version', 'info');
    } catch (err) {
      addToast('Failed to reload data', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hero Section Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure introductory headlines, primary call-to-actions, and developer portrait settings stored in MySQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || loading}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'Saving to MySQL...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-teal-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Professional Role / Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Professional Title <span className="text-teal-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Status Badge */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Availability Badge Text
            </label>
            <input
              type="text"
              name="badge"
              value={formData.badge || ''}
              onChange={handleChange}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Headline / Subtitle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hero Headline (Subtitle)
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle || ''}
              onChange={handleChange}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hero Description / Bio
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          {/* Profile Photo Upload via Cloudinary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Profile Photo (Upload to Cloudinary or URL)
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                name="profileImageUrl"
                value={formData.profileImageUrl || ''}
                onChange={handleChange}
                placeholder="https://res.cloudinary.com/..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <label className="px-3 py-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 shrink-0 transition-colors">
                {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{uploadingPhoto ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Primary & Secondary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Button Label
              </label>
              <input
                type="text"
                name="primaryButtonText"
                value={formData.primaryButtonText || ''}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Secondary Button Label
              </label>
              <input
                type="text"
                name="secondaryButtonText"
                value={formData.secondaryButtonText || ''}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </form>

        {/* Live Preview Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Real-Time Public Preview</span>
            </h3>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md">Live Preview</span>
          </div>

          {/* Mock Hero Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
              <span>{formData.badge || 'Available for opportunities'}</span>
            </span>

            <div>
              <h4 className="text-xl font-black text-slate-900 leading-tight">
                {formData.name || 'Dinesh M'}
              </h4>
              <p className="text-sm font-bold text-teal-600 mt-0.5">
                {formData.title || 'Full Stack Developer'}
              </p>
            </div>

            <p className="text-xs font-semibold text-slate-700 leading-snug">
              {formData.subtitle || 'Hero Headline'}
            </p>

            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
              {formData.description || 'Description bio'}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1.5 rounded-full bg-teal-600 text-white text-[10px] font-bold">
                {formData.primaryButtonText}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white text-slate-700 border border-slate-300 text-[10px] font-semibold">
                {formData.secondaryButtonText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
