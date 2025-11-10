import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../utils/translations';

export default function LabFeed({ darkMode, language }) {
  const logs = translations[language]?.lab?.logs || [];

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="text-3xl font-light mb-2 transition-colors duration-700"
            style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
          >
            {translations[language]?.lab?.title || 'Lab Feed'}
          </h2>
          <p 
            className="transition-colors duration-700"
            style={{ color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
          >
            {translations[language]?.lab?.subtitle || 'Random experiments from the studio'}
          </p>
        </motion.div>

        <div className="space-y-3">
          {logs.map((log, i) => (
            <motion.div
              key={log.time}
              initial={{ opacity: 0, x: i % 2 ? 18 : -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="flex gap-4 text-[15px] p-4 rounded-lg transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
              }}
            >
              <span 
                className="tabular-nums w-14 transition-colors duration-700"
                style={{ color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }}
              >
                [{log.time}]
              </span>
              <span 
                className="transition-colors duration-700"
                style={{ color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}
              >
                {log.message}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
