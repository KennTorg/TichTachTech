import React from 'react';
import { t } from '../utils/translations';

export default function Footer({ darkMode, language }) {
  return (
    <footer 
      className="py-12 text-center text-xs border-t transition-all duration-700"
      style={{
        color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
        borderTopColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      }}
    >
      © {new Date().getFullYear()} TichTachTech — {t(language, 'footer')}
    </footer>
  );
}
