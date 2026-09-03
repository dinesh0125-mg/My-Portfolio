import React, { useState, useEffect } from 'react';
import { Cpu, Plus, Edit2, Trash2, CheckCircle2, X, Star, Layers, Code2, Monitor, Server, Database, Wrench, Loader2, RefreshCw } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { useToast } from '../components/Toast';

const CATEGORY_MAP = {
  'Programming Languages': { id: 'languages', label: 'Programming Languages', icon: Code2 },
  'Frontend': { id: 'frontend', label: 'Frontend Development', icon: Monitor },
  'Backend': { id: 'backend', label: 'Backend Development', icon: Server },
  'Database': { id: 'database', label: 'Database & ORM', icon: Database },
  'Tools & Platforms': { id: 'tools', label: 'Tools & Platforms', icon: Wrench },
};

export default function SkillsManager() {
  const { addToast } = useToast();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming Languages',
    note: '',
    highlight: false,
    displayOrder: 0,
  });

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await adminService.getSkills();
      if (Array.isArray(data)) {
        setSkills(data);
      }
    } catch (err) {
      console.warn('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = (catName = 'Programming Languages') => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: catName,
      note: '',
      highlight: false,
      displayOrder: skills.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || 'Programming Languages',
      note: skill.note || '',
      highlight: !!skill.highlight,
      displayOrder: skill.displayOrder || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingSkill) {
        await adminService.updateSkill(editingSkill.id, formData);
        addToast(`Skill "${formData.name}" updated in MySQL!`, 'success');
      } else {
        await adminService.createSkill(formData);
        addToast(`Skill "${formData.name}" created in MySQL!`, 'success');
      }
      setIsModalOpen(false);
      await fetchSkills();
    } catch (err) {
      addToast('Failed to save skill: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete skill "${name}"?`)) return;
    try {
      await adminService.deleteSkill(id);
      addToast(`Skill "${name}" removed from database!`, 'info');
      await fetchSkills();
    } catch (err) {
      addToast('Failed to delete skill: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  // Group skills by category
  const categoriesList = ['Programming Languages', 'Frontend', 'Backend', 'Database', 'Tools & Platforms'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Technical Skills Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize domain skills, proficiency notes, and recruiter highlight badges in MySQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSkills}
            disabled={loading}
            className="p-2 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs"
            title="Refresh skills"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => openAddModal()}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs">Fetching skills from MySQL...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesList.map((catName) => {
            const catMeta = CATEGORY_MAP[catName] || { icon: Layers };
            const Icon = catMeta.icon;
            const categorySkills = skills.filter((s) => s.category === catName);

            return (
              <div key={catName} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900">{catName}</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {categorySkills.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 transition-colors flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-800 truncate">{skill.name}</span>
                            {skill.highlight && (
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                            )}
                          </div>
                          {skill.note && (
                            <span className="text-[10px] text-slate-400 block truncate">{skill.note}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditModal(skill)}
                            className="p-1 rounded-md text-slate-400 hover:text-teal-700"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id, skill.name)}
                            className="p-1 rounded-md text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => openAddModal(catName)}
                    className="w-full py-1.5 rounded-xl border border-dashed border-slate-200 hover:border-teal-400 text-slate-500 hover:text-teal-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to {catName}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Saved directly to MySQL database</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Skill Name <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Spring Boot, React, Docker"
                  required
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {categoriesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Context / Note
                </label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="e.g. Microservices, REST APIs"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.highlight}
                    onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Mark as Core Highlighted Skill</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
