import { X, ShieldCheck, FileText, Lock, Mail } from 'lucide-react';

export type InfoModalType = 'privacy' | 'terms' | 'security' | 'connect' | null;

interface InfoModalProps {
  type: InfoModalType;
  onClose: () => void;
}

export default function InfoModal({ type, onClose }: InfoModalProps) {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white text-black border border-[#e5e5e5] w-full max-w-xl rounded-3xl p-6 sm:p-8 relative shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {type === 'privacy' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2 text-black mb-2">
              <FileText className="w-5 h-5 text-black" />
              <h3 className="text-2xl font-bold">Privacy Policy</h3>
            </div>
            <p className="text-xs text-neutral-500">Last updated: February 2026</p>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-700 leading-relaxed">
              <p>
                At Knodle, your financial privacy is paramount. We believe in absolute clarity and zero shady monetization:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>No Data Selling:</strong> We will never sell, rent, or trade your personal or financial transaction data to advertisers or third parties.</li>
                <li><strong>Read-Only Access:</strong> We connect through official Open Banking and Consumer Data Right protocols strictly in read-only mode.</li>
                <li><strong>Data Anonymization:</strong> All machine learning training and categorization is performed on scrubbed, de-identified metadata.</li>
                <li><strong>Right to Deletion:</strong> You can delete your account and all associated tokens with a single click at any time.</li>
              </ul>
            </div>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2 text-black mb-2">
              <FileText className="w-5 h-5 text-black" />
              <h3 className="text-2xl font-bold">Terms of Service</h3>
            </div>
            <p className="text-xs text-neutral-500">Effective: 2026</p>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-700 leading-relaxed">
              <p>
                By accessing Knodle AI and our coaching services, you agree to these standard operational terms:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Informational Coaching Only:</strong> Knodle provides habit-coaching, mathematical goal timelines, and behavioral guidance. Knodle is not an authorized financial planner and does not provide formal legal or investment advice.</li>
                <li><strong>User Responsibility:</strong> Final spending and purchasing decisions remain entirely your own responsibility.</li>
                <li><strong>Beta Availability:</strong> Private beta participants receive priority feature rollouts and grandfathered pricing tiers.</li>
              </ul>
            </div>
          </div>
        )}

        {type === 'security' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-2xl font-bold text-black">Security Architecture</h3>
            </div>
            <p className="text-xs text-neutral-500">Bank-Grade Infrastructure</p>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-700 leading-relaxed">
              <p>
                We engineered Knodle from day one with zero-trust banking standards:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>256-Bit AES Encryption:</strong> All data in transit and at rest is protected with TLS 1.3 and military-grade encryption.</li>
                <li><strong>Zero Password Storage:</strong> Knodle never sees or stores your bank credentials. Connections occur via direct OAuth tokens issued by your bank.</li>
                <li><strong>Read-Only Isolation:</strong> The Knodle engine does not possess money-movement APIs, withdrawal abilities, or transfer capabilities.</li>
                <li><strong>Continuous Audits:</strong> Independent penetration testing and automated vulnerability scanning run continuously.</li>
              </ul>
            </div>
          </div>
        )}

        {type === 'connect' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2 text-black mb-2">
              <Mail className="w-5 h-5" />
              <h3 className="text-2xl font-bold">Connect with Knodle</h3>
            </div>
            <p className="text-xs text-neutral-500">We love speaking directly with our users</p>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-700 leading-relaxed">
              <p>
                Have ideas, partnership inquiries, or feedback on our coaching engine? Reach out directly:
              </p>
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
                <p><strong>General & Beta Inquiries:</strong> hello@knodle.ai</p>
                <p><strong>Founders Direct:</strong> founders@knodle.ai</p>
                <p><strong>Sydney HQ:</strong> Surry Hills, NSW Australia</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-neutral-100 text-right">
          <button
            onClick={onClose}
            className="bg-black text-[#c1ff72] font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-neutral-800 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
