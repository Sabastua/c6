import { useEffect, useRef, useState } from 'react';



const MIXES = [
  { 
    id: 'QAf6rFG3dYE', 
    title: 'AFRO-VIBES LIVE 2024', 
    list: 'RDQAf6rFG3dYE',
    description: 'A premium selection of the best Afro-house and Piano tracks.' 
  },
  { 
    id: '8vFiZSsfDp8', 
    title: 'LATEST LIVE VIBES 2024', 
    list: 'RD8vFiZSsfDp8',
    description: 'The freshest Afrobeats, Amapiano & Gengetone set.' 
  },
  { 
    id: 'R3tMb9myF00', 
    title: 'URBAN CLUB ANTHEMS', 
    list: 'RDR3tMb9myF00',
    description: 'High-energy club bangers and throwback classics.' 
  },
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

  const [tippingId, setTippingId] = useState<string | null>(null);
  const [form, setForm] = useState({ phone: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', ok: true });

  const showToast = (msg: string, ok: boolean) => {
    setToast({ show: true, msg, ok });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const handleTip = async (e: React.FormEvent, mixTitle: string) => {
    e.preventDefault();
    if (!form.phone || !form.amount) return;
    setLoading(true);

    try {
      const res = await fetch('/api/tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, mixTitle }),
      });
      const data = await res.json();

      if (data.success) {
        showToast('STK Push sent! Please check your phone.', true);
        setTippingId(null);
        setForm({ phone: '', amount: '' });
      } else {
        showToast(data.error || 'Failed to send STK push.', false);
      }
    } catch (err) {
      showToast('Connection error. Try again.', false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={ref} id="mixes" style={{ padding: '120px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <div className="reveal" style={{ marginBottom: 64, textAlign: 'center' }}>
        <p className="label" style={{ marginBottom: 16 }}>Listen &amp; Discover</p>
        <h2 className="headline">
          <span className="text-gradient">Latest mixes.</span><br />
          <span className="text-gold">Always fresh.</span>
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'start' }}
        className="block-grid">

        {/* Mixes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
          {/* Featured Mix */}
          {MIXES.slice(0, 1).map((mix) => (
            <div key={mix.id} className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="glass-card" style={{ borderRadius: 32, padding: 12 }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: 24, overflow: 'hidden', background: '#000' }}>
                  <iframe
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    src={`https://www.youtube.com/embed/${mix.id}?list=${mix.list}`}
                    title={mix.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <p className="label" style={{ marginBottom: 6 }}>Featured Set</p>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 8, letterSpacing: '-0.03em' }}>{mix.title}</h3>
                  <p className="body-sm" style={{ color: 'var(--text-2)' }}>{mix.description}</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button 
                    onClick={() => {
                      setTippingId(mix.id);
                      setForm({ phone: '', amount: '' });
                    }}
                    className="btn btn-ghost"
                    style={{ padding: '14px 24px' }}
                  >
                    💰 Tip DJ
                  </button>
                  <a href="https://www.youtube.com/@djc6_ke" target="_blank" rel="noopener noreferrer"
                    className="btn btn-gold" style={{ padding: '14px 28px' }}>
                    <i className="fab fa-youtube" style={{ fontSize: '1.2rem' }}></i>
                    Subscribe
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Secondary Mixes Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: 32 
          }}>
            {MIXES.slice(1).map((mix, idx) => (
              <div key={mix.id} className="reveal" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 16,
                animationDelay: `${(idx + 1) * 0.1}s` 
              }}>
                <div className="glass-card" style={{ borderRadius: 24, padding: 8 }}>
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: 16, overflow: 'hidden', background: '#000' }}>
                    <iframe
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      src={`https://www.youtube.com/embed/${mix.id}?list=${mix.list}`}
                      title={mix.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>{mix.title}</h4>
                  <p className="body-sm" style={{ color: 'var(--text-3)', fontSize: '0.85rem', marginBottom: 12 }}>{mix.description}</p>
                  <button 
                    onClick={() => {
                      setTippingId(mix.id);
                      setForm({ phone: '', amount: '' });
                    }}
                    style={{
                      background: 'none', border: 'none', color: 'var(--gold)', 
                      fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0,
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}
                  >
                    💰 Tip for this mix
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="reveal">
          <div className="glass-card" style={{ borderRadius: 28, padding: 32 }}>
            <p className="label" style={{ marginBottom: 24 }}>Upcoming Shows</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {SHOWS.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  paddingBottom: 16,
                  borderBottom: i < SHOWS.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 800,
                    color: 'var(--gold)', minWidth: 50, textAlign: 'center',
                    padding: '6px 10px', borderRadius: 8, background: 'var(--gold-dim)'
                  }}>{s.date}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{s.venue}</p>
                    <p className="body-sm" style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{s.location}</p>
                  </div>
                  <a href="#booking" style={{
                    fontSize: 11, fontWeight: 700, color: 'var(--gold)', 
                    textDecoration: 'none', letterSpacing: '0.05em',
                  }}>BOOK</a>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ borderRadius: 28, padding: 32 }}>
            <p className="label" style={{ marginBottom: 16 }}>About DJ C6</p>
            <p className="body-sm" style={{ lineHeight: 1.8, color: 'var(--text-2)' }}>
              Nairobi's premier DJ, blending Afrobeats, Amapiano, Hip Hop &amp; Gengetone.{' '}
              <span className="text-gold" style={{ fontWeight: 700, WebkitTextFillColor: 'unset', background: 'none' }}>Pure energy, every time.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tip Modal */}
      {tippingId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10000, padding: 24, animation: 'fade-in 0.3s'
        }} onClick={() => setTippingId(null)}>
          <form 
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => handleTip(e, MIXES.find(m => m.id === tippingId)?.title || '')}
            className="glass"
            style={{
              width: '100%', maxWidth: 400, padding: 40, borderRadius: 32,
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative'
            }}
          >
            <button 
              type="button"
              onClick={() => setTippingId(null)}
              style={{
                position: 'absolute', top: 20, right: 20,
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                fontSize: 24, cursor: 'pointer'
              }}
            >
              ×
            </button>

            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ 
                width: 64, height: 64, background: 'var(--gold-dim)', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', margin: '0 auto 20px', color: 'var(--gold)',
                fontSize: 28
              }}>
                💰
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Tip for the Mix</h3>
              <p className="body-sm" style={{ color: 'var(--text-3)' }}>
                Directly support the movement via M-Pesa.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
              <div>
                <label className="label" style={{ marginBottom: 8, display: 'block' }}>M-Pesa Phone Number</label>
                <input 
                  type="tel" placeholder="07XX XXX XXX" className="input" 
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  required autoFocus
                />
              </div>
              <div>
                <label className="label" style={{ marginBottom: 8, display: 'block' }}>Amount (KES)</label>
                <input 
                  type="number" placeholder="100" className="input" 
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
            </div>

            <button disabled={loading} type="submit" className="btn btn-gold" style={{ width: '100%', height: 56 }}>
              {loading ? 'Processing...' : 'Send M-Pesa Tip'}
            </button>
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
              Secure Payment via M-Pesa Daraja
            </p>
          </form>
        </div>
      )}



      {/* Tip Toast */}
      <div style={{
        position: 'fixed', bottom: 32, left: '50%',
        transform: toast.show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(80px)',
        opacity: toast.show ? 1 : 0, zIndex: 9999, pointerEvents: 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        background: toast.ok ? 'rgba(61,186,106,0.15)' : 'rgba(212,55,55,0.15)',
        border: `1px solid ${toast.ok ? 'rgba(61,186,106,0.4)' : 'rgba(212,55,55,0.4)'}`,
        backdropFilter: 'blur(20px)', borderRadius: 12, padding: '14px 24px',
        fontSize: '0.875rem', color: '#F5F5F7', whiteSpace: 'nowrap',
      }}>
        {toast.ok ? '✓ ' : '✕ '}{toast.msg}
      </div>

      <style>{`@media(max-width:760px){.block-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
