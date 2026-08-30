"use client";

import { DemoPhoneMap } from "./DemoPhoneMap";
import { PhoneLock } from "./PhoneLock";

export function MobileScreen({
  kind,
  hovered,
  showSaveNotif,
}: {
  kind: "lock" | "app";
  hovered: boolean;
  showSaveNotif?: boolean;
}) {
  if (kind === "lock") return <PhoneLock hovered={hovered} showSaveNotif={showSaveNotif} />;
  return <DemoPhoneMap />;
}
