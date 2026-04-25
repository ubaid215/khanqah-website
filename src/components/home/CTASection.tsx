// src/components/home/CTASection.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// ─── Inline star/crescent SVG decoration ─────────────────────────────────────
const IslamicStar = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <polygon
      points="40,4 47,28 72,28 52,44 59,68 40,54 21,68 28,44 8,28 33,28"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <circle cx="40" cy="40" r="10" stroke="currentColor" strokeWidth="0.8" fill="none" />
    <circle cx="40" cy="40" r="3" fill="currentColor" opacity="0.5" />
  </svg>
);

// ─── Geometric corner ornament ────────────────────────────────────────────────
const CornerOrnament = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <path d="M0 60 L0 0 L60 0" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M0 40 L20 40 L20 20 L40 20 L40 0" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.35" />
    <circle cx="0" cy="0" r="6" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4" />
  </svg>
);

// ─── CTA Section ──────────────────────────────────────────────────────────────
const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative bg-[hsl(156,31%,10%)] overflow-hidden"
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
            "radial-gradient(ellipse 80% 80% at 50% 100%, hsl(156,25%,16%) 0%, transparent 65%)",
        }}
      />

      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)] to-transparent z-10" />

      {/* Corner ornaments */}
      <CornerOrnament className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 text-[hsl(45,70%,45%)] z-0" />
      <CornerOrnament className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 text-[hsl(45,70%,45%)] z-0 rotate-180" />

      {/* Floating stars decoration */}
      <IslamicStar className="absolute top-8 right-[12%] w-12 h-12 text-[hsl(45,70%,45%)]/10 z-0" />
      <IslamicStar className="absolute bottom-8 left-[8%] w-8 h-8 text-[hsl(45,70%,45%)]/10 z-0" />

      {/* ── Inner layout ── */}
      <div className="container-sacred relative z-10 py-20 lg:py-0 lg:min-h-[420px] flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-center">

          {/* ── LEFT — Arabic calligraphy ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center lg:items-start lg:pr-12 xl:pr-20 lg:border-r lg:border-[hsl(42,30%,96%)]/8 py-0 lg:py-16"
          >
            {/* Large calligraphy */}
            <p
              className="font-arabic font-normal text-center lg:text-right text-[hsl(45,70%,45%)] leading-[1.6] mb-4 select-none"
              style={{ fontSize: "clamp(32px, 6vw, 64px)" }}
            >
              وَمَن يَتَّقِ اللَّهَ
            </p>
            <p
              className="font-arabic font-normal text-center lg:text-right text-[hsl(42,30%,94%)] leading-[1.6] mb-4 select-none"
              style={{ fontSize: "clamp(28px, 5vw, 54px)" }}
            >
              يَجْعَل لَّهُ مَخْرَجًا
            </p>

            {/* Gold rule */}
            <div className="h-px w-16 bg-[hsl(45,70%,45%)] mb-4" />

            {/* Translation */}
            <p className="font-serif italic text-center lg:text-right text-[hsl(42,30%,80%)] leading-relaxed"
              style={{ fontSize: "clamp(13px, 1.6vw, 16px)" }}
            >
              "And whoever fears Allah — He will make for him a way out."
            </p>
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[hsl(45,70%,45%)] mt-2 text-center lg:text-right">
              Surah At-Talaq 65:2
            </p>
          </motion.div>

          {/* ── RIGHT — Action block ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="flex flex-col items-center lg:items-start lg:pl-12 xl:pl-20"
          >
            {/* Label */}
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[hsl(45,70%,45%)] mb-5">
              Take the First Step
            </p>

            {/* Heading */}
            <h2
              className="font-serif font-normal text-[hsl(42,30%,95%)] leading-[1.2] mb-5 text-center lg:text-left"
              style={{ fontSize: "clamp(24px, 4vw, 40px)" }}
            >
              Begin Your Spiritual
              <br />
              <span className="italic text-[hsl(45,70%,50%)]">Journey Today</span>
            </h2>

            {/* Body */}
            <p className="text-[13px] sm:text-[14px] leading-[1.85] text-[hsl(42,30%,96%)]/50 mb-8 max-w-sm text-center lg:text-left">
              Whether you seek Quranic knowledge, spiritual guidance, or a
              welcoming community — the doors of Khanqah Saifia are open to
              every sincere seeker.
            </p>

            {/* Stats row */}
            <div className="flex items-stretch gap-0 mb-8 w-full max-w-xs rounded-[3px] overflow-hidden border border-[hsl(42,30%,96%)]/10">
              {[
                { val: "20+", label: "Years" },
                { val: "Free", label: "Education" },
                { val: "500+", label: "Students" },
              ].map((stat, i, arr) => (
                <div
                  key={stat.label}
                  className={`flex-1 py-3 text-center ${i < arr.length - 1 ? "border-r border-[hsl(42,30%,96%)]/10" : ""}`}
                >
                  <p className="font-serif text-[18px] text-[hsl(45,70%,50%)] leading-none mb-0.5">
                    {stat.val}
                  </p>
                  <p className="text-[9px] font-bold tracking-[0.1em] uppercase text-[hsl(42,30%,96%)]/30">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {/* Primary — Gold shimmer */}
              <Link href="/contact" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative w-full sm:w-auto overflow-hidden px-8 py-3.5 bg-[hsl(45,70%,45%)] text-[hsl(156,31%,10%)] text-[11px] font-bold tracking-[0.14em] uppercase rounded-[3px] hover:bg-[hsl(45,70%,50%)] transition-colors duration-200"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  <span className="relative flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(156,31%,14%)]" />
                    Join the Community
                  </span>
                </motion.button>
              </Link>

              {/* Secondary — outline */}
              <Link href="/donate" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-8 py-3.5 border border-[hsl(42,30%,96%)]/20 text-[hsl(42,30%,75%)] text-[11px] font-bold tracking-[0.14em] uppercase rounded-[3px] hover:border-[hsl(42,30%,96%)]/40 hover:text-[hsl(42,30%,92%)] transition-all duration-200"
                >
                  Support Our Mission
                </motion.button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom gold rule */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/50 to-transparent z-10" />
    </section>
  );
};

export default CTASection;