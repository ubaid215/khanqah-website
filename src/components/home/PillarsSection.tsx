// src/components/home/PillarsSection.tsx
"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────
const pillars = [
  {
    number: 1,
    arabicNumeral: "١",
    arabicName: "الشَّهَادَة",
    transliteration: "Ash-Shahādah",
    englishName: "Declaration of Faith",
    arabicText: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ مُحَمَّدٌ رَسُولُ ٱللَّٰهِ",
    description:
      "The testimony that there is no god but Allah, and that Muhammad ﷺ is His messenger — the foundation upon which all of Islam rests.",
    href: "/teachings/pillars/shahada",
    accentHue: "45",   // gold
  },
  {
    number: 2,
    arabicNumeral: "٢",
    arabicName: "الصَّلَاة",
    transliteration: "As-Salāh",
    englishName: "Prayer",
    arabicText: "أَقِيمُوا الصَّلَاةَ",
    description:
      "The five daily prayers that anchor the believer to Allah throughout the day — at dawn, midday, afternoon, sunset, and night.",
    href: "/teachings/pillars/salah",
    accentHue: "156",  // green
  },
  {
    number: 3,
    arabicNumeral: "٣",
    arabicName: "الزَّكَاة",
    transliteration: "Az-Zakāh",
    englishName: "Almsgiving",
    arabicText: "وَآتُوا الزَّكَاةَ",
    description:
      "The annual purification of wealth through giving — an obligation that purifies the soul and uplifts the entire community.",
    href: "/teachings/pillars/zakat",
    accentHue: "45",   // gold
  },
  {
    number: 4,
    arabicNumeral: "٤",
    arabicName: "الصَّوْم",
    transliteration: "As-Sawm",
    englishName: "Fasting",
    arabicText: "كُتِبَ عَلَيْكُمُ الصِّيَامُ",
    description:
      "The fast of Ramadan — abstaining from food, drink, and desire from dawn to sunset as an act of devotion and self-discipline.",
    href: "/teachings/pillars/sawm",
    accentHue: "156",  // green
  },
  {
    number: 5,
    arabicNumeral: "٥",
    arabicName: "الْحَجّ",
    transliteration: "Al-Hajj",
    englishName: "Pilgrimage",
    arabicText: "وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ",
    description:
      "The pilgrimage to the sacred house in Makkah — a once-in-a-lifetime journey that unites Muslims from every corner of the earth.",
    href: "/teachings/pillars/hajj",
    accentHue: "45",   // gold
  },
];

// ─── New Geometric Shape: Ornamental Circle Pattern ──────────────────────────
const OrnamentalCircle = ({ hue }: { hue: string }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full"
    aria-hidden
  >
    {/* Concentric circles */}
    <circle cx="100" cy="94" r="70" stroke={`hsl(${hue},70%,50%)`} strokeWidth="0.5" fill="none" opacity="0.25" />
    <circle cx="100" cy="94" r="55" stroke={`hsl(${hue},70%,55%)`} strokeWidth="0.5" fill="none" opacity="0.2" strokeDasharray="4 4" />
    <circle cx="100" cy="94" r="40" stroke={`hsl(${hue},70%,58%)`} strokeWidth="0.5" fill="none" opacity="0.2" />
    
    {/* Dotted circle */}
    <circle cx="100" cy="94" r="25" stroke={`hsl(${hue},70%,60%)`} strokeWidth="1.5" fill="none" opacity="0.2" strokeDasharray="2 6" />
    
    {/* Center decorative element - small star-like shape */}
    <circle cx="100" cy="94" r="5" fill={`hsl(${hue},70%,55%)`} opacity="0.3" />
    <circle cx="100" cy="94" r="2" fill={`hsl(${hue},70%,65%)`} opacity="0.4" />
    
    {/* Radiating dots */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
      const radian = (angle * Math.PI) / 180;
      const x = 100 + 48 * Math.cos(radian);
      const y = 94 + 48 * Math.sin(radian);
      return (
        <circle
          key={angle}
          cx={x}
          cy={y}
          r="1.5"
          fill={`hsl(${hue},70%,50%)`}
          opacity="0.25"
        />
      );
    })}
  </svg>
);

