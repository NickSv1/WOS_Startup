"use client";

import { useState } from "react";

/** Front-end only: prevents default and shows a thank-you. No backend. */
export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="animate-fade-up rounded-2xl border border-lime-600 bg-lime/15 px-6 py-5 text-center">
        <p className="text-lg font-bold">You're on the list 🎉</p>
        <p className="mt-1 text-sm text-neutral-600">
          We'll text you when Knodle opens up. (See what we did there.)
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) setDone(true);
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="flex-1 rounded-xl border border-neutral-300 px-4 py-3.5 text-base outline-none focus:border-black"
      />
      <button
        type="submit"
        className="rounded-xl bg-lime px-6 py-3.5 text-base font-bold text-black transition hover:brightness-95"
      >
        Get early access
      </button>
    </form>
  );
}
