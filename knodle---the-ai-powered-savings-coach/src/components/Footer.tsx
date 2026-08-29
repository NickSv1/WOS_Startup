import KnodleLogo from './KnodleLogo';
import { InfoModalType } from './InfoModal';

interface FooterProps {
  onOpenInfo: (type: InfoModalType) => void;
  onOpenWaitlist: () => void;
}

export default function Footer({ onOpenInfo, onOpenWaitlist }: FooterProps) {
  return (
    <footer className="bg-[#000000] text-[#ffffff] border-t border-neutral-800 py-12 px-4 sm:px-6">
      <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Brand info */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <KnodleLogo variant="light" />
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="text-xs text-neutral-400 font-medium">
            Built at Weekend of Startups 2026.
          </span>
        </div>

        {/* Right Navigation & Legal */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 font-medium">
          <button
            onClick={() => onOpenInfo('privacy')}
            className="hover:text-[#c1ff72] transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <button
            onClick={() => onOpenInfo('terms')}
            className="hover:text-[#c1ff72] transition-colors cursor-pointer"
          >
            Terms
          </button>
          <button
            onClick={() => onOpenInfo('security')}
            className="hover:text-[#c1ff72] transition-colors cursor-pointer"
          >
            Security
          </button>
          <button
            onClick={() => onOpenInfo('connect')}
            className="hover:text-[#c1ff72] transition-colors cursor-pointer"
          >
            Connect
          </button>
          <button
            onClick={onOpenWaitlist}
            className="text-[#c1ff72] font-bold hover:underline cursor-pointer"
          >
            Join Waitlist
          </button>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto mt-8 pt-6 border-t border-neutral-900 text-center text-[11px] text-neutral-600">
        © 2026 Knodle AI. Financial empowerment through proactive behavioral clarity. All rights reserved.
      </div>
    </footer>
  );
}
