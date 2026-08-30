#!/usr/bin/env node
/**
 * Records the landing product tour to a single video.
 *
 * Usage:
 *   1. Keep `npm run dev` running (or this script will start it)
 *   2. npm run demo:video
 *
 * Output: exports/knodle-product-tour.mp4  (webm fallback if ffmpeg is missing)
 */
import { spawn } from "node:child_process";
import { mkdirSync, renameSync, copyFileSync, existsSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "exports");
const BASE = process.env.DEMO_URL ?? "http://localhost:3000";
const RECORD_URL = `${BASE}/demo/record`;
const WIDTH = 1920;
const HEIGHT = 1080;
const TIMEOUT_MS = 180_000;
const TARGET_S = 40;
const HIDE_OVERLAY_CSS = `
  nextjs-portal,
  [data-next-badge-root],
  [data-nextjs-toast],
  [data-nextjs-dialog-overlay] {
    display: none !important;
    pointer-events: none !important;
  }
`;

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", ...opts });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
    child.on("error", reject);
  });
}

function ffmpegBin() {
  const brew = "/opt/homebrew/bin/ffmpeg";
  if (existsSync(brew)) return brew;
  return "ffmpeg";
}

async function serverUp() {
  try {
    const res = await fetch(RECORD_URL, { redirect: "manual" });
    return res.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer(ms = 60_000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    if (await serverUp()) return;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Timed out waiting for ${RECORD_URL}`);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  let startedDev = false;
  let dev;
  if (!(await serverUp())) {
    console.log("Dev server not running — starting `npm run dev`…");
    dev = spawn("npm", ["run", "dev"], { cwd: ROOT, stdio: "pipe" });
    startedDev = true;
    await waitForServer();
  }

  console.log(`Recording ${RECORD_URL} at ${WIDTH}×${HEIGHT}…`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2,
    reducedMotion: "no-preference",
    recordVideo: {
      dir: OUT_DIR,
      size: { width: WIDTH, height: HEIGHT },
    },
  });
  await context.addInitScript(() => {
    const hide = () => {
      document.querySelectorAll("nextjs-portal").forEach((el) => el.remove());
    };
    const start = () => {
      hide();
      new MutationObserver(hide).observe(document.documentElement, { childList: true, subtree: true });
    };
    if (document.documentElement) start();
    else document.addEventListener("DOMContentLoaded", start);
  });

  const page = await context.newPage();
  const tPage = Date.now();
  await page.goto(RECORD_URL, { waitUntil: "networkidle", timeout: 60_000 });
  await page.addStyleTag({ content: HIDE_OVERLAY_CSS });
  await page.waitForSelector("[data-demo-ready='true']", { timeout: 20_000 });
  await page.waitForTimeout(500);

  const tStart = Date.now();
  await page.evaluate(() => {
    window.__KNODLE_RECORD_START = true;
    window.dispatchEvent(new Event("knodle-record-start"));
  });
  await page.waitForSelector("[data-demo-complete='true']", { timeout: TIMEOUT_MS });
  await page.waitForTimeout(350);
  const tEnd = Date.now();

  const video = page.video();
  await context.close();
  await browser.close();

  const webmPath = video ? await video.path() : null;
  if (!webmPath || !existsSync(webmPath)) {
    throw new Error("Playwright did not write a video file.");
  }

  const destWebm = join(OUT_DIR, "knodle-product-tour.webm");
  if (webmPath !== destWebm) {
    try {
      renameSync(webmPath, destWebm);
    } catch {
      copyFileSync(webmPath, destWebm);
    }
  }

  const destMp4 = join(OUT_DIR, "knodle-product-tour.mp4");
  const ss = Math.max(0, (tStart - tPage) / 1000 - 0.12);
  const contentS = Math.max(0.1, (tEnd - tStart) / 1000 + 0.12);
  const bin = ffmpegBin();
  const args = ["-y", "-ss", ss.toFixed(3), "-i", destWebm];
  if (contentS > TARGET_S + 0.25) {
    const rate = TARGET_S / contentS;
    args.push("-filter:v", `setpts=${rate.toFixed(6)}*PTS,fps=30`);
  } else if (contentS < TARGET_S - 0.2) {
    const pad = (TARGET_S - contentS).toFixed(3);
    args.push("-filter:v", `fps=30,tpad=stop_mode=clone:stop_duration=${pad}`);
  } else {
    args.push("-filter:v", "fps=30", "-t", String(TARGET_S));
  }
  args.push(
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    destMp4,
  );
  try {
    await run(bin, args);
    try {
      unlinkSync(destWebm);
    } catch {
      /* keep webm if unlink fails */
    }
    console.log(`Wrote ${destMp4}`);
    console.log(`Recorded ~${contentS.toFixed(1)}s → ${TARGET_S.toFixed(1)}s MP4`);
  } catch {
    console.log(`Could not encode MP4 with ${bin} — wrote ${destWebm}`);
    console.log("Install ffmpeg for MP4:  brew install ffmpeg");
  }

  if (startedDev && dev) {
    dev.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
