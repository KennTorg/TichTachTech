import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { t } from '../utils/translations';

export default function Projects({ darkMode, language }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
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

  const isInView = scrollY > 1200;

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
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
              key={project.title}
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
        className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
        style={{
          backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          borderWidth: '1px',
        }}
      >
        <h3 
          className="text-lg font-semibold mb-2 transition-colors duration-700"
          style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
        >
          {project.title}
        </h3>
        <p 
          className="text-sm transition-colors duration-700"
          style={{ color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
        >
          {project.subtitle}
        </p>
        
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
