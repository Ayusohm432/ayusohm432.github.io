import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass mt-24 py-12 border-t border-white/10">
      <div className="container mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-bold tracking-tighter mb-2">Ayush<span className="text-primary">.dev</span></h2>
          <p className="text-gray-400 text-sm text-center md:text-left max-w-sm">
            Building modern web experiences and exploring full-stack engineering at Gaya College of Engineering.
          </p>
        </div>
        
        <div className="flex gap-6">
          <a href="https://github.com/ayusohm432" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://linkedin.com/in/ayusohm432" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="mailto:ayushkumar76174@gmail.com" className="text-gray-400 hover:text-accent transition-colors p-2 rounded-full hover:bg-accent/10">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div className="container mx-auto px-6 sm:px-12 mt-8 pt-8 border-t border-white/5 text-center flex flex-col items-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Ayush Kumar. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
