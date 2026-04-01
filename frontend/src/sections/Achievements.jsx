import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, GraduationCap, Bot } from 'lucide-react';
import axios from 'axios';
import { dummyData } from '../data/dummyData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Achievements = () => {
  const [timeline, setTimeline] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/experiences`).catch(()=>({data:[]})),
      axios.get(`${API_URL}/educations`).catch(()=>({data:[]})),
      axios.get(`${API_URL}/achievements`).catch(()=>({data:[]}))
    ]).then(([expRes, eduRes, achRes]) => {
      let experiences = (expRes.data && expRes.data.length > 0) ? expRes.data : dummyData.experiences;
      let educations = (eduRes.data && eduRes.data.length > 0) ? eduRes.data : dummyData.educations;
      let achs = (achRes.data && achRes.data.length > 0) ? achRes.data : dummyData.achievements;

      // Map and merge arrays
      const exps = (experiences || []).map(e => ({
         role: e.role, org: e.company, date: e.date_period, desc: e.description,
         icon: <Briefcase className="w-6 h-6 text-primary" />, _type: 'exp'
      }));
      const edus = (educations || []).map(e => ({
         role: e.degree, org: e.institution, date: e.date_period, desc: e.description,
         icon: <GraduationCap className="w-6 h-6 text-secondary" />, _type: 'edu'
      }));
      
      // Combine alternating
      const merged = [];
      const len = Math.max(exps.length, edus.length);
      for(let i=0; i<len; i++) {
        if (edus[i]) merged.push(edus[i]);
        if (exps[i]) merged.push(exps[i]);
      }
      setTimeline(merged);
      setAchievements(achs);
    }).catch(() => {
        // Fallback for everything if Promise.all hits error
        const exps = dummyData.experiences.map(e => ({
            role: e.role, org: e.company, date: e.date_period, desc: e.description,
            icon: <Briefcase className="w-6 h-6 text-primary" />, _type: 'exp'
        }));
        const edus = dummyData.educations.map(e => ({
            role: e.degree, org: e.institution, date: e.date_period, desc: e.description,
            icon: <GraduationCap className="w-6 h-6 text-secondary" />, _type: 'edu'
        }));
        const merged = [];
        const len = Math.max(exps.length, edus.length);
        for(let i=0; i<len; i++) {
          if (edus[i]) merged.push(edus[i]);
          if (exps[i]) merged.push(exps[i]);
        }
        setTimeline(merged);
        setAchievements(dummyData.achievements);
    });
  }, []);

  return (
    <section id="achievements" className="py-20">
      <div className="text-center mb-16">
        <span className="text-secondary font-mono tracking-wider text-sm">05. My Path</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Experience & <span className="text-primary">Education</span></h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:w-1 before:bg-white/10 before:ml-8 md:before:ml-[50%] md:before:-translate-x-[50%]">
        {timeline.map((exp, index) => (
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ duration: 0.55, delay: 0.1 * (index % 3) }} key={index} className={`relative flex flex-col md:flex-row items-center justify-between w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className={`w-full md:w-5/12 pl-16 pr-4 md:px-0 mt-20 md:mt-0 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
              <div className="glass p-6 rounded-2xl hover:border-primary/30 transition-colors">
                <span className="text-sm font-mono text-secondary tracking-widest block mb-2">{exp.date}</span>
                <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
                <h4 className="text-primary/80 font-medium mb-3 text-sm">{exp.org}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{exp.desc}</p>
              </div>
            </div>
            <div className="absolute top-0 md:top-1/2 left-8 md:left-1/2 -translate-x-1/2 md:-translate-y-1/2 w-16 h-16 rounded-full glass border border-white/20 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(255,255,255,0.05)] bg-[#0a0a0a]">
              {exp.icon}
            </div>
            <div className="hidden md:block w-5/12"></div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24">
        <div className="text-center mb-12">
          <span className="text-secondary font-mono tracking-wider text-sm">05b. Recognition</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Achievements & <span className="text-primary">Certifications</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {achievements.map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.4, delay: i * 0.06 }} className="glass p-5 rounded-2xl flex flex-col gap-3 hover:-translate-y-1 hover:border-primary/40 transition-all duration-300">
              <span className="text-3xl">{h.icon}</span>
              <p className="text-sm text-gray-300 leading-relaxed">{h.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
