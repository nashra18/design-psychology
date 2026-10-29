"use client";
// npm i framer-motion gsap
// Usage: import SchoolPurposeShowcase from "@/components/SchoolPurposeShowcase";  <SchoolPurposeShowcase />
//
// FIVE SCENES. EACH ONE IS BUILT AROUND ONE MOTION IDEA, NOT AN EFFECT.
// 1 Ask    letters start scattered (a question with no answer) and snap into place; poke them and they scatter again
// 2 Keep   "Marks fade." dissolves into smoke, "Character stays." is stamped down and does not move
// 3 Grow   the sentence is written ALONG a vine that grows out of a seed and ends in a bloom
// 4 Daily  a habit tracker: each line lights up like a highlighter while a dot grid fills day by day
// 5 Kind   a bouncing ball hops word to word, and every word it lands on lights up

import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode, RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import gsap from "gsap";
import { Syne, Bodoni_Moda, Instrument_Serif, Familjen_Grotesk, Fredoka, Inter } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], display: "swap" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "900"], display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["italic"], display: "swap" });
const familjen = Familjen_Grotesk({ subsets: ["latin"], weight: ["500", "700"], display: "swap" });
const fredoka = Fredoka({ subsets: ["latin"], weight: ["600"], display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const SCHOOL = "Mukul Academy";
const DURATION = 11000;
const INTRO_DELAY = 0.45; // lets the reveal curtain open before the scene starts
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

const dashed = (cls: string) => ({ pathLength: 1, className: cls, style: { strokeDasharray: 1 } as CSSProperties });

/* =========================================================
   1. ASK   Syne, cobalt + lilac
   Motion: the letters begin scattered across the screen and spring home.
   Then they react to you: move near them and they get pushed away, then settle back.
   ========================================================= */
function Letters({ text, accent }: { text: string; accent?: string }) {
  return (
    <>
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i} className="inline-block w-[0.28em]">{"\u00A0"}</span>
        ) : (
          <span key={i} className="ch inline-block">
            {ch === accent ? <span className="q inline-block text-[#FFC8F2]">{ch}</span> : ch}
          </span>
        )
      )}
    </>
  );
}

