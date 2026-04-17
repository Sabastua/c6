'use client';
import { useEffect, useRef } from 'react';
import MindMapBackground from './MindMapBackground';
import HeroBackgroundSwiper from './HeroBackgroundSwiper';

export default function HeroSection() {
  const vizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vizRef.current) return;
    const heights = [20, 35, 55, 45, 60, 40, 70, 50, 38, 62, 28, 48, 55, 35, 22];
    const colors = ['var(--green)', 'var(--gold)', 'var(--green)', 'var(--gold)', 'var(--green)'];
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
      <HeroBackgroundSwiper />
      <MindMapBackground />

      {/* Label pill */}
      <div
        className="glass"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 20px', borderRadius: 100, marginBottom: 32,
          animation: 'fade-in 0.7s 0.2s both',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--green)',
          boxShadow: '0 0 12px var(--green)',
        }} />
        <span className="label">
          Nairobi's Premier DJ Experience
        </span>
      </div>

      {/* Main heading */}
      <h1
        className="display"
        style={{ 
          animation: 'fade-in 1s 0.3s both', 
          marginBottom: 24, 
          maxWidth: 900,
        }}
      >
        <span className="text-gradient">The Sound</span>
        <br />
        <span className="text-gold">You Feel.</span>
      </h1>
      
      <p
        className="body-lg"
        style={{ 
          maxWidth: 540, 
          marginBottom: 48, 
          animation: 'fade-in 1s 0.5s both',
          color: 'var(--text-2)'
        }}
      >
        Experience the fusion of Afrobeats, Amapiano & World Club Anthems. 
        Live song requests and premium event bookings tailored for you.
      </p>

      {/* CTAs */}
      <div style={{
        display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center',
        animation: 'fade-in 1s 0.7s both', marginBottom: 80,
      }}>
        <a href="#request" className="btn btn-gold">
          🎵 Request Song
        </a>
        <a href="#booking" className="btn btn-ghost">
          Book an Event →
        </a>
      </div>

      {/* Equalizer */}
      <div
        ref={vizRef}
        style={{
          display: 'flex', alignItems: 'flex-end', gap: 6,
          height: 80, animation: 'fade-in 1s 0.9s both',
        }}
      />

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        animation: 'fade-in 1s 1.2s both',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
          Explore
        </span>
        <div style={{
          width: 1, height: 60,
          background: 'linear-gradient(to bottom, var(--gold), transparent)',
          opacity: 0.5
        }} />
      </div>
    </section>
  );
}
