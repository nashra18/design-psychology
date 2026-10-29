"use client";
// npm i framer-motion gsap
// Usage: import AboutschoolPurpose2 from "@/components/AboutschoolPurpose2";  <AboutschoolPurpose2 />
//
// FIVE SCENES. Each one = ONE motion idea, new words, new fonts, new colours.
// 1 Spotlight  text lives in the dark; a torch finds it (follows mouse, wanders by itself on touch)
// 2 Reel       a slot-machine reel spins and lands on the word "human"
// 3 Weight     a variable-font wave: letters swell heavy / thin in a ripple
// 4 Orbit      two rings of words circle a question, in opposite directions
// 5 Slice      the headline arrives as 7 horizontal strips sliding in and snapping together

import { Fragment, useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import gsap from "gsap";
import {
  Unbounded,
  DM_Serif_Display,
  Bricolage_Grotesque,
  Space_Mono,
  Instrument_Serif,
  Anton,
  Inter,
} from "next/font/google";

const unbounded = Unbounded({ subsets: ["latin"], weight: ["800"], display: "swap" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" }); // variable weight 200-800
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["700"], display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["italic"], display: "swap" });
const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap" });
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

function Chars({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {w.split("").map((ch, ci) => (
              <span key={ci} className="ch inline-block">{ch}</span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/* =========================================================
   1. SPOTLIGHT   Unbounded, black + amber
   The words are always there, but almost invisible. A soft torch
   reveals them. Mouse = you hold the torch. Touch / idle = it wanders.
   Press and hold to widen the beam.
   ========================================================= */
function SpotText({ cls }: { cls: string }) {
  return (
    <div className={`absolute inset-x-6 top-1/2 -translate-y-1/2 md:inset-x-14 ${cls}`}>
      <h2 className="text-[clamp(2.6rem,9.5vw,10rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">
        <span className="block">Learn</span>
        <span className="block pl-[8vw]">by doing,</span>
        <span className="block pl-[16vw]">not by dozing.</span>
      </h2>
    </div>
  );
}

function Spot() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const lit = el.querySelector<HTMLElement>(".lit");
    if (!lit) return;

    const p = { x: el.clientWidth * 0.5, y: el.clientHeight * 0.5, r: 0 };
    const apply = () => {
      const m = `radial-gradient(circle at ${p.x}px ${p.y}px, #000 ${p.r * 0.55}px, transparent ${p.r}px)`;
      lit.style.setProperty("mask-image", m);
      lit.style.setProperty("-webkit-mask-image", m);
    };
    apply();

    if (prefersReduced()) {
      p.r = 20000;
      apply();
      return;
    }

    let wander: gsap.core.Tween | null = null;
    const startWander = () => {
      wander?.kill();
      const w = el.clientWidth;
      const h = el.clientHeight;
      const k = { duration: 2.2, ease: "sine.inOut" };
      wander = gsap.to(p, {
        keyframes: [
          { x: w * 0.2, y: h * 0.38, ...k },
          { x: w * 0.78, y: h * 0.45, ...k },
          { x: w * 0.4, y: h * 0.72, ...k },
          { x: w * 0.7, y: h * 0.68, ...k },
          { x: w * 0.5, y: h * 0.5, ...k },
        ],
        repeat: -1,
        onUpdate: apply,
      });
    };

    const intro = gsap.to(p, {
      r: 300,
      duration: 1.6,
      delay: INTRO_DELAY,
      ease: "power3.out",
      onUpdate: apply,
      onComplete: startWander,
    });

    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      wander?.kill();
      gsap.to(p, { x: e.clientX - b.left, y: e.clientY - b.top, duration: 0.35, ease: "power3.out", overwrite: "auto", onUpdate: apply });
    };
    const onDown = () => gsap.to(p, { r: 520, duration: 0.5, ease: "power3.out", overwrite: "auto", onUpdate: apply });
    const onUp = () => gsap.to(p, { r: 300, duration: 0.6, ease: "power3.out", overwrite: "auto", onUpdate: apply });
    const onLeave = () => {
      if (intro.progress() === 1) startWander();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
      intro.kill();
      wander?.kill();
      gsap.killTweensOf(p);
    };
  }, []);

  return (
    <div ref={root} className={`${unbounded.className} relative h-full w-full touch-none overflow-hidden bg-[#0A0907]`}>
      <SpotText cls="text-[#FFB000]/[0.09]" />
      <div className="lit absolute inset-0">
        <SpotText cls="text-[#FFB000]" />
      </div>
      <p className={`${inter.className} absolute bottom-24 left-6 text-sm text-[#FFB000]/60 md:left-14`}>
        Find the light.
      </p>
    </div>
  );
}

/* =========================================================
   2. REEL   DM Serif Display, cream + ink + tomato
   A slot-machine reel. It spins blurred, brakes, and lands (with a small
   overshoot) on the only word that matters. Then it resets and spins again.
   ========================================================= */
const REEL_WORDS = ["reader", "thinker", "builder", "dreamer", "leader", "friend", "good human."];

function Reel() {
  const r = useRef<HTMLDivElement>(null);
  useGsap(r, (tl, g) => {
    const n = REEL_WORDS.length;
    // intro lines
    tl.fromTo(".rl", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12 }, 0);
    // separate infinite loop (not nested inside tl, so tl keeps a finite duration)
    g.timeline({ delay: INTRO_DELAY + 1.4, repeat: -1, repeatDelay: 0.8 })
      .set(".strip", { yPercent: 0, filter: "blur(0px)" }, 0)
      .set(".ul", { scaleX: 0 }, 0)
      .to(".strip", { yPercent: -((n - 2) / n) * 100, filter: "blur(7px)", duration: 1.9, ease: "power2.in" }, 0.2)
      .to(".strip", { yPercent: -((n - 1) / n) * 100, filter: "blur(0px)", duration: 1.0, ease: "back.out(2.4)" }, ">")
      .to(".ul", { scaleX: 1, duration: 0.7, ease: "expo.out" }, ">-0.35")
      .to({}, { duration: 3.4 }); // hold on the answer
  });
  return (
    <div ref={r} className={`${dmSerif.className} relative flex h-full w-full flex-col justify-center overflow-hidden bg-[#F6EFE3] px-6 text-[#1A1613] md:px-14`}>
      <h2 className="text-[clamp(2.6rem,8.6vw,9rem)] leading-[1.08] tracking-[-0.02em]">
        <span className="rl block">Every day,</span>
        <span className="rl block">we raise a</span>
        <span className="rl relative block">
          <span className="inline-block h-[1.16em] overflow-hidden align-top">
            <span className="strip flex flex-col will-change-transform">
              {REEL_WORDS.map((w, i) => (
                <span
                  key={w}
                  className={`block h-[1.16em] leading-[1.16] ${i === REEL_WORDS.length - 1 ? "italic text-[#E8442B]" : ""}`}
                >
                  {w}
                </span>
              ))}
            </span>
          </span>
          <span className="ul absolute bottom-[0.06em] left-0 h-[0.06em] w-full origin-left bg-[#E8442B]" aria-hidden />
        </span>
      </h2>
    </div>
  );
}

/* =========================================================
   3. WEIGHT   Bricolage Grotesque (variable), lime + black
   One font, one axis. Every letter breathes between hairline and heavy,
   offset by a few milliseconds so it ripples like a flag.
   ========================================================= */
function Weight() {
  const r = useRef<HTMLDivElement>(null);
  useGsap(r, (tl, g) => {
    tl.from(".ch", { yPercent: 115, duration: 0.9, ease: "power4.out", stagger: 0.035 }, 0)
      .fromTo(
        ".ch",
        { fontWeight: 200 },
        { fontWeight: 800, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: { each: 0.09 } },
        0.8
      );
    g.from(".sub", { opacity: 0, duration: 1, delay: INTRO_DELAY + 1.4 });
  });
  return (
    <div ref={r} className={`${bricolage.className} relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#D7FF3A] px-4 text-center text-[#0D0D0D]`}>
      <h2 className="text-[clamp(3.4rem,15vw,15rem)] leading-[0.9] tracking-[-0.045em]" style={{ fontWeight: 200 }}>
        <span className="block overflow-hidden pb-[0.06em]"><Chars text="Stronger" /></span>
        <span className="block overflow-hidden pb-[0.06em]"><Chars text="every day." /></span>
      </h2>
      <p className={`${inter.className} sub mt-6 text-[clamp(0.9rem,1.4vw,1.2rem)]`}>
        Small habits. Heavier every week.
      </p>
    </div>
  );
}

/* =========================================================
   4. ORBIT   Space Mono + Instrument Serif, deep teal + mint + coral
   Two rings of words circle one question. Outer ring turns clockwise,
   inner ring turns the other way. The rings spin in fast and slow to a drift.
   ========================================================= */
function Orbit() {
  const r = useRef<HTMLDivElement>(null);
  useGsap(r, (tl, g) => {
    const origin = "500 500";
    tl.from(".ring1", { rotation: -300, svgOrigin: origin, opacity: 0, duration: 3.2, ease: "power3.out" }, 0)
      .from(".ring2", { rotation: 300, svgOrigin: origin, opacity: 0, duration: 3.2, ease: "power3.out" }, 0.2)
      .from(".core", { scale: 0.2, opacity: 0, svgOrigin: origin, duration: 1.2, ease: "back.out(2)" }, 0.8);
    g.to(".spin1", { rotation: 360, svgOrigin: origin, duration: 60, repeat: -1, ease: "none" });
    g.to(".spin2", { rotation: -360, svgOrigin: origin, duration: 45, repeat: -1, ease: "none" });
  });
  const ring1 = "READ • PLAY • QUESTION • BUILD • SHARE • REPEAT • ";
  const ring2 = "tiny steps • big minds • ".repeat(2);
  return (
    <div ref={r} className="relative h-full w-full overflow-hidden bg-[#06302B]">
      <svg viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <defs>
          <path id="orb1" d="M 120 500 a 380 380 0 1 1 760 0 a 380 380 0 1 1 -760 0" />
          <path id="orb2" d="M 250 500 a 250 250 0 1 1 500 0 a 250 250 0 1 1 -500 0" />
        </defs>
        <circle cx="500" cy="500" r="318" fill="none" stroke="#8CFFD0" strokeOpacity="0.18" strokeDasharray="2 10" />
        <g className="ring1">
          <g className="spin1">
            <text className={spaceMono.className} fontSize="54" fill="#8CFFD0">
              <textPath href="#orb1" {...({ textLength: 2388, lengthAdjust: "spacing" } as object)}>
                {ring1}
              </textPath>
            </text>
          </g>
        </g>
        <g className="ring2">
          <g className="spin2">
            <text className={instrument.className} fontSize="64" fill="#FF7A59">
              <textPath href="#orb2" {...({ textLength: 1570, lengthAdjust: "spacing" } as object)}>
                {ring2}
              </textPath>
            </text>
          </g>
        </g>
        <g className="core">
          <text x="500" y="500" textAnchor="middle" className={instrument.className} fontSize="150" fill="#F2FFF9">Why</text>
          <text x="500" y="620" textAnchor="middle" className={instrument.className} fontSize="150" fill="#F2FFF9">not?</text>
        </g>
      </svg>
    </div>
  );
}

/* =========================================================
   5. SLICE   Anton, indigo + sun yellow
   The headline is cut into 7 horizontal strips. They slide in from alternating
   sides, click together, hold, then slide out the other way. Loops.
   ========================================================= */
const SLICES = 7;

function SliceBlock() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center uppercase">
      <span className="block text-[clamp(4rem,19vw,19rem)] leading-[0.86] tracking-[-0.01em] text-[#F4EEFF]">Together</span>
      <span className="block text-[clamp(4rem,19vw,19rem)] leading-[0.86] tracking-[-0.01em] text-[#FFE14D]">we rise.</span>
    </div>
  );
}

