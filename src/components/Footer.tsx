'use client';

const LINKS = [
  { href: '#home',    label: 'Home'    },
  { href: '#request', label: 'Request' },
  { href: '#booking', label: 'Bookings'},
  { href: '#shop',    label: 'Merch'   },
  { href: '#game',    label: 'Game'    },
  { href: '#mixes',   label: 'Mixes'   },
];

const SOCIALS = [
  { href: 'https://instagram.com', icon: 'fab fa-instagram', label: 'IG' },
  { href: 'https://tiktok.com',    icon: 'fab fa-tiktok',    label: 'TT' },
  { href: 'https://soundcloud.com',icon: 'fab fa-soundcloud',label: 'SC' },
  { href: 'https://wa.me/254700000000', icon: 'fab fa-whatsapp', label: 'WA' },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '64px 40px 40px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32, marginBottom: 48 }}>
          <div>
            <p style={{
              fontWeight: 700, fontSize: '1.5rem', letterSpacing: '0.04em',
              marginBottom: 8,
              background: 'linear-gradient(135deg, #D4AF37, #F5D96B, #D4AF37)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>DJ C6</p>
            <p className="body-sm" style={{ maxWidth: 260 }}>
              Nairobi's premium DJ. Every set a story, every beat a memory.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="label" style={{ marginBottom: 16 }}>Quick Links</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LINKS.map(l => (
                <a key={l.href} href={l.href} style={{
                  fontSize: '0.875rem', color: 'rgba(245,245,247,0.45)',
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,245,247,0.45)')}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="label" style={{ marginBottom: 16 }}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '0.875rem', color: 'rgba(245,245,247,0.45)', textDecoration: 'none' }}>
                +254 700 000 000
              </a>
              <a href="mailto:djc6@email.com"
                style={{ fontSize: '0.875rem', color: 'rgba(245,245,247,0.45)', textDecoration: 'none' }}>
                djc6@email.com
              </a>
              <p style={{ fontSize: '0.875rem', color: 'rgba(245,245,247,0.45)' }}>Nairobi, Kenya</p>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="label" style={{ marginBottom: 16 }}>Follow</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  title={s.label}
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(245,245,247,0.5)',
                    textDecoration: 'none', fontSize: 15,
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(212,175,55,0.12)';
                    e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)';
                    e.currentTarget.style.color = '#D4AF37';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.color = 'rgba(245,245,247,0.5)';
                  }}
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 28 }} />

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 11, color: 'rgba(245,245,247,0.25)' }}>
            © {new Date().getFullYear()} DJ C6. All rights reserved.
          </p>
          <p style={{ fontSize: 11, color: 'rgba(245,245,247,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Mix · Book · Vibe
          </p>
        </div>
      </div>
    </footer>
  );
}
