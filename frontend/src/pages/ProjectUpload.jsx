import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, ExternalLink, Github, Layers, Loader2, CheckCircle2, Copy, RefreshCw, Trash2, Pencil, XCircle } from 'lucide-react';
import axios from 'axios';

const inputCls = "w-full bg-[#0d0d14]/80 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-sm font-mono shadow-inner";

const INITIAL = {
  title: '',
  description: '',
  tech_stack: '',
  github_link: '',
  live_demo: ''
};

const ProjectUpload = () => {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (editingId) {
        await axios.put(`${API_URL}/projects/${editingId}`, form, {
          headers: { 'X-Admin-Token': token }
        });
      } else {
        await axios.post(`${API_URL}/projects`, form, {
          headers: { 'X-Admin-Token': token }
        });
      }
      
      setStatus('success');
      fetchProjects();
      setTimeout(() => {
        setStatus('idle');
        setForm(INITIAL);
        setEditingId(null);
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleEdit = (proj) => {
    setEditingId(proj.id);
    setForm({
      title: proj.title,
      description: proj.description,
      tech_stack: proj.tech_stack,
      github_link: proj.github_link || '',
      live_demo: proj.live_demo || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
     setEditingId(null);
     setForm(INITIAL);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to terminate this architectural project? This action is irreversible.")) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/projects/${projectId}`, {
        headers: { 'X-Admin-Token': token }
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Termination failed. System error detected.");
    }
  };

  const handleGenerateLink = async (projectId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post(`${API_URL}/projects/${projectId}/generate-link`, {}, {
        headers: { 'X-Admin-Token': token }
      });
      // Update local state with the new link
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, report_link: res.data.report_link } : p));
    } catch (err) {
      console.error(err);
      alert("Failed to generate custom link. Ensure your session is authenticated.");
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">

        <div className="mb-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-16 h-16 ${editingId ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'} mx-auto rounded-2xl flex items-center justify-center mb-4 transition-colors`}
          >
            {editingId ? <Pencil className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-3"
          >
            {editingId ? 'Update Architecture' : 'Deploy Project'}
          </motion.h1>
          <p className="text-gray-400">
            {editingId ? `Editing system specifications for ${form.title}` : 'Add a new portfolio item directly into the database.'}
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`glass border ${editingId ? 'border-secondary/20' : 'border-white/[0.05]'} rounded-3xl p-8 shadow-xl transition-colors`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Project Title <span className="text-red-400">*</span></label>
                <input type="text" name="title" required value={form.title} onChange={set} className={inputCls} placeholder="e.g. Next-Gen Portfolio" />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium flex gap-2 items-center">
                  <Layers className="w-4 h-4 text-secondary" /> Tech Stack <span className="text-red-400">*</span>
                </label>
                <input type="text" name="tech_stack" required value={form.tech_stack} onChange={set} className={inputCls} placeholder="React, Node.js, Python..." />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium">Description <span className="text-red-400">*</span></label>
              <textarea name="description" required rows={4} value={form.description} onChange={set} className={`${inputCls} resize-none`} placeholder="Describe the architecture, problem solved, and key features..." />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium flex gap-2 items-center">
                  <Github className="w-4 h-4" /> GitHub Repository URL
                </label>
                <input type="url" name="github_link" value={form.github_link} onChange={set} className={inputCls} placeholder="https://github.com/..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium flex gap-2 items-center">
                  <ExternalLink className="w-4 h-4" /> Live Demo URL
                </label>
                <input type="url" name="live_demo" value={form.live_demo} onChange={set} className={inputCls} placeholder="https://..." />
              </div>
            </div>

            <div className="flex gap-4 items-center">
               <button 
                  type="submit" 
                  disabled={status === 'loading' || status === 'success'}
                  className={`flex-1 py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] shadow-lg ${editingId ? 'bg-secondary/20 text-secondary border border-secondary/30 hover:bg-secondary/30 shadow-secondary/5' : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 shadow-primary/5'}`}
               >
                  {status === 'idle' && (editingId ? 'Push Update' : 'Push to Database')}
                  {status === 'loading' && <><Loader2 className="w-5 h-5 animate-spin"/> Authenticating...</>}
                  {status === 'success' && <><CheckCircle2 className="w-5 h-5"/> Portfolio Updated!</>}
                  {status === 'error' && 'Failed — Check Credentials'}
               </button>

               {editingId && (
                  <button 
                    type="button" 
                    onClick={cancelEdit} 
                    className="px-6 py-4 rounded-xl font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-2"
                  >
                    <XCircle className="w-5 h-5" /> Cancel
                  </button>
               )}
            </div>
          </form>
        </motion.div>

        {/* ── Active Projects Tracking ── */}
        <div className="mt-20">
           <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Active Architectures</h2>
           
           {fetching ? (
             <div className="text-gray-500 py-20 flex flex-col items-center">
               <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" /> 
               <p className="text-xs uppercase tracking-widest font-mono">Syncing Database...</p>
             </div>
           ) : projects.length === 0 ? (
             <div className="glass border border-white/5 rounded-3xl p-12 text-center text-gray-500 italic">
               No architectural projects initialized in Supabase.
             </div>
           ) : (
             <div className="grid gap-6">
                {projects.map(proj => (
                  <div key={proj.id} className={`glass border rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-colors shadow-lg ${editingId === proj.id ? 'border-primary shadow-primary/10' : 'border-white/[0.05]'}`}>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                           <h3 className="font-bold text-xl text-white tracking-tight">{proj.title}</h3>
                           <p className="text-[10px] text-secondary font-mono bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20 inline-block uppercase tracking-wider">{proj.tech_stack}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                           <button onClick={() => handleEdit(proj)} className="text-[10px] uppercase font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                              <Pencil className="w-3 h-3" /> Edit
                           </button>
                           <span className="text-gray-700">|</span>
                           <button onClick={() => handleDelete(proj.id)} className="text-[10px] uppercase font-bold text-red-400/60 hover:text-red-400 flex items-center gap-1 transition-colors">
                              <Trash2 className="w-3 h-3" /> Delete
                           </button>
                        </div>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
                        {proj.report_link ? (
                           <div className="flex items-center gap-2 bg-[#0d0d14]/50 border border-white/5 rounded-xl px-4 py-2.5 flex-grow overflow-hidden group/link">
                              <a 
                                 href={`https://${proj.report_link}`} 
                                 target="_blank" 
                                 rel="noopener noreferrer" 
                                 className="text-[10px] font-mono text-gray-500 hover:text-primary transition-colors truncate max-w-[200px]"
                              >
                                 {proj.report_link}
                              </a>
                              <button 
                                 onClick={() => {
                                    const fullUrl = `https://${proj.report_link}`;
                                    navigator.clipboard.writeText(fullUrl);
                                 }} 
                                 className="ml-auto text-primary hover:text-white transition-colors p-1" 
                                 title="Copy to clipboard"
                              >
                                 <Copy className="w-3.5 h-3.5" />
                              </button>
                           </div>
                        ) : (
                           <div className="text-[10px] text-gray-600 font-mono italic px-4 py-2.5 border border-dashed border-white/10 rounded-xl text-center">
                              NO_LINK_GENERATED
                           </div>
                        )}
                        <button 
                           onClick={() => handleGenerateLink(proj.id)}
                           className="whitespace-nowrap flex items-center justify-center gap-2 px-6 py-2.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all hover:scale-105 active:scale-95"
                        >
                           <RefreshCw className="w-3.5 h-3.5" /> Generate Link
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProjectUpload;
