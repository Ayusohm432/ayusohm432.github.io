import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Loader2, CheckCircle2, Star } from 'lucide-react';
import axios from 'axios';

const INITIAL = { name: '', message: '', rating: 5 };

const FeedbackModal = ({ isOpen, onClose, projectName }) => {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const reset = () => { setForm(INITIAL); setStatus('idle'); };
  const handleClose = () => { onClose(); setTimeout(reset, 300); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post(`${API_URL}/feedback`, {
        ...form,
        message: `[${projectName}] ${form.message}`,
      });
      setStatus('success');
      setTimeout(handleClose, 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-5"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md flex flex-col glass border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.12)]"
            style={{ maxHeight: 'calc(100dvh - 48px)' }}
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-secondary/20 text-secondary rounded-xl">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Leave Feedback</h3>
                  <p className="text-gray-500 text-xs font-mono">{projectName}</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form id="feedback-form" onSubmit={handleSubmit}>
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-5">

                {/* Star rating */}
                <div className="flex flex-col items-center gap-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">How would you rate this project?</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button"
                        onClick={() => setForm((p) => ({ ...p, rating: star }))}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star className={`w-9 h-9 transition-colors ${star <= form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-mono">{form.rating} / 5</p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Name <span className="text-gray-600">(optional)</span></label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full bg-surface/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-secondary/60 transition-colors"
                    placeholder="Your name"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Your Feedback <span className="text-red-400">*</span></label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    className="w-full bg-surface/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-secondary/60 transition-colors resize-none"
                    placeholder="What did you like? What could be improved?"
                  />
                </div>

              </div>
            </form>

            {/* Sticky footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-white/10 bg-surface/20 rounded-b-3xl">
              <button form="feedback-form" type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full py-3 rounded-xl bg-secondary/20 text-secondary border border-secondary/40 hover:bg-secondary/30 disabled:opacity-60 transition-all font-semibold text-sm flex items-center justify-center gap-2"
              >
                {status === 'idle'    && '💬 Send Feedback'}
                {status === 'loading' && <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>}
                {status === 'success' && <><CheckCircle2 className="w-4 h-4" /> Thank you!</>}
                {status === 'error'   && 'Something went wrong — retry'}
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
