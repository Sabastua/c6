'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const EMOJIS = ['🎧','💿','🎛️','🎚️','🎤','🔊','🎵','🎶'];
const ALL = [...EMOJIS, ...EMOJIS];
function shuffle<T>(a: T[]) { return [...a].sort(() => Math.random() - 0.5); }
type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.1 });
    ref.current?.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

export default function GameSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [scores, setScores] = useState<{ moves: number; time: number }[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const init = useCallback(() => {
    setCards(shuffle(ALL).map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false })));
    setFlipped([]); setMatched(0); setMoves(0); setTime(0);
    setStarted(false); setDone(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => { init(); const s = localStorage.getItem('c6_scores'); if (s) setScores(JSON.parse(s)); }, [init]);
  useEffect(() => {
    if (started && !done) { timerRef.current = setInterval(() => setTime(t => t + 1), 1000); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, done]);
  useEffect(() => {
    if (matched === EMOJIS.length && matched > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDone(true);
      const ns = [...scores, { moves, time }].sort((a, b) => a.moves - b.moves || a.time - b.time).slice(0, 5);
      setScores(ns); localStorage.setItem('c6_scores', JSON.stringify(ns));
    }
  }, [matched]);

  const flip = (idx: number) => {
    if (!started) setStarted(true);
    if (flipped.length === 2 || cards[idx].matched || cards[idx].flipped) return;
    const next = [...flipped, idx];
    setCards(c => c.map((x, i) => i === idx ? { ...x, flipped: true } : x));
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = next;
      if (cards[a].emoji === cards[b].emoji) {
        setTimeout(() => {
          setCards(c => c.map((x, i) => next.includes(i) ? { ...x, matched: true } : x));
          setFlipped([]); setMatched(m => m + 1);
        }, 350);
      } else {
        setTimeout(() => {
          setCards(c => c.map((x, i) => next.includes(i) ? { ...x, flipped: false } : x));
          setFlipped([]);
        }, 800);
      }
    }
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <section ref={ref} id="game" style={{
      padding: '120px 40px',
      background: 'rgba(61,186,106,0.012)',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: 48 }}>
          <p className="label" style={{ marginBottom: 12 }}>Beat Memory</p>
          <h2 className="headline">Match the gear.<br /><span className="text-green">Top the board.</span></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, alignItems: 'start' }}
          className="block-grid">

          {/* Game */}
          <div className="reveal">
            {/* Stats bar */}
            <div className="glass" style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '14px 20px', borderRadius: 14, marginBottom: 20,
            }}>
              {[
                { label: 'Moves', val: moves },
                { label: 'Matched', val: `${matched}/${EMOJIS.length}` },
                { label: 'Time', val: fmt(time) },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, fontSize: '1.35rem', color: matched === EMOJIS.length ? '#3DBA6A' : '#D4AF37' }}>
                    {s.val}
                  </p>
                  <p className="label">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Board */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
              {cards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => flip(idx)}
                  disabled={card.matched || card.flipped || flipped.length === 2}
                  style={{
                    aspectRatio: '1', borderRadius: 14,
                    border: 'none', cursor: card.matched ? 'default' : 'pointer',
                    perspective: 600,
                    background: 'transparent', padding: 0,
                  }}
                >
                  <div style={{
                    width: '100%', height: '100%', position: 'relative',
                    transformStyle: 'preserve-3d',
                    transform: (card.flipped || card.matched) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
                  }}>
                    {/* Back */}
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: 14,
                      backfaceVisibility: 'hidden', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      fontSize: 22, color: 'rgba(245,245,247,0.2)',
                    }}>
                      ♦
                    </div>
                    {/* Front */}
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: 14,
                      backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28,
                      background: card.matched
                        ? 'rgba(61,186,106,0.12)' : 'rgba(212,175,55,0.08)',
                      border: `1px solid ${card.matched ? 'rgba(61,186,106,0.3)' : 'rgba(212,175,55,0.2)'}`,
                      boxShadow: card.matched ? '0 0 20px rgba(61,186,106,0.1)' : undefined,
                    }}>
                      {card.emoji}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={init} className="btn btn-ghost" style={{ flex: 1 }}>
                ↺ New Game
              </button>
              {done && (
                <div style={{
                  flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 12, background: 'rgba(61,186,106,0.08)',
                  border: '1px solid rgba(61,186,106,0.25)',
                  fontSize: '0.875rem', fontWeight: 600, color: '#3DBA6A',
                  gap: 8,
                }}>
                  🏆 {moves} moves · {fmt(time)}
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="glass reveal" style={{ borderRadius: 20, padding: 24 }}>
            <p className="label" style={{ marginBottom: 16 }}>Leaderboard</p>
            {scores.length === 0 ? (
              <p className="body-sm" style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(245,245,247,0.25)' }}>
                No scores yet.<br />Play to set a record.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {scores.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10,
                    background: i === 0 ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${i === 0 ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)'}`,
                  }}>
                    <span style={{ fontSize: 16 }}>{['🥇','🥈','🥉'][i] || `#${i+1}`}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: i === 0 ? '#D4AF37' : '#F5F5F7' }}>
                        {s.moves} moves
                      </p>
                      <p className="body-sm" style={{ fontSize: '0.75rem' }}>{fmt(s.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:760px){.block-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
