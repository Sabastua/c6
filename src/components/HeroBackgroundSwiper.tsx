'use client';

import { useState, useEffect } from 'react';

// Unsplash placeholders representing DJ life, controllers, and software
const BACKGROUNDS = [
  'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2600&auto=format&fit=crop', // CDJ / Controller
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2600&auto=format&fit=crop', // Studio / Software
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2600&auto=format&fit=crop', // Vinyl / DJ
];

export default function HeroBackgroundSwiper() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((curr) => (curr + 1) % BACKGROUNDS.length);
    }, 6000); // Crossfade every 6 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: -3,
      backgroundColor: 'var(--bg)',
      overflow: 'hidden'
    }}>
      {BACKGROUNDS.map((src, i) => {
        const isActive = i === index;
        return (
          <div
            key={src}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: isActive ? 0.3 : 0,  // Low opacity so it acts as subtle background
              transform: isActive ? 'scale(1.05)' : 'scale(1.0)', // Subtle zoom in Ken-Burns effect
              transition: 'opacity 2s ease-in-out, transform 8s ease-out',
              pointerEvents: 'none'
            }}
          />
        );
      })}
      
      {/* Gradient Overlay to fade into the black theme seamlessly */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, var(--bg-gradient-top) 0%, var(--bg) 100%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle, var(--bg-transparent) 0%, var(--bg-opaque) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
