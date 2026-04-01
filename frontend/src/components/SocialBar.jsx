import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Twitter, Mail, Phone, MessageCircle, Globe, Terminal } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const IconMap = {
  Linkedin: <Linkedin size={20} />,
  Github: <Github size={20} />,
  Twitter: <Twitter size={20} />,
  Mail: <Mail size={20} />,
  Phone: <Phone size={20} />,
  Globe: <Globe size={20} />,
  LeetCode: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-4.377 4.406a.324.324 0 0 0 .001.458l2.133 2.145a.338.338 0 0 0 .478-.002l3.134-3.155 4.459 4.484-7.667 7.712-3.335-3.354a.652.652 0 0 0-.933.009l-2.294 2.308a.347.347 0 0 0 .006.492l5.903 5.94a1.353 1.353 0 0 0 .963.403h.007c.348 0 .682-.138.935-.387l10.755-10.827a1.382 1.382 0 0 0-.012-1.956L14.423.414A1.365 1.365 0 0 0 13.483 0zm-8.288 11.399L1.861 14.73a1.382 1.382 0 0 0-.01 1.953l.548.553a1.341 1.341 0 0 0 1.939-.012l3.352-3.371a.34.34 0 0 0-.01-.482l-2.146-2.158a.33.33 0 0 0-.449-.001h-.052z" />
    </svg>
  ),
  GeeksforGeeks: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.992 0L10.378 1.611l-3.387 3.39L5.38 6.611 7 8.225l5 4.996L17 8.225l1.619-1.614-1.606-1.611-3.39-3.39L12.011 0h-.019zm10.384 10.378L20.765 12l1.611 1.622-1.611 1.611-3.39 3.39L15.765 20.244 14.153 18.633l-5-5-5 5-1.611 1.611L.931 18.633l1.614-1.611 3.39-3.39L7.545 12 5.934 10.378 4.322 8.767 2.711 7.153 1.1 5.545l1.611-1.611 3.39-3.39L7.712.931 9.324 2.545 14.32 7.541l4.997-4.996 1.611-1.614 1.611 1.611 3.39 3.39-1.611 1.614-1.611-1.614-1.611 1.614-3.39 3.39L16.096 12l1.611 1.622 3.39 3.39L22.711 18.625l1.611-1.611-1.611-1.611-1.611 1.611-3.39 3.39L16.096 12l1.611-1.611 3.39-3.39 1.611-1.614-1.611-1.611 1.611-1.611z" />
    </svg>
  ),
};

const SocialBar = () => {
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/social-links`)
      .then(res => {
        setSocials(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch social links", err);
        // Fallback to minimal data if needed
      });
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed z-50 pointer-events-none md:left-6 md:top-1/2 md:-translate-y-1/2 md:w-auto w-full bottom-6 left-0 flex justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="glass-social pointer-events-auto flex md:flex-col items-center gap-2 p-2 rounded-2xl border border-white/10 backdrop-blur-3xl bg-[#0a0a0a]/40 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-[90vw] overflow-x-auto no-scrollbar md:overflow-visible"
      >
        <button 
          onClick={scrollToContact}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 active:scale-95 group relative mb-0 md:mb-2 flex-shrink-0"
        >
          <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute left-full ml-4 px-2 py-1 bg-surfaceLight border border-white/10 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap hidden md:block">
            LEAVE A MESSAGE
          </span>
        </button>

        <div className="w-[1px] h-6 bg-white/10 md:w-10 md:h-[1px] my-0 md:my-1 flex-shrink-0"></div>

        {socials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl text-gray-400 transition-all duration-300 group relative flex-shrink-0 ${social.color_class}`}
          >
            {IconMap[social.icon_name] || <Terminal size={20} />}
            <span className="absolute left-full ml-4 px-2 py-1 bg-surfaceLight border border-white/10 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap hidden md:block uppercase tracking-widest">
              {social.name}
            </span>
          </a>
        ))}
      </motion.div>
    </div>
  );
};

export default SocialBar;
