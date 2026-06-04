"use client";

import { motion } from "framer-motion";

type Negative = { text: React.ReactNode };
type Positive = { title: React.ReactNode; desc: string };

const negatives: Negative[] = [
  {
    text: (
      <>
        Risiko jadi gosip di <em className="italic">circle</em>
      </>
    ),
  },
  { text: "Teman bisa berpihak, bukan netral" },
  { text: "Mungkin capek dengerin masalah yang sama" },
  {
    text: (
      <>
        Takut di-<em className="italic">judge</em> atau dianggap lebay
      </>
    ),
  },
  { text: "Nggak selalu tersedia saat kamu butuh" },
  {
    text: (
      <>
        Bisa bikin <em className="italic">awkward</em> kalau ketemu lagi
      </>
    ),
  },
];

const positives: Positive[] = [
  {
    title: "100% Privat & Rahasia",
    desc: "Tidak ada yang tahu selain kamu",
  },
  {
    title: (
      <>
        Tanpa <em className="italic">Judgement</em>
      </>
    ),
    desc: "Nggak akan pernah dianggap lebay atau drama",
  },
  {
    title: "Netral & Objektif",
    desc: "Fokus ke solusi, bukan berpihak",
  },
  {
    title: "Selalu Ada 24/7",
    desc: "Kapanpun kamu butuh, langsung bisa cerita",
  },
  {
    title: (
      <>
        Nggak Bikin <em className="italic">Awkward</em>
      </>
    ),
    desc: "Nggak perlu khawatir ketemu lagi",
  },
  {
    title: "Nggak Ada Tekanan Sosial",
    desc: "Bebas ekspresikan perasaan tanpa beban",
  },
];

export default function Comparison() {
  return (
    <section className="py-10 sm:py-14 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[24px] sm:text-[32px] lg:text-[40px] font-extrabold text-[#0f172a] leading-tight"
          >
            <span className="text-[#185FA5]">Kenapa curhat ke Ruang Rasa</span>{" "}
            lebih baik?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-[14px] sm:text-[15px] text-[#64748b]"
          >
            Curhat ke teman itu bagus. Tapi ada yang nggak bisa diceritain sama
            teman.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          {/* Negative card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white shadow-md border border-[#eef3fa] overflow-hidden"
          >
            <div className="relative aspect-[16/10] sm:aspect-[16/9]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/img-comparison-1.webp')",
                }}
              />
            </div>
            <ul className="p-6 sm:p-8 space-y-4">
              {negatives.map((n, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E5E7EB] text-[#6B7280]">
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
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </span>
                  <p className="text-[14px] sm:text-[14.5px] text-[#475569] leading-snug">
                    {n.text}
                  </p>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Positive card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white shadow-md border border-[#eef3fa] overflow-hidden"
          >
            <div className="relative aspect-[16/10] sm:aspect-[16/9]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/img-comparison-2.webp')",
                }}
              />
            </div>
            <ul className="p-6 sm:p-8 space-y-4">
              {positives.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <span className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FBBF24] text-white shadow-sm">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[14px] sm:text-[15px] font-bold text-[#0f172a] leading-snug">
                      {p.title}
                    </p>
                    <p className="text-[12.5px] sm:text-[13px] text-[#64748b] mt-0.5 leading-snug">
                      {p.desc}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 sm:mt-12 text-center max-w-4xl mx-auto"
        >
          <p className="text-[18px] sm:text-[22px] lg:text-[24px] font-extrabold text-[#0f172a]">
            Kamu nggak harus pilih salah satu
          </p>
          <p className="mt-3 text-[13px] sm:text-[14.5px] text-[#64748b] leading-relaxed">
            Teman tetap penting. Tapi untuk konflik yang butuh{" "}
            <span className="font-bold text-[#185FA5]">
              ruang aman, perspektif netral, dan tanpa risiko sosial
            </span>{" "}
            — Ruang Rasa ada buat kamu.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
