'use client';
import { useEffect, useRef } from 'react';

export default function Preloader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (ref.current) {
        ref.current.style.opacity = '0';
        ref.current.style.pointerEvents = 'none';
        setTimeout(onDone, 700);
      }
    }, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: '#080C08',
        transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Liquid orb */}
      <div
        className="relative mb-10"
        style={{ width: 96, height: 96 }}
      >
        <div
          style={{
            width: '100%', height: '100%',
            background: 'conic-gradient(from 0deg, #3DBA6A, #D4AF37, #3DBA6A)',
            animation: 'spin-slow 3s linear infinite, liquid-move 6s ease-in-out infinite',
            opacity: 0.9,
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backdropFilter: 'blur(6px)' }}
        >
          <span style={{ fontSize: 28 }}>🎧</span>
        </div>
      </div>

      <p
        className="text-gold"
        style={{
          fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.25em',
          textTransform: 'uppercase',
          background: 'linear-gradient(135deg, #D4AF37, #F5D96B, #D4AF37)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}
      >
        DJ C6
      </p>
      <p style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(245,245,247,0.3)', marginTop: 6, textTransform: 'uppercase' }}>
        Loading experience…
      </p>

      {/* Progress line */}
      <div
        className="absolute bottom-0 left-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, #3DBA6A, #D4AF37)',
          animation: 'loadbar 2s ease-in-out forwards',
          width: 0,
        }}
      />
      <style>{`@keyframes loadbar { to { width: 100%; } }`}</style>
    </div>
  );
}
