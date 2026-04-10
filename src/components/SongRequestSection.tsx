'use client';
import { useState, useEffect, useRef } from 'react';

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.1 });
    ref.current?.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

export default function SongRequestSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [form, setForm] = useState({ name: '', phone: '', song: '', artist: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', ok: true });

  const showToast = (msg: string, ok: boolean) => {
    setToast({ show: true, msg, ok });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 4500);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.song || !form.amount) return;
    setLoading(true);
    try {
      const res = await fetch('/api/song-request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (d.success) {
        showToast('STK Push sent — approve on your phone to complete.', true);
        setForm({ name: '', phone: '', song: '', artist: '', amount: '' });
      } else showToast(d.error || 'Failed. Try again.', false);
    } catch { showToast('Network error.', false); }
    finally { setLoading(false); }
  };

  return (
    <section ref={ref} id="request" style={{ padding: '120px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}
        className="block-grid">

        {/* Left */}
        <div className="reveal">
          <p className="label" style={{ marginBottom: 12 }}>Lipa Na M-Pesa</p>
          <h2 className="headline" style={{ marginBottom: 20 }}>
            Request a song.<br />
            <span className="text-green">Instantly.</span>
          </h2>
          <p className="body-lg" style={{ marginBottom: 32 }}>
            Fill in the details, pay an amount of your choice via Safaricom M-Pesa, and your request hits my WhatsApp live.
          </p>

          {/* How it works */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { step: '01', text: 'Enter your name, phone & song' },
              { step: '02', text: 'Tap "Pay" — STK Push lands on your phone' },
              { step: '03', text: 'Enter M-Pesa PIN. Done.' },
            ].map(s => (
              <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{
                  fontWeight: 700, fontSize: 11, letterSpacing: '0.1em',
                  color: '#D4AF37', minWidth: 28,
                }}>{s.step}</span>
                <span className="body-sm" style={{ color: 'rgba(245,245,247,0.5)' }}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="glass reveal" style={{ borderRadius: 24, padding: 36 }}>
          {/* Amount Input */}
          <div style={{ marginBottom: 20 }}>
            <label className="label" style={{ display: 'block', marginBottom: 8 }}>Amount (KES) *</label>
            <input className="input" type="number" min="1" placeholder="e.g. 200" value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })} required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 8 }}>Your Name *</label>
              <input className="input" placeholder="Full name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 8 }}>M-Pesa Phone *</label>
              <input className="input" placeholder="0712 345 678" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: 8 }}>Song *</label>
                <input className="input" placeholder="Song title" value={form.song}
                  onChange={e => setForm({ ...form, song: e.target.value })} required />
              </div>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: 8 }}>Artist</label>
                <input className="input" placeholder="Artist" value={form.artist}
                  onChange={e => setForm({ ...form, artist: e.target.value })} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-green"
            style={{ width: '100%', marginTop: 24, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Processing…' : `📱 Pay KES ${form.amount || '0'} via M-Pesa`}
          </button>
        </form>
      </div>

      {/* Toast */}
      <div style={{
        position: 'fixed', bottom: 32, left: '50%', transform: toast.show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(80px)',
        opacity: toast.show ? 1 : 0, zIndex: 9000, pointerEvents: 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        background: toast.ok ? 'rgba(61,186,106,0.12)' : 'rgba(212,55,55,0.12)',
        border: `1px solid ${toast.ok ? 'rgba(61,186,106,0.3)' : 'rgba(212,55,55,0.3)'}`,
        backdropFilter: 'blur(20px)', borderRadius: 12, padding: '14px 24px',
        fontSize: '0.875rem', color: '#F5F5F7', whiteSpace: 'nowrap',
      }}>
        {toast.ok ? '✓ ' : '✕ '}{toast.msg}
      </div>

      <style>{`
        @media (max-width: 768px) { .block-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
      `}</style>
    </section>
  );
}
