# 🚀 HURTIGSTART - TICHTACHTECH

## Steg 1: Installer dependencies
```bash
npm install
```

## Steg 2: Start dev server
```bash
npm run dev
```

Nettsiden åpner automatisk i nettleseren på `http://localhost:3000` 🎉

## 🎮 Test alle interaksjoner!

### Smiley Logo (i Hero-seksjonen)
- Hover over logoen → Øynene følger musen!
- Klikk 5 ganger → Love mode med hjerter! ❤️
- Dobbeltklikk → Hopp animasjon!
- Hold inne museknappen → Spin animasjon!

### Physics Button (Dark Mode Toggle)
- Dra knappen rundt på skjermen
- Slipp den → Den faller med tyngdekraft og spretter!
- Klikk → Bytter mellom light/dark mode

### Prosjektkort
- Dra prosjektkortene rundt!
- De snapper tilbake når du slipper

## 📂 Fil-oversikt

```
tichtachtech/
├── src/
│   ├── components/
│   │   ├── SmileyLogo.jsx      ← Interaktiv smiley (hjertet av siden!)
│   │   ├── PhysicsButton.jsx   ← Dark mode med tyngdekraft
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Hero.jsx            ← Landing med stor logo
│   │   ├── Services.jsx        ← Tjenester (AI, Web, SaaS, Automation)
│   │   ├── Projects.jsx        ← Draggable prosjektkort
│   │   ├── LabFeed.jsx         ← Eksperiment-feed
│   │   └── Contact.jsx         ← Kontakt-seksjon
│   ├── App.jsx                 ← Hovedapp (dark mode state)
│   └── main.jsx                ← Entry point
```

## 🎨 Hva kan du tweake?

### Farger (tailwind.config.js)
```js
colors: {
  'ttt-bg': '#fcfcfb',      // Bakgrunnsfarge
  'ttt-text': '#0e0e0f',    // Tekstfarge
}
```

### Animasjonshastighet
- Åpne `SmileyLogo.jsx` og juster `duration` i Framer Motion
- Åpne `PhysicsButton.jsx` og juster `gravity`, `bounce`, `friction`

### Innhold
- `Hero.jsx` - Endre tekst og tagline
- `Services.jsx` - Legg til/endre tjenester
- `Projects.jsx` - Legg til dine egne prosjekter
- `LabFeed.jsx` - Oppdater lab-meldinger

## 🚀 Deploy når du er klar!

### Vercel (Anbefalt - tar 2 min!)
1. Gå til [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Vercel setter opp alt automatisk ✨

### Netlify
```bash
npm run build
# Dra 'dist' mappen til Netlify
```

## 💡 Tips

- Scroll sakte for å se alle animasjonene
- Bruk dark mode i kveldstimene (øynene dine takker deg)
- Test på mobil - alt fungerer responsivt!

---

**Lykke til med byggingen! 🎉**

Spørsmål? hello@tichtach.tech
