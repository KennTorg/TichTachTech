import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tichtachtech')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ==================== MODELS ====================

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: String,
  image: String,
  tags: [String],
  status: { type: String, default: 'active' },
  featured: { type: Boolean, default: false },
  
  // Analytics
  analytics: {
    totalVisits: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    avgSessionDuration: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
  },
  
  // Revenue
  revenue: {
    total: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
  },
  
  // Tracking
  apiKey: String, // For webhook authentication
  googleAnalyticsId: String,
  stripeProductId: String,
  
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

// Analytics History Schema
const AnalyticsHistorySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  date: { type: Date, required: true },
  visits: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
}, { timestamps: true });

const AnalyticsHistory = mongoose.model('AnalyticsHistory', AnalyticsHistorySchema);

// ==================== AUTH MIDDLEWARE ====================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token mangler' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Ugyldig token' });
    }
    req.user = user;
    next();
  });
};

// Verify API Key for webhooks
const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key mangler' });
  }
  
  // Verify against project or environment variable
  if (apiKey !== process.env.AI_DESCRIPTION_API_KEY) {
    return res.status(403).json({ error: 'Ugyldig API key' });
  }
  
  next();
};

// ==================== AUTH ENDPOINTS ====================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    // Simple check for development (use bcrypt in production)
    if (password === 'tichtach2024') {
      const token = jwt.sign(
        { role: 'admin' }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      res.json({ 
        success: true,
        token,
        expiresIn: 86400
      });
    } else {
      res.status(401).json({ 
        success: false,
        error: 'Feil passord' 
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== PROJECT ENDPOINTS ====================

// Get all projects
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Kunne ikke hente prosjekter' });
  }
});

// Get single project
app.get('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Prosjekt ikke funnet' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create project
app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { title, description, url, image, tags, featured } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Tittel og beskrivelse er påkrevd' });
    }
    
    // Generate API key for this project
    const apiKey = `ttt_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
    
    const project = new Project({
      title,
      description,
      url,
      image,
      tags: tags || [],
      featured: featured || false,
      apiKey,
    });
    
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Kunne ikke opprette prosjekt' });
  }
});

// Update project
app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Prosjekt ikke funnet' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Kunne ikke oppdatere prosjekt' });
  }
});

// Delete project
app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Prosjekt ikke funnet' });
    }
    
    res.json({ success: true, message: 'Prosjekt slettet' });
  } catch (error) {
    res.status(500).json({ error: 'Kunne ikke slette prosjekt' });
  }
});

// ==================== WEBHOOK ENDPOINTS ====================

// Receive analytics data from projects
app.post('/api/webhooks/analytics', verifyApiKey, async (req, res) => {
  try {
    const { projectId, visits, uniqueVisitors, revenue, conversions } = req.body;
    
    // Update project analytics
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Prosjekt ikke funnet' });
    }
    
    // Update current stats
    project.analytics.totalVisits += visits || 0;
    project.analytics.uniqueVisitors += uniqueVisitors || 0;
    project.revenue.total += revenue || 0;
    
    await project.save();
    
    // Save history
    const history = new AnalyticsHistory({
      projectId,
      date: new Date(),
      visits: visits || 0,
      uniqueVisitors: uniqueVisitors || 0,
      revenue: revenue || 0,
      conversions: conversions || 0,
    });
    
    await history.save();
    
    res.json({ success: true, message: 'Analytics oppdatert' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Kunne ikke oppdatere analytics' });
  }
});

// Receive payment events
app.post('/api/webhooks/payment', verifyApiKey, async (req, res) => {
  try {
    const { projectId, amount, currency } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Prosjekt ikke funnet' });
    }
    
    project.revenue.total += amount;
    project.revenue.monthly += amount;
    project.revenue.currency = currency || 'USD';
    
    await project.save();
    
    res.json({ success: true, message: 'Betaling registrert' });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ error: 'Kunne ikke registrere betaling' });
  }
});

// ==================== ANALYTICS ENDPOINTS ====================

// Get overall analytics
app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find();
    
    const totalTraffic = projects.reduce((sum, p) => sum + p.analytics.totalVisits, 0);
    const totalRevenue = projects.reduce((sum, p) => sum + p.revenue.total, 0);
    const averageRevenue = projects.length > 0 ? totalRevenue / projects.length : 0;
    
    // Get historical data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const history = await AnalyticsHistory.aggregate([
      { $match: { date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { 
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          visits: { $sum: '$visits' },
          revenue: { $sum: '$revenue' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Format history data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trafficHistory = history.map(h => ({
      month: months[h._id.month - 1],
      visits: h.visits
    }));
    
    const revenueHistory = history.map(h => ({
      month: months[h._id.month - 1],
      revenue: h.revenue
    }));
    
    // Project stats
    const projectStats = projects.map(p => ({
      id: p._id,
      title: p.title,
      traffic: p.analytics.totalVisits,
      revenue: p.revenue.total,
    }));
    
    res.json({
      totalTraffic,
      totalRevenue,
      averageRevenue,
      projectCount: projects.length,
      featuredCount: projects.filter(p => p.featured).length,
      trafficHistory,
      revenueHistory,
      projectStats,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Kunne ikke hente analytics' });
  }
});

// Get project-specific analytics
app.get('/api/analytics/project/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Prosjekt ikke funnet' });
    }
    
    // Get last 30 days history
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const history = await AnalyticsHistory.find({
      projectId: req.params.id,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });
    
    res.json({
      project: {
        id: project._id,
        title: project.title,
        analytics: project.analytics,
        revenue: project.revenue,
      },
      history: history.map(h => ({
        date: h.date,
        visits: h.visits,
        uniqueVisitors: h.uniqueVisitors,
        revenue: h.revenue,
        conversions: h.conversions,
      }))
    });
  } catch (error) {
    console.error('Project analytics error:', error);
    res.status(500).json({ error: 'Kunne ikke hente prosjekt-analytics' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`
🚀 TichTachTech Backend Server
📍 Port: ${PORT}
🌐 URL: http://localhost:${PORT}
📊 Health: http://localhost:${PORT}/health
🔐 Auth: POST /api/auth/login
  `);
});

export default app;