function Slice() {
  const r = useRef<HTMLDivElement>(null);
  useGsap(r, (tl) => {
    tl.repeat(-1).repeatDelay(0.4);
    tl.fromTo(
      ".sl",
      { xPercent: (i: number) => (i % 2 ? 1 : -1) * 115 },
      { xPercent: 0, duration: 1.3, ease: "expo.out", stagger: { each: 0.09, from: "center" } },
      0
    ).to(
      ".sl",
      { xPercent: (i: number) => (i % 2 ? -1 : 1) * 115, duration: 0.9, ease: "expo.in", stagger: { each: 0.06, from: "edges" } },
      4.6
    );
  });
  return (
    <div ref={r} className={`${anton.className} relative h-full w-full overflow-hidden bg-[#1B1464]`}>
      {Array.from({ length: SLICES }, (_, i) => (
        <div
          key={i}
          className="sl absolute inset-0"
          aria-hidden={i > 0}
          style={{ clipPath: `inset(${(i * 100) / SLICES - 0.05}% 0 ${100 - ((i + 1) * 100) / SLICES - 0.05}% 0)` }}
        >
          <SliceBlock />
        </div>
      ))}
    </div>
  );
}

/* ---------- shell ---------- */
const SLIDES: Slide[] = [
  { name: "Spotlight", ink: "#FFB000", C: Spot, enter: { clipPath: "circle(0% at 50% 50%)" }, to: { clipPath: "circle(150% at 50% 50%)" } },
  { name: "Reel", ink: "#1A1613", C: Reel, enter: { clipPath: "inset(0 0 100% 0)" }, to: { clipPath: "inset(0 0 0% 0)" } },
  { name: "Weight", ink: "#0D0D0D", C: Weight, enter: { clipPath: "inset(0 100% 0 0)" }, to: { clipPath: "inset(0 0% 0 0)" } },
  { name: "Orbit", ink: "#8CFFD0", C: Orbit, enter: { clipPath: "circle(0% at 14% 86%)" }, to: { clipPath: "circle(150% at 14% 86%)" } },
  { name: "Slice", ink: "#F4EEFF", C: Slice, enter: { clipPath: "inset(50% 0 50% 0)" }, to: { clipPath: "inset(0% 0 0% 0)" } },
];

export default function AboutschoolPurpose2() {
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