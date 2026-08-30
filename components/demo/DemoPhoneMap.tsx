"use client";

import { LogoMark } from "@/components/Logo";

/** Compact iPhone view of Hayley's map — same story, readable at phone size. */
export function DemoPhoneMap() {
  return (
    <div className="relative flex h-full w-full flex-col bg-[#fafafa] text-black">
      <div className="flex items-center justify-between px-4 pb-2 pt-12">
        <div className="flex items-center gap-2">
          <LogoMark size={22} />
          <div>
            <div className="text-[13px] font-bold leading-tight">Knodle</div>
            <div className="text-[10px] text-neutral-400">Hayley&apos;s map</div>
          </div>
        </div>
        <span className="rounded-full bg-[#ff7a3d]/15 px-2 py-0.5 text-[9px] font-bold text-[#e85d1c]">1 off track</span>
      </div>

      <div className="mx-3 rounded-2xl border border-[#ff7a3d] bg-white px-3 py-2.5 text-left shadow-node">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[#e85d1c]">Off track</div>
        <p className="mt-0.5 text-[13px] font-semibold">🏙️ Sydney Trip has slipped 2 weeks.</p>
        <p className="mt-0.5 text-[10px] text-neutral-500">Open it — Knodle scans your spend.</p>
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(#d4d4d4 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <line x1="50%" y1="42%" x2="28%" y2="28%" stroke="#e5e5e5" strokeWidth="1.5" />
          <line x1="50%" y1="42%" x2="72%" y2="70%" stroke="#ff7a3d" strokeWidth="2" strokeDasharray="5 5" />
        </svg>

        <div
          className="absolute z-10 flex h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-neutral-200 bg-white text-center"
          style={{ left: "28%", top: "28%" }}
        >
          <span className="text-base">💳</span>
          <span className="tabular text-[11px] font-bold">$642</span>
        </div>

        <div
          className="absolute z-20 flex h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-white bg-black text-white shadow-node"
          style={{ left: "50%", top: "42%" }}
        >
          <LogoMark size={22} />
          <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-widest text-neutral-400">Hayley</span>
          <span className="tabular text-[12px] font-bold text-lime">$31,362</span>
        </div>

        <div
          className="absolute z-20 w-[132px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-[#ff7a3d] bg-white p-2 text-left shadow-node"
          style={{ left: "72%", top: "70%" }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🏙️</span>
            <span className="rounded-full bg-[#ff7a3d] px-1.5 py-0.5 text-[8px] font-bold text-black">FIX</span>
          </div>
          <div className="mt-1 text-[11px] font-bold leading-tight">Sydney Trip</div>
          <div className="mt-0.5 flex items-baseline justify-between">
            <span className="tabular text-[12px] font-bold">$650</span>
            <span className="tabular text-[9px] font-semibold text-neutral-500">16w</span>
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full w-[17%] rounded-full bg-[#ff7a3d]" />
          </div>
        </div>
      </div>
    </div>
  );
}
