/** Shared motion tokens for the product demo — reuse everywhere, don't restyle per step. */
export const cameraSpring = { type: "spring" as const, stiffness: 95, damping: 28 };
export const uiSpring = { type: "spring" as const, stiffness: 220, damping: 32 };
export const cursorSpring = { type: "spring" as const, stiffness: 280, damping: 24 };
export const longEase = [0.22, 1, 0.36, 1] as const;
export const morphEase = [0.32, 0.08, 0.18, 1] as const;
export const captionFade = { duration: 0.42, ease: longEase };
export const staggerChildren = 0.06;
export const cursorLeadMs = 250;
export const clickDelayMs = 150;
export const clickScale = { duration: 0.22, ease: "easeOut" as const };
export const typeCharMs = 38;
export const typePauseMs = 48;
export const typeCharMsFast = 22;
export const typePauseMsFast = 28;
export const replanStaggerMs = 70;
export const framePad = 0.14;
export const maxGroupZoom = 1.18;
/** Viewport inset so a framed element never kisses the edge. */
export const minViewPad = 0.1;
/** Desktop ↔ phone squeeze/stretch — long ease, content crossfades with the frame. */
export const morphTween = { duration: 1.8, ease: morphEase };
export const morphMs = 1800;
export const morphFade = { duration: 0.42, ease: morphEase };
/** Camera settles on the map before the frame squeezes to the phone. */
export const compressLeadMs = 520;
