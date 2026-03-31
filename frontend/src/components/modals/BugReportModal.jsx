import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BugPlay, Lightbulb, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const inputCls =
  'w-full bg-surface/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-400/70 transition-colors text-sm';
const selectCls =
  'w-full bg-[#0d0d14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-400/70 transition-colors appearance-none text-sm';

const INITIAL = { name: '', email: '', issue_title: '', description: '', steps: '', severity: 'medium' };

const BugReportModal = ({ isOpen, onClose, projectName }) => {
  const [reportType, setReportType] = useState('bug');
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const isBug = reportType === 'bug';

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const reset = () => { setForm(INITIAL); setReportType('bug'); setStatus('idle'); };

  const handleClose = () => { onClose(); setTimeout(reset, 300); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Persist locally for the Issue Board
    const issue = {
      project_name: projectName,
      report_type: reportType,
      ...form,
      submitted_at: new Date().toISOString(),
    };
    const stored = JSON.parse(localStorage.getItem('portfolio_issues') || '[]');
    localStorage.setItem('portfolio_issues', JSON.stringify([...stored, issue]));

    // Fire to backend (best-effort)
    try {
      await axios.post(`${API_URL}/bug-report`, {
        project_name: projectName,
        issue_title: form.issue_title,
        description: form.description,
        severity: form.severity,
      });
    } catch (_) { }

    setStatus('success');
    setTimeout(handleClose, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-5"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg flex flex-col glass border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.12)]"
            style={{ maxHeight: 'calc(100dvh - 48px)' }}
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isBug ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
                  {isBug ? <BugPlay className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{isBug ? 'Report a Bug' : 'Suggest a Feature'}</h3>
                  <p className="text-gray-500 text-xs font-mono">{projectName}</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <form id="bug-form" onSubmit={handleSubmit}>
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-4">

                {/* Type toggle */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
                  {[['bug', '🐛 Bug Report'], ['feature', '💡 Feature Request']].map(([t, label]) => (
                    <button key={t} type="button" onClick={() => setReportType(t)}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${reportType === t
                          ? t === 'bug'
                            ? 'bg-red-500/25 text-red-400 border border-red-500/40'
                            : 'bg-primary/25 text-primary border border-primary/40'
                          : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >{label}</button>
                  ))}
                </div>

                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Name <span className="text-gray-600">(optional)</span></label>
                    <input type="text" name="name" value={form.name} onChange={set} className={inputCls} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Email <span className="text-gray-600">(optional)</span></label>
                    <input type="email" name="email" value={form.email} onChange={set} className={inputCls} placeholder="you@example.com" />
                  </div>
                </div>

                {/* Title + Severity */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Title <span className="text-red-400">*</span></label>
                    <input type="text" name="issue_title" value={form.issue_title} onChange={set} required className={inputCls} placeholder="One-line summary…" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Severity</label>
                    <select name="severity" value={form.severity} onChange={set} className={selectCls}>
                      <option value="low">🟢 Low — minor issue</option>
                      <option value="medium">🟡 Medium — partly broken</option>
                      <option value="high">🔴 High — completely broken</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">
                    {isBug ? 'Description' : 'Feature Description'} <span className="text-red-400">*</span>
                  </label>
                  <textarea name="description" required rows={4} value={form.description} onChange={set}
                    className={`${inputCls} resize-none`}
                    placeholder={isBug ? 'What happened? What did you expect?' : 'Describe the feature you would like to see…'}
                  />
                </div>

                {/* Steps — bug only */}
                {isBug && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Steps to Reproduce <span className="text-gray-600">(optional)</span></label>
                    <textarea name="steps" rows={3} value={form.steps} onChange={set}
                      className={`${inputCls} resize-none`}
                      placeholder={'1. Go to…\n2. Click on…\n3. See error…'}
                    />
                  </div>
                )}

              </div>
            </form>

            {/* Sticky footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-white/10 bg-surface/20 rounded-b-3xl">
              <button form="bug-form" type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${isBug
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 disabled:opacity-60'
                    : 'bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 disabled:opacity-60'
                  }`}
              >
                {status === 'idle' && (isBug ? '🐛 Submit Report' : '💡 Submit Request')}
                {status === 'loading' && <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>}
                {status === 'success' && <><CheckCircle2 className="w-4 h-4" /> Submitted — Thank you!</>}
                {status === 'error' && 'Something went wrong — retry'}
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BugReportModal;
