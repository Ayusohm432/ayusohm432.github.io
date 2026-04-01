import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BugPlay, Lightbulb, Loader2, CheckCircle2, Image as ImageIcon, X, Trash2, Home } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const inputCls = "w-full bg-surface/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors text-sm font-mono";

const INITIAL = { name: '', email: '', page_feature: '', issue: '', steps: '' };

const Report = () => {
  const { projectSlug } = useParams();
  
  const [reportType, setReportType] = useState('bug');
  const [form, setForm] = useState(INITIAL);
  const [screenshots, setScreenshots] = useState([]);
  const [status, setStatus] = useState('idle');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const FORMSPREE_BUG_URL = import.meta.env.VITE_FORMSPREE_BUG_URL;
  const FORMSPREE_FEATURE_URL = import.meta.env.VITE_FORMSPREE_FEATURE_URL;

  const isBug = reportType === 'bug';
  const targetLabel = projectSlug ? projectSlug.replace(/-/g, ' ').toUpperCase() : 'PORTFOLIO SYSTEM';

  // Handle URL feature toggle (?feature)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('feature')) setReportType('feature');
  }, []);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

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

    // 1. Compile Payload
    const payload = {
      report_type: reportType,
      page_feature: `${targetLabel} — ${form.page_feature}`,
      name: form.name,
      email: form.email,
      issue: form.issue,
      steps: isBug ? form.steps : null,
      screenshots: screenshots.length > 0 ? JSON.stringify(screenshots) : null
    };

    try {
      // 2. Transmit to Backend Common Issues Table
      await axios.post(`${API_URL}/common-issues`, payload);

      // 3. Formspree Native Email
      const formspreeUrl = isBug ? FORMSPREE_BUG_URL : FORMSPREE_FEATURE_URL;
      if (formspreeUrl) {
         const { screenshots, ...emailPayload } = payload;
         await axios.post(formspreeUrl, {
            _subject: `New ${isBug ? 'Bug' : 'Feature'} — ${targetLabel}`,
            ...emailPayload
         });
      }

      setStatus('success');
      setForm(INITIAL);
      setScreenshots([]);
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen pt-28 px-5 pb-20 relative flex justify-center">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 bg-[#050508]">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-10">
           <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3 shadow-lg shadow-black/20 backdrop-blur-md">
             <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse blur-[2px] absolute"></div>
                <div className="w-2 h-2 bg-red-400 rounded-full relative z-10"></div>
             </div>
             <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                Target <span className="text-white/30 mx-1.5">•</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-sm">{targetLabel}</span>
             </span>
           </div>
           <Link to="/" className="flex items-center gap-1.5 text-sm text-primary hover:text-white px-4 py-2 rounded-xl transition-colors">
             <Home className="w-4 h-4" /> Home
           </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="mb-8 relative z-10 text-center">
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isBug ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
              {isBug ? <BugPlay className="w-8 h-8" /> : <Lightbulb className="w-8 h-8" />}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{isBug ? 'Report a Bug' : 'Suggest a Feature'}</h1>
            <p className="text-gray-400 text-sm">Fill in the details below to submit a ticket automatically.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10">
              <button type="button" onClick={() => setReportType('bug')} className={`py-2 rounded-lg text-sm font-medium transition-all ${isBug ? 'bg-red-500/25 text-red-400 border border-red-500/40 shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}>
                🐛 Defect / Bug
              </button>
              <button type="button" onClick={() => setReportType('feature')} className={`py-2 rounded-lg text-sm font-medium transition-all ${!isBug ? 'bg-primary/25 text-primary border border-primary/40 shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}>
                💡 Feature Request
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Name <span className="text-gray-600">(Optional)</span></label>
                <input type="text" name="name" value={form.name} onChange={set} className={inputCls} placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Email <span className="text-gray-600">(Optional)</span></label>
                <input type="email" name="email" value={form.email} onChange={set} className={inputCls} placeholder="your@email.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Page or Feature Region <span className="text-red-400">*</span></label>
              <input type="text" required name="page_feature" value={form.page_feature} onChange={set} className={inputCls} placeholder="e.g. Navigation Header, Student Login Model..." />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-semibold">{isBug ? 'Defect Description' : 'Feature Description'} <span className="text-red-400">*</span></label>
              <textarea required name="issue" value={form.issue} onChange={set} rows={4} className={`${inputCls} resize-none`} placeholder={isBug ? "What actually happened vs what you expected?" : "Describe your idea and the core functionality…"} />
            </div>

            <AnimatePresence>
              {isBug && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-1.5 overflow-hidden">
                  <label className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Steps to Reproduce</label>
                  <textarea name="steps" value={form.steps} onChange={set} rows={3} className={`${inputCls} resize-none`} placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..." />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" /> Attachments <span className="text-gray-600">(Optional)</span>
              </label>
              
              <div className="flex gap-3 flex-wrap">
                {screenshots.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl border border-white/20 overflow-hidden group">
                    <img src={src} className="w-full h-full object-cover" alt="upload snippet" />
                    <button type="button" onClick={() => removeScreenshot(i)} className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-3xl text-gray-500">+</span>
                  <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" multiple />
                </label>
              </div>
            </div>

            <button type="submit" disabled={status === 'loading' || status === 'success'} className={`w-full mt-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isBug ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'} disabled:opacity-50`}>
              {status === 'idle' && (isBug ? 'Submit Bug Report' : 'Submit Feature Request')}
              {status === 'loading' && <><Loader2 className="w-5 h-5 animate-spin" /> Transmitting...</>}
              {status === 'success' && <><CheckCircle2 className="w-5 h-5" /> Submited Securely</>}
              {status === 'error' && 'Transmission Failed / Retry'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Report;
