import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { dummyData } from '../data/dummyData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SkillCategory = ({ title, skills, delayOffset }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.6, delay: delayOffset }} className="glass p-8 rounded-2xl flex-1 hover:border-primary/30 transition-colors duration-300">
    <h3 className="text-xl font-bold mb-6 text-white text-center tracking-wider">{title}</h3>
    <div className="space-y-6">
      {skills.map((skill, index) => (
        <div key={skill.name}>
          <div className="flex justify-between text-sm mb-2 font-mono text-gray-400">
            <span className="text-gray-200">{skill.name}</span>
            <span>{skill.level}%</span>
          </div>
          <div className="w-full h-2 bg-surfaceLight rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: false, amount: 0.5 }} transition={{ duration: 1, delay: delayOffset + 0.08 * index, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-primary to-accent rounded-full" />
          </div>
        </div>
      ))}
      {skills.length === 0 && <p className="text-gray-500 text-sm italic text-center">No skills populated in database.</p>}
    </div>
  </motion.div>
);

const Skills = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/skills`).then(res => {
      setData(res.data && res.data.length > 0 ? res.data : dummyData.skills);
    }).catch(() => {
      setData(dummyData.skills);
    });
  }, []);

  const categorizedSkills = useMemo(() => {
    const map = {};
    data.forEach(s => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return Object.entries(map);
  }, [data]);

  return (
    <section id="skills" className="py-20 relative">
      <div className="text-center mb-16">
        <span className="text-secondary font-mono tracking-wider text-sm">02. My Toolkit</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Professional <span className="text-primary">Skills</span></h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-wrap">
        {categorizedSkills.map(([cat, skills], i) => (
           <SkillCategory key={cat} title={cat} skills={skills} delayOffset={0.05 + (i * 0.1)} />
        ))}
        {data.length === 0 && <div className="w-full text-center text-gray-500 py-10 animate-pulse">Loading skill infrastructure...</div>}
      </div>
    </section>
  );
};

export default Skills;
