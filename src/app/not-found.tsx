// src/app/not-found.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// ─── Quick links ──────────────────────────────────────────────────────────────
const links = [
  { label: "Home", href: "/" },
  { label: "Teachings", href: "/teachings" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

// ─── Floating lantern SVG ─────────────────────────────────────────────────────
const Lantern = () => (
  <svg
    viewBox="0 0 120 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Glow */}
    <ellipse cx="60" cy="95" rx="38" ry="52" fill="hsl(45,70%,45%)" opacity="0.08" />
    <ellipse cx="60" cy="95" rx="24" ry="36" fill="hsl(45,70%,45%)" opacity="0.10" />

    {/* Top hook */}
    <path d="M60 8 C60 8 60 2 60 2" stroke="hsl(45,70%,60%)" strokeWidth="2" strokeLinecap="round" />
    <path d="M52 14 Q60 6 68 14" stroke="hsl(45,70%,60%)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    {/* Chain links */}
    <rect x="57" y="14" width="6" height="8" rx="3" stroke="hsl(45,70%,55%)" strokeWidth="1.2" fill="none" />
    <rect x="57" y="24" width="6" height="8" rx="3" stroke="hsl(45,70%,55%)" strokeWidth="1.2" fill="none" />

    {/* Top cap */}
    <path d="M38 42 Q60 34 82 42 L78 50 H42 Z" fill="hsl(45,70%,38%)" />
    <path d="M38 42 Q60 34 82 42" stroke="hsl(45,70%,60%)" strokeWidth="1" fill="none" />

    {/* Body */}
    <path
      d="M42 50 Q32 75 34 105 Q36 130 60 138 Q84 130 86 105 Q88 75 78 50 Z"
      fill="hsl(156,31%,12%)"
      stroke="hsl(45,70%,45%)"
      strokeWidth="1.2"
    />

    {/* Body panels — geometric Islamic lattice */}
    <line x1="60" y1="50" x2="60" y2="138" stroke="hsl(45,70%,45%)" strokeWidth="0.6" opacity="0.5" />
    <line x1="42" y1="94" x2="78" y2="94" stroke="hsl(45,70%,45%)" strokeWidth="0.6" opacity="0.5" />
    <line x1="44" y1="72" x2="76" y2="72" stroke="hsl(45,70%,45%)" strokeWidth="0.6" opacity="0.3" />
    <line x1="44" y1="116" x2="76" y2="116" stroke="hsl(45,70%,45%)" strokeWidth="0.6" opacity="0.3" />

    {/* Diamond lattice */}
    <path d="M60 55 L70 72 L60 89 L50 72 Z" stroke="hsl(45,70%,55%)" strokeWidth="0.7" fill="none" opacity="0.6" />
    <path d="M60 99 L70 116 L60 133 L50 116 Z" stroke="hsl(45,70%,55%)" strokeWidth="0.7" fill="none" opacity="0.6" />

    {/* Inner glow / flame */}
    <ellipse cx="60" cy="94" rx="14" ry="20" fill="hsl(45,85%,55%)" opacity="0.15" />
    <ellipse cx="60" cy="94" rx="8" ry="13" fill="hsl(40,90%,65%)" opacity="0.18" />

    {/* Flame */}
    <path d="M60 80 C57 85 55 90 58 96 C59 99 61 99 62 96 C65 90 63 85 60 80Z"
      fill="hsl(38,90%,62%)" opacity="0.85" />
    <path d="M60 84 C59 88 58 92 60 95 C61 92 62 88 60 84Z"
      fill="hsl(50,100%,80%)" opacity="0.7" />

    {/* Bottom cap */}
    <path d="M42 138 L46 148 Q60 154 74 148 L78 138 Z" fill="hsl(45,70%,38%)" />
    <path d="M46 148 Q60 154 74 148" stroke="hsl(45,70%,60%)" strokeWidth="1" fill="none" />

    {/* Bottom fringe */}
    {[46, 52, 58, 64, 70].map((x, i) => (
      <line key={i} x1={x} y1="153" x2={x - 1} y2="162" stroke="hsl(45,70%,55%)" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
    ))}
  </svg>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[hsl(156,31%,10%)] flex items-center justify-center px-4 py-16">

      {/* ── Grain texture overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      {/* ── Radial glow center ── */}
      <div className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(156,25%,16%) 0%, transparent 70%)" }}
      />

      {/* ── Top gold rule ── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)] to-transparent z-10" />

      {/* ── Ghosted Arabic watermark ── */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0 overflow-hidden select-none">
        <span
          className="font-arabic leading-none text-[hsl(42,30%,96%)] opacity-[0.025]"
          style={{ fontSize: "clamp(100px, 25vw, 280px)" }}
          aria-hidden
        >
          غير موجود
        </span>
      </div>

      {/* ── Decorative corner arcs ── */}
      <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 border-r border-t border-[hsl(45,70%,45%)]/10 rounded-tr-full z-0" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-32 h-32 sm:w-56 sm:h-56 border-l border-b border-[hsl(45,70%,45%)]/10 rounded-bl-full z-0" />

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto text-center">

        {/* Floating lantern */}
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-8 sm:mb-10 w-20 h-[120px] sm:w-24 sm:h-[144px]"
        >
          <Lantern />
        </motion.div>

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-block mb-4"
        >
          <span
            className="font-serif font-normal text-[hsl(42,30%,96%)] leading-none select-none"
            style={{ fontSize: "clamp(72px, 18vw, 140px)" }}
          >
            404
          </span>
          {/* Gold underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="absolute bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)] to-transparent origin-center"
          />
        </motion.div>

        {/* Arabic subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-arabic text-xl sm:text-2xl text-[hsl(45,70%,50%)] mb-3 leading-relaxed"
        >
          الصفحة غير موجودة
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          className="font-serif font-normal text-[hsl(42,30%,92%)] leading-[1.2] mb-4"
          style={{ fontSize: "clamp(22px, 4vw, 34px)" }}
        >
          This page has wandered off the path
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-12 h-px bg-[hsl(45,70%,45%)] mx-auto mb-5 origin-center"
        />

        {/* Body */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-[14px] sm:text-[15px] leading-relaxed text-[hsl(42,30%,96%)]/50 max-w-md mx-auto mb-10"
        >
          The page you are looking for may have been moved, renamed, or does not exist. Let us guide you back.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group relative overflow-hidden px-7 py-3 bg-[hsl(45,70%,45%)] text-[hsl(156,31%,10%)] text-[11px] font-bold tracking-[0.14em] uppercase rounded-[3px] transition-colors duration-200 hover:bg-[hsl(45,70%,50%)]"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative">Return Home</span>
            </motion.button>
          </Link>

          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-7 py-3 border border-[hsl(42,30%,96%)]/20 text-[hsl(42,30%,96%)]/70 text-[11px] font-bold tracking-[0.14em] uppercase rounded-[3px] hover:border-[hsl(42,30%,96%)]/40 hover:text-[hsl(42,30%,96%)] transition-all duration-200"
            >
              Contact Us
            </motion.button>
          </Link>
        </motion.div>

        {/* Quick nav links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="border-t border-[hsl(42,30%,96%)]/8 pt-8"
        >
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[hsl(42,30%,96%)]/30 mb-4">
            Or explore
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12px] font-medium text-[hsl(42,30%,96%)]/45 hover:text-[hsl(45,70%,55%)] transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── Bottom gold rule ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/40 to-transparent z-10" />
    </main>
  );
}