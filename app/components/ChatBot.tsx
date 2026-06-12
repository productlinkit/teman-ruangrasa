"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { LogoIcon } from "./icons/Logo";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "Gimana kalau temenku ghosting aku?",
  "Aku takut konfrontasi, harus gimana?",
  "Cara minta maaf yang tulus?",
  "Temenku ngomongin di belakang, what now?",
];

// Jumlah chat user sebelum form waitlist muncul
const WAITLIST_TRIGGER = 5;

// Auto-detect URL (https://... atau bare domain seperti pasangan.ruangrasa.co)
const URL_RE =
  /(https?:\/\/[^\s]+|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:co|com|org|net|id|me|io|app)(?:\.[a-z]{2,3})?(?:\/[^\s]*)?)/gi;

function linkify(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(URL_RE)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) parts.push(text.slice(lastIndex, idx));
    const url = match[0];
    const href = url.startsWith("http") ? url : `https://${url}`;
    parts.push(
      <a
        key={`${idx}-${url}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#185FA5] underline underline-offset-2 hover:text-[#0F4478] break-all">
        {url}
      </a>
    );
    lastIndex = idx + url.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Waitlist form state
  const [wlName, setWlName] = useState("");
  const [wlPhone, setWlPhone] = useState("");
  const [wlSubmitted, setWlSubmitted] = useState(false);
  const [wlFormVisible, setWlFormVisible] = useState(false);
  const [wlLoading, setWlLoading] = useState(false);
  const [wlError, setWlError] = useState("");

  const userMsgCount = messages.filter((m) => m.role === "user").length;
  const lastIsAssistant =
    messages.length > 0 && messages[messages.length - 1].role === "assistant";
  // Eligible setelah user chat 5x & AI sudah membalas
  const waitlistEligible =
    userMsgCount >= WAITLIST_TRIGGER && lastIsAssistant && !loading;

  // Form waitlist muncul beberapa saat SETELAH jawaban tampil (jawaban → form)
  useEffect(() => {
    if (waitlistEligible && !wlFormVisible) {
      const t = setTimeout(() => setWlFormVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, [waitlistEligible, wlFormVisible]);

  const submitWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wlName.trim() || !wlPhone.trim() || wlLoading) return;
    setWlLoading(true);
    setWlError("");
    try {
      // Ringkasan percakapan dengan label per peran ([AI] / [USER])
      const summary = messages
        .map((m) => `[${m.role === "user" ? "USER" : "AI"}] ${m.content}`)
        .join("\n")
        .slice(0, 2000);

      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: wlName,
          phone: wlPhone,
          source: "chat widget",
          summary,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data");
      setWlSubmitted(true);
    } catch (err) {
      setWlError(
        err instanceof Error ? err.message : "Gagal menyimpan, coba lagi"
      );
    } finally {
      setWlLoading(false);
    }
  };

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, wlFormVisible, wlSubmitted]);

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    if (open && window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Buka chat saat ada event "ruangrasa:open-chat" (dari tombol lain di page)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("ruangrasa:open-chat", handler);
    return () => window.removeEventListener("ruangrasa:open-chat", handler);
  }, []);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    // Pastikan input tetap fokus setelah kirim
    setTimeout(() => inputRef.current?.focus(), 0);

    // Chat ke-5 (atau lebih): jawaban tanpa pertanyaan lanjutan
    const userCount = nextMessages.filter((m) => m.role === "user").length;
    const finalTurn = userCount >= WAITLIST_TRIGGER;
    const start = Date.now();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, finalTurn }),
      });

      const data = await res.json();
      const reply =
        data.message ||
        data.error ||
        "Maaf, aku lagi nggak bisa jawab sekarang. Coba lagi nanti ya.";

      // Jeda 3 detik biar terasa lebih natural & exclusive (typing animation muncul)
      const MIN_LOADING = 3000;
      const elapsed = Date.now() - start;
      if (elapsed < MIN_LOADING) {
        await new Promise((r) => setTimeout(r, MIN_LOADING - elapsed));
      }

      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch {
      const elapsed = Date.now() - start;
      if (elapsed < 3000) {
        await new Promise((r) => setTimeout(r, 3000 - elapsed));
      }
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "Maaf, terjadi kesalahan koneksi. Coba lagi ya.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            aria-label="Buka chat dengan RuangRasa AI"
            className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 inline-flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-[#185FA5] to-[#0F4478] text-white shadow-2xl shadow-blue-900/30 group">
            <span className="absolute inset-0 rounded-full bg-[#185FA5] animate-ping opacity-20" />
            <MessageCircle size={22} className="relative z-10" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FCD34D] ring-2 ring-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile overlay backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sm:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed z-50 bg-white shadow-2xl flex flex-col
                inset-0 sm:inset-auto
                sm:bottom-6 sm:right-6
                sm:w-[380px] sm:h-[600px] sm:max-h-[calc(100vh-3rem)]
                sm:rounded-3xl
                overflow-hidden border-0 sm:border sm:border-[#e2e8f0]">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-[#185FA5] to-[#0F4478] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <LogoIcon size={28} filled={false} />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-[#185FA5]" />
                  </div>
                  <div>
                    <p className="font-bold text-[14px] leading-tight">
                      RuangRasa AI
                    </p>
                    <p className="text-[11px] text-white/70 leading-tight">
                      Online · siap dengerin kamu
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Tutup chat"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Messages area */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-5 bg-[#f8fafc] space-y-3">
                {/* Welcome message */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 ring-1 ring-[#dbeafe]">
                      <LogoIcon size={22} filled={false} />
                    </div>
                    <div className="max-w-[80%] bg-white rounded-2xl rounded-tl-md px-4 py-2.5 shadow-sm border border-[#eef3fa]">
                      <p className="text-[13px] text-[#0f172a] leading-relaxed">
                        Halo! Aku RuangRasa, teman curhat AI kamu. Cerita apa
                        aja, aku siap dengerin tanpa nge-judge. ✨
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Suggested questions */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="pt-3 space-y-2">
                    <p className="text-[11px] text-[#64748b] font-semibold uppercase tracking-wider px-1">
                      Coba tanya:
                    </p>
                    {SUGGESTIONS.map((q, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        onClick={() => send(q)}
                        className="block w-full text-left px-4 py-2.5 rounded-2xl bg-white border border-[#dbeafe] hover:border-[#185FA5] hover:bg-[#eff6ff] text-[12.5px] text-[#185FA5] font-medium transition-all">
                        {q}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {/* Chat messages */}
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2 ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}>
                    {m.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 ring-1 ring-[#dbeafe]">
                        <LogoIcon size={22} filled={false} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-2.5 shadow-sm text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
                        m.role === "user"
                          ? "bg-[#185FA5] text-white rounded-2xl rounded-br-md"
                          : "bg-white text-[#0f172a] rounded-2xl rounded-tl-md border border-[#eef3fa]"
                      }`}>
                      {m.role === "assistant" ? linkify(m.content) : m.content}
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator — typing animation */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 ring-1 ring-[#dbeafe]">
                      <LogoIcon size={22} filled={false} />
                    </motion.div>
                    <div className="bg-white rounded-2xl rounded-tl-md px-4 py-2.5 shadow-sm border border-[#eef3fa] flex items-center gap-2 relative overflow-hidden">
                      {/* Shimmer sweep */}
                      <motion.span
                        aria-hidden
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[#dbeafe]/60 to-transparent"
                      />
                      <span className="relative flex items-center gap-1">
                        <motion.span
                          animate={{ y: [0, -3, 0] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-1.5 h-1.5 rounded-full bg-[#185FA5]"
                        />
                        <motion.span
                          animate={{ y: [0, -3, 0] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.15,
                          }}
                          className="w-1.5 h-1.5 rounded-full bg-[#185FA5]"
                        />
                        <motion.span
                          animate={{ y: [0, -3, 0] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.3,
                          }}
                          className="w-1.5 h-1.5 rounded-full bg-[#185FA5]"
                        />
                      </span>
                      <span className="relative text-[11.5px] font-medium text-[#64748b]">
                        Mengetik
                        <motion.span
                          animate={{ opacity: [0, 1, 1, 0] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            times: [0, 0.33, 0.66, 1],
                          }}>
                          ...
                        </motion.span>
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Waitlist invitation + form (muncul setelah jawaban tampil) */}
                {wlFormVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl bg-gradient-to-br from-[#185FA5] to-[#0F4478] p-5 shadow-lg">
                    {!wlSubmitted ? (
                      <>
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                            <Sparkles size={16} className="text-[#FCD34D]" />
                          </div>
                          <p className="text-[12.5px] font-semibold text-white leading-snug">
                            Isi data biar kita bisa ngabarin 👇
                          </p>
                        </div>

                        <form
                          onSubmit={submitWaitlist}
                          className="space-y-2.5">
                          <input
                            type="text"
                            value={wlName}
                            onChange={(e) => setWlName(e.target.value)}
                            placeholder="Nama lengkap"
                            required
                            className="w-full rounded-xl bg-white/95 px-4 py-2.5 text-[12.5px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/50 transition"
                          />
                          <input
                            type="tel"
                            value={wlPhone}
                            onChange={(e) => setWlPhone(e.target.value)}
                            placeholder="No. WhatsApp (cth: 6281234567890)"
                            required
                            pattern="[0-9+\s-]{8,}"
                            className="w-full rounded-xl bg-white/95 px-4 py-2.5 text-[12.5px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/50 transition"
                          />
                          <motion.button
                            whileHover={wlLoading ? {} : { scale: 1.02 }}
                            whileTap={wlLoading ? {} : { scale: 0.98 }}
                            type="submit"
                            disabled={wlLoading}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FCD34D] to-[#FBBF24] px-4 py-2.5 text-[12.5px] font-bold text-[#0f172a] shadow-md hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed">
                            {wlLoading ? (
                              <>
                                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0f172a]/30 border-t-[#0f172a] animate-spin" />
                                Menyimpan...
                              </>
                            ) : (
                              "Gabung Waitlist Sekarang"
                            )}
                          </motion.button>
                          {wlError && (
                            <p className="text-center text-[10.5px] text-[#FCA5A5] font-medium">
                              {wlError}
                            </p>
                          )}
                          <p className="text-center text-[10px] text-white/60">
                            Data kamu aman & tidak akan disebarkan
                          </p>
                        </form>
                      </>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-3">
                        <div className="mx-auto w-12 h-12 rounded-full bg-[#FCD34D] flex items-center justify-center mb-3">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#0f172a"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </div>
                        <p className="text-[13px] font-bold text-white">
                          Makasih, {wlName.split(" ")[0]}! 🎉
                        </p>
                        <p className="text-[11.5px] text-white/80 mt-1 leading-relaxed">
                          Kamu sudah masuk waitlist. Kami hubungi via WhatsApp
                          pas RuangRasa siap launching ya!
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Input area */}
              <form
                onSubmit={onSubmit}
                className="flex-shrink-0 border-t border-[#e2e8f0] bg-white p-3 sm:p-4 flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    wlSubmitted
                      ? "Sampai jumpa, lanjut di WhatsApp ya 🎉"
                      : "Cerita apapun di sini..."
                  }
                  disabled={wlSubmitted}
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-full bg-[#f1f5f9] border border-transparent text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] focus:bg-white focus:border-[#185FA5] focus:outline-none focus:ring-2 focus:ring-[#185FA5]/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading || wlSubmitted}
                  aria-label="Kirim"
                  className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#185FA5] text-white hover:bg-[#0F4478] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
