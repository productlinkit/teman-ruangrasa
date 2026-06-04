"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Situation Debrief",
    desc: "Cerita dulu, baru mikir. Ruang untuk lampiaskan semuanya.",
    image: "/img-features-1.webp",
    color: "from-[#fef3c7] to-[#fde68a]",
    text: "text-[#92400e]",
  },
  {
    title: "Message Drafter",
    desc: "Bantu nyusun pesan yang ingin kamu kirim — sebelum kamu kirim.",
    image: "/img-features-2.webp",
    color: "from-[#dbeafe] to-[#bfdbfe]",
    text: "text-[#185FA5]",
  },
  {
    title: "Perspective Check",
    desc: "Lihat situasi dari sudut pandang berbeda, biasanya juga.",
    image: "/img-features-3.webp",
    color: "from-[#fce7f3] to-[#fbcfe8]",
    text: "text-[#9f1239]",
  },
  {
    title: "Cool-Down Mode",
    desc: "Saat emosi lagi tinggi, kami bantu kamu tenang sebelum bertindak yang disesali.",
    image: "/img-features-4.webp",
    color: "from-[#dcfce7] to-[#bbf7d0]",
    text: "text-[#166534]",
  },
];

export default function Features() {
  return (
    <section id="fitur" className="py-10 sm:py-14 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[24px] sm:text-[32px] lg:text-[40px] font-extrabold text-[#0f172a] leading-tight">
            <span className="text-[#185FA5]">Yang Bisa Ruang Rasa</span> Bantu
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-[14px] sm:text-[15px] text-[#64748b]">
            Fitur AI yang dirancang khusus untuk membantu kamu navigasi konflik
            pertemanan
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-md border border-[#eef3fa] hover:shadow-2xl transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${f.image})` }}
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#0f172a] italic mb-1.5">
                  {f.title}
                </h3>
                <p className="text-[12.5px] text-[#64748b] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
