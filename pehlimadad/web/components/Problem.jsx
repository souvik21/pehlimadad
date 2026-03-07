'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function CountUp({ target, suffix = '', duration = 2.2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(target);
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * num));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  {
    num: '600',
    suffix: 'M+',
    label: 'rural Indians lack timely emergency care',
    source: 'Ministry of Health, 2023',
    color: 'var(--red)',
    size: 'large',
  },
  {
    num: '80',
    suffix: '%',
    label: 'of medical emergencies occur before reaching a hospital',
    source: 'Indian Journal of Critical Care Medicine',
    color: 'var(--amber)',
    size: 'normal',
  },
  {
    num: '40',
    suffix: 'min+',
    label: 'average ambulance wait in rural areas',
    source: 'NITI Aayog Rural Health Report',
    color: '#f97316',
    size: 'normal',
  },
  {
    num: '1511',
    suffix: ':1',
    label: 'rural patients per doctor · WHO standard is 1000:1',
    source: 'National Health Profile 2022',
    color: 'var(--red)',
    size: 'normal',
  },
];

export default function Problem() {
  return (
    <section className="py-24 px-8 relative overflow-hidden">
      {/* faint red glow bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom left, rgba(220,38,38,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="h-px flex-1 max-w-xs" style={{ background: 'var(--border)' }} />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--red)' }}>The Crisis</span>
          <div className="h-px flex-1 max-w-xs" style={{ background: 'var(--border)' }} />
        </motion.div>

        {/* Editorial headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-white mb-2">
            EVERY MINUTE COUNTS.
          </h2>
          <h2
            className="font-display text-[clamp(3rem,7vw,6rem)] leading-none"
            style={{ color: 'var(--red)' }}
          >
            RURAL INDIA WAITS ALONE.
          </h2>
        </motion.div>

        {/* Hero stat — 600M+ full-width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-px overflow-hidden group"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderBottom: 'none' }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'radial-gradient(ellipse at left, rgba(220,38,38,0.07) 0%, transparent 60%)' }}
          />
          <div className="relative px-10 py-10 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
            <div
              className="font-display leading-none"
              style={{
                fontSize: 'clamp(5rem, 16vw, 12rem)',
                color: 'var(--red)',
                textShadow: '0 0 80px rgba(220,38,38,0.25)',
              }}
            >
              <CountUp target="600" suffix="M+" />
            </div>
            <div className="pb-2 sm:pb-4 max-w-sm">
              <div className="text-xl font-semibold text-white mb-2 leading-snug">
                rural Indians lack timely emergency care
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                Source: Ministry of Health, 2023
              </div>
            </div>
            {/* Ghost label */}
            <div
              className="hidden lg:block absolute right-10 bottom-4 font-display text-[8rem] leading-none select-none pointer-events-none"
              style={{ color: 'rgba(220,38,38,0.04)' }}
            >
              THE PROBLEM
            </div>
          </div>
        </motion.div>

        {/* 3 supporting stats */}
        <div className="grid sm:grid-cols-3 gap-px" style={{ background: 'var(--border)' }}>
          {stats.slice(1).map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 relative overflow-hidden group"
              style={{ background: 'var(--bg)' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at top left, ${stat.color}0a 0%, transparent 70%)` }}
              />
              <div className="relative">
                <div
                  className="font-display leading-none mb-4"
                  style={{
                    fontSize: 'clamp(3.5rem, 7vw, 6rem)',
                    color: stat.color,
                  }}
                >
                  <CountUp target={stat.num} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-medium text-white leading-snug mb-3">{stat.label}</div>
                <div className="text-xs" style={{ color: 'rgba(122,111,101,0.7)' }}>
                  {stat.source}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pull quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 pl-8 max-w-3xl"
          style={{ borderLeft: '2px solid var(--red)' }}
        >
          <p className="text-xl leading-relaxed" style={{ color: 'var(--muted)' }}>
            &ldquo;A family in Jharkhand sends a voice note at 2am. Their father can&apos;t breathe.
            They don&apos;t know if it&apos;s cardiac or asthma. The nearest doctor is 40km away.
            <span className="text-white font-medium"> PehliMadad answers in 30 seconds.</span>&rdquo;
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
