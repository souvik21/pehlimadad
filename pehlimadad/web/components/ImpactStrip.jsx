'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function CountUp({ to, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {val}{suffix}
    </span>
  );
}

const stats = [
  { value: 10, suffix: '', label: 'Indian Languages', sub: 'voice + text' },
  { value: 30, suffix: 's', label: 'Avg Response Time', sub: 'voice-to-triage' },
  { value: 600, suffix: 'M+', label: 'Addressable Users', sub: 'Hindi speakers alone' },
  { value: 8, suffix: '', label: 'AWS Services', sub: 'fully serverless' },
  { value: 0, suffix: '', label: 'App Downloads', sub: 'just WhatsApp' },
];

export default function ImpactStrip() {
  return (
    <section className="relative overflow-hidden" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(37,211,102,0.012) 2px, rgba(37,211,102,0.012) 4px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px"
          style={{ background: 'var(--border)' }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="px-8 py-10 text-center group relative overflow-hidden"
              style={{ background: 'var(--bg)' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: 'radial-gradient(ellipse at center, rgba(37,211,102,0.06) 0%, transparent 70%)' }}
              />
              <div
                className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-none mb-2"
                style={{ color: 'var(--green)' }}
              >
                <CountUp to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-semibold text-white mb-1">{stat.label}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
