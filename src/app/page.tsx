import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import WhySwitch from "@/components/landing/WhySwitch";
import Benefits from "@/components/landing/Benefits";
import DashboardPreview from "@/components/landing/DashboardPreview";
import EventsConversions from "@/components/landing/EventsConversions";
import AIInsights from "@/components/landing/AIInsights";
import ReportsAutomation from "@/components/landing/ReportsAutomation";
import Integrations from "@/components/landing/Integrations";
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
        <WhySwitch />
        <Benefits />
        <DashboardPreview />
        <EventsConversions />
        <AIInsights />
        <ReportsAutomation />
        <Integrations />
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
