import { useState } from 'react';
import TopTicker from './components/TopTicker';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AffordabilityCalculator from './components/AffordabilityCalculator';
import SocialProofTicker from './components/SocialProofTicker';
import BeforeAfterSection from './components/BeforeAfterSection';
import HowItWorks from './components/HowItWorks';
import CoachActionSection from './components/CoachActionSection';
import FeaturesBento from './components/FeaturesBento';
import ManifestoSection from './components/ManifestoSection';
import FaqSection from './components/FaqSection';
import WaitlistSection from './components/WaitlistSection';
import Footer from './components/Footer';
import WaitlistModal from './components/WaitlistModal';
import BankConnectModal from './components/BankConnectModal';
import InfoModal, { InfoModalType } from './components/InfoModal';

export default function App() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState<boolean>(false);
  const [isBankConnectOpen, setIsBankConnectOpen] = useState<boolean>(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);

  const handleOpenWaitlist = () => {
    setIsWaitlistModalOpen(true);
  };

  const handleCloseWaitlist = () => {
    setIsWaitlistModalOpen(false);
  };

  const handleOpenBankConnect = () => {
    setIsBankConnectOpen(true);
  };

  const handleCloseBankConnect = () => {
    setIsBankConnectOpen(false);
  };

  const handleOpenInfo = (type: InfoModalType) => {
    setInfoModalType(type);
  };

  const handleCloseInfo = () => {
    setInfoModalType(null);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-[#c1ff72] selection:text-black">
      {/* 1. Live Top Marquee Ticker */}
      <TopTicker onOpenWaitlist={handleOpenWaitlist} />

      {/* 2. Main Navigation Bar */}
      <Navbar onOpenWaitlist={handleOpenWaitlist} />

      {/* 3. Hero Section with Interactive Money Map Graph */}
      <main id="main-content">
        <HeroSection />

        {/* 4. "Can I Afford It?" Interactive Calculator */}
        <AffordabilityCalculator onOpenWaitlist={handleOpenWaitlist} />

        {/* 5. Problem Statement & Before vs After Comparison */}
        <BeforeAfterSection />

        {/* 6. How It Works (1-2-3 Step Cards) */}
        <HowItWorks 
          onOpenBankConnect={handleOpenBankConnect} 
          onOpenWaitlist={handleOpenWaitlist} 
        />

        {/* 7. The Coach In Action (Interactive Conversation Simulation) */}
        <CoachActionSection />

        {/* 8. Everything You Need to Save (Bento Grid) */}
        <FeaturesBento onOpenWaitlist={handleOpenWaitlist} />

        {/* 9. Manifesto Section */}
        <ManifestoSection />

        {/* 10. Frequently Asked Questions */}
        <FaqSection onOpenWaitlist={handleOpenWaitlist} />

        {/* 11. Built at Weekend of Startups / Partner Logos */}
        <SocialProofTicker onOpenWaitlist={handleOpenWaitlist} />

        {/* 12. Final Call-to-Action & Working Waitlist */}
        <WaitlistSection />
      </main>

      {/* 13. Footer */}
      <Footer 
        onOpenInfo={handleOpenInfo} 
        onOpenWaitlist={handleOpenWaitlist} 
      />

      {/* Modals */}
      <WaitlistModal 
        isOpen={isWaitlistModalOpen} 
        onClose={handleCloseWaitlist} 
      />

      <BankConnectModal 
        isOpen={isBankConnectOpen} 
        onClose={handleCloseBankConnect} 
      />

      <InfoModal 
        type={infoModalType} 
        onClose={handleCloseInfo} 
      />
    </div>
  );
}
