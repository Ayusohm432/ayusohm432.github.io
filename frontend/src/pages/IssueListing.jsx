import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, ExternalLink, ShieldAlert, Loader2 } from 'lucide-react';
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

const inputCls = "w-full bg-[#0d0d14]/80 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-sm font-mono shadow-inner";

const FeatureCard = ({ feature, index }) => {
  const [expanded, setExpanded] = useState(false);
  const date = feature.created_at ? new Date(feature.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

  return (
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
          <span className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/20">
            <Lightbulb className="w-3.5 h-3.5" />
            Feature
          </span>
          <h3 className="font-bold text-white truncate text-lg tracking-tight">{feature.title || 'Untitled Proposal'}</h3>
        </div>

        <div className="flex items-center gap-6 flex-shrink-0 ml-4">
          <span className="hidden md:block text-[10px] font-mono font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20">{feature.project_name}</span>
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
            <div className="px-8 pb-8 pt-2 border-t border-white/[0.03] space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm mt-4">
                {[
                  ['Project Context', feature.project_name],
                  ['Proposed By', feature.name ? `${feature.name}${feature.email ? ` (${feature.email})` : ''}` : 'Anonymous User'],
                  ['Submitted On', date],
                ].map(([label, value]) => (
                  <div key={label} className="bg-white/[0.01] p-3 rounded-xl border border-white/[0.02]">
                    <span className="text-gray-600 text-[10px] uppercase font-bold tracking-widest leading-none">{label}</span>
                    <p className="text-gray-300 mt-1 font-medium">{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-gray-400 text-sm leading-relaxed shadow-inner">
                <p className="text-[10px] text-primary/70 uppercase font-bold tracking-widest mb-3">Architectural Proposal</p>
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
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Feature Board</h1>
              <span className="ml-2 px-2.5 py-0.5 bg-white/5 border border-white/5 rounded-full text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider">
                {filtered.length} root ticket{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 mb-10 flex flex-wrap gap-4 items-center border border-white/[0.05] shadow-xl">
          <input
            type="text"
            placeholder="Search proposals…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] bg-[#0d0d14]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-all font-mono"
          />

          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="bg-[#0d0d14] border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-primary/40 appearance-none cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <option value="All">All Projects</option>
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
