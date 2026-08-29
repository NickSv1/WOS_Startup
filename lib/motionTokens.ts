/** Shared motion tokens for the product demo — reuse everywhere, don't restyle per step. */
export const cameraSpring = { type: "spring" as const, stiffness: 120, damping: 26 };
export const cursorSpring = { type: "spring" as const, stiffness: 300, damping: 22 };
export const captionFade = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const };
export const staggerChildren = 0.06;
export const cursorLeadMs = 250;
export const clickDelayMs = 150;
export const clickScale = { duration: 0.12, ease: "easeOut" as const };
/** Phone → desktop stretch — slower than the camera spring, never snappy. */
export const morphTween = { duration: 1.85, ease: [0.22, 1, 0.36, 1] as const };
