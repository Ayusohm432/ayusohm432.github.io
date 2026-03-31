import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-secondary font-mono tracking-wider text-sm">01. Who am I</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-12">About <span className="text-primary">Me</span></h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
            <p>
              I'm a dedicated B.Tech student in Computer Science & Engineering at <span className="text-white font-medium">Gaya College of Engineering</span>. Strong expertise in Data Structures & Algorithms, demonstrated through consistent problem-solving across coding platforms.
            </p>
            <p>
              My journey spans Full-Stack Web Development (React, FastAPI, PHP, MySQL), Android Development with Java, and AI/ML exposure through data annotation and research. I blend strong system-level thinking with beautiful, user-first interfaces.
            </p>
            <p>
              When not building software, I write technical articles on <span className="text-white font-medium">Hashnode</span> and contribute to open-source projects.
            </p>
            {/* Contact row */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="mailto:ayushkumar76174@gmail.com" className="flex items-center gap-1.5 text-sm text-primary hover:underline font-mono">
                📧 ayushkumar76174@gmail.com
              </a>
              <a href="https://linkedin.com/in/ayusohm432" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline font-mono">
                🔗 LinkedIn
              </a>
              <a href="https://github.com/Ayusohm432" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline font-mono">
                🐙 GitHub
              </a>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="glass p-8 rounded-xl relative z-10 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span> Quick Snapshot
              </h3>
              <ul className="space-y-3 font-mono text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-primary">▹</span>
                  B.Tech CSE @ Gaya College of Engineering · CGPA 8.55
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">▹</span>
                  Full-Stack Intern @ Bytical.ai · FastAPI, React, MongoDB
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">▹</span>
                  Solved 1000+ problems on competitive coding platforms
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">▹</span>
                  Participated in ICPC 2024 & 2025 · National Hackathons
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">▹</span>
                  Microsoft Certified: Azure AI Engineer Associate
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
