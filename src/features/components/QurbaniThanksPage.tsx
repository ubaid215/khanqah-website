'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── Static data ───────────────────────────────────────────────────────────────
const PARTICLES = [
  { x: 7, y: 15, s: 2, d: 3.4, dy: 12 },
  { x: 91, y: 9, s: 1.5, d: 4.2, dy: 16 },
  { x: 14, y: 72, s: 2.5, d: 2.9, dy: 10 },
  { x: 80, y: 80, s: 1.5, d: 3.6, dy: 18 },
  { x: 44, y: 6, s: 2, d: 5.0, dy: 14 },
  { x: 60, y: 91, s: 1, d: 3.2, dy: 8 },
  { x: 26, y: 44, s: 1.5, d: 5.3, dy: 20 },
  { x: 87, y: 50, s: 2, d: 2.6, dy: 12 },
  { x: 4, y: 60, s: 1, d: 4.4, dy: 16 },
  { x: 69, y: 20, s: 2.5, d: 3.8, dy: 10 },
  { x: 36, y: 87, s: 1.5, d: 3.0, dy: 14 },
  { x: 54, y: 36, s: 2, d: 5.2, dy: 18 },
]

const VIDEOS = [
  { id: 'Qp5LjO2lZak', day: 'Day 1', title: 'Qurbani Distribution — Day 1' },
  { id: 'uhxKDlDEthY', day: 'Day 2', title: 'Qurbani Distribution — Day 2' },
]

const HADITHS = [
  {
    arabic:
      'مَا عَمِلَ ابْنُ آدَمَ يَوْمَ النَّحْرِ عَمَلًا أَحَبَّ إِلَى اللَّهِ عَزَّ وَجَلَّ مِنْ إِهْرَاقَةِ الدَّمِ',
    translation:
      'There is no deed that a person does on the Day of Sacrifice that is more beloved to Allah than the shedding of blood. It will come on the Day of Resurrection with its horns and cloven hooves. The blood is accepted by Allah before it even reaches the ground.',
    source: 'Sunan at-Tirmidhi 1493',
  },
  {
    arabic: 'فِي كُلِّ شَعَرَةٍ مِنَ الْأُضْحِيَّةِ حَسَنَةٌ',
    translation:
      'For every hair of the sacrificial animal there is a reward from Allah, and for every strand of its wool there is a reward.',
    source: 'Sunan Ibn Majah 3247',
  },
]

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

// ─── Count-up with easeOutExpo ─────────────────────────────────────────────────
function useCountUp(target: number, duration = 2800) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!isInView) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setCount(Math.floor(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, target, duration])

  return { count, ref }
}

// ══════════════════════════════════════════════════════════════════════════════
// SVG ORNAMENTS — Islamic Art
// ══════════════════════════════════════════════════════════════════════════════

// Interlocking circles — the classic Islamic geometric tile background
// Found throughout mosque wall panels, Quran margins, and Ottoman tilework
function IslamicCirclesBg({ id, opacity = 0.055 }: { id: string; opacity?: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern id={id} x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
          <g stroke="hsl(45,70%,48%)" fill="none" strokeWidth="0.45">
            <circle cx="35" cy="35" r="42" />
            <circle cx="0" cy="0" r="42" />
            <circle cx="70" cy="0" r="42" />
            <circle cx="0" cy="70" r="42" />
            <circle cx="70" cy="70" r="42" />
            <circle cx="35" cy="0" r="42" />
            <circle cx="0" cy="35" r="42" />
            <circle cx="70" cy="35" r="42" />
            <circle cx="35" cy="70" r="42" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  )
}

