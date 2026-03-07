'use client';
import { motion } from 'framer-motion';

const services = [
  { name: 'Amazon Bedrock', sub: 'Triage AI · Nova Pro', desc: 'Multi-language health triage, severity classification, clinical doctor summaries', icon: '🧠', color: '#a855f7' },
  { name: 'Amazon Transcribe', sub: 'Speech-to-Text', desc: 'OGG voice → text with auto language identification across 10 Indian languages', icon: '🎙️', color: '#3b82f6' },
  { name: 'Amazon Polly', sub: 'Text-to-Speech', desc: 'Kajal neural voice for Hindi/English. Google WaveNet handles 8 regional languages', icon: '🔊', color: '#ec4899' },
  { name: 'AWS Lambda', sub: 'Serverless Compute', desc: 'Two-function arch: webhook (<1s) + async processor (120s timeout for full AI pipeline)', icon: '⚡', color: '#f97316' },
  { name: 'Amazon DynamoDB', sub: 'Session State', desc: 'Per-user conversation context, 24hr TTL, enables multi-turn triage flow', icon: '🗄️', color: '#06b6d4' },
  { name: 'Amazon S3', sub: 'Audio Storage', desc: 'Transcribe input (OGG) + Polly output (MP3). Pre-signed URLs to WhatsApp', icon: '🪣', color: '#f59e0b' },
  { name: 'Amazon API Gateway', sub: 'Webhook Endpoint', desc: 'HTTP API · validates Twilio signatures · responds within 15s window', icon: '🔀', color: '#22c55e' },
  { name: 'AWS Amplify', sub: 'Hosting', desc: 'CI/CD from GitHub · hosts this Next.js landing page · provides the MVP link', icon: '🚀', color: '#6366f1' },
];

export default function Architecture() {
  return (
    <section className="py-24 px-8 relative">
      <div className="divider mb-24" />

      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-20">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color: '#f97316' }}>
            AWS Architecture
          </span>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-white">
            BUILT ENTIRELY ON AWS.
          </h2>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-none" style={{ color: '#f97316' }}>
            SERVERLESS. SCALABLE.
          </h2>
        </motion.div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px mb-px" style={{ background: 'var(--border)' }}>
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-7 group relative overflow-hidden"
              style={{ background: 'var(--bg)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `radial-gradient(ellipse at top left, ${s.color}10 0%, transparent 70%)` }} />

              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <span className="text-3xl">{s.icon}</span>
                  <span className="w-2 h-2 rounded-full mt-1.5" style={{ background: s.color }} />
                </div>
                <div className="font-semibold text-white mb-0.5 text-sm">{s.name}</div>
                <div className="text-xs mb-3 font-medium" style={{ color: s.color }}>{s.sub}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{s.desc}</div>
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
          className="p-8"
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
        >
          <div className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: 'var(--muted)' }}>
            Request flow
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {[
              { label: 'WhatsApp User', c: '#25D366' },
              { label: '→' },
              { label: 'Twilio', c: '#e84545' },
              { label: '→' },
              { label: 'API Gateway', c: '#f97316' },
              { label: '→' },
              { label: 'Lambda (webhook)', c: '#f97316' },
              { label: '⟶ async' },
              { label: 'Lambda (processor)', c: '#f97316' },
              { label: '→' },
              { label: 'Transcribe', c: '#3b82f6' },
              { label: '+' },
              { label: 'Bedrock', c: '#a855f7' },
              { label: '+' },
              { label: 'Polly', c: '#ec4899' },
              { label: '→' },
              { label: 'Twilio', c: '#e84545' },
              { label: '→' },
              { label: 'WhatsApp User', c: '#25D366' },
            ].map((item, i) => (
              item.label === '→' || item.label === '+' || item.label === '⟶ async'
                ? <span key={i} style={{ color: 'var(--muted)' }}>{item.label}</span>
                : <span key={i} className="font-semibold" style={{ color: item.c }}>{item.label}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
