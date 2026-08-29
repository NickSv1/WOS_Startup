"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TopTicker from "./components/TopTicker";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AffordabilityCalculator from "./components/AffordabilityCalculator";
import SocialProofTicker from "./components/SocialProofTicker";
import BeforeAfterSection from "./components/BeforeAfterSection";
import HowItWorks from "./components/HowItWorks";
import CoachActionSection from "./components/CoachActionSection";
import FeaturesBento from "./components/FeaturesBento";
import ManifestoSection from "./components/ManifestoSection";
import FaqSection from "./components/FaqSection";
import WaitlistSection from "./components/WaitlistSection";
import Footer from "./components/Footer";
import WaitlistModal from "./components/WaitlistModal";
import BankConnectModal from "./components/BankConnectModal";
import InfoModal, { InfoModalType } from "./components/InfoModal";
import {
  goToDemo,
  grantDemoAccess,
  hasLocalDemoAccess,
  storedDemoEmail,
} from "@/lib/demoAccess";

export default function LandingPage() {
  const searchParams = useSearchParams();
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isBankConnectOpen, setIsBankConnectOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);

  const handleOpenWaitlist = () => {
    if (hasLocalDemoAccess()) {
      const email = storedDemoEmail();
      void (async () => {
        if (email) {
          try {
            await grantDemoAccess(email);
          } catch {
            // Cookie may still be missing; send them through the form.
            setIsWaitlistModalOpen(true);
            return;
          }
        }
        goToDemo();
      })();
      return;
    }
    setIsWaitlistModalOpen(true);
  };

  useEffect(() => {
    if (searchParams.get("try") === "live") {
      handleOpenWaitlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-[#c1ff72] selection:text-black">
      <TopTicker onOpenWaitlist={handleOpenWaitlist} />
      <Navbar onOpenWaitlist={handleOpenWaitlist} />

      <main id="main-content">
        <HeroSection />
        <AffordabilityCalculator onOpenWaitlist={handleOpenWaitlist} />
        <BeforeAfterSection />
        <HowItWorks
          onOpenBankConnect={() => setIsBankConnectOpen(true)}
          onOpenWaitlist={handleOpenWaitlist}
        />
        <CoachActionSection />
        <FeaturesBento onOpenWaitlist={handleOpenWaitlist} />
        <ManifestoSection />
        <FaqSection onOpenWaitlist={handleOpenWaitlist} />
        <SocialProofTicker onOpenWaitlist={handleOpenWaitlist} />
        <WaitlistSection />
      </main>

      <Footer
        onOpenInfo={setInfoModalType}
        onOpenWaitlist={handleOpenWaitlist}
      />

      <WaitlistModal isOpen={isWaitlistModalOpen} onClose={() => setIsWaitlistModalOpen(false)} />
      <BankConnectModal
        isOpen={isBankConnectOpen}
        onClose={() => setIsBankConnectOpen(false)}
      />
      <InfoModal type={infoModalType} onClose={() => setInfoModalType(null)} />
    </div>
  );
}
