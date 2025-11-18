import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  // Initial dummy data - dette vil bli administrert via admin
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Modern online shopping experience with AI recommendations',
      image: '/api/placeholder/400/300',
      tags: ['React', 'Node.js', 'MongoDB', 'AI'],
      traffic: 15420,
      revenue: 12500,
      status: 'active',
      featured: true,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      title: 'AI Dashboard',
      description: 'Analytics powered by machine learning algorithms',
      image: '/api/placeholder/400/300',
      tags: ['Python', 'TensorFlow', 'React', 'D3.js'],
      traffic: 8900,
      revenue: 8200,
      status: 'active',
      featured: false,
      createdAt: new Date('2024-02-01'),
    },
    {
      id: 3,
      title: 'Mobile App',
      description: 'Cross-platform mobile solution for iOS and Android',
      image: '/api/placeholder/400/300',
      tags: ['React Native', 'Firebase', 'TypeScript'],
      traffic: 12300,
      revenue: 9800,
      status: 'active',
      featured: true,
      createdAt: new Date('2024-03-10'),
    },
  ]);

  // Last fra localStorage ved oppstart
  useEffect(() => {
    const savedProjects = localStorage.getItem('tichtachtech_projects');
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        setProjects(parsed.map(p => ({
          ...p,
          createdAt: new Date(p.createdAt),
        })));
      } catch (error) {
        console.error('Error loading projects from localStorage:', error);
      }
    }
  }, []);

  // Lagre til localStorage når prosjekter endres
  useEffect(() => {
    localStorage.setItem('tichtachtech_projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now(),
      createdAt: new Date(),
      status: 'active',
    };
    setProjects([...projects, newProject]);
    return newProject;
  };

  const updateProject = (id, updatedProject) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, ...updatedProject } : p
    ));
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const getProjectById = (id) => {
    return projects.find(p => p.id === id);
  };

  const getFeaturedProjects = () => {
    return projects.filter(p => p.featured && p.status === 'active');
  };

  const getActiveProjects = () => {
    return projects.filter(p => p.status === 'active');
  };

  const value = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getFeaturedProjects,
    getActiveProjects,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
