import React from 'react';
import { motion } from 'framer-motion';

// Defined OUTSIDE the parent component so it never remounts on re-render
const SkillCategory = ({ title, skills, delayOffset }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.2 }}
    transition={{ duration: 0.6, delay: delayOffset }}
    className="glass p-8 rounded-2xl flex-1 hover:border-primary/30 transition-colors duration-300"
  >
    <h3 className="text-xl font-bold mb-6 text-white text-center tracking-wider">{title}</h3>
    <div className="space-y-6">
      {skills.map((skill, index) => (
        <div key={skill.name}>
          <div className="flex justify-between text-sm mb-2 font-mono text-gray-400">
            <span className="text-gray-200">{skill.name}</span>
            <span>{skill.level}%</span>
          </div>
          <div className="w-full h-2 bg-surfaceLight rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 1, delay: delayOffset + 0.08 * index, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const Skills = () => {
  const languageSkills = [
    { name: 'JavaScript', level: 90 },
    { name: 'Python', level: 85 },
    { name: 'Java', level: 82 },
    { name: 'C / C++', level: 78 },
    { name: 'HTML / CSS', level: 95 },
    { name: 'Go', level: 55 },
  ];

  const frameworkSkills = [
    { name: 'React.js', level: 88 },
    { name: 'FastAPI', level: 82 },
    { name: 'Tailwind CSS', level: 90 },
    { name: 'Node.js / Express', level: 70 },
    { name: 'Flask', level: 72 },
    { name: 'PHP', level: 76 },
  ];

  const toolSkills = [
    { name: 'Git & GitHub', level: 88 },
    { name: 'MySQL / MongoDB', level: 82 },
    { name: 'Linux', level: 78 },
    { name: 'Firebase', level: 68 },
    { name: 'Docker', level: 55 },
    { name: 'Google Cloud', level: 60 },
  ];

  return (
    <section id="skills" className="py-20 relative">
      <div className="text-center mb-16">
        <span className="text-secondary font-mono tracking-wider text-sm">02. My Toolkit</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Professional <span className="text-primary">Skills</span></h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <SkillCategory title="Languages" skills={languageSkills} delayOffset={0.05} />
        <SkillCategory title="Frameworks & Libs" skills={frameworkSkills} delayOffset={0.15} />
        <SkillCategory title="Tools & DBs" skills={toolSkills} delayOffset={0.25} />
      </div>
    </section>
  );
};

export default Skills;
