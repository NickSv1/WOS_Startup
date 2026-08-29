import { tickerItems } from '../data/landingData';

interface TopTickerProps {
  onOpenWaitlist?: () => void;
}

export default function TopTicker({ onOpenWaitlist }: TopTickerProps) {
  return (
    <aside 
      aria-label="Knodle Live Updates"
      className="fixed top-0 left-0 right-0 z-[60] bg-[#c1ff72] text-[#000000] h-8 flex items-center overflow-hidden border-b border-[#aee661] select-none text-xs sm:text-sm font-semibold tracking-wide"
    >
      <div className="animate-marquee flex items-center whitespace-nowrap cursor-pointer">
        {tickerItems.concat(tickerItems).map((item, index) => (
          <div 
            key={`${item.id}-${index}`} 
            onClick={onOpenWaitlist}
            className="flex items-center hover:opacity-80 transition-opacity px-3 sm:px-6"
          >
            <span>{item.text}</span>
            <span className="mx-4 text-black/40 font-bold">•</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
