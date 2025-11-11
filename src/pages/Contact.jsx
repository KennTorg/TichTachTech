import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Mail, ArrowRight, User, MessageSquare } from 'lucide-react';
import { t } from '../utils/translations';

export default function Contact({ darkMode, language, onBankBankClick }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <motion.div 
        className="text-center max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        {!showForm ? (
          <div className="mt-8">
            <MagneticButton
              onClick={() => {
                setShowForm(true);
              }}
              darkMode={darkMode}
              language={language}
            />
          </div>
        ) : (
          <ContactForm darkMode={darkMode} language={language} onBankBankClick={onBankBankClick} />
        )}
      </motion.div>
    </section>
  );
}

// Magnetic Button Component
function MagneticButton({ onClick, darkMode, language }) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for smooth magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 200, damping: 20 }; // Mer responsiv!
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - buttonCenterX;
      const distanceY = e.clientY - buttonCenterY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      
      // SUPER intens magnetic radius!
      const magneticRadius = 1000;
      
      if (distance < magneticRadius) {
        // MEGA STERK pull - INTENS!
        const strength = 1 - distance / magneticRadius;
        const pullX = distanceX * strength * 1.0; // 1.0 = 100% følger musen!
        const pullY = distanceY * strength * 1.0;
        
        mouseX.set(pullX);
        mouseY.set(pullY);
      } else {
        mouseX.set(0);
        mouseY.set(0);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      whileTap={{ scale: 0.95 }}
      className="group relative px-8 py-4 rounded-full font-medium text-lg overflow-hidden transition-colors duration-300"
      style={{
        x,
        y,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: darkMode ? '#ffffff' : '#000000',
        color: darkMode ? '#ffffff' : '#000000',
      }}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span 
          className="transition-colors duration-300"
          style={{
            color: isHovered 
              ? (darkMode ? '#000000' : '#ffffff')
              : (darkMode ? '#ffffff' : '#000000'),
          }}
        >
          {t(language, 'contact.button')}
        </span>
        <ArrowRight 
          className="h-5 w-5 group-hover:translate-x-1 transition-all duration-300"
          style={{
            color: isHovered 
              ? (darkMode ? '#000000' : '#ffffff')
              : (darkMode ? '#ffffff' : '#000000'),
          }}
        />
      </span>
      <motion.div 
        className="absolute inset-0 origin-left"
        style={{ backgroundColor: darkMode ? '#ffffff' : '#000000' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}

// Inline contact form component
function ContactForm({ darkMode, language, onBankBankClick }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Vis snakkeboblen når man sender meldingen
    if (onBankBankClick) {
      onBankBankClick();
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_ACCESS_KEY',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Ny henvendelse fra ${formData.name}`,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mt-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            damping: 10,
            stiffness: 200,
          }}
        >
          <div 
            className="inline-flex h-16 w-16 items-center justify-center rounded-full mb-4"
            style={{ 
              backgroundColor: darkMode ? '#4ade80' : '#22c55e',
              color: '#ffffff'
            }}
          >
            <Mail className="h-8 w-8" />
          </div>
        </motion.div>
        <h3 
          className="text-2xl font-semibold mb-2"
          style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
        >
          {t(language, 'contact.modal.successTitle')}
        </h3>
        <p 
          style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}
        >
          {t(language, 'contact.modal.successMessage')}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-8 w-full max-w-md mx-auto"
    >
      <motion.p 
        className="text-center mb-6"
        style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {t(language, 'contact.subtitle')}
      </motion.p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label 
            htmlFor="name" 
            className="block text-sm font-medium mb-2 flex items-center gap-2"
            style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
          >
            <User className="h-4 w-4" />
            {t(language, 'contact.modal.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              color: darkMode ? '#ffffff' : '#0e0e0f',
              textAlign: 'left',
            }}
            placeholder="Ola Nordmann"
          />
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label 
            htmlFor="email" 
            className="block text-sm font-medium mb-2 flex items-center gap-2"
            style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
          >
            <Mail className="h-4 w-4" />
            {t(language, 'contact.modal.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              color: darkMode ? '#ffffff' : '#0e0e0f',
              textAlign: 'left',
            }}
            placeholder="ola@example.com"
          />
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label 
            htmlFor="message" 
            className="block text-sm font-medium mb-2 flex items-center gap-2"
            style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
          >
            <MessageSquare className="h-4 w-4" />
            {t(language, 'contact.modal.message')}
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 resize-none"
            style={{
              backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              color: darkMode ? '#ffffff' : '#0e0e0f',
              textAlign: 'left',
            }}
            placeholder={t(language, 'contact.modal.messagePlaceholder')}
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: darkMode ? '#ffffff' : '#000000',
            color: darkMode ? '#000000' : '#ffffff',
          }}
        >
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              {t(language, 'contact.modal.sending')}
            </>
          ) : (
            <>
              <ArrowRight className="h-5 w-5" />
              {t(language, 'contact.modal.send')}
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
