import React, { useState, useEffect } from 'react';
import { Menu, X, Code2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { name: 'About', href: '/#about' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Achievements', href: '/#achievements' },
    { name: 'Contact', href: '/#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
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
          <a href="/#resume" className="px-5 py-2 rounded-full border border-primary/50 text-primary hover:bg-primary/10 transition-colors font-medium text-sm ml-4">
            Resume
          </a>
          {/* Private issue board link — subtle */}
          <Link to="/issues" className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-red-500/30 text-red-400/70 hover:text-red-400 hover:border-red-500/60 hover:bg-red-500/10 transition-colors text-xs font-mono ml-1" title="Issue Board (Private)">
            <ShieldAlert className="w-3.5 h-3.5" /> Issues
          </Link>
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
            className="absolute top-full left-0 w-full glass border-t border-white/10 flex flex-col items-center py-6 space-y-6 shadow-2xl md:hidden"
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-gray-300 hover:text-primary transition-colors"
              >
                {item.name}
              </a>
            ))}
            <a href="/#resume" onClick={() => setIsOpen(false)} className="px-6 py-3 rounded-full bg-primary/20 text-primary border border-primary/50 font-medium">
              View Resume
            </a>
            <Link to="/issues" onClick={() => setIsOpen(false)} className="flex items-center gap-1.5 text-sm text-red-400/70 border border-red-500/30 px-4 py-2 rounded-full hover:text-red-400 transition-colors font-mono">
              <ShieldAlert className="w-4 h-4" /> Issue Board
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
