"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const videos = [
  {
    id: "Qp5LjO2lZak",
    day: "Day 1",
    title: "Qurbani Distribution — Day 1",
  },
  {
    id: "uhxKDlDEthY",
    day: "Day 2",
    title: "Qurbani Distribution — Day 2",
  },
];

const QurbaniVideoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative bg-[hsl(156,31%,10%)] overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      {/* Grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)] to-transparent z-10" />

      {/* Bottom gold rule */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(45,70%,45%)]/50 to-transparent z-10" />

      <div className="container-sacred relative z-10 px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[hsl(45,70%,45%)] mb-3">
            Our Service
          </p>

          <h2
            className="font-serif font-normal text-[hsl(42,30%,95%)] leading-[1.2] mb-4"
            style={{ fontSize: "clamp(26px, 4vw, 42px)" }}
          >
            Qurbani Meat{" "}
            <span className="italic text-[hsl(45,70%,50%)]">Distribution</span>
          </h2>

          <div className="h-[2px] w-14 bg-[hsl(45,70%,45%)] mx-auto mb-4" />

          <p className="text-[13px] sm:text-[14px] leading-[1.85] text-[hsl(42,30%,96%)]/55 max-w-xl mx-auto">
            Watch how we serve and distribute Qurbani meat to deserving and
            needy families — fulfilling the sunnah with love and care.
          </p>
        </motion.div>

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.15 + i * 0.12,
              }}
            >
              {/* Day label */}
              <div className="flex items-center gap-3 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(45,70%,45%)]" />
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[hsl(45,70%,45%)]">
                  {video.day}
                </p>
              </div>

              {/* Responsive 16:9 iframe */}
              <div className="relative w-full aspect-video rounded-[4px] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.4)] border border-[hsl(42,30%,96%)]/8">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default QurbaniVideoSection;
