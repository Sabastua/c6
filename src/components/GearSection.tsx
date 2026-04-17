'use client';
import { useEffect, useRef } from 'react';

const GEAR = [
  { 
    icon: '🎛️', 
    name: 'Pioneer DDJ-1000', 
    desc: 'Professional 4-channel controller', 
    tag: 'Controller', 
    accent: '#D4AF37',
    videoId: 'hqlX5o5oxn0'
  },
  { 
    icon: '💿', 
    name: 'Serato DJ Pro', 
    desc: 'Industry-leading DJ software', 
    tag: 'Software', 
    accent: '#3DBA6A',
    downloadUrl: 'https://serato.com/dj/pro/downloads',
    videoId: 'kn5sFEf-DjU'
  },
  { 
    icon: '🔊', 
    name: 'Pioneer CDJ-3000', 
    desc: '9-inch touch display media player', 
    tag: 'Deck', 
    accent: '#D4AF37',
    videoId: 'NbXWPBqs2N4'
  },
  { 
    icon: '🎚️', 
    name: 'DJM-900NXS2', 
    desc: '4-channel professional mixer', 
    tag: 'Mixer', 
    accent: '#3DBA6A',
    videoId: 'MgCgPuEbTiY'
  },
  { 
    icon: '🎧', 
    name: 'Sennheiser HD-25', 
    desc: 'Legendary DJ monitoring headphones', 
    tag: 'Audio', 
    accent: '#D4AF37',
    buyUrl: 'https://www.camerasafrica.com/product/sennheiser-hd-25-monitor-headphones/'
  },
  { icon: '🎙️', name: 'Shure SM7B', desc: 'Dynamic mic for live MC sessions', tag: 'Mic', accent: '#3DBA6A' },
];

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12 });
    els?.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

export default function GearSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} style={{ padding: '120px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <div className="reveal" style={{ marginBottom: 56, maxWidth: 560 }}>
        <p className="label" style={{ marginBottom: 12 }}>The Arsenal</p>
        <h2 className="headline">Powered by<br /><span className="text-gold">world-class gear.</span></h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {GEAR.map((g: any, i) => (
          <div
            key={g.name}
            className="glass reveal"
            style={{
              borderRadius: 20, padding: '28px 24px',
              transitionDelay: `${i * 0.07}s`,
              cursor: 'default',
              transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.transform = 'translateY(-4px)';
              el.style.borderColor = g.accent + '40';
              el.style.boxShadow = `0 12px 40px ${g.accent}12`;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.transform = '';
              el.style.borderColor = '';
              el.style.boxShadow = '';
            }}
          >
            {g.videoId ? (
              <div style={{ 
                position: 'relative', 
                width: 'calc(100% + 48px)', 
                margin: '-28px -24px 20px -24px', 
                paddingBottom: '56.25%', 
                overflow: 'hidden',
                background: '#000'
              }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                  src={`https://www.youtube.com/embed/${g.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${g.videoId}&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`}
                  allow="autoplay; encrypted-media"
                />
                <div style={{
                  position: 'absolute', top: 12, right: 24,
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
                  textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100,
                  background: g.accent, color: '#000',
                  zIndex: 2
                }}>
                  {g.tag}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: 28 }}>{g.icon}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
                  textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100,
                  background: g.accent + '18', color: g.accent,
                  border: `1px solid ${g.accent}30`,
                }}>
                  {g.tag}
                </span>
              </div>
            )}
            <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 6, color: '#F5F5F7' }}>{g.name}</p>
            <p className="body-sm" style={{ marginBottom: (g.downloadUrl || g.buyUrl) ? 20 : 0 }}>{g.desc}</p>
            
            <div style={{ marginTop: 'auto' }}>
              {(g.downloadUrl || g.buyUrl) && (
                <a 
                  href={g.downloadUrl || g.buyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '10px 20px',
                    borderRadius: 100,
                    background: g.accent + '15',
                    color: g.accent,
                    border: `1px solid ${g.accent}30`,
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = g.accent;
                    e.currentTarget.style.color = '#000';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${g.accent}40`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = g.accent + '15';
                    e.currentTarget.style.color = g.accent;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {g.downloadUrl ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  )}
                  {g.downloadUrl ? 'Download Pro' : 'Buy Now'}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
