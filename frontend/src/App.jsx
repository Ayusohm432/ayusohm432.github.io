import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Achievements from './sections/Achievements';
import Resume from './sections/Resume';
import GithubStats from './sections/GithubStats';
import Contact from './sections/Contact';
import BlobBackground from './components/BlobBackground';
import CustomCursor from './components/CustomCursor';
import IssueListing from './pages/IssueListing';
import AdminDashboard from './pages/AdminDashboard';

function Portfolio() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
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

      <main className="container mx-auto px-6 pt-24 pb-12 sm:px-12 flex flex-col gap-24 relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Resume />
        <GithubStats />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Portfolio />} />
        <Route path="/issues" element={<IssueListing />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

