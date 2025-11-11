export const translations = {
  en: {
    hero: {
      tagline1: "Experimental digital studio",
      tagline2: "Building weirdly wonderful web stuff",
      scroll: "Scroll"
    },
    services: {
      title: "What we build",
      subtitle: "Serious engineering in a playful wrapper",
      speechBubble: "Shoot the boxes!",
      winSpeechBubble: "YAY! 🎉",
      winMessage: "🎉 You won!",
      aiSolutions: {
        title: "AI Solutions",
        desc: "RAG, agents and eval. Useful AI that finishes tasks."
      },
      webMobile: {
        title: "Web & Mobile",
        desc: "Next.js for web. Expo RN for mobile. Design systems that scale."
      },
      saas: {
        title: "SaaS Platforms",
        desc: "Subscriptions, billing, dashboards. Calm products that print value."
      },
      automation: {
        title: "Automation",
        desc: "CRMs, ERPs, webhooks. Less manual, more flow."
      }
    },
    projects: {
      title: "Experiments",
      subtitle: "Drag them. Poke them. They behave. Sometimes.",
      speechBubble: "Throw them around!",
      viewProject: "View project",
      items: {
        freelanceFlow: {
          title: "Freelance Flow",
          subtitle: "Finance app for chaotic creatives"
        },
        auroraCanvas: {
          title: "Aurora Canvas",
          subtitle: "Nordlys shaders in WebGL"
        },
        diaperRadar: {
          title: "DiaperRadar",
          subtitle: "RN + Supabase crowd map"
        }
      }
    },
    lab: {
      title: "Lab Feed",
      subtitle: "Random experiments from the studio",
      logs: [
        { time: "00:01", message: "AI generates invoices that roast your clients" },
        { time: "00:07", message: "Nordlys background experiment (WebGL + three.js)" },
        { time: "00:13", message: "React + Supabase + too much coffee" },
        { time: "00:21", message: "Added smile detection to the logo (bad idea)" }
      ]
    },
    contact: {
      button: "Knock Knock",
      revealButton: "Let's talk",
      subtitle: "Who's there?",
      speechBubble: "We'll probably answer. Eventually.",
      modal: {
        title: "Get in touch",
        subtitle: "Tell us about your project",
        name: "Name",
        email: "Email",
        message: "Message",
        messagePlaceholder: "Tell us what you're working on...",
        send: "Send message",
        sending: "Sending...",
        successTitle: "Message sent!",
        successMessage: "We'll get back to you soon."
      }
    },
    footer: "Building weirdly wonderful web stuff"
  },
  no: {
    hero: {
      tagline1: "Eksperimentelt digitalt studio",
      tagline2: "Vi bygger rart, vidunderlig web-greier",
      scroll: "Scroll"
    },
    services: {
      title: "Hva vi bygger",
      subtitle: "Seriøs engineering i en leken innpakning",
      speechBubble: "Skyt boksene!",
      winSpeechBubble: "YAY! 🎉",
      winMessage: "🎉 Du vant!",
      aiSolutions: {
        title: "AI-løsninger",
        desc: "RAG, agenter og evaluering. Nyttig AI som faktisk gjør jobben."
      },
      webMobile: {
        title: "Web & Mobil",
        desc: "Next.js for web. Expo RN for mobil. Design-systemer som skalerer."
      },
      saas: {
        title: "SaaS-plattformer",
        desc: "Abonnementer, fakturering, dashboards. Rolige produkter som skaper verdi."
      },
      automation: {
        title: "Automatisering",
        desc: "CRM-er, ERP-er, webhooks. Mindre manuelt, mer flyt."
      }
    },
    projects: {
      title: "Eksperimenter",
      subtitle: "Dra dem. Dult dem. De oppfører seg. Noen ganger.",
      speechBubble: "Kast dem rundt!",
      viewProject: "Se prosjekt",
      items: {
        freelanceFlow: {
          title: "Freelance Flow",
          subtitle: "Finans-app for kaotiske kreative"
        },
        auroraCanvas: {
          title: "Aurora Canvas",
          subtitle: "Nordlys-shadere i WebGL"
        },
        diaperRadar: {
          title: "DiaperRadar",
          subtitle: "RN + Supabase crowd map"
        }
      }
    },
    lab: {
      title: "Lab Feed",
      subtitle: "Tilfeldige eksperimenter fra studioet",
      logs: [
        { time: "00:01", message: "AI genererer fakturaer som roaster kundene dine" },
        { time: "00:07", message: "Nordlys-bakgrunnseksperiment (WebGL + three.js)" },
        { time: "00:13", message: "React + Supabase + for mye kaffe" },
        { time: "00:21", message: "La til smil-deteksjon i logoen (dårlig idé)" }
      ]
    },
    contact: {
      button: "Bank Bank",
      revealButton: "La oss snakke",
      subtitle: "Hvem der?",
      speechBubble: "Vi svarer sikkert. Til slutt.",
      modal: {
        title: "Ta kontakt",
        subtitle: "Fortell oss om prosjektet ditt",
        name: "Navn",
        email: "E-post",
        message: "Melding",
        messagePlaceholder: "Fortell oss hva du jobber med...",
        send: "Send melding",
        sending: "Sender...",
        successTitle: "Melding sendt!",
        successMessage: "Vi svarer deg snart."
      }
    },
    footer: "Vi bygger rart, vidunderlig web-greier"
  }
};

export const t = (language, key) => {
  const keys = key.split('.');
  let value = translations[language];
  
  for (const k of keys) {
    value = value[k];
    if (!value) return key;
  }
  
  return value;
};
