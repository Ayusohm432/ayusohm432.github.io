import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, BugPlay, MessageSquare, Mail,
  RefreshCw, ChevronDown, Star, Inbox, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ── helpers ──────────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SEV = {
  high:   'bg-red-500/20 text-red-400 border border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  low:    'bg-green-500/20 text-green-400 border border-green-500/30',
};

const fmt = (iso) =>
  iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

// ── accordion row ────────────────────────────────────────────────────────────
const Row = ({ children, summary, index, accent = 'primary' }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass rounded-2xl overflow-hidden border border-white/10"
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors text-left gap-4"
      >
        {summary}
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="overflow-hidden border-t border-white/10 px-5 py-4 text-sm text-gray-300 space-y-2 bg-white/[0.02]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── stat card ────────────────────────────────────────────────────────────────
const Stat = ({ icon, label, value, color }) => (
  <div className={`glass rounded-2xl px-6 py-5 flex items-center gap-4 border border-white/10`}>
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  </div>
);

// ── tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'bugs',     label: 'Bug Reports',    icon: <BugPlay     className="w-4 h-4" /> },
  { id: 'feedback', label: 'Feedback',        icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'contact',  label: 'Contact Messages',icon: <Mail        className="w-4 h-4" /> },
];

// ── page ─────────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [tab, setTab]         = useState('bugs');
  const [bugs, setBugs]       = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [b, f, c] = await Promise.all([
        axios.get(`${API_URL}/bug-reports`),
        axios.get(`${API_URL}/feedbacks`),
        axios.get(`${API_URL}/contacts`),
      ]);
      setBugs(b.data);
      setFeedback(f.data);
      setContacts(c.data);
    } catch (err) {
      setError('Could not reach the backend. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const active = tab === 'bugs' ? bugs : tab === 'feedback' ? feedback : contacts;

  return (
    <div className="min-h-screen" style={{ background: '#050508' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-gray-500 font-mono mt-0.5">Portfolio data — private</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchAll}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl glass border border-white/10 text-gray-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/"
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Portfolio
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat icon={<BugPlay className="w-5 h-5" />}      label="Bug Reports"     value={bugs.length}     color="bg-red-500/20 text-red-400" />
          <Stat icon={<MessageSquare className="w-5 h-5" />} label="Feedback Entries" value={feedback.length} color="bg-secondary/20 text-secondary" />
          <Stat icon={<Mail className="w-5 h-5" />}          label="Contact Messages" value={contacts.length} color="bg-primary/20 text-primary" />
        </div>

        {/* Error state */}
        {error && (
          <div className="glass border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.id ? 'bg-primary/25 text-primary border border-primary/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.icon} {t.label}
              <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-white/10 text-gray-400">
                {t.id === 'bugs' ? bugs.length : t.id === 'feedback' ? feedback.length : contacts.length}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && !active.length ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : active.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Inbox className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No {tab === 'bugs' ? 'bug reports' : tab === 'feedback' ? 'feedback' : 'messages'} yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* ── Bug Reports ── */}
            {tab === 'bugs' && bugs.map((b, i) => (
              <Row key={b.id} index={i} summary={
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${SEV[b.severity] || SEV.low}`}>
                    {b.severity}
                  </span>
                  <span className="font-medium text-white truncate">{b.issue_title}</span>
                  <span className="hidden sm:block text-xs text-gray-500 flex-shrink-0 ml-auto mr-2 font-mono">{fmt(b.created_at)}</span>
                </div>
              }>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                  <Field label="Project" value={b.project_name} />
                  <Field label="Severity" value={b.severity} />
                  <Field label="Date" value={fmt(b.created_at)} />
                </div>
                <Field label="Description" value={b.description} block />
              </Row>
            ))}

            {/* ── Feedback ── */}
            {tab === 'feedback' && feedback.map((f, i) => (
              <Row key={f.id} index={i} summary={
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex gap-0.5 flex-shrink-0">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= f.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                  <span className="font-medium text-white truncate">{f.name || 'Anonymous'}</span>
                  <span className="hidden sm:block text-xs text-gray-500 flex-shrink-0 ml-auto mr-2 font-mono">{fmt(f.created_at)}</span>
                </div>
              }>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                  <Field label="Name" value={f.name || 'Anonymous'} />
                  <Field label="Rating" value={`${f.rating} / 5`} />
                  <Field label="Date" value={fmt(f.created_at)} />
                </div>
                <Field label="Message" value={f.message} block />
              </Row>
            ))}

            {/* ── Contact ── */}
            {tab === 'contact' && contacts.map((c, i) => (
              <Row key={c.id} index={i} summary={
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="font-medium text-white truncate">{c.name}</span>
                  <span className="text-gray-500 text-xs truncate">{c.email}</span>
                  <span className="hidden sm:block text-xs text-gray-500 flex-shrink-0 ml-auto mr-2 font-mono">{fmt(c.created_at)}</span>
                </div>
              }>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                  <Field label="Name" value={c.name} />
                  <Field label="Email" value={c.email} />
                  <Field label="Date" value={fmt(c.created_at)} />
                </div>
                <Field label="Message" value={c.message} block />
              </Row>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// tiny helper
const Field = ({ label, value, block }) => (
  <div className={block ? 'mt-3' : ''}>
    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">{label}</p>
    <p className={`text-gray-200 ${block ? 'bg-white/5 rounded-xl px-4 py-3 leading-relaxed whitespace-pre-wrap' : ''}`}>{value || '—'}</p>
  </div>
);

export default AdminDashboard;
