"use client";

import { motion } from "framer-motion";
import { LogoIcon } from "./icons/Logo";

const steps = [
  {
    num: "1",
    title: "Ceritain drama-nya",
    desc: "Tulis apa yang terjadi — dari awal sampai sekarang. RuangRasa nggak akan nge-judge.",
  },
  {
    num: "2",
    title: "Lihat lebih jernih",
    desc: "Kadang kita terlalu dekat sama situasinya buat mikir jernih. Kami bantu kamu lihat dari berbagai sudut — dan apa yang sebenarnya terjadi.",
  },
  {
    num: "3",
    title: "Tentukan langkah selanjutnya",
    desc: "Mau ngomong langsung? Mau diam dulu? Mau ngirim pesan? Kami bantu draft kata-kata, atau bantu kamu siap kalau kamu butuh.",
  },
];

export default function Steps() {
  return (
    <section
      id="cara-kerja"
      className="py-10 sm:py-14 relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-[24px] sm:text-[32px] lg:text-[40px] font-extrabold text-[#0f172a] leading-tight">
            <span className="text-[#185FA5]">Tiga langkah sederhana</span>{" "}
            mendapatkan <em className="not-italic text-[#185FA5]">clarity</em>
          </h2>
          <p className="mt-4 text-[14px] sm:text-[15px] text-[#64748b]">
            Proses yang simpel, tanpa ribet — cocok buat kamu yang butuh bantuan
            cepat.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Steps */}
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                className="relative flex gap-4 sm:gap-5 bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-[#eef3fa] hover:shadow-lg transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#fcd34d] to-[#fbbf24] flex items-center justify-center font-extrabold text-[20px] sm:text-[24px] text-[#0f172a] shadow-lg shadow-amber-500/20">
                    {s.num}
                  </div>
                </div>
                <div>
                  <h3 className="text-[16px] sm:text-[18px] font-bold text-[#0f172a] mb-1">
                    {s.title}
                  </h3>
                  <p className="text-[13px] sm:text-[13.5px] text-[#64748b] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-sm"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative bg-gradient-to-br from-[#185FA5] to-[#061638] rounded-[40px] p-3 shadow-2xl shadow-blue-900/30"
            >
              <div className="bg-white rounded-[32px] overflow-hidden p-4 sm:p-5 aspect-[9/16]">
                {/* Status bar */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#94a3b8] text-[10px] font-semibold">
                    9:41
                  </span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 rounded bg-[#cbd5e1]" />
                    <div className="w-4 h-2 rounded bg-[#94a3b8]" />
                    <div className="w-4 h-2 rounded bg-[#0f172a]" />
                  </div>
                </div>

                {/* Chat header */}
                <div className="flex items-center gap-2 pb-3 border-b border-[#e2e8f0]">
                  <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 ring-1 ring-[#dbeafe]">
                    <LogoIcon size={26} filled={false} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#0f172a]">
                      RuangRasa
                    </p>
                    <p className="text-[8px] text-green-500">● online</p>
                  </div>
                </div>

                {/* Chat bubbles */}
                <div className="mt-4 space-y-2">
                  <ChatBubble
                    side="right"
                    text="Gue baru tau temen-temen ngomongin gue di belakang..."
                    delay={0.5}
                  />
                  <ChatBubble
                    side="right"
                    text="Sakit banget. Gue harus gimana?"
                    delay={0.9}
                  />
                  <ChatBubble
                    side="left"
                    text="Aku paham itu sakit. Cerita lebih lanjut yuk — kapan terjadi, dan apa yang sebenarnya mereka bilang?"
                    delay={1.3}
                  />
                  <ChatBubble
                    side="right"
                    text="Temen A screenshot-in chat mereka, isinya nyinyirin tentang gue..."
                    delay={1.7}
                  />
                  <ChatBubble
                    side="left"
                    text="Oke, aku bantu kita breakdown dulu. Apa yang spesifik bikin kamu paling sakit?"
                    delay={2.1}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-[#f1f5f9]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-pulse" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-[#fcd34d]/60 to-[#fbbf24]/30 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-gradient-to-br from-[#3b82f6]/40 to-[#185FA5]/30 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({
  side,
  text,
  delay,
}: {
  side: "left" | "right";
  text: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl text-[10.5px] leading-snug ${
          side === "right"
            ? "bg-[#185FA5] text-white rounded-br-md"
            : "bg-[#f1f5f9] text-[#0f172a] rounded-bl-md"
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
}
