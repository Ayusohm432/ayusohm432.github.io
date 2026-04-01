import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Projects from '../sections/Projects';
import BlobBackground from '../components/BlobBackground';
import CustomCursor from '../components/CustomCursor';

const ProjectsPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Reset scroll position when arriving at this page
    window.scrollTo(0, 0);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      <CustomCursor />

      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary z-50 transition-all duration-300"
        style={{
          width: `${(scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`
        }}
      />

      <Navbar />
      <BlobBackground />

      <main className="container mx-auto px-6 pt-24 pb-12 sm:px-12 flex flex-col gap-24 relative z-10 min-h-screen">
        <Projects />
      </main>

      <Footer />
    </div>
  );
};

export default ProjectsPage;