function Ask() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReduced()) return;

    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(".ch", el);
      const vw = el.clientWidth;
      const vh = el.clientHeight;
      let ready = false;
      let centers: { x: number; y: number }[] = [];
      let qx: ReturnType<typeof gsap.quickTo>[] = [];
      let qy: ReturnType<typeof gsap.quickTo>[] = [];
      let qr: ReturnType<typeof gsap.quickTo>[] = [];
      let lensX: ReturnType<typeof gsap.quickTo> | null = null;
      let lensY: ReturnType<typeof gsap.quickTo> | null = null;
      let lensShown = false;

      const measure = () => {
        const rb = el.getBoundingClientRect();
        centers = chars.map((c) => {
          const b = c.getBoundingClientRect();
          return {
            x: b.left - rb.left + b.width / 2 - Number(gsap.getProperty(c, "x")),
            y: b.top - rb.top + b.height / 2 - Number(gsap.getProperty(c, "y")),
          };
        });
      };

      const intro = gsap.timeline({ delay: INTRO_DELAY });
      intro
        .fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.03 }, 0)
        .fromTo(
          chars,
          {
            x: () => gsap.utils.random(-vw * 0.45, vw * 0.45),
            y: () => gsap.utils.random(-vh * 0.5, vh * 0.35),
            rotate: () => gsap.utils.random(-140, 140),
            scale: () => gsap.utils.random(0.4, 2.4),
          },
          { x: 0, y: 0, rotate: 0, scale: 1, duration: 2, ease: "elastic.out(1,0.7)", stagger: 0.03 },
          0
        )
        .from(".small", { opacity: 0, y: 14, duration: 0.9 }, 1)
        .call(() => {
          measure();
          qx = chars.map((c) => gsap.quickTo(c, "x", { duration: 0.9, ease: "power3.out" }));
          qy = chars.map((c) => gsap.quickTo(c, "y", { duration: 0.9, ease: "power3.out" }));
          qr = chars.map((c) => gsap.quickTo(c, "rotate", { duration: 0.9, ease: "power3.out" }));
          ready = true;
        });

      gsap.to(".q", { rotate: 14, yoyo: true, repeat: -1, duration: 1.3, ease: "sine.inOut", transformOrigin: "50% 80%" });
      lensX = gsap.quickTo(".lens", "x", { duration: 0.35, ease: "power3.out" });
      lensY = gsap.quickTo(".lens", "y", { duration: 0.35, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const rb = el.getBoundingClientRect();
        const px = e.clientX - rb.left;
        const py = e.clientY - rb.top;
        if (e.pointerType === "mouse" && lensX && lensY) {
          lensX(px);
          lensY(py);
          if (!lensShown) {
            lensShown = true;
            gsap.to(".lens", { opacity: 1, duration: 0.4 });
          }
        }
        if (!ready) return;
        const R = 180;
        chars.forEach((_, i) => {
          const dx = centers[i].x - px;
          const dy = centers[i].y - py;
          const d = Math.hypot(dx, dy) || 1;
          if (d < R) {
            const f = 1 - d / R;
            qx[i]((dx / d) * f * f * 120);
            qy[i]((dy / d) * f * f * 120);
            qr[i]((dx / R) * f * 60);
          } else {
            qx[i](0);
            qy[i](0);
            qr[i](0);
          }
        });
      };
      const onLeave = () => {
        lensShown = false;
        gsap.to(".lens", { opacity: 0, duration: 0.4 });
        if (!ready) return;
        chars.forEach((_, i) => {
          qx[i](0);
          qy[i](0);
          qr[i](0);
        });
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      window.addEventListener("resize", measure);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("resize", measure);
      };
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={`${syne.className} relative h-full w-full overflow-hidden bg-[#2A2FFF] text-[#F4F1FF]`}>
      <p className={`${inter.className} small absolute left-6 top-28 text-[clamp(1rem,1.7vw,1.6rem)] md:left-14 md:top-32`}>
        We teach children to
      </p>
      <h2 className="absolute inset-x-6 bottom-24 flex flex-col text-[clamp(3rem,12vw,13rem)] font-extrabold leading-[0.84] tracking-[-0.05em] md:inset-x-14">
        <span className="self-start"><Letters text="ask better" /></span>
        <span className="self-end"><Letters text="questions?" accent="?" /></span>
      </h2>
      <div aria-hidden className="lens pointer-events-none absolute left-0 top-0 -ml-12 -mt-12 h-24 w-24 rounded-full border border-[#FFC8F2] opacity-0" />
    </div>
  );
}

/* =========================================================
   2. KEEP   Bodoni Moda, black + signal orange
   Motion: line one is eaten by a turbulence filter and drifts away like smoke.
   Line two is stamped down letter by letter, with a small thud. It does not move again.
   ========================================================= */
function Keep() {
  const r = useRef<HTMLDivElement>(null);
  useGsap(r, (tl) => {
    tl.fromTo(".l1", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 0)
      .from(".rule", { scaleX: 0, duration: 1.6, ease: "expo.inOut" }, 0.2)
      .to(".disp", { attr: { scale: 280 }, duration: 2.6, ease: "power2.in" }, 1.5)
      .to(".blur", { attr: { stdDeviation: 8 }, duration: 2.6, ease: "power2.in" }, 1.5)
      .to(".l1", { opacity: 0, x: -50, y: -70, duration: 2.3, ease: "power1.in" }, 1.8)
      .fromTo(
        ".l2 .ch",
        { opacity: 0, scale: 1.9, y: -50, transformOrigin: "50% 100%" },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power3.in", stagger: { each: 0.06, from: "start" } },
        2.9
      )
      .to(".l2", { y: 7, duration: 0.07, yoyo: true, repeat: 3, ease: "none" }, ">");
  });
  return (
    <div ref={r} className={`${bodoni.className} relative h-full w-full overflow-hidden bg-[#0B0B0B] text-[#F2F2F2]`}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="dissolve" x="-30%" y="-40%" width="160%" height="180%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves={3} seed={4} result="n" />
          <feDisplacementMap className="disp" in="SourceGraphic" in2="n" scale={0} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur className="blur" in="d" stdDeviation={0} />
        </filter>
      </svg>
      <div className="rule absolute inset-x-0 top-1/2 h-px origin-left bg-[#FF5A1F]" />
      <h2
        className="l1 absolute left-6 top-[20%] text-[clamp(3rem,11.5vw,12rem)] font-normal italic leading-[0.9] tracking-[-0.03em] md:left-14"
        style={{ filter: "url(#dissolve)" }}
      >
        Marks fade.
      </h2>
      <h2 className="l2 absolute bottom-24 right-6 text-right text-[clamp(3rem,11.5vw,12rem)] font-black leading-[0.9] tracking-[-0.04em] md:right-14">
        <Chars text="Character stays." cls={(c) => (c === "." ? "text-[#FF5A1F]" : "")} />
      </h2>
    </div>
  );
}

