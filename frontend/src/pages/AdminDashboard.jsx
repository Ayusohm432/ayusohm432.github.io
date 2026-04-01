import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, User, Code, Briefcase, Award, Inbox, ExternalLink,
  Plus, Trash2, RefreshCw, Save, LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProjectUpload from './ProjectUpload';
import IssueListing from './IssueListing';
import CommonIssue from './CommonIssue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const inputCls = "w-full bg-[#0d0d14]/80 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-sm font-mono shadow-inner";

// ── Quick Stats Component ────────────────────────────────
const QuickStats = ({ data }) => {
  const stats = [
    { label: 'Projects', value: data.projects?.length || 0, color: 'text-primary' },
    { label: 'Skills', value: data.skills?.length || 0, color: 'text-secondary' },
    { label: 'Experiences', value: data.experiences?.length || 0, color: 'text-accent' },
    { label: 'Pending Issues', value: (data.contacts?.length || 0) + (data.feedbacks?.length || 0), color: 'text-red-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 w-full max-w-5xl mx-auto px-4">
      {stats.map((s, idx) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="glass p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center hover:border-white/10 transition-colors"
        >
          <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mt-1">{s.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

// ── Shared Singletons (Header, About, Resume) ────────────
const SingletonForm = ({ title, endpoint, fields, data, onSave }) => {
  const [form, setForm] = useState(data || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(data || {}); }, [data]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${API_URL}/${endpoint}`, form, { headers: { 'X-Admin-Token': token } });
      onSave();
    } catch (err) { alert('Save failed'); }
    setSaving(false);
  };

  return (
    <motion.form 
      onSubmit={submit} 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass p-8 rounded-3xl border border-white/[0.05] space-y-6 relative shadow-xl"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Save className="w-4 h-4 text-primary" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {fields.map(f => (
          <div key={f.name} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea name={f.name} value={form[f.name] || ''} onChange={handleChange} rows={4} className={inputCls} />
            ) : (
              <input type="text" name={f.name} value={form[f.name] || ''} onChange={handleChange} className={inputCls} />
            )}
          </div>
        ))}
      </div>
      <button type="submit" disabled={saving} className="mt-4 px-8 py-3 bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </motion.form>
  );
};

// ── Shared Array List (Skills, Experience, etc) ────────────
const ArrayList = ({ title, endpoint, fields, data, onSave }) => {
  const [form, setForm] = useState({});
  const [adding, setAdding] = useState(false);

  const setObj = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const add = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const token = localStorage.getItem('adminToken');
      // Auto cast level to string if skill
      const payload = { ...form };
      if (payload.level) payload.level = parseInt(payload.level) || 0;
      
      await axios.post(`${API_URL}/${endpoint}`, payload, { headers: { 'X-Admin-Token': token } });
      setForm({});
      onSave();
    } catch (err) { alert('Add failed'); }
    setAdding(false);
  };

  const remove = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/${endpoint}/${id}`, { headers: { 'X-Admin-Token': token } });
      onSave();
    } catch (err) { alert('Delete failed'); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass p-8 rounded-3xl border border-white/[0.05] space-y-8 relative shadow-xl"
    >
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">{title}</h3>
      
      <form onSubmit={add} className="bg-white/[0.02] p-6 border border-white/5 rounded-2xl space-y-5">
        <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-primary/70">Add New Entry</h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map(f => (
            <div key={f.name} className={f.type === 'textarea' ? 'sm:col-span-2 lg:col-span-3' : ''}>
               <input type={f.type === 'number' ? 'number' : 'text'} required name={f.name} placeholder={f.label} value={form[f.name] || ''} onChange={setObj} className={inputCls} />
            </div>
          ))}
          <button disabled={adding} type="submit" className="sm:col-span-2 lg:col-span-3 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg flex items-center justify-center gap-2 hover:bg-green-500/30">
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {data?.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition">
            <div className="flex-1 min-w-0 pr-4">
              <p className="font-semibold text-sm text-gray-200 truncate">{item.name || item.role || item.degree || item.title || item.icon}</p>
              <p className="text-xs text-gray-500 truncate">{item.category || item.company || item.institution || item.text}</p>
            </div>
            <button onClick={() => remove(item.id)} className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {data?.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No records found.</p>}
      </div>
    </motion.div>
  );
};


const AdminDashboard = () => {
  const [tab, setTab] = useState('general');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const endpoints = ['header', 'about', 'resume', 'skills', 'experiences', 'educations', 'achievements', 'feedbacks', 'contacts', 'projects'];
      const responses = await Promise.all(endpoints.map(ep => 
        axios.get(`${API_URL}/${ep}`, { 
           headers: { 'X-Admin-Token': token } 
        }).catch(() => ({ data: null }))
      ));
      
      const newData = {};
      endpoints.forEach((ep, i) => newData[ep] = responses[i].data);
      setData(newData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const TABS = [
    { id: 'general', label: 'General Info', icon: <User className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills Array', icon: <Code className="w-4 h-4" /> },
    { id: 'timeline', label: 'Timeline Logs', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects Config', icon: <ExternalLink className="w-4 h-4" /> },
    { id: 'features', label: 'Feature Board', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'bugs', label: 'Global Bug Board', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'inbox', label: 'Legacy Inbox', icon: <Inbox className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen relative flex">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#050508]">
        <motion.div 
            animate={{ 
                x: [0, 50, 0], 
                y: [0, 30, 0],
                scale: [1, 1.1, 1]
            }} 
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px]" 
        />
        <motion.div 
            animate={{ 
                x: [0, -40, 0], 
                y: [0, -50, 0],
                scale: [1, 1.2, 1]
            }} 
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-secondary/5 rounded-full blur-[140px]" 
        />
      </div>

      {/* Sidebar Nav */}
      <div className="w-[280px] border-r border-white/[0.05] glass h-screen flex flex-col p-6 fixed left-0 top-0 overflow-y-auto z-20 shadow-2xl">
        <div className="flex items-center gap-3 mb-12 px-2 mt-4 group cursor-default">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:rotate-12 transition-transform duration-500">
            <ShieldAlert className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">CMS Master</h1>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">Database Layer 1.0</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <p className="px-3 text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-2 font-bold">Menu</p>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 relative group overflow-hidden ${tab === t.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'}`}>
               <span className={`transition-transform duration-300 ${tab === t.id ? 'scale-110' : 'group-hover:scale-110'}`}>{t.icon}</span>
               {t.label}
               {tab === t.id && <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-6 bg-white rounded-full ml-1" />}
            </button>
          ))}

          <p className="px-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-6 mb-1">Portfolio Links</p>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
             <ExternalLink className="w-4 h-4" /> Public Portfolio
          </Link>
        </div>

        <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/login'); }} className="mt-8 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors">
          <LogOut className="w-4 h-4" /> Terminate Session
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-[280px] p-10 md:p-16 overflow-y-auto min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-white/[0.03] pb-10">
            <div>
              <p className="text-[10px] text-primary font-mono font-bold uppercase tracking-[0.3em] mb-3">Workspace Dashboard</p>
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white over to-gray-600 tracking-tighter">
                 {TABS.find(t=>t.id===tab)?.label}
              </h2>
            </div>
            <button onClick={fetchAll} disabled={loading} className="flex items-center gap-2.5 px-6 py-2.5 rounded-2xl glass border border-white/5 text-xs font-bold uppercase tracking-widest hover:bg-white/[0.03] transition-all hover:scale-105 active:scale-95 disabled:opacity-50">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Database
            </button>
          </div>

          {!loading && <QuickStats data={data} />}

          {loading ? (
             <div className="flex flex-col items-center justify-center mt-32 space-y-6">
                <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-gray-500 font-mono text-xs animate-pulse tracking-[0.5em] uppercase">Connecting to Supabase...</p>
             </div>
          ) : (
            <div className="space-y-12 pb-32">
            
            {tab === 'general' && (
              <>
                <SingletonForm title="Hero Configuration (Header)" endpoint="header" data={data.header} onSave={fetchAll} fields={[
                  { name: 'name', label: 'Full Name' }, { name: 'title', label: 'Primary Title' },
                  { name: 'email', label: 'Contact Email' }, { name: 'profile_image', label: 'Profile Image URL' },
                  { name: 'github_link', label: 'GitHub URL' }, { name: 'linkedin_link', label: 'LinkedIn URL' },
                  { name: 'tagline', label: 'Tagline / Short Bio', type: 'textarea' }
                ]} />
                <SingletonForm title="About Me Structure" endpoint="about" data={data.about} onSave={fetchAll} fields={[
                  { name: 'institution', label: 'Primary Institution' },
                  { name: 'bio', label: 'Main Biography Block', type: 'textarea' },
                  { name: 'highlights', label: 'Highlights JSON Array', type: 'textarea' }
                ]} />
                <SingletonForm title="Resume Binder" endpoint="resume" data={data.resume} onSave={fetchAll} fields={[
                  { name: 'drive_link', label: 'PDF Document Relative/Absolute Link' }
                ]} />
              </>
            )}

            {tab === 'skills' && (
              <ArrayList title="Skills Master List" endpoint="skills" data={data.skills} onSave={fetchAll} fields={[
                { name: 'category', label: 'Category (e.g. Languages)' },
                { name: 'name', label: 'Skill Name (e.g. React)' },
                { name: 'level', label: 'Mastery Percentage', type: 'number' }
              ]} />
            )}

            {tab === 'timeline' && (
              <>
                <ArrayList title="Experience Matrix" endpoint="experiences" data={data.experiences} onSave={fetchAll} fields={[
                  { name: 'role', label: 'Job Role' }, { name: 'company', label: 'Company / Org' },
                  { name: 'date_period', label: 'Date Period' }, { name: 'description', label: 'Duties', type: 'textarea' }
                ]} />
                <ArrayList title="Education Matrix" endpoint="educations" data={data.educations} onSave={fetchAll} fields={[
                  { name: 'degree', label: 'Degree' }, { name: 'institution', label: 'Institution' },
                  { name: 'date_period', label: 'Date Period' }, { name: 'description', label: 'Description', type: 'textarea' }
                ]} />
              </>
            )}

            {tab === 'achievements' && (
              <ArrayList title="Achievements & Certificants Matrix" endpoint="achievements" data={data.achievements} onSave={fetchAll} fields={[
                { name: 'icon', label: 'Emoji / Icon' }, { name: 'text', label: 'Achievement text string', type: 'textarea' }
              ]} />
            )}

            {tab === 'inbox' && (
              <div className="glass p-6 rounded-2xl border border-white/10 text-gray-400">
                <h3 className="text-xl font-bold text-white mb-4">Legacy Read-Only Inbox</h3>
                <p>Contacts: {data.contacts?.length} / Feedbacks: {data.feedbacks?.length}</p>
                <div className="mt-4 space-y-2">
                   {data.contacts?.map(c => <div key={c.id} className="p-3 bg-white/5 rounded-xl border border-white/5">{c.name}: {c.message}</div>)}
                </div>
              </div>
            )}

            {tab === 'projects' && <ProjectUpload />}
            {tab === 'features' && <IssueListing />}
            {tab === 'bugs' && <CommonIssue />}

          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default AdminDashboard;
