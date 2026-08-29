"use client";

import { money, shortDate } from "@/lib/format";
import {
  activePledge,
  percentOff,
  previewSpendSwitch,
  weeklySavingFromSwitch,
  type RecoveryOption,
} from "@/lib/savings";
import type { Goal, SpendSwitch } from "@/lib/types";
import { seedUser } from "@/data/seed";
import { MerchantLogo } from "./MerchantLogo";

export function GoalFixPanel({
  goal,
  extraWeeks,
  projectedWeeks,
  plannedWeeks,
  spend: _spend,
  switches,
  options,
  previewId,
  couponRevealed,
  onPreview,
  onRevealCoupon,
  onSwitch,
  onKeep,
  onBreak,
  onCut,
  onExtend,
  onDismiss,
}: {
  goal: Goal;
  extraWeeks: number;
  projectedWeeks: number;
  plannedWeeks: number;
  spend?: { amount: number; label: string } | null;
  switches: SpendSwitch[];
  options: RecoveryOption[];
  previewId: string | null;
  couponRevealed: boolean;
  onPreview: (sw: SpendSwitch | null) => void;
  onRevealCoupon: () => void;
  onSwitch: (sw: SpendSwitch) => void;
  onKeep: (sw: SpendSwitch) => void;
  onBreak: (sw: SpendSwitch) => void;
  onCut: (option: RecoveryOption) => void;
  onExtend: () => void;
  onDismiss: () => void;
}) {
  const offTrack = extraWeeks > 0;
  const applied = new Set(goal.appliedSwitchIds ?? []);
  const openSwitches = switches.filter((s) => !applied.has(s.id));
  const onSwitches = switches.filter((s) => applied.has(s.id));
  const preview = switches.find((s) => s.id === previewId && !applied.has(s.id)) ?? null;
  const proof = preview ? previewSpendSwitch(goal, preview) : null;
  const topCuts = options.slice(0, 2);
  const livePledge = onSwitches[0]
    ? { sw: onSwitches[0], pledge: activePledge(goal, onSwitches[0].id) }
    : null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-start px-3 pb-3 pt-6 sm:px-5">
      <div
        id="swap-list"
        data-fix-dock
        className="pointer-events-auto flex max-h-[min(42vh,380px)] w-full max-w-[min(340px,42%)] animate-slide-up flex-col overflow-hidden rounded-3xl border border-black/10 bg-white/95 shadow-node backdrop-blur-md"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 px-4 pb-2 pt-3.5">
          <div className="min-w-0">
            <div
              className={`text-[11px] font-semibold uppercase tracking-widest ${
                offTrack ? "text-[#e85d1c]" : "text-neutral-400"
              }`}
            >
              {offTrack ? "Won't hit this date" : "On track — keep it"}
            </div>
            <p className="mt-0.5 text-sm font-semibold leading-snug">
              {offTrack ? (
                <>
                  {goal.name} is {extraWeeks} {extraWeeks === 1 ? "week" : "weeks"} behind{" "}
                  {shortDate(goal.deadline)} — Knodle found cheaper swaps on your recent spend.
                </>
              ) : (
                <>
                  {goal.name} still lands {shortDate(goal.deadline)} — if the pledged swaps
                  actually show on {seedUser.firstName}&apos;s Everyday account.
                </>
              )}
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="shrink-0 text-xs font-medium text-neutral-400 hover:text-black"
          >
            Dismiss
          </button>
        </div>

        {(offTrack || proof) && (
          <div className="shrink-0 px-3">
            <ProjectionStrip
              offTrack={offTrack}
              plannedWeeks={plannedWeeks}
              projectedWeeks={projectedWeeks}
              deadline={goal.deadline}
              proof={
                proof
                  ? {
                      afterWeeks: proof.after.projectedWeeks,
                      afterDate: proof.after.projectedDate,
                      afterOnTrack: proof.after.onTrack,
                      weeklySave: proof.weeklySave,
                      weeksSaved: proof.weeksSaved,
                      merchant: preview?.toMerchant ?? "",
                    }
                  : null
              }
            />
          </div>
        )}

        <div className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 [scrollbar-gutter:stable]">
          {openSwitches.length > 0 ? (
            <div>
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                Swap to keep the date
              </div>
              <div className="flex max-h-[168px] flex-col gap-1.5 overflow-y-auto overscroll-contain pr-0.5">
                {openSwitches.map((sw) => {
                  const save = weeklySavingFromSwitch(sw);
                  const off = percentOff(sw);
                  const selected = previewId === sw.id;
                  return (
                    <button
                      key={sw.id}
                      id={sw.id === "switch-coffee" ? "swap-coffee" : undefined}
                      onClick={() => onPreview(selected ? null : sw)}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition ${
                        selected
                          ? "border-black bg-lime/30 shadow-soft"
                          : "border-neutral-200 bg-white hover:border-black hover:bg-neutral-50"
                      }`}
                    >
                      <span className="flex shrink-0 items-center gap-1.5">
                        <MerchantLogo name={sw.fromMerchant} domain={sw.fromDomain} size={32} />
                        <span className="text-[11px] text-neutral-400" aria-hidden>
                          →
                        </span>
                        <MerchantLogo name={sw.toMerchant} domain={sw.toDomain} size={32} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] font-semibold leading-tight">
                          {sw.fromMerchant} → {sw.toMerchant}
                        </span>
                        <span className="mt-0.5 block truncate text-[10px] text-neutral-500">
                          {sw.habit}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="tabular block text-[12px] font-bold">{money(save)}/wk</span>
                        <span className="mt-0.5 inline-block rounded-full bg-black px-1.5 py-0.5 text-[9px] font-bold text-lime">
                          {off}% off
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {preview && proof ? (
            <div className="mt-3 rounded-2xl border border-black bg-black px-3.5 py-3 text-white">
              {!couponRevealed ? (
                <>
                  <p className="text-sm font-semibold leading-snug">
                    {preview.toMerchant} has a code for this swap. Reveal it and we&apos;ll drop
                    the extra week.
                  </p>
                  <p className="mt-1 text-[11px] text-white/55">
                    {preview.sourceNote ?? preview.habit}
                  </p>
                  <button
                    id={preview.id === "switch-coffee" ? "swap-coffee-apply" : undefined}
                    onClick={onRevealCoupon}
                    className="mt-2.5 w-full rounded-xl bg-lime py-2.5 text-sm font-bold text-black transition hover:brightness-95"
                  >
                    Reveal coupon code
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-lime">
                    Your code
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold tracking-[0.18em]">
                    {preview.couponCode ?? "SWAP20"}
                  </p>
                  <p className="mt-1 text-[11px] text-white/55">
                    Show this at {preview.toMerchant}. The extra week is off — {goal.name} is back
                    on track.
                  </p>
                  <button
                    id={preview.id === "switch-coffee" ? "swap-coffee-apply" : undefined}
                    onClick={() => onSwitch(preview)}
                    className="mt-2.5 w-full rounded-xl bg-lime py-2.5 text-sm font-bold text-black transition hover:brightness-95"
                  >
                    {proof.after.onTrack
                      ? `Commit — hit ${shortDate(goal.deadline)}`
                      : `Commit — save ${money(proof.weeklySave)}/wk`}
                  </button>
                </>
              )}
            </div>
          ) : offTrack && !preview ? (
            <p className="mt-2.5 text-center text-[11px] text-neutral-500">
              Tap a swap to see the finish date move. Reveal the coupon to cut the extra week.
            </p>
          ) : null}

          {onSwitches.length > 0 ? (
            <div className="mt-3 space-y-2">
              {onSwitches.map((sw) => {
                const pledge = activePledge(goal, sw.id);
                const kept = pledge?.status === "kept";
                return (
                  <div
                    key={sw.id}
                    className="rounded-2xl border border-lime bg-lime/20 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <MerchantLogo name={sw.toMerchant} domain={sw.toDomain} size={28} />
                        <span className="min-w-0">
                          <span className="block truncate text-[12px] font-bold">
                            {kept ? "Kept" : "Pledged"} · {sw.toMerchant}
                          </span>
                          <span className="block text-[10px] text-neutral-600">
                            {kept
                              ? `Logged against ${seedUser.firstName}'s Everyday feed.`
                              : `Check-in: ${checkInLabel(sw)}. ${sw.fromMerchant} would break this.`}
                          </span>
                        </span>
                      </span>
                      <span className="tabular shrink-0 text-[11px] font-bold">
                        +{money(weeklySavingFromSwitch(sw))}/wk
                      </span>
                    </div>
                    {!kept ? (
                      <div className="mt-2 grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => onKeep(sw)}
                          className="rounded-xl bg-black py-1.5 text-[11px] font-bold text-lime"
                        >
                          I swapped this week
                        </button>
                        <button
                          onClick={() => onBreak(sw)}
                          className="rounded-xl border border-[#ff7a3d]/40 bg-white py-1.5 text-[11px] font-bold text-[#e85d1c]"
                        >
                          {sw.fromMerchant} hit again
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}

          {offTrack && !preview && !livePledge ? (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-neutral-400">
              {topCuts.map((o) => (
                <button
                  key={`${o.categoryId}-${o.cut}`}
                  onClick={() => onCut(o)}
                  className="hover:text-black"
                >
                  {o.cut === "all" ? "Cut" : "Halve"} {o.label.toLowerCase()} · +
                  {money(o.freedPerWeek)}/wk
                </button>
              ))}
              <button onClick={onExtend} className="hover:text-black">
                Or push the date
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProjectionStrip({
  offTrack,
  plannedWeeks,
  projectedWeeks,
  deadline,
  proof,
}: {
  offTrack: boolean;
  plannedWeeks: number;
  projectedWeeks: number;
  deadline: string;
  proof: {
    afterWeeks: number;
    afterDate: string;
    afterOnTrack: boolean;
    weeklySave: number;
    weeksSaved: number;
    merchant: string;
  } | null;
}) {
  return (
    <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
      <div
        className={`rounded-2xl border px-3 py-2.5 ${
          offTrack ? "border-[#ff7a3d] bg-[#ff7a3d]/10" : "border-neutral-200 bg-neutral-50"
        }`}
      >
        <div
          className={`text-[10px] font-bold uppercase tracking-widest ${
            offTrack ? "text-[#e85d1c]" : "text-neutral-400"
          }`}
        >
          Now
        </div>
        <div className="tabular mt-0.5 text-lg font-bold leading-none">
          {projectedWeeks}w
        </div>
        <div className="mt-1 text-[11px] leading-snug text-neutral-600">
          {offTrack
            ? `${extraCopy(projectedWeeks - plannedWeeks)} · misses ${shortDate(deadline)}`
            : `On ${shortDate(deadline)}`}
        </div>
      </div>

      <div className="flex items-center text-neutral-300" aria-hidden>
        →
      </div>

      <div
        className={`rounded-2xl border px-3 py-2.5 ${
          proof?.afterOnTrack || (!offTrack && !proof)
            ? "border-lime bg-lime/25"
            : "border-neutral-200 bg-white"
        }`}
      >
        <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          {proof ? `If ${proof.merchant}` : "If you swap"}
        </div>
        <div className="tabular mt-0.5 text-lg font-bold leading-none">
          {proof ? `${proof.afterWeeks}w` : `${plannedWeeks}w`}
        </div>
        <div className="mt-1 text-[11px] leading-snug text-neutral-600">
          {proof
            ? proof.afterOnTrack
              ? `Hits ${shortDate(deadline)} · save ${money(proof.weeklySave)}/wk`
              : `Still ${proof.afterWeeks}w · ${money(proof.weeklySave)}/wk closer`
            : "Pick a merchant to project the date"}
        </div>
      </div>
    </div>
  );
}

function extraCopy(weeks: number): string {
  if (weeks <= 0) return "On time";
  return `+${weeks} ${weeks === 1 ? "week" : "weeks"}`;
}

function checkInLabel(sw: SpendSwitch): string {
  if (sw.categoryId === "subscriptions") return "next renewal";
  if (sw.timesPerWeek >= 4) return "your next tap this week";
  return "this week's shop";
}
