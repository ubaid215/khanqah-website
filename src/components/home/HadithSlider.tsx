// src/components/home/HadithSlider.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
const hadiths = [
  {
    id: 1,
    arabicText: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    translation:
      "Actions are judged only by intentions, and every person will have only what they intended.",
    narrator: "Umar ibn al-Khattab رضي الله عنه",
    source: "Sahih al-Bukhari",
    bookRef: "Book 1, Hadith 1",
    topic: "Intention",
  },
  {
    id: 2,
    arabicText: "الدِّينُ النَّصِيحَةُ",
    translation:
      "The religion is sincerity and well-wishing.",
    narrator: "Tamim al-Dari رضي الله عنه",
    source: "Sahih Muslim",
    bookRef: "Book 1, Hadith 95",
    topic: "Sincerity",
  },
  {
    id: 3,
    arabicText: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translation:
      "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
    narrator: "Abu Hurairah رضي الله عنه",
    source: "Sahih al-Bukhari",
    bookRef: "Book 78, Hadith 47",
    topic: "Speech",
  },
  {
    id: 4,
    arabicText: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    translation:
      "None of you truly believes until he loves for his brother what he loves for himself.",
    narrator: "Anas ibn Malik رضي الله عنه",
    source: "Sahih al-Bukhari",
    bookRef: "Book 2, Hadith 7",
    topic: "Brotherhood",
  },
  {
    id: 5,
    arabicText: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    translation:
      "Seeking knowledge is an obligation upon every Muslim.",
    narrator: "Anas ibn Malik رضي الله عنه",
    source: "Sunan Ibn Majah",
    bookRef: "Book 1, Hadith 224",
    topic: "Knowledge",
  },
  {
    id: 6,
    arabicText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    translation:
      "A Muslim is one from whose tongue and hand other Muslims are safe.",
    narrator: "Abdullah ibn Amr رضي الله عنه",
    source: "Sahih al-Bukhari",
    bookRef: "Book 2, Hadith 9",
    topic: "Character",
  },
  {
    id: 7,
    arabicText: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    translation:
      "The best among you are those who learn the Quran and teach it.",
    narrator: "Uthman ibn Affan رضي الله عنه",
    source: "Sahih al-Bukhari",
    bookRef: "Book 61, Hadith 545",
    topic: "Quran",
  },
];

// ─── Open-quote SVG ───────────────────────────────────────────────────────────
const QuoteMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 40 30"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path d="M0 30V18.75C0 13.125 1.875 8.4375 5.625 4.6875C9.375 0.9375 14.375 -0.625 20.625 0.25L21.25 3.875C17.5 4.5 14.6875 5.9375 12.8125 8.1875C10.9375 10.4375 10 13 10 15.875H17.5V30H0ZM22.5 30V18.75C22.5 13.125 24.375 8.4375 28.125 4.6875C31.875 0.9375 36.875 -0.625 43.125 0.25L43.75 3.875C40 4.5 37.1875 5.9375 35.3125 8.1875C33.4375 10.4375 32.5 13 32.5 15.875H40V30H22.5Z" />
  </svg>
);

// ─── Slider dots ──────────────────────────────────────────────────────────────
const Dots = ({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (i: number) => void;
}) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        aria-label={`Go to hadith ${i + 1}`}
        className="focus:outline-none"
      >
        <motion.div
          animate={{
            width: i === current ? 20 : 5,
            backgroundColor:
              i === current ? "hsl(45,70%,45%)" : "rgba(255,255,255,0.2)",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-[4px] rounded-full"
        />
      </button>
    ))}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
