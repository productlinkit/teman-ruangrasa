"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Gue nggak tau ngomong ke siapa soal ini. RuangRasa bantu gue ngerti kalau gue nggak sendiri.",
    name: "Beta",
    role: "Mahasiswa, 21",
    avatar: "/hero-user-1.webp",
  },
  {
    quote:
      "Akhirnya bisa cerita tanpa takut di-judge. RuangRasa kayak temen yang denger tanpa hakim.",
    name: "Bara",
    role: "Designer, 24",
    avatar: "/hero-user-2.webp",
  },
  {
    quote:
      "Aku kira AI cuma chatbot biasa. Tapi RuangRasa beneran ngerti konteks pertemanan aku.",
    name: "Citra",
    role: "Content Creator, 23",
    avatar: "/hero-user-3.webp",
  },
  {
    quote:
      "Pas konflik sama temen, RuangRasa bantu aku liat sudut pandang dia. Akhirnya kita baikan.",
    name: "Dina",
    role: "Karyawan, 26",
    avatar: "/hero-user-4.webp",
  },
  {
    quote:
      "Yang paling aku suka itu privat. Nggak ada drama tambahan, nggak ada yang tahu.",
    name: "Edo",
    role: "Pelajar SMA, 17",
    avatar: "/hero-user-5.webp",
  },
  {
    quote:
      "Sebelum kirim pesan emosi, aku biasa ngobrol dulu di RuangRasa. Save my friendship!",
    name: "Fira",
    role: "Freelancer, 25",
    avatar: "/hero-user-1.webp",
  },
];

const avatars = [
  "/hero-user-1.webp",
  "/hero-user-2.webp",
  "/hero-user-3.webp",
  "/hero-user-4.webp",
  "/hero-user-5.webp",
];

export default function Testimonials() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [count, setCount] = useState(0);

  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  // Count-up
  useEffect(() => {
    if (!inView) return;
    const target = 878;
    let current = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(t);
      }
      setCount(current);
    }, 25);
    return () => clearInterval(t);
  }, [inView]);

  // Responsive visible count
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setVisibleCount(3);
      else if (w >= 640) setVisibleCount(2);
      else setVisibleCount(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleCount);
  const safeIndex = Math.min(index, maxIndex);
  const offset = (safeIndex * 100) / visibleCount;

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <section ref={ref} className="py-10 sm:py-14 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[24px] sm:text-[32px] lg:text-[40px] font-extrabold text-[#0f172a] leading-tight"
          >
            Kamu <span className="text-[#185FA5]">nggak sendirian</span> dalam
            situasi ini
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h3 className="text-[48px] sm:text-[64px] lg:text-[80px] font-extrabold tracking-tight leading-none bg-gradient-to-r from-[#185FA5] via-[#2563eb] to-[#185FA5] bg-clip-text text-transparent">
            {count}+
          </h3>
          <p className="mt-2 text-[14px] sm:text-[15px] text-[#475569] font-medium">
            orang sudah bergabung ke waitlist
          </p>
          <div className="mt-4 flex justify-center items-center -space-x-3">
            {avatars.map((src, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                className="w-10 h-10 rounded-full ring-2 ring-white overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: 1, type: "spring" }}
              className="w-10 h-10 rounded-full ring-2 ring-white bg-[#185FA5] flex items-center justify-center text-[10px] font-bold text-white"
            >
              +870
            </motion.div>
          </div>
        </motion.div>

        {/* Slider */}
        <div className="relative">
          {/* Arrows */}
          <div className="absolute -top-14 right-0 flex items-center gap-2 z-10">
            <button
              onClick={prev}
              disabled={safeIndex === 0}
              aria-label="Sebelumnya"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white border border-[#e2e8f0] text-[#185FA5] shadow-md hover:bg-[#185FA5] hover:text-white hover:border-[#185FA5] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#185FA5] disabled:hover:border-[#e2e8f0]"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              disabled={safeIndex === maxIndex}
              aria-label="Selanjutnya"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#185FA5] text-white shadow-md hover:bg-[#0F4478] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#185FA5]"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="overflow-hidden -mx-2 sm:-mx-3">
            <motion.div
              animate={{ x: `-${offset}%` }}
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
              className="flex"
            >
              {testimonials.map((t, i) => {
                const isBlue = i % 2 === 0;
                return (
                  <div
                    key={i}
                    className="shrink-0 px-2 sm:px-3"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`relative h-full rounded-3xl p-6 sm:p-7 shadow-lg overflow-hidden ${
                        isBlue
                          ? "bg-gradient-to-br from-[#185FA5] to-[#0F4478]"
                          : "bg-gradient-to-br from-[#FCD34D] to-[#F59E0B]"
                      }`}
                    >
                      {/* Quote decoration */}
                      <svg
                        className={`absolute top-4 right-4 ${
                          isBlue ? "text-white/15" : "text-white/30"
                        }`}
                        width="56"
                        height="56"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2H4v2h1a4 4 0 0 0 4-4V7Zm12 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2h-1v2h1a4 4 0 0 0 4-4V7Z" />
                      </svg>

                      <div className="relative min-h-[180px] sm:min-h-[200px] flex flex-col">
                        <p className="text-[14px] sm:text-[14.5px] leading-relaxed font-medium text-white flex-1">
                          &quot;{t.quote}&quot;
                        </p>

                        <div className="mt-5 flex items-center gap-3 pt-4 border-t border-white/20">
                          <div
                            className="w-11 h-11 rounded-full ring-2 ring-white bg-cover bg-center shrink-0"
                            style={{ backgroundImage: `url(${t.avatar})` }}
                          />
                          <div>
                            <p className="text-[13px] font-bold text-white">
                              {t.name}
                            </p>
                            <p className="text-[11.5px] text-white/80">
                              {t.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Pagination dots */}
          <div className="mt-6 flex justify-center items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === safeIndex
                    ? "w-8 bg-[#185FA5]"
                    : "w-2 bg-[#cbd5e1] hover:bg-[#94a3b8]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
