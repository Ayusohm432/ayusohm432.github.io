import React from 'react';
import { motion } from 'framer-motion';
import { Github, Terminal, Zap } from 'lucide-react';

const GithubStats = () => {
  return (
    <section id="github-stats" className="py-20 relative">
      <div className="text-center mb-16">
        <span className="text-secondary font-mono tracking-wider text-sm">07. My Code Activity</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">GitHub <span className="text-primary">Stats</span></h2>
      </div>

      <div className="flex flex-col gap-6 max-w-5xl mx-auto px-4 md:px-0">
        <div className="grid md:grid-cols-2 gap-6 w-full">
          {/* Overall Stats Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass p-6 md:p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 border border-white/5 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors pointer-events-none"></div>
            <h3 className="flex items-center gap-2 text-xl font-bold mb-6 text-white">
              <Github className="text-primary w-6 h-6" /> GitHub Overview
            </h3>
            <div className="flex justify-center relative z-10 w-full min-h-[165px]">
              <img 
                 src="https://github-readme-stats.anuraghazra1.vercel.app/api?username=ayusohm432&show_icons=true&locale=en&theme=tokyonight&bg_color=00000000&hide_border=true" 
                 alt="GitHub Stats" 
                 className="w-full max-w-[400px] drop-shadow-xl" 
                 loading="lazy"
              />
            </div>
          </motion.div>

          {/* Top Languages Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass p-6 md:p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 border border-white/5 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-colors pointer-events-none"></div>
            <h3 className="flex items-center gap-2 text-xl font-bold mb-6 text-white">
              <Terminal className="text-secondary w-6 h-6" /> Top Languages
            </h3>
            <div className="flex justify-center relative z-10 w-full min-h-[165px]">
              <img 
                 src="https://github-readme-stats.anuraghazra1.vercel.app/api/top-langs?username=ayusohm432&show_icons=true&locale=en&layout=compact&theme=tokyonight&bg_color=00000000&hide_border=true" 
                 alt="Top Languages" 
                 className="w-full max-w-[400px] drop-shadow-xl" 
                 loading="lazy"
              />
            </div>
          </motion.div>
        </div>

        {/* Streak Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass p-6 md:p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 border border-white/5 shadow-2xl w-full"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-[100px] group-hover:bg-accent/20 transition-colors pointer-events-none"></div>
          <h3 className="flex items-center gap-2 text-xl font-bold mb-6 text-white justify-center md:justify-start">
            <Zap className="text-accent w-6 h-6" /> Contribution Streak
          </h3>
          <div className="flex justify-center relative z-10 w-full min-h-[195px]">
            <img 
               src="https://streak-stats.demolab.com/?user=ayusohm432&theme=tokyonight&background=00000000&hide_border=true&stroke=0000" 
               alt="GitHub Streak" 
               className="w-full max-w-3xl drop-shadow-2xl" 
               loading="lazy"
            />
          </div>
        </motion.div>
        
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5, delay: 0.4 }}
           className="flex justify-center"
        >
          <p className="font-mono text-gray-400 text-sm mt-2 flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5">
            <span className="text-green-500 animate-pulse text-lg">●</span> Active Open Source Contributor
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default GithubStats;
