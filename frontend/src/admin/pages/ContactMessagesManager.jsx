import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle2, Clock, Archive, Reply, Loader2, RefreshCw } from 'lucide-react';
import { adminService } from '../../api/adminService';

export default function ContactMessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const msgs = await adminService.getContactMessages();
      if (Array.isArray(msgs)) {
        setMessages(msgs);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await adminService.updateMessageStatus(id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      alert('Failed to update message status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await adminService.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'ALL') return true;
    return m.status === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Recruiter & Visitor Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real messages submitted through your public contact form stored in MySQL.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'NEW', 'READ', 'REPLIED', 'ARCHIVED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              filter === st
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st} ({st === 'ALL' ? messages.length : messages.filter((m) => m.status === st).length})
          </button>
        ))}
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs">Fetching inquiries from MySQL...</span>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No messages in this folder</p>
          <p className="text-xs text-slate-400 mt-1">
            When recruiters submit the contact form, their inquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-2xl bg-white border transition-all ${
                msg.status === 'NEW'
                  ? 'border-teal-400 shadow-sm ring-1 ring-teal-400/20'
                  : 'border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{msg.name}</span>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs text-teal-600 hover:underline flex items-center gap-1 font-mono"
                  >
                    <Mail className="w-3 h-3" />
                    {msg.email}
                  </a>
                  {msg.status === 'NEW' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 uppercase tracking-wider">
                      New
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>

              {msg.projectType && (
                <div className="mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    Subject / Type: {msg.projectType}
                  </span>
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </p>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {msg.status !== 'REPLIED' && (
                    <a
                      href={`mailto:${msg.email}?subject=Re:%20Portfolio%20Inquiry&body=Hello%20${encodeURIComponent(
                        msg.name
                      )},%0D%0A%0D%0AThank%20you%20for%20reaching%20out!`}
                      onClick={() => handleStatusUpdate(msg.id, 'REPLIED')}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>
                  )}

                  {msg.status === 'NEW' && (
                    <button
                      onClick={() => handleStatusUpdate(msg.id, 'READ')}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}

                  {msg.status !== 'ARCHIVED' && (
                    <button
                      onClick={() => handleStatusUpdate(msg.id, 'ARCHIVED')}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
