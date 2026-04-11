import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import Benefits from "@/components/landing/Benefits";
import DashboardPreview from "@/components/landing/DashboardPreview";
import EventsConversions from "@/components/landing/EventsConversions";
import AIInsights from "@/components/landing/AIInsights";
import PrivacyCompliance from "@/components/landing/PrivacyCompliance";
import ComparisonGA from "@/components/landing/ComparisonGA";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <Benefits />
        <DashboardPreview />
        <EventsConversions />
        <AIInsights />
        <PrivacyCompliance />
        <ComparisonGA />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
