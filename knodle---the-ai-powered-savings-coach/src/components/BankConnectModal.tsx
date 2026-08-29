import { useState } from 'react';
import { X, Search, ShieldCheck, Check, Lock, Building, ArrowRight } from 'lucide-react';

interface BankConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sampleBanks = [
  { id: 'cba', name: 'Commonwealth Bank (CBA)', country: 'AU', color: '#ffcc00' },
  { id: 'anz', name: 'ANZ Bank', country: 'AU', color: '#004165' },
  { id: 'nab', name: 'National Australia Bank (NAB)', country: 'AU', color: '#bd0000' },
  { id: 'westpac', name: 'Westpac', country: 'AU', color: '#d5002b' },
  { id: 'macquarie', name: 'Macquarie Bank', country: 'AU', color: '#000000' },
  { id: 'ing', name: 'ING Direct', country: 'AU/Global', color: '#ff6200' },
  { id: 'chase', name: 'JPMorgan Chase', country: 'US', color: '#117aca' },
  { id: 'bofa', name: 'Bank of America', country: 'US', color: '#012169' },
  { id: 'barclays', name: 'Barclays', country: 'UK', color: '#00aeef' },
];

export default function BankConnectModal({ isOpen, onClose }: BankConnectModalProps) {
  const [search, setSearch] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [syncStep, setSyncStep] = useState<'select' | 'authorizing' | 'connected'>('select');

  if (!isOpen) return null;

  const filtered = sampleBanks.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (bankId: string) => {
    setSelectedBank(bankId);
    setSyncStep('authorizing');
    setTimeout(() => {
      setSyncStep('connected');
    }, 1200);
  };

  const handleReset = () => {
    setSyncStep('select');
    setSelectedBank(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white text-black border border-[#e5e5e5] w-full max-w-lg rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {syncStep === 'select' && (
          <div>
            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold w-fit mb-3 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Read-Only Open Banking Protocol</span>
            </div>

            <h3 className="text-2xl font-bold text-black tracking-tight">
              Connect Your Financial Institution
            </h3>
            <p className="text-xs text-neutral-500 mt-1 mb-5">
              Knodle never sees your login credentials and can NEVER move funds.
            </p>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search over 10,000 banks..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-black"
              />
            </div>

            {/* Bank list */}
            <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1">
              {filtered.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleSelect(bank.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-100 hover:border-black/30 hover:bg-neutral-50 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs"
                      style={{ backgroundColor: bank.color }}
                    >
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-black group-hover:text-black">{bank.name}</p>
                      <p className="text-[10px] text-neutral-400">Open Banking Verified • {bank.country}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-neutral-400" /> 256-Bit Encrypted Link
              </span>
              <span>10,000+ Global Institutions</span>
            </div>
          </div>
        )}

        {syncStep === 'authorizing' && (
          <div className="text-center py-10 space-y-4">
            <div className="w-14 h-14 rounded-full border-4 border-neutral-200 border-t-black animate-spin mx-auto" />
            <h4 className="font-bold text-lg text-black">Verifying Read-Only Handshake...</h4>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              Connecting via Consumer Data Right (CDR) secure banking proxy.
            </p>
          </div>
        )}

        {syncStep === 'connected' && (
          <div className="text-center py-6 space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#c1ff72] text-black flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-bold text-2xl text-black">Bank Successfully Linked!</h4>
              <p className="text-xs text-neutral-600 mt-1 max-w-xs mx-auto">
                Transactions automatically analyzed. Knodle is ready to coach your Euro Summer goal.
              </p>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-black"
              >
                Try Another Bank
              </button>
              <button
                onClick={onClose}
                className="bg-black text-[#c1ff72] font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-neutral-800 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
