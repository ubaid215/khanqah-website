// src/components/home/CurriculumSection.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────
const programs = [
  {
    num: "٠١",
    category: "Sacred Sciences",
    title: "Quranic Studies & Tajweed",
    arabicTitle: "تجويد القرآن الكريم",
    description:
      "Master the precise recitation of the Holy Quran through the rules of Tajweed and the ten authentic modes of Qiraat under certified scholars.",
    tags: ["Hifz", "Tajweed", "Qiraat", "Tafsir"],
    accent: "gold",
  },
  {
    num: "٠٢",
    category: "Classical Curriculum",
    title: "Dars-e-Nizami",
    arabicTitle: "درس نظامي",
    description:
      "The comprehensive eight-year classical Islamic curriculum covering Arabic grammar, logic, Fiqh, Hadith, Aqeedah, and the foundational sciences of Deen.",
    tags: ["Arabic", "Fiqh", "Hadith", "Mantiq"],
    accent: "green",
  },
  {
    num: "٠٣",
    category: "Foundational Knowledge",
    title: "Islamic Fundamentals",
    arabicTitle: "أصول الإسلام",
    description:
      "Grounded learning in Aqeedah, Seerah, Islamic history, and the essentials of worship for students of every age and background.",
    tags: ["Aqeedah", "Seerah", "Ibadah", "History"],
    accent: "gold",
  },
  {
    num: "٠٤",
    category: "Spiritual Path",
    title: "Spiritual & Career Guidance",
    arabicTitle: "التزكية والإرشاد",
    description:
      "Personalised Tarbiyat sessions, Sufi guidance on purification of the heart, and practical career counselling rooted in Islamic values.",
    tags: ["Tasawwuf", "Tarbiyat", "Counselling"],
    accent: "green",
  },
  {
    num: "٠٥",
    category: "Community Welfare",
    title: "Free Education for Children",
    arabicTitle: "تعليم مجاني للأطفال",
    description:
      "No child is turned away. We provide full Quran and Deen education at zero cost to families who cannot afford institutional fees.",
    tags: ["Free", "Children", "Quran", "Deen"],
    accent: "gold",
  },
  {
    num: "٠٦",
    category: "Campus Life",
    title: "Free Food & Clean Environment",
    arabicTitle: "بيئة إسلامية نظيفة",
    description:
      "Resident students receive three meals daily at no charge. Our campus maintains a clean, friendly, and dignified Islamic atmosphere for focused learning.",
    tags: ["Langar", "Boarding", "Environment"],
    accent: "green",
  },
];

// ─── Program Card ─────────────────────────────────────────────────────────────
const ProgramCard = ({
  program,
  index,
  isInView,
}: {
  program: (typeof programs)[0];
  index: number;
  isInView: boolean;
}) => {
  const isGold = program.accent === "gold";
  const accentColor = isGold ? "hsl(45,70%,45%)" : "hsl(156,31%,32%)";
  const accentLight = isGold ? "hsl(45,70%,55%)" : "hsl(156,25%,45%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
      className="group relative"
    >
      <div
        className="
          relative h-full border border-[hsl(100,5%,84%)]
          bg-[hsl(0,0%,100%)]
          rounded-[3px] overflow-hidden
          transition-all duration-400
          hover:border-transparent
          hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]
        "
      >
        {/* Left accent bar — slides in on hover */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-400 ease-out rounded-r-full"
          style={{ backgroundColor: accentColor }}
        />

        <div className="px-6 py-6">
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            {/* Category label */}
            <span
              className="text-[9px] font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full border"
              style={{
                color: accentColor,
                borderColor: `${accentColor}40`,
                backgroundColor: `${accentColor}08`,
              }}
            >
              {program.category}
            </span>

            {/* Arabic numeral */}
            <span
              className="font-arabic text-[32px] leading-none font-normal select-none transition-colors duration-300"
              style={{ color: `${accentColor}22` }}
              aria-hidden
            >
              {program.num}
            </span>
          </div>

          {/* Arabic title */}
          <p
            className="font-arabic text-[17px] leading-relaxed mb-1 transition-colors duration-300"
            style={{ color: `${accentColor}90` }}
          >
            {program.arabicTitle}
          </p>

          {/* English title */}
          <h3 className="font-serif text-[19px] sm:text-[21px] font-normal text-[hsl(156,31%,14%)] leading-tight mb-3 group-hover:text-[hsl(156,31%,10%)] transition-colors duration-300">
            {program.title}
          </h3>

          {/* Gold/green rule */}
          <div
            className="w-6 h-px mb-4 transition-all duration-400 group-hover:w-12"
            style={{ backgroundColor: accentColor }}
          />

          {/* Description */}
          <p className="text-[13px] leading-[1.8] text-[hsl(100,5%,38%)] mb-5">
            {program.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {program.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-sm bg-[hsl(100,5%,94%)] text-[hsl(100,5%,40%)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Section ──────────────────────────────────────────────────────────────────
const CurriculumSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative bg-[hsl(42,30%,96%)] overflow-hidden py-20 lg:py-28"
    >
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      {/* Background Arabic watermark */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 overflow-hidden select-none z-0">
        <span
          className="font-arabic leading-none text-[hsl(156,31%,14%)]/[0.03]"
          style={{ fontSize: "clamp(80px, 16vw, 200px)" }}
          aria-hidden
        >
          المنهج
        </span>
      </div>

      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)] to-transparent" />

      <div className="container-sacred relative z-10">

        {/* ── Section header ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-end mb-14 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[hsl(45,70%,45%)] mb-4">
              What We Offer
            </p>
            <h2
              className="font-serif font-normal text-[hsl(156,31%,14%)] leading-[1.18] mb-4"
              style={{ fontSize: "clamp(28px, 4.5vw, 48px)" }}
            >
              Our Study{" "}
              <span className="italic text-[hsl(156,25%,32%)]">Curriculum</span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-[hsl(45,70%,45%)]" />
              <span className="font-arabic text-lg text-[hsl(45,70%,45%)]">المنهج الدراسي</span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="text-[14px] sm:text-[15px] leading-[1.85] text-[hsl(100,5%,35%)] lg:pb-1"
          >
            From foundational Quranic recitation to advanced classical sciences —
            our curriculum is designed to nurture both the intellect and the
            spirit, accessible to all regardless of financial means.
          </motion.p>
        </div>

        {/* ── Programs grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((program, i) => (
            <ProgramCard
              key={program.num}
              program={program}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/teachings">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden px-7 py-3 bg-[hsl(156,31%,14%)] text-[hsl(42,30%,96%)] text-[11px] font-bold tracking-[0.14em] uppercase rounded-[3px]"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(45,70%,45%)]" />
                View Full Curriculum
              </span>
            </motion.button>
          </Link>
          <Link
            href="/contact"
            className="text-[12px] font-semibold text-[hsl(156,31%,28%)] underline underline-offset-4 decoration-[hsl(45,70%,45%)] hover:text-[hsl(156,31%,14%)] transition-colors"
          >
            Enroll a Child →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CurriculumSection;