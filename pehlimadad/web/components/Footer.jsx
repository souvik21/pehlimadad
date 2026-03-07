'use client';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
        >
          <div>
            <div className="font-display text-3xl text-white tracking-wider mb-1">PEHLIMADAD</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>AI for Bharat Hackathon · Phase 2 · 2026</div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ['Amazon Bedrock', '#a855f7'],
              ['AWS Lambda', '#f97316'],
              ['Transcribe', '#3b82f6'],
              ['Polly', '#ec4899'],
              ['DynamoDB', '#06b6d4'],
              ['Amplify', '#6366f1'],
            ].map(([label, color]) => (
              <span key={label} className="chip" style={{ color, borderColor: `${color}30` }}>
                {label}
              </span>
            ))}
          </div>

          <a
            href="https://github.com/souvik21/pehlimadad"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors hover:text-white"
            style={{ color: 'var(--muted)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </motion.div>

        {/* Kiro badge */}
        <div className="mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-xs text-center sm:text-left" style={{ color: 'var(--muted)' }}>
            Not a substitute for professional medical advice · Always call 108 in life-threatening emergencies
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0"
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.25)',
              color: '#a5b4fc',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            Spec-driven with <span className="font-bold text-indigo-300 ml-1">Kiro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
