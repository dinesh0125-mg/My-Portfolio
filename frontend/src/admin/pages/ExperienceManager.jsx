import React, { useState, useEffect } from 'react';
import { History, Plus, Edit2, Trash2, Calendar, MapPin, CheckCircle2, X, Loader2, RefreshCw } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { useToast } from '../components/Toast';

export default function ExperienceManager() {
  const { addToast } = useToast();
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExp, setCurrentExp] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
    period: '',
    location: 'Chennai, India',
    summary: '',
    responsibilities: '',
    technologies: '',
  });

  const fetchExperience = async () => {
    setLoading(true);
    try {
      const data = await adminService.getExperience();
      if (Array.isArray(data)) setExperience(data);
    } catch (err) {
      console.warn('Failed to load experience:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const openAddModal = () => {
    setCurrentExp(null);
    setFormData({
      jobTitle: '',
      company: '',
      startDate: 'Dec 2024',
      endDate: 'Feb 2025',
      period: 'Dec 2024 – Feb 2025',
      location: 'Chennai, India',
      summary: '',
      responsibilities: 'Developed responsive web components.\nCollaborated on database queries and REST APIs.',
      technologies: 'React, Node.js, Python, MySQL',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrentExp(item);
    const resp = Array.isArray(item.responsibilities) ? item.responsibilities.join('\n') : item.responsibilities || '';
    const techs = Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies || '';
    setFormData({
      jobTitle: item.jobTitle || item.role || '',
      company: item.company || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      period: item.period || '',
      location: item.location || 'Chennai, India',
      summary: item.summary || '',
      responsibilities: resp,
      technologies: techs,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jobTitle.trim() || !formData.company.trim()) return;

    const respArray = formData.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean);
    const techArray = formData.technologies.split(',').map((t) => t.trim()).filter(Boolean);

    const payload = {
      jobTitle: formData.jobTitle,
      company: formData.company,
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      period: formData.period || `${formData.startDate} – ${formData.endDate}`,
      location: formData.location || 'Chennai, India',
      summary: formData.summary || '',
      responsibilities: respArray,
      technologies: techArray,
      displayOrder: currentExp ? currentExp.displayOrder : experience.length + 1,
    };

    setIsSaving(true);
    try {
      if (currentExp) {
        await adminService.updateExperience(currentExp.id, payload);
        addToast(`Experience at "${formData.company}" updated in MySQL!`, 'success');
      } else {
        await adminService.createExperience(payload);
        addToast(`Experience at "${formData.company}" added to MySQL!`, 'success');
      }
      setIsModalOpen(false);
      await fetchExperience();
    } catch (err) {
      addToast('Failed to save experience: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteExperience(id);
      setDeleteConfirmId(null);
      addToast('Experience deleted from database!', 'info');
      await fetchExperience();
    } catch (err) {
      addToast('Failed to delete experience', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Work & Internship Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Document verified engineering internships and responsibilities stored in MySQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchExperience}
            disabled={loading}
            className="p-2 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs"
            title="Refresh from MySQL"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Internship</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs">Fetching experience from MySQL...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {experience.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">{item.jobTitle || item.role}</h3>
                    <p className="text-xs font-semibold text-teal-700 mt-0.5">{item.company}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.period}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.location}</span>
                  </span>
                </div>

                {item.summary && (
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">{item.summary}</p>
                )}

                <div className="space-y-1.5 pt-2 border-t border-slate-50">
                  {(Array.isArray(item.responsibilities) ? item.responsibilities : []).map((resp, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                {(Array.isArray(item.technologies) ? item.technologies : []).map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-semibold text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
              {currentExp ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Saved directly to MySQL database</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Role / Title <span className="text-teal-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="e.g. Java Intern"
                    required
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company Name <span className="text-teal-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. VCodez"
                    required
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Period String
                  </label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="e.g. Dec 2024 – Feb 2025"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Summary / Overview
                </label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Overview of internship work..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Key Responsibilities (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  placeholder="Developed responsive features...&#10;Maintained MySQL queries..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Java, Spring Boot, MySQL"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save to MySQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl">
            <h4 className="font-bold text-slate-900 text-sm mb-1">Delete Experience?</h4>
            <p className="text-xs text-slate-500 mb-4">This will remove the entry from MySQL permanently.</p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
