"use client";
// npm i framer-motion gsap
// Usage: import SchoolPurposeShowcase from "@/components/SchoolPurposeShowcase";  <SchoolPurposeShowcase />
//
// FIVE MINIMAL SCENES, FIVE IDEAS, FIVE TEXT ANIMATIONS
// 1 Ask        curiosity   letters flip up from the baseline while the weight swells 200 -> 800
// 2 Keep       character   a variable-width face hardens from wide and light to narrow and black
// 3 Grow       growth      words fill in from outline to solid, a single line plant draws itself
// 4 Daily      habit       every letter rolls like an odometer before it settles
// 5 Kind       kindness    the words are only readable where the light is: you carry the light

import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode, RefObject, PointerEvent as RPointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import gsap from "gsap";
import { Bricolage_Grotesque, Archivo, Instrument_Serif, Sora, Fraunces, Inter } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });
const sora = Sora({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["italic"], axes: ["opsz", "SOFT"], display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const SCHOOL = "Mukul Academy";
const DURATION = 9000;
const INTRO_DELAY = 0.45; // lets the reveal curtain open before text starts
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

/* ---------- helpers ---------- */
const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useGsap(ref: RefObject<HTMLElement | null>, build: (tl: TL, g: Gsap) => void): void {
  useEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => build(gsap.timeline({ delay: INTRO_DELAY }), gsap), ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** words stay real words (they wrap), letters inside are animatable */
function Chars({ text, cls = () => "" }: { text: string; cls?: (ch: string) => string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {w.split("").map((ch, ci) => (
              <span key={ci} className={`ch inline-block ${cls(ch)}`}>{ch}</span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

function Words({ text, cls = "" }: { text: string; cls?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className={`w inline-block ${cls}`}>{w}</span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

const dp = (cls: string) => ({ pathLength: 1, className: cls, style: { strokeDasharray: 1 } as CSSProperties });

/* =========================================================
   1. ASK   Bricolage Grotesque
   Idea: a question dropped in still water, the ripples never stop.
   Type: letters flip up from the baseline while the weight swells.
   ========================================================= */
function Ask() {
  const r = useRef<HTMLDivElement>(null);
  useGsap(r, (tl, g) => {
    tl.fromTo(
      ".ch",
      { opacity: 0, rotateX: -100, y: "0.35em", transformPerspective: 700, fontVariationSettings: "'wght' 200" },
      { opacity: 1, rotateX: 0, y: 0, fontVariationSettings: "'wght' 800", duration: 1.3, ease: "expo.out", stagger: 0.022 },
      0
    ).from(".drop", { scale: 0, duration: 0.8, ease: "back.out(3)" }, 0.9);
    g.fromTo(
      ".ring",
      { scale: 0.04, opacity: 0.9 },
      { scale: 1, opacity: 0, duration: 6, ease: "power1.out", repeat: -1, stagger: 1.5, delay: INTRO_DELAY + 1.1, immediateRender: false }
    );
  });
  return (
    <div ref={r} className={`${bricolage.className} relative h-full w-full overflow-hidden bg-[#ECE7FA] text-[#16113D]`}>
      <svg className="absolute right-[-10vw] top-1/2 w-[min(76vw,820px)] -translate-y-1/2" viewBox="0 0 600 600" aria-hidden>
        {[0, 1, 2, 3].map((k) => (
          <circle key={k} className="ring opacity-0" cx="300" cy="300" r="290" fill="none" stroke="#16113D" strokeWidth="1.5" />
        ))}
        <circle className="drop" cx="300" cy="300" r="15" fill="#FF5B2E" />
      </svg>
      <h2 className="absolute bottom-24 left-6 text-[clamp(2.8rem,8.8vw,9.4rem)] leading-[0.92] tracking-[-0.045em] md:left-14">
        <span className="block"><Chars text="We teach children" /></span>
        <span className="block"><Chars text="to ask better" /></span>
        <span className="block"><Chars text="questions?" cls={(c) => (c === "?" ? "text-[#FF5B2E]" : "")} /></span>
      </h2>
    </div>
  );
}

/* =========================================================
   2. KEEP   Archivo (variable width)
   Idea: marks drift away and fade; what is built stays, and gets stronger.
   Type: wide + light letters harden into narrow + black, from the centre out.
   ========================================================= */
const MARKS: [string, number, number, number][] = [
  ["92", 58, 6, 2.4], ["A+", 84, 14, 3.4], ["78%", 70, 30, 1.7], ["B", 90, 40, 4.2],
  ["85", 54, 46, 2.7], ["61", 78, 56, 1.8], ["D", 64, 66, 3.4], ["99", 92, 76, 2.3],
];

function Keep() {
  const r = useRef<HTMLDivElement>(null);
  useGsap(r, (tl) => {
    tl.from(".mk", { opacity: 0, y: 10, duration: 0.7, stagger: 0.06 }, 0)
      .to(".mk", { opacity: 0.05, y: -18, duration: 2.6, stagger: 0.12, ease: "power1.inOut" }, 1.2)
      .fromTo(".l1 .ch", { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.03 }, 0.1)
      .to(".l1 .ch", { opacity: 0.14, fontVariationSettings: "'wdth' 100, 'wght' 100", duration: 2.4, ease: "power2.inOut", stagger: 0.04 }, 1.1)
      .fromTo(
        ".l2 .ch",
        { opacity: 0, fontVariationSettings: "'wdth' 100, 'wght' 100" },
        { opacity: 1, fontVariationSettings: "'wdth' 62, 'wght' 900", duration: 1.6, ease: "power3.inOut", stagger: { each: 0.05, from: "center" } },
        0.8
      )
      .from(".rule", { scaleX: 0, duration: 1.2, ease: "expo.inOut" }, 2.1)
      .from(".sub", { opacity: 0, y: 12, duration: 0.8 }, 2.5);
  });
  return (
    <div ref={r} className={`${archivo.className} relative h-full w-full overflow-hidden bg-[#0D1B17] text-[#EDEAE0]`}>
      <div className="absolute inset-x-0 top-16 h-[58%]" aria-hidden>
        {MARKS.map(([t, l, tp, s]) => (
          <span key={t} className="mk absolute font-medium" style={{ left: `${l}%`, top: `${tp}%`, fontSize: `${s}rem` }}>{t}</span>
        ))}
      </div>
      <div className="absolute bottom-24 left-6 w-fit md:left-14">
        <h2 className="text-[clamp(2.8rem,10vw,10.5rem)] leading-[0.88] tracking-[-0.02em]">
          <span className="l1 block"><Chars text="Marks fade." /></span>
          <span className="l2 block text-[#D4FF4F]"><Chars text="Character stays." /></span>
        </h2>
        <div className="rule mt-5 h-[3px] w-full origin-left bg-[#D4FF4F]" />
        <p className="sub mt-5 text-base text-[#EDEAE0]/70 md:text-lg">We grade the work. We grow the person.</p>
      </div>
    </div>
  );
}

/* =========================================================
   3. GROW   Instrument Serif
   Idea: one line drawn from the ground up, under a sun that rises with it.
   Type: each word starts as an outline and fills in, like it is absorbing light.
   ========================================================= */
const LEAF = "M0 0C16-26 56-30 84-10C64 16 28 22 0 0Z";
const VEIN = "M4 0C28-6 52-10 80-10";
const LEAVES: { x: number; y: number; r: number; s: number; f: boolean }[] = [
  { x: 130, y: 472, r: 28, s: 1, f: false },
  { x: 130, y: 440, r: 24, s: 1, f: true },
  { x: 130, y: 406, r: 32, s: 0.95, f: false },
  { x: 130, y: 373, r: 28, s: 0.95, f: true },
  { x: 130, y: 340, r: 34, s: 0.9, f: false },
  { x: 130, y: 308, r: 30, s: 0.88, f: true },
  { x: 130, y: 278, r: 36, s: 0.8, f: false },
  { x: 134, y: 214, r: 40, s: 0.62, f: true },
  { x: 146, y: 160, r: 72, s: 1.0, f: false },
];

function Grow() {
  const r = useRef<HTMLDivElement>(null);
  useGsap(r, (tl) => {
    tl.fromTo(
      ".w",
      { color: "rgba(23,54,31,0)", y: 14 },
      { color: "rgba(23,54,31,1)", y: 0, duration: 1, ease: "power2.out", stagger: 0.11 },
      0
    )
      .from(".sun", { y: 50, opacity: 0, duration: 2.2, ease: "power3.out" }, 0.2)
      .fromTo(".stem", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: "power1.inOut" }, 0.4)
      .fromTo(".lf", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.out", stagger: 0.07 }, 1)
      .fromTo(".ground", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" }, 0);
  });
  return (
    <div ref={r} className="relative grid h-full w-full grid-rows-[auto_1fr] overflow-hidden bg-[#DCE8D2] px-6 pb-24 pt-24 text-[#17361F] md:grid-cols-[1.35fr_1fr] md:grid-rows-1 md:items-center md:px-14 md:pt-10">
      <h2 className={`${instrument.className} text-[clamp(2.4rem,5.6vw,6rem)] leading-[1.02] tracking-[-0.02em] [-webkit-text-stroke:0.8px_#17361F]`}>
        <span className="text-transparent"><Words text="Every child is a seed. Our job is light, patience and room to grow." /></span>
      </h2>
      <svg className="mx-auto h-full max-h-[620px] w-auto md:justify-self-end" viewBox="0 0 260 520" aria-hidden>
        <circle className="sun" cx="130" cy="200" r="118" fill="#F4DE8A" />
        <path {...dp("ground")} d="M20 500H240" fill="none" stroke="#17361F" strokeWidth="2.5" strokeLinecap="round" />
        <path {...dp("stem")} d="M130 498V260C130 222 138 190 146 160" fill="none" stroke="#17361F" strokeWidth="3" strokeLinecap="round" />
        {LEAVES.map((l, k) => (
          <g key={k} transform={`translate(${l.x} ${l.y}) ${l.f ? "scale(-1 1)" : ""} rotate(${-l.r}) scale(${l.s})`}>
            <path {...dp("lf")} d={LEAF} fill="none" stroke="#17361F" strokeWidth="2.4" strokeLinejoin="round" />
            <path {...dp("lf")} d={VEIN} fill="none" stroke="#17361F" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* =========================================================
   4. DAILY   Sora
   Idea: a sun that comes back up every day. Showing up is the whole method.
   Type: every letter is a reel of other letters that rolls to a stop.
   ========================================================= */
const POOL = "abcdefghijklmnopqrstuvwxyz";
const REEL = 6;

function Roll({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {w.split("").map((ch, ci) => {
              const isLetter = /[a-z]/i.test(ch);
              const stack = Array.from({ length: REEL - 1 }, (_, k) => {
                if (!isLetter) return ch;
                const c = POOL[(wi * 7 + ci * 5 + k * 11) % 26];
                return ch === ch.toUpperCase() ? c.toUpperCase() : c;
              }).concat(ch);
              return (
                <span key={ci} className="relative inline-block h-[1.15em] overflow-hidden align-top">
                  <span className="invisible block leading-[1.15em]">{ch}</span>
                  <span className="reel absolute left-0 top-0 flex flex-col">
                    {stack.map((c, k) => (
                      <span key={k} className="block h-[1.15em] leading-[1.15em]">{c}</span>
                    ))}
                  </span>
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

function Daily() {
  const r = useRef<HTMLDivElement>(null);
  useGsap(r, (tl) => {
    tl.fromTo(".reel", { yPercent: 0 }, { yPercent: -((REEL - 1) / REEL) * 100, duration: 1.7, ease: "power4.out", stagger: 0.035 }, 0)
      .from(".sun", { y: 170, duration: 2, ease: "power3.out" }, 0.2)
      .fromTo(".ray", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.out", stagger: 0.05 }, 1.5)
      .from(".horizon", { scaleX: 0, duration: 1.2, ease: "expo.inOut", transformOrigin: "0% 50%" }, 0);
  });
  const rays = Array.from({ length: 14 }, (_, k) => {
    const a = (Math.PI * (k + 0.5)) / 14 + Math.PI;
    const p = (rad: number) => `${(200 + Math.cos(a) * rad).toFixed(1)} ${(200 + Math.sin(a) * rad).toFixed(1)}`;
    return `M${p(150)}L${p(190)}`;
  });
  return (
    <div ref={r} className={`${sora.className} relative h-full w-full overflow-hidden bg-[#E9ECEF] text-[#0B0B0F]`}>
      <h2 className="absolute left-6 top-[20%] text-[clamp(2.3rem,7.2vw,7.6rem)] font-bold leading-none tracking-[-0.045em] md:left-14">
        <span className="block"><Roll text="Dream big." /></span>
        <span className="block"><Roll text="Start local." /></span>
        <span className="block"><Roll text="Show up daily." /></span>
      </h2>
      <div className="horizon absolute inset-x-0 bottom-20 h-[3px] bg-[#0B0B0F]" />
      <svg className="absolute bottom-20 right-0 w-[min(80vw,640px)] md:right-10" viewBox="0 0 400 200" aria-hidden>
        <path className="sun" d="M70 200A130 130 0 0 1 330 200Z" fill="#FF3D1F" />
        {rays.map((d, k) => (
          <path key={k} {...dp("ray")} d={d} fill="none" stroke="#0B0B0F" strokeWidth="2.5" strokeLinecap="round" />
        ))}
      </svg>
    </div>
  );
}

/* =========================================================
   5. KIND   Fraunces italic
   Idea: kindness is a light you carry. Words are only fully there where it shines.
   Type: a mask follows your pointer (or wanders on its own) and reveals each line.
   ========================================================= */
const KIND_LINES = ["Be kind.", "Be curious.", "Be brave,", "try again."];

function KindText({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center px-6 md:px-14">
      <h2 className="text-[clamp(2.9rem,9.2vw,9.6rem)] leading-[0.96] tracking-[-0.03em]" style={{ color }}>
        {KIND_LINES.map((l) => (
          <span key={l} className="block">{l}</span>
        ))}
      </h2>
    </div>
  );
}

function Kind() {
  const stage = useRef<HTMLDivElement>(null);
  const S = useRef({ x: 0, y: 0, r: 0, tx: 0, ty: 0, w: 1, h: 1, pointer: false, last: 0 });

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const s = S.current;
    const measure = () => {
      const b = el.getBoundingClientRect();
      s.w = b.width;
      s.h = b.height;
    };
    measure();
    s.x = s.tx = s.w * 0.3;
    s.y = s.ty = s.h * 0.5;
    window.addEventListener("resize", measure);

    const apply = () => {
      el.style.setProperty("--mx", `${s.x.toFixed(1)}px`);
      el.style.setProperty("--my", `${s.y.toFixed(1)}px`);
      el.style.setProperty("--r", s.r.toFixed(1));
    };

    if (prefersReduced()) {
      s.r = 9999;
      apply();
      return () => window.removeEventListener("resize", measure);
    }

    const ctx = gsap.context(() => {
      gsap.to(s, { r: 270, duration: 2, ease: "expo.out", delay: INTRO_DELAY + 0.3 });
      gsap.from(".hint", { opacity: 0, duration: 1, delay: 2.5 });
      gsap.to(".hint", { opacity: 0, duration: 1, delay: 8 });
      const tick = (_t: number, dtMs: number) => {
        const dt = Math.min(dtMs, 64) / 1000;
        const now = performance.now();
        if (!s.pointer || now - s.last > 2500) {
          s.tx = s.w * (0.5 + 0.3 * Math.sin(now / 2300));
          s.ty = s.h * (0.5 + 0.24 * Math.sin(now / 1700 + 1));
        }
        const k = 1 - Math.pow(0.0008, dt);
        s.x += (s.tx - s.x) * k;
        s.y += (s.ty - s.y) * k;
        apply();
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    }, stage);

    return () => {
      window.removeEventListener("resize", measure);
      ctx.revert();
    };
  }, []);

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const s = S.current;
    const b = e.currentTarget.getBoundingClientRect();
    s.tx = e.clientX - b.left;
    s.ty = e.clientY - b.top;
    s.pointer = true;
    s.last = performance.now();
  };

  const mask = "radial-gradient(circle calc(var(--r) * 1px) at var(--mx) var(--my), #000 0%, rgba(0,0,0,.9) 35%, transparent 100%)";

  return (
    <div
      ref={stage}
      onPointerMove={onMove}
      className={`${fraunces.className} relative h-full w-full overflow-hidden bg-[#CFE4F6]`}
      style={{ "--mx": "30%", "--my": "50%", "--r": 0 } as CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute h-[52vmin] w-[52vmin] rounded-full bg-[#FF8FA3] opacity-60 blur-3xl"
        style={{ left: "var(--mx)", top: "var(--my)", transform: "translate(-50%,-50%) scale(calc(var(--r) / 270))" }}
      />
      <KindText color="rgba(15,42,85,0.15)" />
      <div aria-hidden style={{ WebkitMaskImage: mask, maskImage: mask }} className="absolute inset-0">
        <KindText color="#0F2A55" />
      </div>
      <p className="hint absolute right-6 top-20 text-sm italic text-[#0F2A55]/70 md:right-14">Move to find the light</p>
    </div>
  );
}

/* ---------- shell ---------- */
const SLIDES: Slide[] = [
  { name: "Ask", ink: "#16113D", C: Ask, enter: { clipPath: "inset(0 0 100% 0)" }, to: { clipPath: "inset(0 0 0% 0)" } },
  { name: "Keep", ink: "#EDEAE0", C: Keep, enter: { clipPath: "inset(0 0 0 100%)" }, to: { clipPath: "inset(0 0 0 0%)" } },
  { name: "Grow", ink: "#17361F", C: Grow, enter: { clipPath: "circle(0% at 18% 82%)" }, to: { clipPath: "circle(150% at 18% 82%)" } },
  { name: "Daily", ink: "#0B0B0F", C: Daily, enter: { clipPath: "inset(100% 0 0 0)" }, to: { clipPath: "inset(0% 0 0 0)" } },
  { name: "Kind", ink: "#0F2A55", C: Kind, enter: { clipPath: "inset(0 50% 0 50%)" }, to: { clipPath: "inset(0 0% 0 0%)" } },
];

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function AboutSchoolPurpose3() {
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

      {/* the old scene stays underneath until the new one has finished opening */}
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

      <div aria-hidden className="pointer-events-none absolute inset-0 z-20 opacity-[0.06]" style={{ backgroundImage: GRAIN }} />

      <header className={`${chrome} pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 pt-6 md:px-14`} style={{ color: ink }}>
        <span className="text-[15px] font-medium tracking-tight">{SCHOOL}</span>
        <span className="text-[13px] tabular-nums opacity-70">{i + 1} / {SLIDES.length}</span>
      </header>

      <nav aria-label="Design switcher" className={`${chrome} absolute inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 px-6 pb-5 md:px-14`} style={{ color: ink }}>
        <div className="flex items-center gap-1">
          {SLIDES.map((s, n) => (
            <button
              type="button"
              key={s.name}
              onClick={() => go(n)}
              aria-label={`Show ${s.name}`}
              aria-current={n === i}
              className="group py-3 outline-none"
            >
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