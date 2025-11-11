import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';
import { t } from '../utils/translations';

export default function ContactModal({ isOpen, onClose, darkMode, language }) {
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

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_ACCESS_KEY', // Du må få en gratis nøkkel fra web3forms.com
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Ny henvendelse fra ${formData.name}`,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        
        // Lukk modal etter 2 sekunder
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2000);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateX: -30 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotateX: 0,
              }}
              exit={{ 
                scale: 0.8, 
                opacity: 0,
                rotateX: 30
              }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:rotate-90 z-10"
                style={{
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: darkMode ? '#ffffff' : '#000000',
                }}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content */}
              <div className="p-8">
                {!isSuccess ? (
                  <>
                    <motion.h2 
                      className="text-2xl font-semibold mb-2"
                      style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {t(language, 'contact.modal.title')}
                    </motion.h2>
                    <motion.p 
                      className="mb-6"
                      style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      {t(language, 'contact.modal.subtitle')}
                    </motion.p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label 
                          htmlFor="name" 
                          className="block text-sm font-medium mb-2"
                          style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
                        >
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
                          }}
                          placeholder="Ola Nordmann"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.25 }}
                      >
                        <label 
                          htmlFor="email" 
                          className="block text-sm font-medium mb-2"
                          style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
                        >
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
                          className="block text-sm font-medium mb-2"
                          style={{ color: darkMode ? '#ffffff' : '#0e0e0f' }}
                        >
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
                        transition={{ delay: 0.35 }}
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
                            <Send className="h-5 w-5" />
                            {t(language, 'contact.modal.send')}
                          </>
                        )}
                      </motion.button>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
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
                      <CheckCircle 
                        className="h-16 w-16 mx-auto mb-4"
                        style={{ color: darkMode ? '#4ade80' : '#22c55e' }}
                      />
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
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
