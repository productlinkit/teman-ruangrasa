"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const heroUsers = [
  { src: "/hero-user-1.webp", bg: "#E5D7F2", size: "sm" as const },
  { src: "/hero-user-2.webp", bg: "#F8D7E0", size: "md" as const },
  { src: "/hero-user-3.webp", bg: "#C7EBD9", size: "lg" as const },
  { src: "/hero-user-4.webp", bg: "#FBF4C5", size: "md" as const },
  { src: "/hero-user-5.webp", bg: "#D4E9FB", size: "sm" as const },
];

const sizeMap: Record<"sm" | "md" | "lg", string> = {
  sm: "w-10 h-10 sm:w-14 sm:h-14",
  md: "w-14 h-14 sm:w-20 sm:h-20",
  lg: "w-16 h-16 sm:w-28 sm:h-28",
};

type Badge = {
  label: string;
  italic?: string;
  variant: "blue" | "yellow" | "blue-soft" | "yellow-soft";
};

const row1: Badge[] = [
  { label: "Privat 100%", variant: "blue" },
  { label: "Tanpa ", italic: "Judgement", variant: "yellow" },
  { label: "AI Empati", variant: "blue" },
];

const row2: Badge[] = [
  { label: "Selalu Ada 24/7", variant: "blue-soft" },
  { label: "Gratis", variant: "yellow" },
  { label: "Netral & Objektif", variant: "blue-soft" },
];

function Pill({ b }: { b: Badge }) {
  const map: Record<Badge["variant"], string> = {
    blue: "bg-[#185FA5] text-white",
    "blue-soft": "bg-[#2B7FFF] text-white",
    yellow: "bg-[#FCD34D] text-[#0f172a]",
    "yellow-soft": "bg-[#FEF3C7] text-[#92400e]",
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3.5 py-2 sm:px-5 sm:py-2.5 text-[11.5px] sm:text-[13px] font-semibold whitespace-nowrap shadow-sm ${map[b.variant]}`}>
      {b.label}
      {b.italic && <em className="italic font-semibold ml-1">{b.italic}</em>}
    </span>
  );
}

function Sparkle() {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#185FA5] text-white shadow-sm shrink-0">
      <svg
        width="12"
        height="12"
        className="sm:w-3.5 sm:h-3.5"
        viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 2 L13.5 9 L21 11 L13.5 13.5 L12 22 L10.5 13.5 L3 11 L10.5 9 Z" />
      </svg>
    </span>
  );
}

export default function Hero() {
  const orbRef = useRef<HTMLDivElement | null>(null);
  const orb2Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!orbRef.current || !orb2Ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(orbRef.current, {
        y: 30,
        x: 20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(orb2Ref.current, {
        y: -40,
        x: -25,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-10 lg:pb-12 overflow-hidden">
      {/* Background decorations */}
      <div
        ref={orbRef}
        className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/10 blur-3xl"
      />
      <div
        ref={orb2Ref}
        className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-yellow-300/20 to-orange-300/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mx-auto mb-10 sm:mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-[28px] sm:text-[40px] lg:text-[52px] leading-[1.1] font-extrabold tracking-tight text-[#0f172a]">
            Grup WA-mu lagi drama?
            <br />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-[#185FA5]">
              Kamu nggak harus hadapin sendiri.
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-5 text-[14px] sm:text-[16px] text-[#475569] leading-relaxed max-w-2xl mx-auto">
            RuangRasa Teman adalah tempat aman buat kamu cerita, berpikir
            jernih, dan nemuin kata yang tepat — sebelum situasinya makin panas
            atau malah makin diam.
          </motion.p>
        </div>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left: image */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#dbeafe] to-[#e0f2fe] aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:min-h-[420px] shadow-xl shadow-blue-900/5">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/img-hero.webp')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent" />

            {/* Bottom buttons */}
            <div className="absolute bottom-5 right-5 flex items-center gap-3">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#problems"
                className="inline-flex items-center gap-2 rounded-full bg-[#185FA5] px-5 py-3 text-[12.5px] sm:text-[13px] font-semibold text-white shadow-xl">
                Lihat situasi yang bisa dibantu
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                href="#problems"
                aria-label="Buka detail"
                className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#185FA5] text-white shadow-xl hover:bg-[#0F4478] transition-colors flex-shrink-0">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Right: stats card with yellow accent */}
          <div className="flex flex-col gap-5">
            {/* Yellow stats card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="relative rounded-3xl bg-gradient-to-br from-[#FCD34D] via-[#FBBF24] to-[#F59E0B] p-4 sm:p-7 shadow-xl shadow-amber-500/15 overflow-hidden">
              {/* Decorative blobs */}
              <div className="absolute -right-10 top-0 w-44 h-44 rounded-full bg-[#FDE68A]/70 blur-md" />
              <div className="absolute -right-6 bottom-10 w-32 h-32 rounded-full bg-[#FEF3C7]/60 blur-md" />
              <div className="absolute right-20 bottom-2 w-20 h-20 rounded-full bg-[#FDE68A]/80 blur-sm" />

              <div className="relative">
                <p className="text-[14.5px] sm:text-[18px] lg:text-[19px] font-extrabold text-[#0f172a] leading-snug">
                  50,000+ orang sudah menemukan ketenangan di RuangRasa
                </p>

                {/* Avatars row - center largest, symmetrical scale */}
                <div className="mt-4 sm:mt-5 flex items-center justify-center gap-1 sm:gap-2.5">
                  {heroUsers.map((u, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                      className={`relative ${sizeMap[u.size]} rounded-full ring-2 ring-white shadow-md overflow-hidden shrink-0`}
                      style={{ backgroundColor: u.bg }}>
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${u.src})` }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    window.dispatchEvent(new Event("ruangrasa:open-chat"))
                  }
                  className="mt-4 sm:mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#185FA5] px-4 sm:px-6 py-3 sm:py-3.5 text-[13px] sm:text-[13.5px] font-bold text-white shadow-lg hover:bg-[#0F4478] transition-colors">
                  Coba Sekarang, Gratis
                </motion.button>
              </div>
            </motion.div>

            {/* Yang membedakan RuangRasa card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="relative rounded-3xl bg-white p-4 sm:p-7 shadow-lg shadow-blue-900/5 border border-[#e2e8f0] overflow-hidden">
              {/* Dotted polka background */}
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              <div className="relative">
                <p className="text-center text-[13.5px] sm:text-[15px] font-bold text-[#0f172a] mb-4 sm:mb-5">
                  Yang membedakan{" "}
                  <span className="text-[#185FA5]">RuangRasa</span>
                </p>

                {/* Row 1 - scattered */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mb-2 sm:mb-3">
                  {row1.map((b, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + i * 0.08 }}
                      className={i === 1 ? "translate-y-1" : ""}>
                      <Pill b={b} />
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 }}>
                    <Sparkle />
                  </motion.div>
                </div>

                {/* Row 2 - scattered */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 }}>
                    <Pill b={row2[0]} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}>
                    <Sparkle />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 }}
                    className="-translate-y-1">
                    <Pill b={row2[1]} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.7 }}>
                    <Pill b={row2[2]} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
