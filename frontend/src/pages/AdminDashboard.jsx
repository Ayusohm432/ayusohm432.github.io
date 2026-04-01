import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, User, Code, Briefcase, Award, Inbox, ExternalLink,
  Plus, Trash2, RefreshCw, Save, LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const inputCls = "w-full bg-[#0d0d14] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors text-sm font-mono";

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
    <form onSubmit={submit} className="glass p-6 rounded-2xl border border-white/10 space-y-4 relative">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
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
      <button type="submit" disabled={saving} className="mt-4 px-6 py-2.5 bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 rounded-xl font-semibold flex items-center gap-2 transition-colors">
        <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
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
    <div className="glass p-6 rounded-2xl border border-white/10 space-y-6 relative">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      
      <form onSubmit={add} className="bg-surface/50 p-4 border border-white/5 rounded-xl space-y-4">
        <h4 className="text-sm font-semibold text-primary">Add New Entry</h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
    </div>
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
      const endpoints = ['header', 'about', 'resume', 'skills', 'experiences', 'educations', 'achievements', 'feedbacks', 'contacts'];
      const responses = await Promise.all(endpoints.map(ep => axios.get(`${API_URL}/${ep}`).catch(() => ({ data: null }))));
      
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
    { id: 'inbox', label: 'Legacy Inbox', icon: <Inbox className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen relative flex">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#050508]">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[140px]" />
      </div>

      {/* Sidebar Nav */}
      <div className="w-64 border-r border-white/10 glass h-screen flex flex-col p-4 fixed left-0 top-0 overflow-y-auto z-20">
        <div className="flex items-center gap-2 mb-8 px-2 mt-4">
          <ShieldAlert className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-bold">CMS Master</h1>
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <p className="px-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Database Tables</p>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab === t.id ? 'bg-primary/20 text-primary border border-primary/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {t.icon} {t.label}
            </button>
          ))}

          <p className="px-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-6 mb-1">External Interfaces</p>
          <Link to="/upload" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
             <ExternalLink className="w-4 h-4" /> Project Config
          </Link>
          <Link to="/issues" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
             <ExternalLink className="w-4 h-4" /> Issue Boards
          </Link>
        </div>

        <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/login'); }} className="mt-8 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors">
          <LogOut className="w-4 h-4" /> Terminate Session
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8 md:p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-10 max-w-4xl">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
               {TABS.find(t=>t.id===tab)?.label}
            </h2>
            <p className="text-sm text-gray-500 font-mono mt-1">Direct PostgreSQL Mapping</p>
          </div>
          <button onClick={fetchAll} disabled={loading} className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl text-sm hover:bg-white/5">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Core
          </button>
        </div>

        {loading ? (
           <p className="text-gray-500 mt-20 text-center animate-pulse">Syncing Tables...</p>
        ) : (
          <div className="max-w-4xl space-y-8 pb-32">
            
            {tab === 'general' && (
              <>
                <SingletonForm title="Hero Configuration (Header)" endpoint="header" data={data.header} onSave={fetchAll} fields={[
                  { name: 'name', label: 'Full Name' }, { name: 'title', label: 'Primary Title' },
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

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
