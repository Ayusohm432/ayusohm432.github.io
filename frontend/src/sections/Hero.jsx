import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';

const Hero = () => {
  const [text, setText] = useState('');
  const fullText = "Full-Stack Developer";
  
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(typing);
      }
    }, 150);
    return () => clearInterval(typing);
  }, []);

  return (
    <section id="hero" className="min-h-[85vh] flex flex-col md:flex-row items-center justify-center pt-20">
      <div className="flex-1 space-y-8 flex flex-col items-center md:items-start text-center md:text-left z-10 w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex glass px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium mb-4"
        >
          🚀 Welcome to my digital workspace
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter"
        >
          Hi, I'm <span className="text-gradient">Ayush Kumar</span>
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-2xl md:text-3xl text-gray-400 font-mono h-10"
        >
          {text}<span className="animate-pulse">_</span>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg text-gray-400 max-w-xl leading-relaxed"
        >
          I'm a Computer Science & Engineering student at GCE, passionate about creating interactive, modern, and scalable web applications.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-8"
        >
          <a href="#projects" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2 group">
            View Projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="../public/AYUSH KUMAR.pdf" download className="w-full sm:w-auto px-8 py-4 glass border border-white/10 text-white rounded-lg font-medium hover:bg-white/5 transition flex items-center justify-center gap-2 group hover:border-primary/50">
            <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform text-primary" />
            Download Resume
          </a>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="flex-1 w-full mt-16 md:mt-0 relative flex justify-center items-center"
      >
        <div className="relative w-72 h-72 md:w-96 md:h-96">
          {/* Animated glow rings */}
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute inset-4 rounded-full border border-secondary/30 animate-[spin_15s_linear_infinite_reverse]"></div>
          
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute inset-8 rounded-full overflow-hidden glass border-2 border-white/10 z-10 flex items-center justify-center bg-surface"
          >
             <img src="/favicon.png" alt="Ayush Kumar" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
