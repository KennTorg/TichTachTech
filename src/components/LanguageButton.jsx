import React, { useState, useEffect, useRef } from 'react';

export default function LanguageButton({ language, onClick }) {
  const [pos, setPos] = useState({ x: 60, y: -100 }); // Starter på venstre side
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasLanded, setHasLanded] = useState(false);
  
  const buttonRef = useRef(null);
  const animationRef = useRef(null);
  const lastPos = useRef({ x: 60, y: -100 });
  const lastTime = useRef(Date.now());
  const dragStartPos = useRef({ x: 0, y: 0 });
  
  // Physics animation
  useEffect(() => {
    if (isDragging || typeof window === 'undefined') return;
    
    const gravity = 0.6;
    const bounce = 0.35;
    const friction = 0.98;
    const groundLevel = window.innerHeight - 80;
    const buttonSize = 56;
    
    const animate = () => {
      setPos(prev => {
        let newY = prev.y + velocity.y;
        let newX = prev.x + velocity.x;
        
        // Wall boundaries
        if (newX - buttonSize / 2 < 0) {
          newX = buttonSize / 2;
          setVelocity(v => ({ ...v, x: -v.x * 0.7 }));
        }
        if (newX + buttonSize / 2 > window.innerWidth) {
          newX = window.innerWidth - buttonSize / 2;
          setVelocity(v => ({ ...v, x: -v.x * 0.7 }));
        }
        
        // Hit ground
        if (newY >= groundLevel) {
          if (!hasLanded) {
            setHasLanded(true);
          }
          
          // Stop if velocity is very low
          if (Math.abs(velocity.y) < 2.5 && Math.abs(velocity.x) < 0.5) {
            setVelocity({ x: 0, y: 0 });
            return { x: newX, y: groundLevel };
          }
          
          // Bounce
          setVelocity(v => ({
            x: v.x * friction,
            y: -v.y * bounce,
          }));
          
          return { x: newX, y: groundLevel };
        }
        
        return { x: newX, y: newY };
      });
      
      // Apply gravity
      if (pos.y < window.innerHeight - 80 || Math.abs(velocity.y) > 0.1) {
        setVelocity(v => ({
          x: v.x * friction,
          y: v.y + gravity,
        }));
      }
      
      // Rotate based on horizontal velocity
      if (Math.abs(velocity.x) > 0.5) {
        setRotation(prev => prev + velocity.x * 0.5);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [velocity, isDragging, hasLanded, pos.y]);
  
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    lastPos.current = pos;
    lastTime.current = Date.now();
    setVelocity({ x: 0, y: 0 });
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStartPos.current.x;
    const newY = e.clientY - dragStartPos.current.y;
    
    setPos({ x: newX, y: newY });
    
    // Track velocity while dragging
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      const vx = (newX - lastPos.current.x) / dt * 16;
      const vy = (newY - lastPos.current.y) / dt * 16;
      setVelocity({ x: vx, y: vy });
    }
    
    lastPos.current = { x: newX, y: newY };
    lastTime.current = now;
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);
  
  // Calculate shadow
  const distanceFromGround = typeof window !== 'undefined' ? window.innerHeight - 80 - pos.y : 0;
  const shadowSize = Math.max(10, Math.min(40, 60 - distanceFromGround / 10));
  const shadowOpacity = Math.max(0.1, Math.min(0.3, 1 - distanceFromGround / 500));
  
  return (
    <>
      {/* Button */}
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseDown={handleMouseDown}
        className="fixed w-14 h-14 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center group z-50"
        style={{
          left: pos.x,
          top: pos.y,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${isDragging ? 1.1 : 1})`,
          cursor: isDragging ? 'grabbing' : 'grab',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <span className="text-xl font-bold">
          {language === 'en' ? '🇬🇧' : '🇳🇴'}
        </span>
      </button>
      
      {/* Shadow on ground */}
      {!isDragging && typeof window !== 'undefined' && (
        <div
          className="fixed rounded-full blur-md pointer-events-none transition-opacity duration-700"
          style={{
            left: pos.x,
            top: window.innerHeight - 80,
            width: `${shadowSize}px`,
            height: `${shadowSize / 2}px`,
            transform: 'translate(-50%, -50%)',
            opacity: shadowOpacity,
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
          }}
        />
      )}
    </>
  );
}
