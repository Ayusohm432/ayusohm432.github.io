import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, BugPlay, MessageSquare, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { dummyData } from '../data/dummyData';
import BugReportModal from '../components/modals/BugReportModal';
import FeedbackModal from '../components/modals/FeedbackModal';

const Projects = ({ limit, showViewMore = false }) => {
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
        setProjects(response.data && response.data.length > 0 ? response.data : dummyData.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects(dummyData.projects);
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
        <>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {projects.slice(0, limit || projects.length).map((project, index) => (
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

        {showViewMore && projects.length > (limit || 0) && (
          <div className="mt-16 flex justify-center">
            <Link to="/projects" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-black rounded-lg font-bold hover:bg-primary/90 transition-colors group">
              View Entire Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </>
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
