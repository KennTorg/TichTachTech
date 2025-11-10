import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Smartphone, Boxes, Zap } from 'lucide-react';
import { t, translations } from '../utils/translations';

export default function Services({ darkMode, language }) {
  const [isHovering, setIsHovering] = useState(false);
  const [splashes, setSplashes] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const arenaRef = useRef(null);

  const CARD_W = 280;
  const CARD_H = 200;
  const PADDING = 8;
  const FRICTION = 0.99;
  const RESTITUTION = 0.95;
  const MIN_SPEED = 0.5;
  const HIT_RADIUS = 160;

  const cards = [
    { 
      icon: <Bot className="h-5 w-5" />, 
      title: t(language, 'services.aiSolutions.title'), 
      desc: t(language, 'services.aiSolutions.desc')
    },
    { 
      icon: <Smartphone className="h-5 w-5" />, 
      title: t(language, 'services.webMobile.title'), 
      desc: t(language, 'services.webMobile.desc')
    },
    { 
      icon: <Boxes className="h-5 w-5" />, 
      title: t(language, 'services.saas.title'), 
      desc: t(language, 'services.saas.desc')
    },
    { 
      icon: <Zap className="h-5 w-5" />, 
      title: t(language, 'services.automation.title'), 
      desc: t(language, 'services.automation.desc')
    },
  ];

  const itemsRef = useRef([]);
  const rafRef = useRef(null);
  const containerRefs = useRef([]);

  useEffect(() => {
    if (!arenaRef.current) return;
    initCards();
    startLoop();
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, []);

  function initCards() {
    const arena = arenaRef.current;
    if (!arena) return;
    const W = arena.clientWidth;
    const H = arena.clientHeight;
    itemsRef.current = containerRefs.current
      .filter(Boolean)
      .map((el) => {
        if (!el) return null;
        const x = CARD_W / 2 + Math.random() * (W - CARD_W - PADDING * 2);
        const y = CARD_H / 2 + Math.random() * (H - CARD_H - PADDING * 2);
        const a = Math.random() * Math.PI * 2;
        const s = 3.5 + Math.random() * 3.5;
        return { el: el, x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, rot: 0, dead: false };
      })
      .filter(Boolean);
  }

  /** Main physics loop */
  function startLoop() {
    const tick = () => {
      stepPhysics();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function stepPhysics() {
    const arena = arenaRef.current;
    if (!arena) return;
    const W = arena.clientWidth, H = arena.clientHeight;
    const items = itemsRef.current;

    for (let i = 0; i < items.length; i++) {
      const a = items[i];
      if (a.dead) continue;

      a.x += a.vx; a.y += a.vy;
      const minX = CARD_W / 2 + PADDING, maxX = W - CARD_W / 2 - PADDING;
      const minY = CARD_H / 2 + PADDING, maxY = H - CARD_H / 2 - PADDING;

      if (a.x < minX) { a.x = minX; a.vx = Math.abs(a.vx) * RESTITUTION; }
      if (a.x > maxX) { a.x = maxX; a.vx = -Math.abs(a.vx) * RESTITUTION; }
      if (a.y < minY) { a.y = minY; a.vy = Math.abs(a.vy) * RESTITUTION; }
      if (a.y > maxY) { a.y = maxY; a.vy = -Math.abs(a.vy) * RESTITUTION; }

      a.vx *= FRICTION; a.vy *= FRICTION;
      const sp = Math.hypot(a.vx, a.vy);
      if (sp < MIN_SPEED) {
        a.vx += (Math.random() - 0.5) * 0.9;
        a.vy += (Math.random() - 0.5) * 0.9;
      }

      for (let j = i + 1; j < items.length; j++) {
        const b = items[j];
        if (b.dead) continue;
        const dx = a.x - b.x, dy = a.y - b.y, dist = Math.hypot(dx, dy);
        const rad = (CARD_W * 0.85) / 2;
        if (dist < rad * 2 && dist > 0) {
          const overlap = rad * 2 - dist, nx = dx / dist, ny = dy / dist;
          a.x += nx * (overlap / 2); a.y += ny * (overlap / 2);
          b.x -= nx * (overlap / 2); b.y -= ny * (overlap / 2);
          const rvx = a.vx - b.vx, rvy = a.vy - b.vy;
          const vN = rvx * nx + rvy * ny;
          if (vN > 0) continue;
          const impulse = -(1 + RESTITUTION) * vN * 0.5;
          a.vx += impulse * nx; a.vy += impulse * ny;
          b.vx -= impulse * nx; b.vy -= impulse * ny;
        }
      }

      a.rot += a.vx * 0.18;
      const scale = 0.95 + (a.y / H) * 0.08;
      a.el.style.transform = `translate(-50%, -50%) translate(${a.x}px, ${a.y}px) scale(${scale}) rotate(${a.rot}deg)`;
      a.el.style.opacity = a.dead ? '0' : '1';
      a.el.style.zIndex = String(Math.round(a.y));
    }
  }

  /** Shooting handler */
  function handleArenaClick(e) {
    if (!arenaRef.current) return;
    const r = arenaRef.current.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;

    const items = itemsRef.current;
    let hit = null;
    items.forEach((it) => {
      if (it.dead) return;
      const d = Math.hypot(it.x - x, it.y - y);
      if (d < HIT_RADIUS && !hit) hit = it;
    });

    if (hit) {
      hit.dead = true; hit.vx = 0; hit.vy = 0;
      const id = Date.now();
      setSplashes((s) => [...s, { id, x: hit.x, y: hit.y, dark: !!darkMode }]);
      setTimeout(() => setSplashes((s) => s.filter((sp) => sp.id !== id)), 700);

      // "Rumble" de andre
      items.forEach((o) => {
        if (o === hit || o.dead) return;
        o.vx += (Math.random() - 0.5) * 5.5;
        o.vy += (Math.random() - 0.5) * 5.5;
      });

      if (items.every((i) => i.dead)) triggerWin();
    }
  }

  function triggerWin() {
    setGameWon(true);
    // stopp alt
    itemsRef.current.forEach((it) => { it.vx = 0; it.vy = 0; });
    setTimeout(() => {
      setGameWon(false);
      // reset arena
      initCards();
    }, 2200);
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 relative">
      <div className="max-w-6xl w-full">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-light mb-2" style={{ color: darkMode ? '#fff' : '#0e0e0f' }}>
            {t(language, 'services.title')}
          </h2>
          <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
            {t(language, 'services.subtitle')}
          </p>
        </motion.div>

        <div
          ref={arenaRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleArenaClick}
          className="relative rounded-3xl overflow-hidden mx-auto"
          style={{
            width: '100%',
            height: '600px',
            backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            border: `2px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            cursor: isHovering ? 'crosshair' : 'default',
          }}
        >
          {isHovering && <CrosshairCursor darkMode={!!darkMode} arenaRef={arenaRef} />}

          {/* splash wave */}
          {splashes.map((s) => (
            <motion.div
              key={s.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: s.x, top: s.y, width: 90, height: 90,
                transform: 'translate(-50%,-50%)',
                borderRadius: '50%',
                background: s.dark
                  ? 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* cards */}
          {cards.map((c, i) => (
            <div
              key={c.title}
              ref={(el) => (containerRefs.current[i] = el)}
              className="absolute will-change-transform"
              style={{
                width: `${CARD_W}px`,
                height: `${CARD_H}px`,
                left: 0, top: 0,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            >
              <div
                className="relative rounded-2xl p-6 shadow-lg h-full"
                style={{
                  backgroundColor: darkMode ? '#1a1a1a' : '#fff',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                  }}>{c.icon}</div>
                <h3 className="mt-4 text-lg font-semibold" style={{ color: darkMode ? '#fff' : '#0e0e0f' }}>{c.title}</h3>
                <p className="mt-2 text-sm" style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>{c.desc}</p>
              </div>
            </div>
          ))}

          {/* win overlay */}
          {gameWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center text-4xl font-semibold pointer-events-none"
              style={{ color: darkMode ? '#fff' : '#0e0e0f', textShadow: '0 0 12px rgba(0,0,0,0.2)', zIndex: 9999 }}
            >
              {t(language, 'services.winMessage')}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Crosshair **/
function CrosshairCursor({ darkMode, arenaRef }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function move(e) {
      if (!arenaRef.current) return;
      const r = arenaRef.current.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    }
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [arenaRef]);
  const col = darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)';
  return (
    <div className="absolute pointer-events-none z-50" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%,-50%)' }}>
      <div style={{ width: 24, height: 2, backgroundColor: col, position: 'absolute', left: -12, top: -1 }} />
      <div style={{ width: 2, height: 24, backgroundColor: col, position: 'absolute', left: -1, top: -12 }} />
      <div style={{ width: 8, height: 8, borderRadius: '50%', border: `1px solid ${col}`, position: 'absolute', left: -4, top: -4 }} />
    </div>
  );
}
