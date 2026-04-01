import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BugPlay, Lightbulb, Loader2, CheckCircle2, Image as ImageIcon, Trash2 } from 'lucide-react';
import axios from 'axios';

const inputCls =
  'w-full bg-surface/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-400/70 transition-colors text-sm font-mono';

const INITIAL = { name: '', email: '', page_feature: '', issue: '', steps: '', title: '', description: '' };

const BugReportModal = ({ isOpen, onClose, projectName }) => {
  const [reportType, setReportType] = useState('bug');
  const [form, setForm] = useState(INITIAL);
  const [screenshots, setScreenshots] = useState([]);
  const [status, setStatus] = useState('idle');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const FORMSPREE_BUG_URL = import.meta.env.VITE_FORMSPREE_BUG_URL;
  const FORMSPREE_FEATURE_URL = import.meta.env.VITE_FORMSPREE_FEATURE_URL;

  const isBug = reportType === 'bug';

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const reset = () => { setForm(INITIAL); setScreenshots([]); setReportType('bug'); setStatus('idle'); };

  const handleClose = () => { onClose(); setTimeout(reset, 300); };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setScreenshots(prev => [...prev, evt.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeScreenshot = (index) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    let payload;
    let targetEndpoint;
    let formspreeUrl;

    if (isBug) {
      payload = {
        report_type: 'bug',
        page_feature: `${projectName} — ${form.page_feature}`,
        name: form.name,
        email: form.email,
        issue: form.issue,
        steps: form.steps,
        screenshots: screenshots.length > 0 ? JSON.stringify(screenshots) : null
      };
      targetEndpoint = `${API_URL}/common-issues`;
      formspreeUrl = FORMSPREE_BUG_URL;
    } else {
      payload = {
        project_name: projectName,
        name: form.name,
        email: form.email,
        title: form.title,
        description: form.description
      };
      targetEndpoint = `${API_URL}/feature-requests`;
      formspreeUrl = FORMSPREE_FEATURE_URL;
    }

    try {
      await axios.post(targetEndpoint, payload);

      if (formspreeUrl) {
         // Sanitizing out screenshots for formspree safety
         const { screenshots: _scr, ...emailPayload } = payload;
         await axios.post(formspreeUrl, {
            _subject: `New ${isBug ? 'Bug' : 'Feature'}: ${projectName}`,
            ...emailPayload
         });
      }
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
            <form id="bug-form" onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-4">

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

              {/* Shared: Name + Email */}
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

              {/* Bug Specific Form */}
              {isBug ? (
                <>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Page or Feature Region <span className="text-red-400">*</span></label>
                    <input type="text" required name="page_feature" value={form.page_feature} onChange={set} className={inputCls} placeholder="e.g. Navigation Header, Login Button" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Defect Description <span className="text-red-400">*</span></label>
                    <textarea required name="issue" rows={3} value={form.issue} onChange={set} className={`${inputCls} resize-none`} placeholder="What actually happened vs what you expected?" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Steps to Reproduce <span className="text-gray-600">(optional)</span></label>
                    <textarea name="steps" rows={2} value={form.steps} onChange={set} className={`${inputCls} resize-none`} placeholder="1. Go to… 2. Click on…" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5" /> Attachments <span className="text-gray-600">(optional)</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {screenshots.map((src, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-lg border border-white/20 overflow-hidden group">
                          <img src={src} className="w-full h-full object-cover" alt="upload snippet" />
                          <button type="button" onClick={() => removeScreenshot(i)} className="absolute top-0.5 right-0.5 bg-red-500/80 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                      <label className="w-16 h-16 rounded-lg border border-dashed border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">
                        <span className="text-xl text-gray-500">+</span>
                        <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" multiple />
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Feature Specific Form */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Title <span className="text-primary">*</span></label>
                    <input type="text" name="title" required value={form.title} onChange={set} className={inputCls} placeholder="One-line summary…" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Feature Description <span className="text-primary">*</span></label>
                    <textarea name="description" required rows={4} value={form.description} onChange={set} className={`${inputCls} resize-none`} placeholder="Describe the feature you would like to see…" />
                  </div>
                </>
              )}
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
