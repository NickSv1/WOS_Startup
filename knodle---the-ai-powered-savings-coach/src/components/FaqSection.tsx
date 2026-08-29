import { useState } from 'react';
import { faqItems } from '../data/landingData';
import { ChevronDown, Search, HelpCircle, MessageCircle } from 'lucide-react';

interface FaqSectionProps {
  onOpenWaitlist: () => void;
}

export default function FaqSection({ onOpenWaitlist }: FaqSectionProps) {
  const [openIds, setOpenIds] = useState<string[]>(['1']);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section 
      id="faq-section"
      className="bg-[#ffffff] py-20 md:py-28 px-4 sm:px-6 border-b border-[#e5e5e5]"
    >
      <div className="max-w-[820px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-neutral-100 px-3 py-1 rounded-full text-xs font-bold text-neutral-600 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#000000]">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-neutral-600 mt-2">
            Everything you need to know about Knodle, security, and beta access.
          </p>

          {/* Quick Search */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. security, banks, launch)..."
              className="w-full bg-[#f8f9fb] border border-[#e5e5e5] rounded-xl pl-10 pr-4 py-2.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);

            return (
              <div
                key={faq.id}
                className={`border border-[#e5e5e5] rounded-2xl transition-all overflow-hidden ${
                  isOpen ? 'bg-white shadow-md border-black/20' : 'bg-[#f8f9fb] hover:bg-neutral-100/60'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex justify-between items-center p-5 sm:p-6 text-left cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-base sm:text-lg text-[#000000] pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-black text-[#c1ff72]' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#000000]/70 leading-relaxed border-t border-neutral-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-neutral-200">
              <p className="text-sm text-neutral-600">No questions matched &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-bold text-black underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 text-center p-6 bg-[#f8f9fb] border border-neutral-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-sm text-black flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-black" />
              Have a specific question not covered here?
            </h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Our team answers all founder emails within 24 hours.
            </p>
          </div>
          <button
            onClick={onOpenWaitlist}
            className="bg-black text-[#c1ff72] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-neutral-800 transition-all shrink-0 cursor-pointer"
          >
            Ask founder on waitlist
          </button>
        </div>
      </div>
    </section>
  );
}
