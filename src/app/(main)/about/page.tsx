"use client";

import { motion } from "framer-motion";
import {
  Heart,
  BookOpen,
  Users,
  Award,
  Target,
  Globe,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const achievements = [
  { number: "50K+", label: "Active Students",   icon: Users      },
  { number: "200+", label: "Courses Available", icon: BookOpen   },
  { number: "30+",  label: "Expert Scholars",   icon: Award      },
  { number: "95%",  label: "Completion Rate",   icon: TrendingUp },
];

const values = [
  {
    icon: Heart,
    title: "Authentic Knowledge",
    description:
      "Rooted in the Quran, Sunnah, and the understanding of the righteous predecessors — pure transmission, uncompromised.",
  },
  {
    icon: BookOpen,
    title: "Quality Education",
    description:
      "Every course is curated by qualified scholars to uphold the highest standards of Islamic learning.",
  },
  {
    icon: Users,
    title: "Community Focus",
    description:
      "A brotherhood and sisterhood of seekers growing together in faith, knowledge, and spiritual companionship.",
  },
  {
    icon: Globe,
    title: "Global Accessibility",
    description:
      "Removing every barrier so that the light of 'Ilm reaches every corner of the world.",
  },
];

const missionPoints = [
  "Deliver authentic Islamic and spiritual education worldwide",
  "Foster spiritual growth and character development",
  "Build a supportive learning community",
  "Make knowledge accessible and affordable",
];

const visionPoints = [
  "Build a global network of spiritually awakened Muslims",
  "Preserve the teachings of the Qur'an, Sunnah, and Sufi heritage",
  "Inspire positive change through education and Tarbiyat",
  "Bridge traditional wisdom with modern learning tools",
];

// ─── Shared micro-components ──────────────────────────────────────────────────

const GoldRule = ({ className = "" }: { className?: string }) => (
  <div className={`h-px bg-[hsl(45,70%,45%)] ${className}`} />
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase text-[hsl(45,70%,45%)] mb-3">
    {children}
  </p>
);

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[hsl(42,30%,96%)]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vw] min-h-[300px] max-h-[560px] overflow-hidden bg-[hsl(156,31%,10%)]">
        <Image
          src="/images/astana.jpg"
          alt="Khanqah Saifia"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Decorative arcs */}
        <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 border-r border-t border-[hsl(45,70%,45%)]/20 rounded-tr-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-40 sm:h-40 border-l border-b border-[hsl(45,70%,45%)]/20 rounded-bl-full pointer-events-none" />

        <div className="absolute inset-0 flex items-center">
          <div className="container-sacred w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <SectionLabel>عن خانقاه سيفية — About Us</SectionLabel>
              <h1
                className="font-serif font-normal leading-[1.15] text-white mb-4 max-w-2xl
                  text-[28px] sm:text-[40px] md:text-[52px] lg:text-[60px]"
              >
                About Khanqah Saifia
              </h1>
              <GoldRule className="w-14 mb-4" />
              <p className="text-white/70 text-[13px] sm:text-[15px] leading-relaxed max-w-md">
                Guiding souls and enlightening minds through faith, knowledge, and spirituality.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      {/* <section className="bg-[hsl(156,31%,14%)] border-b border-[hsl(45,70%,45%)]/20">
        <div className="container-sacred">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[hsl(45,70%,45%)]/15">
            {achievements.map(({ number, label, icon: Icon }, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center gap-1 py-6 sm:py-8 px-4 text-center"
              >
                <Icon className="w-4 h-4 text-[hsl(45,70%,45%)] mb-1 opacity-75" />
                <span className="font-serif text-[28px] sm:text-[34px] font-normal text-[hsl(42,30%,96%)] leading-none">
                  {number}
                </span>
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[hsl(42,30%,96%)]/45 mt-0.5">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── OUR STORY ────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[hsl(100,5%,88%)]">
        <div className="container-sacred py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Image with gold corner accent */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[4px]">
                <Image
                  src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=600&fit=crop"
                  alt="Islamic Learning"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 sm:w-28 sm:h-28 border-r-2 border-b-2 border-[hsl(45,70%,45%)] rounded-br-[4px] pointer-events-none" />
            </motion.div>

            {/* Story text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <SectionLabel>Our Story</SectionLabel>
              <h2 className="font-serif text-[22px] sm:text-[30px] lg:text-[36px] font-normal text-[hsl(156,31%,14%)] leading-snug mb-4">
                A Beacon of Spiritual Knowledge
              </h2>
              <GoldRule className="w-12 mb-6" />

              <div className="space-y-4 text-[13px] sm:text-[14px] text-[hsl(100,5%,28%)] leading-[1.85]">
                <p>
                  <strong className="text-[hsl(100,3%,10%)] font-semibold">Khanqah Saifia</strong> was
                  established under the blessed guidance of{" "}
                  <strong className="text-[hsl(100,3%,10%)] font-semibold">Sarkar Wakeel Sahib Mubarik</strong> with
                  a noble vision — to spread the light of Tasawwuf, authentic Islamic knowledge, and
                  spiritual refinement across the world. What began as a humble gathering of seekers has
                  now blossomed into a thriving spiritual and educational community, dedicated to nurturing
                  hearts and guiding souls toward Allah.
                </p>
                <p>
                  Rooted in the timeless traditions of the Sufi path, Khanqah Saifia serves as a beacon
                  for those who seek both 'Ilm (knowledge) and Irfan (spiritual understanding). Through
                  our structured programs in{" "}
                  <strong className="text-[hsl(100,3%,10%)] font-semibold">
                    Qur'anic Studies, Hadith, Fiqh, Arabic Language, and Tasawwuf
                  </strong>
                  , we combine the beauty of outward learning with the depth of inner purification.
                </p>
                <p>
                  Under the mentorship of esteemed scholars and spiritual guides, our students come from
                  all walks of life — united by a shared purpose: to live with sincerity, discipline, and
                  love for the Divine.
                </p>
                <p>
                  At our Astana, remembrance (Zikr), spiritual companionship (Suhbah), and moral
                  refinement are at the heart of every gathering. We believe that true success lies in the
                  balance of knowledge, devotion, and service.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────────────────────────────── */}
      <section className="bg-[hsl(42,30%,96%)] border-b border-[hsl(100,5%,88%)]">
        <div className="container-sacred py-12 sm:py-16 lg:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <SectionLabel>Purpose & Direction</SectionLabel>
            <h2 className="font-serif text-[22px] sm:text-[30px] font-normal text-[hsl(156,31%,14%)] leading-snug">
              Mission & Vision
            </h2>
            <GoldRule className="w-12 mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Mission — light card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-[hsl(100,5%,76%)] rounded-[4px] overflow-hidden"
            >
              <div className="h-[3px] bg-[hsl(45,70%,45%)]" />
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[hsl(156,31%,14%)]/8 flex-shrink-0">
                    <Target className="w-4 h-4 text-[hsl(156,31%,14%)]" />
                  </div>
                  <h3 className="font-serif text-[19px] sm:text-[22px] font-normal text-[hsl(156,31%,14%)]">
                    Our Mission
                  </h3>
                </div>
                <p className="text-[13px] sm:text-[14px] text-[hsl(100,5%,28%)] leading-[1.85] mb-6">
                  To revive hearts through authentic Islamic knowledge and the path of Sufism. We provide
                  balanced education combining 'Ilm with Tarbiyat — creating seekers who live with
                  sincerity, discipline, and love for the Divine.
                </p>
                <div className="space-y-3">
                  {missionPoints.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[hsl(45,70%,45%)] flex-shrink-0 mt-0.5" />
                      <span className="text-[12px] sm:text-[13px] text-[hsl(100,5%,28%)] leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Vision — dark card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[hsl(156,31%,14%)] rounded-[4px] overflow-hidden"
            >
              <div className="h-[3px] bg-[hsl(45,70%,45%)]" />
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 flex-shrink-0">
                    <Globe className="w-4 h-4 text-[hsl(45,70%,55%)]" />
                  </div>
                  <h3 className="font-serif text-[19px] sm:text-[22px] font-normal text-[hsl(42,30%,96%)]">
                    Our Vision
                  </h3>
                </div>
                <p className="text-[13px] sm:text-[14px] text-[hsl(42,30%,96%)]/65 leading-[1.85] mb-6">
                  To become a guiding light for seekers across the globe — where knowledge and spirituality
                  unite to form hearts anchored in love for Allah and His Messenger ﷺ. A global centre
                  of Tarbiyat preserving noble Sufi traditions for generations.
                </p>
                <div className="space-y-3">
                  {visionPoints.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[hsl(45,70%,45%)] flex-shrink-0 mt-0.5" />
                      <span className="text-[12px] sm:text-[13px] text-[hsl(42,30%,96%)]/70 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[hsl(100,5%,88%)]">
        <div className="container-sacred py-12 sm:py-16 lg:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <SectionLabel>What We Stand For</SectionLabel>
            <h2 className="font-serif text-[22px] sm:text-[30px] font-normal text-[hsl(156,31%,14%)] leading-snug">
              Our Core Values
            </h2>
            <GoldRule className="w-12 mt-4" />
          </motion.div>

          {/* Grid with hairline borders — editorial table feel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[hsl(100,5%,88%)] rounded-[4px] overflow-hidden divide-x divide-y divide-[hsl(100,5%,88%)]">
            {values.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white p-6 sm:p-7 group hover:bg-[hsl(42,30%,97%)] transition-colors duration-200"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[hsl(156,31%,14%)]/8 group-hover:bg-[hsl(156,31%,14%)]/14 transition-colors mb-5">
                  <Icon className="w-4 h-4 text-[hsl(156,31%,14%)]" />
                </div>
                <div className="w-6 h-px bg-[hsl(45,70%,45%)] mb-4" />
                <h3 className="font-serif text-[15px] sm:text-[17px] font-normal text-[hsl(100,3%,10%)] mb-3 leading-snug">
                  {title}
                </h3>
                <p className="text-[12px] sm:text-[13px] text-[hsl(100,5%,38%)] leading-[1.8]">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-[hsl(156,31%,14%)] overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 border-r border-t border-[hsl(45,70%,45%)]/15 rounded-tr-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l border-b border-[hsl(45,70%,45%)]/15 rounded-bl-full pointer-events-none" />

        <div className="container-sacred py-14 sm:py-16 lg:py-20 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <SectionLabel>Begin Your Journey</SectionLabel>
            <h2 className="font-serif text-[24px] sm:text-[34px] lg:text-[42px] font-normal text-[hsl(42,30%,96%)] leading-snug mb-4">
              Join Our Learning Community
            </h2>
            <GoldRule className="w-14 mb-6" />
            <p className="text-[13px] sm:text-[15px] text-[hsl(42,30%,96%)]/60 leading-relaxed mb-8 max-w-lg">
              Start your journey of knowledge and spiritual growth with Khanqah Saifia today.
              Every seeker is welcome — from any walk of life, from any corner of the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/courses">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center w-full sm:w-auto
                    bg-[hsl(45,70%,45%)] text-[hsl(156,31%,12%)]
                    text-[11px] font-bold tracking-[0.1em] uppercase
                    px-7 py-4 rounded-[3px] cursor-pointer
                    hover:bg-[hsl(45,70%,50%)] transition-colors duration-200 shadow-sm"
                >
                  Browse Courses
                </motion.span>
              </Link>
              <Link href="/contact">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center w-full sm:w-auto
                    border border-white/30 text-white
                    text-[11px] font-bold tracking-[0.1em] uppercase
                    px-7 py-4 rounded-[3px] cursor-pointer
                    hover:bg-white/8 hover:border-white/50 transition-all duration-200"
                >
                  Contact Us
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;