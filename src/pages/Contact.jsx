import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import SmileyLogo from '../components/SmileyLogo';
import { t } from '../utils/translations';

export default function Contact({ darkMode, language }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <motion.div 
        className="text-center max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <SmileyLogo darkMode={darkMode} size={120} />
        
        {!revealed ? (
          <div className="mt-8">
            <motion.button
              onClick={() => setRevealed(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-full font-medium text-lg overflow-hidden transition-all duration-300"
              style={{
                borderWidth: '2px',
                borderColor: darkMode ? '#ffffff' : '#000000',
                color: darkMode ? '#ffffff' : '#000000',
              }}
            >
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                {t(language, 'contact.button')}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <motion.div 
                className="absolute inset-0 origin-left"
                style={{ backgroundColor: darkMode ? '#ffffff' : '#000000' }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        ) : (
          <motion.div 
            className="mt-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div 
              className="inline-flex h-16 w-16 items-center justify-center rounded-full mb-4 transition-colors duration-700"
              style={{
                backgroundColor: darkMode ? '#ffffff' : '#000000',
                color: darkMode ? '#000000' : '#ffffff',
              }}
            >
              <Mail className="h-6 w-6" />
            </div>
            <a 
              href="mailto:hello@tichtach.tech" 
              className="block text-3xl font-light hover:underline decoration-2 underline-offset-8 transition-colors duration-700"
              style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
            >
              hello@tichtach.tech
            </a>
            <p 
              className="mt-3 transition-colors duration-700"
              style={{ color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
            >
              {t(language, 'contact.subtitle')}
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
