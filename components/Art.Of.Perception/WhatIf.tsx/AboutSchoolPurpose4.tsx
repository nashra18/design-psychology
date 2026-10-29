"use client";
// npm i framer-motion gsap
// Usage: import AboutschoolPurpose4 from "@/components/AboutschoolPurpose4";  <AboutschoolPurpose4 />
//
// FIVE BRAND-NEW SCENES. One motion idea each, all of them from a school's own world.
// 1 Chalk    a chalkboard: the sentence is drawn in chalk outline, then fills in, doodles follow
// 2 Blocks   alphabet blocks drop from the sky, bounce, and stack into a sentence
// 3 Traits   five rows of giant words scroll in opposite directions; hover to slow them and read
// 4 Drum     a 3D picker drum rolls through "This year, I will ..." with a click for each word
// 5 Paint    a canvas of living paint: move to paint, or let it paint by itself
//
// Note: uses `rotation` (not `rotate`) everywhere, so GSAP does not warn on revert.

import { useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import gsap from "gsap";
import { Caveat_Brush, Lilita_One, Archivo_Black, Outfit, Bowlby_One, Inter } from "next/font/google";

const caveat = Caveat_Brush({ subsets: ["latin"], weight: "400", display: "swap" });
const lilita = Lilita_One({ subsets: ["latin"], weight: "400", display: "swap" });
const archivo = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], weight: ["800"], display: "swap" });
const bowlby = Bowlby_One({ subsets: ["latin"], weight: "400", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const SCHOOL = "Mukul Academy";
const DURATION = 11000;
const INTRO_DELAY = 0.45;
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

type Gsap = typeof gsap;
type TL = gsap.core.Timeline;

interface Slide {
  name: string;
  ink: string;
  C: () => ReactNode;
  enter: TargetAndTransition;
  to: TargetAndTransition;
}

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useGsap(ref: RefObject<HTMLElement | null>, build: (tl: TL, g: Gsap) => void): void {
  useEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => build(gsap.timeline({ delay: INTRO_DELAY }), gsap), ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* =========================================================
   1. CHALK   Caveat Brush, board green + chalk white + chalk yellow
   Motion: the headline is not faded in, it is DRAWN. Each letter outline is
   traced, then the chalk fills in. A wobbly underline and a star follow.
   ========================================================= */
const CHALK = "#F3F0E6";
const YELLOW = "#FFD95A";
const PINK = "#FF9EB5";

function Chalk() {
  const r = useRef<HTMLDivElement>(null);
  useGsap(r, (tl, g) => {
    tl.fromTo(".c1", { strokeDashoffset: 1400, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 2.2, ease: "power1.inOut" }, 0)
      .to(".c1", { fillOpacity: 0.95, duration: 0.9 }, 1.9)
      .fromTo(".c2", { strokeDashoffset: 1400, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 2.2, ease: "power1.inOut" }, 1.4)
      .to(".c2", { fillOpacity: 0.95, duration: 0.9 }, 3.3)
      .fromTo(".ul", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: "power2.out" }, 4.1)
      .fromTo(".star", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power1.inOut" }, 4.7)
      .fromTo(".sp", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: "power1.out", stagger: 0.12 }, 5.5);
    g.to(".star", { rotation: 14, svgOrigin: "1060 140", yoyo: true, repeat: -1, duration: 1.4, ease: "sine.inOut", delay: 6.2 });
  });
  const line = { pathLength: 1, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style: { strokeDasharray: 1 } };
  return (
    <div ref={r} className="relative h-full w-full overflow-hidden bg-[#123D33]">
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.09), transparent 60%)" }} />
      <svg viewBox="0 0 1200 700" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Write your own story.">
        <defs>
          <filter id="chalk" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={3.2} />
          </filter>
        </defs>
        <g filter="url(#chalk)">
          <text className={`${caveat.className} c1`} x="70" y="330" fontSize="230" fill={CHALK} stroke={CHALK} strokeWidth="2.5" strokeLinejoin="round" style={{ strokeDasharray: 1400 }}>
            Write your
          </text>
          <text className={`${caveat.className} c2`} x="200" y="560" fontSize="230" fill={CHALK} stroke={CHALK} strokeWidth="2.5" strokeLinejoin="round" style={{ strokeDasharray: 1400 }}>
            own story.
          </text>
          <path className="ul" d="M210 612 C 420 648, 700 586, 1060 624" stroke={YELLOW} strokeWidth="7" {...line} />
          <path className="star" d="M1060 78 L1076 120 L1120 122 L1086 150 L1098 192 L1060 168 L1022 192 L1034 150 L1000 122 L1044 120 Z" stroke={PINK} strokeWidth="6" {...line} />
          <path className="sp" d="M900 90 L900 128" stroke={YELLOW} strokeWidth="5" {...line} />
          <path className="sp" d="M881 109 L919 109" stroke={YELLOW} strokeWidth="5" {...line} />
          <path className="sp" d="M150 110 L150 140 M135 125 L165 125" stroke={PINK} strokeWidth="5" {...line} />
        </g>
      </svg>
    </div>
  );
}