/* =========================================================
   3. GROW   Instrument Serif italic, butter + forest + tomato
   Motion: the sentence is not placed next to a drawing. It is written along the vine.
   A seed, a line that climbs, words riding it upward, then a bloom at the tip.
   ========================================================= */
const GROW_TEXT = "Every child is a seed. Our job is light, patience and room to grow.";

function Vine({ v }: { v: "d" | "m" }) {
  const d = v === "d";
  const path = d
    ? "M70 810 C300 810 340 610 620 600 C900 590 880 340 1120 330 C1360 320 1300 190 1390 160"
    : "M60 760 C60 600 330 640 330 480 C330 330 60 380 60 230 C60 140 200 120 300 80";
  const [sx, sy] = d ? [70, 810] : [60, 760];
  const [ex, ey] = d ? [1390, 160] : [300, 80];
  const fs = d ? 58 : 29;
  const k = d ? 1 : 0.55;
  return (
    <svg
      className={`absolute inset-x-0 top-14 bottom-14 h-[calc(100%-7rem)] w-full ${d ? "hidden md:block" : "md:hidden"}`}
      viewBox={d ? "0 0 1440 900" : "0 0 390 800"}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs><path id={`vine-${v}`} d={path} /></defs>
      <path {...dashed("vline")} d={path} fill="none" stroke="#0E3B2E" strokeWidth={d ? 3 : 2} strokeLinecap="round" />
      <circle className="seed" cx={sx} cy={sy} r={d ? 11 : 7} fill="#0E3B2E" />
      <text fontSize={fs} fill="#0E3B2E" className={instrument.className} dy={-fs * 0.3}>
        <textPath className="tp" href={`#vine-${v}`} startOffset="-100%">{GROW_TEXT}</textPath>
      </text>
      <g transform={`translate(${ex} ${ey}) scale(${k})`}>
        <g className="fspin">
          {Array.from({ length: 8 }, (_, n) => (
            <g key={n} transform={`rotate(${n * 45})`}>
              <ellipse className="pt" cx="0" cy="-32" rx="13" ry="26" fill="#FF5A3C" />
            </g>
          ))}
        </g>
        <circle className="fc" r="11" fill="#0E3B2E" />
      </g>
    </svg>
  );
}

function Grow() {
  const r = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReduced() && r.current) {
      r.current.querySelectorAll(".tp").forEach((t) => t.setAttribute("startOffset", "0%"));
    }
  }, []);
  useGsap(r, (tl, g) => {
    const tps = g.utils.toArray<SVGTextPathElement>(".tp", r.current ?? undefined);
    const o = { v: -100 };
    tl.from(".seed", { scale: 0, duration: 0.6, ease: "back.out(3)" }, 0)
      .fromTo(".vline", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 3.2, ease: "power1.inOut" }, 0.2)
      .to(o, { v: 0, duration: 3.6, ease: "power1.inOut", onUpdate: () => tps.forEach((t) => t.setAttribute("startOffset", `${o.v}%`)) }, 0.5)
      .from(".pt", { scale: 0, transformOrigin: "50% 100%", duration: 1, ease: "back.out(2.2)", stagger: 0.08 }, 3.4)
      .from(".fc", { scale: 0, duration: 0.6, ease: "back.out(3)" }, 3.6);
    g.to(".fspin", { rotate: 360, duration: 60, repeat: -1, ease: "none" });
  });
  return (
    <div ref={r} className="relative h-full w-full overflow-hidden bg-[#F8E7A1]">
      <Vine v="d" />
      <Vine v="m" />
    </div>
  );
}

/* =========================================================
   4. DAILY   Familjen Grotesk, paper + hot pink
   Motion: a habit tracker. Each line is highlighted like a marker stroke, one per beat,
   while 14 more dots fill in. At the end it all resets, and starts again. Repetition is the point.
   ========================================================= */
