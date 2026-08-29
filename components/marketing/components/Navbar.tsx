import { useState } from 'react';
import KnodleLogo from './KnodleLogo';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenWaitlist: () => void;
}

export default function Navbar({ onOpenWaitlist }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav 
      id="main-nav"
      className="fixed top-8 left-0 right-0 z-50 bg-[#ffffff]/95 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 border-b border-[#e5e5e5] transition-all"
    >
      <div className="max-w-[1140px] mx-auto w-full flex items-center justify-between">
        <a 
          href="#" 
          className="cursor-pointer focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <KnodleLogo size="md" />
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#000000]/70">
          <button 
            onClick={() => scrollTo('afford-section')} 
            className="hover:text-[#000000] transition-colors cursor-pointer"
          >
            Can I Afford It?
          </button>
          <button 
            onClick={() => scrollTo('how-it-works')} 
            className="hover:text-[#000000] transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollTo('coach-section')} 
            className="hover:text-[#000000] transition-colors cursor-pointer"
          >
            The Coach
          </button>
          <button 
            onClick={() => scrollTo('faq-section')} 
            className="hover:text-[#000000] transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            id="nav-try-live-btn"
            onClick={onOpenWaitlist}
            className="bg-[#000000] text-[#c1ff72] font-semibold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-[#1a1a1a] active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Try it live</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-black hover:bg-neutral-100 rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-3 border-t border-[#e5e5e5] mt-2.5 space-y-1 text-sm font-semibold">
          <button
            onClick={() => scrollTo('afford-section')}
            className="block w-full text-left px-3 py-2.5 text-neutral-800 hover:bg-neutral-100 rounded-lg cursor-pointer"
          >
            Can I Afford It?
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="block w-full text-left px-3 py-2.5 text-neutral-800 hover:bg-neutral-100 rounded-lg cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo('coach-section')}
            className="block w-full text-left px-3 py-2.5 text-neutral-800 hover:bg-neutral-100 rounded-lg cursor-pointer"
          >
            The Coach
          </button>
          <button
            onClick={() => scrollTo('faq-section')}
            className="block w-full text-left px-3 py-2.5 text-neutral-800 hover:bg-neutral-100 rounded-lg cursor-pointer"
          >
            FAQ
          </button>
        </div>
      )}
    </nav>
  );
}
