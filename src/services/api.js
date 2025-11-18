// API Service for TichTachTech Admin
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('tichtachtech_admin_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('tichtachtech_admin_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('tichtachtech_admin_token');
  }

  async request(endpoint, options = {}) {
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async logout() {
    this.clearToken();
  }

  // Projects
  async getProjects() {
    return this.request('/projects');
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  async createProject(project) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id, project) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getAnalytics() {
    return this.request('/analytics');
  }

  async getProjectAnalytics(id) {
    return this.request(`/analytics/project/${id}`);
  }

  // Health check
  async checkHealth() {
    return fetch(`${API_BASE_URL.replace('/api', '')}/health`).then(r => r.json());
  }
}

export default new ApiService();
