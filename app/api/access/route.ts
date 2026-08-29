import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE } from "@/lib/demoAccess";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistEntry = { email: string; at: string };

async function persistEmail(email: string) {
  const file = path.join(process.cwd(), "data", "waitlist.json");
  let list: WaitlistEntry[] = [];
  try {
    list = JSON.parse(await fs.readFile(file, "utf8")) as WaitlistEntry[];
    if (!Array.isArray(list)) list = [];
  } catch {
    list = [];
  }

  if (!list.some((entry) => entry.email === email)) {
    list.push({ email, at: new Date().toISOString() });
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(list, null, 2));
  }
}

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }

  try {
    await persistEmail(email);
  } catch {
    // Serverless/read-only filesystems still grant access.
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
