import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, BugPlay, MessageSquare } from 'lucide-react';
import axios from 'axios';
import BugReportModal from '../components/modals/BugReportModal';
import FeedbackModal from '../components/modals/FeedbackModal';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback static data if backend is not reachable
        setProjects([
          {
            id: 1,
            title: "Feedback Management System",
            description: "A full-stack web application for collecting and managing academic feedback efficiently, featuring interactive dashboards.",
            tech_stack: "PHP, MySQL, JavaScript",
            github_link: "https://github.com/Ayusohm432/Feedback-Management-System",
            live_demo: "https://ayusohm432.github.io/Feedback-Management-System/"
          },
          {
            id: 2,
            title: "AI Skills Gap Analyzer",
            description: "An intelligent career development platform designed to help students understand industry skill requirements and prepare effectively for technical roles.",
            tech_stack: "JavaScript, HTML, CSS",
            github_link: "https://github.com/Ayusohm432/AI-Skills-Gap-Analyzer",
            live_demo: "https://ayusohm432.github.io/AI-Skills-Gap-Analyzer/"
          },
          {
            id: 3,
            title: "AgenticGoKit",
            description: "Open-source Agentic AI framework in Go for building, orchestrating, and deploying intelligent agents. LLM-agnostic and event-driven.",
            tech_stack: "Go, AI Agents",
            github_link: "https://github.com/Ayusohm432/AgenticGoKit",
            live_demo: "#"
          },
          {
            id: 4,
            title: "StegoShield",
            description: "Advanced steganography application for secure message hiding and extraction using modern cryptographic techniques.",
            tech_stack: "Python, Security",
            github_link: "https://github.com/Ayusohm432/StegoShield",
            live_demo: "#"
          },
          {
            id: 5,
            title: "Next-Gen Portfolio",
            description: "A modern, interactive frontend with a scalable FastAPI backend supporting real-time bug reporting and feedback.",
            tech_stack: "React, FastAPI, Tailwind CSS, Framer Motion",
            github_link: "https://github.com/Ayusohm432/ayusohm432.github.io",
            live_demo: "https://ayusohm432.github.io"
          },
          {
            id: 6,
            title: "MediSync — Healthcare Management System",
            description: "A real-time healthcare resource and inventory management system with secure PHP-MySQL backend and responsive UI.",
            tech_stack: "HTML, CSS, JavaScript, PHP, MySQL",
            github_link: "https://github.com/Ayusohm432",
            live_demo: "#"
          },
          {
            id: 7,
            title: "Predictive Analysis in AI Model Training",
            description: "Optimization models for AI training using statistical techniques for parameter tuning, error reduction, and model evaluation.",
            tech_stack: "Python, Machine Learning, Data Science",
            github_link: "https://github.com/Ayusohm432",
            live_demo: "#"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const openBugModal = (projectName) => {
    setActiveProject(projectName);
    setIsBugModalOpen(true);
  };

  const openFeedbackModal = (projectName) => {
    setActiveProject(projectName);
    setIsFeedbackModalOpen(true);
  };

  return (
    <section id="projects" className="py-20 relative">
      <div className="text-center mb-16">
        <span className="text-secondary font-mono tracking-wider text-sm">03. My Work</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Featured <span className="text-primary">Projects</span></h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass p-8 rounded-3xl group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full mix-blend-screen filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
              <p className="text-gray-400 mb-6 leading-relaxed h-[80px] overflow-hidden">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.tech_stack.split(',').map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-gray-300">
                    {tech.trim()}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-auto border-t border-white/10 pt-6">
                <div className="flex gap-4">
                  {project.github_link && (
                    <a href={project.github_link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Source Code">
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                  {project.live_demo && project.live_demo !== '#' && (
                    <a href={project.live_demo} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors" title="Live Preview">
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => openBugModal(project.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors border border-red-500/20"
                    title="Report a bug"
                  >
                    <BugPlay className="w-4 h-4" /> Bug?
                  </button>
                  <button
                    onClick={() => openFeedbackModal(project.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 text-xs font-medium transition-colors border border-secondary/20"
                    title="Leave feedback"
                  >
                    <MessageSquare className="w-4 h-4" /> Feedback
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Interactive Modals */}
      <BugReportModal
        isOpen={isBugModalOpen}
        onClose={() => setIsBugModalOpen(false)}
        projectName={activeProject}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        projectName={activeProject}
      />

    </section>
  );
};

export default Projects;
