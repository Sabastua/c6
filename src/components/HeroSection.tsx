'use client';
import { useEffect, useRef } from 'react';
import MindMapBackground from './MindMapBackground';
import HeroBackgroundSwiper from './HeroBackgroundSwiper';

export default function HeroSection() {
  const vizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vizRef.current) return;
    const heights = [20, 35, 55, 45, 60, 40, 70, 50, 38, 62, 28, 48, 55, 35, 22];
    const colors = ['#3DBA6A', '#D4AF37', '#3DBA6A', '#D4AF37', '#5AE68C'];
    const frags: HTMLDivElement[] = [];
    heights.forEach((h, i) => {
      const bar = document.createElement('div');
      bar.style.cssText = `
        width: 3px; border-radius: 2px; transform-origin: bottom;
        background: ${colors[i % colors.length]};
        opacity: ${0.4 + (i % 3) * 0.2};
        animation: eq ${0.6 + (i % 5) * 0.18}s ease-in-out ${i * 0.07}s infinite alternate;
        height: ${h}px;
      `;
      vizRef.current!.appendChild(bar);
      frags.push(bar);
    });
    return () => frags.forEach(b => b.remove());
  }, []);

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Layers */}
      <HeroBackgroundSwiper />
      <MindMapBackground />

      {/* Subtle ambient blobs */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(61,186,106,0.06) 0%, transparent 70%)',
        top: '10%', left: '50%', transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)',
        bottom: '15%', right: '10%', pointerEvents: 'none',
      }} />

      {/* Label pill */}
      <div
        className="glass"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '7px 16px', borderRadius: 100, marginBottom: 32,
          animation: 'fade-in 0.7s 0.2s both',
        }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#3DBA6A',
          boxShadow: '0 0 8px #3DBA6A',
        }} />
        <span className="label" style={{ color: 'rgba(245,245,247,0.5)' }}>
          Nairobi's Premier DJ
        </span>
      </div>

      {/* Main heading */}
      <h1
        className="display"
        style={{ 
          animation: 'fade-in 0.8s 0.4s both', 
          marginBottom: 24, 
          maxWidth: 780,
        }}
      >
        The Sound
        <br />
        <span 
          style={{ 
            color: '#D4AF37',
            display: 'inline-block',
            animation: 'pulse-glow 3s infinite alternate ease-in-out',
          }}
        >
          You Feel.
        </span>
      </h1>
      
      {/* Dynamic Keyframes injected dynamically just for the glow */}
      <style>{`
        @keyframes pulse-glow {
          0% { text-shadow: 0 0 20px rgba(212, 175, 55, 0.1); transform: scale(1); }
          100% { text-shadow: 0 0 40px rgba(212, 175, 55, 0.6); transform: scale(1.02); }
        }
      `}</style>

      <p
        className="body-lg"
        style={{ maxWidth: 480, marginBottom: 40, animation: 'fade-in 0.8s 0.6s both' }}
      >
        Request a song live, book your next event, or just vibe. DJ C6 — blending Afrobeats, Amapiano &amp; more.
      </p>

      {/* CTAs */}
      <div style={{
        display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
        animation: 'fade-in 0.8s 0.8s both', marginBottom: 64,
        position: 'relative', zIndex: 10,
      }}>
        <a href="#request" className="btn btn-gold" style={{
          boxShadow: '0 0 20px rgba(212,175,55,0.4)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 0 30px rgba(212,175,55,0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(212,175,55,0.4)';
        }}>
          🎵 Request Song
        </a>
        <a href="#booking" className="btn btn-ghost" style={{
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
          e.currentTarget.style.borderColor = '#3DBA6A';
          e.currentTarget.style.color = '#3DBA6A';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.borderColor = '';
          e.currentTarget.style.color = '';
        }}>
          Book an Event →
        </a>
      </div>

      {/* Equalizer */}
      <div
        ref={vizRef}
        style={{
          display: 'flex', alignItems: 'flex-end', gap: 5,
          height: 70, animation: 'fade-in 0.8s 1s both',
        }}
      />

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        animation: 'fade-in 0.8s 1.4s both',
      }}>
        <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,245,247,0.25)' }}>
          Scroll
        </span>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(to bottom, rgba(212,175,55,0.5), transparent)',
        }} />
      </div>
    </section>
  );
}
