// src/components/home/Hero.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const heroSlides = [
  {
    id: 1,
    title: "A Center of Divine Wisdom",
    subtitle: "Preserving the sacred teachings of Islamic spirituality for generations",
    description: "Welcome to Khanqah Saifia, a sanctuary of spiritual enlightenment where ancient wisdom meets contemporary understanding.",
    image: "/images/astana.jpg",
    ctaPrimary: { label: "Discover Our Teachings", href: "/teachings" },
    ctaSecondary: { label: "Upcoming Events", href: "/events" },
    arabicCalligraphy: "مركز الحكمة الإلهية",
  },
  {
    id: 2,
    title: "The Path of Tasawwuf",
    subtitle: "Purification of the heart and spiritual excellence",
    description: "Journey through the beautiful path of self-purification, divine love, and spiritual growth under the guidance of authentic scholars.",
    image: "/images/hero/sarkar.png",
    ctaPrimary: { label: "Learn About Tasawwuf", href: "/teachings/tasawwuf" },
    ctaSecondary: { label: "Spiritual Lineage", href: "/about/lineage" },
    arabicCalligraphy: "طريق التصوف",
  },
  {
    id: 3,
    title: "Weekly Gatherings",
    subtitle: "Dhikr, Dars, and Spiritual Nourishment",
    description: "Join our community every Thursday evening for spiritual discourses, collective dhikr, and blessed gatherings.",
    image: "/images/hero/gathering-3.png",
    ctaPrimary: { label: "View Schedule", href: "/events/weekly" },
    ctaSecondary: { label: "Contact Us", href: "/contact" },
    arabicCalligraphy: "مجالس الذكر",
  },
  {
    id: 4,
    title: "Sacred Knowledge",
    subtitle: "Quran, Hadith, and Islamic Sciences",
    description: "Immerse yourself in the deep oceans of Islamic knowledge through our comprehensive programs and study circles.",
    image: "/images/hero/quran-4.png",
    ctaPrimary: { label: "Explore Resources", href: "/resources" },
    ctaSecondary: { label: "Publications", href: "/resources/publications" },
    arabicCalligraphy: "العلوم الإسلامية",
  },
  {
  id: 5,
  title: "Fulfill Your Qurbani with Trust",
  subtitle: "Serve humanity. Uphold the Sunnah of sacrifice",
  description: "شارك في القرباني هذا العام من خلال خانقاه سيفية. Ensure your sacrifice reaches the deserving with transparency, care, and spiritual integrity.",
  image: "/images/hero/qurbani.png",
  ctaPrimary: { label: "Participate in Qurbani", href: "/qurbani" },
  ctaSecondary: { label: "Learn How It Works", href: "/qurbani" },
  arabicCalligraphy: "شعيرة الأضحية",
}
];

// ─── Navigation Dots ──────────────────────────────────────────────────────────
const NavigationDots = ({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }).map((_, index) => (
      <button
        key={index}
        onClick={() => onSelect(index)}
        aria-label={`Go to slide ${index + 1}`}
        className="focus:outline-none"
      >
        <motion.div
          animate={{
            width: current === index ? 24 : 6,
            backgroundColor:
              current === index
                ? "hsl(45, 70%, 45%)"
                : "rgba(255,255,255,0.4)",
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="h-[5px] rounded-full"
        />
      </button>
    ))}
  </div>
);

// ─── Slide variants ───────────────────────────────────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1, zIndex: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    zIndex: 0,
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
} as const;

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((p) => (p + 1) % heroSlides.length);
  }, []);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((p) => (p - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const id = setInterval(goToNext, 6000);
    return () => clearInterval(id);
  }, [isAutoPlaying, goToNext]);

  const slide = heroSlides[currentIndex];

  return (
    <section
      className="relative w-full h-svh min-h-[560px] overflow-hidden bg-[hsl(100,3%,10%)]"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* ── Background slides ── */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: 0.75, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.75 },
          }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover"
          />
          {/* Layered gradients — inside bg slide, never above content */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
        </motion.div>
      </AnimatePresence>

      {/* ── Decorative corner arcs ── */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 border-r border-t border-[hsl(45,70%,45%)]/20 rounded-tr-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 border-l border-b border-[hsl(45,70%,45%)]/20 rounded-bl-full" />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-20 h-full container-sacred flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="w-full max-w-[90%] sm:max-w-[75%] lg:max-w-3xl text-white pt-[56px] sm:pt-[64px] lg:pt-[80px]"
          >
            {/* Arabic calligraphy */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0 }}
              className="mb-3 sm:mb-5"
            >
              <span className="font-arabic text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[hsl(45,70%,45%)] opacity-90 leading-relaxed">
                {slide.arabicCalligraphy}
              </span>
              <div className="w-12 sm:w-16 h-[1.5px] bg-[hsl(45,70%,45%)] mt-2 sm:mt-3" />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="text-[10px] sm:text-[11px] md:text-xs font-bold tracking-[0.12em] uppercase text-[hsl(45,70%,55%)] mb-3 sm:mb-4"
            >
              {slide.subtitle}
            </motion.p>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
              className="font-serif font-normal leading-[1.15] mb-3 sm:mb-5
                text-[28px]
                sm:text-[38px]
                md:text-[50px]
                lg:text-[62px]
                xl:text-[70px]"
            >
              {slide.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
              className="leading-relaxed text-white/75 mb-6 sm:mb-8
                text-[13px] max-w-[280px]
                sm:text-[15px] sm:max-w-sm
                md:text-base md:max-w-md
                lg:text-lg lg:max-w-xl"
            >
              {slide.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="flex flex-wrap gap-2.5 sm:gap-3"
            >
              <Link href={slide.ctaPrimary.href}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    "bg-[hsl(45,70%,45%)] text-[hsl(156,31%,12%)] font-bold rounded-[3px]",
                    "text-[10px] tracking-[0.1em] uppercase px-4 py-2.5",
                    "sm:text-[11px] sm:px-5 sm:py-3",
                    "md:text-xs md:px-6 md:py-3",
                    "lg:px-7 lg:py-3.5",
                    "hover:bg-[hsl(45,70%,50%)] transition-colors duration-200 shadow-md"
                  )}
                >
                  {slide.ctaPrimary.label}
                </motion.button>
              </Link>

              <Link href={slide.ctaSecondary.href}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    "border border-white/60 text-white font-semibold rounded-[3px]",
                    "text-[10px] tracking-[0.1em] uppercase px-4 py-2.5",
                    "sm:text-[11px] sm:px-5 sm:py-3",
                    "md:text-xs md:px-6 md:py-3",
                    "lg:px-7 lg:py-3.5",
                    "hover:bg-white/10 hover:border-white/80 transition-all duration-200"
                  )}
                >
                  {slide.ctaSecondary.label}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom bar: dots + arrows ── */}
      <div className="absolute bottom-5 sm:bottom-7 left-0 right-0 z-30 container-sacred flex items-center justify-between">
        {/* Dots */}
        <NavigationDots
          total={heroSlides.length}
          current={currentIndex}
          onSelect={goToSlide}
        />

        {/* Arrow controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrev}
            aria-label="Previous slide"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur-sm text-white hover:bg-black/55 hover:border-white/55 transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            aria-label="Next slide"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur-sm text-white hover:bg-black/55 hover:border-white/55 transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;