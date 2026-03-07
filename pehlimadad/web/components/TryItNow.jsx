'use client';
import { motion } from 'framer-motion';

const SANDBOX_CODE = 'swam-quarter';
const WHATSAPP_LINK = `https://wa.me/14155238886?text=join%20${SANDBOX_CODE}`;

export default function TryItNow() {
  return (
    <section id="try" className="py-24 px-8 relative overflow-hidden">
      <div className="divider mb-24" />

      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display text-[18vw] whitespace-nowrap"
          style={{ color: 'rgba(37,211,102,0.03)' }}>
          TRY IT NOW
        </span>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-16">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color: 'var(--green)' }}>
            Live Demo
          </span>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-white mb-2">
            THE BOT IS LIVE.
          </h2>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-none" style={{ color: 'var(--green)' }}>
            TEST IT IN 60 SECONDS.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-3 gap-px mb-px" style={{ background: 'var(--border)' }}>
          {[
            { n: '1', title: 'Join sandbox', desc: `Click below to open WhatsApp and send the join code` },
            { n: '2', title: 'Describe emergency', desc: 'Voice note or text in any language: "Mere baap ko chest pain hai"' },
            { n: '3', title: 'Get triage', desc: 'Severity, first-aid steps, doctor summary + nearby hospitals' },
          ].map((step, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8"
              style={{ background: 'var(--bg)' }}>
              <div className="font-display text-5xl mb-5" style={{ color: 'var(--green)' }}>{step.n}</div>
              <div className="font-display text-xl text-white tracking-wider mb-3">{step.title.toUpperCase()}</div>
              <div className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{step.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="p-10 grid sm:grid-cols-[auto_1fr_auto] items-center gap-10"
          style={{ background: 'var(--bg-2)', border: '1px solid rgba(37,211,102,0.2)', boxShadow: '0 0 60px rgba(37,211,102,0.05)' }}
        >
          {/* QR code */}
          <div className="flex flex-col items-center gap-3">
            <div className="p-2 rounded-xl bg-white">
              <img src="/qr.png" alt="Scan to open WhatsApp" width={130} height={130} />
            </div>
            <div className="text-xs text-center" style={{ color: 'var(--muted)' }}>Scan to open WhatsApp</div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-xs mb-1.5 font-semibold tracking-widest uppercase" style={{ color: 'var(--muted)' }}>WhatsApp Number</div>
              <code className="font-mono text-lg text-white">+1 415 523 8886</code>
            </div>
            <div>
              <div className="text-xs mb-1.5 font-semibold tracking-widest uppercase" style={{ color: 'var(--muted)' }}>Join Code</div>
              <code className="font-mono text-lg text-white">
                join <span style={{ color: 'var(--green)' }}>{SANDBOX_CODE}</span>
              </code>
            </div>
            <div className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              Send the join code first, then describe any health emergency by voice note or text in your language.
            </div>
          </div>

          {/* Button */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex flex-col items-center gap-2 font-bold px-8 py-6 rounded-2xl text-black transition-all duration-300 hover:scale-105"
            style={{ background: 'var(--green)', boxShadow: '0 0 40px rgba(37,211,102,0.35)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>Open</span>
            <span>WhatsApp</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-8 mt-8 text-xs"
          style={{ color: 'var(--muted)' }}
        >
          <span>✓ No app download</span>
          <span>✓ No registration</span>
          <span>✓ Works on any phone</span>
          <span>✓ 50 msg/day sandbox limit</span>
        </motion.div>
      </div>
    </section>
  );
}
