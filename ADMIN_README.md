# 🎨 TichTachTech Admin Dashboard

En moderne, interaktiv admin-løsning for å administrere prosjekter og se statistikk for TichTachTech.

![Admin Dashboard](https://img.shields.io/badge/Status-Ready-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

## ✨ Features

### 🔐 Autentisering
- Sikker innlogging med passord
- Token-basert session
- Auto-login med lagret session
- Logout-funksjon

### 📊 Dashboard
- **Statistikk-kort** med total trafikk, inntekt og gjennomsnitt
- **Interaktive grafer**:
  - Trafikk-oversikt (linje-diagram)
  - Inntekts-oversikt (bar-diagram)
  - Prosjekt-distribusjon (pie-chart)
- **Animerte** overganger og hover-effekter

### 🎯 Prosjektstyring
- ➕ **Legg til** nye prosjekter
- ✏️ **Rediger** eksisterende prosjekter
- 🗑️ **Slett** prosjekter med bekreftelse
- ⭐ **Featured-merking** for viktige prosjekter
- 🏷️ **Tags** for kategorisering
- 📊 **Trafikk og inntekt** per prosjekt

### 🎨 Design
- 🌈 Cyan, Purple, Pink gradients
- 🌙 Mørkt tema med glassmorphism
- ✨ Smooth animasjoner (Framer Motion)
- 📱 Fullt responsivt design
- 🎭 Hover-effekter og transitions

### 🔄 Live Syncing
- Prosjekter vises automatisk på forsiden
- LocalStorage for datalagring
- Sanntidsoppdatering

---

## 🚀 Kom i gang

### 1. Installer pakker

```bash
npm install recharts react-router-dom
```

### 2. Kjør prosjektet

```bash
npm run dev
```

### 3. Gå til admin

Åpne nettleseren og naviger til:
```
http://localhost:5173/admin
```

### 4. Logg inn

Standard passord:
```
tichtach2024
```

---

## 📁 Filstruktur

```
src/
├── pages/
│   ├── AdminLogin.jsx          # Login-side
│   ├── AdminDashboard.jsx      # Hoved-dashboard
│   └── Projects.jsx            # Oppdatert til å bruke ProjectContext
├── context/
│   ├── ProjectContext.jsx      # State management for prosjekter
│   └── LanguageContext.jsx     # Eksisterende språk-context
└── main.jsx                     # Routing setup
```

---

## 🎯 Hvordan bruke

### Legge til nytt prosjekt

1. Gå til **Prosjekter**-fanen
2. Klikk **Legg til Prosjekt**
3. Fyll inn:
   - Tittel *
   - Beskrivelse *
   - Bilde URL (valgfritt)
   - Tags (komma-separert)
   - Trafikk
   - Inntekt
   - Featured (avkrysningsboks)
4. Klikk **Lagre**

### Redigere prosjekt

1. Finn prosjektet du vil redigere
2. Klikk **Rediger**-knappen
3. Gjør endringer
4. Klikk **Lagre**

### Slette prosjekt

1. Finn prosjektet du vil slette
2. Klikk **🗑️**-ikonet
3. Bekreft sletting

---

## 🔧 Teknisk Oversikt

### State Management

Prosjekter håndteres via **ProjectContext** som:
- Lagrer data i `localStorage`
- Synkroniserer automatisk
- Eksponerer funksjoner for CRUD-operasjoner

### Routing

```
/          - Hovedside (forsiden)
/admin     - Admin dashboard (krever autentisering)
```

### Data Flow

```
Admin Dashboard
      ↓
ProjectContext (localStorage)
      ↓
Projects.jsx (Forsiden)
```

---

## 🎨 Fargepalett

```css
/* Primary */
Cyan:   #06b6d4
Purple: #a855f7
Pink:   #ec4899

/* Background */
Slate 900: #0f172a
Slate 800: #1e293b
Slate 700: #334155

/* Text */
White:     #ffffff
Slate 300: #cbd5e1
Slate 400: #94a3b8
```

---

## 🔐 Sikkerhet

### Nåværende Setup (Development)

- ⚠️ **Enkel passord-sjekk** (OK for development)
- ⚠️ **LocalStorage token** (OK for development)
- ⚠️ **Ingen kryptering** (OK for development)

### For Produksjon (TODO)

- [ ] Implementer bcrypt for passord-hashing
- [ ] Bruk JWT med server-side validering
- [ ] Legg til rate limiting
- [ ] Implementer 2FA (Two-Factor Authentication)
- [ ] Bruk HTTPS
- [ ] Legg til CSRF-protection
- [ ] Backend API for datalagring

---

## 📊 API Struktur (for fremtidig backend)

### Endpoints

```javascript
// Auth
POST   /api/auth/login       // Login
POST   /api/auth/logout      // Logout

// Projects
GET    /api/projects         // Hent alle
GET    /api/projects/:id     // Hent en
POST   /api/projects         // Opprett
PUT    /api/projects/:id     // Oppdater
DELETE /api/projects/:id     // Slett

// Analytics
GET    /api/analytics        // Hent statistikk
```

### Project Model

```javascript
{
  id: number,
  title: string,
  description: string,
  image: string,
  tags: string[],
  traffic: number,
  revenue: number,
  status: 'active' | 'archived',
  featured: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎓 Utvidelsesmuligheter

### Enkel (1-2 timer)
- [ ] Søk og filtrering av prosjekter
- [ ] Sortering (trafikk, inntekt, dato)
- [ ] Arkivering av prosjekter

### Medium (3-5 timer)
- [ ] Bildeupload (Cloudinary/AWS S3)
- [ ] Bulk-operasjoner
- [ ] Eksport til CSV/PDF
- [ ] Flere statistikk-views

### Avansert (1+ dag)
- [ ] Backend API (Express/Node.js)
- [ ] Database (MongoDB/PostgreSQL)
- [ ] Flere brukerroller
- [ ] Email-notifikasjoner
- [ ] Activity log

---

## 🐛 Feilsøking

### Problem: Grafer vises ikke

**Løsning**: Sjekk at recharts er installert
```bash
npm list recharts
# Hvis ikke installert:
npm install recharts
```

### Problem: Routing fungerer ikke

**Løsning**: Sjekk at react-router-dom er installert
```bash
npm list react-router-dom
# Hvis ikke installert:
npm install react-router-dom
```

### Problem: Data forsvinner ved refresh

**Svar**: Dette er forventet! Data lagres i localStorage.
Hvis du vil ha persistent data, implementer backend.

### Problem: Kan ikke logge inn

**Løsning**: 
1. Sjekk at passordet er `tichtach2024`
2. Sjekk console for feil
3. Prøv å clear localStorage:
```javascript
localStorage.clear()
```

---

## 📱 Responsivt Design

Dashboard er optimalisert for:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

---

## ⚡ Performance Tips

### LocalStorage
- Automatisk syncing ved endringer
- Ingen eksterne API-kall nødvendig
- Rask lasteti tid

### Optimering
- Lazy loading av grafer
- Memoized components
- Optimistisk UI-oppdateringer

---

## 🎁 Bonus Features

### Easter Eggs
- Drag & drop prosjekter på forsiden
- Animerte bakgrunns-sirkler
- Smooth page transitions

### Keyboard Shortcuts (TODO)
- `Cmd/Ctrl + K` - Søk
- `Cmd/Ctrl + N` - Nytt prosjekt
- `Esc` - Lukk modal

---

## 🤝 Contributing

Vil du legge til features? Her er hvordan:

1. Lag en ny branch
```bash
git checkout -b feature/my-feature
```

2. Gjør endringer og commit
```bash
git commit -m "Add: My awesome feature"
```

3. Push og lag pull request
```bash
git push origin feature/my-feature
```

---

## 📝 Changelog

### v1.0.0 (2024-11-14)
- ✅ Initial release
- ✅ Login-funksjonalitet
- ✅ Dashboard med statistikk
- ✅ Prosjektstyring (CRUD)
- ✅ Interaktive grafer
- ✅ LocalStorage integration
- ✅ Responsivt design

---

## 📞 Support

Har du spørsmål eller problemer?

1. Sjekk **Feilsøking**-seksjonen
2. Se på koden i `src/pages/AdminDashboard.jsx`
3. Spør meg! 😊

---

## 🎉 Du er klar!

Admin-dashboardet er nå satt opp og klart til bruk!

**Neste steg:**
1. Installer pakker: `npm install recharts react-router-dom`
2. Kjør prosjektet: `npm run dev`
3. Gå til: `http://localhost:5173/admin`
4. Logg inn med: `tichtach2024`
5. Start å administrere prosjekter! 🚀

---

**Laget med 💙 for TichTachTech**
