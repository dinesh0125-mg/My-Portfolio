import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2, ExternalLink, Calendar, CheckCircle2, X, Upload, Loader2, RefreshCw } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { uploadService } from '../../api/uploadService';
import { useToast } from '../components/Toast';

export default function CertificatesManager() {
  const { addToast } = useToast();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCert, setCurrentCert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    year: '2026',
    credentialId: '',
    skills: '',
    certificateUrl: '',
    certificateImageUrl: '',
    certificateImagePublicId: '',
    description: '',
  });

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCertificates();
      if (Array.isArray(data)) setCerts(data);
    } catch (err) {
      console.warn('Failed to load certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const openAddModal = () => {
    setCurrentCert(null);
    setFormData({
      title: '',
      organization: 'Infosys Springboard',
      year: '2026',
      credentialId: '',
      skills: 'Java, OOP, Collections',
      certificateUrl: 'https://infyspringboard.onwingspan.com',
      certificateImageUrl: '',
      certificateImagePublicId: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cert) => {
    setCurrentCert(cert);
    const skillsText = Array.isArray(cert.skills) ? cert.skills.join(', ') : cert.skills || '';
    setFormData({
      title: cert.title || '',
      organization: cert.organization || cert.issuer || '',
      year: cert.year || '2026',
      credentialId: cert.credentialId || '',
      skills: skillsText,
      certificateUrl: cert.certificateUrl || cert.verifyUrl || '',
      certificateImageUrl: cert.certificateImageUrl || cert.image || '',
      certificateImagePublicId: cert.certificateImagePublicId || '',
      description: cert.description || '',
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadService.uploadCertificateImage(file);
      if (res && res.url) {
        setFormData((prev) => ({
          ...prev,
          certificateImageUrl: res.url,
          certificateImagePublicId: res.publicId,
        }));
        addToast('Certificate image uploaded to Cloudinary!', 'success');
      }
    } catch (err) {
      addToast('Failed to upload image: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.organization.trim()) return;

    const skillsArray = formData.skills.split(',').map((s) => s.trim()).filter(Boolean);

    const payload = {
      title: formData.title,
      organization: formData.organization,
      year: formData.year,
      credentialId: formData.credentialId || '',
      skills: skillsArray,
      certificateUrl: formData.certificateUrl || '',
      certificateImageUrl: formData.certificateImageUrl || '',
      certificateImagePublicId: formData.certificateImagePublicId || null,
      description: formData.description || '',
      displayOrder: currentCert ? currentCert.displayOrder : certs.length + 1,
    };

    setIsSaving(true);
    try {
      if (currentCert) {
        await adminService.updateCertificate(currentCert.id, payload);
        addToast(`Certificate "${formData.title}" updated in MySQL!`, 'success');
      } else {
        await adminService.createCertificate(payload);
        addToast(`Certificate "${formData.title}" created in MySQL!`, 'success');
      }
      setIsModalOpen(false);
      await fetchCertificates();
    } catch (err) {
      addToast('Failed to save certificate: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteCertificate(id);
      setDeleteConfirmId(null);
      addToast('Certificate deleted from database and Cloudinary!', 'info');
      await fetchCertificates();
    } catch (err) {
      addToast('Failed to delete certificate', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Certificates & Accreditations</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage verified credentials from Infosys Springboard and CodeTantra with Cloudinary images in MySQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCertificates}
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
            <span>Add Certificate</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs">Fetching certificates from MySQL...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {cert.organization || cert.issuer}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{cert.year}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(cert)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(cert.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">{cert.title}</h3>
                {cert.credentialId && (
                  <p className="text-[10px] font-mono text-slate-400 mb-2">ID: {cert.credentialId}</p>
                )}

                <div className="flex flex-wrap gap-1 mt-2">
                  {(Array.isArray(cert.skills) ? cert.skills : []).map((sk) => (
                    <span key={sk} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {(cert.certificateUrl || cert.verifyUrl) && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <a
                    href={cert.certificateUrl || cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-teal-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
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
              {currentCert ? 'Edit Certificate' : 'Add New Certificate'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Saved directly to MySQL database</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Certificate Title <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Java In-Depth: Become a Complete Java Engineer"
                  required
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Issuer / Organization <span className="text-teal-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Infosys Springboard"
                    required
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Year Completed
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Credential ID
                </label>
                <input
                  type="text"
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                  placeholder="e.g. INFY-JAVA-2026"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Skills Covered (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Java, OOP, Collections, Multithreading"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Verification URL
                </label>
                <input
                  type="url"
                  value={formData.certificateUrl}
                  onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Cloudinary Certificate Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Certificate Image (Cloudinary)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={formData.certificateImageUrl}
                    onChange={(e) => setFormData({ ...formData, certificateImageUrl: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
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
            <h4 className="font-bold text-slate-900 text-sm mb-1">Delete Certificate?</h4>
            <p className="text-xs text-slate-500 mb-4">This will permanently remove the record from MySQL and Cloudinary.</p>
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
