export const DEMO_PATH = "/app";
export const ACCESS_COOKIE = "knodle_demo_access";
export const EMAIL_STORAGE_KEY = "knodle_demo_email";

export function storedDemoEmail() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(EMAIL_STORAGE_KEY) ?? "";
}

export function hasLocalDemoAccess() {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(EMAIL_STORAGE_KEY));
}

export async function grantDemoAccess(email: string) {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes("@")) {
    throw new Error("Enter a valid email");
  }

  window.localStorage.setItem(EMAIL_STORAGE_KEY, trimmed);

  const res = await fetch("/api/access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: trimmed }),
  });

  if (!res.ok) {
    throw new Error("Could not unlock the demo");
  }
}

export function goToDemo() {
  window.location.assign(DEMO_PATH);
}

export async function unlockAndGoToDemo(email: string) {
  await grantDemoAccess(email);
  goToDemo();
}
