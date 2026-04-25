// src/components/home/PrayerTimesSection.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PrayerTime {
  key: string;
  nameEn: string;
  nameAr: string;
  time: string;       // 12-hr formatted e.g. "5:14 AM"
  rawMinutes: number; // for comparison
  isCurrent: boolean;
  isNext: boolean;
}

// ─── Prayer meta ──────────────────────────────────────────────────────────────
const PRAYER_META = [
  { key: "Fajr",    nameEn: "Fajr",    nameAr: "الفجر",   apiKey: "Fajr"    },
  { key: "Dhuhr",   nameEn: "Dhuhr",   nameAr: "الظهر",   apiKey: "Dhuhr"   },
  { key: "Asr",     nameEn: "Asr",     nameAr: "العصر",   apiKey: "Asr"     },
  { key: "Maghrib", nameEn: "Maghrib", nameAr: "المغرب",  apiKey: "Maghrib" },
  { key: "Isha",    nameEn: "Isha",    nameAr: "العشاء",  apiKey: "Isha"    },
] as const;

// ─── Inline SVG icons (no lucide dependency needed) ───────────────────────────
const Icons = {
  Fajr: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 3v1M12 20v1M4.22 4.22l.7.7M18.36 18.36l.71.71M3 12H2M22 12h-1M4.22 19.78l.7-.7M18.36 5.64l.71-.71" />
      <path d="M12 8a4 4 0 0 1 0 8" strokeDasharray="2 2" opacity="0.5"/>
      <path d="M17 12a5 5 0 1 1-10 0"/>
    </svg>
  ),
  Dhuhr: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  ),
  Asr: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.34 6.34 4.93 4.93M19.07 19.07l-1.41-1.41M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M3 17h18" strokeOpacity="0.4"/>
    </svg>
  ),
  Maghrib: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 10a4 4 0 0 0 0 8h6"/>
      <path d="M3 17h18"/>
      <path d="M7 17a5 5 0 0 1 5-5"/>
    </svg>
  ),
  Isha: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
    </svg>
  ),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function to12Hour(time24: string): string {
  try {
    const [h, m] = time24.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return "--:--";
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  } catch {
    return "--:--";
  }
}

function toRawMinutes(time12: string): number {
  try {
    const [time, period] = time12.split(" ");
    const [h, m] = time.split(":").map(Number);
    let total = h * 60 + m;
    if (period === "PM" && h !== 12) total += 720;
    if (period === "AM" && h === 12) total -= 720;
    return total;
  } catch {
    return 0;
  }
}

function markCurrentNext(prayers: PrayerTime[]): PrayerTime[] {
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  let currentIdx = prayers.length - 1;
  for (let i = 0; i < prayers.length; i++) {
    if (currentMins < prayers[i].rawMinutes) {
      currentIdx = i - 1 < 0 ? prayers.length - 1 : i - 1;
      break;
    }
  }
  return prayers.map((p, i) => ({
    ...p,
    isCurrent: i === currentIdx,
    isNext: i === (currentIdx + 1) % prayers.length,
  }));
}

