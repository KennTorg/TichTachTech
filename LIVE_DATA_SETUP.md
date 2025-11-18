# 📊 Live Data Setup Guide - TichTachTech Admin

Komplett guide for å koble AI Description Generator (og andre prosjekter) til TichTachTech Admin med **ekte trafikk og inntektsdata**.

---

## 🎯 Oversikt

```
AI Description Generator
        ↓ (tracking script)
Backend API (Express + MongoDB)
        ↓ (REST API)
Admin Dashboard (React)
```

---

## 🚀 Steg 1: Sett opp Backend

### 1.1 Installer dependencies

```bash
cd backend
npm install
```

### 1.2 Opprett .env fil

```bash
cp .env.example .env
```

Rediger `.env`:

```env
PORT=3001
NODE_ENV=development

# MongoDB (velg EN av disse)
# Lokalt:
MONGODB_URI=mongodb://localhost:27017/tichtachtech

# ELLER MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tichtachtech

# JWT Secret (generer en ny!)
JWT_SECRET=kjør-denne-kommandoen-under

# Admin passord (optional - kan også bruke hardkodet)
ADMIN_PASSWORD_HASH=$2b$10$...

# API Key for prosjektene dine
AI_DESCRIPTION_API_KEY=generer-en-random-key
```

**Generer JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Generer API Key:**
```bash
node -e "console.log('ttt_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now())"
```

### 1.3 Installer MongoDB

**Velg EN av disse:**

**Alternativ A: MongoDB Lokalt**
```bash
# Mac:
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows:
# Last ned MongoDB Community Edition fra mongodb.com
```