// Khatam / Rub el-Hizb — two overlapping squares forming the Islamic octagram
// Seen on Quran bindings, mosque doors, and Islamic manuscript illuminations
function KhatamMedallion({ className }: { className?: string }) {
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <svg viewBox="0 0 140 140" fill="none" className={className} aria-hidden>
      <g transform="translate(70,70)" stroke="currentColor" fill="none">
        <circle r="66" strokeWidth="0.5" opacity="0.2" strokeDasharray="2 3.5" />
        <rect x="-40" y="-40" width="80" height="80" strokeWidth="0.9" />
        <rect x="-40" y="-40" width="80" height="80" strokeWidth="0.9" transform="rotate(45)" />
        <circle r="30" strokeWidth="0.55" opacity="0.45" />
        <rect x="-20" y="-20" width="40" height="40" strokeWidth="0.65" opacity="0.6" />
        <rect x="-20" y="-20" width="40" height="40" strokeWidth="0.65" transform="rotate(45)" opacity="0.6" />
        <circle r="10" strokeWidth="0.5" opacity="0.5" />
        <circle r="3" fill="currentColor" opacity="0.3" />
        {spokes.map((a, i) => {
          const rad = (a * Math.PI) / 180
          return (
            <line
              key={i}
              x1={Math.cos(rad) * 11}
              y1={Math.sin(rad) * 11}
              x2={Math.cos(rad) * 55}
              y2={Math.sin(rad) * 55}
              strokeWidth="0.3"
              opacity="0.18"
            />
          )
        })}
      </g>
    </svg>
  )
}

// Arabesque Rosette — 8 teardrop petals radiating from centre
// From the floral arabesque tradition in Ottoman, Persian, and Mughal Islamic art
function ArabesqueRosette({ className }: { className?: string }) {
  const outer = [0, 45, 90, 135, 180, 225, 270, 315]
  const inner = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]
  return (
    <svg viewBox="0 0 140 140" fill="none" className={className} aria-hidden>
      <g transform="translate(70,70)" stroke="currentColor" strokeWidth="0.75">
        {outer.map((a, i) => (
          <g key={i} transform={`rotate(${a})`}>
            <path d="M0,-13 C16,-34 16,-52 0,-58 C-16,-52 -16,-34 0,-13Z" opacity="0.55" />
          </g>
        ))}
        {inner.map((a, i) => (
          <g key={i} transform={`rotate(${a})`}>
            <path d="M0,-8 C9,-20 9,-30 0,-34 C-9,-30 -9,-20 0,-8Z" opacity="0.3" />
          </g>
        ))}
        <circle r="14" strokeWidth="0.6" opacity="0.5" />
        <circle r="6" strokeWidth="0.5" opacity="0.4" />
        <circle r="62" strokeWidth="0.4" opacity="0.18" strokeDasharray="3 5" />
        <circle r="2.5" fill="currentColor" opacity="0.4" />
      </g>
    </svg>
  )
}

// Girih Chain — diamond chain section divider
// Girih (Persian: "knot") is the geometric interlaced style of Islamic tile art
function GirihDivider() {
  return (
    <div className="flex items-center overflow-hidden my-7 sm:my-9" aria-hidden>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[hsl(45,70%,45%)]/40" />
      <svg
        viewBox="0 0 88 20"
        className="w-20 sm:w-24 shrink-0 text-[hsl(45,70%,45%)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <polygon points="44,2 52,10 44,18 36,10" />
        <polygon points="16,4 22,10 16,16 10,10" />
        <polygon points="72,4 78,10 72,16 66,10" />
        <line x1="22" y1="10" x2="36" y2="10" />
        <line x1="52" y1="10" x2="66" y2="10" />
        <circle cx="44" cy="10" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="16" cy="10" r="1.4" fill="currentColor" opacity="0.4" />
        <circle cx="72" cy="10" r="1.4" fill="currentColor" opacity="0.4" />
      </svg>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[hsl(45,70%,45%)]/40" />
    </div>
  )
}

// Muqarnas Arch — the stalactite vaulting carved above mosque mihrabs and portals
function MuqarnasArch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 62" fill="none" className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth="0.7">
        <path d="M8,60 Q100,-8 192,60" opacity="0.7" />
        <path d="M22,60 Q100,10 178,60" opacity="0.55" />
        <path d="M52,60 Q68,32 84,60" opacity="0.6" />
        <path d="M116,60 Q132,32 148,60" opacity="0.6" />
        <path d="M38,60 Q52,20 66,40 Q80,20 100,36 Q120,20 134,40 Q148,20 162,60" opacity="0.45" />
        <path d="M86,14 L100,4 L114,14" strokeWidth="0.9" opacity="0.65" />
        <circle cx="100" cy="4" r="2.5" fill="currentColor" opacity="0.45" />
        <line x1="8" y1="60" x2="192" y2="60" strokeWidth="0.4" opacity="0.35" />
      </g>
    </svg>
  )
}

