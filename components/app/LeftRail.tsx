"use client";

import { LogoMark } from "@/components/Logo";

export type NavKey = "overview" | "goals" | "plan" | "accounts";

const ITEMS: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Overview", icon: <IconOverview /> },
  { key: "goals", label: "Goals", icon: <IconTarget /> },
  { key: "plan", label: "Nudges", icon: <IconBell /> },
  { key: "accounts", label: "Accounts", icon: <IconWallet /> },
];

export function LeftRail({
  active,
  onNavigate,
  onReset,
}: {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onReset: () => void;
}) {
  return (
    <nav className="flex h-full w-[76px] flex-col items-center border-r border-neutral-200 bg-white py-4">
      <LogoMark size={38} />

      <div className="mt-6 flex flex-1 flex-col gap-1.5">
        {ITEMS.map((it) => {
          const isActive = it.key === active;
          return (
            <button
              key={it.key}
              onClick={() => onNavigate(it.key)}
              className={`flex w-16 flex-col items-center gap-1 rounded-xl py-2.5 text-[10px] font-medium transition ${
                isActive
                  ? "bg-lime text-black"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-black"
              }`}
            >
              <span className="h-5 w-5">{it.icon}</span>
              {it.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={onReset}
        title="Reset the demo"
        className="flex w-16 flex-col items-center gap-1 rounded-xl py-2.5 text-[10px] font-medium text-neutral-400 transition hover:bg-neutral-100 hover:text-black"
      >
        <span className="h-5 w-5">
          <IconReset />
        </span>
        Reset
      </button>
    </nav>
  );
}

/* ── minimal inline icons (stroke = currentColor) ── */
function IconOverview() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}
function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}
function IconWallet() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M16 14h2" />
    </svg>
  );
}
function IconReset() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