**Alternativ B: MongoDB Atlas (Cloud - Gratis)**
1. Gå til [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Opprett gratis konto
3. Lag nytt cluster (velg FREE tier)
4. Få connection string
5. Lim inn i `.env` under `MONGODB_URI`

### 1.4 Start backend

```bash
npm run dev
```

Du skal se:
```
✅ MongoDB Connected
🚀 TichTachTech Backend Server
📍 Port: 3001
```

Test at det fungerer:
```bash
curl http://localhost:3001/health
```

---

## 🎨 Steg 2: Opprett Prosjekt i Admin

### 2.1 Gå til Admin Dashboard

```
http://localhost:5173/admin
```

### 2.2 Logg inn

Passord: `tichtach2024`

### 2.3 Opprett "AI Description Generator"

1. Klikk **"Legg til Prosjekt"**
2. Fyll inn:
   ```
   Tittel: AI Product Description Generator
   Beskrivelse: Generer profesjonelle produktbeskrivelser med AI
   URL: https://din-app-url.com (eller localhost for testing)
   Tags: AI, OpenAI, Product Description, React
   Featured: ✓ (hvis du vil)
   ```
3. Klikk **"Lagre"**

### 2.4 Noter deg API nøklene

Når prosjektet er opprettet får du:
- **Project ID** (se i URL eller kopier fra databasen)
- **API Key** (generert automatisk)

---

## 🔌 Steg 3: Legg til Tracking i AI Description Generator

### 3.1 Kopier tracking-scriptet

Kopier `backend/tichtachtech-tracker.js` til ditt AI Description Generator prosjekt.

### 3.2 Installer tracker

**I din `ai-product-description` prosjekt:**

```bash
cd C:\Users\kenne\Documents\GitHub\ai-product-description\frontend
```

Opprett fil: `src/utils/analytics.js`

```javascript
import TichTachTechTracker from './tichtachtech-tracker';

const tracker = new TichTachTechTracker({
  apiUrl: 'http://localhost:3001/api', // Production: https://api.tichtachtech.com/api
  apiKey: 'DIN_API_KEY_HER', // Fra .env backend
  projectId: 'DIN_PROJECT_ID_HER', // Fra MongoDB
  autoTrack: true, // Auto-track page views
});

export default tracker;
```

### 3.3 Track events i din app

**Eksempel - Track når bruker genererer beskrivelse:**

```javascript
import tracker from './utils/analytics';

// I din generate-funksjon:
const handleGenerate = async () => {
  // ... din generate-logikk
  
  // Track event
  tracker.trackEvent('description_generated', {
    productType: selectedProduct,
    wordCount: description.length,
  });
};
```

**Track betalinger (hvis du har Stripe):**

```javascript
// Etter vellykket betaling:
tracker.trackConversion({
  type: 'payment',
  value: 9.99, // Beløp
  currency: 'USD',
});
```

### 3.4 Environment variables

Opprett `.env` i frontend:

```env
VITE_API_URL=http://localhost:3001/api
VITE_ANALYTICS_PROJECT_ID=din-project-id
VITE_ANALYTICS_API_KEY=din-api-key
```

Oppdater analytics.js:

```javascript
const tracker = new TichTachTechTracker({
  apiUrl: import.meta.env.VITE_API_URL,
  apiKey: import.meta.env.VITE_ANALYTICS_API_KEY,
  projectId: import.meta.env.VITE_ANALYTICS_PROJECT_ID,
  autoTrack: true,
});
```

---

## 📈 Steg 4: Se Live Data i Admin

### 4.1 Test tracking

1. Åpne AI Description Generator: `http://localhost:XXXX`
2. Bruk appen (generer beskrivelser, etc.)
3. Gå til Admin Dashboard: `http://localhost:5173/admin`
4. Se Dashboard-fanen → Tallene oppdateres! 🎉

### 4.2 Verifiser i backend

Sjekk backend-loggen for innkommende requests:

```bash
POST /api/webhooks/analytics 200
```

### 4.3 Sjekk database

```bash
# Hvis du bruker MongoDB lokalt:
mongosh
use tichtachtech
db.projects.find().pretty()
db.analyticshistories.find().pretty()
```

---

## 💰 Steg 5: Koble til Stripe (for inntektsdata)

### 5.1 Installer Stripe i AI Description Generator

```bash
npm install @stripe/stripe-js
```

### 5.2 Legg til webhook

I din Stripe-success handler:

```javascript
import tracker from './utils/analytics';

// Etter vellykket Stripe checkout:
const handleStripeSuccess = (session) => {
  tracker.trackConversion({
    type: 'payment',
    value: session.amount_total / 100, // Stripe bruker cents
    currency: session.currency,
  });
};
```

### 5.3 Alternativ: Stripe Webhooks (produksjon)

Sett opp Stripe webhook som sender til:
```
POST https://api.tichtachtech.com/api/webhooks/payment
```

---

## 📊 Steg 6: Google Analytics Integration (valgfritt)

For å hente historisk data fra Google Analytics:

### 6.1 Opprett Service Account

1. Gå til [Google Cloud Console](https://console.cloud.google.com)
2. Opprett nytt prosjekt
3. Enable Google Analytics API
4. Opprett Service Account
5. Last ned JSON key-fil

### 6.2 Legg til i .env

```env
GOOGLE_ANALYTICS_PROPERTY_ID=123456789
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 6.3 Importer historisk data

```bash
# Kjør import-script (lages ved behov)
node scripts/import-ga-data.js
```

---

## 🎯 Testing Checklist

- [ ] Backend kjører (`http://localhost:3001/health`)
- [ ] MongoDB connected (sjekk backend logs)
- [ ] Prosjekt opprettet i admin
- [ ] API key og Project ID hentet
- [ ] Tracker installert i AI app
- [ ] Tracker konfigurert med riktige keys
- [ ] Test pageview (åpne AI app)
- [ ] Test event (generer beskrivelse)
- [ ] Test conversion (kjøp noe)
- [ ] Se data i admin dashboard

---

## 🐛 Troubleshooting

### Backend starter ikke

**Problem:** `MongoDB connection error`

**Løsning:**
```bash
# Sjekk at MongoDB kjører:
brew services list | grep mongodb

# Eller start det:
brew services start mongodb-community
```

### Tracking fungerer ikke

**Problem:** Ingen data kommer inn

**Løsning:**
1. Sjekk at API key er riktig
2. Sjekk at Project ID er riktig
3. Åpne DevTools Console i AI app - se etter feil
4. Sjekk backend logs
5. Verifiser CORS settings i backend

### CORS Error

**Problem:** `Access-Control-Allow-Origin` error

**Løsning:**
Oppdater `backend/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Legg til alle dine frontend URLs
  credentials: true
}));
```

---

## 🚀 Production Deploy

### Backend (Heroku/Railway)

```bash
# Push backend til Heroku
cd backend
heroku create tichtachtech-api
heroku config:set MONGODB_URI=din-atlas-url
heroku config:set JWT_SECRET=din-secret
git push heroku main
```

### Frontend environment

```env
VITE_API_URL=https://tichtachtech-api.herokuapp.com/api
```

---

## 📝 Eksempel: Komplett AI App Integration

Her er et komplett eksempel på hvordan du integrerer tracking i AI Description Generator:

```javascript
// src/App.jsx
import React, { useEffect } from 'react';
import tracker from './utils/analytics';

function App() {
  useEffect(() => {
    // Auto-track page view ved first load
    tracker.trackPageView();
  }, []);

  const handleGenerateDescription = async (productInfo) => {
    try {
      // Generate description logic...
      const description = await generateWithAI(productInfo);
      
      // Track successful generation
      tracker.trackEvent('description_generated', {
        productType: productInfo.type,
        wordCount: description.length,
        timestamp: new Date().toISOString(),
      });
      
      return description;
    } catch (error) {
      // Track errors too
      tracker.trackEvent('generation_error', {
        error: error.message,
      });
      throw error;
    }
  };

  const handlePurchase = async (amount) => {
    // After successful Stripe payment
    tracker.trackConversion({
      type: 'payment',
      value: amount,
      currency: 'USD',
    });
  };

  return <div>{/* Your app */}</div>;
}
```

---

## 🎉 Du er klar!

Nå har du:
- ✅ Backend som samler data
- ✅ Tracking installert i prosjektet
- ✅ Live data i admin dashboard
- ✅ Inntekts-tracking
- ✅ Analytics historie

**Se data live i admin:**
```
http://localhost:5173/admin
```

---

## 📚 Videre Lesning

- `backend/server.js` - Backend API endpoints
- `backend/tichtachtech-tracker.js` - Tracking client
- `src/services/api.js` - Frontend API service
- MongoDB Documentation: https://docs.mongodb.com
- Stripe Webhooks: https://stripe.com/docs/webhooks

---

**Lykke til med live data! 🚀**
