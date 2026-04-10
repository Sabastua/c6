'use client';
import { useEffect } from 'react';

export default function CursorGlow() {
  useEffect(() => {
    const el = document.getElementById('cg');
    const move = (e: MouseEvent) => {
      if (el) { el.style.left = `${e.clientX}px`; el.style.top = `${e.clientY}px`; }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      id="cg"
      style={{
        position: 'fixed', width: 400, height: 400, borderRadius: '50%',
        pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(212,175,55,0.035) 0%, transparent 65%)',
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.18s ease, top 0.18s ease',
        left: '-500px', top: '-500px',
      }}
    />
  );
}
