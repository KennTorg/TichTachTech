import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, DollarSign, Eye, Plus, Edit2, Trash2, LogOut, 
  Save, X, Home 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProject, setEditingProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const COLORS = ['#06b6d4', '#a855f7', '#ec4899', '#8b5cf6', '#06d6a0'];

  // Statistikk
  const totalTraffic = projects.reduce((sum, p) => sum + (p.traffic || 0), 0);
  const totalRevenue = projects.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const averageRevenue = projects.length > 0 ? Math.round(totalRevenue / projects.length) : 0;

  // Data for grafer
  const trafficData = [
    { month: 'Jan', visits: 4200 },
    { month: 'Feb', visits: 5100 },
    { month: 'Mar', visits: 6800 },
    { month: 'Apr', visits: 7200 },
    { month: 'May', visits: 8900 },
    { month: 'Jun', visits: 9500 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 3200 },
    { month: 'Feb', revenue: 4100 },
    { month: 'Mar', revenue: 5200 },
    { month: 'Apr', revenue: 6100 },
    { month: 'May', revenue: 7300 },
    { month: 'Jun', revenue: 8900 },
  ];

  const projectDistribution = projects.map(p => ({
    name: p.title,
    value: p.traffic || 0
  }));

  const handleLogout = () => {
    localStorage.removeItem('tichtachtech_admin_token');
    navigate('/admin');
  };

  const handleAddProject = () => {
    setEditingProject({
      title: '',
      description: '',
      image: '',
      tags: [],
      traffic: 0,
      revenue: 0,
      featured: false
    });
    setShowProjectForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject({ ...project });
    setShowProjectForm(true);
  };

  const handleSaveProject = () => {
    if (!editingProject.title || !editingProject.description) {
      setError('Tittel og beskrivelse er påkrevd');
      return;
    }

    setLoading(true);
    setError('');
    
    setTimeout(() => {
      try {
        if (editingProject.id) {
          updateProject(editingProject.id, editingProject);
          setSuccessMessage('Prosjekt oppdatert!');
        } else {
          addProject(editingProject);
          setSuccessMessage('Prosjekt opprettet!');
        }
        
        setShowProjectForm(false);
        setEditingProject(null);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Kunne ikke lagre prosjekt');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleDeleteProject = (id) => {
    if (!window.confirm('Er du sikker på at du vil slette dette prosjektet?')) {
      return;
    }
    
    deleteProject(id);
    setSuccessMessage('Prosjekt slettet!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Success/Error Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {successMessage}
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                TichTachTech Admin
              </h1>
              <p className="text-slate-400 text-sm">Dashboard & Prosjektstyring</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
              >
                <Home size={18} />
                Til forsiden
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
              >
                <LogOut size={18} />
                Logg ut
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            Prosjekter ({projects.length})
          </button>
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <Eye className="text-cyan-400" size={24} />
                </div>
                <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                  <TrendingUp size={16} />
                  +12.5%
                </span>
              </div>
              <h3 className="text-slate-400 text-sm mb-1">Total Trafikk</h3>
              <p className="text-3xl font-bold text-white">{totalTraffic.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <DollarSign className="text-purple-400" size={24} />
                </div>
                <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                  <TrendingUp size={16} />
                  +18.2%
                </span>
              </div>
              <h3 className="text-slate-400 text-sm mb-1">Total Inntekt</h3>
              <p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-pink-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-500/20 rounded-lg">
                  <svg className="text-pink-400" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                  <TrendingUp size={16} />
                  +8.1%
                </span>
              </div>
              <h3 className="text-slate-400 text-sm mb-1">Gj.snitt Inntekt</h3>
              <p className="text-3xl font-bold text-white">${averageRevenue.toLocaleString()}</p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Trafikk Oversikt</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #06b6d4',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Inntekt Oversikt</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #a855f7',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Project Distribution */}
          {projectDistribution.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-pink-500/20"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Prosjekt Distribusjon</h3>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {projectDistribution.map((project, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-slate-300">{project.name}</span>
                      <span className="text-slate-500 ml-auto">{project.value.toLocaleString()} besøk</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Administrer Prosjekter</h2>
            <button
              onClick={handleAddProject}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50"
            >
              <Plus size={20} />
              Legg til Prosjekt
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20">
              <p className="text-slate-400 mb-4">Ingen prosjekter ennå</p>
              <button
                onClick={handleAddProject}
                className="px-6 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition"
              >
                Opprett ditt første prosjekt
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-cyan-500/20 hover:border-cyan-500/40 transition group"
                >
                  <div className="relative h-48 bg-slate-700 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20"></div>
                    {project.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-slate-900 text-xs font-bold rounded-full">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags && project.tags.map((tag, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Trafikk</p>
                        <p className="text-white font-semibold">{(project.traffic || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Inntekt</p>
                        <p className="text-white font-semibold">${(project.revenue || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition disabled:opacity-50"
                      >
                        <Edit2 size={16} />
                        Rediger
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Project Form Modal */}
      <AnimatePresence>
        {showProjectForm && editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => {
              if (!loading) {
                setShowProjectForm(false);
                setEditingProject(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border border-cyan-500/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingProject.id ? 'Rediger Prosjekt' : 'Nytt Prosjekt'}
                </h3>
                <button
                  onClick={() => {
                    if (!loading) {
                      setShowProjectForm(false);
                      setEditingProject(null);
                    }
                  }}
                  disabled={loading}
                  className="text-slate-400 hover:text-white disabled:opacity-50"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tittel *</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Beskrivelse *</label>
                  <textarea
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 h-24"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Bilde URL</label>
                  <input
                    type="text"
                    value={editingProject.image}
                    onChange={(e) => setEditingProject({...editingProject, image: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="https://..."
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tags (komma-separert)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingProject.tags) ? editingProject.tags.join(', ') : ''}
                    onChange={(e) => setEditingProject({
                      ...editingProject, 
                      tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                    })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="React, Node.js, MongoDB"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Trafikk</label>
                    <input
                      type="number"
                      value={editingProject.traffic}
                      onChange={(e) => setEditingProject({...editingProject, traffic: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      min="0"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Inntekt ($)</label>
                    <input
                      type="number"
                      value={editingProject.revenue}
                      onChange={(e) => setEditingProject({...editingProject, revenue: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      min="0"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) => setEditingProject({...editingProject, featured: e.target.checked})}
                      className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-800"
                      disabled={loading}
                    />
                    <span className="text-slate-300">Featured prosjekt</span>
                  </label>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSaveProject}
                    disabled={loading || !editingProject.title || !editingProject.description}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={20} />
                    {loading ? 'Lagrer...' : 'Lagre'}
                  </button>
                  <button
                    onClick={() => {
                      setShowProjectForm(false);
                      setEditingProject(null);
                    }}
                    disabled={loading}
                    className="px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition disabled:opacity-50"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
