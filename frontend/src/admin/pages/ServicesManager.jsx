import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Layers,
  Monitor,
  Server,
  Database,
  Cpu,
  Layout,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { adminService } from '../../api/adminService';
import { useToast } from '../components/Toast';

const AVAILABLE_ICONS = [
  { name: 'Layout', label: 'UI / UX Design', icon: Layout },
  { name: 'Monitor', label: 'Frontend Development', icon: Monitor },
  { name: 'Layers', label: 'Full-Stack Architecture', icon: Layers },
  { name: 'Server', label: 'Backend APIs', icon: Server },
  { name: 'Cpu', label: 'REST APIs & Logic', icon: Cpu },
  { name: 'Database', label: 'Database Architecture', icon: Database },
];

export default function ServicesManager() {
  const { addToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Layers',
    displayOrder: 1,
    isActive: true,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await adminService.getServices();
      if (Array.isArray(data)) setServices(data);
    } catch (err) {
      console.warn('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setCurrentService(null);
    setFormData({
      title: '',
      description: '',
      icon: 'Layers',
      displayOrder: services.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setCurrentService(s);
    setFormData({
      title: s.title || '',
      description: s.description || '',
      icon: s.icon || 'Layers',
      displayOrder: s.displayOrder || 1,
      isActive: s.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSaving(true);
    try {
      if (currentService) {
        await adminService.updateService(currentService.id, formData);
        addToast(`Service "${formData.title}" updated in MySQL!`, 'success');
      } else {
        await adminService.createService(formData);
        addToast(`Service "${formData.title}" created in MySQL!`, 'success');
      }
      setIsModalOpen(false);
      await fetchServices();
    } catch (err) {
      addToast('Failed to save service: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteService(id);
      setDeleteConfirmId(null);
      addToast('Service deleted from database!', 'info');
      await fetchServices();
    } catch (err) {
      addToast('Failed to delete service', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Services & Solutions Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure technical offerings, architectural services, and competencies in MySQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchServices}
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
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs">Fetching services from MySQL...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(service.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug mb-1.5">{service.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Display Order: #{service.displayOrder}</span>
                <span className="text-teal-600 font-semibold">Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
              {currentService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Saved directly to MySQL database</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Title <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. REST API Development"
                  required
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of technical solution..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {AVAILABLE_ICONS.map((i) => (
                    <option key={i.name} value={i.name}>{i.label} ({i.name})</option>
                  ))}
                </select>
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
            <h4 className="font-bold text-slate-900 text-sm mb-1">Delete Service?</h4>
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
