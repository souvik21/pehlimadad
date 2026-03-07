'use client';
import { motion } from 'framer-motion';

const reasons = [
  {
    icon: '🌐',
    title: 'Language Intelligence',
    body: 'No rule-based NLP can auto-detect 10 Indian languages from a noisy voice note and respond contextually. Amazon Bedrock\'s Nova Pro model does — in one call.',
  },
  {
    icon: '🩺',
    title: 'Medical Reasoning',
    body: 'Triage is probabilistic, not deterministic. AI weighs symptoms, age, and context to produce CRITICAL/URGENT/MODERATE/MILD severity with clinical-grade doctor summaries — impossible with scripted flows.',
  },
  {
    icon: '🔄',
    title: 'Multi-turn Conversation',
    body: 'Follow-up questions (age? duration? allergies?) require conversational memory. DynamoDB + Bedrock together maintain a coherent triage dialogue across messages.',
  },
  {
    icon: '♿',
    title: 'Zero Literacy Required',
    body: 'Bedrock understands "meri ma ko sans nahi aa rahi" — colloquial, regional, misspelled. No keyword-matching chatbot can handle the full spectrum of how Indians describe emergencies.',
  },
];

export default function WhyAI() {
  return (
    <section className="py-24 px-8 relative overflow-hidden">
      <div className="divider mb-24" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
            style={{ color: '#f97316' }}
          >
            Why Generative AI
          </span>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-white">
            THIS COULDN'T BE
          </h2>
          <h2
            className="font-display text-[clamp(3rem,7vw,6rem)] leading-none"
            style={{ color: '#f97316' }}
          >
            BUILT WITHOUT AI.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-px" style={{ background: 'var(--border)' }}>
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 group relative overflow-hidden"
              style={{ background: 'var(--bg)' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: 'radial-gradient(ellipse at top left, rgba(249,115,22,0.06) 0%, transparent 70%)' }}
              />
              <div className="relative">
                <div className="text-4xl mb-5">{r.icon}</div>
                <h3 className="font-display text-2xl text-white tracking-wider mb-4">{r.title.toUpperCase()}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{r.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bedrock callout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-px p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          style={{
            background: 'var(--bg-2)',
            border: '1px solid rgba(249,115,22,0.2)',
            boxShadow: '0 0 40px rgba(249,115,22,0.05)',
          }}
        >
          <div
            className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', color: '#f97316' }}
          >
            ⚡
          </div>
          <div>
            <div className="text-sm font-semibold text-white mb-1">Powered by Amazon Bedrock</div>
            <div className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              Model: <code className="text-white">amazon.nova-pro-v1:0</code> · Region: us-east-1 · Invoked via AWS Lambda with IAM role — no keys in code, zero egress to third-party AI APIs.
            </div>
          </div>
          <div
            className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}
          >
            100% AWS-native AI
          </div>
        </motion.div>
      </div>
    </section>
  );
}