const HadithSlider = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const dragStartX = useRef(0);

  const go = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setCurrent((next + hadiths.length) % hadiths.length);
    },
    []
  );

  const prev = useCallback(() => go(current - 1, -1), [current, go]);
  const next = useCallback(() => go(current + 1, 1), [current, go]);

  // Auto-play
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(current + 1, 1), 6000);
    return () => clearInterval(id);
  }, [current, paused, go]);

  // Drag / swipe
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragStartX.current =
      "touches" in e ? e.touches[0].clientX : e.clientX;
    setPaused(true);
  };
  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX.current - endX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    setTimeout(() => setPaused(false), 1500);
  };

  const hadith = hadiths[current];

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <section
      ref={ref}
      className="relative bg-[hsl(156,31%,9%)] overflow-hidden py-20 lg:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, hsl(156,25%,14%) 0%, transparent 70%)",
        }}
      />

      {/* Corner arcs */}
      <div className="pointer-events-none absolute top-0 right-0 w-56 h-56 lg:w-80 lg:h-80 border-r border-t border-[hsl(45,70%,45%)]/10 rounded-tr-full z-0" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-40 h-40 lg:w-60 lg:h-60 border-l border-b border-[hsl(45,70%,45%)]/10 rounded-bl-full z-0" />

      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)] to-transparent" />

      <div className="container-sacred relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 lg:mb-16"
        >
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[hsl(45,70%,45%)] mb-4">
            Prophetic Wisdom
          </p>
          <h2
            className="font-serif font-normal text-[hsl(42,30%,94%)] leading-[1.2] mb-4"
            style={{ fontSize: "clamp(26px, 4vw, 44px)" }}
          >
            Words of the Prophet ﷺ
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[hsl(45,70%,45%)]" />
            <span className="font-arabic text-lg text-[hsl(45,70%,50%)]">أحاديث نبوية</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[hsl(45,70%,45%)]" />
          </div>
        </motion.div>

        {/* ── Slider ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Slide area */}
          <div
            className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Quote card */}
                <div className="relative bg-[hsl(156,31%,11%)] border border-[hsl(156,20%,18%)] rounded-[4px] px-6 sm:px-10 lg:px-14 py-10 lg:py-14">

                  {/* Opening quotemark */}
                  <QuoteMark className="absolute top-6 left-6 sm:left-10 w-7 h-5 text-[hsl(45,70%,45%)]/25" />

                  {/* Topic badge */}
                  <div className="flex justify-center mb-7">
                    <span className="text-[9px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full border border-[hsl(45,70%,45%)]/30 text-[hsl(45,70%,50%)]">
                      {hadith.topic}
                    </span>
                  </div>

                  {/* Arabic text */}
                  <p className="font-arabic text-center leading-[2] text-[hsl(42,30%,94%)] mb-6"
                    style={{ fontSize: "clamp(18px, 3.5vw, 28px)" }}
                  >
                    {hadith.arabicText}
                  </p>

                  {/* Gold divider */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-[hsl(45,70%,45%)]/40" />
                    <span className="text-[hsl(45,70%,45%)] text-xs">✦</span>
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-[hsl(45,70%,45%)]/40" />
                  </div>

                  {/* Translation */}
                  <p className="font-serif font-normal text-center text-[hsl(42,30%,85%)] leading-[1.75] mb-8 italic"
                    style={{ fontSize: "clamp(15px, 2vw, 19px)" }}
                  >
                    "{hadith.translation}"
                  </p>

                  {/* Reference block */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
                    <p className="text-[12px] font-semibold text-[hsl(42,30%,60%)]">
                      {hadith.narrator}
                    </p>
                    <span className="hidden sm:block text-[hsl(42,30%,96%)]/15">·</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[hsl(45,70%,45%)]">
                        {hadith.source}
                      </span>
                      <span className="text-[hsl(42,30%,96%)]/15 text-xs">|</span>
                      <span className="text-[10px] text-[hsl(42,30%,50%)]">
                        {hadith.bookRef}
                      </span>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Controls row ── */}
          <div className="mt-8 flex items-center justify-between px-1">
            {/* Prev / Next arrows */}
            <button
              onClick={prev}
              aria-label="Previous hadith"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[hsl(42,30%,96%)]/15 text-[hsl(42,30%,60%)] hover:border-[hsl(45,70%,45%)]/50 hover:text-[hsl(45,70%,50%)] transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Dots */}
            <Dots
              total={hadiths.length}
              current={current}
              onSelect={(i) => go(i, i > current ? 1 : -1)}
            />

            <button
              onClick={next}
              aria-label="Next hadith"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[hsl(42,30%,96%)]/15 text-[hsl(42,30%,60%)] hover:border-[hsl(45,70%,45%)]/50 hover:text-[hsl(45,70%,50%)] transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Hadith count */}
          <p className="text-center mt-4 text-[10px] font-bold tracking-[0.12em] uppercase text-[hsl(42,30%,96%)]/20">
            {String(current + 1).padStart(2, "0")} / {String(hadiths.length).padStart(2, "0")}
          </p>
        </motion.div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/30 to-transparent" />
    </section>
  );
};

export default HadithSlider;