// ─── Mobile Card Component with Touch Optimization ──────────────────────────
const MobilePillarCard = ({
  pillar,
}: {
  pillar: (typeof pillars)[0];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-full"
    >
      <Link href={pillar.href} className="block w-full focus:outline-none">
        <div
          className={`
            relative overflow-hidden rounded-[4px]
            bg-[hsl(156,31%,11%)]
            border border-[hsl(${pillar.accentHue},70%,45%)]
            shadow-[0_10px_30px_rgba(0,0,0,0.3)]
          `}
        >
          {/* Ornamental pattern */}
          <div className="absolute inset-0 opacity-30">
            <OrnamentalCircle hue={pillar.accentHue} />
          </div>

          {/* Content */}
          <div className="relative z-10 p-5">
            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
              <span
                className={`
                  font-arabic text-4xl leading-none font-normal select-none
                  text-[hsl(${pillar.accentHue},70%,45%)]/40
                `}
                aria-hidden
              >
                {pillar.arabicNumeral}
              </span>
              <span
                className={`
                  text-[9px] font-bold tracking-[0.16em] uppercase px-2 py-1 rounded-full
                  border border-[hsl(${pillar.accentHue},70%,45%)]/30 
                  text-[hsl(${pillar.accentHue},70%,55%)]
                `}
              >
                Pillar {pillar.number}
              </span>
            </div>

            {/* Arabic name */}
            <p className="font-arabic text-xl leading-relaxed mb-1 text-[hsl(42,30%,96%)]/80">
              {pillar.arabicName}
            </p>

            {/* English name */}
            <h3 className="font-serif text-base font-normal text-[hsl(42,30%,92%)] leading-tight mb-2">
              {pillar.englishName}
            </h3>

            {/* Thin rule */}
            <div className={`w-8 h-px mb-3 bg-[hsl(${pillar.accentHue},70%,45%)]`} />

            {/* Description - truncated for mobile */}
            <p className="text-[11px] leading-relaxed text-[hsl(42,30%,96%)]/50 line-clamp-3">
              {pillar.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// ─── Desktop Pillar Card ───────────────────────────────────────────────────────
const DesktopPillarCard = ({
  pillar,
  index,
  isInView,
}: {
  pillar: (typeof pillars)[0];
  index: number;
  isInView: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.1,
      }}
      className="group relative"
    >
      <Link href={pillar.href} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(45,70%,45%)] rounded-[4px]">
        <div
          className={`
            relative h-full overflow-hidden rounded-[4px] cursor-pointer
            bg-[hsl(156,31%,11%)]
            border border-[hsl(156,20%,20%)]
            transition-all duration-500 ease-out
            group-hover:border-[hsl(${pillar.accentHue},70%,45%)]
            group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_0_1px_hsl(${pillar.accentHue},70%,45%)]
            group-hover:-translate-y-2
          `}
        >
          {/* Ornamental pattern bloom */}
          <div
            className="absolute inset-0 transition-all duration-700 ease-out scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100"
            style={{ transformOrigin: "center center" }}
          >
            <OrnamentalCircle hue={pillar.accentHue} />
          </div>

          {/* Dark overlay that fades on hover */}
          <div className="absolute inset-0 bg-[hsl(156,31%,8%)]/60 transition-opacity duration-500 group-hover:opacity-0" />

          {/* Gold bottom border slide-in */}
          <div
            className={`
              absolute bottom-0 left-0 h-[2px] w-0
              bg-gradient-to-r from-[hsl(${pillar.accentHue},70%,45%)] to-[hsl(${pillar.accentHue},70%,60%)]
              transition-all duration-500 ease-out
              group-hover:w-full
            `}
          />

          {/* Content */}
          <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full min-h-[320px]">

            {/* Top row: number badge + pillar count label */}
            <div className="flex items-start justify-between mb-4">
              <span
                className={`
                  font-arabic text-[52px] sm:text-[60px] leading-none font-normal select-none
                  text-[hsl(42,30%,96%)]/10
                  transition-all duration-500
                  group-hover:text-[hsl(${pillar.accentHue},70%,45%)]/30
                `}
                aria-hidden
              >
                {pillar.arabicNumeral}
              </span>

              <span
                className={`
                  text-[9px] font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full
                  border transition-all duration-300
                  border-[hsl(42,30%,96%)]/15 text-[hsl(42,30%,96%)]/35
                  group-hover:border-[hsl(${pillar.accentHue},70%,45%)]/50
                  group-hover:text-[hsl(${pillar.accentHue},70%,55%)]
                `}
              >
                Pillar {pillar.number}
              </span>
            </div>

            {/* Arabic name */}
            <p
              className={`
                font-arabic text-2xl sm:text-3xl leading-relaxed mb-1
                text-[hsl(42,30%,96%)]/80
                transition-all duration-400
                group-hover:text-[hsl(${pillar.accentHue},70%,55%)]
              `}
            >
              {pillar.arabicName}
            </p>

            {/* Transliteration */}
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[hsl(42,30%,96%)]/30 mb-1 transition-colors duration-300 group-hover:text-[hsl(42,30%,96%)]/50">
              {pillar.transliteration}
            </p>

            {/* English name */}
            <h3 className="font-serif text-[18px] sm:text-[20px] font-normal text-[hsl(42,30%,92%)] leading-tight mb-4 transition-colors duration-300">
              {pillar.englishName}
            </h3>

            {/* Gold thin rule */}
            <div
              className={`
                w-8 h-px mb-4
                bg-[hsl(${pillar.accentHue},70%,45%)]
                transition-all duration-500
                group-hover:w-14
              `}
            />

            {/* Description */}
            <p className="text-[12px] sm:text-[13px] leading-[1.8] text-[hsl(42,30%,96%)]/40 transition-all duration-400 group-hover:text-[hsl(42,30%,96%)]/65 flex-1">
              {pillar.description}
            </p>

            {/* Bottom: Ayah snippet */}
            <div
              className={`
                mt-5 pt-4 border-t
                border-[hsl(42,30%,96%)]/8
                transition-colors duration-300
                group-hover:border-[hsl(${pillar.accentHue},70%,45%)]/20
              `}
            >
              <p
                className={`
                  font-arabic text-sm leading-relaxed text-right
                  text-[hsl(42,30%,96%)]/25
                  transition-all duration-400
                  group-hover:text-[hsl(${pillar.accentHue},70%,50%)]/70
                `}
              >
                {pillar.arabicText}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// ─── Section ──────────────────────────────────────────────────────────────────
const PillarsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : pillars.length - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev < pillars.length - 1 ? prev + 1 : 0));
  };

  return (
    <section
      ref={ref}
      className="relative bg-[hsl(156,31%,9%)] overflow-hidden py-16 lg:py-28"
    >
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      {/* Large ghosted "أركان الإسلام" watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none z-0">
        <span
          className="font-arabic text-[hsl(42,30%,96%)]/[0.025] whitespace-nowrap"
          style={{ fontSize: "clamp(60px, 12vw, 140px)" }}
          aria-hidden
        >
          أَرْكَانُ الْإِسْلَامِ
        </span>
      </div>

      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)] to-transparent" />

      <div className="container-sacred relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 lg:mb-16"
        >
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[hsl(45,70%,45%)] mb-4">
            The Foundation
          </p>
          <h2 className="font-serif font-normal text-[hsl(42,30%,94%)] leading-[1.2] mb-4"
            style={{ fontSize: "clamp(28px, 4.5vw, 48px)" }}
          >
            The Five Pillars of Islam
          </h2>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[hsl(45,70%,45%)]" />
            <span className="font-arabic text-xl text-[hsl(45,70%,50%)]">أركان الإسلام</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[hsl(45,70%,45%)]" />
          </div>
          <p className="text-[14px] sm:text-[15px] text-[hsl(42,30%,96%)]/45 max-w-xl mx-auto leading-relaxed">
            The five acts of worship that form the core of a Muslim's faith and practice — the pillars upon which the life of every believer is built.
          </p>
        </motion.div>

        {/* ── Mobile Optimized Carousel ── */}
        <div className="block lg:hidden">
          <div className="relative px-8">
            {/* Active Card Display */}
            <div className="mb-6">
              <MobilePillarCard pillar={pillars[activeIndex]} />
            </div>

            {/* Navigation Arrows - Fixed positioning with proper z-index */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[hsl(156,31%,15%)] border border-[hsl(156,20%,25%)] flex items-center justify-center text-[hsl(42,30%,96%)]/60 hover:text-[hsl(45,70%,45%)] hover:border-[hsl(45,70%,45%)] transition-all duration-300 shadow-lg cursor-pointer"
              aria-label="Previous pillar"
              style={{ touchAction: 'manipulation' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[hsl(156,31%,15%)] border border-[hsl(156,20%,25%)] flex items-center justify-center text-[hsl(42,30%,96%)]/60 hover:text-[hsl(45,70%,45%)] hover:border-[hsl(45,70%,45%)] transition-all duration-300 shadow-lg cursor-pointer"
              aria-label="Next pillar"
              style={{ touchAction: 'manipulation' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Thumbnail Navigation */}
            <div className="flex gap-2 justify-center flex-wrap mt-4">
              {pillars.map((pillar, idx) => (
                <button
                  key={pillar.number}
                  onClick={() => setActiveIndex(idx)}
                  className={`
                    transition-all duration-300 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer
                    ${activeIndex === idx 
                      ? `bg-[hsl(${pillar.accentHue},70%,45%)] text-[hsl(156,31%,9%)]` 
                      : 'bg-[hsl(156,31%,15%)] text-[hsl(42,30%,96%)]/50 hover:bg-[hsl(156,31%,18%)]'
                    }
                  `}
                  style={{ touchAction: 'manipulation' }}
                >
                  {pillar.number}. {pillar.englishName.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-1.5 mt-6">
            {pillars.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`
                  transition-all duration-300 rounded-full cursor-pointer
                  ${activeIndex === idx 
                    ? `w-6 h-1.5 bg-[hsl(45,70%,45%)]` 
                    : 'w-1.5 h-1.5 bg-[hsl(42,30%,96%)]/20 hover:bg-[hsl(42,30%,96%)]/40'
                  }
                `}
                aria-label={`Go to pillar ${idx + 1}`}
                style={{ touchAction: 'manipulation' }}
              />
            ))}
          </div>
        </div>

        {/* ── Desktop Grid (5 columns) ── */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-5">
          {pillars.map((pillar, i) => (
            <DesktopPillarCard key={pillar.number} pillar={pillar} index={i} isInView={isInView} />
          ))}
        </div>

        {/* ── Tablet Grid (2 columns) ── */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:hidden gap-5">
          {pillars.map((pillar, i) => (
            <DesktopPillarCard key={pillar.number} pillar={pillar} index={i} isInView={isInView} />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-12 lg:mt-14"
        >
          <Link href="/teachings">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden px-7 py-3 border border-[hsl(45,70%,45%)]/40 text-[hsl(45,70%,55%)] text-[11px] font-bold tracking-[0.14em] uppercase rounded-[3px] hover:border-[hsl(45,70%,45%)] hover:text-[hsl(45,70%,60%)] transition-all duration-300"
            >
              <span className="absolute inset-0 bg-[hsl(45,70%,45%)]/0 group-hover:bg-[hsl(45,70%,45%)]/8 transition-colors duration-300" />
              <span className="relative flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-current" />
                Explore All Teachings
                <span className="w-1 h-1 rounded-full bg-current" />
              </span>
            </motion.button>
          </Link>
        </motion.div>

      </div>

      {/* Bottom gold rule */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/40 to-transparent" />
    </section>
  );
};

export default PillarsSection;