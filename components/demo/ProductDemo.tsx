"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  demoScript,
  FIX_SAVE,
  phaseAfter,
  shellAfter,
  stepCaption,
  type DemoAdvance,
  type DemoPhase,
  type DemoShell,
  type DemoStep,
} from "@/lib/demoScript";
import {
  cameraSpring,
  captionFade,
  clickDelayMs,
  clickScale,
  cursorLeadMs,
  cursorSpring,
  morphTween,
} from "@/lib/motionTokens";
import { DemoPhoneMap } from "./DemoPhoneMap";
import { DemoProduct } from "./DemoProduct";
import { PhoneLock } from "./PhoneLock";

type Cam = { x: number; y: number; scale: number };
type Pt = { x: number; y: number };

const STAGE_W = 1120;
const STAGE_H = 680;
const PHONE = { w: 310, h: 640 };
const IDLE: Cam = { x: 0, y: 0, scale: 1 };

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
  const shellRef = useRef<DemoShell>(reduceMotion ? "desktop" : "lock");

  const [stepIndex, setStepIndex] = useState(reduceMotion ? 4 : 0);
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [shell, setShell] = useState<DemoShell>(reduceMotion ? "desktop" : "lock");
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

  const step = demoScript[stepIndex];
  const caption = stepCaption(step);
  const desktop = shell === "desktop";

  const dispatch = useCallback((advance?: DemoAdvance) => {
    if (!advance) return;
    if (advance === "OPEN_APP") setShell("app");
    if (advance === "TO_DESKTOP") setShell("desktop");
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
      setShell("lock");
      setWeeklyBoost(0);
      setHoverId(null);
    }
  }, []);

  const localInStage = useCallback((el: HTMLElement): Pt => {
    const stage = stageRef.current;
    const scale = camRef.current.scale || 1;
    if (!stage) return { x: 0, y: 0 };
    const sr = stage.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return {
      x: (er.left + er.width / 2 - sr.left) / scale,
      y: (er.top + er.height / 2 - sr.top) / scale,
    };
  }, []);

  const frameCamera = useCallback(
    (targetId: string, zoom: number): Cam => {
      const frame = screenRef.current ?? viewportRef.current;
      if (!frame) return IDLE;
      const vw = frame.clientWidth;
      const vh = frame.clientHeight;
      const scale = Math.min(vw / STAGE_W, vh / STAGE_H) * zoom;
      const mapFrame = {
        x: (vw - STAGE_W * scale) / 2,
        y: (vh - STAGE_H * scale) / 2,
        scale,
      };
      if (targetId === "map" || targetId === "device-frame") return mapFrame;
      const el = frame.querySelector<HTMLElement>(`#${CSS.escape(targetId)}`);
      if (!el || !stageRef.current) return mapFrame;
      const local = localInStage(el);
      return {
        x: vw / 2 - local.x * scale,
        y: vh / 2 - local.y * scale,
        scale,
      };
    },
    [localInStage],
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
    const jumped = demoScript.slice(0, i + 1).map((s) => ("advance" in s ? s.advance : undefined));
    const nextPhase = phaseAfter(jumped);
    const nextShell = reduceMotion ? "desktop" : shellAfter(jumped);
    setPhase(nextPhase);
    setShell(nextShell);
    setWeeklyBoost(nextPhase === "applied" || nextPhase === "onTrack" ? FIX_SAVE : 0);
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

  useLayoutEffect(() => {
    if (!desktop) return;
    const next = frameCamera("map", 1);
    camRef.current = next;
    setCam(next);
  }, [desktop, frameCamera, box.w, box.h]);

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
      const next = frameCamera(s.target, s.zoom);
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
      const startAt = reduceMotion ? 4 : 0;
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
          const destCam = frameCameraRef.current(s.target, s.zoom);

          if (!reduceMotion) {
            if ("hover" in s && s.hover) setHoverId(s.cursor);
            else setHoverId(null);
            if (jumped) {
              setCam(destCam);
              setCursor(cursorForRef.current(s.cursor, destCam));
            } else {
              setCursor(cursorForRef.current(s.cursor, camRef.current));
              await wait(cursorLeadMs);
              if (cancelled || skipRef.current !== null) continue;
              setCam(destCam);
              setCursor(cursorForRef.current(s.cursor, destCam));
              await wait(s.id === "morph" ? 400 : 420);
              if (cancelled || skipRef.current !== null) continue;
            }
          } else {
            setCam(frameCameraRef.current("map", 1));
            setHoverId("hover" in s && s.hover ? s.cursor : null);
          }

          if ("click" in s && s.click) {
            await wait(clickDelayMs);
            if (cancelled || skipRef.current !== null) continue;
            playClickRef.current();
          }
          if ("advance" in s) dispatchRef.current(s.advance);
          await wait(s.hold);
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
    const dest = frameCamera(demoScript[i].target, demoScript[i].zoom);
    setCam(reduceMotion ? frameCamera("map", 1) : dest);
    setCursor(cursorFor(demoScript[i].cursor, dest));
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
              ? { width: box.w, height: box.h, left: 0, top: 0, borderRadius: 28, padding: 0 }
              : {
                  width: PHONE.w,
                  height: PHONE.h,
                  left: phoneLeft,
                  top: phoneTop,
                  borderRadius: 46,
                  padding: 10,
                }
          }
          transition={reduceMotion ? { duration: 0 } : morphTween}
          style={{
            background: desktop ? "#fafafa" : "#111",
            boxShadow: desktop ? "0 20px 50px rgba(0,0,0,0.12)" : "0 30px 80px rgba(0,0,0,0.28)",
          }}
        >
          {!desktop ? (
            <div className="absolute left-1/2 top-2.5 z-30 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
          ) : null}

          <div
            ref={screenRef}
            className={`relative h-full w-full overflow-hidden ${desktop ? "rounded-[28px]" : "rounded-[36px]"}`}
          >
            <AnimatePresence mode="wait">
              {shell === "lock" ? (
                <motion.div
                  key="lock"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <PhoneLock hovered={hoverId === "knodle-notif"} />
                </motion.div>
              ) : shell === "app" ? (
                <motion.div
                  key="app"
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <DemoPhoneMap />
                </motion.div>
              ) : (
                <motion.div
                  key="desktop"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <motion.div
                    ref={stageRef}
                    className="absolute left-0 top-0 will-change-transform"
                    animate={reduceMotion ? frameCamera("map", 1) : cam}
                    transition={reduceMotion ? { duration: 0 } : cameraSpring}
                    style={{ transformOrigin: "0 0" }}
                  >
                    <DemoProduct phase={phase} hoverId={hoverId} weeklyBoost={weeklyBoost} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {!reduceMotion ? (
          <motion.div
            className="pointer-events-none absolute left-0 top-0 z-40"
            animate={{ x: cursor.x, y: cursor.y, scale: clicking ? 0.9 : 1 }}
            transition={clicking ? clickScale : cursorSpring}
            style={{ marginLeft: -3, marginTop: -2 }}
          >
            <CursorSvg />
            <AnimatePresence>
              {ripple > 0 ? (
                <motion.span
                  key={ripple}
                  className="absolute left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black/40"
                  initial={{ scale: 0.3, opacity: 0.55 }}
                  animate={{ scale: 2.2, opacity: 0 }}
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
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.5 3.2 19 12.1l-6.4 1.4 2.6 6.3-2.7 1.1-2.6-6.4L4.5 3.2Z"
        fill="#111"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
