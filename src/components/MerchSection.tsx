'use client';
import { useEffect, useRef, useState } from 'react';

const MERCH = [
  { id: 1, name: 'C6 Hoodie',      price: 2800, emoji: '🧥', color: '#D4AF37', sizes: ['S','M','L','XL','XXL'], tag: 'Bestseller' },
  { id: 2, name: 'C6 Snapback',    price: 1500, emoji: '🧢', color: '#3DBA6A', sizes: ['One Size'],             tag: 'New'       },
  { id: 3, name: 'C6 Graphic Tee', price: 1800, emoji: '👕', color: '#D4AF37', sizes: ['S','M','L','XL'],       tag: 'Limited'   },
  { id: 4, name: 'Sticker Pack',   price: 400,  emoji: '🎨', color: '#3DBA6A', sizes: [],                       tag: 'Fan Fave'  },
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

export default function MerchSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [sizes, setSizes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [buyingItem, setBuyingItem] = useState<typeof MERCH[0] | null>(null);
  const [phone, setPhone] = useState('');
  const [toast, setToast] = useState({ show: false, msg: '', ok: true });

  const showToast = (msg: string, ok: boolean) => {
    setToast({ show: true, msg, ok });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 5000);
  };

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyingItem || !phone) return;
    setLoading(true);
    try {
      const res = await fetch('/api/merch-order', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          itemName: buyingItem.name, 
          price: buyingItem.price, 
          phone, 
          size: sizes[buyingItem.id] || 'N/A' 
        }),
      });
      const d = await res.json();
      if (d.success) {
        showToast(`Order sent! Check phone for KES ${buyingItem.price.toLocaleString()} payment.`, true);
        setBuyingItem(null);
        setPhone('');
      } else {
        showToast(d.error || 'Checkout failed.', false);
      }
    } catch { 
      showToast('Network error.', false);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <section ref={ref} id="shop" style={{ padding: '120px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div className="reveal" style={{ marginBottom: 64 }}>
        <p className="label" style={{ marginBottom: 16 }}>Official Store</p>
        <h2 className="headline"><span className="text-gradient">Rep the brand.</span><br /><span className="text-gold">Shop C6 merch.</span></h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {MERCH.map((item, i) => (
          <div key={item.id} className="glass-card reveal"
            style={{ borderRadius: 28, overflow: 'hidden', transitionDelay: `${i * 0.1}s` }}>
            <div style={{
              height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 80, position: 'relative',
              background: `linear-gradient(135deg, ${item.color}08, transparent)`,
              borderBottom: '1px solid var(--border)',
            }}>
              <span className="anim-float">{item.emoji}</span>
              <span style={{
                position: 'absolute', top: 16, right: 16,
                fontSize: 10, fontWeight: 800, letterSpacing: '0.15em',
                padding: '6px 14px', borderRadius: 100, textTransform: 'uppercase',
                background: item.color + '20', color: item.color,
                border: `1px solid ${item.color}40`,
              }}>
                {item.tag}
              </span>
            </div>

            <div style={{ padding: 32 }}>
              <p style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 8 }}>{item.name}</p>
              <p style={{ fontWeight: 800, fontSize: '1.5rem', color: item.color, marginBottom: 20 }}>
                KES {item.price.toLocaleString()}
              </p>

              {/* Sizes */}
              {item.sizes.length > 0 && (
                <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                  {item.sizes.map(s => (
                    <button key={s} type="button"
                      onClick={() => setSizes({ ...sizes, [item.id]: s })}
                      style={{
                        padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                        cursor: 'pointer',
                        background: sizes[item.id] === s ? 'var(--text-1)' : 'transparent',
                        border: `1px solid ${sizes[item.id] === s ? 'var(--text-1)' : 'var(--border)'}`,
                        color: sizes[item.id] === s ? '#000' : 'var(--text-3)',
                        transition: 'all 0.3s var(--ease)',
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setBuyingItem(item)}
                className="btn"
                style={{
                  width: '100%', padding: '16px 0', borderRadius: 100,
                  background: item.color === '#D4AF37'
                    ? 'linear-gradient(135deg, #D4AF37, #B8962E)'
                    : 'linear-gradient(135deg, #32D74B, #2D9E52)',
                  color: '#000', fontWeight: 800, fontSize: '0.9rem',
                  boxShadow: `0 10px 20px -5px ${item.color}40`,
                }}
              >
                Add to Cart • Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Merch Modal */}
      {buyingItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10000, padding: 24, animation: 'fade-in 0.3s'
        }} onClick={() => setBuyingItem(null)}>
          <form 
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleBuy}
            className="glass"
            style={{
              width: '100%', maxWidth: 420, padding: 48, borderRadius: 32,
              border: '1px solid var(--border)',
              position: 'relative'
            }}
          >
            <button 
              type="button"
              onClick={() => setBuyingItem(null)}
              style={{
                position: 'absolute', top: 24, right: 24,
                background: 'none', border: 'none', color: 'var(--text-3)',
                fontSize: 28, cursor: 'pointer'
              }}
            >
              ×
            </button>

            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ 
                width: 72, height: 72, background: `${buyingItem.color}15`, 
                borderRadius: '24px', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', margin: '0 auto 20px', color: buyingItem.color,
                fontSize: 32
              }}>
                {buyingItem.emoji}
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Checkout</h3>
              <p className="body-sm" style={{ color: 'var(--text-3)' }}>
                You are purchasing: <span style={{ color: 'var(--text-1)', fontWeight: 700 }}>{buyingItem.name}</span>
                {sizes[buyingItem.id] ? ` (${sizes[buyingItem.id]})` : ''}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
              <div>
                <label className="label" style={{ marginBottom: 12, display: 'block' }}>M-Pesa Number</label>
                <input 
                  type="tel" placeholder="07XX XXX XXX" className="input" 
                  value={phone} onChange={e => setPhone(e.target.value)}
                  required autoFocus
                />
              </div>
              <div style={{ 
                padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)', display: 'flex', 
                justifyContent: 'space-between', alignItems: 'center' 
              }}>
                <span className="label">Total to Pay</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: buyingItem.color }}>
                  KES {buyingItem.price.toLocaleString()}
                </span>
              </div>
            </div>

            <button disabled={loading} type="submit" className="btn btn-gold" style={{ 
              width: '100%', height: 60, fontSize: '1rem',
              background: buyingItem.color === '#D4AF37'
                ? 'linear-gradient(135deg, #D4AF37, #B8962E)'
                : 'linear-gradient(135deg, #32D74B, #2D9E52)',
            }}>
              {loading ? 'Processing...' : 'Lipa Na M-Pesa'}
            </button>
          </form>
        </div>
      )}

      {/* Toast */}
      <div style={{
        position: 'fixed', bottom: 32, left: '50%',
        transform: toast.show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(80px)',
        opacity: toast.show ? 1 : 0, zIndex: 9000, pointerEvents: 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        background: toast.ok ? 'rgba(61,186,106,0.15)' : 'rgba(212,55,55,0.15)',
        border: `1px solid ${toast.ok ? 'rgba(61,186,106,0.4)' : 'rgba(212,55,55,0.4)'}`,
        backdropFilter: 'blur(20px)', borderRadius: 12, padding: '14px 24px',
        fontSize: '0.875rem', color: '#F5F5F7', whiteSpace: 'nowrap',
      }}>
        {toast.ok ? '✓ ' : '✕ '}{toast.msg}
      </div>
    </section>
  );
}
