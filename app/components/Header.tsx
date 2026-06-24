"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "./icons/Logo";

const navLinks = [
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Fitur", href: "#fitur" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-2 z-50 w-full px-3 sm:px-6 lg:px-8 transition-all duration-300"
      style={{
        paddingTop: scrolled ? 8 : 16,
        paddingBottom: scrolled ? 8 : 0,
      }}>
      <div className="mx-auto max-w-[1240px]">
        <nav
          className={`rounded-[24px] sm:rounded-[28px] backdrop-blur-xl transition-all duration-300 ${
            scrolled
              ? "bg-white/95 shadow-[0_12px_36px_-12px_rgba(15,23,42,0.18)] border border-white"
              : "bg-[#eef2f7]/90 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.08)] border border-white/60"
          }`}>
          <div className="flex items-center justify-between px-5 sm:px-7 lg:px-8 h-[60px] sm:h-[68px]">
            <Link
              href="/"
              aria-label="Buka chat RuangRasa Teman"
              className="inline-flex">
              <Logo />
            </Link>

            <ul className="hidden md:flex items-center gap-7 lg:gap-10">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[14px] font-medium text-[#334155] hover:text-[#185FA5] transition-colors relative group">
                    {link.label}
                    <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-[#2563eb] transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="hidden sm:inline-flex">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-[#185FA5] px-5 lg:px-6 py-2.5 text-[13.5px] font-semibold text-white shadow-md shadow-blue-900/15 hover:bg-[#0F4478] transition-colors">
                  Gabung Sekarang
                </Link>
              </motion.div>

              <button
                onClick={() => setOpen((v) => !v)}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 border border-[#e2e8f0] text-[#185FA5]"
                aria-label="Toggle menu">
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden">
                <div className="px-5 pb-4 pt-1 space-y-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 text-[14px] font-medium text-[#334155] hover:bg-white/80 transition-colors">
                      {link.label}
                    </a>
                  ))}
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="sm:hidden mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#185FA5] px-5 py-3 text-[13.5px] font-semibold text-white">
                    Gabung Sekarang
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </motion.header>
  );
}
