import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SmileyLogo from '../components/SmileyLogo';
import { t } from '../utils/translations';

export default function Hero({ darkMode, smileyExpression, language }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallax = scrollY * 0.5;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div 
        className="text-center relative z-10"
        style={{ transform: `translateY(${parallax}px)` }}
      >
        {/* Smiley Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <SmileyLogo darkMode={darkMode} forcedExpression={smileyExpression} size={200} />
        </motion.div>

        {/* Typography with stagger effect */}
        <div className="overflow-hidden">
          {['TICH', 'TACH', 'TECH'].map((word, i) => (
            <motion.div
              key={word}
              className="leading-[0.85]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              style={{
                transform: scrollY > 0 ? `translateY(${scrollY * 0.1 * (i + 1)}px)` : 'translateY(0)',
                opacity: scrollY > 300 ? Math.max(0, 1 - (scrollY - 300) / 200) : 1,
              }}
            >
              <h1 
                className="text-[64px] sm:text-[96px] md:text-[120px] font-black tracking-tight transition-colors duration-700"
                style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
              >
                {word.split('').map((letter, j) => (
                  <motion.span
                    key={j}
                    className="inline-block hover:scale-110 transition-transform duration-300"
                    whileHover={{ scale: 1.2, rotate: [-5, 5, -5, 0] }}
                    style={{
                      transitionDelay: `${j * 50}ms`,
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>
            </motion.div>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-lg font-light max-w-md mx-auto transition-colors duration-700"
          style={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
        >
          {t(language, 'hero.tagline1')}
          <br />
          {t(language, 'hero.tagline2')}
        </motion.p>

        {/* Scroll hint */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div 
            className="inline-flex flex-col items-center gap-2 text-sm transition-colors duration-700"
            style={{ color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }}
          >
            <span className="font-light">{t(language, 'hero.scroll')}</span>
            <motion.div 
              className="w-px h-12 bg-current animate-pulse"
              animate={{ scaleY: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
