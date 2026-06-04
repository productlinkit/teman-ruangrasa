"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  MessageSquare,
  UserMinus,
  MessageSquareX,
  MessageCircle,
  UserX,
  Unlink,
} from "lucide-react";

type Problem = {
  text: React.ReactNode;
  image: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
};

const problems: Problem[] = [
  {
    text: "Teman ngomongin kamu di belakang dan kamu baru tau sekarang",
    image: "/img-problems-1.webp",
    Icon: MessageSquare,
  },
  {
    text: "Dikeluarin dari grup atau nggak diajak tanpa penjelasan",
    image: "/img-problems-2.webp",
    Icon: UserMinus,
  },
  {
    text: "Mau konfrontasi tapi takut dianggap lebay atau drama",
    image: "/img-problems-3.webp",
    Icon: MessageSquareX,
  },
  {
    text: (
      <>
        Pesan yang salah diartiin dan sekarang jadi{" "}
        <em className="italic">awkward</em>
      </>
    ),
    image: "/img-problems-4.webp",
    Icon: MessageCircle,
  },
  {
    text: "Udah lama diam-diaman tapi nggak tahu harus mulai dari mana",
    image: "/img-problems-5.webp",
    Icon: UserX,
  },
  {
    text: "Grup teman mulai retak karena satu kejadian kecil yang membesar",
    image: "/img-problems-6.webp",
    Icon: Unlink,
  },
];

export default function Problems() {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section
      id="problems"
      className="py-10 sm:py-14 relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[24px] sm:text-[32px] lg:text-[40px] font-extrabold text-[#0f172a] leading-tight"
          >
            Kamu pernah ngerasain{" "}
            <span className="text-[#185FA5]">salah satu dari ini?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-[14px] sm:text-[15px] text-[#64748b]"
          >
            Pilih semua yang pernah kamu alami. Data ini membantu kami memahami
            tantangan yang kamu hadapi.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {problems.map((p, i) => {
            const isSelected = selected.has(i);
            const Icon = p.Icon;
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{ y: -6 }}
                className={`relative text-left bg-white rounded-2xl overflow-hidden transition-all cursor-pointer p-3 sm:p-4 ${
                  isSelected
                    ? "border-2 border-dashed border-[#F59E0B] shadow-xl ring-4 ring-[#FCD34D]/25"
                    : "border border-[#eef3fa] shadow-md shadow-blue-900/5 hover:shadow-xl hover:border-[#dbeafe]"
                }`}
              >
                <div
                  className={`relative h-44 sm:h-48 rounded-xl overflow-hidden ${
                    isSelected ? "ring-2 ring-[#FBBF24]" : ""
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${p.image})` }}
                  />
                </div>

                <div className="pt-4 pb-1 px-1">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg ${
                        isSelected
                          ? "bg-[#FEF3C7] text-[#B45309]"
                          : "bg-[#EFF6FF] text-[#185FA5]"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    <p className="text-[13.5px] sm:text-[14px] text-[#0f172a] leading-snug font-medium pt-1.5">
                      {p.text}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-5 right-5 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F59E0B] text-white shadow-lg"
                  >
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
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-5 sm:p-6 shadow-md border border-[#eef3fa]"
        >
          <div className="flex items-center gap-3">
            <motion.span
              key={selected.size}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-extrabold text-[16px] transition-colors ${
                selected.size > 0
                  ? "bg-[#185FA5] text-white"
                  : "bg-[#EFF6FF] text-[#185FA5]"
              }`}
            >
              {selected.size}
            </motion.span>
            <p className="text-[13.5px] sm:text-[14.5px] text-[#0f172a] font-semibold">
              dari 6 situasi ini sudah pernah kamu alami
            </p>
          </div>
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href="#waitlist"
            className="inline-flex items-center gap-2 rounded-full bg-[#185FA5] px-6 py-3 text-[13px] font-bold text-white shadow-lg hover:bg-[#0F4478] transition-colors"
          >
            Coba Ruang Rasa
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
