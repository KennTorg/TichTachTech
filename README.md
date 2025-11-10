# 🎨 TichTachTech

Eksperimentell digital studio hjemmeside med kreative animasjoner og interaktive elementer.

## 🚀 Features

- **Interaktiv Smiley Logo** - Klikk, hold, dobbeltklikk for forskjellige animasjoner
- **Physics-basert Dark Mode Toggle** - Dra og slipp knappen med ekte tyngdekraft!
- **Smooth Scroll Animations** - Framer Motion for silkemyke overganger
- **Draggable Project Cards** - Dra prosjektkortene rundt
- **Responsive Design** - Fungerer perfekt på alle skjermstørrelser
- **Dark Mode** - Full dark mode support

## 🛠️ Tech Stack

- **React 18** - UI bibliotek
- **Vite** - Lightning fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animasjonsbibliotek
- **Lucide React** - Moderne ikoner

## 📦 Installasjon

```bash
# Installer dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Prosjektstruktur

```
tichtachtech/
├── src/
│   ├── components/          # Gjenbrukbare komponenter
│   │   ├── SmileyLogo.jsx  # Interaktiv smiley logo
│   │   ├── PhysicsButton.jsx # Dark mode toggle med physics
│   │   └── Footer.jsx
│   ├── pages/              # Hovedsider/seksjoner
│   │   ├── Hero.jsx
│   │   ├── Services.jsx
│   │   ├── Projects.jsx
│   │   ├── LabFeed.jsx
│   │   └── Contact.jsx
│   ├── styles/
│   │   └── index.css       # Global styles + Tailwind
│   ├── utils/              # Utility funksjoner (fremtidig bruk)
│   ├── App.jsx             # Hovedapp med dark mode state
│   └── main.jsx            # Entry point
├── public/                 # Statiske filer
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎯 Fremtidige Features

- [ ] Admin dashboard for prosjekthåndtering
- [ ] Analytics integrasjon
- [ ] CMS for enkel innholdsoppdatering
- [ ] Blog/Lab notes seksjon
- [ ] Prosjektdetalj-sider
- [ ] Kontaktskjema med Supabase backend
- [ ] SEO optimalisering
- [ ] PWA support

## 🎨 Interaksjoner

### Smiley Logo
- **Hover** - Logoen blir excited og øynene følger musen
- **Klikk** - Shake animasjon (5 klikk = love mode med hjerter!)
- **Dobbeltklikk** - Hopp animasjon
- **Hold** - Spin animasjon

### Physics Button
- **Dra** - Dra knappen rundt på skjermen
- **Slipp** - Knappen faller med tyngdekraft og spretter
- **Klikk** - Toggle dark mode

## 🚀 Deployment

### Vercel (Anbefalt)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag and drop 'dist' folder til Netlify
```

## 📝 Notater

- Prosjektet er satt opp med god struktur for fremtidig skalerbarhet
- All state management er gjort med React hooks
- Animasjoner er performance-optimalisert
- Dark mode state er global og kontrollert fra App.jsx

## 🤝 Kontakt

**Email:** hello@tichtach.tech

---

*Bygget med ❤️ og for mye kaffe*
