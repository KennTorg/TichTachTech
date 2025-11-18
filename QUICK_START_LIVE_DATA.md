# 🚀 Quick Start - Live Data (10 minutter)

Den raskeste måten å få live data fra AI Description Generator til TichTachTech Admin!

---

## ⚡ Steg 1: Start Backend (2 min)

```bash
cd C:\Users\kenne\Documents\GitHub\TichTachTech\backend

# Installer pakker
npm install

# Opprett .env
echo PORT=3001 > .env
echo MONGODB_URI=mongodb://localhost:27017/tichtachtech >> .env
echo JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") >> .env
echo AI_DESCRIPTION_API_KEY=ttt_test_key_123 >> .env

# Start backend
npm run dev
```

✅ Backend kjører nå på `http://localhost:3001`

---

## 🗄️ Steg 2: Installer MongoDB (5 min)

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
1. Last ned MongoDB Community fra [mongodb.com](https://www.mongodb.com/try/download/community)
2. Installer
3. Start MongoDB Compass (GUI) eller `mongod` i terminal

**ELLER bruk MongoDB Atlas (cloud, gratis):**
1. Gå til [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up gratis
3. Lag cluster
4. Få connection string
5. Oppdater `MONGODB_URI` i `.env`

---

## 🎯 Steg 3: Opprett Prosjekt i Admin (1 min)

1. Gå til `http://localhost:5173/admin`
2. Logg inn: `tichtach2024`
3. Legg til prosjekt:
   - Tittel: **AI Description Generator**
   - Beskrivelse: **AI-powered product descriptions**
   - Tags: **AI, OpenAI, React**
4. Lagre

**Noter Project ID fra URL** (eller sjekk MongoDB)

---

## 🔌 Steg 4: Legg til Tracking (2 min)

### I din AI Description Generator:

**Opprett `src/utils/tichtachtech-tracker.js`:**

Kopier innholdet fra:
```
C:\Users\kenne\Documents\GitHub\TichTachTech\backend\tichtachtech-tracker.js
```

**Opprett `src/utils/analytics.js`:**

```javascript
import TichTachTechTracker from './tichtachtech-tracker';

const tracker = new TichTachTechTracker({
  apiUrl: 'http://localhost:3001/api',
  apiKey: 'ttt_test_key_123', // Fra .env backend
  projectId: 'DIN_PROJECT_ID_HER', // Fra admin/MongoDB
  autoTrack: true,
});

export default tracker;
```

**I `src/App.jsx`:**

```javascript
import tracker from './utils/analytics';

// Track event når bruker genererer beskrivelse
const handleGenerate = () => {
  // ... din kode
  
  tracker.trackEvent('description_generated', {
    productType: 'electronics',
  });
};
```

---

## ✅ Test det (30 sekunder)

1. Åpne AI app: `http://localhost:XXXX`
2. Generer en beskrivelse
3. Gå til admin: `http://localhost:5173/admin`
4. **Se at trafikken øker!** 🎉

---

## 💰 Bonus: Track Betalinger

```javascript
// Etter Stripe payment success:
tracker.trackConversion({
  type: 'payment',
  value: 9.99,
  currency: 'USD',
});
```

---

## 🐛 Hvis noe ikke fungerer:

### Backend ikke tilgjengelig?
```bash
curl http://localhost:3001/health
# Skal returnere: {"status":"ok"}
```

### MongoDB ikke connected?
```bash
# Sjekk at MongoDB kjører
brew services list | grep mongodb
# Eller på Windows: check Services
```

### Tracking sender ikke data?
1. Åpn DevTools Console i AI app
2. Se etter feil
3. Sjekk at API key matcher i `.env` og `analytics.js`
4. Sjekk at Project ID er riktig

---

## 🎉 Ferdig!

Du har nå:
- ✅ Backend som mottar data
- ✅ MongoDB som lagrer data
- ✅ Tracking installert i AI app
- ✅ Live data i admin dashboard

**Se mer:** `LIVE_DATA_SETUP.md` for fullstendig guide

---

**Tips:** For produksjon, deploy backend til Heroku/Railway og bruk MongoDB Atlas!
