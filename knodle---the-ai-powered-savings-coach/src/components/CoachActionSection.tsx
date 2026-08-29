import { useState, type FormEvent } from 'react';
import { coachingScenarios } from '../data/landingData';
import { CheckCircle, Send, MessageSquare, RefreshCw, Activity, ShieldCheck } from 'lucide-react';
import { KnodleIcon } from './KnodleLogo';
import { CoachingMessage } from '../types';

export default function CoachActionSection() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [customMessages, setCustomMessages] = useState<CoachingMessage[]>(
    coachingScenarios[0].messages
  );
  const [userInput, setUserInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const activeScenario = coachingScenarios[selectedScenarioIndex];

  const handleSelectScenario = (index: number) => {
    setSelectedScenarioIndex(index);
    setCustomMessages(coachingScenarios[index].messages);
    setIsTyping(false);
  };

  const handleSendMessage = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput.trim();
    const newMsg: CoachingMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: 'Just now',
    };

    setCustomMessages((prev) => [...prev, newMsg]);
    setUserInput('');
    setIsTyping(true);

    // Simulate smart Coach AI response
    setTimeout(() => {
      let coachReply = "Got it! Adjusting your weekly safe-to-spend buffer. You stay on track for your Euro Summer goal! 🏖️";
      const lower = userText.toLowerCase();

      if (lower.includes('coffee') || lower.includes('lunch') || lower.includes('dinner') || lower.includes('eat')) {
        coachReply = "Making your meals at home for 2 days saves ~$35, keeping you 100% on target for your trip! ✨";
      } else if (lower.includes('buy') || lower.includes('jacket') || lower.includes('ticket') || lower.includes('flight')) {
        coachReply = "Affordability verified: If you split this across 2 paychecks ($75/ea), your savings trajectory won't drop at all. 🎯";
      } else if (lower.includes('emergency') || lower.includes('buffer')) {
        coachReply = "Your emergency cushion is currently at $12,400 (95% full). You're in great shape!";
      }

      setCustomMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          sender: 'coach',
          text: coachReply,
          time: 'Just now',
          highlight: true,
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <section 
      id="coach-section"
      className="bg-[#f8f9fb] py-20 md:py-28 px-4 sm:px-6 border-b border-[#e5e5e5]"
    >
      <div className="max-w-[1140px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Explanation Column */}
        <div className="flex-1 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-[#c1ff72]/30 text-neutral-900 px-3 py-1 rounded-full text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5 text-black" />
            <span>Interactive Coach Simulation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#000000] leading-tight">
            The coach, in action.
          </h2>

          <p className="text-base sm:text-lg text-[#000000]/65 leading-relaxed">
            We don&apos;t just show you past mistakes in a pie chart. Knodle anticipates your spending and sends actionable alerts at the exact moment you need them.
          </p>

          <ul className="space-y-3.5 pt-2 text-base font-semibold text-[#000000]">
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-black fill-[#c1ff72] shrink-0" />
              <span>Real-time intervention</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-black fill-[#c1ff72] shrink-0" />
              <span>Dynamic goal adjustment</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-black fill-[#c1ff72] shrink-0" />
              <span>Conversational interface</span>
            </li>
          </ul>

          {/* Scenario Picker Pills */}
          <div className="pt-4 border-t border-neutral-200">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
              Switch conversation scenario:
            </p>
            <div className="flex flex-wrap gap-2">
              {coachingScenarios.map((scenario, idx) => (
                <button
                  key={scenario.id}
                  onClick={() => handleSelectScenario(idx)}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                    selectedScenarioIndex === idx
                      ? 'bg-black text-[#c1ff72] border-black shadow-sm'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  {scenario.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Phone Mockup Container */}
        <div className="flex-1 w-full max-w-md relative">
          <div className="relative w-full bg-[#ffffff] border border-[#e5e5e5] rounded-[36px] sm:rounded-[44px] shadow-2xl shadow-black/10 overflow-hidden p-5 sm:p-7 flex flex-col justify-between min-h-[480px]">
            {/* Phone Top Status Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <KnodleIcon className="w-9 h-9" bgVariant="lime" />
                <div>
                  <h4 className="font-bold text-sm text-black flex items-center gap-1.5">
                    <span>Knodle Coach</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-medium">Active savings assistant</p>
                </div>
              </div>

              <button
                onClick={() => handleSelectScenario(selectedScenarioIndex)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors"
                title="Reset scenario"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Thread Messages */}
            <div className="flex flex-col gap-3.5 my-auto max-h-[320px] overflow-y-auto pr-1">
              {customMessages.map((msg) => {
                const isCoach = msg.sender === 'coach';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${
                      isCoach ? 'w-[96%] sm:w-[92%]' : 'w-[94%] sm:w-[90%] ml-auto justify-end'
                    }`}
                  >
                    {isCoach && (
                      <KnodleIcon className="w-6 h-6 shrink-0 mt-1" bgVariant="lime" />
                    )}

                    <div
                      className={`p-3 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                        isCoach
                          ? msg.highlight
                            ? 'bg-[#c1ff72] text-black font-semibold rounded-2xl rounded-tl-xs shadow-sm'
                            : 'bg-[#f8f9fb] text-black font-medium rounded-2xl rounded-tl-xs border border-[#e5e5e5]'
                          : 'bg-[#000000] text-[#ffffff] font-normal rounded-2xl rounded-tr-xs shadow-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.time && (
                        <span className={`block text-[9px] mt-1 font-normal ${
                          isCoach 
                            ? msg.highlight ? 'text-black/60' : 'text-neutral-400' 
                            : 'text-white/50 text-right'
                        }`}>
                          {msg.time}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 w-[90%] text-neutral-400 text-xs pl-9">
                  <div className="flex gap-1 items-center bg-neutral-100 px-3 py-2 rounded-full">
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>Knodle is typing...</span>
                </div>
              )}
            </div>

            {/* Interactive Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask a question or request a budget shift..."
                  className="flex-1 bg-[#f8f9fb] border border-[#e5e5e5] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                <button
                  type="submit"
                  disabled={!userInput.trim()}
                  className="bg-black text-[#c1ff72] p-2.5 rounded-xl hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-neutral-400">
                <span>💡 Try: &quot;What if I skip eating out this week?&quot;</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Live Demo
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
