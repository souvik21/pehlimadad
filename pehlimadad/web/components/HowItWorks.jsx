'use client';
import { motion } from 'framer-motion';

const steps = [
  {
    n: '01',
    icon: '🎤',
    title: 'Send a voice note',
    desc: 'Describe the emergency in any Indian language. Voice note or text. No app, no sign-up — just WhatsApp.',
    detail: 'Amazon Transcribe · Language auto-detected',
  },
  {
    n: '02',
    icon: '🧠',
    title: 'AI triages severity',
    desc: 'Amazon Bedrock (Nova Pro) assesses the emergency — Critical, Urgent, Moderate, or Mild — with first-aid guidance.',
    detail: 'Amazon Bedrock · Nova Pro · 2-turn conversation',
  },
  {
    n: '03',
    icon: '📱',
    title: 'Get 3 responses back',
    desc: 'Triage advice + first-aid steps, a doctor-ready clinical summary, and nearby open hospitals with Maps links.',
    detail: 'Amazon Polly · Google TTS · Google Places API',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-8 relative">
      {/* Top divider */}
      <div className="divider mb-24" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color: 'var(--green)' }}>
            How It Works
          </span>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-white">
            FROM VOICE NOTE TO
          </h2>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-none" style={{ color: 'var(--green)' }}>
            TRIAGE IN 30 SECONDS
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-px" style={{ background: 'var(--border)' }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="p-10 relative group overflow-hidden"
              style={{ background: 'var(--bg)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(ellipse at top left, rgba(37,211,102,0.05) 0%, transparent 70%)' }} />

              {/* Step number — large background */}
              <div className="font-display text-[8rem] leading-none absolute -top-4 -right-2 select-none pointer-events-none"
                style={{ color: 'rgba(255,255,255,0.03)' }}>
                {step.n}
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <span className="font-display text-sm tracking-widest" style={{ color: 'var(--green)' }}>
                    {step.n}
                  </span>
                  <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                  <span className="text-2xl">{step.icon}</span>
                </div>

                <h3 className="font-display text-3xl text-white mb-4 tracking-wide">{step.title.toUpperCase()}</h3>
                <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--muted)' }}>{step.desc}</p>
                <div className="text-xs font-medium" style={{ color: 'rgba(37,211,102,0.6)' }}>{step.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Flow strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-px p-6 flex items-center justify-center flex-wrap gap-2 text-xs"
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
        >
          {[
            ['WhatsApp', '#25D366'],
            ['Twilio', '#fff'],
            ['API Gateway', '#f97316'],
            ['Lambda', '#f97316'],
            ['Transcribe', '#3b82f6'],
            ['Bedrock', '#a855f7'],
            ['Polly / Google TTS', '#ec4899'],
            ['S3', '#f59e0b'],
            ['DynamoDB', '#06b6d4'],
            ['WhatsApp', '#25D366'],
          ].map(([label, color], i, arr) => (
            <span key={i} className="flex items-center gap-2">
              <span className="font-semibold" style={{ color }}>{label}</span>
              {i < arr.length - 1 && <span style={{ color: 'var(--muted)' }}>→</span>}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
