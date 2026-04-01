import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Loader2, Mail, MapPin } from 'lucide-react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_CONTACT_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // 1. Send to Local Database
      await axios.post(`${API_URL}/contact`, formData);
      
      // 2. Fire to Formspree (Email Notification) if configured
      if (FORMSPREE_URL) {
        await axios.post(FORMSPREE_URL, formData);
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Contact submit error', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <section id="contact" className="py-20 relative">
      <div className="text-center mb-16">
        <span className="text-secondary font-mono tracking-wider text-sm">08. Next Steps</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Get In <span className="text-primary">Touch</span></h2>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center lg:items-start">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 w-full space-y-8"
        >
          <h3 className="text-3xl font-bold">Let's build something <span className="text-gradient">amazing</span> together.</h3>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            I'm currently looking for new opportunities, collaborations, or just a chat about technology. My inbox is always open.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Mail className="text-primary w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm text-gray-500 font-mono">Email Me</span>
                <a href="mailto:ayushkumar76174@gmail.com" className="text-lg font-medium hover:text-primary transition-colors">ayushkumar76174@gmail.com</a>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <MapPin className="text-accent w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm text-gray-500 font-mono">Location</span>
                <span className="text-lg font-medium">Bihar, India</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 w-full"
        >
          <form onSubmit={handleSubmit} className="glass p-8 md:p-10 rounded-3xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-400">Your Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-400">Your Email</label>
                <input 
                  type="email" 
                  id="email"
                  name="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-400">Your Message</label>
              <textarea 
                id="message"
                name="message" 
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                placeholder="What's on your mind?"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent font-medium text-white hover:opacity-90 transition-opacity flex justify-center items-center gap-2 group disabled:opacity-70"
            >
              {status === 'idle' && (
                <>Send Message <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
              {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
              {status === 'success' && (
                <>Sent Successfully <CheckCircle2 className="w-5 h-5 text-green-300" /></>
              )}
              {status === 'error' && <span>Failed to send. Try again.</span>}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
