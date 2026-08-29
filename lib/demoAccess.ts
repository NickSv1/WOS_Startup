export const DEMO_PATH = "/app";
export const ACCESS_COOKIE = "knodle_demo_access";
export const EMAIL_STORAGE_KEY = "knodle_demo_email";
export const NETLIFY_FORM_NAME = "contact";

export function storedDemoEmail() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(EMAIL_STORAGE_KEY) ?? "";
}

export function hasLocalDemoAccess() {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(EMAIL_STORAGE_KEY));
}

/** POST to the Netlify `contact` form (name + email). */
async function submitNetlifyContact(name: string, email: string) {
  const body = new URLSearchParams();
  body.set("form-name", NETLIFY_FORM_NAME);
  body.set("name", name);
  body.set("email", email);

  await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}

export async function grantDemoAccess(email: string, name = "") {
  const trimmed = email.trim().toLowerCase();
  const displayName = name.trim() || trimmed.split("@")[0] || "there";
  if (!trimmed.includes("@")) {
    throw new Error("Enter a valid email");
  }

  window.localStorage.setItem(EMAIL_STORAGE_KEY, trimmed);

  const access = await fetch("/api/access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: trimmed, name: displayName }),
  });

  if (!access.ok) {
    throw new Error("Could not unlock the demo");
  }

  try {
    await submitNetlifyContact(displayName, trimmed);
  } catch {
    // Local Next.js has no Netlify form handler.
  }
}

export function goToDemo() {
  window.location.assign(DEMO_PATH);
}

export async function unlockAndGoToDemo(email: string, name = "") {
  await grantDemoAccess(email, name);
  goToDemo();
}
