'use client';
import { useEffect, useRef } from 'react';

const GEAR = [
  { icon: '🎛️', name: 'Pioneer DDJ-1000', desc: 'Professional 4-channel controller', tag: 'Controller', accent: '#D4AF37' },
  { icon: '💿', name: 'Serato DJ Pro', desc: 'Industry-leading DJ software', tag: 'Software', accent: '#3DBA6A' },
  { icon: '🔊', name: 'Pioneer CDJ-3000', desc: '9-inch touch display media player', tag: 'Deck', accent: '#D4AF37' },
  { icon: '🎚️', name: 'DJM-900NXS2', desc: '4-channel professional mixer', tag: 'Mixer', accent: '#3DBA6A' },
  { icon: '🎧', name: 'Sennheiser HD-25', desc: 'Legendary DJ monitoring headphones', tag: 'Audio', accent: '#D4AF37' },
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
        {GEAR.map((g, i) => (
          <div
            key={g.name}
            className="glass reveal"
            style={{
              borderRadius: 20, padding: '28px 24px',
              transitionDelay: `${i * 0.07}s`,
              cursor: 'default',
              transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
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
            <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 6, color: '#F5F5F7' }}>{g.name}</p>
            <p className="body-sm">{g.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
