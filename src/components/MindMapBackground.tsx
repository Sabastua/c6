'use client';

import { useEffect, useRef } from 'react';

const CATEGORIES = {
  African: ["Afrobeats", "Amapiano", "Highlife", "Kwaito", "Gqom", "Bongo Flava", "Kuduro", "Soukous", "Afro-House", "Afro-Tech", "Makossa", "Ethio-Jazz"],
  Electronic: ["House", "Techno", "Trance", "Dubstep", "Drum & Bass", "UK Garage", "Grime", "Synthwave", "EDM", "Hardstyle", "Ambient", "Breakbeat", "Deep House", "Electro", "Jungle", "Future Bass", "IDM"],
  Urban: ["Hip Hop", "Trap", "R&B", "Drill", "Boom Bap", "Lo-fi", "Neo Soul", "Bounce", "Crunk", "Trip Hop", "G-Funk", "Conscious Rap"],
  Pop: ["Pop", "K-Pop", "J-Pop", "Synthpop", "Indie Pop", "Electropop", "Hyperpop", "Dream Pop", "Art Pop", "Teen Pop"],
  Rock: ["Rock", "Punk", "Metal", "Indie Rock", "Grunge", "Post-Punk", "Shoegaze", "Prog Rock", "Hardcore", "Alternative", "Pop Punk", "Doom Metal"],
  SoulJazz: ["Jazz", "Blues", "Soul", "Funk", "Bebop", "Swing", "Bossa Nova", "Smooth Jazz", "Free Jazz", "Motown", "Dixieland"],
  Latin: ["Reggaeton", "Salsa", "Bachata", "Cumbia", "Merengue", "Samba", "Tango", "Mambo", "Latin Pop", "Baile Funk", "Mariachi", "Rumba"],
  Classical: ["Classical", "Baroque", "Romantic", "Modern", "Opera", "Orchestral", "Soundtrack", "Choral", "Chamber", "Symphony"],
  CountryFolk: ["Country", "Bluegrass", "Folk", "Americana", "Celtic", "Flamenco", "Gospel", "Polka"],
  Reggae: ["Reggae", "Dancehall", "Dub", "Ska", "Rocksteady", "Roots Reggae"]
};

// Colors for categories
const COLORS = [
  '#3DBA6A', // Green
  '#D4AF37', // Gold 
  '#FFFFFF', // White
  '#6b7280', // Gray
  '#22c55e', // Bright Green
  '#fde047', // Light Gold
  '#059669', // Emerald
  '#ca8a04', // Dark Gold
  '#a3e635', // Lime
  '#a1a1aa', // Zinc
];

type Node = {
  id: number;
  text: string;
  catIndex: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  baseRadius: number;
};
type Edge = { source: number; target: number; length: number; strength: number };

