'use client';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { href: '#home',    label: 'Home' },
  { href: '#request', label: 'Request' },
  { href: '#booking', label: 'Bookings' },
  { href: '#shop',    label: 'Merch' },
  { href: '#game',    label: 'Game' },
  { href: '#mixes',   label: 'Mixes' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
          padding: scrolled ? '10px 40px' : '18px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Logo */}
        <a
          href="#home"
          style={{
            fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.06em',
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #D4AF37, #F5D96B, #D4AF37)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}
        >
          DJ C6
        </a>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontSize: '0.875rem', fontWeight: 500,
                color: 'rgba(245,245,247,0.6)',
                textDecoration: 'none', letterSpacing: '0.02em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,245,247,0.6)')}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          <a
            href="#booking"
            className="btn btn-gold"
            style={{ padding: '10px 20px', fontSize: '0.8rem' }}
          >
            Book Me
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden flex flex-col gap-[5px]"
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 1.5,
              background: open && i === 1 ? 'transparent' : 'rgba(245,245,247,0.7)',
              transform: open ? (i === 0 ? 'rotate(45deg) translate(4px,4px)' : i === 2 ? 'rotate(-45deg) translate(4px,-4px)' : '') : '',
              transition: 'all 0.25s',
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 800,
        background: 'var(--nav-bg)', backdropFilter: 'blur(30px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 32,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'opacity 0.35s',
      }}>
        {LINKS.map(l => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
            fontSize: '2rem', fontWeight: 600, color: '#F5F5F7',
            textDecoration: 'none', transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
            onMouseLeave={e => (e.currentTarget.style.color = '#F5F5F7')}
          >
            {l.label}
          </a>
        ))}
        <a href="#booking" onClick={() => setOpen(false)} className="btn btn-gold" style={{ marginTop: 16 }}>
          Book Me
        </a>
      </div>
    </>
  );
}
