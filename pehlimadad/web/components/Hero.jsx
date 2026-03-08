'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const WHATSAPP_LINK = 'https://wa.me/14155238886?text=join%20ordinary-upper';

const chatMessages = [
  { out: true,  text: '🎤 Voice note · 0:08', sub: null, delay: 0.8 },
  { out: false, text: '🔴 गंभीरता: गंभीर', sub: '108 पर अभी कॉल करें!', delay: 1.4 },
  { out: false, text: '📋 Doctor Summary ready', sub: 'Chest pain · 58yr · since 2hrs', delay: 2.0 },
  { out: false, text: '📍 2 hospitals nearby', sub: 'Dist. Hospital · 1.2km · Open ✓', delay: 2.6 },
  { out: false, text: '🔊 Voice note · 0:22', sub: 'Response in Hindi', delay: 3.2 },
];

function ChatPhone() {
  const [visible, setVisible] = useState([]);
  useEffect(() => {
    chatMessages.forEach((msg, i) => {
      setTimeout(() => setVisible(v => [...v, i]), msg.delay * 1000);
    });
  }, []);

  return (
    <div className="w-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ background: '#111b21' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#1f2c34' }}>
        <div className="w-8 h-8 rounded-full bg-green-DEFAULT/20 flex items-center justify-center text-sm">🏥</div>
        <div>
          <div className="text-white text-sm font-semibold">PehliMadad</div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-DEFAULT animate-pulse-dot" />
            <span className="text-green-DEFAULT text-xs">online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="p-3 space-y-2 min-h-60" style={{ background: '#0b141a' }}>
        {chatMessages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={visible.includes(i) ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.25 }}
            className={`flex ${msg.out ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[88%] px-3 py-2 text-xs ${msg.out ? 'bubble-out' : 'bubble-in'}`}
              style={{ background: msg.out ? '#005c4b' : '#1f2c34' }}>
              <div className="text-white font-medium">{msg.text}</div>
              {msg.sub && <div className="text-gray-400 text-[10px] mt-0.5">{msg.sub}</div>}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: visible.length >= chatMessages.length ? 0 : 1 }}
          className="flex justify-start"
        >
          <div className="px-3 py-2 bubble-in flex gap-1 items-center" style={{ background: '#1f2c34' }}>
            {[0,1,2].map(i => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse-dot"
                style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Warm radial glow — bottom left */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom left, rgba(220,38,38,0.07) 0%, transparent 70%)' }} />
      {/* Green glow — top right */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(37,211,102,0.06) 0%, transparent 70%)' }} />

      {/* Thin horizontal rule at top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.4) 40%, rgba(37,211,102,0.4) 60%, transparent)' }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl text-white tracking-wider">PEHLIMADAD</span>
          <span className="chip" style={{ paddingLeft: '0.5rem' }}>
            <span className="relative flex items-center justify-center w-3 h-3 mr-1">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping" style={{ background: '#dc2626' }} />
              <span className="relative w-2 h-2 rounded-full" style={{ background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
            </span>
            LIVE
          </span>
        </div>
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium px-3 sm:px-5 py-2 rounded-full transition-all"
          style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="hidden sm:inline">Try it now</span>
        </a>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex items-center px-8 py-12">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1fr_auto] gap-12 items-center">

          {/* Left */}
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-red-DEFAULT" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--muted)' }}>
                AI for Bharat Hackathon · Phase 2
              </span>
            </motion.div>

            {/* Main headline */}
            <div className="overflow-hidden mb-2">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(4rem,10vw,8rem)] text-white leading-none"
              >
                INDIA&apos;S FIRST
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-2">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(4rem,10vw,8rem)] leading-none"
                style={{ color: 'var(--green)' }}
              >
                AI HEALTH TRIAGE
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(4rem,10vw,8rem)] text-white leading-none"
              >
                ON WHATSAPP
              </motion.h1>
            </div>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-lg max-w-xl leading-relaxed mb-10" style={{ color: 'var(--muted)' }}>
              India has <span className="text-white font-semibold">1 doctor per 1,511 rural people</span>.
              PehliMadad is the triage nurse every village is missing —
              voice-first, in 10 languages, available 24/7.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-4">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 font-semibold px-7 py-4 rounded-full transition-all duration-300 hover:scale-105 text-black"
                style={{ background: 'var(--green)', boxShadow: '0 0 40px rgba(37,211,102,0.3)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Try on WhatsApp
              </a>
              <a href="#how-it-works"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: 'var(--muted)' }}>
                See how it works
                <span className="text-lg">↓</span>
              </a>
            </motion.div>

            {/* AWS badges */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-2 mt-10">
              {['Amazon Bedrock', 'AWS Lambda', 'Amazon Transcribe', 'Amazon Polly', 'DynamoDB'].map(s => (
                <span key={s} className="chip">{s}</span>
              ))}
            </motion.div>
          </div>

          {/* Right — phone */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex flex-col items-center gap-4 animate-float"
          >
            <ChatPhone />
            <div className="chip">
              <span className="w-1.5 h-1.5 rounded-full bg-green-DEFAULT" />
              ⚡ &lt;30s response time
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="relative z-10 border-t overflow-hidden py-3" style={{ borderColor: 'var(--border)' }}>
        <div className="flex whitespace-nowrap marquee-track gap-12 text-xs font-semibold tracking-[0.2em] uppercase"
          style={{ color: 'var(--muted)' }}>
          {Array(4).fill(['VOICE-FIRST', 'AI TRIAGE', '10 LANGUAGES', 'AMAZON BEDROCK', 'WHATSAPP', 'RURAL INDIA', '108 EMERGENCY']).flat().map((t, i) => (
            <span key={i}>{t} <span className="text-red-DEFAULT mx-4">·</span></span>
          ))}
        </div>
      </div>
    </section>
  );
}