export default function MindMapBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    cvs.width = width;
    cvs.height = height;

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    let idCounter = 0;
    const catKeys = Object.keys(CATEGORIES);
    const catRootIds: number[] = [];

    // 1. Generate Nodes
    catKeys.forEach((cat, catIdx) => {
      const genres = CATEGORIES[cat as keyof typeof CATEGORIES];
      const startId = idCounter;
      catRootIds.push(startId);

      genres.forEach((genre, i) => {
        nodes.push({
          id: idCounter++,
          text: genre,
          catIndex: catIdx,
          x: (Math.random() - 0.5) * width * 2,
          y: (Math.random() - 0.5) * height * 2,
          vx: 0, vy: 0,
          mass: i === 0 ? 3 : 1, // Root nodes of category are heavier
          baseRadius: i === 0 ? 5 : 2,
        });
      });

      // 2. Intra-category edges (connect all to root, and some sequentially)
      for (let i = 1; i < genres.length; i++) {
        // connect to root of category
        edges.push({ source: startId, target: startId + i, length: 150 + Math.random() * 100, strength: 0.05 });
        // connect some neighbors
        if (i > 1 && Math.random() > 0.5) {
          edges.push({ source: startId + i - 1, target: startId + i, length: 100, strength: 0.02 });
        }
      }
    });

    // 3. Inter-category edges (connect roots to form the global web)
    for (let i = 0; i < catRootIds.length; i++) {
      for (let j = i + 1; j < catRootIds.length; j++) {
        if (Math.random() > 0.4) {
          edges.push({
            source: catRootIds[i],
            target: catRootIds[j],
            length: 400 + Math.random() * 300,
            strength: 0.01
          });
        }
      }
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let hoveredNode: number | null = null;
    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cvs.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only hover if inside the canvas
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        mouseX = x;
        mouseY = y;
        isHovering = true;
      } else {
        isHovering = false;
      }
    };
    const handleMouseLeave = () => { isHovering = false; };
    const handleResize = () => {
      const parent = cvs.parentElement;
      width = parent?.clientWidth || window.innerWidth;
      height = parent?.clientHeight || window.innerHeight;
      cvs.width = width;
      cvs.height = height;
    };

    // Initial resize to fit parent instead of window
    handleResize();

    // Use window for mousemove so if mouse leaves Hero fast, it catches the bounds
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Physics step
    const DAMPING = 0.92;
    const CENTER_FORCE = 0.0005;
    const REPULSION = 500;

    let rafId: number;

    const loop = () => {
      // Background clear instead of solid fill to reveal underneath swiper
      ctx.clearRect(0, 0, width, height);

      // Debug text
      ctx.fillStyle = 'rgba(212,175,55,0.4)';
      ctx.font = '10px monospace';
      ctx.fillText(`MindMap: ${width}x${height} | Nodes: ${nodes.length}`, 10, 20);

      // --- PHYSICS ---
      // Edges (Springs)
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const n1 = nodes[e.source];
        const n2 = nodes[e.target];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - e.length) * e.strength;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        n1.vx += fx / n1.mass;
        n1.vy += fy / n1.mass;
        n2.vx -= fx / n2.mass;
        n2.vy -= fy / n2.mass;
      }

      // Repulsion (Node vs Node)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 20000) {
            const dist = Math.sqrt(distSq) || 1;
            const force = REPULSION / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            n1.vx -= fx / n1.mass;
            n1.vy -= fy / n1.mass;
            n2.vx += fx / n2.mass;
            n2.vy += fy / n2.mass;
          }
        }
      }

      // Center Gravity & Mouse Force
      hoveredNode = null;
      let minMouseDist = 150;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        
        // Center drift to keep in view
        n.vx += (width / 2 - n.x) * CENTER_FORCE;
        n.vy += (height / 2 - n.y) * CENTER_FORCE;

        // Mouse Repulsion & Hover Detection
        if (isHovering) {
          const mx = mouseX - n.x;
          const my = mouseY - n.y;
          const mDist = Math.sqrt(mx * mx + my * my);
          
          if (mDist < 200) {
            const mForce = (200 - mDist) * 0.005;
            n.vx -= (mx / mDist) * mForce;
            n.vy -= (my / mDist) * mForce;
          }

          if (mDist < minMouseDist) {
            minMouseDist = mDist;
            hoveredNode = i;
          }
        }

        // Apply Velocity & Dampen
        n.x += n.vx;
        n.y += n.vy;
        n.vx *= DAMPING;
        n.vy *= DAMPING;
      }

      // --- RENDERING ---
      
      // Determine highlight map
      const highlightedIds = new Set<number>();
      if (hoveredNode !== null) {
        highlightedIds.add(hoveredNode);
        for (let i = 0; i < edges.length; i++) {
          if (edges[i].source === hoveredNode) highlightedIds.add(edges[i].target);
          if (edges[i].target === hoveredNode) highlightedIds.add(edges[i].source);
        }
      }

      // Draw Edges
      ctx.lineWidth = 1;
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const n1 = nodes[e.source];
        const n2 = nodes[e.target];
        
        // Culling invisible lines
        if (
          (n1.x < 0 && n2.x < 0) || (n1.x > width && n2.x > width) ||
          (n1.y < 0 && n2.y < 0) || (n1.y > height && n2.y > height)
        ) continue;

        let alpha = 0.15; // Increased from 0.05
        if (hoveredNode !== null) {
          if (e.source === hoveredNode || e.target === hoveredNode) {
            alpha = 0.7; // Brighter highlight
          } else {
            alpha = 0.04; // Less dim
          }
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
      }

      // Draw Nodes
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.x < -100 || n.x > width + 100 || n.y < -100 || n.y > height + 100) continue;

        const isHovered = hoveredNode === i;
        const isConnected = highlightedIds.has(i);
        const color = COLORS[n.catIndex % COLORS.length];

        let baseAlpha = 0.6;
        if (hoveredNode !== null && !isConnected) baseAlpha = 0.1;

        // Draw dot
        ctx.fillStyle = color;
        ctx.globalAlpha = isHovered ? 1 : baseAlpha;
        ctx.beginPath();
        ctx.arc(n.x, n.y, isHovered ? n.baseRadius * 2 : n.baseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw text
        if (isHovered || isConnected || n.mass > 1) { // Root nodes or connected always show text
          ctx.fillStyle = isHovered ? '#FFFFFF' : color;
          ctx.globalAlpha = isHovered ? 1 : baseAlpha + 0.2;
          
          if (isHovered) {
             ctx.font = 'bold 16px Inter, sans-serif';
             ctx.fillText(n.text, n.x, n.y - 15);
          } else {
             ctx.font = n.mass > 1 ? 'bold 13px Inter, sans-serif' : '10px Inter, sans-serif';
             ctx.fillText(n.text, n.x, n.y - 10);
          }
        }
      }

      ctx.globalAlpha = 1.0;
      rafId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      width: '100%', height: '100%',
      zIndex: 50, // Temporary: Move to extreme front to see if it's being covered.
      overflow: 'hidden',
      pointerEvents: 'none', 
      opacity: 1, 
    }}>
      <div 
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none'
        }}
      >
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', outline: '1px solid rgba(212,175,55,0.1)' }} />
      </div>
    </div>
  );
}
