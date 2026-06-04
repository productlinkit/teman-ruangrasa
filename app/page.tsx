import Header from "./components/Header";
import Hero from "./components/Hero";
import Problems from "./components/Problems";
import StatsBanner from "./components/StatsBanner";
import Steps from "./components/Steps";
import Features from "./components/Features";
import Comparison from "./components/Comparison";
import Testimonials from "./components/Testimonials";
import Waitlist from "./components/Waitlist";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";

export default function Home() {
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
      <ChatBot />
    </main>
  );
}
