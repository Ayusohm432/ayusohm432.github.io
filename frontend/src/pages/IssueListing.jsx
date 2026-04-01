import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BugPlay, Lightbulb, ChevronDown, Image, Trash2, ExternalLink, Monitor, Smartphone, Tablet, ShieldAlert, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

// ── helpers ──────────────────────────────────────────────────────────────────
const ALL_PROJECTS = [
  'Feedback Management System',
  'AI Skills Gap Analyzer',
  'AgenticGoKit',
  'StegoShield',
  'Next-Gen Portfolio',
  'MediSync — Healthcare Management System',
  'Predictive Analysis in AI Model Training',
];

const SEVERITY_MAP = {
  high:   { label: 'High',   cls: 'bg-red-500/20 text-red-400 border border-red-500/40' },
  medium: { label: 'Medium', cls: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' },
  low:    { label: 'Low',    cls: 'bg-green-500/20 text-green-400 border border-green-500/40' },
};

const DeviceIcon = ({ device }) => {
  if (!device) return null;
  const d = device.toLowerCase();
  if (d.includes('mobile'))  return <Smartphone className="w-4 h-4" />;
  if (d.includes('tablet'))  return <Tablet className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
};

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
const IssueCard = ({ issue, index, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const isBug = issue.report_type === 'bug';
  const sev = SEVERITY_MAP[issue.severity] || SEVERITY_MAP.low;
  const date = issue.submitted_at ? new Date(issue.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.06 }}
        className="glass rounded-2xl overflow-hidden border border-white/10"
      >
        {/* Header row */}
        <div
          className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setExpanded((p) => !p)}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isBug ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
              {isBug ? <BugPlay className="w-3.5 h-3.5" /> : <Lightbulb className="w-3.5 h-3.5" />}
              {isBug ? 'Bug' : 'Feature'}
            </span>
            <h3 className="font-semibold text-white truncate">{issue.issue_title || issue.page_feature || 'Untitled'}</h3>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0 ml-4">
            {isBug && (
              <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${sev.cls}`}>{sev.label}</span>
            )}
            <span className="hidden md:block text-xs text-gray-500 font-mono">{date}</span>
            <div className="flex items-center gap-2 text-gray-500">
              <DeviceIcon device={issue.device} />
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Expanded body */}
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
                {/* Meta grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
                  {[
                    ['Project', issue.project_name],
                    ['Reported by', issue.name ? `${issue.name}${issue.email ? ` (${issue.email})` : ''}` : 'Anonymous'],
                    ['Submitted', date],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span className="text-gray-500 text-xs uppercase tracking-wider">{label}</span>
                      <p className="text-gray-200 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="bg-white/5 rounded-xl p-4 text-gray-300 text-sm leading-relaxed">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Description</p>
                  {issue.description}
                </div>

                {/* Steps */}
                {issue.steps && (
                  <div className="bg-white/5 rounded-xl p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Steps to Reproduce</p>
                    {issue.steps}
                  </div>
                )}

                {/* Screenshots */}
                {issue.screenshots && issue.screenshots.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5" /> Screenshots ({issue.screenshots.length})
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {issue.screenshots.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`screenshot-${i}`}
                          onClick={() => setLightboxSrc(src)}
                          className="h-36 rounded-lg border border-white/10 cursor-zoom-in flex-shrink-0 hover:scale-105 transition-transform object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Delete */}
                <button
                  onClick={() => onDelete(index)}
                  className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 transition-colors mt-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete report
                </button>
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

// ── Page ──────────────────────────────────────────────────────────────────────
const IssueListing = () => {
  const [issues, setIssues]           = useState([]);
  const [filterProject, setFilterProject] = useState('All');
  const [filterType, setFilterType]   = useState('all');
  const [search, setSearch]           = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('portfolio_issues') || '[]');
    setIssues(stored);
  }, []);

  const handleDelete = (globalIdx) => {
    const updated = issues.filter((_, i) => i !== globalIdx);
    setIssues(updated);
    localStorage.setItem('portfolio_issues', JSON.stringify(updated));
  };

  const filtered = issues.filter((iss) => {
    if (filterProject !== 'All' && iss.project_name !== filterProject) return false;
    if (filterType !== 'all' && iss.report_type !== filterType) return false;
    const q = search.toLowerCase();
    if (q && !(iss.issue_title?.toLowerCase().includes(q) || iss.description?.toLowerCase().includes(q))) return false;
    return true;
  });

  const bugs     = filtered.filter((i) => i.report_type === 'bug').length;
  const features = filtered.filter((i) => i.report_type === 'feature').length;

  return (
    <div className="min-h-screen relative">
      {/* animated bg */}
      <div className="fixed inset-0 -z-10 bg-[#050508]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-6 h-6 text-red-400" />
              <h1 className="text-3xl font-bold text-white">Issue Board</h1>
              <span className="ml-2 px-2.5 py-1 bg-white/10 rounded-full text-xs text-gray-400 font-mono">
                {filtered.length} issue{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-gray-500 text-sm font-mono">
              🐛 {bugs} bug{bugs !== 1 ? 's' : ''} · 💡 {features} feature request{features !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { localStorage.removeItem('adminToken'); window.location.href = '/login'; }}
              className="flex items-center gap-1.5 text-sm text-red-500 border border-red-500/40 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
            <Link
              to="/common-issues"
              className="flex items-center gap-1.5 text-sm text-cyan-400 border border-cyan-500/40 px-4 py-2 rounded-xl hover:bg-cyan-500/10 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" /> Global Issues
            </Link>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-primary border border-primary/40 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Portfolio
            </Link>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="glass rounded-2xl p-5 mb-6 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search issues…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] bg-surface/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
          />

          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="bg-[#0d0d14] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary appearance-none"
          >
            <option value="All">All Projects</option>
            {ALL_PROJECTS.map((p) => <option key={p}>{p}</option>)}
          </select>

          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            {[['all','All'],['bug','Bugs'],['feature','Features']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterType(val)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${filterType === val ? 'bg-primary/30 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Issue list ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-lg">No issues found</p>
            <p className="text-sm mt-1">Submit a bug report from any project card on the portfolio.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((issue, idx) => (
              <IssueCard
                key={idx}
                issue={issue}
                index={idx}
                onDelete={() => {
                  // map filtered index back to global index
                  const globalIdx = issues.indexOf(issue);
                  handleDelete(globalIdx);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueListing;
