"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  {
    big: "1 dari 5",
    description:
      "Anak muda Indonesia merasa kesepian meski punya banyak teman online (WHO 2024)",
  },
  {
    big: "#1 Penyebab",
    description:
      "konflik pertemanan yang dibiarkan diam bisa menyebabkan persahabatan berakhir hanya karena salah paham",
  },
  {
    big: "Jutaan",
    description:
      "Budaya 'jaga perasaan' membuat jutaan konflik di Indonesia tidak pernah terselesaikan",
  },
];

export default function StatsBanner() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-[#0a1a3f] via-[#061638] to-[#020b24] p-6 sm:p-10 lg:p-12 shadow-2xl shadow-blue-900/20"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.3) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(252,211,77,0.15) 0, transparent 40%)",
              }}
            />
          </div>
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 39.5h40M39.5 0v40' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="md:px-6 py-6 md:py-0 first:pt-0 first:md:pl-0 last:md:pr-0"
              >
                <CountUp text={s.big} inView={inView} />
                <p className="mt-3 text-[12.5px] sm:text-[13.5px] text-white/70 leading-relaxed">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CountUp({ text, inView }: { text: string; inView: boolean }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView) return;
    // For numeric like "1 dari 5"
    const match = text.match(/^(\d+)/);
    if (!match) {
      setDisplay(text);
      return;
    }
    const target = parseInt(match[1]);
    const rest = text.slice(match[0].length);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setDisplay(`${current}${rest}`);
    }, 40);
    return () => clearInterval(timer);
  }, [inView, text]);

  return (
    <h3 className="text-[28px] sm:text-[36px] lg:text-[44px] font-extrabold tracking-tight bg-gradient-to-r from-[#fcd34d] via-[#fde68a] to-[#60a5fa] bg-clip-text text-transparent leading-none">
      {display}
    </h3>
  );
}
