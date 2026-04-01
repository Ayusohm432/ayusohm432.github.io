import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, error
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await axios.post(`${API_URL}/admin/login`, { password });
      localStorage.setItem('adminToken', response.data.token);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-24 px-5 flex items-center justify-center relative overflow-hidden">
      {/* Back / Logout Button */}
      <button onClick={handleLogout} className="absolute top-6 right-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors z-20 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
        <ArrowLeft className="w-4 h-4" /> Return to Portfolio
      </button>

      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm glass border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl">
        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6 mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-2">Restricted Area</h2>
        <p className="text-gray-400 text-sm text-center mb-8">Please enter your administrative password to continue.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0d0d14] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/60 transition-colors text-center font-mono tracking-widest"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || !password}
            className="w-full py-3.5 rounded-xl bg-red-500/20 text-red-100 font-semibold flex items-center justify-center gap-2 border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === 'error' ? (
              'Authentication Failed'
            ) : (
              <>
                Login <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
