// src/components/layout/Navbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Home",
    href: "/",
    hasDropdown: false,
  },
  {
    label: "About",
    href: "/about",
    hasDropdown: true,
    dropdownItems: [
      { label: "Our History", href: "/about/history" },
      { label: "Our Mission", href: "/about/mission" },
      { label: "Spiritual Lineage", href: "/about/lineage" },
      { label: "Shaykh's Biography", href: "/about/shaykh" },
    ],
  },
  {
    label: "Teachings",
    href: "/teachings",
    hasDropdown: true,
    dropdownItems: [
      { label: "Quranic Studies", href: "/teachings/quran" },
      { label: "Hadith", href: "/teachings/hadith" },
      { label: "Tasawwuf", href: "/teachings/tasawwuf" },
      { label: "Fiqh", href: "/teachings/fiqh" },
    ],
  },
  {
    label: "Events",
    href: "/events",
    hasDropdown: true,
    dropdownItems: [
      { label: "Upcoming Events", href: "/events/upcoming" },
      { label: "Weekly Gatherings", href: "/events/weekly" },
      { label: "Annual Conferences", href: "/events/conferences" },
      { label: "Event Calendar", href: "/events/calendar" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    hasDropdown: true,
    dropdownItems: [
      { label: "Publications", href: "/resources/publications" },
      { label: "Audio Library", href: "/resources/audio" },
      { label: "Video Library", href: "/resources/video" },
      { label: "Blog", href: "/resources/blog" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    hasDropdown: false,
  },
];

// ─── Desktop Dropdown Item ───────────────────────────────────────────────────
const DropdownItem = ({
  item,
  index,
  pathname,
}: {
  item: { label: string; href: string };
  index: number;
  pathname: string;
}) => {
  const isActive = pathname === item.href;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
    >
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 px-5 py-3 transition-all duration-200",
          isActive
            ? "bg-[hsl(156,31%,14%)]/8 text-[hsl(156,31%,14%)]"
            : "text-[hsl(100,5%,28%)] hover:bg-[hsl(156,31%,14%)]/5 hover:text-[hsl(156,31%,14%)]"
        )}
      >
        {/* Gold dot indicator */}
        <span
          className={cn(
            "w-1 h-1 rounded-full flex-shrink-0 transition-all duration-200",
            isActive
              ? "bg-[hsl(45,70%,45%)] scale-150"
              : "bg-[hsl(100,5%,76%)] group-hover:bg-[hsl(45,70%,45%)] group-hover:scale-150"
          )}
        />
        <span className="text-[13px] font-medium tracking-wide">{item.label}</span>
        {/* Subtle arrow on hover */}
        <span className="ml-auto text-[hsl(45,70%,45%)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">
          →
        </span>
      </Link>
    </motion.div>
  );
};

