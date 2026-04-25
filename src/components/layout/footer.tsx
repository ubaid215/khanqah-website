// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
const navColumns = [
  {
    title: "Explore",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Teachings", href: "/teachings" },
      { label: "Events", href: "/events" },
      { label: "Spiritual Lineage", href: "/about/lineage" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Articles", href: "/articles" },
      { label: "Books", href: "/books" },
      { label: "Audio Library", href: "/resources/audio" },
      { label: "Publications", href: "/resources/publications" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Donate", href: "/donate" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const contactItems = [
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0">
        <path d="M14 10.67c0 .27-.06.53-.19.78-.13.25-.3.49-.52.7-.36.34-.75.5-1.16.5-.3 0-.62-.07-.97-.22L8 10.33l-3.16 2.1c-.35.15-.67.22-.97.22-.41 0-.8-.16-1.16-.5-.22-.21-.39-.45-.52-.7A1.89 1.89 0 0 1 2 10.67V3.56C2 2.7 2.7 2 3.56 2h8.88C13.3 2 14 2.7 14 3.56v7.11z"/>
      </svg>
    ),
    text: "khanqahsaifia@gmail.com",
    href: "mailto:khanqahsaifia@gmail.com",
  },
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0">
        <path d="M14 11.5c0 .28-.06.55-.19.81a3.3 3.3 0 0 1-.52.72c-.36.36-.75.53-1.16.53-.3 0-.62-.07-.97-.22l-3.16-2.1-3.16 2.1c-.35.15-.67.22-.97.22-.41 0-.8-.17-1.16-.53a3.3 3.3 0 0 1-.52-.72A1.92 1.92 0 0 1 2 11.5"/>
        <path d="M2 4.5A1.5 1.5 0 0 1 3.5 3h9A1.5 1.5 0 0 1 14 4.5v7"/>
        <path d="M2 4.5l6 4 6-4"/>
      </svg>
    ),
    text: "+92 321-7677062",
    href: "tel:+923217677062",
  },
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0 mt-0.5">
        <path d="M8 1.5a4.5 4.5 0 0 1 4.5 4.5c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5z"/>
        <circle cx="8" cy="6" r="1.5"/>
      </svg>
    ),
    text: "Khanqah Aliya Murshidabad Shareef, Jhang Road, Faisalabad",
    href: "https://maps.google.com",
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M18 10a8 8 0 1 0-9.25 7.903V12.89H7.078V10H8.75V8.297c0-1.655.988-2.57 2.495-2.57.722 0 1.478.129 1.478.129v1.625h-.832c-.82 0-1.075.509-1.075 1.031V10h1.828l-.292 2.89h-1.536v5.013A8.003 8.003 0 0 0 18 10z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="16" height="16" rx="4"/>
        <circle cx="10" cy="10" r="3.5"/>
        <circle cx="14.5" cy="5.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M17.04 5.19a2.13 2.13 0 0 0-1.5-1.51C14.18 3.33 10 3.33 10 3.33s-4.18 0-5.54.35A2.13 2.13 0 0 0 2.96 5.19C2.62 6.56 2.62 10 2.62 10s0 3.44.34 4.81a2.13 2.13 0 0 0 1.5 1.51C5.82 16.67 10 16.67 10 16.67s4.18 0 5.54-.35a2.13 2.13 0 0 0 1.5-1.51c.34-1.37.34-4.81.34-4.81s0-3.44-.34-4.81zM8.25 12.5v-5l4.5 2.5-4.5 2.5z"/>
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M15.18 2h2.61l-5.7 6.52L18.8 18h-5.25l-4.11-5.38L4.7 18H2.1l6.1-6.97L1.2 2h5.38l3.72 4.92L15.18 2zm-.91 14.38h1.45L5.8 3.48H4.25l10.02 12.9z"/>
      </svg>
    ),
  },
];

