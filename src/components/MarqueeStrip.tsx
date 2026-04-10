'use client';

const ITEMS = [
  'Pioneer CDJ-3000', 'Serato DJ Pro', 'Afrobeats',
  'Amapiano', 'DJM-900NXS2', 'DJ C6', 'Hip Hop',
  'Dancehall', 'Live Mixes', 'Nairobi',
];
const DUPED = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

export default function MarqueeStrip() {
  return (
    <div style={{
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      padding: '14px 0',
      background: 'rgba(255,255,255,0.015)',
    }}>
      <div style={{
        display: 'flex', gap: 48, whiteSpace: 'nowrap',
        animation: 'marquee 30s linear infinite',
      }}>
        {DUPED.map((item, i) => (
          <span key={i} style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: i % 2 === 0 ? 'rgba(212,175,55,0.45)' : 'rgba(245,245,247,0.18)',
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
