import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';
import axios from 'axios';
import { dummyData } from '../data/dummyData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const About = () => {
  const [about, setAbout] = useState(null);
  const [header, setHeader] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/about`).catch(()=>({data:null})),
      axios.get(`${API_URL}/header`).catch(()=>({data:null}))
    ]).then(([resA, resH]) => {
      const aboutData = resA.data || dummyData.about;
      const headerData = resH.data || dummyData.header;

      if (aboutData) {
         try { aboutData.parsedHighlights = JSON.parse(aboutData.highlights); } catch(e) {}
         setAbout(aboutData);
      }
      if (headerData) setHeader(headerData);
    });
  }, []);

  return (
    <section id="about" className="py-20 relative">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ duration: 0.8 }}>
        <span className="text-secondary font-mono tracking-wider text-sm">01. Who am I</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-12">About <span className="text-primary">Me</span></h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
            <p className="border-l-4 border-primary/60 pl-5 whitespace-pre-line">
              {about?.bio || 'Loading structural biography metrics...'}
            </p>

            <div className="flex flex-wrap gap-3 pt-6 pl-5 md:pl-0">
              <a href={`mailto:${header?.email || 'example@gmail.com'}`} className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/5 hover:border-primary/40 hover:bg-primary/10 transition-all text-sm text-gray-300 font-medium group">
                <Mail className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> Email Me
              </a>
              {header?.linkedin_link && (
                <a href={header.linkedin_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/5 hover:border-secondary/40 hover:bg-secondary/10 transition-all text-sm text-gray-300 font-medium group">
                  <Linkedin className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" /> LinkedIn
                </a>
              )}
              {header?.github_link && (
                <a href={header.github_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/5 hover:border-accent/40 hover:bg-accent/10 transition-all text-sm text-gray-300 font-medium group">
                  <Github className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" /> GitHub
                </a>
              )}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="glass p-8 rounded-xl relative z-10 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span> Quick Snapshot
              </h3>
              <ul className="space-y-3 font-mono text-sm text-gray-300">
                {about?.parsedHighlights?.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary">▹</span> {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
