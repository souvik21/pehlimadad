'use client';
import { motion } from 'framer-motion';

const languages = [
  { name: 'Hindi',     native: 'हिंदी',    speakers: '600M+', tts: 'Amazon Polly' },
  { name: 'Bengali',   native: 'বাংলা',     speakers: '100M+', tts: 'Google TTS' },
  { name: 'Telugu',    native: 'తెలుగు',   speakers: '80M+',  tts: 'Google TTS' },
  { name: 'Marathi',   native: 'मराठी',    speakers: '80M+',  tts: 'Google TTS' },
  { name: 'Tamil',     native: 'தமிழ்',    speakers: '70M+',  tts: 'Google TTS' },
  { name: 'Gujarati',  native: 'ગુજરાતી',  speakers: '55M+',  tts: 'Google TTS' },
  { name: 'Kannada',   native: 'ಕನ್ನಡ',    speakers: '45M+',  tts: 'Google TTS' },
  { name: 'Malayalam', native: 'മലയാളം',   speakers: '35M+',  tts: 'Google TTS' },
  { name: 'Punjabi',   native: 'ਪੰਜਾਬੀ',   speakers: '30M+',  tts: 'Google TTS' },
  { name: 'English',   native: 'English',   speakers: '125M+', tts: 'Amazon Polly' },
];

export default function Languages() {
  return (
    <section className="py-24 px-8 relative overflow-hidden">
      <div className="divider mb-24" />

      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display text-[20vw] font-black whitespace-nowrap"
          style={{ color: 'rgba(37,211,102,0.03)', letterSpacing: '-0.02em' }}>
          10 LANGUAGES
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-20">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color: 'var(--amber)' }}>
            Language Support
          </span>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-white">
            SPEAKS YOUR LANGUAGE.
          </h2>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-none" style={{ color: 'var(--amber)' }}>
            AUTOMATICALLY.
          </h2>
        </motion.div>

        {/* Language grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px mb-px" style={{ background: 'var(--border)' }}>
          {languages.map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 group cursor-default relative overflow-hidden"
              style={{ background: 'var(--bg)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
              <div className="relative">
                <div className="font-display text-4xl text-white mb-2 tracking-wide group-hover:text-amber-DEFAULT transition-colors duration-200">
                  {lang.native}
                </div>
                <div className="text-xs mb-3" style={{ color: 'var(--muted)' }}>{lang.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: 'var(--green)' }}>{lang.speakers}</span>
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{lang.tts}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature row */}
        <div className="grid sm:grid-cols-3 gap-px" style={{ background: 'var(--border)' }}>
          {[
            { icon: '🎤', title: 'VOICE IN', desc: 'Amazon Transcribe detects language automatically from voice or text' },
            { icon: '🔊', title: 'VOICE OUT', desc: 'Amazon Polly (Hindi/English) + Google WaveNet (8 regional languages)' },
            { icon: '📖', title: 'LITERACY-FREE', desc: 'Fully usable by those who cannot read — just speak naturally' },
          ].map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="p-8 flex gap-5 items-start"
              style={{ background: 'var(--bg-2)' }}>
              <span className="text-3xl">{f.icon}</span>
              <div>
                <div className="font-display text-xl text-white tracking-wider mb-2">{f.title}</div>
                <div className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
