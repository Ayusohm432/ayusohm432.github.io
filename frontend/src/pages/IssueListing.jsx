import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, ExternalLink, ShieldAlert, LogOut, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ALL_PROJECTS = [
  'Feedback Management System',
  'AI Skills Gap Analyzer',
  'AgenticGoKit',
  'StegoShield',
  'Next-Gen Portfolio',
  'MediSync — Healthcare Management System',
  'Predictive Analysis in AI Model Training',
];

const FeatureCard = ({ feature, index }) => {
  const [expanded, setExpanded] = useState(false);
  const date = feature.created_at ? new Date(feature.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

  return (
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
          <span className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
            <Lightbulb className="w-3.5 h-3.5" />
            Feature
          </span>
          <h3 className="font-semibold text-white truncate">{feature.title || 'Untitled Proposal'}</h3>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
          <span className="hidden md:block text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">{feature.project_name}</span>
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
                {[
                  ['Project Context', feature.project_name],
                  ['Proposed By', feature.name ? `${feature.name}${feature.email ? ` (${feature.email})` : ''}` : 'Anonymous User'],
                  ['Submitted On', date],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span className="text-gray-500 text-xs uppercase tracking-wider">{label}</span>
                    <p className="text-gray-200 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-xl p-4 text-gray-300 text-sm leading-relaxed">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Architectural Proposal</p>
                {feature.description}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const IssueListing = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterProject, setFilterProject] = useState('All');
  const [search, setSearch] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(`${API_URL}/feature-requests`, {
           headers: { 'X-Admin-Token': token }
        });
        setFeatures(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatures();
  }, [API_URL]);

  const filtered = features.filter((feat) => {
    if (filterProject !== 'All' && feat.project_name !== filterProject) return false;
    const q = search.toLowerCase();
    if (q && !(feat.title?.toLowerCase().includes(q) || feat.description?.toLowerCase().includes(q))) return false;
    return true;
  });

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10 bg-[#050508]">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold text-white">Feature Board</h1>
              <span className="ml-2 px-2.5 py-1 bg-white/10 rounded-full text-xs text-gray-400 font-mono">
                {filtered.length} proposal{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-gray-500 text-sm font-mono">
               Project enhancement requests and architectural suggestions.
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
              to="/common-issues"
              className="flex items-center gap-1.5 text-sm text-cyan-400 border border-cyan-500/40 px-4 py-2 rounded-xl hover:bg-cyan-500/10 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" /> Global Bug Board
            </Link>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-primary border border-primary/40 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Portfolio
            </Link>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 mb-6 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search proposals…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] bg-surface/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
          />

          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="bg-[#0d0d14] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary appearance-none"
          >
            <option value="All">All Architecture Contexts</option>
            {ALL_PROJECTS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        {loading ? (
           <div className="text-center py-24 text-gray-400 flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              Syncing Private Feature Table...
           </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <div className="text-5xl mb-4 text-gray-600">💡</div>
            <p className="text-lg">No architectural proposals found</p>
            <p className="text-sm mt-1">Standby for incoming innovation suggestions.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((feat, idx) => (
              <FeatureCard key={feat.id || idx} feature={feat} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueListing;
