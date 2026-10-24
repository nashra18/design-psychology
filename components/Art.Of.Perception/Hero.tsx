"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, type Variants } from "framer-motion";
import gsap from "gsap";
import { Playfair_Display, Great_Vibes, Inter } from "next/font/google";

/* -------------------------------------------------------------------------- */
/*  CONCEPT: "Made vs. perceived"                                             */
/*  A design is finished twice: by its maker, and by the eye that meets it.   */
/*  Two full scenes are stacked and split by a gold line you steer with the   */
/*  mouse (or finger).                                                        */
/*    left  = what was designed  -> cold, monochrome, title is an outline     */
/*    right = what is perceived  -> garnet, gold, colour, title is filled     */
/*  Both scenes share one layout, so a letter changes from outline to filled  */
/*  exactly where the line crosses it.                                        */
/* -------------------------------------------------------------------------- */

const script = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap" });
const display = Playfair_Display({ subsets: ["latin"], weight: ["900"], display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

const IMAGE_SRC = "/images/Art.Of.Perception/perception-removebg-preview.png";
const IMAGE_ALT = "Collage of a woman's profile, a cream lily, burgundy petals and a gold arc";
const WORD = "Perception".split("");

const PARAGRAPH =
  "A design is finished twice: once by the person who makes it, and again by the eye that meets it. This is a look at how people read a design before they understand it.";
const PARAGRAPH_SHORT = "A design is finished twice: by its maker, and by the eye that meets it.";
const PARA_WORDS = PARAGRAPH.split(" ");

const PRINCIPLES = [
  { name: "Contrast", note: "decides what is seen first" },
  { name: "Space", note: "decides what is felt next" },
  { name: "Rhythm", note: "decides what is remembered" },
];

const CREAM = "#F3E6D0";
const GOLD = "#D9B26F";
const TITLE_SIZE = "min(15.4vw, 26vh)";
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

type QuickTo = ReturnType<typeof gsap.quickTo>;

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const CSS = `
@media (hover: hover) { .hero-root, .hero-root * { cursor: none !important; } }
.hero-root { touch-action: pan-y; }
`;

/* the mind-side artwork moves a little more and sits slightly larger: crossing the line feels like a lens */
const IMG_EYE = "translate3d(calc(var(--px) * 34px), calc(var(--py) * 22px), 0)";
const IMG_MIND = "translate3d(calc(var(--px) * 50px), calc(var(--py) * 32px), 0) scale(1.035)";
const PARALLAX_TITLE = "translate3d(calc(var(--px) * -20px), calc(var(--py) * -8px), 0)";

const letterVariants: Variants = {
  hidden: { y: "108%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1.3, ease: EASE_OUT, delay: 0.15 + i * 0.05 },
  }),
};

const wordVariants: Variants = {
  hidden: { y: "115%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 1.4 + i * 0.03 },
  }),
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* -------------------------------------------------------------------------- */
/*  One world, rendered twice with a different tone                           */
/* -------------------------------------------------------------------------- */
function Scene({ tone, state }: { tone: "eye" | "mind"; state: "hidden" | "show" }) {
  const mind = tone === "mind";

  return (
    <div className={`absolute inset-0 overflow-hidden ${mind ? "bg-[#12040A]" : "bg-[#0C0C0E]"}`}>
      {/* ambient glow */}
      <div
        aria-hidden
        className={`absolute left-1/2 top-[46%] h-[95vh] w-[95vh] -translate-x-1/2 -translate-y-1/2 rounded-full ${
          mind
            ? "bg-[radial-gradient(closest-side,rgba(138,28,50,0.55),rgba(138,28,50,0)_100%)]"
            : "bg-[radial-gradient(closest-side,rgba(255,255,255,0.07),rgba(255,255,255,0)_100%)]"
        }`}
      />

      {/* title anchored to the bottom, drifts against the artwork */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-[1vh] z-10 flex justify-center"
        style={{ transform: PARALLAX_TITLE }}
      >
        <span
          className={`${display.className} flex whitespace-nowrap leading-[0.9] tracking-[-0.045em]`}
          style={{
            fontSize: TITLE_SIZE,
            color: mind ? CREAM : "transparent",
            WebkitTextStroke: mind ? `2px ${CREAM}` : "2px #B9B9BF",
          }}
        >
          {WORD.map((ch, i) => (
            <span key={i} className="block overflow-hidden px-[0.015em] pb-[0.16em] pt-[0.04em] -mb-[0.14em]">
              <motion.span custom={i} variants={letterVariants} initial="hidden" animate={state} className="block">
                {ch}
              </motion.span>
            </span>
          ))}
        </span>
      </div>

      {/* artwork in front of the title's top edge */}
      <motion.div
        initial={{ opacity: 0, y: 70 }}
        animate={state === "show" ? { opacity: 1, y: 0 } : { opacity: 0, y: 70 }}
        transition={{ duration: 1.7, ease: EASE_OUT, delay: 0.1 }}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[45%] z-20 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="relative aspect-[3/2] w-[min(100vw,92vh)] md:w-[min(78vw,92vh)]"
          style={{ transform: mind ? IMG_MIND : IMG_EYE }}
        >
          <Image
            src={IMAGE_SRC}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 78vw"
            className="object-contain"
            style={{ filter: mind ? "none" : "grayscale(1) contrast(1.25) brightness(0.85)" }}
          />
        </div>
      </motion.div>

      {/* script */}
      <motion.span
        aria-hidden
        initial={{ clipPath: "inset(-20% 100% -20% 0%)" }}
        animate={
          state === "show" ? { clipPath: "inset(-20% -6% -20% 0%)" } : { clipPath: "inset(-20% 100% -20% 0%)" }
        }
        transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.5 }}
        className={`${script.className} absolute left-[4vw] z-30 block -rotate-[5deg] select-none leading-[0.9]`}
        style={{
          bottom: "calc(min(15.4vw, 26vh) * 0.78)",
          fontSize: "clamp(2.4rem, min(7.5vw, 11vh), 7rem)",
          color: mind ? GOLD : "#8E8E94",
          WebkitTextStroke: "1.5px currentColor",
        }}
      >
        The Art of
      </motion.span>

      {/* caption: what this side of the line means */}
      <motion.p
        custom={1.6}
        variants={fadeUp}
        initial="hidden"
        animate={state}
        aria-hidden
        className={`absolute top-6 z-30 max-w-[11rem] text-[13px] leading-snug md:top-8 md:max-w-none ${
          mind ? "right-6 text-right text-[#F3E6D0]/75 md:right-12" : "left-6 text-[#F3E6D0]/50 md:left-12"
        }`}
      >
        {mind ? "What is perceived" : "What was designed"}
      </motion.p>

      {/* the three levers of perception, only visible in the perceived world */}
      {mind && (
        <ul
          aria-hidden
          className="absolute right-12 top-[46%] z-30 hidden w-[14rem] -translate-y-1/2 flex-col gap-7 border-l border-[#D9B26F]/40 pl-5 lg:flex"
        >
          {PRINCIPLES.map((p, i) => (
            <motion.li key={p.name} custom={2.2 + i * 0.14} variants={fadeUp} initial="hidden" animate={state}>
              <span className="block text-[17px] font-semibold text-[#F3E6D0]">{p.name}</span>
              <span className="mt-1 block text-[14px] leading-snug text-[#F3E6D0]/65">{p.note}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Button                                                                    */
/* -------------------------------------------------------------------------- */
function MagneticButton({ label }: { label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onEnter = () => {
    rect.current = wrapRef.current?.getBoundingClientRect() ?? null;
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rc = rect.current;
    if (!rc) return;
    x.set((e.clientX - (rc.left + rc.width / 2)) * 0.25);
    y.set((e.clientY - (rc.top + rc.height / 2)) * 0.25);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={wrapRef}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className="-m-3 inline-block p-3"
    >
      <button
        type="button"
        data-cursor="big"
        className="group relative inline-flex items-center overflow-hidden rounded-full bg-[#F3E6D0] py-2 pl-8 pr-2 text-[15px] font-semibold text-[#2A0711] outline-none focus-visible:ring-2 focus-visible:ring-[#D9B26F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12040A]"
      >
        <span className="relative z-10 transition-colors duration-500 group-hover:text-[#F3E6D0] group-focus-visible:text-[#F3E6D0]">
          {label}
        </span>
        <span className="relative ml-6 h-12 w-12 shrink-0">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[#8A1C32] transition-transform duration-[650ms] ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-[9] group-focus-visible:scale-[9]"
          />
          <span className="relative z-10 grid h-full w-full place-items-center text-[#F3E6D0]">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 -rotate-45 transition-transform duration-500 ease-out group-hover:rotate-0 group-focus-visible:rotate-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </span>
      </button>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */
export default function Hero() {
  const [ready, setReady] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const mindRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const cursorTo = useRef<{ x: QuickTo; y: QuickTo } | null>(null);
  const shown = useRef(false);
  const hintGone = useRef(false);

  /* everything the ticker needs lives here, never in React state */
  const S = useRef({
    cur: 100, // divider position, % from left (100 = only the designed world is visible)
    pointerX: 50,
    pointer: false,
    lastMove: 0,
    live: false,
    px: 0,
    py: 0,
    tpx: 0,
    tpy: 0,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const s = S.current;
    s.pointer = true;
    s.lastMove = performance.now();
    s.pointerX = Math.min(94, Math.max(6, (e.clientX / window.innerWidth) * 100));
    s.tpx = e.clientX / window.innerWidth - 0.5;
    s.tpy = e.clientY / window.innerHeight - 0.5;

    if (e.pointerType === "mouse" && cursorTo.current) {
      cursorTo.current.x(e.clientX);
      cursorTo.current.y(e.clientY);
      if (!shown.current) {
        shown.current = true;
        gsap.to(cursorRef.current, { opacity: 1, duration: 0.4 });
        if (!hintGone.current) {
          hintGone.current = true;
          gsap.to(hintRef.current, { opacity: 0, duration: 0.6, delay: 3.5 });
        }
      }
    }
  };

  const handlePointerOver = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !dotRef.current) return;
    const big = !!(e.target as HTMLElement).closest("[data-cursor]");
    gsap.to(dotRef.current, { scale: big ? 4 : 1, duration: 0.4, ease: "power3.out", overwrite: "auto" });
  };

  const handlePointerLeave = () => {
    const s = S.current;
    s.pointer = false;
    s.tpx = 0;
    s.tpy = 0;
    shown.current = false;
    gsap.to(cursorRef.current, { opacity: 0, duration: 0.4 });
  };

  useEffect(() => {
    const s = S.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = () => {
      if (mindRef.current) mindRef.current.style.clipPath = `inset(0 0 0 ${s.cur.toFixed(2)}%)`;
      if (dividerRef.current) dividerRef.current.style.left = `${s.cur.toFixed(2)}%`;
      if (sectionRef.current) {
        sectionRef.current.style.setProperty("--px", s.px.toFixed(3));
        sectionRef.current.style.setProperty("--py", s.py.toFixed(3));
      }
    };

    if (reduce) {
      s.cur = 50;
      apply();
      if (dividerRef.current) dividerRef.current.style.opacity = "1";
      setReady(true);
      return;
    }

    const ctx = gsap.context(() => {
      if (cursorRef.current) {
        cursorTo.current = {
          x: gsap.quickTo(cursorRef.current, "x", { duration: 0.3, ease: "power3.out" }),
          y: gsap.quickTo(cursorRef.current, "y", { duration: 0.3, ease: "power3.out" }),
        };
      }

      // 1. only the designed world, title rises. 2. the line sweeps in and the perceived world arrives.
      const tl = gsap.timeline({ delay: 0.15 });
      tl.add(() => setReady(true), 0)
        .to(dividerRef.current, { opacity: 1, duration: 0.6 }, 1.1)
        .to(s, { cur: 50, duration: 2.6, ease: "power4.inOut" }, 1.1)
        .add(() => {
          s.live = true;
          s.lastMove = performance.now();
        }, 3.7);

      // the single engine: divider, idle sway, parallax
      const tick = (_t: number, dtMs: number) => {
        const dt = Math.min(dtMs, 64) / 1000;
        if (s.live) {
          const now = performance.now();
          const idle = !s.pointer || now - s.lastMove > 2500;
          const target = idle ? 50 + Math.sin(now / 1700) * 7 : s.pointerX;
          s.cur += (target - s.cur) * (1 - Math.pow(0.001, dt));
        }
        s.px += (s.tpx - s.px) * 0.06;
        s.py += (s.tpy - s.py) * 0.06;
        apply();
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const state = ready ? "show" : "hidden";

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerOver={handlePointerOver}
      onPointerLeave={handlePointerLeave}
      className={`${body.className} hero-root relative isolate h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#0C0C0E] text-[#F3E6D0]`}
      style={{ "--px": 0, "--py": 0 } as React.CSSProperties}
    >
      <style>{CSS}</style>
      <h1 className="sr-only">The Art of Perception</h1>
      <p className="sr-only">{PARAGRAPH}</p>
      <ul className="sr-only">
        {PRINCIPLES.map((p) => (
          <li key={p.name}>
            {p.name} {p.note}
          </li>
        ))}
      </ul>

      {/* world 1: what was designed */}
      <div className="absolute inset-0 z-10">
        <Scene tone="eye" state={state} />
      </div>

      {/* world 2: what is perceived, revealed by clip-path from the divider to the right edge */}
      <div ref={mindRef} className="absolute inset-0 z-20" style={{ clipPath: "inset(0 0 0 100%)" }}>
        <Scene tone="mind" state={state} />
      </div>

      {/* the divider: a thin gold line, a soft lens glow on the perceived side, and a handle */}
      <div
        ref={dividerRef}
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-40 w-px opacity-0"
        style={{ left: "100%", backgroundColor: GOLD, boxShadow: `0 0 18px 1px ${GOLD}66` }}
      >
        <div className="absolute left-0 top-0 h-full w-[16vw] bg-gradient-to-r from-[#D9B26F]/15 to-transparent" />
        <div className="absolute left-1/2 top-[45%] grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#D9B26F] bg-[#12040A]/70 backdrop-blur-sm">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-[#D9B26F]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </div>
      </div>

      {/* paragraph + button, shared by both worlds */}
      <div className="absolute bottom-[calc(min(15.4vw,26vh)+1.5rem)] left-6 right-6 z-[45] flex flex-col items-start gap-5 md:bottom-auto md:left-12 md:right-auto md:top-[40%] md:w-[19rem] md:-translate-y-1/2 md:gap-7">
        <motion.span
          custom={1.2}
          variants={fadeUp}
          initial="hidden"
          animate={state}
          aria-hidden
          className="hidden h-px w-12 bg-[#D9B26F] md:block"
        />
        <motion.p
          custom={1.6}
          variants={fadeUp}
          initial="hidden"
          animate={state}
          aria-hidden
          className="max-w-[20rem] text-[14px] leading-[1.6] text-[#F3E6D0]/90 md:hidden"
        >
          {PARAGRAPH_SHORT}
        </motion.p>
        <p
          aria-hidden
          className="hidden max-w-[22rem] text-[17px] leading-[1.7] text-[#F3E6D0]/90 [text-wrap:pretty] md:block"
        >
          {PARA_WORDS.map((w, i) => (
            <span key={i} className="mr-[0.28em] inline-block overflow-hidden pb-[0.2em] -mb-[0.2em] align-top">
              <motion.span custom={i} variants={wordVariants} initial="hidden" animate={state} className="inline-block">
                {w}
              </motion.span>
            </span>
          ))}
        </p>
        <motion.div custom={2.4} variants={fadeUp} initial="hidden" animate={state}>
          <MagneticButton label="In Detail" />
        </motion.div>
      </div>

      {/* vignette + grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[50] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_55%,rgba(5,1,3,0.65)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[60] opacity-[0.06]"
        style={{ backgroundImage: GRAIN }}
      />

      {/* cursor: a dot, with a one-time hint that fades after a few seconds */}
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden opacity-0 [@media(hover:hover)]:block"
      >
        <div ref={dotRef} className="-ml-2 -mt-2 h-4 w-4 rounded-full bg-[#F3E6D0] mix-blend-difference" />
        <span
          ref={hintRef}
          className="absolute left-5 top-0 -translate-y-1/2 whitespace-nowrap text-[12px] text-[#F3E6D0]/85"
        >
          Move to compare
        </span>
      </div>
    </section>
  );
}