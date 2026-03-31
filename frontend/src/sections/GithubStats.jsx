import React from 'react';
import { motion } from 'framer-motion';

const GithubStats = () => {
  return (
    <section id="github-stats" className="py-20 relative">
      <div className="text-center mb-16">
        <span className="text-secondary font-mono tracking-wider text-sm">07. My Code Activity</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">GitHub <span className="text-primary">Stats</span></h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-8 max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center">
             <img src="https://github-readme-stats.vercel.app/api?username=ayusohm432&show_icons=true&locale=en&theme=tokyonight" alt="GitHub Stats" className="w-full md:w-auto max-w-md rounded-xl glass border border-white/10" />
             <img src="https://github-readme-stats.vercel.app/api/top-langs?username=ayusohm432&show_icons=true&locale=en&layout=compact&theme=tokyonight" alt="Top Languages" className="w-full md:w-auto max-w-md rounded-xl glass border border-white/10" />
        </div>
        
        <img src="https://github-readme-streak-stats.herokuapp.com/?user=ayusohm432&theme=tokyonight&background=0a0a0a00&hide_border=true&stroke=0000" alt="GitHub Streak" className="w-full max-w-4xl rounded-xl glass border border-white/10 p-2" />
        
        <p className="font-mono text-gray-400 text-sm mt-4 flex items-center gap-2">
          <span className="text-green-500 animate-pulse">●</span> Active Contributor
        </p>
      </motion.div>
    </section>
  );
};

export default GithubStats;
