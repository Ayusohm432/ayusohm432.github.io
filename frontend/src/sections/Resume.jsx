import React from 'react';
import { motion } from 'framer-motion';
import { FileDown, ExternalLink } from 'lucide-react';

const Resume = () => {
  return (
    <section id="resume" className="py-20 relative">
      <div className="text-center mb-16">
        <span className="text-secondary font-mono tracking-wider text-sm">06. My Paperwork</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">View <span className="text-primary">Resume</span></h2>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto glass p-2 md:p-8 rounded-3xl"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 px-4 gap-4">
          <div>
            <h3 className="text-2xl font-bold">Ayush Kumar</h3>
            <p className="text-gray-400 font-mono text-sm mt-1">Full-Stack / Computer Science</p>
          </div>

          <div className="flex gap-4">
            <a
              href="/AYUSH KUMAR.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-surfaceLight hover:bg-white/10 text-white font-medium flex items-center justify-center gap-2 transition-colors border border-white/10"
            >
              <ExternalLink className="w-4 h-4" /> View Online
            </a>
            <a
              href="/AYUSH KUMAR.pdf"
              download="Ayush_Kumar_Resume.pdf"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-shadow"
            >
              <FileDown className="w-4 h-4" /> Download PDF
            </a>
          </div>
        </div>

        <div className="aspect-[4/3] w-full bg-surfaceLight rounded-xl overflow-hidden relative group hidden md:block border border-white/5">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="glass px-8 py-4 rounded-xl flex items-center gap-3 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-5 h-5 text-primary" />
              <span className="font-medium text-white">Click above to view full resume</span>
            </div>
          </div>
          <iframe
            src="/AYUSH KUMAR.pdf"
            width="100%"
            height="100%"
            className="opacity-50 group-hover:opacity-20 transition-opacity filter grayscale pointer-events-auto"
            title="Resume Preview"
          ></iframe>
        </div>
      </motion.div>
    </section>
  );
};

export default Resume;
