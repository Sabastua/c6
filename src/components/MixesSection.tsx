'use client';
import { useEffect, useRef } from 'react';

const MIXES = [
  { title: 'Afrobeats Takeover Vol. 3', genre: 'Afrobeats', date: 'Mar 2025', plays: '12.4K', dur: '58:22', color: '#D4AF37' },
  { title: 'Amapiano Wave',             genre: 'Amapiano',  date: 'Feb 2025', plays: '8.9K',  dur: '1:12:04', color: '#3DBA6A' },
  { title: 'Friday Night Vibes',        genre: 'Mixed',     date: 'Jan 2025', plays: '21.3K', dur: '45:11', color: '#D4AF37' },
];

const SHOWS = [
  { date: 'APR 18', venue: 'Alchemist Bar', location: 'Westlands' },
  { date: 'APR 25', venue: 'DusitD2 Hotel', location: 'Lavington' },
  { date: 'MAY 3',  venue: 'K1 Klub House', location: 'Karen'     },
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

export default function MixesSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="mixes" style={{ padding: '120px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <div className="reveal" style={{ marginBottom: 56 }}>
        <p className="label" style={{ marginBottom: 12 }}>Listen &amp; Discover</p>
        <h2 className="headline">Latest mixes.<br /><span className="text-gold">Always fresh.</span></h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'start' }}
        className="block-grid">

        {/* Mixes list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="reveal">
          {MIXES.map((m, i) => (
            <div key={i} className="glass" style={{
              borderRadius: 16, padding: '20px 22px',
              display: 'flex', alignItems: 'center', gap: 18,
              transition: 'border-color 0.25s, transform 0.25s', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = m.color + '40'; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: m.color + '18', border: `1px solid ${m.color}30`, fontSize: 18,
              }}>▶</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {m.title}
                </p>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'rgba(245,245,247,0.38)', fontWeight: 500 }}>
                  <span>{m.genre}</span><span>·</span><span>{m.date}</span><span>·</span><span>{m.dur}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: m.color }}>{m.plays}</p>
                <p style={{ fontSize: 10, color: 'rgba(245,245,247,0.3)', marginTop: 2 }}>plays</p>
              </div>
            </div>
          ))}

          <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer"
            className="btn btn-ghost" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
            All mixes on SoundCloud →
          </a>
        </div>

        {/* Upcoming + Bio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="reveal">
          <div className="glass" style={{ borderRadius: 20, padding: 24 }}>
            <p className="label" style={{ marginBottom: 16 }}>Upcoming Shows</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SHOWS.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '10px 0',
                  borderBottom: i < SHOWS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                    color: '#D4AF37', minWidth: 44,
                  }}>{s.date}</span>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{s.venue}</p>
                    <p className="body-sm" style={{ fontSize: '0.75rem' }}>{s.location}</p>
                  </div>
                  <a href="#booking" style={{
                    marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                    color: '#D4AF37', textDecoration: 'none', letterSpacing: '0.06em',
                  }}>Book →</a>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="glass" style={{ borderRadius: 20, padding: 24 }}>
            <p className="label" style={{ marginBottom: 12 }}>About DJ C6</p>
            <p className="body-sm" style={{ lineHeight: 1.7 }}>
              Nairobi's premier DJ, blending Afrobeats, Amapiano, Hip Hop &amp; Gengetone.{' '}
              7+ years, 200+ events. One mission:{' '}
              <span style={{ color: '#D4AF37', fontWeight: 500 }}>make you feel every beat.</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:760px){.block-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
