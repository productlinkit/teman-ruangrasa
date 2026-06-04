"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Waitlist() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, source: "cta" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data");
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menyimpan, coba lagi"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="waitlist"
      className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="mx-auto max-w-7xl">
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl shadow-blue-900/20">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/img-cta.webp')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061638]/95 via-[#0a1a3f]/80 to-[#185FA5]/60" />

          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-14 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-extrabold text-white leading-tight">
                Persahabatanmu{" "}
                <span className="bg-gradient-to-r from-[#fcd34d] to-[#fde68a] bg-clip-text text-transparent">
                  layak dijaga
                </span>
              </h2>
              <p className="mt-4 text-[14px] sm:text-[15px] text-white/80 leading-relaxed max-w-md">
                Bergabunglah RuangRasa Teman — tempat aman buat navigasi drama
                pertemanan. Gratis, privat, tanpa drama tambahan.
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=3&w=80&h=80&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=3&w=80&h=80&q=80",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=3&w=80&h=80&q=80",
                  ].map((src, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full ring-2 ring-white bg-cover bg-center"
                      style={{ backgroundImage: `url(${src})` }}
                    />
                  ))}
                </div>
                <p className="text-[11.5px] text-white/70">
                  Launching saatnya kita siap kapan
                </p>
              </div>
            </motion.div>

            {/* Right form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="rounded-3xl bg-white p-5 sm:p-7 shadow-2xl">
              {!submitted ? (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="text-[12px] font-semibold text-[#0f172a] mb-1.5 block">
                      Nama
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama kamu"
                      className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-[13.5px] text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#185FA5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5]/10 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-[#0f172a] mb-1.5 block">
                      No. WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="No. WhatsApp (cth: 6281234567890)"
                      pattern="[0-9+\s-]{8,}"
                      className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-[13.5px] text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#185FA5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5]/10 transition"
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={loading ? {} : { scale: 1.02 }}
                    whileTap={loading ? {} : { scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#fcd34d] to-[#fbbf24] px-6 py-3.5 text-[13.5px] font-bold text-[#0f172a] shadow-lg shadow-amber-500/20 hover:shadow-xl transition-shadow disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-[#0f172a]/30 border-t-[#0f172a] animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        Gabung Waitlist Sekarang
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </motion.button>
                  {error && (
                    <p className="text-center text-[11.5px] text-[#dc2626] font-medium">
                      {error}
                    </p>
                  )}
                  <p className="text-center text-[11px] text-[#94a3b8]">
                    Data kamu aman dan tidak akan disebarkan
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center mb-4">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="text-[18px] font-bold text-[#0f172a] mb-2">
                    Terima kasih, {name || "Teman"}!
                  </h3>
                  <p className="text-[13px] text-[#64748b]">
                    Kamu sudah bergabung ke waitlist. Kami akan hubungi via
                    WhatsApp{" "}
                    <span className="font-semibold">{phone}</span>
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
