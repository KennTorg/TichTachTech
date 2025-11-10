import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function PhysicsButtons({ darkMode, onDarkModeClick, language, onLanguageClick }) {
  // Dark mode button state
  const [darkModePos, setDarkModePos] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth - 60 : 500, 
    y: -100 
  });
  const [darkModeVelocity, setDarkModeVelocity] = useState({ x: 0, y: 0 });
  const [isDarkModeDragging, setIsDarkModeDragging] = useState(false);
  const [darkModeRotation, setDarkModeRotation] = useState(0);
  const [darkModeHasLanded, setDarkModeHasLanded] = useState(false);
  
  // Language button state
  const [langPos, setLangPos] = useState({ x: 60, y: -100 });
  const [langVelocity, setLangVelocity] = useState({ x: 0, y: 0 });
  const [isLangDragging, setIsLangDragging] = useState(false);
  const [langRotation, setLangRotation] = useState(0);
  const [langHasLanded, setLangHasLanded] = useState(false);
  
  const darkModeRef = useRef(null);
  const langRef = useRef(null);
  const animationRef = useRef(null);
  
  const darkModeLastPos = useRef({ x: typeof window !== 'undefined' ? window.innerWidth - 60 : 500, y: -100 });
  const langLastPos = useRef({ x: 60, y: -100 });
  
  const darkModeLastTime = useRef(Date.now());
  const langLastTime = useRef(Date.now());
  
  const darkModeDragStart = useRef({ x: 0, y: 0 });
  const langDragStart = useRef({ x: 0, y: 0 });
  
  const darkModeHasDragged = useRef(false);
  const langHasDragged = useRef(false);
  
  const buttonSize = 56;
  const collisionDistance = buttonSize * 1.2;
  
  // Main physics animation loop
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const gravity = 0.6;
    const bounce = 0.35;
    const friction = 0.98;
    const groundLevel = window.innerHeight - 80;
    
    const animate = () => {
      // Check for collision between buttons
      const dx = langPos.x - darkModePos.x;
      const dy = langPos.y - darkModePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < collisionDistance && distance > 0) {
        const force = (collisionDistance - distance) / collisionDistance * 5;
        const angle = Math.atan2(dy, dx);
        
        setDarkModeVelocity(v => ({
          x: v.x - Math.cos(angle) * force,
          y: v.y - Math.sin(angle) * force,
        }));
        
        setLangVelocity(v => ({
          x: v.x + Math.cos(angle) * force,
          y: v.y + Math.sin(angle) * force,
        }));
      }
      
      // Update dark mode button
      if (!isDarkModeDragging) {
        setDarkModePos(prev => {
          let newY = prev.y + darkModeVelocity.y;
          let newX = prev.x + darkModeVelocity.x;
          
          if (newX - buttonSize / 2 < 0) {
            newX = buttonSize / 2;
            setDarkModeVelocity(v => ({ ...v, x: -v.x * bounce }));
          }
          if (newX + buttonSize / 2 > window.innerWidth) {
            newX = window.innerWidth - buttonSize / 2;
            setDarkModeVelocity(v => ({ ...v, x: -v.x * bounce }));
          }
          
          if (newY >= groundLevel) {
            if (!darkModeHasLanded) setDarkModeHasLanded(true);
            
            if (Math.abs(darkModeVelocity.y) < 2.5 && Math.abs(darkModeVelocity.x) < 0.5) {
              setDarkModeVelocity({ x: 0, y: 0 });
              return { x: newX, y: groundLevel };
            }
            
            setDarkModeVelocity(v => ({
              x: v.x * friction,
              y: -v.y * bounce,
            }));
            
            return { x: newX, y: groundLevel };
          }
          
          return { x: newX, y: newY };
        });
        
        // Apply gravity
        if (darkModePos.y < groundLevel || Math.abs(darkModeVelocity.y) > 0.1) {
          setDarkModeVelocity(v => ({
            x: v.x * friction,
            y: v.y + gravity,
          }));
        }
        
        if (Math.abs(darkModeVelocity.x) > 0.5) {
          setDarkModeRotation(prev => prev + darkModeVelocity.x * 0.5);
        }
      }
      
      // Update language button
      if (!isLangDragging) {
        setLangPos(prev => {
          let newY = prev.y + langVelocity.y;
          let newX = prev.x + langVelocity.x;
          
          if (newX - buttonSize / 2 < 0) {
            newX = buttonSize / 2;
            setLangVelocity(v => ({ ...v, x: -v.x * bounce }));
          }
          if (newX + buttonSize / 2 > window.innerWidth) {
            newX = window.innerWidth - buttonSize / 2;
            setLangVelocity(v => ({ ...v, x: -v.x * bounce }));
          }
          
          if (newY >= groundLevel) {
            if (!langHasLanded) setLangHasLanded(true);
            
            if (Math.abs(langVelocity.y) < 2.5 && Math.abs(langVelocity.x) < 0.5) {
              setLangVelocity({ x: 0, y: 0 });
              return { x: newX, y: groundLevel };
            }
            
            setLangVelocity(v => ({
              x: v.x * friction,
              y: -v.y * bounce,
            }));
            
            return { x: newX, y: groundLevel };
          }
          
          return { x: newX, y: newY };
        });
        
        // Apply gravity
        if (langPos.y < groundLevel || Math.abs(langVelocity.y) > 0.1) {
          setLangVelocity(v => ({
            x: v.x * friction,
            y: v.y + gravity,
          }));
        }
        
        if (Math.abs(langVelocity.x) > 0.5) {
          setLangRotation(prev => prev + langVelocity.x * 0.5);
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    darkModeVelocity, 
    langVelocity, 
    isDarkModeDragging, 
    isLangDragging, 
    darkModeHasLanded, 
    langHasLanded,
    darkModePos,
    langPos
  ]);
  
  // Dark mode button drag handlers
  const handleDarkModeMouseDown = (e) => {
    e.stopPropagation();
    setIsDarkModeDragging(true);
    darkModeDragStart.current = { x: e.clientX - darkModePos.x, y: e.clientY - darkModePos.y };
    darkModeLastPos.current = darkModePos;
    darkModeLastTime.current = Date.now();
    setDarkModeVelocity({ x: 0, y: 0 });
  };
  
  const handleDarkModeMouseMove = (e) => {
    if (!isDarkModeDragging) return;
    
    const newX = e.clientX - darkModeDragStart.current.x;
    const newY = e.clientY - darkModeDragStart.current.y;
    
    setDarkModePos({ x: newX, y: newY });
    
    const now = Date.now();
    const dt = now - darkModeLastTime.current;
    if (dt > 0) {
      const vx = (newX - darkModeLastPos.current.x) / dt * 16;
      const vy = (newY - darkModeLastPos.current.y) / dt * 16;
      setDarkModeVelocity({ x: vx, y: vy });
    }
    
    darkModeLastPos.current = { x: newX, y: newY };
    darkModeLastTime.current = now;
  };
  
  const handleDarkModeMouseUp = () => {
    setIsDarkModeDragging(false);
  };
  
  const handleDarkModeClick = (e) => {
    if (!isDarkModeDragging) {
      onDarkModeClick();
    }
  };
  
  // Language button drag handlers
  const handleLangMouseDown = (e) => {
    e.stopPropagation();
    setIsLangDragging(true);
    langDragStart.current = { x: e.clientX - langPos.x, y: e.clientY - langPos.y };
    langLastPos.current = langPos;
    langLastTime.current = Date.now();
    setLangVelocity({ x: 0, y: 0 });
  };
  
  const handleLangMouseMove = (e) => {
    if (!isLangDragging) return;
    
    const newX = e.clientX - langDragStart.current.x;
    const newY = e.clientY - langDragStart.current.y;
    
    setLangPos({ x: newX, y: newY });
    
    const now = Date.now();
    const dt = now - langLastTime.current;
    if (dt > 0) {
      const vx = (newX - langLastPos.current.x) / dt * 16;
      const vy = (newY - langLastPos.current.y) / dt * 16;
      setLangVelocity({ x: vx, y: vy });
    }
    
    langLastPos.current = { x: newX, y: newY };
    langLastTime.current = now;
  };
  
  const handleLangMouseUp = () => {
    setIsLangDragging(false);
  };
  
  const handleLangClick = (e) => {
    if (!isLangDragging) {
      onLanguageClick();
    }
  };
  
  // Event listeners
  useEffect(() => {
    if (isDarkModeDragging) {
      window.addEventListener('mousemove', handleDarkModeMouseMove);
      window.addEventListener('mouseup', handleDarkModeMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleDarkModeMouseMove);
        window.removeEventListener('mouseup', handleDarkModeMouseUp);
      };
    }
  }, [isDarkModeDragging, darkModePos, darkModeLastPos.current, darkModeLastTime.current]);
  
  useEffect(() => {
    if (isLangDragging) {
      window.addEventListener('mousemove', handleLangMouseMove);
      window.addEventListener('mouseup', handleLangMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleLangMouseMove);
        window.removeEventListener('mouseup', handleLangMouseUp);
      };
    }
  }, [isLangDragging, langPos, langLastPos.current, langLastTime.current]);
  
  // Calculate shadows
  const darkModeDistanceFromGround = typeof window !== 'undefined' ? window.innerHeight - 80 - darkModePos.y : 0;
  const darkModeShadowSize = Math.max(10, Math.min(40, 60 - darkModeDistanceFromGround / 10));
  const darkModeShadowOpacity = Math.max(0.1, Math.min(0.3, 1 - darkModeDistanceFromGround / 500));
  
  const langDistanceFromGround = typeof window !== 'undefined' ? window.innerHeight - 80 - langPos.y : 0;
  const langShadowSize = Math.max(10, Math.min(40, 60 - langDistanceFromGround / 10));
  const langShadowOpacity = Math.max(0.1, Math.min(0.3, 1 - langDistanceFromGround / 500));
  
  return (
    <>
      {/* Language Button */}
      <button
        ref={langRef}
        onClick={handleLangClick}
        onMouseDown={handleLangMouseDown}
        className={`fixed w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center group z-50 ${
          darkMode ? 'bg-white' : 'bg-black'
        }`}
        style={{
          left: langPos.x,
          top: langPos.y,
          transform: `translate(-50%, -50%) rotate(${langRotation}deg) scale(${isLangDragging ? 1.1 : 1})`,
          cursor: isLangDragging ? 'grabbing' : 'grab',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <span className={`text-sm font-bold ${darkMode ? 'text-black' : 'text-white'}`}>
          {language === 'en' ? 'ENG' : 'NO'}
        </span>
      </button>
      
      {/* Language Button Shadow */}
      {!isLangDragging && typeof window !== 'undefined' && (
        <div
          className="fixed rounded-full blur-md pointer-events-none transition-opacity duration-700"
          style={{
            left: langPos.x,
            top: window.innerHeight - 80,
            width: `${langShadowSize}px`,
            height: `${langShadowSize / 2}px`,
            transform: 'translate(-50%, -50%)',
            opacity: langShadowOpacity,
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
          }}
        />
      )}
      
      {/* Dark Mode Button */}
      <button
        ref={darkModeRef}
        onClick={handleDarkModeClick}
        onMouseDown={handleDarkModeMouseDown}
        className={`fixed w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center group z-50 ${
          darkMode ? 'bg-white' : 'bg-black'
        }`}
        style={{
          left: darkModePos.x,
          top: darkModePos.y,
          transform: `translate(-50%, -50%) rotate(${darkModeRotation}deg) scale(${isDarkModeDragging ? 1.1 : 1})`,
          cursor: isDarkModeDragging ? 'grabbing' : 'grab',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {darkMode ? (
          <Sun className="w-6 h-6 text-black" />
        ) : (
          <Moon className="w-6 h-6 text-white" />
        )}
      </button>
      
      {/* Dark Mode Button Shadow */}
      {!isDarkModeDragging && typeof window !== 'undefined' && (
        <div
          className="fixed rounded-full blur-md pointer-events-none transition-colors duration-700"
          style={{
            left: darkModePos.x,
            top: window.innerHeight - 80,
            width: `${darkModeShadowSize}px`,
            height: `${darkModeShadowSize / 2}px`,
            transform: 'translate(-50%, -50%)',
            opacity: darkModeShadowOpacity,
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
          }}
        />
      )}
    </>
  );
}
