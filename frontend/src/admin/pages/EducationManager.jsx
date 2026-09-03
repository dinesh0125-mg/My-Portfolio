import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Edit2, Trash2, Calendar, MapPin, X, Loader2, RefreshCw } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { useToast } from '../components/Toast';

export default function EducationManager() {
  const { addToast } = useToast();
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEdu, setCurrentEdu] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: 'Chennai, India',
    startYear: '2023',
    endYear: '2027',
    duration: '2023 – 2027',
    cgpa: '7.41 / 10.0',
    description: '',
    coursework: '',
  });

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const data = await adminService.getEducation();
      if (Array.isArray(data)) setEducationList(data);
    } catch (err) {
      console.warn('Failed to load education:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openAddModal = () => {
    setCurrentEdu(null);
    setFormData({
      degree: '',
      institution: '',
      location: 'Chennai, India',
      startYear: '2023',
      endYear: '2027',
      duration: '2023 – 2027',
      cgpa: '7.41 / 10.0',
      description: '',
      coursework: 'Data Structures, DBMS, Operating Systems, Web Technologies',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrentEdu(item);
    const cw = Array.isArray(item.coursework) ? item.coursework.join(', ') : item.coursework || '';
    setFormData({
      degree: item.degree || '',
      institution: item.institution || '',
      location: item.location || 'Chennai, India',
      startYear: item.startYear || '2023',
      endYear: item.endYear || '2027',
      duration: item.duration || `${item.startYear} – ${item.endYear}`,
      cgpa: item.cgpa || '',
      description: item.description || '',
      coursework: cw,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.degree.trim() || !formData.institution.trim()) return;

    const cwArray = formData.coursework.split(',').map((c) => c.trim()).filter(Boolean);

    const payload = {
      degree: formData.degree,
      institution: formData.institution,
      location: formData.location || 'Chennai, India',
      startYear: formData.startYear || '2023',
      endYear: formData.endYear || '2027',
      duration: formData.duration || `${formData.startYear} – ${formData.endYear}`,
      cgpa: formData.cgpa || '',
      description: formData.description || '',
      coursework: cwArray,
      displayOrder: currentEdu ? currentEdu.displayOrder : educationList.length + 1,
    };

    setIsSaving(true);
    try {
      if (currentEdu) {
        await adminService.updateEducation(currentEdu.id, payload);
        addToast(`Education record "${formData.degree}" updated in MySQL!`, 'success');
      } else {
        await adminService.createEducation(payload);
        addToast(`Education record "${formData.degree}" created in MySQL!`, 'success');
      }
      setIsModalOpen(false);
      await fetchEducation();
    } catch (err) {
      addToast('Failed to save education: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteEducation(id);
      setDeleteConfirmId(null);
      addToast('Education record deleted from database!', 'info');
      await fetchEducation();
    } catch (err) {
      addToast('Failed to delete education record', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Education & Academic History</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure college degree information, Anna University affiliation, and coursework in MySQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchEducation}
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
            <span>Add Education</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs">Fetching education from MySQL...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {educationList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-snug">{item.degree}</h3>
                      <p className="text-xs font-semibold text-teal-700 mt-0.5">{item.institution}</p>
                    </div>
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

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.duration || `${item.startYear} – ${item.endYear}`}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.location}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold text-[10px]">
                    CGPA: {item.cgpa}
                  </span>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">{item.description}</p>
                )}

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Core Coursework:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(item.coursework) ? item.coursework : []).map((cw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {cw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
              {currentEdu ? 'Edit Education Record' : 'Add Education Record'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Saved directly to MySQL database</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Degree Name <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. B.E. Computer Science and Engineering"
                  required
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institution Name <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. J.N.N Institute of Engineering, Chennai"
                  required
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="2023 – 2027"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CGPA
                  </label>
                  <input
                    type="text"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    placeholder="7.41 / 10.0"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Affiliation
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Anna University affiliated engineering curriculum..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Coursework (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.coursework}
                  onChange={(e) => setFormData({ ...formData, coursework: e.target.value })}
                  placeholder="Data Structures, DBMS, Operating Systems"
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
            <h4 className="font-bold text-slate-900 text-sm mb-1">Delete Education Record?</h4>
            <p className="text-xs text-slate-500 mb-4">This will permanently remove the record from MySQL.</p>
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
