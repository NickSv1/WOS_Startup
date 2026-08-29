"use client";

import { seedUser } from "@/data/seed";

export function SettingsPanel({
  source,
  onReset,
  onClose,
}: {
  source: "up" | "demo";
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md animate-fade-up rounded-2xl bg-white p-6 shadow-node"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="mt-1 text-sm text-neutral-500">Demo controls for this map. Nothing leaves this device.</p>

        <div className="mt-5 space-y-3">
          <Row label="Profile" value={seedUser.name} />
          <Row label="Bank connection" value={source === "up" ? "Up · live" : "Demo data"} />
          <Row label="Coach nudges" value="On-screen + SMS when configured" />
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-neutral-300 py-2.5 text-sm font-semibold hover:bg-neutral-50"
          >
            Close
          </button>
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="flex-1 rounded-xl bg-black py-2.5 text-sm font-bold text-white hover:bg-neutral-800"
          >
            Reset demo
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-3">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
