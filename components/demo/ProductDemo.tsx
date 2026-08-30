"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  demoScript,
  FIX_SAVE,
  isMorphAdvance,
  phaseAfter,
  shellAfter,
  stepCaption,
  stepFrame,
  stepHold,
  stepMount,
  type DemoAdvance,
  type DemoPhase,
  type DemoShell,
  type DemoStep,
} from "@/lib/demoScript";
import {
  cameraSpring,
  captionFade,
  clickDelayMs,
  cursorLeadMs,
  cursorSpring,
  framePad,
  maxGroupZoom,
  minViewPad,
  compressLeadMs,
  morphEase,
  morphMs,
  morphTween,
} from "@/lib/motionTokens";
import { DemoProduct } from "./DemoProduct";
import { MobileScreen } from "./MobileScreen";

type Cam = { x: number; y: number; scale: number };
type Pt = { x: number; y: number };

const STAGE_W = 1120;
const STAGE_H = 680;
const PHONE = { w: 360, h: 640 };
const IDLE: Cam = { x: 0, y: 0, scale: 1 };
/** macOS pointer tip in the SVG, in px — cursor.x/y is the hotspot, not the sprite origin. */
const CURSOR_TIP = { x: 1.15, y: 1.15 };

function waitFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

export function ProductDemo({ mode = "loop" }: { mode?: "loop" | "record" }) {
  const prefersReduced = useReducedMotion() === true;
  const reduceMotion = mode === "record" ? false : prefersReduced;
  const record = mode === "record";
  const viewportRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const stepRef = useRef(0);
  const camRef = useRef<Cam>(IDLE);
  const skipRef = useRef<number | null>(null);
  const shellRef = useRef<DemoShell>("desktop");

  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [shell, setShell] = useState<DemoShell>("desktop");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [cam, setCam] = useState<Cam>(IDLE);
  const [cursor, setCursor] = useState<Pt>({ x: 400, y: 360 });
  const [clicking, setClicking] = useState(false);
  const [ripple, setRipple] = useState(0);
  const [paused, setPaused] = useState(false);
  const [weeklyBoost, setWeeklyBoost] = useState(0);
  const [box, setBox] = useState({ w: 920, h: 680 });
  const [complete, setComplete] = useState(false);
  const [armed, setArmed] = useState(!record);
  const [hasNewGoal, setHasNewGoal] = useState(false);
  const [morphing, setMorphing] = useState(false);

  const step = demoScript[stepIndex];
  const caption = stepCaption(step);
  const desktop = shell === "desktop";

  const dispatch = useCallback((advance?: DemoAdvance) => {
    if (!advance) return;
    if (advance === "ADD_GOAL") {
      setPhase("adding");
      setHasNewGoal(true);
    }
    if (advance === "SHOW_PLAN") setPhase("plan");
    if (advance === "REPLAN") setPhase("replan");
    if (advance === "COMPRESS_TO_PHONE") setShell("lock");
    if (advance === "PHONE_NOTIF") setShell("lock");
    if (advance === "OPEN_APP") setShell("app");
    if (advance === "STRETCH_TO_DESKTOP" || advance === "TO_DESKTOP") {
      setShell("desktop");
      setPhase((p) => (p === "plan" || p === "replan" || p === "adding" ? "idle" : p));
    }
    if (advance === "VIEW_TXNS") setPhase("txns");
    if (advance === "TO_GOALS") setPhase("idle");
    if (advance === "SELECT_SYDNEY") setPhase("scanning");
    if (advance === "SCAN_DONE") setPhase("recommend");
    if (advance === "APPLY_SWAP") {
      setPhase("applied");
      setWeeklyBoost(0);
    }
    if (advance === "BACK_ON_TRACK") setPhase("onTrack");
    if (advance === "RESET") {
      setPhase("idle");
      setShell("desktop");
      setWeeklyBoost(0);
      setHoverId(null);
      setHasNewGoal(false);
    }
  }, []);

  const localBox = useCallback((el: HTMLElement) => {
    const stage = stageRef.current;
    if (!stage) return { x1: 0, y1: 0, x2: 0, y2: 0 };
    const sr = stage.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const visualScale = sr.width / STAGE_W || 1;
    return {
      x1: (er.left - sr.left) / visualScale,
      y1: (er.top - sr.top) / visualScale,
      x2: (er.right - sr.left) / visualScale,
      y2: (er.bottom - sr.top) / visualScale,
    };
  }, []);

  const frameCamera = useCallback(
    (targetId: string, zoom: number, ids?: readonly string[]): Cam => {
      const frame = screenRef.current ?? viewportRef.current;
      if (!frame) return IDLE;
      const vw = frame.clientWidth;
      const vh = frame.clientHeight;
      const fit = Math.min(vw / STAGE_W, vh / STAGE_H);
      const mapFrame = {
        x: (vw - STAGE_W * fit) / 2,
        y: (vh - STAGE_H * fit) / 2,
        scale: fit * (targetId === "map" || targetId === "device-frame" ? Math.min(zoom, 1.06) : 1),
      };
      if (targetId === "map" || targetId === "device-frame" || !stageRef.current) return mapFrame;

      const group = ids?.length ? ids : [targetId];
      const unique = [...new Set(group)];
      const boxes = unique
        .map((id) => frame.querySelector<HTMLElement>(`#${CSS.escape(id)}`))
        .filter((el): el is HTMLElement => Boolean(el))
        .map((el) => {
          const p = localBox(el);
          return p;
        });
      if (!boxes.length) {
        const el = frame.querySelector<HTMLElement>(`#${CSS.escape(targetId)}`);
        if (!el) return mapFrame;
        boxes.push(localBox(el));
      }

      let x1 = Infinity;
      let y1 = Infinity;
      let x2 = -Infinity;
      let y2 = -Infinity;
      for (const b of boxes) {
        x1 = Math.min(x1, b.x1);
        y1 = Math.min(y1, b.y1);
        x2 = Math.max(x2, b.x2);
        y2 = Math.max(y2, b.y2);
      }
      const w = Math.max(8, x2 - x1);
      const h = Math.max(8, y2 - y1);
      const bw = w * (1 + 2 * framePad);
      const bh = h * (1 + 2 * framePad);
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      const grouped = unique.length > 1 || boxes.length > 1;
      const cap = fit * (grouped ? maxGroupZoom : Math.min(zoom, 1.22));
      const scale = Math.min(
        vw / bw,
        vh / bh,
        (vw * (1 - 2 * minViewPad)) / w,
        (vh * (1 - 2 * minViewPad)) / h,
        cap,
      );
      return {
        x: vw / 2 - cx * scale,
        y: vh / 2 - cy * scale,
        scale,
      };
    },
    [localBox],
  );

  const cursorFor = useCallback((cursorId: string, _camera?: Cam): Pt => {
    const viewport = viewportRef.current;
    if (!viewport) return { x: 400, y: 360 };
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    if (cursorId === "idle") return { x: vw * 0.5, y: vh * 0.78 };
    const el = viewport.querySelector<HTMLElement>(`#${CSS.escape(cursorId)}`);
    if (!el) return { x: vw * 0.5, y: vh * 0.78 };
    const er = el.getBoundingClientRect();
    const vr = viewport.getBoundingClientRect();
    return {
      x: er.left + er.width / 2 - vr.left,
      y: er.top + er.height / 2 - vr.top,
    };
  }, []);

  const playClick = useCallback(() => {
    setClicking(true);
    setRipple((n) => n + 1);
    window.setTimeout(() => setClicking(false), 180);
  }, []);

  const applyJump = useCallback((i: number) => {
    const jumped = demoScript.slice(0, i + 1).flatMap((s) => {
      const out: DemoAdvance[] = [];
      const mount = stepMount(s);
      if (mount) out.push(mount);
      if ("advance" in s && s.advance) out.push(s.advance);
      return out;
    });
    const nextPhase = phaseAfter(jumped);
    const nextShell = reduceMotion ? "desktop" : shellAfter(jumped);
    setPhase(nextPhase);
    setShell(nextShell);
    setWeeklyBoost(nextPhase === "applied" || nextPhase === "onTrack" ? FIX_SAVE : 0);
    setHasNewGoal(jumped.includes("ADD_GOAL") && !jumped.includes("RESET"));
    setMorphing(false);
  }, [reduceMotion]);

  useEffect(() => {
    camRef.current = cam;
  }, [cam]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    shellRef.current = shell;
  }, [shell]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const measure = () => setBox({ w: viewport.clientWidth, h: viewport.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, []);

  const wasDesktop = useRef(false);
  useLayoutEffect(() => {
    if (!desktop) {
      wasDesktop.current = false;
      return;
    }
    if (wasDesktop.current) return;
    wasDesktop.current = true;
    const next = frameCamera("map", 1);
    camRef.current = next;
    setCam(next);
  }, [desktop, frameCamera]);

  useEffect(() => {
    if (phase !== "applied") return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setWeeklyBoost(n);
      if (n >= FIX_SAVE) window.clearInterval(id);
    }, 40);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;
    const onResize = () => {
      if (shellRef.current !== "desktop") return;
      const s = demoScript[stepRef.current];
      const next = frameCamera(s.target, s.zoom, stepFrame(s));
      camRef.current = next;
      setCam(next);
      setCursor(cursorFor(s.cursor, next));
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(screen);
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [cursorFor, frameCamera]);

  const frameCameraRef = useRef(frameCamera);
  const cursorForRef = useRef(cursorFor);
  const dispatchRef = useRef(dispatch);
  const applyJumpRef = useRef(applyJump);
  const playClickRef = useRef(playClick);
  frameCameraRef.current = frameCamera;
  cursorForRef.current = cursorFor;
  dispatchRef.current = dispatch;
  applyJumpRef.current = applyJump;
  playClickRef.current = playClick;

  useEffect(() => {
    if (!record) return;
    const w = window as Window & { __KNODLE_RECORD_START?: boolean };
    if (w.__KNODLE_RECORD_START) {
      setArmed(true);
      return;
    }
    const onStart = () => setArmed(true);
    window.addEventListener("knodle-record-start", onStart);
    return () => window.removeEventListener("knodle-record-start", onStart);
  }, [record]);

  useEffect(() => {
    if (record && !armed) return;
    let cancelled = false;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const tick = () => {
          if (cancelled) return resolve();
          if (skipRef.current !== null) return resolve();
          if (pausedRef.current) {
            requestAnimationFrame(tick);
            return;
          }
          if (performance.now() - start >= (reduceMotion ? Math.min(ms, 400) : ms)) resolve();
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });

    async function run() {
      await wait(80);
      const startAt = 0;
      while (!cancelled) {
        for (let i = startAt; i < demoScript.length; ) {
          if (cancelled) return;
          let jumped = false;
          if (skipRef.current !== null) {
            i = skipRef.current;
            skipRef.current = null;
            jumped = true;
            applyJumpRef.current(i);
          }
          stepRef.current = i;
          setStepIndex(i);
          const s: DemoStep = demoScript[i];
          const morph = "advance" in s && isMorphAdvance(s.advance);
          const mount = stepMount(s);
          const leadMs = record ? 220 : cursorLeadMs;
          const settleMs = record ? 480 : 500;

          if (mount) {
            const skipPhone =
              reduceMotion && (mount === "OPEN_APP" || mount === "PHONE_NOTIF" || mount === "COMPRESS_TO_PHONE");
            if (!skipPhone) dispatchRef.current(mount);
            await wait(80);
            await waitFrame();
            await waitFrame();
            await wait(40);
          }
          if (cancelled || skipRef.current !== null) continue;

          let destCam = frameCameraRef.current(s.target, s.zoom, stepFrame(s));
          const frame = screenRef.current;
          const needed = stepFrame(s);
          const missing = needed.some((id) => !frame?.querySelector(`#${CSS.escape(id)}`));
          if (missing) {
            await wait(80);
            destCam = frameCameraRef.current(s.target, s.zoom, stepFrame(s));
          }

          if (!reduceMotion && morph && s.advance === "COMPRESS_TO_PHONE" && !jumped) {
            setHoverId(null);
            setCursor(cursorForRef.current("idle"));
            setCam(destCam);
            await wait(compressLeadMs);
            if (cancelled || skipRef.current !== null) continue;
          }

          if (morph && !reduceMotion) {
            setMorphing(true);
            dispatchRef.current(s.advance);
          }

          if (!reduceMotion) {
            if ("hover" in s && s.hover) setHoverId(s.cursor);
            else setHoverId(null);
            setCursor(cursorForRef.current(s.cursor));
            if (!jumped && !mount && !morph) {
              await wait(leadMs);
              if (cancelled || skipRef.current !== null) continue;
            }
            setCam(destCam);
            await waitFrame();
            await waitFrame();
            setCursor(cursorForRef.current(s.cursor));
            const camWait = jumped ? 0 : morph ? morphMs : settleMs;
            const stickStart = performance.now();
            while (performance.now() - stickStart < camWait) {
              if (cancelled || skipRef.current !== null) break;
              if (morph) setCam(frameCameraRef.current(s.target, s.zoom, stepFrame(s)));
              setCursor(cursorForRef.current(s.cursor));
              await waitFrame();
            }
            setCursor(cursorForRef.current(s.cursor));
            if (morph) setMorphing(false);
            if (cancelled || skipRef.current !== null) continue;
          } else {
            setCam(frameCameraRef.current("map", 1));
            setHoverId("hover" in s && s.hover ? s.cursor : null);
          }

          if ("click" in s && s.click) {
            await wait(clickDelayMs);
            if (cancelled || skipRef.current !== null) continue;
            playClickRef.current();
          }
          if ("advance" in s && !morph) {
            const skipPhone =
              reduceMotion && (s.advance === "OPEN_APP" || s.advance === "PHONE_NOTIF");
            if (!skipPhone) dispatchRef.current(s.advance);
          }
          await wait(stepHold(s, record));
          if (cancelled) return;
          if (skipRef.current !== null) continue;
          i += 1;
          if (record && i < demoScript.length && demoScript[i].id === "loop") {
            setComplete(true);
            return;
          }
        }
        if (record) {
          setComplete(true);
          return;
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [armed, record, reduceMotion]);

  function jumpTo(i: number) {
    skipRef.current = i;
    applyJump(i);
    setStepIndex(i);
    const paint = () => {
      const s = demoScript[i];
      const dest = frameCamera(s.target, s.zoom, stepFrame(s));
      setCam(reduceMotion ? frameCamera("map", 1) : dest);
      setCursor(cursorFor(s.cursor));
    };
    requestAnimationFrame(() => requestAnimationFrame(paint));
  }

  const phoneLeft = Math.max(0, (box.w - PHONE.w) / 2);
  const phoneTop = Math.max(0, (box.h - PHONE.h) / 2);

  return (
    <div className={record ? "relative h-screen w-screen" : "relative mx-auto w-full max-w-[920px]"}>
      <div
        ref={viewportRef}
        className={`relative overflow-hidden bg-[#f4f4f5] ${
          record ? "h-full w-full rounded-none" : "h-[640px] rounded-[28px] sm:h-[700px]"
        }`}
        onMouseEnter={() => {
          if (!record) setPaused(true);
        }}
        onMouseLeave={() => {
          if (!record) setPaused(false);
        }}
        data-demo-paused={paused ? "true" : "false"}
        data-demo-ready="true"
        data-demo-complete={complete ? "true" : "false"}
      >
        <motion.div
          id="device-frame"
          className="absolute overflow-hidden will-change-transform"
          initial={false}
          animate={
            desktop
              ? {
                  width: box.w,
                  height: box.h,
                  left: 0,
                  top: 0,
                  borderRadius: 28,
                  padding: 0,
                  backgroundColor: "#fafafa",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                }
              : {
                  width: PHONE.w,
                  height: PHONE.h,
                  left: phoneLeft,
                  top: phoneTop,
                  borderRadius: 46,
                  padding: 10,
                  backgroundColor: "#111111",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.28)",
                }
          }
          transition={reduceMotion ? { duration: 0 } : morphTween}
        >
          <AnimatePresence>
            {!desktop ? (
              <motion.div
                key="notch"
                className="absolute left-1/2 top-2.5 z-30 h-[22px] w-[92px] rounded-full bg-black"
                initial={{ opacity: 0, scaleX: 0.7, x: "-50%" }}
                animate={{ opacity: 1, scaleX: 1, x: "-50%" }}
                exit={{ opacity: 0, scaleX: 0.7, x: "-50%" }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: morphEase }}
                style={{ transformOrigin: "center" }}
              />
            ) : null}
          </AnimatePresence>

          <div ref={screenRef} className="relative h-full w-full overflow-hidden rounded-[32px]">
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: desktop ? 1 : 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : desktop
                    ? { duration: 0.7, ease: morphEase, delay: 0.12 }
                    : { duration: 0.5, ease: morphEase, delay: 0.3 }
              }
              style={{ pointerEvents: desktop ? "auto" : "none" }}
            >
              <motion.div
                ref={stageRef}
                className="absolute left-0 top-0 will-change-transform"
                initial={false}
                animate={reduceMotion ? frameCamera("map", 1) : cam}
                transition={reduceMotion || morphing ? { duration: 0 } : cameraSpring}
                style={{ transformOrigin: "0 0" }}
              >
                <DemoProduct
                  phase={phase}
                  hoverId={hoverId}
                  weeklyBoost={weeklyBoost}
                  stepId={step.id}
                  showNewGoal={hasNewGoal}
                  labelAccounts={step.id !== "establish" && step.id !== "loop"}
                  compact={record}
                />
              </motion.div>
            </motion.div>

            <AnimatePresence initial={false}>
              {shell === "lock" || shell === "app" ? (
                <motion.div
                  key="phone-shell"
                  className="absolute inset-0 z-10"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.5, ease: morphEase },
                  }}
                  exit={{
                    opacity: 0,
                    transition: reduceMotion ? { duration: 0 } : { duration: 0.4, ease: morphEase },
                  }}
                >
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={shell}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: morphEase }}
                    >
                      <MobileScreen
                        kind={shell}
                        hovered={hoverId === "knodle-notif"}
                        showSaveNotif={step.id === "notif" || step.id === "tapNotif"}
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>

        {!reduceMotion ? (
          <motion.div
            className="pointer-events-none absolute left-0 top-0 z-[80]"
            animate={
              clicking
                ? { x: cursor.x - CURSOR_TIP.x, y: cursor.y - CURSOR_TIP.y, scale: [1, 0.85, 1], opacity: 1 }
                : { x: cursor.x - CURSOR_TIP.x, y: cursor.y - CURSOR_TIP.y, scale: 1, opacity: morphing ? 0 : 1 }
            }
            transition={
              clicking
                ? { duration: 0.22, ease: "easeOut" }
                : { ...cursorSpring, opacity: { duration: 0.28, ease: "easeOut" } }
            }
            style={{
              transformOrigin: `${CURSOR_TIP.x}px ${CURSOR_TIP.y}px`,
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.45)) drop-shadow(0 4px 10px rgba(0,0,0,0.18))",
            }}
          >
            <AnimatePresence>
              {clicking ? (
                <motion.span
                  key="glow"
                  className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/60"
                  style={{ left: CURSOR_TIP.x, top: CURSOR_TIP.y, filter: "blur(3px)" }}
                  initial={{ opacity: 0.75, scale: 0.55 }}
                  animate={{ opacity: 0, scale: 1.9 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              ) : null}
            </AnimatePresence>
            <CursorSvg />
            <AnimatePresence>
              {ripple > 0 ? (
                <motion.span
                  key={ripple}
                  className="absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black/55"
                  style={{ left: CURSOR_TIP.x, top: CURSOR_TIP.y }}
                  initial={{ scale: 0.2, opacity: 0.65 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}

        {record ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center px-4">
            <AnimatePresence mode="wait">
              {caption ? (
                <motion.p
                  key={step.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={captionFade}
                  className="rounded-full bg-black/85 px-5 py-2.5 text-center text-[15px] font-semibold text-white shadow-soft"
                >
                  {caption}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        ) : null}
      </div>

      {record ? null : (
        <>
          <div className="mt-3 flex min-h-[40px] items-center justify-center px-4">
            <AnimatePresence mode="wait">
              {caption ? (
                <motion.p
                  key={step.id}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                  transition={captionFade}
                  className="rounded-full bg-black/85 px-4 py-2 text-center text-[13px] font-semibold text-white shadow-soft"
                >
                  {caption}
                </motion.p>
              ) : (
                <span className="h-9" />
              )}
            </AnimatePresence>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
            {demoScript.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={stepCaption(s) ?? s.id}
                onClick={() => jumpTo(i)}
                className={`h-2 rounded-full transition ${
                  i === stepIndex ? "w-6 bg-black" : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CursorSvg() {
  return (
    <svg width="18" height="24" viewBox="0 0 18 24" fill="none" aria-hidden>
      <path
        d="M1.15 1.15v16.35l3.95-3.75 2.75 6.7 2.45-1.05-2.75-6.55 5.55-.12L1.15 1.15Z"
        fill="#111"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
