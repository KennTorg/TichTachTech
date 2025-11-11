import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { t } from '../utils/translations';

export default function StickyLogo({ darkMode, logoContainerRef, speechBubbleType, setSpeechBubbleType, language = 'no' }) {
  const { scrollY } = useScroll();
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [fixedStartPos, setFixedStartPos] = useState({ x: 0, y: 0 });
  const [isMouthAnimating, setIsMouthAnimating] = useState(false);
  
  // Start munnanimasjon når snakkeboblen vises, stopp etter 1 sekund
  useEffect(() => {
    if (speechBubbleType) {
      setIsMouthAnimating(true);
      const timer = setTimeout(() => {
        setIsMouthAnimating(false);
      }, 1000); // Animer i 1 sekund
      return () => clearTimeout(timer);
    } else {
      setIsMouthAnimating(false);
    }
  }, [speechBubbleType]);
  
  // Auto-hide snakkeboblen etter 5 sekunder (kun for contact, ikke for services)
  useEffect(() => {
    if (speechBubbleType === 'contact' && setSpeechBubbleType) {
      const timer = setTimeout(() => {
        setSpeechBubbleType(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [speechBubbleType, setSpeechBubbleType]);
  
  // Hent riktig melding basert på type
  const getSpeechBubbleText = () => {
    if (speechBubbleType === 'contact') {
      return t(language, 'contact.speechBubble');
    } else if (speechBubbleType === 'services') {
      return t(language, 'services.speechBubble');
    } else if (speechBubbleType === 'servicesWin') {
      return t(language, 'services.winSpeechBubble');
    } else if (speechBubbleType === 'projects') {
      return t(language, 'projects.speechBubble');
    }
    return null;
  };
  
  useEffect(() => {
    const updateSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Beregn startposisjon basert på logo-containeren
  useEffect(() => {
    const updateFixedStartPos = () => {
      if (logoContainerRef?.current) {
        const rect = logoContainerRef.current.getBoundingClientRect();
        const logoHeight = 300;
        const smileyYInLogo = 0.5375 * logoHeight; // ca 165.55px fra toppen
        // Beregn hvor smileyen er i viewport
        const smileyX = rect.left + rect.width / 2;
        const smileyY = rect.top + smileyYInLogo;
        setFixedStartPos({ 
          x: smileyX - 65, // -65 for å sentrere smileyen (halvparten av 130px diameter)
          y: smileyY - 50 
        });
      }
    };
    
    const timeout = setTimeout(updateFixedStartPos, 100);
    updateFixedStartPos();
    window.addEventListener('resize', updateFixedStartPos);
    window.addEventListener('scroll', updateFixedStartPos);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateFixedStartPos);
      window.removeEventListener('scroll', updateFixedStartPos);
    };
  }, [logoContainerRef]);
  
  // Animasjonen skal være synlig med en gang og bevege seg ut
  const scrollStart = 0;
  const scrollEnd = 500;
  const fadeDistance = 300; // Samme som Hero.jsx bruker
  
  // Opacity: Synlig når overlay-firkanten vokser (samme timing)
  // Fade inn over første 100px (samme som overlay-firkanten vokser)
  const opacity = useTransform(scrollY, [0, 100], [0, 1]);
  
  // Størrelse: starter på 130px (samme som den hvite smileyen), krymper til 50px
  const size = useTransform(scrollY, [scrollStart, scrollEnd], [130, 50]);
  
  // Animasjon: Start på nøyaktig samme posisjon som den hvite smileyen
  // Bevegelsen starter samtidig med fade-in, men starter sakte
  const moveProgress = useTransform(scrollY, [0, scrollEnd], [0, 1]);
  
  const left = useTransform(moveProgress, (latest) => {
    if (viewportSize.width === 0) return '50%';
    // Start på samme posisjon som overlay-firkanten (justert -65px til venstre)
    const baseStartX = fixedStartPos.x > 0 ? fixedStartPos.x : (viewportSize.width / 2 - 65);
    const startX = baseStartX - 65; // Justert til venstre for å matche overlay-firkanten
    const endX = 20; // Øverst til venstre
    const currentX = startX + (endX - startX) * Math.max(0, Math.min(1, latest));
    return `${currentX}px`;
  });
  
  const top = useTransform(moveProgress, (latest) => {
    if (viewportSize.height === 0) return '50%';
    // Start på nøyaktig samme posisjon som den hvite smileyen i logoen (ikke flyttet)
    const baseStartY = fixedStartPos.y > 0 ? fixedStartPos.y : (viewportSize.height / 2 - 154 + 165 - 65);
    const startY = baseStartY; // Nøyaktig samme posisjon
    const endY = 35; // Øverst til venstre
    const currentY = startY + (endY - startY) * Math.max(0, Math.min(1, latest));
    return `${currentY}px`;
  });
  
  return (
    <>
      <motion.div
        className="fixed pointer-events-none"
        style={{
          left,
          top,
          opacity,
          zIndex: 50,
        }}
      >
        <motion.div
          animate={
            speechBubbleType
              ? {
                  y: [0, -5, 0, -3, 0],
                  scale: [1, 1.08, 1, 1.05, 1],
                }
              : { y: 0, scale: 1 }
          }
          transition={{
            duration: 0.6,
            repeat: speechBubbleType ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <motion.svg
            viewBox="50 35 160 160"
            style={{
              width: size,
              height: size,
            }}
            className="transition-all duration-700"
          >
          {/* Sirkel - bare smileyen, ikke hele logoen */}
          <circle 
            cx="130" 
            cy="115" 
            r="65" 
            fill={darkMode ? '#ffffff' : '#000000'}
            className="transition-colors duration-700"
          />
          
          {/* Øyne */}
          <ellipse 
            cx="112" 
            cy="105" 
            rx="8" 
            ry="15" 
            fill={darkMode ? '#000000' : '#ffffff'}
            className="transition-colors duration-700"
          />
          <ellipse 
            cx="148" 
            cy="105" 
            rx="8" 
            ry="15" 
            fill={darkMode ? '#000000' : '#ffffff'}
            className="transition-colors duration-700"
          />
          
          {/* Smil - animert når snakkeboblen vises (kun i noen sekunder) */}
          <motion.path 
            animate={
              isMouthAnimating
                ? {
                    d: [
                      "M100 140 Q130 165 160 140", // Lukket munn (normal smil)
                      "M115 150 Q130 150 145 150", // Åpen munn (flat/oval)
                      "M100 140 Q130 165 160 140", // Lukket
                      "M108 147 Q130 162 152 147", // Halvåpen
                      "M100 140 Q130 165 160 140", // Lukket
                      "M118 152 Q130 152 142 152", // Åpen igjen
                      "M100 140 Q130 165 160 140", // Lukket
                      "M105 143 Q130 163 155 143", // Halvåpen
                      "M100 140 Q130 165 160 140", // Lukket
                    ],
                  }
                : { d: "M100 140 Q130 165 160 140" }
            }
            transition={{
              duration: 0.3,
              repeat: isMouthAnimating ? Infinity : 0,
              ease: "easeInOut",
            }}
            stroke={darkMode ? '#000000' : '#ffffff'}
            strokeWidth="11"
            fill="none" 
            strokeLinecap="round"
            className="transition-colors duration-700"
          />
        </motion.svg>
        </motion.div>
        
        {/* Snakkeboble */}
        {speechBubbleType && getSpeechBubbleText() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="absolute left-full ml-4 top-1/2 -translate-y-1/2 pointer-events-auto"
            style={{
              zIndex: 60,
            }}
          >
            <div
              className="px-4 py-3 rounded-2xl shadow-lg max-w-xs"
              style={{
                backgroundColor: darkMode ? '#ffffff' : '#000000',
                color: darkMode ? '#000000' : '#ffffff',
              }}
            >
              <p className="text-sm font-medium whitespace-nowrap">
                {getSpeechBubbleText()}
              </p>
              {/* Snakkeboble-pil */}
              <div
                className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderRight: `8px solid ${darkMode ? '#ffffff' : '#000000'}`,
                }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