function getHijriDate(): string {
  // Rough estimate — replace with API data.data.date.hijri in production
  const islamicMonths = [
    "Muharram","Safar","Rabī al-Awwal","Rabī al-Thānī",
    "Jumādā al-Ūlā","Jumādā al-Ākhirah","Rajab","Sha'bān",
    "Ramaḍān","Shawwāl","Dhū al-Qaʿdah","Dhū al-Ḥijjah",
  ];
  const days = Math.floor(Date.now() / 86400000);
  return `${(days % 30) + 1} ${islamicMonths[Math.floor((days % 360) / 30)]} 1446`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const PrayerSkeleton = () => (
  <div className="animate-pulse flex items-center justify-between px-4 py-3.5 rounded-[3px] bg-[hsl(156,20%,14%)]">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-[hsl(156,20%,20%)]" />
      <div className="space-y-1.5">
        <div className="w-14 h-3 rounded bg-[hsl(156,20%,20%)]" />
        <div className="w-10 h-2.5 rounded bg-[hsl(156,20%,18%)]" />
      </div>
    </div>
    <div className="w-16 h-4 rounded bg-[hsl(156,20%,20%)]" />
  </div>
);

// ─── Single prayer row ────────────────────────────────────────────────────────
const PrayerRow = ({
  prayer,
  index,
  isInView,
}: {
  prayer: PrayerTime;
  index: number;
  isInView: boolean;
}) => {
  const Icon = Icons[prayer.key as keyof typeof Icons];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 + index * 0.08 }}
      className={`
        relative flex items-center justify-between
        px-4 py-3.5 rounded-[3px]
        transition-all duration-300
        ${prayer.isCurrent
          ? "bg-[hsl(156,31%,14%)] border border-[hsl(45,70%,45%)]/50 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          : prayer.isNext
          ? "bg-[hsl(156,20%,13%)] border border-[hsl(156,20%,22%)]"
          : "bg-[hsl(156,20%,11%)] border border-[hsl(156,20%,16%)] hover:border-[hsl(156,20%,24%)]"
        }
      `}
    >
      {/* Current indicator bar */}
      {prayer.isCurrent && (
        <span className="absolute left-0 top-3 bottom-3 w-[2px] bg-[hsl(45,70%,45%)] rounded-r-full" />
      )}

      <div className="flex items-center gap-3">
        {/* Icon bubble */}
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          ${prayer.isCurrent
            ? "bg-[hsl(45,70%,45%)]/20 text-[hsl(45,70%,55%)]"
            : prayer.isNext
            ? "bg-[hsl(156,20%,20%)] text-[hsl(42,30%,70%)]"
            : "bg-[hsl(156,20%,16%)] text-[hsl(42,30%,50%)]"
          }
        `}>
          <Icon />
        </div>

        {/* Name block */}
        <div>
          <p className={`text-[13px] font-semibold leading-none mb-0.5
            ${prayer.isCurrent ? "text-[hsl(42,30%,95%)]" : "text-[hsl(42,30%,80%)]"}
          `}>
            {prayer.nameEn}
          </p>
          <p className={`font-arabic text-[13px] leading-none
            ${prayer.isCurrent ? "text-[hsl(45,70%,50%)]" : "text-[hsl(42,30%,96%)]/30"}
          `}>
            {prayer.nameAr}
          </p>
        </div>
      </div>

      {/* Right: time + badge */}
      <div className="text-right flex flex-col items-end gap-0.5">
        <p className={`font-serif text-[16px] leading-none
          ${prayer.isCurrent
            ? "text-[hsl(45,70%,55%)]"
            : prayer.isNext
            ? "text-[hsl(42,30%,88%)]"
            : "text-[hsl(42,30%,65%)]"
          }
        `}>
          {prayer.time}
        </p>
        {prayer.isCurrent && (
          <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-[hsl(45,70%,50%)]">
            Now
          </span>
        )}
        {prayer.isNext && (
          <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-[hsl(42,30%,96%)]/35">
            Next
          </span>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main section ─────────────────────────────────────────────────────────────
const PrayerTimesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [gregorianDate, setGregorianDate] = useState("");
  const [hijriDate, setHijriDate] = useState("");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);

      // Gregorian date display
      setGregorianDate(
        new Date().toLocaleDateString("en-US", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
          timeZone: "Asia/Karachi",
        })
      );

      try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();

        // Faisalabad coordinates, Hanafi (method=1, school=1)
        const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=31.4504&longitude=73.1350&method=1&school=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("API error");
        const json = await res.json();
        if (json.code !== 200) throw new Error("Bad response");

        const t = json.data.timings;

        // Use Hijri from API if available
        if (json.data?.date?.hijri) {
          const h = json.data.date.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
        } else {
          setHijriDate(getHijriDate());
        }

        const raw: PrayerTime[] = PRAYER_META.map((meta) => {
          const t12 = to12Hour(t[meta.apiKey]);
          return {
            key: meta.key,
            nameEn: meta.nameEn,
            nameAr: meta.nameAr,
            time: t12,
            rawMinutes: toRawMinutes(t12),
            isCurrent: false,
            isNext: false,
          };
        });

        setPrayers(markCurrentNext(raw));
      } catch {
        setError(true);
        // Fallback times
        const fallback = [
          { key: "Fajr",    time: "5:14 AM"  },
          { key: "Dhuhr",   time: "12:10 PM" },
          { key: "Asr",     time: "3:40 PM"  },
          { key: "Maghrib", time: "6:28 PM"  },
          { key: "Isha",    time: "7:55 PM"  },
        ];
        const raw: PrayerTime[] = PRAYER_META.map((meta, i) => ({
          key: meta.key,
          nameEn: meta.nameEn,
          nameAr: meta.nameAr,
          time: fallback[i].time,
          rawMinutes: toRawMinutes(fallback[i].time),
          isCurrent: false,
          isNext: false,
        }));
        setPrayers(markCurrentNext(raw));
        setHijriDate(getHijriDate());
      } finally {
        setLoading(false);
      }
    };

    load();

    // Refresh current/next marker every minute
    const tick = setInterval(() => {
      setPrayers((prev) => markCurrentNext(prev));
    }, 60_000);

    return () => clearInterval(tick);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
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

      {/* Faint Arabic watermark */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden select-none z-0">
        <span
          className="font-arabic leading-none text-[hsl(156,31%,14%)]/[0.04]"
          style={{ fontSize: "clamp(80px, 18vw, 220px)" }}
          aria-hidden
        >
          الصلاة
        </span>
      </div>

      {/* Corner arc */}
      <div className="pointer-events-none absolute top-0 left-0 w-48 h-48 lg:w-72 lg:h-72 border-l border-t border-[hsl(45,70%,45%)]/12 rounded-tl-full z-0" />

      <div className="container-sacred relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

          {/* ── LEFT — Header + card ── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Section label */}
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[hsl(45,70%,45%)] mb-4">
              Daily Obligations
            </p>

            {/* Heading */}
            <h2
              className="font-serif font-normal text-[hsl(156,31%,14%)] leading-[1.18] mb-4"
              style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
            >
              Prayer Times
            </h2>

            {/* Gold rule */}
            <div className="w-12 h-[2px] bg-[hsl(45,70%,45%)] mb-5" />

            {/* Body copy */}
            <p className="text-[14px] sm:text-[15px] leading-[1.85] text-[hsl(100,5%,35%)] mb-8 max-w-md">
              Live prayer schedule for{" "}
              <span className="font-semibold text-[hsl(156,31%,18%)]">
                Faisalabad, Pakistan
              </span>{" "}
              calculated on{" "}
              <span className="font-medium text-[hsl(156,31%,18%)]">
                Sunni Ḥanafī Fiqh
              </span>
              . Times refresh automatically each day.
            </p>

            {/* Mosque image placeholder — replace src with your image */}
            <div className="relative rounded-[4px] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.12)] aspect-[16/9] sm:aspect-[4/3] lg:aspect-[16/9]">
              <img
                src="/images/astana.jpg"
                alt="Faisalabad Mosque"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(156,31%,8%)]/50 via-transparent to-transparent" />

              {/* Overlay date badge */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-flex flex-col bg-[hsl(156,31%,8%)]/80 backdrop-blur-sm px-4 py-2.5 rounded-[3px] border border-[hsl(45,70%,45%)]/20">
                  <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[hsl(45,70%,50%)] leading-none mb-1">
                    {hijriDate || "— AH"}
                  </span>
                  <span className="text-[11px] text-[hsl(42,30%,85%)] leading-none">
                    {gregorianDate}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT — Prayer list card ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            {/* Dark card */}
            <div className="bg-[hsl(156,31%,9%)] rounded-[4px] overflow-hidden border border-[hsl(156,20%,16%)] shadow-[0_24px_64px_rgba(0,0,0,0.18)]">

              {/* Card header */}
              <div className="px-5 pt-5 pb-4 border-b border-[hsl(156,20%,16%)] flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[hsl(45,70%,45%)] mb-0.5">
                    Today's Schedule
                  </p>
                  <p className="font-arabic text-lg text-[hsl(42,30%,96%)]/50 leading-none">
                    مَوَاقِيتُ الصَّلَاة
                  </p>
                </div>

                {/* Live dot */}
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(45,70%,45%)] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(45,70%,45%)]" />
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-[hsl(42,30%,96%)]/35">
                    Live
                  </span>
                </div>
              </div>

              {/* Prayer rows */}
              <div className="px-4 py-4 space-y-2">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <PrayerSkeleton key={i} />)
                  : prayers.map((prayer, i) => (
                      <PrayerRow
                        key={prayer.key}
                        prayer={prayer}
                        index={i}
                        isInView={isInView}
                      />
                    ))
                }
              </div>

              {/* Card footer */}
              <div className="px-5 py-4 border-t border-[hsl(156,20%,16%)] flex items-center justify-between">
                <p className="text-[10px] text-[hsl(42,30%,96%)]/25 leading-relaxed max-w-[180px]">
                  Method: University of Islamic Sciences, Karachi
                </p>
                {error && (
                  <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-[hsl(0,70%,55%)]">
                    Approx. times
                  </span>
                )}
              </div>
            </div>

            {/* Below card — Qiblah note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-5 flex items-center gap-3 px-1"
            >
              {/* Compass SVG */}
              <div className="w-8 h-8 flex-shrink-0 rounded-full border border-[hsl(100,5%,82%)] flex items-center justify-center text-[hsl(156,31%,28%)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>
                </svg>
              </div>
              <p className="text-[12px] leading-relaxed text-[hsl(100,5%,45%)]">
                Qiblah direction from Faisalabad:{" "}
                <span className="font-semibold text-[hsl(156,31%,22%)]">287° NW</span>
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PrayerTimesSection;