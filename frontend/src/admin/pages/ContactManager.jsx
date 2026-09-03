import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Save, RefreshCw, Eye, CheckCircle2, Loader2 } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../../components/Icons';
import { adminService } from '../../api/adminService';
import { useToast } from '../components/Toast';

export default function ContactManager() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchContact = async () => {
    setLoading(true);
    try {
      const data = await adminService.getContactInfo();
      if (data) {
        setFormData({
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
        });
      }
    } catch (err) {
      console.warn('Failed to load contact channels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminService.updateContactInfo(formData);
      addToast('Recruiter contact details saved to MySQL database!', 'success');
    } catch (err) {
      addToast('Failed to update contact info: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Contact Channels Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure direct recruiter reachability channels, email, phone, location, and developer social links in MySQL.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving || loading}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaving ? 'Saving...' : 'Save Contact Details'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Primary Email Address <span className="text-teal-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone & WhatsApp <span className="text-teal-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Location City & Country
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              LinkedIn Profile URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LinkedinIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              GitHub Profile URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <GithubIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </form>

        {/* Live Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Public Contact Preview</span>
            </h3>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md">Live Output</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Email</span>
                <span className="text-xs font-semibold text-slate-900 truncate block">{formData.email}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Phone</span>
                <span className="text-xs font-semibold text-slate-900 truncate block">{formData.phone}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Location</span>
                <span className="text-xs font-semibold text-slate-800 truncate block">{formData.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
