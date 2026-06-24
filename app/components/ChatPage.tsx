"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Send, Sparkles, ArrowRight, Compass, ExternalLink } from "lucide-react";
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

const WAITLIST_TRIGGER = 5;
const MIN_LOADING = 3000;
const IDLE_MS = 3 * 60 * 1000;

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
        className="font-semibold text-[#185FA5] underline underline-offset-2 hover:text-[#0F4478] break-all"
      >
        {url}
      </a>
    );
    lastIndex = idx + url.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [wlName, setWlName] = useState("");
  const [wlPhone, setWlPhone] = useState("");
  const [wlSubmitted, setWlSubmitted] = useState(false);
  const [wlFormVisible, setWlFormVisible] = useState(false);
  const [wlLoading, setWlLoading] = useState(false);
  const [wlError, setWlError] = useState("");

  // Refs untuk dipakai di callback async (pagehide, idle timer, click)
  // tanpa kena stale closure.
  const messagesRef = useRef<Message[]>([]);
  const wlSubmittedRef = useRef(false);
  const abandonedSentRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userMsgCount = messages.filter((m) => m.role === "user").length;
  const lastIsAssistant =
    messages.length > 0 && messages[messages.length - 1].role === "assistant";
  const waitlistEligible =
    userMsgCount >= WAITLIST_TRIGGER && lastIsAssistant && !loading;

  useEffect(() => {
    if (waitlistEligible && !wlFormVisible) {
      const t = setTimeout(() => setWlFormVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, [waitlistEligible, wlFormVisible]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, wlFormVisible, wlSubmitted]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  // Sinkronkan ref dengan state — supaya pagehide/idle/click handler
  // selalu baca snapshot terbaru.
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    wlSubmittedRef.current = wlSubmitted;
  }, [wlSubmitted]);

  const sendAbandoned = (mode: "beacon" | "fetch") => {
    if (abandonedSentRef.current) return;
    if (wlSubmittedRef.current) return;
    const msgs = messagesRef.current;
    const userCount = msgs.filter((m) => m.role === "user").length;
    if (userCount === 0) return;

    abandonedSentRef.current = true;

    const summary = msgs
      .map((m) => `[${m.role === "user" ? "USER" : "AI"}] ${m.content}`)
      .join("\n")
      .slice(0, 2000);

    const body = JSON.stringify({
      name: "",
      phone: "",
      source: `chat - abandoned @ msg ${userCount}`,
      summary,
    });

    if (
      mode === "beacon" &&
      typeof navigator !== "undefined" &&
      navigator.sendBeacon
    ) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/waitlist", blob);
    } else {
      // keepalive supaya request tetap jalan meski page navigate
      fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  };

  // Idle 3 menit → kirim abandoned.
  // Trigger reset:
  //  - User aktif di window (mouse/keyboard/scroll/touch)
  //  - Pindah tab / minimize / kembali ke tab (visibilitychange)
  //  - Ada chat baru (effect terpisah di bawah)
  useEffect(() => {
    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (wlSubmittedRef.current || abandonedSentRef.current) return;
      if (messagesRef.current.filter((m) => m.role === "user").length === 0)
        return;
      idleTimerRef.current = setTimeout(() => {
        sendAbandoned("fetch");
      }, IDLE_MS);
    };

    const events: Array<keyof WindowEventMap> = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];
    events.forEach((e) =>
      window.addEventListener(e, resetIdle, { passive: true })
    );
    // Tab dipindah, window di-minimize, atau user balik ke tab ini —
    // semuanya jadi titik start hitungan baru.
    document.addEventListener("visibilitychange", resetIdle);

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdle));
      document.removeEventListener("visibilitychange", resetIdle);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Reset idle juga tiap kali messages berubah (chat baru / reply masuk).
  useEffect(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (wlSubmittedRef.current || abandonedSentRef.current) return;
    if (messages.filter((m) => m.role === "user").length === 0) return;
    idleTimerRef.current = setTimeout(() => {
      sendAbandoned("fetch");
    }, IDLE_MS);
  }, [messages]);

  // Tab close / browser back / page hide → kirim via sendBeacon
  // (lebih reliable daripada beforeunload di mobile/iOS).
  useEffect(() => {
    const onPagehide = () => sendAbandoned("beacon");
    window.addEventListener("pagehide", onPagehide);
    return () => window.removeEventListener("pagehide", onPagehide);
  }, []);

  const submitWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wlName.trim() || !wlPhone.trim() || wlLoading) return;
    setWlLoading(true);
    setWlError("");
    try {
      const summary = messages
        .map((m) => `[${m.role === "user" ? "USER" : "AI"}] ${m.content}`)
        .join("\n")
        .slice(0, 2000);
      const completedCount = messages.filter((m) => m.role === "user").length;

      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: wlName,
          phone: wlPhone,
          source: `chat - completed @ msg ${completedCount}`,
          summary,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data");
      // Sukses submit → batalkan idle timer & cegah abandoned terkirim
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      abandonedSentRef.current = true;
      setWlSubmitted(true);
    } catch (err) {
      setWlError(
        err instanceof Error ? err.message : "Gagal menyimpan, coba lagi"
      );
    } finally {
      setWlLoading(false);
    }
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setTimeout(() => inputRef.current?.focus(), 0);

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

      const elapsed = Date.now() - start;
      if (elapsed < MIN_LOADING) {
        await new Promise((r) => setTimeout(r, MIN_LOADING - elapsed));
      }
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch {
      const elapsed = Date.now() - start;
      if (elapsed < MIN_LOADING) {
        await new Promise((r) => setTimeout(r, MIN_LOADING - elapsed));
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
    <main className="flex flex-col h-[100dvh] bg-gradient-to-b from-[#EFF6FF] via-white to-[#F8FAFC]">
      {/* Top navigation bar */}
      <header className="flex-shrink-0 border-b border-[#e2e8f0] bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#EFF6FF] to-white ring-1 ring-[#dbeafe] flex items-center justify-center">
              <LogoIcon size={28} filled={false} />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="font-bold text-[14px] text-[#0f172a]">
                RuangRasa Teman
              </p>
              <p className="text-[11px] text-[#64748b]">
                Online · siap dengerin
              </p>
            </div>
          </Link>

          {/* Navigation buttons */}
          <nav className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href="/landing"
              onClick={() => sendAbandoned("fetch")}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#185FA5] text-white px-3 sm:px-4 py-2 text-[11.5px] sm:text-[12.5px] font-semibold shadow-sm hover:bg-[#0F4478] transition-colors"
            >
              <Compass size={14} className="shrink-0" />
              <span>Jelajahi</span>
              <span className="hidden sm:inline">&nbsp;RuangRasa Teman</span>
            </Link>
            <a
              href="https://ruangrasa.co"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sendAbandoned("fetch")}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#cbd5e1] bg-white text-[#0f172a] px-3 sm:px-4 py-2 text-[11.5px] sm:text-[12.5px] font-semibold hover:border-[#185FA5] hover:text-[#185FA5] transition-colors"
            >
              <ExternalLink size={14} className="shrink-0" />
              <span>Explore</span>
              <span className="hidden sm:inline">&nbsp;RuangRasa Lainnya</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Chat messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-4">
          {/* Welcome hero (only before any user message) */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center pt-4 sm:pt-8 pb-6 sm:pb-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#dbeafe] px-3.5 py-1.5 text-[11.5px] font-semibold text-[#185FA5] shadow-sm">
                <Sparkles size={13} className="text-[#FCD34D]" />
                AI khusus drama pertemanan
              </div>
              <h1 className="mt-4 text-[24px] sm:text-[32px] font-extrabold text-[#0f172a] leading-tight tracking-tight">
                Cerita aja ke aku.
                <br />
                <span className="text-[#185FA5]">Aku siap dengerin.</span>
              </h1>
              <p className="mt-3 text-[13px] sm:text-[14px] text-[#475569] max-w-md mx-auto leading-relaxed">
                Tempat aman buat curhat soal konflik temen, drama grup, atau
                situasi sosial yang lagi pusing. Gratis & tanpa nge-judge.
              </p>
            </motion.div>
          )}

          {/* Welcome bubble + suggestions */}
          {messages.length === 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex gap-2.5"
              >
                <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 ring-1 ring-[#dbeafe]">
                  <LogoIcon size={24} filled={false} />
                </div>
                <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-[#eef3fa]">
                  <p className="text-[13.5px] text-[#0f172a] leading-relaxed">
                    Halo! Aku RuangRasa, teman curhat AI kamu. Cerita apa aja,
                    aku siap dengerin tanpa nge-judge.{" "}
                    <span aria-hidden>✨</span>
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-3 pl-11 space-y-2"
              >
                <p className="text-[11px] text-[#64748b] font-semibold uppercase tracking-wider">
                  Coba tanya:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTIONS.map((q, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.06 }}
                      onClick={() => send(q)}
                      className="text-left px-4 py-3 rounded-2xl bg-white border border-[#dbeafe] hover:border-[#185FA5] hover:bg-[#eff6ff] text-[12.5px] text-[#185FA5] font-medium transition-all shadow-sm"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {/* Chat messages */}
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2.5 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 ring-1 ring-[#dbeafe]">
                  <LogoIcon size={24} filled={false} />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 shadow-sm text-[13.5px] leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === "user"
                    ? "bg-[#185FA5] text-white rounded-2xl rounded-br-md"
                    : "bg-white text-[#0f172a] rounded-2xl rounded-tl-md border border-[#eef3fa]"
                }`}
              >
                {m.role === "assistant" ? linkify(m.content) : m.content}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2.5"
              >
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 ring-1 ring-[#dbeafe]"
                >
                  <LogoIcon size={24} filled={false} />
                </motion.div>
                <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-[#eef3fa] flex items-center gap-2 relative overflow-hidden">
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
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-[#185FA5]"
                      />
                    ))}
                  </span>
                  <span className="relative text-[11.5px] font-medium text-[#64748b]">
                    Mengetik
                    <motion.span
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        times: [0, 0.33, 0.66, 1],
                      }}
                    >
                      ...
                    </motion.span>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Waitlist form */}
          {wlFormVisible && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl bg-gradient-to-br from-[#185FA5] to-[#0F4478] p-5 sm:p-6 shadow-lg max-w-[480px] mx-auto w-full"
            >
              {!wlSubmitted ? (
                <>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                      <Sparkles size={16} className="text-[#FCD34D]" />
                    </div>
                    <p className="text-[13px] font-semibold text-white leading-snug">
                      Isi data biar kita bisa ngabarin{" "}
                      <span aria-hidden>👇</span>
                    </p>
                  </div>

                  <form onSubmit={submitWaitlist} className="space-y-2.5">
                    <input
                      type="text"
                      value={wlName}
                      onChange={(e) => setWlName(e.target.value)}
                      placeholder="Nama lengkap"
                      required
                      className="w-full rounded-xl bg-white/95 px-4 py-2.5 text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/50 transition"
                    />
                    <input
                      type="tel"
                      value={wlPhone}
                      onChange={(e) => setWlPhone(e.target.value)}
                      placeholder="No. WhatsApp (cth: 6281234567890)"
                      required
                      pattern="[0-9+\s-]{8,}"
                      className="w-full rounded-xl bg-white/95 px-4 py-2.5 text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/50 transition"
                    />
                    <motion.button
                      whileHover={wlLoading ? {} : { scale: 1.02 }}
                      whileTap={wlLoading ? {} : { scale: 0.98 }}
                      type="submit"
                      disabled={wlLoading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FCD34D] to-[#FBBF24] px-4 py-2.5 text-[13px] font-bold text-[#0f172a] shadow-md hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                    >
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
                      <p className="text-center text-[11px] text-[#FCA5A5] font-medium">
                        {wlError}
                      </p>
                    )}
                    <p className="text-center text-[10.5px] text-white/60">
                      Data kamu aman & tidak akan disebarkan
                    </p>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-3"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#FCD34D] flex items-center justify-center mb-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <p className="text-[14px] font-bold text-white">
                    Makasih, {wlName.split(" ")[0]}!{" "}
                    <span aria-hidden>🎉</span>
                  </p>
                  <p className="text-[12px] text-white/80 mt-1 leading-relaxed">
                    Kamu sudah masuk waitlist. Kami hubungi via WhatsApp pas
                    RuangRasa siap launching ya!
                  </p>
                  <Link
                    href="/landing"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white text-[#185FA5] px-4 py-2 text-[12px] font-semibold hover:bg-[#FCD34D] hover:text-[#0f172a] transition-colors"
                  >
                    Pelajari lebih lanjut
                    <ArrowRight size={13} />
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-[#e2e8f0] bg-white/95 backdrop-blur-md">
        <form
          onSubmit={onSubmit}
          className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2"
        >
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
            className="flex-1 min-w-0 px-4 py-3 rounded-full bg-[#f1f5f9] border border-transparent text-[13.5px] text-[#0f172a] placeholder:text-[#94a3b8] focus:bg-white focus:border-[#185FA5] focus:outline-none focus:ring-2 focus:ring-[#185FA5]/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading || wlSubmitted}
            aria-label="Kirim"
            className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#185FA5] text-white hover:bg-[#0F4478] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-900/15"
          >
            <Send size={17} />
          </button>
        </form>
        <p className="max-w-3xl mx-auto px-4 sm:px-6 pb-2 text-center text-[10.5px] text-[#94a3b8]">
          RuangRasa AI fokus bantu kamu navigasi drama pertemanan. Bukan
          pengganti psikolog profesional.
        </p>
      </div>
    </main>
  );
}