// ─── Mobile accordion column ──────────────────────────────────────────────────
const MobileColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[hsl(42,30%,96%)]/8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-left focus:outline-none"
      >
        <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[hsl(42,30%,96%)]/60">
          {title}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="text-[hsl(45,70%,45%)]"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4 space-y-3 pl-1">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 text-[13px] text-[hsl(42,30%,96%)]/45 hover:text-[hsl(45,70%,50%)] transition-colors duration-200"
                >
                  <span className="w-1 h-1 rounded-full bg-[hsl(45,70%,45%)]/40 flex-shrink-0" />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => {
  const [showTop, setShowTop] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  };

  return (
    <>
      {/* ── Footer ── */}
      <footer className="relative bg-[hsl(156,31%,9%)] text-[hsl(42,30%,96%)] overflow-hidden">

        {/* Grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px",
          }}
        />

        {/* Top gold rule */}
        <div className="h-[1.5px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)] to-transparent" />

        {/* Arabic watermark */}
        <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
          <span
            className="font-arabic leading-none text-[hsl(42,30%,96%)]/[0.025]"
            style={{ fontSize: "clamp(60px, 14vw, 160px)" }}
            aria-hidden
          >
            خانقاه سيفيہ
          </span>
        </div>

        <div className="container-sacred relative py-12 lg:py-16">

          {/* ══ DESKTOP layout ══════════════════════════════════════════════ */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-10 xl:gap-14 mb-10">

            {/* Brand col — 4 cols */}
            <div className="col-span-4 flex flex-col">
              {/* Logo + name */}
              <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
                <div className="relative w-11 h-11 transition-transform duration-300 group-hover:scale-105">
                  <Image src="/logo.png" alt="Khanqah Saifia" fill className="object-contain" />
                </div>
                <div>
                  <p className="font-serif text-[17px] font-medium text-[hsl(42,30%,94%)] leading-tight">
                    Khanqah Saifia
                  </p>
                </div>
              </Link>

              <div className="h-px w-10 bg-[hsl(45,70%,45%)] mb-5" />

              <p className="text-[13px] leading-[1.85] text-[hsl(42,30%,96%)]/45 mb-6 max-w-[260px]">
                A sanctuary of sacred knowledge, spiritual guidance, and
                community welfare rooted in the Sufi tradition since 1940.
              </p>

              {/* Contact items */}
              <div className="space-y-3 mb-6">
                {contactItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="flex items-start gap-2.5 text-[12px] text-[hsl(42,30%,96%)]/40 hover:text-[hsl(45,70%,50%)] transition-colors duration-200 group"
                  >
                    <span className="text-[hsl(45,70%,45%)] mt-px">{item.icon}</span>
                    <span className="leading-relaxed">{item.text}</span>
                  </a>
                ))}
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-2 mt-auto">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-8 h-8 flex items-center justify-center rounded-[3px] border border-[hsl(42,30%,96%)]/12 text-[hsl(42,30%,96%)]/40 hover:border-[hsl(45,70%,45%)]/50 hover:text-[hsl(45,70%,50%)] transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns — 2 cols each, 6 total */}
            {navColumns.map((col) => (
              <div key={col.title} className="col-span-2">
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-[hsl(45,70%,45%)] mb-4">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[12px] text-[hsl(42,30%,96%)]/45 hover:text-[hsl(42,30%,90%)] transition-colors duration-200 flex items-center gap-1.5 group"
                      >
                        <span className="w-0 group-hover:w-2.5 h-px bg-[hsl(45,70%,45%)] transition-all duration-200 flex-shrink-0" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter — 2 cols */}
            <div className="col-span-2">
              <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-[hsl(45,70%,45%)] mb-4">
                Newsletter
              </p>
              <p className="text-[12px] text-[hsl(42,30%,96%)]/40 leading-relaxed mb-4">
                Receive spiritual reminders and event updates.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 text-[12px] text-[hsl(45,70%,50%)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(45,70%,45%)]" />
                  Jazakallah Khair
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-3 py-2.5 text-[12px] bg-[hsl(156,20%,13%)] border border-[hsl(42,30%,96%)]/10 rounded-[3px] text-[hsl(42,30%,80%)] placeholder:text-[hsl(42,30%,96%)]/25 focus:outline-none focus:border-[hsl(45,70%,45%)]/50 transition-colors duration-200"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 text-[10px] font-bold tracking-[0.12em] uppercase bg-[hsl(45,70%,45%)] text-[hsl(156,31%,10%)] rounded-[3px] hover:bg-[hsl(45,70%,50%)] transition-colors duration-200"
                  >
                    Subscribe
                  </button>
                </form>
              )}

              {/* Arabic snippet */}
              <p className="font-arabic text-[13px] text-[hsl(42,30%,96%)]/20 mt-5 text-right leading-relaxed">
                وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ
              </p>
            </div>
          </div>

          {/* ══ MOBILE layout ═══════════════════════════════════════════════ */}
          <div className="lg:hidden">
            {/* Brand row */}
            <div className="flex items-center justify-between mb-6 pb-5 border-b border-[hsl(42,30%,96%)]/8">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="relative w-9 h-9">
                  <Image src="/logo.png" alt="Khanqah Saifia" fill className="object-contain" />
                </div>
                <div>
                  <p className="font-serif text-[15px] text-[hsl(42,30%,94%)] leading-tight">Khanqah Saifia</p>
                  {/* <p className="text-[8px] font-bold tracking-[0.14em] uppercase text-[hsl(45,70%,45%)]">Est. 1940</p> */}
                </div>
              </Link>

              {/* Social icons — compact row */}
              <div className="flex items-center gap-1.5">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-7 h-7 flex items-center justify-center rounded-[3px] border border-[hsl(42,30%,96%)]/12 text-[hsl(42,30%,96%)]/40 hover:text-[hsl(45,70%,50%)] hover:border-[hsl(45,70%,45%)]/40 transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact — compact horizontal pills */}
            <div className="flex flex-col gap-2 mb-5">
              {contactItems.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-start gap-2 text-[11px] text-[hsl(42,30%,96%)]/40 hover:text-[hsl(45,70%,50%)] transition-colors"
                >
                  <span className="text-[hsl(45,70%,45%)] mt-px">{item.icon}</span>
                  <span className="leading-relaxed">{item.text}</span>
                </a>
              ))}
            </div>

            {/* Accordion nav columns */}
            <div className="mb-5">
              {navColumns.map((col) => (
                <MobileColumn
                  key={col.title}
                  title={col.title}
                  links={col.links}
                />
              ))}
            </div>

            {/* Newsletter — compact */}
            <div className="pt-1 pb-2">
              <p className="text-[9px] font-bold tracking-[0.16em] uppercase text-[hsl(45,70%,45%)] mb-3">
                Newsletter
              </p>
              {subscribed ? (
                <p className="text-[12px] text-[hsl(45,70%,50%)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(45,70%,45%)]" />
                  Jazakallah Khair — subscribed!
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="flex-1 px-3 py-2.5 text-[12px] bg-[hsl(156,20%,13%)] border border-[hsl(42,30%,96%)]/10 rounded-[3px] text-[hsl(42,30%,80%)] placeholder:text-[hsl(42,30%,96%)]/25 focus:outline-none focus:border-[hsl(45,70%,45%)]/40 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 text-[10px] font-bold tracking-[0.1em] uppercase bg-[hsl(45,70%,45%)] text-[hsl(156,31%,10%)] rounded-[3px] hover:bg-[hsl(45,70%,50%)] transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Bottom bar (both) ── */}
          <div className="mt-8 pt-6 border-t border-[hsl(42,30%,96%)]/8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-[hsl(42,30%,96%)]/25 text-center sm:text-left">
              © {new Date().getFullYear()} Khanqah Saifia, Faisalabad.
              All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {[
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[11px] text-[hsl(42,30%,96%)]/25 hover:text-[hsl(45,70%,50%)] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
              <span className="text-[hsl(42,30%,96%)]/15 text-xs">·</span>
              <span className="text-[11px] text-[hsl(42,30%,96%)]/20">
                Made with{" "}
                <span className="text-[hsl(45,70%,45%)]">♥</span>{" "}
                in Pakistan
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Scroll to top ── */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-[3px] bg-[hsl(156,31%,14%)] border border-[hsl(45,70%,45%)]/30 text-[hsl(45,70%,50%)] shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:bg-[hsl(156,31%,18%)] hover:border-[hsl(45,70%,45%)]/60 transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;