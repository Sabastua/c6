'use client';
import { useState, useEffect, useRef } from 'react';

const TYPES = [
  { value: 'club',      label: 'Club Night',      icon: '🎉', deposit: 5000  },
  { value: 'private',   label: 'Private Party',   icon: '🥂', deposit: 3000  },
  { value: 'corporate', label: 'Corporate',        icon: '🏢', deposit: 8000  },
  { value: 'wedding',   label: 'Wedding',          icon: '💍', deposit: 7000  },
  { value: 'birthday',  label: 'Birthday',         icon: '🎂', deposit: 2500  },
  { value: 'concert',   label: 'Festival',         icon: '🎪', deposit: 15000 },
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

export default function BookingSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [type, setType] = useState('club');
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', location: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', ok: true });

  const current = TYPES.find(t => t.value === type)!;

  const showToast = (msg: string, ok: boolean) => {
    setToast({ show: true, msg, ok });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 5000);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date) return;
    setLoading(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventType: type, deposit: current.deposit }),
      });
      const d = await res.json();
      if (d.success) {
        showToast(`Booking sent! Pay KES ${current.deposit.toLocaleString()} deposit on your phone.`, true);
        setForm({ name: '', phone: '', email: '', date: '', location: '', notes: '' });
      } else showToast(d.error || 'Failed. Try again.', false);
    } catch { showToast('Network error.', false); }
    finally { setLoading(false); }
  };

  return (
    <section ref={ref} id="booking" style={{
      padding: '120px 40px',
      background: 'rgba(212,175,55,0.015)',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: 56 }}>
          <p className="label" style={{ marginBottom: 12 }}>Get In The Calendar</p>
          <h2 className="headline">
            Book DJ C6.<br />
            <span className="text-gold">Lock your date.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 40, alignItems: 'start' }}
          className="block-grid">

          {/* Event type chips */}
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="label" style={{ marginBottom: 8 }}>Event type</p>
            {TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: 14, cursor: 'pointer',
                  background: type === t.value ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${type === t.value ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.25s',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: type === t.value ? '#D4AF37' : 'rgba(245,245,247,0.6)' }}>
                  {t.icon} {t.label}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: type === t.value ? '#D4AF37' : 'rgba(245,245,247,0.3)',
                }}>
                  KES {t.deposit.toLocaleString()}
                </span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={submit} className="glass reveal" style={{ borderRadius: 24, padding: 36 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 18px', borderRadius: 12, marginBottom: 24,
              background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.18)',
            }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(245,245,247,0.5)' }}>
                {current.icon} {current.label} · Deposit
              </span>
              <span className="text-gold" style={{ fontWeight: 700 }}>
                KES {current.deposit.toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {[
                { label: 'Your Name *', key: 'name', placeholder: 'Full name', type: 'text' },
                { label: 'M-Pesa Phone *', key: 'phone', placeholder: '0712 345 678', type: 'tel' },
                { label: 'Email', key: 'email', placeholder: 'you@email.com', type: 'email' },
                { label: 'Event Date *', key: 'date', placeholder: '', type: 'date' },
              ].map(f => (
                <div key={f.key}>
                  <label className="label" style={{ display: 'block', marginBottom: 7 }}>{f.label}</label>
                  <input
                    className="input" type={f.type} placeholder={f.placeholder}
                    value={(form as any)[f.key]} required={f.label.includes('*')}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label className="label" style={{ display: 'block', marginBottom: 7 }}>Location</label>
              <input className="input" placeholder="Venue / City" value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="label" style={{ display: 'block', marginBottom: 7 }}>Notes</label>
              <textarea className="input" style={{ resize: 'none', minHeight: 80 }}
                placeholder="Preferences, set length, requirements…"
                value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} className="btn btn-gold"
              style={{ width: '100%', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Processing…' : `🔒 Pay KES ${current.deposit.toLocaleString()} Deposit`}
            </button>
            <p style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'rgba(245,245,247,0.3)' }}>
              Secure · Lipa Na M-Pesa STK Push
            </p>
          </form>
        </div>
      </div>

      {/* Toast */}
      <div style={{
        position: 'fixed', bottom: 32, left: '50%',
        transform: toast.show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(80px)',
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
        @media (max-width: 900px) { .block-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
