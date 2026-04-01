import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BugPlay, Lightbulb, ChevronDown, Image, ShieldAlert, Loader2, Save } from 'lucide-react';
import axios from 'axios';

const inputCls = "w-full bg-[#0d0d14]/80 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm font-mono shadow-inner";

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({ src, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center cursor-zoom-out"
  >
    <img src={src} alt="Preview" className="max-w-[90vw] max-h-[90vh] rounded-3xl shadow-2xl object-contain border border-white/10" onClick={(e) => e.stopPropagation()} />
  </motion.div>
);

// ── Issue Card ────────────────────────────────────────────────────────────────
const IssueCard = ({ issue, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const isBug = issue.report_type === 'bug';
  const date = issue.created_at ? new Date(issue.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

  let screens = [];
  try {
    if (issue.screenshots) {
      screens = JSON.parse(issue.screenshots);
    }
  } catch(e) {}

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.05 }}
        className="glass rounded-3xl overflow-hidden border border-white/[0.05] shadow-lg"
      >
        <div
          className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
          onClick={() => setExpanded((p) => !p)}
        >
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <span className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isBug ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
              {isBug ? <BugPlay className="w-3.5 h-3.5" /> : <Lightbulb className="w-3.5 h-3.5" />}
              {issue.report_type || 'Anomaly'}
            </span>
            <h3 className="font-bold text-white truncate text-lg tracking-tight">{issue.page_feature || 'Global System Event'}</h3>
          </div>

          <div className="flex items-center gap-6 flex-shrink-0 ml-4">
            <span className="hidden md:block text-xs text-gray-600 font-mono italic">{date}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-8 pt-2 border-t border-white/[0.03] space-y-6 text-sm">
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-4 mt-4">
                  {[
                    ['Reported By', issue.name || 'Anonymous'],
                    ['Email Contact', issue.email || 'None Provided'],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-white/[0.01] p-3 rounded-xl border border-white/[0.02]">
                      <span className="text-gray-600 text-[10px] uppercase font-bold tracking-widest leading-none">{label}</span>
                      <p className="text-gray-300 mt-1 font-medium">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-gray-400 leading-relaxed shadow-inner">
                  <p className="text-[10px] text-cyan-500/70 uppercase font-bold tracking-widest mb-3">Diagnostic Log</p>
                  {issue.issue}
                </div>

                {issue.steps && (
                  <div className="bg-[#050508]/50 border border-white/5 rounded-2xl p-6 text-gray-400 leading-relaxed shadow-inner whitespace-pre-line">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3">Steps to Reproduce</p>
                    {issue.steps}
                  </div>
                )}

                {screens.length > 0 && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5" /> Attached Media ({screens.length})
                    </p>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                      {screens.map((src, i) => (
                        <img key={i} src={src} alt="Evidence snipping" onClick={() => setLightboxSrc(src)} className="h-40 rounded-2xl border border-white/10 cursor-zoom-in flex-shrink-0 hover:scale-[1.03] transition-transform object-cover shadow-lg" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
      </AnimatePresence>
    </>
  );
};

const CommonIssue = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(`${API_URL}/common-issues`, {
           headers: { 'X-Admin-Token': token }
        });
        setIssues(res.data);
      } catch (err) {
        console.error(err);
      } finally {
         setLoading(false);
      }
    };
    fetchIssues();
  }, [API_URL]);

  const filtered = issues.filter((iss) => {
    if (filterType !== 'all' && iss.report_type !== filterType) return false;
    const q = search.toLowerCase();
    if (q && !(iss.page_feature?.toLowerCase().includes(q) || iss.issue?.toLowerCase().includes(q))) return false;
    return true;
  });

  const bugs     = filtered.filter((i) => i.report_type === 'bug').length;
  const featureCount = filtered.filter((i) => i.report_type === 'feature').length;

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/20">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Global Bug Board</h1>
              <span className="ml-2 px-2.5 py-0.5 bg-white/5 border border-white/5 rounded-full text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider">
                {filtered.length} root ticket{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-2">
              🐛 {bugs} bug{bugs !== 1 ? 's' : ''} · 💡 {featureCount} suggestion{featureCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 mb-10 flex flex-wrap gap-4 items-center border border-white/[0.05] shadow-xl">
          <input
            type="text"
            placeholder="Search global issues…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] bg-[#0d0d14]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 transition-all font-mono shadow-inner"
          />

          <div className="flex rounded-xl border border-white/10 overflow-hidden bg-[#0d0d14]/50">
            {[['all','All'],['bug','Bugs'],['feature','Features']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterType(val)}
                className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${filterType === val ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
           <div className="text-center py-24 text-gray-500 flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
              <p className="text-[10px] uppercase tracking-widest font-mono">Syncing Global System Records...</p>
           </div>
        ) : filtered.length === 0 ? (
          <div className="glass border border-white/5 rounded-3xl p-12 text-center text-gray-500 italic">
            Clean system state. No global anomalies detected.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((issue, idx) => (
              <IssueCard key={idx} issue={issue} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonIssue;
