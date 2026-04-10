'use client';
import { useEffect, useRef } from 'react';

const PARTNERS = [
  { name: 'Spotify', icon: 'fab fa-spotify' },
  { name: 'Apple Music', icon: 'fab fa-apple' },
  { name: 'YouTube', icon: 'fab fa-youtube' },
  { name: 'TikTok', icon: 'fab fa-tiktok' },
  { name: 'SoundCloud', icon: 'fab fa-soundcloud' },
  { name: 'Vimeo', icon: 'fab fa-vimeo-v' },
  { name: 'Red Bull', icon: 'fas fa-bolt', customName: 'Red Bull' },
  { name: 'Greenlabs', icon: 'fas fa-leaf', customName: 'Greenlabs' },
];

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.1 });
    ref.current?.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

export default function PartnersSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} style={{
      padding: '80px 40px',
      background: '#080C08',
      borderBottom: '1px solid rgba(255,255,255,0.03)',
    }}>
      <div className="reveal" style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <p className="label" style={{ marginBottom: 40, color: 'rgba(245,245,247,0.3)', letterSpacing: '0.2em' }}>
          IN PARTNERSHIP WITH
        </p>

        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
          gap: 'clamp(24px, 6vw, 64px)', opacity: 0.7
        }}>
          {PARTNERS.map((p, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: '1.5rem', color: 'rgba(245,245,247,0.6)',
                transition: 'all 0.3s ease', cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = p.name === 'Greenlabs' ? '#3DBA6A' : 
                                              p.name === 'Red Bull' ? '#ff2a2a' :
                                              p.name === 'Spotify' ? '#1DB954' :
                                              '#F5F5F7';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(245,245,247,0.6)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <i className={p.icon} />
              {(p.customName || p.name === 'Apple Music' || p.name === 'Red Bull' || p.name === 'Greenlabs') && (
                <span style={{ 
                  fontSize: '1.1rem', fontWeight: p.name === 'Red Bull' ? 800 : 600, 
                  letterSpacing: '-0.02em',
                  fontFamily: p.name === 'Red Bull' ? 'impact, sans-serif' : 'inherit',
                  textTransform: p.name === 'Red Bull' ? 'uppercase' : 'none'
                }}>
                  {p.customName || p.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
