# 🔧 TichTachTech Backend API

Backend server for TichTachTech Admin Dashboard - håndterer prosjektdata, analytics og webhooks.

---

## 📋 Innhold

- Express.js API server
- MongoDB database
- JWT autentisering
- Analytics webhooks
- Payment tracking
- Google Analytics integration (optional)

---

## 🚀 Quick Start

```bash
# Installer dependencies
npm install

# Opprett .env
cp .env.example .env

# Rediger .env og legg til dine verdier

# Start server
npm run dev
```

Server kjører på: `http://localhost:3001`

---

## 📁 Filer

```
backend/
├── server.js                        # Main Express server
├── tichtachtech-tracker.js         # Tracker for React/build tools
├── tichtachtech-tracker-simple.js  # Tracker for vanilla JS/HTML
├── package.json
├── .env.example
└── README.md
```

---

## 🔑 Environment Variables

Se `.env.example` for alle variabler.

**Minimum required:**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/tichtachtech
JWT_SECRET=generer-en-random-hex-string
AI_DESCRIPTION_API_KEY=din-api-key
```

---

## 🛣️ API Endpoints

### Auth
```
POST   /api/auth/login      # Login og få JWT token
```

### Projects
```
GET    /api/projects        # Hent alle prosjekter
GET    /api/projects/:id    # Hent ett prosjekt
POST   /api/projects        # Opprett nytt prosjekt
PUT    /api/projects/:id    # Oppdater prosjekt
DELETE /api/projects/:id    # Slett prosjekt
```

### Analytics
```
GET    /api/analytics                # Hent overall analytics
GET    /api/analytics/project/:id    # Hent prosjekt-spesifikk analytics
```

### Webhooks (krever API key)
```
POST   /api/webhooks/analytics       # Motta analytics data
POST   /api/webhooks/payment         # Motta payment events
```

### Health
```
GET    /health                       # Health check
```

---

## 🔐 Autentisering

### Admin (JWT)
```javascript
// Login
POST /api/auth/login
{
  "password": "tichtach2024"
}

// Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}

// Bruk token i requests
Authorization: Bearer <token>
```

### Webhooks (API Key)
```javascript
// Webhooks krever API key header
X-API-Key: your-api-key
```

---

## 📊 Data Models

### Project
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  url: String,
  image: String,
  tags: [String],
  status: String, // 'active' | 'archived'
  featured: Boolean,
  
  analytics: {
    totalVisits: Number,
    uniqueVisitors: Number,
    pageViews: Number,
    avgSessionDuration: Number,
    bounceRate: Number,
  },
  
  revenue: {
    total: Number,
    monthly: Number,
    currency: String,
  },
  
  apiKey: String,
  googleAnalyticsId: String,
  stripeProductId: String,
  
  createdAt: Date,
  updatedAt: Date,
}
```

### Analytics History
```javascript
{
  _id: ObjectId,
  projectId: ObjectId,
  date: Date,
  visits: Number,
  uniqueVisitors: Number,
  revenue: Number,
  conversions: Number,
  createdAt: Date,
  updatedAt: Date,
}
```

---

## 🔌 Bruke Trackeren

### React/Modern JS

```javascript
import TichTachTechTracker from './tichtachtech-tracker';

const tracker = new TichTachTechTracker({
  apiUrl: 'http://localhost:3001/api',
  apiKey: 'your-api-key',
  projectId: 'your-project-id',
  autoTrack: true,
});

// Track event
tracker.trackEvent('button_clicked', { button: 'generate' });

// Track conversion
tracker.trackConversion({
  type: 'payment',
  value: 9.99,
  currency: 'USD',
});
```

### Vanilla JS/HTML

```html
<script src="tichtachtech-tracker-simple.js"></script>
<script>
  var tracker = new TichTachTechTracker({
    apiUrl: 'http://localhost:3001/api',
    apiKey: 'your-api-key',
    projectId: 'your-project-id',
    autoTrack: true,
  });
  
  // Track events
  tracker.trackEvent('page_view');
</script>
```

---

## 🗄️ Database

### MongoDB Lokal

```bash
# Mac
brew install mongodb-community
brew services start mongodb-community

# Windows
# Download from mongodb.com

# Linux
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### MongoDB Atlas (Cloud)

1. Gå til [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Opprett gratis cluster
3. Få connection string
4. Legg til i `.env`

---

## 🧪 Testing

### Manual Testing

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"tichtach2024"}'

# Get projects (med token)
curl http://localhost:3001/api/projects \
  -H "Authorization: Bearer <token>"

# Send analytics
curl -X POST http://localhost:3001/api/webhooks/analytics \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"projectId":"xxx","visits":1}'
```

---

## 🚀 Production Deployment

### Heroku

```bash
# Login
heroku login

# Create app
heroku create tichtachtech-api

# Add MongoDB addon (eller bruk Atlas)
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set AI_DESCRIPTION_API_KEY=your-key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Railway

```bash
# Install Railway CLI
npm install -g railway

# Login
railway login

# Init project
railway init

# Add MongoDB plugin
railway add mongodb

# Deploy
railway up
```

---

## 📝 Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

**Problem:** `MongooseError: Cannot connect to MongoDB`

**Løsning:**
```bash
# Sjekk at MongoDB kjører
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community

# Test connection
mongosh
```

### CORS Error

**Problem:** Frontend får CORS error

**Løsning:**
Legg til frontend URL i `server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend.com'],
  credentials: true
}));
```

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3001`

**Løsning:**
```bash
# Mac/Linux
lsof -ti:3001 | xargs kill

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## 📚 Dependencies

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "mongoose": "^8.0.3",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "googleapis": "^130.0.0",
  "axios": "^1.6.2"
}
```

---

## 🔒 Sikkerhet

### Development
- ✅ Enkel passord-sjekk OK
- ✅ Hardkodet secrets OK

### Production
- ⚠️ Bruk bcrypt for passord
- ⚠️ Environment variables for secrets
- ⚠️ HTTPS only
- ⚠️ Rate limiting
- ⚠️ Input validation
- ⚠️ Helmet.js for security headers

---

## 📖 Videre Lesning

- [LIVE_DATA_SETUP.md](../LIVE_DATA_SETUP.md) - Komplett setup guide
- [QUICK_START_LIVE_DATA.md](../QUICK_START_LIVE_DATA.md) - Quick start (10 min)

---

**Backend er klar! 🚀**
