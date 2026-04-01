import React from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, GraduationCap, Bot } from 'lucide-react';

const Achievements = () => {
  const timeline = [
    {
      role: 'B.Tech in Computer Science & Engineering',
      org: 'Gaya College of Engineering · Bihar Engineering University',
      date: '2023 – 2026',
      icon: <GraduationCap className="w-6 h-6 text-primary" />,
      desc: 'Pursuing with a CGPA of 8.55 / 10. Focus on advanced algorithms, full-stack development, and practical software engineering.',
    },
    {
      role: 'Full-Stack Developer Intern',
      org: 'Bytical.ai',
      date: 'May 2025 – Present',
      icon: <Briefcase className="w-6 h-6 text-secondary" />,
      desc: 'Implemented JWT authentication & autosave. Built scalable APIs using FastAPI, React, and MongoDB. Improved UX and backend performance for production systems.',
    },
    {
      role: 'AI Data Annotator (Part-time)',
      org: 'Outlier · Remote',
      date: '2024',
      icon: <Bot className="w-6 h-6 text-accent" />,
      desc: 'Labeled datasets for Computer Vision & NLP models. Improved ML training accuracy and maintained data consistency standards.',
    },
    {
      role: 'Android Developer Intern',
      org: 'Gowox Infotech Pvt. Ltd.',
      date: 'Apr 2022 – May 2022',
      icon: <Briefcase className="w-6 h-6 text-primary" />,
      desc: 'Developed Android applications using Java & XML. Integrated Firebase Authentication and Realtime Database.',
    },
    {
      role: 'Web Developer Intern',
      org: 'Gowox Infotech Pvt. Ltd.',
      date: 'Dec 2022 – Jan 2023',
      icon: <Briefcase className="w-6 h-6 text-secondary" />,
      desc: 'Built responsive web pages using HTML, CSS, JavaScript, PHP with MySQL backend integration.',
    },
    {
      role: 'Technical Blogger',
      org: 'Hashnode & WordPress',
      date: '2023 – Present',
      icon: <Award className="w-6 h-6 text-accent" />,
      desc: 'Authoring technical articles on web development, Android, AI, and software engineering for the developer community.',
    },
    {
      role: 'Diploma in Computer Science & Engineering',
      org: 'Government Polytechnic, Muzaffarpur · SBTE',
      date: '2020 – 2023',
      icon: <GraduationCap className="w-6 h-6 text-secondary" />,
      desc: 'Graduated with a CGPA of 8.58 / 10. Foundation in programming, networking, and core CS principles.',
    },
  ];

  const highlights = [
    { icon: '🏆', text: 'Solved 1000+ coding problems on LeetCode, GeeksForGeeks, and other platforms' },
    { icon: '🎯', text: 'Participated in ICPC Contest in 2024 and 2025' },
    { icon: '🚀', text: 'Participated in State and National level hackathons' },
    { icon: '☁️', text: 'Microsoft Certified: Azure AI Engineer Associate' },
    { icon: '📜', text: 'NPTEL Certifications: C Programming, Java, Machine Learning' },
    { icon: '🌐', text: 'Cisco Certified: Networking Essentials & C++ Programming Essentials' },
    { icon: '🤖', text: 'Edunet Foundation: Foundations of AI' },
    { icon: '💻', text: 'Infochord Technologies: Web Development Certification' },
  ];

  return (
    <section id="achievements" className="py-20">
      <div className="text-center mb-16">
        <span className="text-secondary font-mono tracking-wider text-sm">05. My Path</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Experience & <span className="text-primary">Education</span></h2>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:w-1 before:bg-white/10 before:ml-8 md:before:ml-[50%] md:before:-translate-x-[50%]">
        {timeline.map((exp, index) => (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.1 * (index % 3) }}
            key={index}
            className={`relative flex flex-col md:flex-row items-center justify-between w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
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

      {/* Highlights / Certifications grid */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <span className="text-secondary font-mono tracking-wider text-sm">05b. Recognition</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Achievements & <span className="text-primary">Certifications</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass p-5 rounded-2xl flex flex-col gap-3 hover:-translate-y-1 hover:border-primary/40 transition-all duration-300"
            >
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