const DAILY_LINES = ["Dream big.", "Start local.", "Show up daily."];
const PINK = "#FF2E93";
const DOT_EMPTY = "rgba(20,20,27,0)";
const DOT_EDGE = "rgba(20,20,27,0.22)";

function Daily() {
  const r = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = r.current;
    if (!el) return;
    if (prefersReduced()) {
      gsap.set(el.querySelectorAll(".txt"), { opacity: 1 });
      gsap.set(el.querySelectorAll(".bar"), { scaleX: 1 });
      gsap.set(el.querySelectorAll(".dot"), { backgroundColor: PINK, borderColor: PINK });
      return;
    }
    const ctx = gsap.context(() => {
      const dots = gsap.utils.toArray<HTMLElement>(".dot", el);
      const bars = gsap.utils.toArray<HTMLElement>(".bar", el);
      const txts = gsap.utils.toArray<HTMLElement>(".txt", el);
      const L = gsap.timeline({ delay: INTRO_DELAY, repeat: -1, repeatDelay: 0.7 });
      L.set(bars, { scaleX: 0, transformOrigin: "0% 50%" }, 0)
        .set(txts, { opacity: 0.16 }, 0)
        .set(dots, { backgroundColor: DOT_EMPTY, borderColor: DOT_EDGE, scale: 1 }, 0);
      DAILY_LINES.forEach((_, i) => {
        const t = 0.4 + i * 2.2;
        const slice = dots.slice(i * 14, (i + 1) * 14);
        L.to(bars[i], { scaleX: 1, duration: 0.8, ease: "expo.out" }, t)
          .to(txts[i], { opacity: 1, duration: 0.5 }, t)
          .to(slice, { backgroundColor: PINK, borderColor: PINK, duration: 0.3, stagger: 0.05 }, t + 0.1)
          .fromTo(slice, { scale: 0.5 }, { scale: 1, duration: 0.6, ease: "back.out(3)", stagger: 0.05 }, t + 0.1);
      });
      const end = 0.4 + 3 * 2.2 + 1.8;
      L.to(bars, { transformOrigin: "100% 50%", scaleX: 0, duration: 0.6, ease: "power3.inOut", stagger: 0.08 }, end)
        .to(txts, { opacity: 0.16, duration: 0.5 }, end)
        .to(dots, { backgroundColor: DOT_EMPTY, borderColor: DOT_EDGE, duration: 0.4, stagger: { each: 0.012, from: "end" } }, end);
    }, r);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={r} className={`${familjen.className} grid h-full w-full items-center gap-10 bg-[#F3F3F0] px-6 pb-24 pt-24 text-[#14141B] md:grid-cols-[1.6fr_1fr] md:px-14`}>
      <h2 className="flex flex-col items-start text-[clamp(2.4rem,6.8vw,7rem)] font-bold leading-[1.08] tracking-[-0.04em]">
        {DAILY_LINES.map((l) => (
          <span key={l} className="ln relative inline-block">
            <span className="bar absolute inset-x-[-0.1em] inset-y-[10%] origin-left scale-x-0 bg-[#FF2E93]" />
            <span className="txt relative opacity-[0.16]">{l}</span>
          </span>
        ))}
      </h2>
      <div aria-hidden className="grid w-[min(70vw,360px)] grid-cols-7 gap-2.5 md:justify-self-end md:gap-3">
        {Array.from({ length: 42 }, (_, n) => (
          <span key={n} className="dot aspect-square rounded-full border-2 border-[#14141B]/20" />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   5. KIND   Fredoka, sky + sun yellow
   Motion: a ball hops from word to word. Each word wakes up when it lands (with a squash),
   and the lines step down like a staircase. When it reaches the end, it all starts over.
   ========================================================= */
const KIND_LINES: string[][] = [["Be", "kind."], ["Be", "curious."], ["Be", "brave,"], ["try", "again."]];

function Kind() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const words = gsap.utils.toArray<HTMLElement>(".bw", el);
    const ball = el.querySelector<HTMLElement>(".ball");
    if (!ball) return;
    const OFF = "rgba(11,31,77,0.18)";
    const ON = "#0B1F4D";

    if (prefersReduced()) {
      gsap.set(words, { color: ON });
      gsap.set(ball, { display: "none" });
      return;
    }

    let ctx: gsap.Context | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const build = () => {
      ctx?.revert();
      ctx = gsap.context(() => {
        const c = el.getBoundingClientRect();
        const size = ball.offsetWidth;
        const pts = words.map((w) => {
          const b = w.getBoundingClientRect();
          return { x: b.left - c.left + b.width / 2 - size / 2, y: b.top - c.top + b.height * 0.1 - size };
        });
        const tl = gsap.timeline({ delay: INTRO_DELAY, repeat: -1, repeatDelay: 0.4 });
        tl.set(words, { color: OFF, scaleY: 1, transformOrigin: "50% 100%" }, 0)
          .set(ball, { x: pts[0].x, y: -size * 4, opacity: 1, scaleX: 1, scaleY: 1 }, 0)
          .to(ball, { y: pts[0].y, duration: 0.9, ease: "bounce.out" }, 0.1)
          .to(words[0], { color: ON, duration: 0.2 }, 0.42);
        let t = 1.3;
        const D = 0.55;
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1];
          const b = pts[i];
          const peak = Math.min(a.y, b.y) - Math.min(130, 60 + Math.abs(b.x - a.x) * 0.12);
          tl.to(ball, { x: b.x, duration: D, ease: "none" }, t)
            .to(ball, { y: peak, duration: D * 0.5, ease: "power2.out" }, t)
            .to(ball, { y: b.y, duration: D * 0.5, ease: "power2.in" }, t + D * 0.5)
            .to(ball, { scaleY: 0.7, scaleX: 1.25, duration: 0.08, transformOrigin: "50% 100%" }, t + D)
            .to(ball, { scaleY: 1, scaleX: 1, duration: 0.3, ease: "elastic.out(1,0.5)" }, t + D + 0.08)
            .to(words[i], { color: ON, duration: 0.2 }, t + D)
            .fromTo(words[i], { scaleY: 0.82 }, { scaleY: 1, duration: 0.6, ease: "elastic.out(1,0.4)" }, t + D);
          t += D + 0.08;
        }
        tl.to(ball, { opacity: 0, duration: 0.4 }, t + 1.6)
          .to(words, { color: OFF, duration: 0.5 }, t + 1.8);
      }, el);
    };

    build();
    const onResize = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(build, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (timer) clearTimeout(timer);
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={root} className={`${fredoka.className} relative h-full w-full overflow-hidden bg-[#BDE0FF]`}>
      <div className="ball pointer-events-none absolute left-0 top-0 z-10 opacity-0 h-[clamp(1.3rem,3.2vw,2.6rem)] w-[clamp(1.3rem,3.2vw,2.6rem)] rounded-full border-[3px] border-[#0B1F4D] bg-[#FFD21F]" />
      <h2 className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-[clamp(2.6rem,9vw,9rem)] font-semibold leading-[1] tracking-[-0.03em] md:inset-x-14">
        {KIND_LINES.map((line, li) => (
          <span key={li} className="block" style={{ marginLeft: `${li * 6}vw` }}>
            {line.map((w, wi) => (
              <span key={wi} className="bw mr-[0.22em] inline-block text-[#0B1F4D]/20">{w}</span>
            ))}
          </span>
        ))}
      </h2>
    </div>
  );
}

/* ---------- shell ---------- */
const SLIDES: Slide[] = [
  { name: "Ask", ink: "#F4F1FF", C: Ask, enter: { clipPath: "inset(0 0 100% 0)" }, to: { clipPath: "inset(0 0 0% 0)" } },
  { name: "Keep", ink: "#F2F2F2", C: Keep, enter: { clipPath: "inset(0 0 0 100%)" }, to: { clipPath: "inset(0 0 0 0%)" } },
  { name: "Grow", ink: "#0E3B2E", C: Grow, enter: { clipPath: "circle(0% at 86% 18%)" }, to: { clipPath: "circle(150% at 86% 18%)" } },
  { name: "Daily", ink: "#14141B", C: Daily, enter: { clipPath: "inset(100% 0 0 0)" }, to: { clipPath: "inset(0% 0 0 0)" } },
  { name: "Kind", ink: "#0B1F4D", C: Kind, enter: { clipPath: "inset(0 50% 0 50%)" }, to: { clipPath: "inset(0 0% 0 0%)" } },
];

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function SchoolPurposeShowcase() {
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