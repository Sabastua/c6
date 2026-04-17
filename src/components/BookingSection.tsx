'use client';
import { useState, useEffect, useRef } from 'react';

const TYPES = [
  { value: 'club',      label: 'Club Night',      icon: '🎉', rate: 5000,  deposit: 5000  },
  { value: 'private',   label: 'Private Party',   icon: '🥂', rate: 3000,  deposit: 3000  },
  { value: 'corporate', label: 'Corporate',        icon: '🏢', rate: 8000,  deposit: 8000  },
  { value: 'wedding',   label: 'Wedding',          icon: '💍', rate: 7000,  deposit: 7000  },
  { value: 'birthday',  label: 'Birthday',         icon: '🎂', rate: 2500,  deposit: 2500  },
  { value: 'concert',   label: 'Festival',         icon: '🎪', rate: 15000, deposit: 15000 },
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
  const [form, setForm] = useState({ clientName: '', phone: '', email: '', date: '', location: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', ok: true });

  const current = TYPES.find(t => t.value === type)!;

  const showToast = (msg: string, ok: boolean) => {
    setToast({ show: true, msg, ok });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 5000);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName || !form.phone || !form.date) return;
    setLoading(true);

    try {
      // 1. Optional backend notification (keeps records)
      const res = await fetch('/api/booking', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventType: type, rate: current.rate, deposit: current.deposit }),
      });
      
      // 2. WhatsApp Direct Redirect (User sends the message to DJ)
      const waMessage = [
        `*New Booking Request for DJ C6*`,
        ``,
        `*Name:* ${form.clientName}`,
        `*Phone:* ${form.phone}`,
        `*Email:* ${form.email || 'N/A'}`,
        `*Event Type:* ${current.label}`,
        `*Hourly Rate:* KES ${current.rate.toLocaleString()} / hr`,
        `*Date:* ${form.date}`,
        `*Location:* ${form.location || 'TBD'}`,
        `*Notes:* ${form.notes || 'None'}`,
        ``,
        `_I'm ready to lock this date!_`
      ].join('\n');

      const encodedMsg = encodeURIComponent(waMessage);
      const whatsappUrl = `https://wa.me/254706404928?text=${encodedMsg}`;
      
      // We open WhatsApp and also show a success toast
      window.open(whatsappUrl, '_blank');
      
      showToast(`Redirecting to WhatsApp to finalize booking...`, true);
      setForm({ clientName: '', phone: '', email: '', date: '', location: '', notes: '' });

    } catch (err) { 
      showToast('Something went wrong. Please try again.', false); 
    } finally { 
      setLoading(false); 
    }
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
                  KES {t.rate.toLocaleString()} / hr
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
                {current.icon} {current.label} · Hourly Rate
              </span>
              <span className="text-gold" style={{ fontWeight: 700 }}>
                KES {current.rate.toLocaleString()} / hr
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {[
                { label: 'Your Name *', key: 'clientName', placeholder: 'Full name', type: 'text' },
                { label: 'Phone Number *', key: 'phone', placeholder: '0712 345 678', type: 'tel' },
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
              style={{ width: '100%', opacity: loading ? 0.6 : 1, gap: 10 }}>
              {loading ? 'Processing…' : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.948.517 2.039.888 3.144.889 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.765-5.766-5.766zm3.383 8.356c-.145.407-.722.753-1.021.796-.28.041-.634.07-.991-.044-.233-.075-.529-.12-1.144-.383-1.616-.69-2.659-2.333-2.739-2.44-.081-.106-.659-.876-.659-1.673 0-.797.411-1.188.557-1.348.145-.16.317-.188.423-.188.106 0 .211.001.304.006.098.005.231-.036.363.284.145.354.489 1.189.531 1.277.042.089.07.191.011.311-.059.12-.089.191-.177.301-.088.11-.19.245-.271.332-.098.106-.199.222-.086.417.114.195.505.834 1.085 1.35.748.665 1.379.871 1.573.968.195.097.309.081.423-.049.115-.13.489-.568.619-.762.13-.195.259-.163.438-.097.178.065 1.137.537 1.332.634.195.098.324.146.372.228.049.081.049.467-.096.874zM12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm0 20c-4.963 0-9-4.037-9-9s4.037-9 9-9 9 4.037 9 9-4.037 9-9 9z"/>
                  </svg>
                  Book via WhatsApp
                </>
              )}
            </button>
            <p style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'rgba(245,245,247,0.3)' }}>
              Instant Confirmation · Send to WhatsApp
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
