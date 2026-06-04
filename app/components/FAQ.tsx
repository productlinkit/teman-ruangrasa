"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    q: "Apakah temanku akan tahu kalau aku pakai ini?",
    a: "Tidak. RuangRasa 100% privat dan rahasia. Tidak ada yang akan tahu bahwa kamu pakai aplikasi ini kecuali kamu sendiri yang memberitahu mereka.",
  },
  {
    q: "Apakah AI ini akan menghakimi aku?",
    a: "Tidak sama sekali. RuangRasa dirancang untuk mendengarkan tanpa menghakimi. Kamu bebas cerita apapun tanpa takut dinilai.",
  },
  {
    q: "Bagaimana kalau situasinya melibatkan lebih dari satu orang?",
    a: "RuangRasa bisa membantu kamu memahami dinamika konflik yang melibatkan banyak orang. Kami bantu kamu lihat dari berbagai sudut pandang.",
  },
  {
    q: "Apakah ini gratis?",
    a: "Ya, RuangRasa gratis untuk waitlist member. Setelah launching, kami akan punya plan gratis dan premium dengan fitur tambahan.",
  },
  {
    q: "Apakah ini terapi?",
    a: "Bukan, RuangRasa bukan pengganti terapi profesional. Ini adalah teman curhat AI yang membantu kamu menavigasi konflik sosial sehari-hari. Untuk masalah serius, konsultasikan dengan psikolog.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-10 sm:py-14 relative overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[24px] sm:text-[32px] lg:text-[40px] font-extrabold text-[#0f172a] leading-tight"
          >
            Pertanyaan yang{" "}
            <span className="text-[#185FA5]">Sering Ditanya</span>
          </motion.h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`rounded-2xl border transition-colors overflow-hidden ${
                open === i
                  ? "bg-[#185FA5] border-[#185FA5]"
                  : "bg-white border-[#e2e8f0] hover:border-[#cbd5e1]"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span
                  className={`text-[13.5px] sm:text-[14.5px] font-semibold transition-colors ${
                    open === i ? "text-white" : "text-[#0f172a]"
                  }`}
                >
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full ${
                    open === i
                      ? "bg-white/15 text-white"
                      : "bg-[#eef3fa] text-[#185FA5]"
                  }`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-[13px] leading-relaxed text-white/85">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
