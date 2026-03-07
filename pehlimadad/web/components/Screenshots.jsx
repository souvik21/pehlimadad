'use client';
import { motion } from 'framer-motion';

const shots = [
  {
    src: '/screenshot-1.png',
    label: 'Hindi Voice Triage',
    desc: 'URGENT severity + first-aid in Hindi',
  },
  {
    src: '/screenshot-2.png',
    label: 'Doctor Summary',
    desc: 'Clinical notes ready to hand to a physician',
  },
  {
    src: '/screenshot-3.png',
    label: 'Nearby Hospitals',
    desc: 'Open facilities with Google Maps links',
  },
  {
    src: '/screenshot-4.png',
    label: 'Voice Response',
    desc: 'Audio note replied in user\'s language',
  },
];

export default function Screenshots() {
  return (
    <section className="py-24 px-8 relative overflow-hidden">
      <div className="divider mb-24" />

      {/* Ghost background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-display text-[14vw] whitespace-nowrap"
          style={{ color: 'rgba(37,211,102,0.025)' }}
        >
          REAL CONVERSATIONS
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
            style={{ color: 'var(--green)' }}
          >
            Live Proof
          </span>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-white">
            REAL USERS.
          </h2>
          <h2
            className="font-display text-[clamp(3rem,7vw,6rem)] leading-none"
            style={{ color: 'var(--green)' }}
          >
            REAL EMERGENCIES.
          </h2>
        </motion.div>

        {/* Phone mockup grid — staggered heights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          {shots.map((shot, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 + i * 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative"
              style={{ marginTop: i % 2 === 1 ? '2.5rem' : '0' }}
            >
              {/* Phone frame */}
              <div
                className="relative rounded-[2.5rem] overflow-hidden p-[3px]"
                style={{
                  background: 'linear-gradient(145deg, rgba(37,211,102,0.3) 0%, rgba(37,211,102,0.05) 50%, rgba(240,235,228,0.08) 100%)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(37,211,102,0.1)',
                }}
              >
                <div
                  className="relative rounded-[2.3rem] overflow-hidden"
                  style={{ background: '#000' }}
                >
                  {/* Notch */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 z-20 rounded-b-xl"
                    style={{
                      width: '35%',
                      height: '28px',
                      background: '#000',
                    }}
                  />

                  {/* Status bar */}
                  <div
                    className="relative z-10 flex items-center justify-between px-6 pt-2 pb-1 text-[10px] font-medium"
                    style={{ color: 'rgba(255,255,255,0.7)', background: '#075E54' }}
                  >
                    <span>9:41</span>
                    <span>●●●</span>
                  </div>

                  {/* WhatsApp header bar */}
                  <div
                    className="flex items-center gap-2 px-4 py-2"
                    style={{ background: '#075E54' }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--green)', color: '#000' }}
                    >
                      PM
                    </div>
                    <div>
                      <div className="text-white text-xs font-semibold">PehliMadad</div>
                      <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>online</div>
                    </div>
                  </div>

                  {/* Screenshot */}
                  <img
                    src={shot.src}
                    alt={shot.label}
                    className="w-full block"
                    style={{ maxHeight: '420px', objectFit: 'cover', objectPosition: 'top' }}
                  />

                  {/* Gradient overlay at bottom */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-16"
                    style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}
                  />
                </div>
              </div>

              {/* Label below */}
              <div className="mt-5 text-center">
                <div className="text-sm font-semibold text-white mb-1">{shot.label}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{shot.desc}</div>
              </div>

              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: '0 0 60px rgba(37,211,102,0.15)' }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom caption */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-14 text-center text-xs"
          style={{ color: 'var(--muted)' }}
        >
          Actual conversations from the live Twilio sandbox · No staging, no mock data
        </motion.div>
      </div>
    </section>
  );
}
