// src/components/home/AboutSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { value: "20+", label: "Years of Guidance" },
  { value: "120K+", label: "Lives Touched" },
  { value: "Every Sun", label: "Weekly Gathering" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative bg-[hsl(42,30%,96%)] overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      {/* Background grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Faint large Arabic numeral watermark */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none overflow-hidden">
        <span
          className="font-arabic text-[200px] sm:text-[280px] lg:text-[380px] leading-none text-[hsl(156,31%,14%)]/[0.04] whitespace-nowrap"
          aria-hidden
        >
          خانقاه
        </span>
      </div>

      <div className="container-sacred relative px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center">

          {/* ── LEFT — Image block ── */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8 lg:mb-0"
          >
            {/* Gold vertical rule — desktop only */}
            <div className="hidden lg:block absolute -right-8 xl:-right-12 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-[hsl(45,70%,45%)] to-transparent" />

            {/* Main image */}
            <div className="relative aspect-[4/5] rounded-[4px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.14)]">
              <Image
                src="/images/sarkar-mubarik.jpeg"
                alt="Khanqah Saifia — Spiritual Learning Center"
                fill
                className="object-cover"
              />
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(156,31%,8%)]/40 via-transparent to-transparent" />
            </div>

            {/* Overlapping pull-quote card - FIXED: Responsive sizing for mobile */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              className="
                absolute 
                -bottom-4 -right-3 
                sm:-bottom-5 sm:-right-4 
                md:-bottom-6 md:right-0 
                lg:-right-6 
                xl:-right-10 
                max-w-[200px] 
                sm:max-w-[220px] 
                md:max-w-[240px] 
                lg:max-w-[260px]
                bg-[hsl(156,31%,14%)] 
                text-[hsl(42,30%,96%)] 
                p-3 
                sm:p-4 
                md:p-5 
                rounded-[4px] 
                shadow-xl
              "
            >
              <p className="font-arabic text-base sm:text-lg md:text-xl leading-relaxed text-[hsl(45,70%,55%)] mb-1 sm:mb-2">
                وَمَن يَتَّقِ اللَّهَ
              </p>
              <p className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold tracking-[0.1em] uppercase text-[hsl(42,30%,96%)]/60">
                Surah At-Talaq 65:2
              </p>
              <div className="mt-2 sm:mt-3 h-px bg-[hsl(45,70%,45%)]/40" />
              <p className="mt-2 sm:mt-3 text-[10px] sm:text-[11px] md:text-[12px] leading-relaxed text-[hsl(42,30%,96%)]/75">
                "And whoever fears Allah — He will make for him a way out."
              </p>
            </motion.div>
          </motion.div>

          {/* ── RIGHT — Content block ── */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="pt-4 lg:pt-0"
          >
            {/* Label */}
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[hsl(45,70%,45%)] mb-3 sm:mb-4">
              Who We Are
            </p>

            {/* Heading */}
            <h2 className="font-serif font-normal text-[hsl(156,31%,14%)] leading-[1.2] sm:leading-[1.18] mb-4 sm:mb-6
              text-[28px] 
              sm:text-[32px] 
              lg:text-[38px] 
              xl:text-[44px]"
            >
              Where Knowledge Meets{" "}
              <span className="italic text-[hsl(156,25%,32%)]">the Light</span>{" "}
              of the Heart
            </h2>

            {/* Gold rule */}
            <div className="w-12 sm:w-14 h-[2px] bg-[hsl(45,70%,45%)] mb-5 sm:mb-6" />

            {/* Body text */}
            <p className="text-[14px] sm:text-[15px] leading-[1.7] sm:leading-[1.85] text-[hsl(100,5%,32%)] mb-3 sm:mb-4">
              <span className="font-semibold text-[hsl(156,31%,18%)]">Khanqah Saifia</span> is
              more than an institute — it is a sanctuary of learning and
              transformation rooted in Faisalabad since 1940. Guided by{" "}
              <span className="font-bold text-[hsl(156,31%,18%)]">
                Sarkar Wakeel Sahib Mubarik
              </span>
              , our purpose is to awaken hearts through authentic Islamic
              knowledge, Sufi guidance, and Tarbiyat.
            </p>
            <p className="text-[14px] sm:text-[15px] leading-[1.7] sm:leading-[1.85] text-[hsl(100,5%,32%)] mb-6 sm:mb-8">
              Every class, every gathering, and every moment here is designed
              to help you draw closer to Allah with love, understanding, and
              clarity.
            </p>

            {/* Stats row */}
            <div className="flex items-stretch gap-0 mb-8 sm:mb-10 border border-[hsl(100,5%,85%)] rounded-[4px] overflow-hidden">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex-1 px-2 sm:px-4 py-3 sm:py-4 text-center ${
                    i < stats.length - 1
                      ? "border-r border-[hsl(100,5%,85%)]"
                      : ""
                  }`}
                >
                  <p className="font-serif text-[18px] sm:text-[22px] font-normal text-[hsl(156,31%,14%)] leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.08em] sm:tracking-[0.1em] uppercase text-[hsl(100,5%,52%)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative overflow-hidden px-4 sm:px-6 py-2.5 sm:py-3 bg-[hsl(156,31%,14%)] text-[hsl(42,30%,96%)] text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase rounded-[3px] transition-all duration-300"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="relative flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(45,70%,45%)]" />
                    Discover Our Journey
                  </span>
                </motion.button>
              </Link>

              <Link
                href="/about/shaykh"
                className="text-[11px] sm:text-[12px] font-semibold tracking-[0.06em] text-[hsl(156,31%,24%)] underline underline-offset-4 decoration-[hsl(45,70%,45%)] hover:text-[hsl(156,31%,14%)] transition-colors"
              >
                Meet the Shaykh →
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;