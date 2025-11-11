import React, { useState } from 'react';
import Hero from './pages/Hero';
import Services from './pages/Services';
import Projects from './pages/Projects';
import LabFeed from './pages/LabFeed';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import PhysicsButtons from './components/PhysicsButtons';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [smileyExpression, setSmileyExpression] = useState(null);
  const [speechBubbleType, setSpeechBubbleType] = useState(null); // 'contact', 'services', eller null
  const { language, toggleLanguage } = useLanguage();

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    
    // Make smiley surprised!
    setSmileyExpression('surprised');
    setTimeout(() => {
      setSmileyExpression(null);
    }, 2000);
  };

  return (
    <div 
      className="min-h-screen overflow-hidden transition-colors duration-700"
      style={{
        backgroundColor: darkMode ? '#000000' : '#fcfcfb',
        color: darkMode ? '#ffffff' : '#0e0e0f',
      }}
    >
      {/* Main content */}
      <Hero 
        darkMode={darkMode} 
        smileyExpression={smileyExpression} 
        language={language}
        speechBubbleType={speechBubbleType}
        setSpeechBubbleType={setSpeechBubbleType}
      />
      <Services 
        darkMode={darkMode} 
        language={language}
        onHoverChange={(isHovering) => {
          // Ikke endre hvis vi feirer
          if (speechBubbleType !== 'servicesWin') {
            setSpeechBubbleType(isHovering ? 'services' : null);
          }
        }}
        onGameWon={(won) => setSpeechBubbleType(won ? 'servicesWin' : null)}
      />
      <Projects 
        darkMode={darkMode} 
        language={language}
        onHoverChange={(isHovering) => {
          // Ikke endre hvis vi feirer eller har annen aktiv snakkeboble
          if (speechBubbleType !== 'servicesWin' && speechBubbleType !== 'services') {
            setSpeechBubbleType(isHovering ? 'projects' : null);
          }
        }}
      />
      <LabFeed darkMode={darkMode} language={language} />
      <Contact 
        darkMode={darkMode} 
        language={language}
        onBankBankClick={() => setSpeechBubbleType('contact')}
      />
      <Footer darkMode={darkMode} language={language} />

      {/* Physics Buttons with collision detection */}
      <PhysicsButtons 
        darkMode={darkMode}
        onDarkModeClick={handleDarkModeToggle}
        language={language}
        onLanguageClick={toggleLanguage}
      />

      {/* Floor line */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none transition-opacity duration-700 z-0"
        style={{
          background: darkMode
            ? 'linear-gradient(to top, rgba(255, 255, 255, 0.05), transparent)'
            : 'linear-gradient(to top, rgba(0, 0, 0, 0.05), transparent)',
        }}
      />
      <div 
        className="fixed bottom-0 left-0 right-0 h-px pointer-events-none transition-colors duration-700 z-0"
        style={{
          backgroundColor: darkMode ? '#333333' : '#e5e5e5',
        }}
      />
    </div>
  );
}
