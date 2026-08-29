export const DEMO_PATH = "/app";
export const ACCESS_COOKIE = "knodle_demo_access";
export const EMAIL_STORAGE_KEY = "knodle_demo_email";
export const NETLIFY_FORM_NAME = "waitlist";

export function storedDemoEmail() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(EMAIL_STORAGE_KEY) ?? "";
}

export function hasLocalDemoAccess() {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(EMAIL_STORAGE_KEY));
}

/** POST to Netlify Forms so submissions show up in the project Forms tab. */
async function submitNetlifyWaitlist(email: string) {
  const body = new URLSearchParams();
  body.set("form-name", NETLIFY_FORM_NAME);
  body.set("email", email);

  await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}

export async function grantDemoAccess(email: string) {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes("@")) {
    throw new Error("Enter a valid email");
  }

  window.localStorage.setItem(EMAIL_STORAGE_KEY, trimmed);

  const access = await fetch("/api/access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: trimmed }),
  });

  if (!access.ok) {
    throw new Error("Could not unlock the demo");
  }

  // Best-effort: store the email in Netlify Forms. Local Next.js has no handler.
  try {
    await submitNetlifyWaitlist(trimmed);
  } catch {
    // ignore
  }
}

export function goToDemo() {
  window.location.assign(DEMO_PATH);
}

export async function unlockAndGoToDemo(email: string) {
  await grantDemoAccess(email);
  goToDemo();
}
