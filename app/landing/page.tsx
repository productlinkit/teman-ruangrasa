import type { Metadata } from "next";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Problems from "../components/Problems";
import StatsBanner from "../components/StatsBanner";
import Steps from "../components/Steps";
import Features from "../components/Features";
import Comparison from "../components/Comparison";
import Testimonials from "../components/Testimonials";
import Waitlist from "../components/Waitlist";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Jelajahi RuangRasa Teman — Tempat Aman Buat Kamu Cerita",
  description:
    "Pelajari lebih jauh soal RuangRasa Teman: cara kerja, fitur, dan kenapa puluhan ribu orang sudah mempercayainya untuk navigasi konflik pertemanan.",
};

export default function LandingPage() {
  return (
    <main className="relative w-full">
      <Header />
      <Hero />
      <Problems />
      <StatsBanner />
      <Steps />
      <Features />
      <Comparison />
      <Testimonials />
      <Waitlist />
      <FAQ />
      <Footer />
    </main>
  );
}
