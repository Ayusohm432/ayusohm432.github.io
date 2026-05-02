import React, { useState, useEffect } from 'react';
import { Menu, X, Code2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 sm:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
          <Code2 className="text-primary w-8 h-8" />
          <span className="text-white hover:text-gradient transition-all duration-300">Ayush<span className="text-primary">.dev</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-300 hover:text-white hover:text-gradient transition-all text-sm font-medium uppercase tracking-wider relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all group-hover:w-full"></span>
            </a>
          ))}
          <a href="#resume" className="px-5 py-2 rounded-full border border-primary/50 text-primary hover:bg-primary/10 transition-colors font-medium text-sm ml-4">
            Resume
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full h-[100dvh] backdrop-blur-2xl border-t border-white/5 flex flex-col items-center pt-12 pb-32 md:hidden overflow-y-auto" style={{ background: 'rgba(8,8,16,0.97)' }}
          >
            <div className="flex flex-col items-center space-y-8 w-full mt-4">
              {navItems.map((item, i) => (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-extrabold uppercase tracking-widest text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-primary hover:to-secondary transition-all w-full text-center py-2"
                >
                  {item.name}
                </motion.a>
              ))}
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <Link to="/report" onClick={() => setIsOpen(false)} className="text-2xl font-extrabold uppercase tracking-widest text-red-500 flex items-center justify-center gap-3 py-2">
                  <ShieldAlert className="w-6 h-6" /> Report Issue
                </Link>
              </motion.div>

              <div className="w-16 h-[2px] bg-white/10 my-4 rounded-full"></div>

              <motion.a 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                href="#resume" 
                onClick={() => setIsOpen(false)} 
                className="px-10 py-4 w-[250px] text-center rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-white border border-primary/40 font-bold hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all"
              >
                View Resume
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
