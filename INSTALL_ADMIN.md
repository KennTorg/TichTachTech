# 🚀 TichTachTech Admin - Installasjonsinstruksjoner

## Steg 1: Installer pakker

Åpne terminalen i TichTachTech-mappen og kjør:

```bash
npm install recharts react-router-dom
```

Dette installerer:
- **recharts** (v2.10+) - For grafer og statistikk
- **react-router-dom** (v6.20+) - For routing til /admin

## Steg 2: Start utviklingsserver

```bash
npm run dev
```

Serveren starter på: `http://localhost:5173`

## Steg 3: Gå til Admin

Åpne nettleseren og gå til:
```
http://localhost:5173/admin
```

## Steg 4: Logg inn

Bruk standard passord:
```
tichtach2024
```

## 🎉 Ferdig!

Du har nå tilgang til admin-dashboardet!

---

## 📖 Hva er installert?

### Nye filer opprettet:

1. **src/context/ProjectContext.jsx**
   - State management for prosjekter
   - LocalStorage-integrasjon
   - CRUD-operasjoner

2. **src/pages/AdminLogin.jsx**
   - Login-side for admin
   - Passord-autentisering
   - Animert design

3. **src/pages/AdminDashboard.jsx**
   - Hoved-dashboard
   - Statistikk og grafer
   - Prosjektstyring

4. **src/main.jsx** (oppdatert)
   - Lagt til routing
   - ProjectProvider wrapper
   - Admin route guard

5. **src/pages/Projects.jsx** (oppdatert)
   - Integrert med ProjectContext
   - Viser prosjekter fra admin
   - Beholdt eksisterende design

---

## 🔍 Verifiser installasjonen

### Sjekk at pakkene er installert:

```bash
npm list recharts react-router-dom
```

Du skal se noe som:
```
├── recharts@2.10.3
└── react-router-dom@6.20.1
```

### Test routing:

1. Gå til forsiden: `http://localhost:5173`
2. Gå til admin: `http://localhost:5173/admin`

Begge skal fungere!

---

## ⚠️ Troubleshooting

### Problem: "Module not found: recharts"

**Løsning:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Cannot find module 'react-router-dom'"

**Løsning:**
```bash
npm install react-router-dom
```

### Problem: Blank side på /admin

**Løsning:**
1. Åpne DevTools (F12)
2. Sjekk Console for feil
3. Verifiser at alle filer er lagret
4. Restart dev-serveren

### Problem: "localStorage is not defined"

**Løsning:** Dette er normalt under server-side rendering. 
Ignorer advarselen, det fungerer i nettleseren.

---

## 📚 Les mer

Se **ADMIN_README.md** for:
- Detaljert feature-dokumentasjon
- Bruksanvisning
- API-struktur
- Utvidelsesmuligheter

---

## 🎯 Quick Start Checklist

- [ ] Installer pakker: `npm install recharts react-router-dom`
- [ ] Start server: `npm run dev`
- [ ] Åpne admin: `http://localhost:5173/admin`
- [ ] Logg inn: `tichtach2024`
- [ ] Legg til første prosjekt
- [ ] Sjekk at det vises på forsiden (`/`)

---

**Lykke til! 🚀**
