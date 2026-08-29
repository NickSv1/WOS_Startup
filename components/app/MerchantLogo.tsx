"use client";

import { useState } from "react";

export function MerchantLogo({
  name,
  domain,
  size = 40,
}: {
  name: string;
  domain: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  const src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;

  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white shadow-sm"
      style={{ width: size, height: size }}
      title={name}
    >
      {failed ? (
        <span className="text-sm font-bold text-neutral-700">{letter}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={size - 8}
          height={size - 8}
          className="h-[70%] w-[70%] object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
