"use client";

import { motion } from "framer-motion";
import Logo from "./icons/Logo";

export default function Footer() {
  return (
    <footer className="relative mt-8">
      <div className="bg-gradient-to-br from-[#0a1a3f] via-[#061638] to-[#020b24] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center mb-4">
              <Logo variant="dark" />
            </div>

            <p className="text-[13.5px] text-white/70 leading-relaxed max-w-md mx-auto">
              Tempat aman untuk navigasi konflik pertemanan
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <a
                href="#cara-kerja"
                className="text-[12.5px] text-white/60 hover:text-white transition"
              >
                Cara Kerja
              </a>
              <a
                href="#fitur"
                className="text-[12.5px] text-white/60 hover:text-white transition"
              >
                Fitur
              </a>
              <a
                href="#faq"
                className="text-[12.5px] text-white/60 hover:text-white transition"
              >
                FAQ
              </a>
              <a
                href="#"
                className="text-[12.5px] text-white/60 hover:text-white transition"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-[12.5px] text-white/60 hover:text-white transition"
              >
                Terms
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-[11.5px] text-white/40">
                © 2026 RuangRasa Teman. Semua hak dilindungi.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