// ─── Desktop Nav Item with Dropdown ──────────────────────────────────────────
const NavItem = ({
  item,
  isActive,
  pathname,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
  pathname: string;
}) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    // Small delay so moving to dropdown doesn't close it
    timeoutRef.current = setTimeout(() => setOpen(false), 100);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={cn(
          "relative px-4 py-2 flex items-center gap-1.5 text-[13px] font-semibold tracking-[0.08em] uppercase transition-colors duration-200",
          isActive
            ? "text-[hsl(156,31%,14%)]"
            : "text-[hsl(100,5%,38%)] hover:text-[hsl(156,31%,14%)]"
        )}
      >
        {item.label}

        {/* Active underline — animated gold rule */}
        {isActive && (
          <motion.span
            layoutId="nav-underline"
            className="absolute bottom-0 left-4 right-4 h-[2px] bg-[hsl(45,70%,45%)]"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}

        {/* Dropdown chevron */}
        {item.hasDropdown && (
          <motion.svg
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className="flex-shrink-0 opacity-50"
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </Link>

      {/* Dropdown Panel */}
      {item.hasDropdown && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              // Extend hover zone with invisible top bridge
              className="absolute top-full left-0 pt-2 w-56"
            >
              {/* Gold top accent line */}
              <div className="h-[2px] bg-gradient-to-r from-[hsl(45,70%,45%)] to-transparent mx-4 mb-0 rounded-full" />

              <div className="bg-[hsl(0,0%,100%)] border border-[hsl(100,5%,88%)] rounded-sm shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
                {item.dropdownItems?.map((subItem, i) => (
                  <DropdownItem
                    key={subItem.label}
                    item={subItem}
                    index={i}
                    pathname={pathname}
                  />
                ))}

                {/* Subtle footer label */}
                <div className="px-5 py-2 border-t border-[hsl(100,5%,94%)] bg-[hsl(42,30%,98%)]">
                  <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[hsl(100,5%,60%)]">
                    Khanqah Saifia
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500",
          isScrolled
            ? "bg-[hsl(42,30%,97%)]/95 backdrop-blur-md shadow-[0_1px_0_hsl(100,5%,88%),0_4px_24px_rgba(0,0,0,0.05)]"
            : "bg-[hsl(42,30%,97%)]/85 backdrop-blur-sm"
        )}
      >
        {/* Top gold accent line */}
        <div className="h-[1.5px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)] to-transparent" />

        <div className="container-sacred">
          <div className="flex items-center justify-between h-[56px] sm:h-[64px] lg:h-[80px]">

            {/* ── Logo ── */}
            <Link href="/" className="relative z-50 flex items-center gap-3 group">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Khanqah Saifia Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-serif text-[17px] lg:text-[19px] font-medium text-[hsl(156,31%,14%)] leading-tight tracking-wide">
                  Khanqah Saifia
                </span>
                {/* <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-[hsl(45,70%,45%)] leading-tight mt-0.5">
                  Est. 1940 · Faisalabad
                </span> */}
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  isActive={isActive(item.href)}
                  pathname={pathname}
                />
              ))}
            </div>

            {/* ── Desktop CTA ── */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Divider */}
              <div className="w-px h-5 bg-[hsl(100,5%,82%)]" />

              <Link href="/qurbani">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative overflow-hidden px-5 py-2.5 bg-[hsl(156,31%,14%)] text-[hsl(42,30%,96%)] text-[11px] font-bold tracking-[0.12em] uppercase rounded-[3px] transition-all duration-300"
                >
                  {/* Shimmer effect */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="relative flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(45,70%,45%)]" />
                    Qurbani
                  </span>
                </motion.button>
              </Link>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-50 lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] focus:outline-none"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={isMobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="w-5 h-[1.5px] bg-[hsl(156,31%,14%)] rounded-full origin-center"
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-[1.5px] bg-[hsl(45,70%,45%)] rounded-full"
              />
              <motion.span
                animate={isMobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="w-5 h-[1.5px] bg-[hsl(156,31%,14%)] rounded-full origin-center"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[hsl(100,3%,10%)]/70 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 h-full w-full max-w-[340px] bg-[hsl(42,30%,97%)] shadow-2xl z-40 lg:hidden overflow-y-auto"
            >
              {/* Gold top strip */}
              <div className="h-[2px] bg-gradient-to-r from-[hsl(45,70%,45%)] to-[hsl(45,70%,55%)]" />

              <div className="pt-[64px] px-6 pb-10">
                {/* Mobile Brand */}
                <div className="flex items-center gap-3 mb-7 pb-5 border-b border-[hsl(100,5%,88%)]">
                  <div className="relative w-11 h-11">
                    <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-medium text-[hsl(156,31%,14%)]">Khanqah Saifia</p>
                    {/* <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-[hsl(45,70%,45%)] mt-0.5">
                      Est. 1975 · Faisalabad
                    </p> */}
                  </div>
                </div>

                {/* Mobile Nav Items */}
                <nav className="space-y-1">
                  {navItems.map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                    >
                      {item.hasDropdown ? (
                        <div className="border-b border-[hsl(100,5%,92%)]">
                          <button
                            onClick={() => setMobileDropdown(mobileDropdown === item.label ? null : item.label)}
                            className="w-full flex items-center justify-between py-3.5 text-left group"
                          >
                            <span className={cn(
                              "text-[12px] font-bold tracking-[0.1em] uppercase transition-colors",
                              isActive(item.href) ? "text-[hsl(156,31%,14%)]" : "text-[hsl(100,5%,35%)] group-hover:text-[hsl(156,31%,14%)]"
                            )}>
                              {item.label}
                            </span>
                            <motion.span
                              animate={{ rotate: mobileDropdown === item.label ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-[hsl(45,70%,45%)] text-xs"
                            >
                              ▾
                            </motion.span>
                          </button>

                          <AnimatePresence>
                            {mobileDropdown === item.label && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="pb-3 pl-3 space-y-0.5">
                                  {item.dropdownItems?.map((sub, i) => (
                                    <motion.div
                                      key={sub.label}
                                      initial={{ opacity: 0, x: -8 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: i * 0.04 }}
                                    >
                                      <Link
                                        href={sub.href}
                                        className={cn(
                                          "flex items-center gap-2.5 py-2.5 px-3 rounded-sm text-[13px] font-medium transition-all",
                                          pathname === sub.href
                                            ? "text-[hsl(156,31%,14%)] bg-[hsl(156,31%,14%)]/6"
                                            : "text-[hsl(100,5%,42%)] hover:text-[hsl(156,31%,14%)] hover:bg-[hsl(156,31%,14%)]/4"
                                        )}
                                      >
                                        <span className="w-1 h-1 rounded-full bg-[hsl(45,70%,45%)] flex-shrink-0" />
                                        {sub.label}
                                      </Link>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center py-3.5 text-[12px] font-bold tracking-[0.1em] uppercase border-b border-[hsl(100,5%,92%)] transition-colors",
                            isActive(item.href) ? "text-[hsl(156,31%,14%)]" : "text-[hsl(100,5%,35%)] hover:text-[hsl(156,31%,14%)]"
                          )}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-8"
                >
                  <Link href="/qurbani" className="block">
                    <button className="w-full py-3.5 bg-[hsl(156,31%,14%)] text-[hsl(42,30%,96%)] text-[11px] font-bold tracking-[0.14em] uppercase rounded-[3px] flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(45,70%,45%)]" />
                     Qurabni at Khanqah Saifia
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;