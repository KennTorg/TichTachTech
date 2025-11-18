import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { t } from '../utils/translations';
import { useProjects } from '../context/ProjectContext';

export default function Projects({ darkMode, language, onHoverChange }) {
  const [scrollY, setScrollY] = useState(0);
  const { getActiveProjects } = useProjects();
  
  // Hent prosjekter fra context
  const contextProjects = getActiveProjects();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fallback til default prosjekter hvis ingen er i context
  const defaultProjects = [
    { 
      title: t(language, 'projects.items.freelanceFlow.title'), 
      subtitle: t(language, 'projects.items.freelanceFlow.subtitle') 
    },
    { 
      title: t(language, 'projects.items.auroraCanvas.title'), 
      subtitle: t(language, 'projects.items.auroraCanvas.subtitle') 
    },
    { 
      title: t(language, 'projects.items.diaperRadar.title'), 
      subtitle: t(language, 'projects.items.diaperRadar.subtitle') 
    },
  ];

  // Bruk context-prosjekter hvis tilgjengelig, ellers fallback
  const projects = contextProjects.length > 0 
    ? contextProjects.map(p => ({
        id: p.id,
        title: p.title,
        subtitle: p.description,
        tags: p.tags,
        featured: p.featured,
      }))
    : defaultProjects;

  const isInView = scrollY > 1200;

  return (
    <section 
      className="min-h-screen flex items-center justify-center px-6 py-20"
      onMouseEnter={() => {
        if (onHoverChange) onHoverChange(true);
      }}
      onMouseLeave={() => {
        if (onHoverChange) onHoverChange(false);
      }}
    >
      <div className="max-w-5xl w-full">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="text-3xl font-light mb-2 transition-colors duration-700"
            style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
          >
            {t(language, 'projects.title')}
          </h2>
          <p 
            className="transition-colors duration-700"
            style={{ color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
          >
            {t(language, 'projects.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id || project.title}
              project={project}
              index={index}
              isInView={isInView}
              darkMode={darkMode}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, isInView, darkMode, language }) {
  return (
    <motion.div
      drag
      dragConstraints={{
        left: -window.innerWidth + 300,
        right: window.innerWidth - 300,
        top: -window.innerHeight + 300,
        bottom: window.innerHeight - 300,
      }}
      dragElastic={0}
      whileDrag={{ scale: 1.05, rotate: 5 }}
      whileHover={{ rotate: index % 2 ? -2 : 2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-grab active:cursor-grabbing select-none"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        type: "spring",
        stiffness: 100
      }}
    >
      <div 
        className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
        style={{
          backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          borderWidth: '1px',
        }}
      >
        {/* Featured badge */}
        {project.featured && (
          <div 
            className="absolute top-4 right-4 px-2 py-1 rounded text-xs font-bold"
            style={{
              backgroundColor: darkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 215, 0, 0.3)',
              color: darkMode ? '#FFD700' : '#B8860B',
            }}
          >
            ⭐ Featured
          </div>
        )}

        <h3 
          className="text-lg font-semibold mb-2 transition-colors duration-700"
          style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
        >
          {project.title}
        </h3>
        <p 
          className="text-sm transition-colors duration-700 mb-3"
          style={{ color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
        >
          {project.subtitle}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded transition-colors duration-700"
                style={{
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div 
          className="mt-4 pt-4 transition-colors duration-700"
          style={{
            borderTopColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            borderTopWidth: '1px',
          }}
        >
          <button 
            className="inline-flex items-center gap-2 text-sm hover:gap-3 transition-all duration-300"
            style={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}
          >
            {t(language, 'projects.viewProject')} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
