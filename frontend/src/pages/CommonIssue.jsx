import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BugPlay, Lightbulb, ChevronDown, Image, ExternalLink, ShieldAlert, LogOut, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({ src, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center cursor-zoom-out"
  >
    <img src={src} alt="Preview" className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl object-contain" onClick={(e) => e.stopPropagation()} />
  </motion.div>
);

// ── Issue Card ────────────────────────────────────────────────────────────────
const IssueCard = ({ issue, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const isBug = issue.report_type === 'bug';
  const date = issue.created_at ? new Date(issue.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

  // Parse Screenshots
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
        className="glass rounded-2xl overflow-hidden border border-white/10"
      >
        <div
          className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setExpanded((p) => !p)}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isBug ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
              {isBug ? <BugPlay className="w-3.5 h-3.5" /> : <Lightbulb className="w-3.5 h-3.5" />}
              {isBug ? 'Bug' : 'Feature'}
            </span>
            <h3 className="font-semibold text-white truncate">{issue.page_feature || 'Untitled Component'}</h3>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0 ml-4">
            <span className="hidden md:block text-xs text-gray-500 font-mono">{date}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 border-t border-white/10 space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Reported By</span>
                    <p className="text-gray-200 mt-0.5">{issue.name || 'Anonymous'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Email Contact</span>
                    <p className="text-gray-200 mt-0.5 font-mono text-xs">{issue.email || 'None Provided'}</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 text-gray-300 text-sm leading-relaxed">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Issue Description</p>
                  {issue.issue}
                </div>

                {issue.steps && (
                  <div className="bg-white/5 rounded-xl p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Steps to Reproduce</p>
                    {issue.steps}
                  </div>
                )}

                {screens.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5" /> Attached Screenshots ({screens.length})
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {screens.map((src, i) => (
                        <img key={i} src={src} alt="Snipped UI Bug" onClick={() => setLightboxSrc(src)} className="h-36 rounded-lg border border-white/10 cursor-zoom-in flex-shrink-0 hover:scale-105 transition-transform object-cover" />
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
  const navigate = useNavigate();

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
  const features = filtered.filter((i) => i.report_type === 'feature').length;

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10 bg-[#050508]">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-6 h-6 text-cyan-400" />
              <h1 className="text-3xl font-bold text-white">Global Issue Board</h1>
              <span className="ml-2 px-2.5 py-1 bg-white/10 rounded-full text-xs text-gray-400 font-mono">
                {filtered.length} root ticket{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-gray-500 text-sm font-mono">
              🐛 {bugs} bug{bugs !== 1 ? 's' : ''} · 💡 {features} feature request{features !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { localStorage.removeItem('adminToken'); navigate('/login'); }}
              className="flex items-center gap-1.5 text-sm text-red-500 border border-red-500/40 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
            <Link
              to="/issues"
              className="flex items-center gap-1.5 text-sm text-primary border border-primary/40 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Private Issues
            </Link>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 mb-6 flex flex-wrap gap-4 items-center border border-white/10">
          <input
            type="text"
            placeholder="Search global issues…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] bg-surface/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />

          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            {[['all','All'],['bug','Bugs'],['feature','Features']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterType(val)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${filterType === val ? 'bg-cyan-500/30 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
           <div className="text-center py-24 text-gray-400 flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-cyan-400" />
              Syncing Global Server Tickets...
           </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <div className="text-5xl mb-4 text-gray-600">📋</div>
            <p className="text-lg">No global issues cataloged</p>
            <p className="text-sm mt-1">Generic tickets submitted from the /report portal land here.</p>
          </div>
        ) : (
          <div className="space-y-3">
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
