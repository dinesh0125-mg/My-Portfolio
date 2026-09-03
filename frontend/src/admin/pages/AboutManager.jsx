import React, { useState, useEffect } from 'react';
import { Save, Eye, RefreshCw, Plus, Trash2, CheckCircle2, Layers, Loader2 } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { useToast } from '../components/Toast';

export default function AboutManager() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    heading: '',
    description: '',
    summaryPoints: [],
    highlights: [],
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAbout = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAbout();
      if (data) {
        setFormData({
          heading: data.heading || '',
          description: data.description || '',
          summaryPoints: Array.isArray(data.additionalInfo) ? data.additionalInfo : [],
          highlights: Array.isArray(data.highlights) ? data.highlights : [],
        });
      }
    } catch (err) {
      console.warn('Failed to load about data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePointChange = (idx, value) => {
    const updated = [...formData.summaryPoints];
    updated[idx] = value;
    setFormData((prev) => ({ ...prev, summaryPoints: updated }));
  };

  const handleAddPoint = () => {
    setFormData((prev) => ({
      ...prev,
      summaryPoints: [...(prev.summaryPoints || []), 'New engineering contribution highlight'],
    }));
  };

  const handleDeletePoint = (idx) => {
    setFormData((prev) => ({
      ...prev,
      summaryPoints: prev.summaryPoints.filter((_, i) => i !== idx),
    }));
  };

  const handleHighlightChange = (idx, field, value) => {
    const updated = [...formData.highlights];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData((prev) => ({ ...prev, highlights: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminService.updateAbout({
        heading: formData.heading,
        description: formData.description,
        additionalInfo: formData.summaryPoints,
        highlights: formData.highlights,
      });
      addToast('About section updated in MySQL database!', 'success');
    } catch (err) {
      addToast('Failed to update about section: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">About Section Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure full-stack developer narrative, key summary bullet points, and 4 highlight cards in MySQL.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving || loading}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Introduction & Core Narrative
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Heading <span className="text-teal-600">*</span>
              </label>
              <input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Professional Bio & Academic Background
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
          </div>

          {/* Key Summary Highlights */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Key Summary Highlights (Checklist)
              </h3>
              <button
                type="button"
                onClick={handleAddPoint}
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {formData.summaryPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 w-4 text-center">{idx + 1}.</span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handlePointChange(idx, e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePoint(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Professional Highlight Cards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              4 Highlight Competency Cards
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.highlights.map((card, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Card #{idx + 1}</span>
                    <span className="text-[10px] font-mono text-teal-600">{card.icon || 'Layers'}</span>
                  </div>

                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleHighlightChange(idx, 'title', e.target.value)}
                    placeholder="Card Title"
                    className="w-full text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />

                  <textarea
                    rows={3}
                    value={card.description || card.desc}
                    onChange={(e) => handleHighlightChange(idx, 'description', e.target.value)}
                    placeholder="Card description..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Live Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Real-Time About Preview</span>
            </h3>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md">Live Output</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h4 className="text-base font-bold text-slate-900 leading-snug">
              {formData.heading}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
              {formData.description}
            </p>

            <div className="pt-2 space-y-1.5">
              {formData.summaryPoints.slice(0, 3).map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
