import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Search,
  CheckCircle2,
  X,
  Star,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  Upload,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { GithubIcon } from '../../components/Icons';
import { adminService } from '../../api/adminService';
import { uploadService } from '../../api/uploadService';
import { useToast } from '../components/Toast';

export default function ProjectsManager() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    shortDescription: '',
    description: '',
    problemSolved: '',
    myContribution: '',
    technologies: '',
    githubUrl: '',
    liveDemoUrl: '',
    imageUrl: '',
    imagePublicId: '',
    featured: false,
    displayOrder: 0,
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await adminService.getProjects();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (err) {
      console.warn('Failed to load projects from MySQL:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    const techs = Array.isArray(p.technologies) ? p.technologies : [];
    return (
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      techs.some((t) => t.toLowerCase().includes(q))
    );
  });

  const openAddModal = () => {
    setCurrentProject(null);
    setFormData({
      title: '',
      category: 'E-Commerce',
      shortDescription: '',
      description: '',
      problemSolved: '',
      myContribution: '',
      technologies: 'React, Java, Spring Boot, MySQL',
      githubUrl: 'https://github.com',
      liveDemoUrl: '',
      imageUrl: '/images/project-agriculture.jpg',
      imagePublicId: '',
      featured: false,
      displayOrder: projects.length + 1,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditModal = (proj) => {
    setCurrentProject(proj);
    const techs = Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || '';
    setFormData({
      title: proj.title || '',
      category: proj.category || 'Full Stack',
      shortDescription: proj.shortDescription || proj.tagline || '',
      description: proj.description || '',
      problemSolved: proj.problemSolved || '',
      myContribution: proj.myContribution || '',
      technologies: techs,
      githubUrl: proj.githubUrl || '',
      liveDemoUrl: proj.liveDemoUrl || proj.liveUrl || '',
      imageUrl: proj.imageUrl || proj.image || '',
      imagePublicId: proj.imagePublicId || '',
      featured: !!proj.featured,
      displayOrder: proj.displayOrder || 0,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openViewModal = (proj) => {
    setCurrentProject(proj);
    setIsViewOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadService.uploadProjectImage(file);
      if (res && res.url) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: res.url,
          imagePublicId: res.publicId,
        }));
        addToast('Project image uploaded to Cloudinary!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Project title is required';
    if (!formData.category.trim()) errs.category = 'Category is required';
    if (!formData.shortDescription.trim()) errs.shortDescription = 'Short description is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.technologies.trim()) errs.technologies = 'At least one technology is required';
    return errs;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const projectPayload = {
      title: formData.title,
      category: formData.category,
      shortDescription: formData.shortDescription,
      description: formData.description,
      problemSolved: formData.problemSolved || '',
      myContribution: formData.myContribution || '',
      imageUrl: formData.imageUrl || '/images/project-agriculture.jpg',
      imagePublicId: formData.imagePublicId || null,
      githubUrl: formData.githubUrl || '',
      liveDemoUrl: formData.liveDemoUrl || '',
      featured: !!formData.featured,
      displayOrder: Number(formData.displayOrder) || 0,
      technologies: techArray,
    };

    setIsSaving(true);
    try {
      if (currentProject) {
        await adminService.updateProject(currentProject.id, projectPayload);
        addToast(`Project "${formData.title}" updated in MySQL!`, 'success');
      } else {
        await adminService.createProject(projectPayload);
        addToast(`Project "${formData.title}" created in MySQL!`, 'success');
      }
      setIsFormOpen(false);
      await fetchProjects();
    } catch (err) {
      addToast('Error saving project: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteProject(id);
      setDeleteConfirmId(null);
      addToast('Project deleted from database and Cloudinary!', 'info');
      await fetchProjects();
    } catch (err) {
      addToast('Failed to delete project: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Project Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Database-driven flagship projects stored in MySQL with Cloudinary mockups.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Refresh */}
          <button
            onClick={fetchProjects}
            disabled={loading}
            className="p-2 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs"
            title="Refresh from MySQL"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* View Toggle */}
          <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, category, or tech..."
            className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredProjects.length} of {projects.length} projects
        </span>
      </div>

      {/* Main Content Area: Table View or Grid View */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs">Fetching projects from MySQL database...</span>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Tech Stack</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-teal-700 font-bold shrink-0">
                          <FolderKanban className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900">{proj.title}</span>
                          <span className="block text-[10px] text-slate-400 line-clamp-1">{proj.shortDescription || proj.tagline}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {proj.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(Array.isArray(proj.technologies) ? proj.technologies : []).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-teal-50 text-teal-800 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {proj.featured ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Flagship</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Standard</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openViewModal(proj)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="View Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(proj)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(proj.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 uppercase tracking-wider">
                    {proj.category}
                  </span>
                  {proj.featured && (
                    <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">{proj.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{proj.shortDescription || proj.tagline}</p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {(Array.isArray(proj.technologies) ? proj.technologies : []).map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => openViewModal(proj)}
                  className="text-teal-700 hover:underline font-semibold text-[11px]"
                >
                  View Details
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(proj)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(proj.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl p-4 sm:p-6 relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
              {currentProject ? 'Edit Project' : 'Add New Project'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Fields are synchronized directly with MySQL database tables.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Title <span className="text-teal-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Smart Agriculture Marketplace"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {formErrors.title && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.title}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category <span className="text-teal-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. E-Commerce, Workflow Management"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Short Tagline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Short Tagline <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence summary of the project"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Comprehensive Description <span className="text-teal-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="In-depth explanation of system features and architecture..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Problem Solved */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Problem Solved
                </label>
                <textarea
                  rows={2}
                  value={formData.problemSolved}
                  onChange={(e) => setFormData({ ...formData, problemSolved: e.target.value })}
                  placeholder="What specific issue does this application resolve?"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* My Contribution */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  My Contribution & Role
                </label>
                <textarea
                  rows={2}
                  value={formData.myContribution}
                  onChange={(e) => setFormData({ ...formData, myContribution: e.target.value })}
                  placeholder="Specific modules, APIs, schemas, or components you built..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Technologies (Comma Separated) <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Java, Spring Boot, MySQL, CSS"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Cloudinary Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project Image / Mockup (Cloudinary)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/images/project-agriculture.jpg or https://res.cloudinary.com/..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <label className="px-3 py-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 shrink-0 transition-colors">
                    {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* GitHub & Live URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveDemoUrl}
                    onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Mark as Featured Flagship Project</span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? 'Saving...' : 'Save to MySQL'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {isViewOpen && currentProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsViewOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
              {currentProject.category}
            </span>

            <h3 className="text-lg font-bold text-slate-900 mt-2">{currentProject.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{currentProject.shortDescription}</p>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Description:</span>
                <p className="text-slate-600 leading-relaxed">{currentProject.description}</p>
              </div>

              {currentProject.problemSolved && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Problem Solved:</span>
                  <p className="text-slate-600 leading-relaxed">{currentProject.problemSolved}</p>
                </div>
              )}

              {currentProject.myContribution && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">My Contribution:</span>
                  <p className="text-slate-600 leading-relaxed">{currentProject.myContribution}</p>
                </div>
              )}

              <div>
                <span className="font-bold text-slate-700 block mb-1">Technologies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(currentProject.technologies) ? currentProject.technologies : []).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-semibold text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl">
            <h4 className="font-bold text-slate-900 text-sm mb-1">Delete Project Record?</h4>
            <p className="text-xs text-slate-500 mb-4">
              This will permanently remove the project from MySQL and clean up Cloudinary assets.
            </p>
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
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
