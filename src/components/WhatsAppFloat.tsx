'use client';

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/254706404928?text=Hi%20DJ%20C6!"
      target="_blank"
      rel="noopener noreferrer"
      title="WhatsApp DJ C6"
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 9990,
        width: 52, height: 52, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(37,211,102,0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(37,211,102,0.4)',
        boxShadow: '0 4px 24px rgba(37,211,102,0.3)',
        color: '#fff', fontSize: 22, textDecoration: 'none',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,211,102,0.5)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(37,211,102,0.3)';
      }}
    >
      <i className="fab fa-whatsapp" />
    </a>
  );
}
