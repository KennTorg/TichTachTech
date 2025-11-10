import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function SmileyLogo({ darkMode = false, forcedExpression = null, size = 220 }) {
  const [state, setState] = useState({
    isHovered: false,
    isPressed: false,
    isBlinking: false,
    expression: 'happy',
    shaking: false,
    spinning: false,
    squishing: false,
    mousePos: { x: 0, y: 0 },
    clickCount: 0,
  });
  
  const logoRef = useRef(null);
  const longPressTimer = useRef(null);
  
  // Use forced expression if provided
  const currentExpression = forcedExpression || state.expression;
  
  // Auto blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setState(prev => ({ ...prev, isBlinking: true }));
      setTimeout(() => {
        setState(prev => ({ ...prev, isBlinking: false }));
      }, 150);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(blinkInterval);
  }, []);
  
  // Random expression changes
  useEffect(() => {
    const expressions = ['happy', 'excited', 'surprised', 'silly', 'love'];
    const changeExpression = setInterval(() => {
      if (!state.isHovered && !state.isPressed && !forcedExpression) {
        const newExpression = expressions[Math.floor(Math.random() * expressions.length)];
        setState(prev => ({ ...prev, expression: newExpression }));
      }
    }, 6000);
    
    return () => clearInterval(changeExpression);
  }, [state.isHovered, state.isPressed, forcedExpression]);
  
  // Mouse tracking for eye movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (logoRef.current && state.isHovered) {
        const rect = logoRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        setState(prev => ({
          ...prev,
          mousePos: {
            x: (e.clientX - centerX) / 100,
            y: (e.clientY - centerY) / 100,
          }
        }));
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [state.isHovered]);
  
  const handleMouseEnter = () => {
    setState(prev => ({ ...prev, isHovered: true, expression: 'excited' }));
  };
  
  const handleMouseLeave = () => {
    setState(prev => ({ 
      ...prev, 
      isHovered: false, 
      isPressed: false,
      expression: 'happy',
      mousePos: { x: 0, y: 0 }
    }));
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };
  
  const handleMouseDown = () => {
    setState(prev => ({ ...prev, isPressed: true, squishing: true }));
    
    longPressTimer.current = setTimeout(() => {
      setState(prev => ({ ...prev, spinning: true, expression: 'silly' }));
      setTimeout(() => {
        setState(prev => ({ ...prev, spinning: false }));
      }, 1000);
    }, 800);
  };
  
  const handleMouseUp = () => {
    setState(prev => ({ ...prev, isPressed: false, squishing: false }));
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };
  
  const handleClick = () => {
    const newCount = state.clickCount + 1;
    setState(prev => ({ ...prev, clickCount: newCount, shaking: true }));
    
    setTimeout(() => {
      setState(prev => ({ ...prev, shaking: false }));
    }, 500);
    
    if (newCount === 5) {
      setState(prev => ({ ...prev, expression: 'love', spinning: true }));
      setTimeout(() => {
        setState(prev => ({ ...prev, clickCount: 0, spinning: false, expression: 'happy' }));
      }, 2000);
    }
  };
  
  const handleDoubleClick = () => {
    setState(prev => ({ ...prev, expression: 'surprised' }));
    
    if (logoRef.current) {
      logoRef.current.style.animation = 'none';
      setTimeout(() => {
        logoRef.current.style.animation = 'jump 0.6s ease-out';
      }, 10);
    }
  };
  
  return (
    <motion.div
      ref={logoRef}
      className="cursor-pointer select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        transform: `
          scale(${state.isPressed ? 0.95 : state.isHovered ? 1.05 : 1})
          rotate(${state.spinning ? 360 : 0}deg)
          ${state.squishing ? 'scaleY(0.95)' : ''}
        `,
        transition: state.spinning ? 'transform 1s ease-out' : 'transform 0.2s ease-out',
      }}
      animate={state.shaking ? { x: [-10, 10, -10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      <SmileyLogoSVG 
        state={{ ...state, expression: currentExpression }} 
        darkMode={darkMode}
        size={size}
      />
    </motion.div>
  );
}

function SmileyLogoSVG({ state, darkMode, size }) {
  const { isBlinking, expression, mousePos, isHovered } = state;
  
  const eyeOffsetX = isHovered ? mousePos.x * 3 : 0;
  const eyeOffsetY = isHovered ? mousePos.y * 3 : 0;
  
  const eyeWidth = expression === 'surprised' ? 12 : 
                   expression === 'excited' ? 10 : 8;
  const eyeHeight = isBlinking ? 2 : 
                    (expression === 'surprised' ? 18 : 
                     expression === 'love' ? 12 : 15);
  
  const smileParams = {
    happy: { path: "M100 140 Q130 165 160 140", width: 11 },
    excited: { path: "M95 138 Q130 170 165 138", width: 12 },
    surprised: { path: "M115 150 Q130 155 145 150", width: 9 },
    silly: { path: "M100 140 Q115 160 130 158 Q145 160 160 140", width: 11 },
    love: { path: "M100 140 Q130 168 160 140", width: 11 },
  };
  
  const currentSmile = smileParams[expression] || smileParams.happy;
  
  return (
    <svg
      viewBox="0 -100 260 400"
      width={size}
      height={size * 1.54}
      className="drop-shadow-2xl transition-all duration-700"
      style={{
        filter: isHovered ? 'drop-shadow(0 15px 40px rgba(0,0,0,0.3))' : 'drop-shadow(0 10px 30px rgba(0,0,0,0.15))',
      }}
    >
      <rect 
        x="25" 
        y="24" 
        width="210" 
        height="252" 
        rx="38" 
        fill={darkMode ? '#ffffff' : '#0a0a0a'}
        className="transition-colors duration-700"
      />

      <circle 
        cx="130" 
        cy="115" 
        r="65" 
        fill={darkMode ? '#000000' : '#ffffff'}
        className="transition-colors duration-700"
      />
      
      <g style={{
        transform: `translate(${eyeOffsetX}px, ${eyeOffsetY}px)`,
        transition: 'transform 0.15s ease-out',
      }}>
        <ellipse 
          cx="112" 
          cy="105" 
          rx={eyeWidth} 
          ry={eyeHeight} 
          fill={darkMode ? '#ffffff' : '#0a0a0a'}
          className="transition-colors duration-700"
        />
        <ellipse 
          cx="148" 
          cy="105" 
          rx={eyeWidth} 
          ry={eyeHeight} 
          fill={darkMode ? '#ffffff' : '#0a0a0a'}
          className="transition-colors duration-700"
        />
      </g>
      
      {expression === 'love' && (
        <g>
          <motion.path
            d="M 80 -20 C 75 -25, 68 -25, 65 -20 C 62 -15, 65 -10, 70 -5 L 80 5 L 90 -5 C 95 -10, 98 -15, 95 -20 C 92 -25, 85 -25, 80 -20 Z"
            fill="#ff1493"
            animate={{ y: [0, -120], scale: [0, 1, 0.8], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.path
            d="M 130 10 C 127 6, 122 6, 120 10 C 118 14, 120 18, 123 22 L 130 28 L 137 22 C 140 18, 142 14, 140 10 C 138 6, 133 6, 130 10 Z"
            fill="#ff69b4"
            animate={{ y: [0, -100], scale: [0, 1.2, 0.6], opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, ease: "easeOut" }}
          />
          <motion.path
            d="M 180 -10 C 177 -14, 172 -14, 170 -10 C 168 -6, 170 -2, 173 2 L 180 8 L 187 2 C 190 -2, 192 -6, 190 -10 C 188 -14, 183 -14, 180 -10 Z"
            fill="#ff1493"
            animate={{ y: [0, -140], scale: [0, 1.1, 0.7], opacity: [0, 1, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: 1, ease: "easeOut" }}
          />
        </g>
      )}

      <path 
        d={currentSmile.path}
        stroke={darkMode ? '#ffffff' : '#0a0a0a'}
        strokeWidth={currentSmile.width}
        fill="none" 
        strokeLinecap="round"
        className="transition-colors duration-700"
      />
    </svg>
  );
}