// Corner bracket ornament used on cards and frames
function CornerBrackets({ children, className }: { children: React.ReactNode; className?: string }) {
  const corners = [
    'top-3 left-3 border-l border-t',
    'top-3 right-3 border-r border-t',
    'bottom-3 left-3 border-l border-b',
    'bottom-3 right-3 border-r border-b',
  ]
  return (
    <div className={`relative ${className ?? ''}`}>
      {corners.map((cls, i) => (
        <div key={i} className={`pointer-events-none absolute ${cls} w-5 h-5 border-[hsl(45,70%,45%)]/30`} />
      ))}
      {children}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function QurbaniThanksPage() {
  const { count, ref: counterRef } = useCountUp(1909, 2800)

  const heroRef = useRef(null)
  const ayahRef = useRef(null)
  const impactRef = useRef(null)
  const hadithRef = useRef(null)
  const videoRef = useRef(null)
  const closingRef = useRef(null)

  const heroIn = useInView(heroRef, { once: true })
  const ayahIn = useInView(ayahRef, { once: true, margin: '-60px' })
  const impactIn = useInView(impactRef, { once: true, margin: '-60px' })
  const hadithIn = useInView(hadithRef, { once: true, margin: '-60px' })
  const videoIn = useInView(videoRef, { once: true, margin: '-60px' })
  const closingIn = useInView(closingRef, { once: true, margin: '-60px' })

  const pageFadeUp = (delay = 0, inView = true) => ({
    initial: { opacity: 0, y: 22 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as number[], delay },
  })

  const cornerLines = [
    'top-5 left-5 border-l-[1.5px] border-t-[1.5px]',
    'top-5 right-5 border-r-[1.5px] border-t-[1.5px]',
    'bottom-5 left-5 border-l-[1.5px] border-b-[1.5px]',
    'bottom-5 right-5 border-r-[1.5px] border-b-[1.5px]',
  ]

  return (
    <div className="overflow-x-hidden" style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      {/* ═══════════════════════════════════════════════════════════
          §1  HERO
      ═══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative bg-[#0b1a0c] min-h-svh flex flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-20 sm:pt-36 sm:pb-28"
      >
        <IslamicCirclesBg id="hero-geo" opacity={0.05} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: GRAIN, backgroundSize: '128px' }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 40%, hsl(156,38%,13%) 0%, transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute top-0 inset-x-0 h-2/5"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(184,142,50,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)] to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/35 to-transparent" />

        {cornerLines.map((cls, i) => (
          <div key={i} className={`pointer-events-none absolute ${cls} w-12 h-12 border-[hsl(45,70%,45%)]/22`} />
        ))}

        <KhatamMedallion className="absolute -top-8 -left-8 sm:top-4 sm:left-4 w-52 h-52 sm:w-72 sm:h-72 text-[hsl(45,70%,45%)]/[0.11]" />
        <KhatamMedallion className="absolute -bottom-8 -right-8 sm:bottom-4 sm:right-4 w-44 h-44 sm:w-60 sm:h-60 text-[hsl(45,70%,45%)]/[0.09]" />
        <ArabesqueRosette className="absolute top-16 right-6 sm:top-20 sm:right-20 w-28 h-28 sm:w-40 sm:h-40 text-[hsl(45,70%,45%)]/[0.08]" />
        <ArabesqueRosette className="absolute bottom-16 left-6 sm:bottom-20 sm:left-20 w-24 h-24 sm:w-36 sm:h-36 text-[hsl(45,70%,45%)]/[0.07]" />

        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute rounded-full bg-[hsl(45,70%,55%)]"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
            animate={{ y: [-p.dy / 2, p.dy / 2, -p.dy / 2], opacity: [0.12, 0.55, 0.12] }}
            transition={{ duration: p.d, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          />
        ))}

        <div className="relative z-10 text-center max-w-2xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroIn ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
            className="flex justify-center mb-6"
          >
            <MuqarnasArch className="w-40 sm:w-52 text-[hsl(45,70%,45%)]/45" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={heroIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 border border-[hsl(45,70%,45%)]/32 bg-[hsl(45,70%,45%)]/[0.06] rounded-full px-5 py-1.5 mb-8 sm:mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(45,70%,55%)] shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] uppercase text-[hsl(45,70%,58%)]">
              Eid ul-Adha 1446H &nbsp;·&nbsp; Khanqah Saifia
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(45,70%,55%)] shrink-0" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={heroIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            dir="rtl"
            className="font-arabic text-[hsl(45,70%,52%)] leading-[1.55] mb-2 select-none"
            style={{ fontSize: 'clamp(38px, 10vw, 86px)' }}
          >
            جَزَاكَ اللهُ خَيْرًا
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroIn ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="font-serif italic text-[hsl(45,70%,36%)] tracking-[0.2em] mb-1"
            style={{ fontSize: 'clamp(11px, 1.8vw, 14px)' }}
          >
            Jazakallah Khayran
          </motion.p>

          <GirihDivider />

          <motion.h1
            {...pageFadeUp(0.2, heroIn)}
            className="font-serif font-normal text-[hsl(42,30%,95%)] leading-[1.3] mb-5 sm:mb-6"
            style={{ fontSize: 'clamp(22px, 4.5vw, 44px)' }}
          >
            Thank You for Your{' '}
            <span className="italic text-[hsl(45,70%,52%)]">Qurbani</span>
          </motion.h1>

          <motion.p
            {...pageFadeUp(0.3, heroIn)}
            className="text-[13px] sm:text-[14px] leading-[1.95] text-[hsl(42,30%,96%)]/48 max-w-lg mx-auto mb-10 sm:mb-12"
          >
            To every family that honoured this blessed Sunnah through Khanqah
            Saifia Murshidabad Shareef — may Allah accept your sacrifice,
            purify your wealth, and pour His mercy upon your households.
          </motion.p>

          {/* Mini Ayah card */}
          <motion.div {...pageFadeUp(0.42, heroIn)} className="mb-10 sm:mb-12">
            <CornerBrackets className="inline-block border border-[hsl(45,70%,45%)]/18 bg-[hsl(45,70%,45%)]/[0.04] rounded-[3px] px-6 sm:px-8 py-4 sm:py-5">
              <p
                dir="rtl"
                className="font-arabic text-[hsl(45,70%,50%)] leading-[1.8] mb-2"
                style={{ fontSize: 'clamp(18px, 4vw, 28px)' }}
              >
                فَصَلِّ لِرَبِّكَ وَانْحَرْ
              </p>
              <p className="font-serif italic text-[hsl(42,30%,96%)]/45 text-[12px] sm:text-[13px] mb-1">
                &ldquo;So pray to your Lord and sacrifice to Him alone.&rdquo;
              </p>
              <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-[hsl(45,70%,45%)]/50">
                Surah Al-Kawthar · 108:2
              </p>
            </CornerBrackets>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={heroIn ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-10 bg-gradient-to-b from-[hsl(45,70%,45%)]/40 to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          §2  QURANIC AYAH — Al-Hajj 22:37
      ═══════════════════════════════════════════════════════════ */}
      <section
        ref={ayahRef}
        className="relative bg-[hsl(156,31%,11%)] overflow-hidden py-20 sm:py-28"
      >
        <IslamicCirclesBg id="ayah-geo" opacity={0.06} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: GRAIN, backgroundSize: '128px' }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/45 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/25 to-transparent" />

        <ArabesqueRosette className="absolute top-1/2 -translate-y-1/2 -left-12 sm:left-0 w-40 h-40 sm:w-56 sm:h-56 text-[hsl(45,70%,45%)]/[0.1]" />
        <ArabesqueRosette className="absolute top-1/2 -translate-y-1/2 -right-12 sm:right-0 w-40 h-40 sm:w-56 sm:h-56 text-[hsl(45,70%,45%)]/[0.1]" />

        <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
          <motion.p
            {...pageFadeUp(0, ayahIn)}
            className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(45,70%,45%)] mb-6 sm:mb-8"
          >
            The Wisdom of Qurbani
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={ayahIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="mb-8"
          >
            <CornerBrackets className="border border-[hsl(45,70%,45%)]/22 bg-[hsl(45,70%,45%)]/[0.04] rounded-[3px] px-8 py-7 sm:px-12 sm:py-9">
              <p
                dir="rtl"
                className="font-arabic text-[hsl(45,70%,50%)] leading-[2.1] select-none"
                style={{ fontSize: 'clamp(20px, 4.5vw, 36px)' }}
              >
                لَن يَنَالَ اللَّهَ لُحُومُهَا وَلَا دِمَاؤُهَا وَلَٰكِن يَنَالُهُ التَّقْوَىٰ مِنكُمْ
              </p>
            </CornerBrackets>
          </motion.div>

          <motion.p
            {...pageFadeUp(0.25, ayahIn)}
            className="font-serif italic text-[hsl(42,30%,93%)] leading-[1.75] mb-4"
            style={{ fontSize: 'clamp(15px, 2.5vw, 20px)' }}
          >
            &ldquo;Their meat will not reach Allah, nor will their blood — but
            what reaches Him is the piety from you.&rdquo;
          </motion.p>

          <motion.p
            {...pageFadeUp(0.35, ayahIn)}
            className="text-[10px] font-bold tracking-[0.16em] uppercase text-[hsl(45,70%,45%)]/65 mb-8"
          >
            Surah Al-Hajj &nbsp;·&nbsp; 22:37
          </motion.p>

          <GirihDivider />

          <motion.p
            {...pageFadeUp(0.45, ayahIn)}
            className="text-[13px] sm:text-[14px] leading-[1.95] text-[hsl(42,30%,96%)]/45 max-w-xl mx-auto"
          >
            Your Qurbani this Eid was not merely ritual — it was a declaration
            of taqwa, a heartfelt submission to the command of Allah. May He
            accept that sincerity from every one of you.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          §3  IMPACT — 1909 Counter (fixed — no ghost number behind)
      ═══════════════════════════════════════════════════════════ */}
      <section
        ref={impactRef}
        className="relative bg-[#0b1a0c] overflow-hidden py-20 sm:py-28 lg:py-36"
      >
        <IslamicCirclesBg id="impact-geo" opacity={0.045} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{ backgroundImage: GRAIN, backgroundSize: '128px' }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/25 to-transparent" />

        {/* Khatam as decorative art behind counter — not a ghost number */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <KhatamMedallion className="w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] text-[hsl(45,70%,45%)]/[0.09]" />
        </div>

        <div className="relative z-10 text-center px-5">
          <motion.p
            {...pageFadeUp(0, impactIn)}
            className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(45,70%,45%)] mb-10 sm:mb-14"
          >
            Alhamdulillah — The Impact
          </motion.p>

          {/* Counter — isolated, no competing ghost text */}
          <motion.div
            ref={counterRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={impactIn ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative inline-block mb-4 sm:mb-5"
          >
            <motion.span
              animate={{ scale: [1, 1.07, 1], opacity: [0.1, 0.22, 0.1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute inset-[-22px] sm:inset-[-38px] rounded-full border border-[hsl(45,70%,45%)]"
            />
            <motion.span
              animate={{ scale: [1, 1.14, 1], opacity: [0.05, 0.12, 0.05] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              className="pointer-events-none absolute inset-[-46px] sm:inset-[-74px] rounded-full border border-[hsl(45,70%,45%)]"
            />
            <span
              className="relative z-10 block font-serif font-bold text-[hsl(45,70%,53%)] leading-none tabular-nums"
              style={{ fontSize: 'clamp(80px, 22vw, 172px)' }}
            >
              {count.toLocaleString()}
            </span>
          </motion.div>

          <motion.div {...pageFadeUp(0.3, impactIn)}>
            <p
              className="font-serif font-normal text-[hsl(42,30%,93%)] leading-[1.3] mb-3"
              style={{ fontSize: 'clamp(18px, 4vw, 34px)' }}
            >
              Houses Received Qurbani Meat
            </p>
            <p
              dir="rtl"
              className="font-arabic text-[hsl(45,70%,44%)] leading-[2] mb-6"
              style={{ fontSize: 'clamp(16px, 3.5vw, 26px)' }}
            >
              گھروں تک پہنچا قربانی کا گوشت
            </p>
            <GirihDivider />
            <p className="text-[13px] sm:text-[14px] text-[hsl(42,30%,96%)]/42 leading-relaxed max-w-sm mx-auto">
              Distributed across 2 days with sincerity, care, and in the spirit
              of the blessed Sunnah.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          §4  HADITH CARDS
      ═══════════════════════════════════════════════════════════ */}
      <section
        ref={hadithRef}
        className="relative bg-[hsl(156,31%,10%)] overflow-hidden py-16 sm:py-24"
      >
        <IslamicCirclesBg id="hadith-geo" opacity={0.055} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: GRAIN, backgroundSize: '128px' }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/25 to-transparent" />

        <KhatamMedallion className="pointer-events-none absolute -top-14 -right-14 w-48 h-48 text-[hsl(45,70%,45%)]/[0.07]" />
        <KhatamMedallion className="pointer-events-none absolute -bottom-14 -left-14 w-40 h-40 text-[hsl(45,70%,45%)]/[0.06]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...pageFadeUp(0, hadithIn)} className="text-center mb-10 sm:mb-14">
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(45,70%,45%)] mb-3">
              From the Sunnah
            </p>
            <h2
              className="font-serif font-normal text-[hsl(42,30%,95%)] leading-[1.2] mb-4"
              style={{ fontSize: 'clamp(20px, 3.8vw, 36px)' }}
            >
              The Prophet ﷺ Said
            </h2>
            <div className="h-[1.5px] w-12 bg-[hsl(45,70%,45%)] mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
            {HADITHS.map((h, i) => (
              <motion.div
                key={i}
                {...pageFadeUp(0.1 + i * 0.14, hadithIn)}
              >
                <CornerBrackets className="h-full border border-[hsl(45,70%,45%)]/16 bg-[hsl(45,70%,45%)]/[0.04] rounded-[4px] p-6 sm:p-7">
                  <p
                    dir="rtl"
                    className="font-arabic text-[hsl(45,70%,50%)] leading-[2] mb-5 text-center"
                    style={{ fontSize: 'clamp(15px, 2.8vw, 22px)' }}
                  >
                    {h.arabic}
                  </p>
                  <div className="h-px bg-[hsl(45,70%,45%)]/20 mb-5" />
                  <p className="font-serif italic text-[hsl(42,30%,92%)] leading-[1.8] mb-5 text-center text-[13px] sm:text-[14px]">
                    &ldquo;{h.translation}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[hsl(45,70%,45%)]/50" />
                    <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-[hsl(45,70%,45%)]/55">
                      {h.source}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-[hsl(45,70%,45%)]/50" />
                  </div>
                </CornerBrackets>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          §5  DISTRIBUTION VIDEOS
      ═══════════════════════════════════════════════════════════ */}
      <section
        ref={videoRef}
        className="relative bg-[hsl(156,31%,8%)] overflow-hidden py-16 sm:py-24"
      >
        <IslamicCirclesBg id="video-geo" opacity={0.04} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: GRAIN, backgroundSize: '128px' }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/35 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...pageFadeUp(0, videoIn)} className="text-center mb-10 sm:mb-14">
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(45,70%,45%)] mb-3">
              Distribution Footage
            </p>
            <h2
              className="font-serif font-normal text-[hsl(42,30%,95%)] leading-[1.2] mb-4"
              style={{ fontSize: 'clamp(20px, 3.8vw, 36px)' }}
            >
              We Served.{' '}
              <span className="italic text-[hsl(45,70%,52%)]">We Fulfilled.</span>
            </h2>
            <div className="h-[1.5px] w-12 bg-[hsl(45,70%,45%)] mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {VIDEOS.map((v, i) => (
              <motion.div key={v.id} {...pageFadeUp(0.1 + i * 0.14, videoIn)}>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(45,70%,45%)]" />
                  <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[hsl(45,70%,45%)]">
                    {v.day}
                  </p>
                </div>
                <div className="relative w-full aspect-video rounded-[4px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-[hsl(42,30%,96%)]/8">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          §6  CLOSING DU'A & SIGNATURE
      ═══════════════════════════════════════════════════════════ */}
      <section
        ref={closingRef}
        className="relative bg-[#0b1a0c] overflow-hidden py-20 sm:py-28 lg:py-36 text-center px-5"
      >
        <IslamicCirclesBg id="closing-geo" opacity={0.05} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{ backgroundImage: GRAIN, backgroundSize: '128px' }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 60% at 50% 50%, hsl(156,38%,13%) 0%, transparent 68%)',
          }}
        />
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)] to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/30 to-transparent" />

        {cornerLines.map((cls, i) => (
          <div key={i} className={`pointer-events-none absolute ${cls} w-14 h-14 border-[hsl(45,70%,45%)]/20`} />
        ))}

        {/* Large khatam centred as decorative art */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <KhatamMedallion className="w-[380px] h-[380px] sm:w-[560px] sm:h-[560px] text-[hsl(45,70%,45%)]/[0.07]" />
        </div>

        <ArabesqueRosette className="absolute top-6 left-6 sm:top-12 sm:left-12 w-24 h-24 sm:w-36 sm:h-36 text-[hsl(45,70%,45%)]/[0.1]" />
        <ArabesqueRosette className="absolute top-6 right-6 sm:top-12 sm:right-12 w-24 h-24 sm:w-36 sm:h-36 text-[hsl(45,70%,45%)]/[0.1]" />
        <ArabesqueRosette className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 w-20 h-20 sm:w-28 sm:h-28 text-[hsl(45,70%,45%)]/[0.07]" />
        <ArabesqueRosette className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 w-20 h-20 sm:w-28 sm:h-28 text-[hsl(45,70%,45%)]/[0.07]" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={closingIn ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="relative z-10 flex justify-center mb-8 sm:mb-10"
        >
          <MuqarnasArch className="w-44 sm:w-60 text-[hsl(45,70%,45%)]/40" />
        </motion.div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={closingIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            dir="rtl"
            className="font-arabic text-[hsl(45,70%,52%)] leading-[1.65] mb-2 select-none"
            style={{ fontSize: 'clamp(26px, 6.5vw, 56px)' }}
          >
            تَقَبَّلَ اللهُ مِنَّا وَمِنكُم
          </motion.p>

          <motion.p
            {...pageFadeUp(0.2, closingIn)}
            className="font-serif italic text-[hsl(45,70%,35%)] tracking-[0.12em] mb-4"
            style={{ fontSize: 'clamp(11px, 2vw, 14px)' }}
          >
            &ldquo;May Allah accept from us and from you.&rdquo;
          </motion.p>

          <motion.p
            {...pageFadeUp(0.28, closingIn)}
            dir="rtl"
            className="font-arabic text-[hsl(45,70%,40%)]/70 leading-[1.8] mb-2 select-none"
            style={{ fontSize: 'clamp(16px, 3.5vw, 28px)' }}
          >
            اللَّهُمَّ تَقَبَّلْ قُرْبَانَنَا
          </motion.p>

          <motion.p
            {...pageFadeUp(0.35, closingIn)}
            className="font-serif italic text-[hsl(45,70%,30%)]/70 tracking-[0.1em] mb-2"
            style={{ fontSize: 'clamp(10px, 1.8vw, 13px)' }}
          >
            &ldquo;O Allah, accept our sacrifice.&rdquo;
          </motion.p>

          <GirihDivider />

          <motion.p
            {...pageFadeUp(0.15, closingIn)}
            className="text-[13px] sm:text-[15px] leading-[1.95] text-[hsl(42,30%,96%)]/48 mb-12 sm:mb-14"
          >
            May Allah accept your sacrifice, bless your families, and reward
            you with the highest stations in Jannah. It has been an honour and
            a trust to serve this Ummah alongside you in fulfilling the blessed
            Sunnah of our beloved Prophet Ibrahim ﷺ.
          </motion.p>

          {/* Signature */}
          <motion.div {...pageFadeUp(0.25, closingIn)} className="mb-12 sm:mb-14">
            <div className="inline-flex flex-col items-center gap-2.5">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-[hsl(45,70%,45%)]/50" />
                <span className="w-1.5 h-1.5 rotate-45 bg-[hsl(45,70%,45%)]/60 inline-block" />
                <div className="h-px w-8 bg-[hsl(45,70%,45%)]/50" />
              </div>
              <p
                dir="rtl"
                className="font-arabic text-[hsl(45,70%,50%)] leading-[2] select-none"
                style={{ fontSize: 'clamp(18px, 4vw, 30px)' }}
              >
                خانقاه سيفية مرشدآباد شريف
              </p>
              <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-[hsl(42,30%,96%)]/32">
                Khanqah Saifia Murshidabad Shareef
              </p>
              <p className="text-[9px] tracking-[0.12em] uppercase text-[hsl(42,30%,96%)]/20">
                Faisalabad · Pakistan
              </p>
            </div>
          </motion.div>

          {/* Next year callout */}
          <motion.div {...pageFadeUp(0.35, closingIn)}>
            <CornerBrackets className="inline-block border border-[hsl(45,70%,45%)]/16 bg-[hsl(45,70%,45%)]/[0.04] rounded-[4px] px-7 sm:px-10 py-4 sm:py-5">
              <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-[hsl(45,70%,45%)]/60 mb-1.5">
                Coming Next Year
              </p>
              <p className="text-[13px] sm:text-[14px] text-[hsl(42,30%,96%)]/48">
                Qurbani 1447H registration will open in early 2026.
              </p>
            </CornerBrackets>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
