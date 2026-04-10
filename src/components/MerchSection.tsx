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
  const [loading, setLoading] = useState<number | null>(null);
  const [toast, setToast] = useState({ show: false, msg: '' });

  const buy = async (item: typeof MERCH[0]) => {
    const phone = prompt('Enter M-Pesa number:');
    if (!phone) return;
    setLoading(item.id);
    try {
      const res = await fetch('/api/merch-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: item.name, price: item.price, phone, size: sizes[item.id] || 'N/A' }),
      });
      const d = await res.json();
      if (d.success) {
        setToast({ show: true, msg: `Order sent! Check phone for KES ${item.price.toLocaleString()} M-Pesa prompt.` });
        setTimeout(() => setToast(t => ({ ...t, show: false })), 4500);
      }
    } catch { /* silent */ }
    finally { setLoading(null); }
  };

  return (
    <section ref={ref} id="shop" style={{ padding: '120px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <div className="reveal" style={{ marginBottom: 56 }}>
        <p className="label" style={{ marginBottom: 12 }}>Official Store</p>
        <h2 className="headline">Rep the brand.<br /><span className="text-gold">Shop C6 merch.</span></h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {MERCH.map((item, i) => (
          <div key={item.id} className="glass reveal"
            style={{ borderRadius: 20, overflow: 'hidden', transitionDelay: `${i * 0.08}s` }}>
            {/* Image area */}
            <div style={{
              height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 64, position: 'relative',
              background: `linear-gradient(135deg, ${item.color}10, rgba(255,255,255,0.02))`,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              {item.emoji}
              <span style={{
                position: 'absolute', top: 12, right: 12,
                fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase',
                background: item.color + '20', color: item.color,
                border: `1px solid ${item.color}30`,
              }}>
                {item.tag}
              </span>
            </div>

            <div style={{ padding: '20px 20px 24px' }}>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>{item.name}</p>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: item.color, marginBottom: 14 }}>
                KES {item.price.toLocaleString()}
              </p>

              {/* Sizes */}
              {item.sizes.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  {item.sizes.map(s => (
                    <button key={s} type="button"
                      onClick={() => setSizes({ ...sizes, [item.id]: s })}
                      style={{
                        padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                        cursor: 'pointer',
                        background: sizes[item.id] === s ? item.color + '25' : 'transparent',
                        border: `1px solid ${sizes[item.id] === s ? item.color + '60' : 'rgba(255,255,255,0.1)'}`,
                        color: sizes[item.id] === s ? item.color : 'rgba(245,245,247,0.5)',
                        transition: 'all 0.2s',
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => buy(item)}
                disabled={loading === item.id}
                className="btn"
                style={{
                  width: '100%', padding: '11px 0', borderRadius: 12,
                  background: item.color === '#D4AF37'
                    ? 'linear-gradient(135deg, #B8962E, #D4AF37)'
                    : 'linear-gradient(135deg, #2D9E52, #3DBA6A)',
                  color: '#080C08', fontWeight: 700, fontSize: '0.8rem',
                  opacity: loading === item.id ? 0.6 : 1,
                  cursor: loading === item.id ? 'not-allowed' : 'pointer',
                  boxShadow: `0 4px 16px ${item.color}25`,
                }}
              >
                {loading === item.id ? 'Processing…' : 'Buy Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      <div style={{
        position: 'fixed', bottom: 32, left: '50%',
        transform: toast.show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(80px)',
        opacity: toast.show ? 1 : 0, zIndex: 9000, pointerEvents: 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        background: 'rgba(61,186,106,0.12)', border: '1px solid rgba(61,186,106,0.3)',
        backdropFilter: 'blur(20px)', borderRadius: 12, padding: '14px 24px',
        fontSize: '0.875rem', color: '#F5F5F7', whiteSpace: 'nowrap',
      }}>
        ✓ {toast.msg}
      </div>
    </section>
  );
}