/* =========================================================
   2. BLOCKS   Lilita One, midnight navy + toy colours
   Motion: every letter is an alphabet block. They fall from above in random
   order, bounce, settle slightly crooked, hold, then drop away. Loops.
   ========================================================= */
const BLOCK_LINES = ["Build it.", "Break it.", "Try again."];
const TOYS = ["#FF5A36", "#FFC21A", "#2F6BFF", "#18B67A", "#FF7AC8", "#8A5CFF"];

function Blocks() {
  const r = useRef<HTMLDivElement>(null);
  useGsap(r, (tl, g) => {
    tl.kill();
    const H = () => window.innerHeight * 1.15;
    g.timeline({ delay: INTRO_DELAY, repeat: -1, repeatDelay: 0.3 })
      .fromTo(
        ".tile",
        { y: () => -H(), rotation: (i: number) => ((i % 5) - 2) * 22 },
        {
          y: 0,
          rotation: (i: number) => ((i % 3) - 1) * 2.5,
          duration: 1.15,
          ease: "bounce.out",
          stagger: { each: 0.07, from: "random" },
        },
        0
      )
      .to(".tile", { y: () => H(), rotation: (i: number) => ((i % 5) - 2) * 18, duration: 0.7, ease: "power3.in", stagger: { each: 0.03, from: "edges" } }, "+=3.4");
  });
  let n = 0;
  return (
    <div ref={r} className={`${lilita.className} relative flex h-full w-full flex-col items-center justify-center gap-[1.4vmin] overflow-hidden bg-[#101426] px-4`}>
      {BLOCK_LINES.map((line) => (
        <div key={line} className="flex items-center gap-[0.8vmin]">
          {line.split("").map((ch, ci) =>
            ch === " " ? (
              <span key={ci} className="block w-[3.6vmin]" />
            ) : (
              <span
                key={ci}
                className="tile flex items-center justify-center rounded-[14%] text-[#101426]"
                style={{
                  width: "clamp(1.9rem,8.2vw,7.6rem)",
                  height: "clamp(1.9rem,8.2vw,7.6rem)",
                  fontSize: "clamp(1.3rem,5.4vw,5rem)",
                  background: TOYS[n++ % TOYS.length],
                  boxShadow: "inset 0 -0.14em 0 rgba(0,0,0,0.2), inset 0 0.08em 0 rgba(255,255,255,0.35)",
                }}
              >
                {ch}
              </span>
            )
          )}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   3. TRAITS   Archivo Black, electric violet + lemon + white outline
   Motion: five rows of giant words slide in alternating directions at
   different speeds. Hover (or touch) slows everything so you can read.
   ========================================================= */
const ROWS = [
  { w: "Curious", dir: 1, d: 34, solid: false },
  { w: "Brave", dir: -1, d: 28, solid: true },
  { w: "Kind", dir: 1, d: 40, solid: false },
  { w: "Honest", dir: -1, d: 31, solid: true },
  { w: "Hungry", dir: 1, d: 36, solid: false },
];

function Traits() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReduced()) return;
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".row", el);
      const tweens = rows.map((row, i) =>
        gsap.fromTo(
          row,
          { xPercent: ROWS[i].dir > 0 ? 0 : -50 },
          { xPercent: ROWS[i].dir > 0 ? -50 : 0, duration: ROWS[i].d, repeat: -1, ease: "none" }
        )
      );
      gsap.from(".rowwrap", { opacity: 0, y: 40, duration: 1, ease: "power3.out", stagger: 0.1, delay: INTRO_DELAY });
      gsap.from(".lead", { opacity: 0, duration: 1, delay: 1.2 });
      const slow = () => gsap.to(tweens, { timeScale: 0.12, duration: 0.6, overwrite: true });
      const fast = () => gsap.to(tweens, { timeScale: 1, duration: 0.8, overwrite: true });
      el.addEventListener("pointerenter", slow);
      el.addEventListener("pointerleave", fast);
      return () => {
        el.removeEventListener("pointerenter", slow);
        el.removeEventListener("pointerleave", fast);
      };
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={root} className={`${archivo.className} relative flex h-full w-full flex-col justify-center overflow-hidden bg-[#5B2EFF] py-24`}>
      <p className={`${inter.className} lead absolute left-6 top-24 z-10 text-sm text-white/80 md:left-14`}>Who we are raising.</p>
      {ROWS.map((row) => (
        <div key={row.w} className="rowwrap overflow-hidden">
          <div className="row flex w-max will-change-transform text-[clamp(3rem,13svh,9rem)] leading-[1.02]">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {Array.from({ length: 6 }, (_, j) => (
                  <span key={j} className="flex items-center">
                    <span className={row.solid ? "text-[#E8FF59]" : "text-transparent [-webkit-text-stroke:2px_#fff]"}>{row.w}</span>
                    <span className="mx-[0.35em] h-[0.2em] w-[0.2em] rounded-full bg-white" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   4. DRUM   Outfit, sunshine yellow + ink
   Motion: a real 3D cylinder. It rolls one notch at a time through six
   promises, each notch a quick ease-in-out like a combination lock.
   ========================================================= */
const DRUM = ["ask why.", "try again.", "share first.", "read more.", "help someone.", "make things."];
const STEP = 360 / DRUM.length;

function Drum() {
  const r = useRef<HTMLDivElement>(null);
  useGsap(r, (tl, g) => {
    tl.from(".dw", { opacity: 0, y: 30, duration: 1, ease: "power3.out" }, 0).from(".lead", { opacity: 0, x: -30, duration: 1, ease: "power3.out" }, 0);
    const spin = g.timeline({ delay: INTRO_DELAY + 1.4, repeat: -1 });
    spin.set(".drum", { rotationX: 0 }, 0);
    DRUM.forEach((_, k) => {
      spin.to(".drum", { rotationX: -STEP * (k + 1), duration: 0.9, ease: "power4.inOut" }, 0.6 + k * 1.5);
    });
    spin.to({}, { duration: 0.6 });
  });
  const mask = "linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%)";
  return (
    <div ref={r} className={`${outfit.className} relative flex h-full w-full flex-col justify-center overflow-hidden bg-[#FFD23F] px-6 text-[#161616] md:px-14`}>
      <div className="text-[clamp(2.2rem,8vw,8rem)] leading-[1.15] tracking-[-0.035em]">
        <p className="lead">This year, I will</p>
        <div className="dw relative h-[3.6em]" style={{ perspective: "1300px", maskImage: mask, WebkitMaskImage: mask }}>
          <div className="absolute inset-x-0 top-1/2 h-[1.15em] -translate-y-1/2 border-y-[5px] border-[#161616]" aria-hidden />
          <div className="absolute inset-x-0 top-1/2 h-[1.15em] -translate-y-1/2">
            <div className="drum relative h-full w-full [transform-style:preserve-3d]">
              {DRUM.map((w, i) => (
                <span
                  key={w}
                  className="absolute inset-0 flex items-center whitespace-nowrap [backface-visibility:hidden]"
                  style={{ transform: `rotateX(${i * STEP}deg) translateZ(1em)` }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   5. PAINT   Bowlby One, near-black canvas + living colour
   Motion: a canvas of paint. Move the pointer to paint; leave it alone and a
   brush paints a looping figure-eight by itself. The title inverts over paint.
   ========================================================= */
function Paint() {
  const root = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = root.current;
    const c = cv.current;
    if (!el || !c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const BG = "14,14,19";
    let w = 0;
    let h = 0;
    const size = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = `rgb(${BG})`;
      ctx.fillRect(0, 0, w, h);
    };
    size();
    if (prefersReduced()) return;

    const pos = { x: w / 2, y: h / 2 };
    let last = { x: w / 2, y: h / 2 };
    let lastMove = -1e9;
    let wasIdle = true;
    let hue = 20;
    let raf = 0;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      pos.x = e.clientX - b.left;
      pos.y = e.clientY - b.top;
      lastMove = performance.now();
    };
    const frame = (now: number) => {
      ctx.fillStyle = `rgba(${BG},0.035)`;
      ctx.fillRect(0, 0, w, h);
      const idle = now - lastMove > 1800;
      let x: number;
      let y: number;
      if (idle) {
        const t = (now - t0) / 1000;
        x = w / 2 + Math.sin(t * 0.9) * w * 0.36;
        y = h / 2 + Math.sin(t * 1.37 + 1) * h * 0.3;
      } else {
        x = pos.x;
        y = pos.y;
      }
      if (idle !== wasIdle) {
        last = { x, y };
        wasIdle = idle;
      }
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.ceil(dist / 6));
      const rad = Math.min(46, 14 + dist * 0.9);
      for (let i = 0; i < steps; i++) {
        const k = (i + 1) / steps;
        hue = (hue + 0.6) % 360;
        ctx.fillStyle = `hsl(${hue} 95% 62%)`;
        ctx.beginPath();
        ctx.arc(last.x + dx * k, last.y + dy * k, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      last = { x, y };
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    el.addEventListener("pointermove", onMove);
    window.addEventListener("resize", size);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", size);
    };
  }, []);

  return (
    <div ref={root} className={`${bowlby.className} relative h-full w-full touch-none overflow-hidden bg-[#0E0E13]`}>
      <canvas ref={cv} className="absolute inset-0 h-full w-full" aria-hidden />
      <h2 className="pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2 text-[clamp(4rem,17vw,17rem)] leading-[0.86] tracking-[-0.03em] text-white mix-blend-difference md:inset-x-14">
        <span className="block">Leave</span>
        <span className="block pl-[6vw]">your</span>
        <span className="block pl-[12vw]">mark.</span>
      </h2>
    </div>
  );
}

/* ---------- shell ---------- */
const SLIDES: Slide[] = [
  { name: "Chalk", ink: "#F3F0E6", C: Chalk, enter: { clipPath: "inset(0 0 100% 0)" }, to: { clipPath: "inset(0 0 0% 0)" } },
  { name: "Blocks", ink: "#FFFFFF", C: Blocks, enter: { clipPath: "inset(100% 0 0 0)" }, to: { clipPath: "inset(0% 0 0 0)" } },
  { name: "Traits", ink: "#FFFFFF", C: Traits, enter: { clipPath: "inset(0 100% 0 0)" }, to: { clipPath: "inset(0 0% 0 0)" } },
  { name: "Drum", ink: "#161616", C: Drum, enter: { clipPath: "circle(0% at 86% 14%)" }, to: { clipPath: "circle(150% at 86% 14%)" } },
  { name: "Paint", ink: "#FFFFFF", C: Paint, enter: { clipPath: "inset(0 50% 0 50%)" }, to: { clipPath: "inset(0 0% 0 0%)" } },
];

export default function AboutschoolPurpose4() {
  const [i, setI] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!playing || reduce) return;
    const t = setTimeout(() => setI((v) => (v + 1) % SLIDES.length), DURATION);
    return () => clearTimeout(t);
  }, [i, playing, reduce]);

  const { C, enter, to, ink } = SLIDES[i];
  const go = (n: number) => setI((n + SLIDES.length) % SLIDES.length);
  const chrome = `${inter.className} transition-colors duration-700`;

  return (
    <section aria-label="Our school purpose" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black">
      <style>{`@keyframes spfill{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>

      <div className="absolute inset-0 z-10">
        <AnimatePresence initial={false}>
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : enter}
            animate={reduce ? { opacity: 1 } : to}
            exit={{ opacity: 0.99, transition: { duration: 1.1 } }}
            transition={{ duration: 1, ease: EASE }}
          >
            <C />
          </motion.div>
        </AnimatePresence>
      </div>

      <header className={`${chrome} pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 pt-6 md:px-14`} style={{ color: ink }}>
        <span className="text-[15px] font-medium tracking-tight">{SCHOOL}</span>
        <span className="text-[13px] tabular-nums opacity-70">{i + 1} / {SLIDES.length}</span>
      </header>

      <nav aria-label="Design switcher" className={`${chrome} absolute inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 px-6 pb-5 md:px-14`} style={{ color: ink }}>
        <div className="flex items-center gap-1">
          {SLIDES.map((s, n) => (
            <button type="button" key={s.name} onClick={() => go(n)} aria-label={`Show ${s.name}`} aria-current={n === i} className="group py-3 outline-none">
              <span className={`relative block h-[2px] overflow-hidden bg-[color-mix(in_srgb,currentColor_25%,transparent)] transition-all duration-500 ${n === i ? "w-14 md:w-20" : "w-6 group-hover:w-10"}`}>
                {n === i && (
                  <span
                    key={`${i}-${playing}`}
                    className="absolute inset-0 origin-left bg-current"
                    style={reduce || !playing ? undefined : { animation: `spfill ${DURATION}ms linear forwards` }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-5 text-[13px]">
          <button type="button" onClick={() => setPlaying((p) => !p)} className="opacity-70 outline-none hover:opacity-100 focus-visible:underline">{playing ? "Pause" : "Play"}</button>
          <button type="button" onClick={() => go(i - 1)} className="opacity-70 outline-none hover:opacity-100 focus-visible:underline">Prev</button>
          <button type="button" onClick={() => go(i + 1)} className="outline-none hover:opacity-70 focus-visible:underline">Next</button>
        </div>
      </nav>
    </section>
  );
}