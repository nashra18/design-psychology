
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Bodoni_Moda, Manrope } from "next/font/google";

/* -------------------------------------------------------------------------- */
/*  CONCEPT: "The loupe"                                                      */
/*  One enormous brilliant-cut stone built from 60 live facets. Every facet   */
/*  catches light as the pointer moves (dispersion), and a jeweller's loupe   */
/*  follows the cursor, magnifying the outlined headline into solid gold.     */
/*  Swapping the stone re-cuts the whole page: hue, saturation, copy, price.  */
/* -------------------------------------------------------------------------- */

const display = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], display: "swap" });
const body = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

const VELVET = "#0A1024";
const PLATINUM = "#E8EBF3";
const GOLD = "#C9A24B";
const MUTED = "#8A93AD";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const LOUPE = 260;

const NAV = [
  { label: "Rings", href: "#rings" },
  { label: "Stones", href: "#stones" },
  { label: "Atelier", href: "#atelier" },
  { label: "Visit", href: "#visit" },
];

const STONES = [
  { id: "diamond", name: "Diamond", hue: 205, sat: 18, piece: "Solitaire ring", cta: "Shop diamonds", price: "From $4,800", note: "A 1.02 carat round brilliant in recycled platinum, cut and set by one person." },
  { id: "sapphire", name: "Sapphire", hue: 228, sat: 82, piece: "Ceylon band", cta: "Shop sapphires", price: "From $2,950", note: "Untreated cornflower sapphire from Sri Lanka, in an 18 carat yellow gold bezel." },
  { id: "emerald", name: "Emerald", hue: 152, sat: 70, piece: "Garden pendant", cta: "Shop emeralds", price: "From $3,400", note: "A Colombian emerald on a fine chain. Each stone is photographed before you buy it." },
  { id: "ruby", name: "Ruby", hue: 350, sat: 80, piece: "Ember studs", cta: "Shop rubies", price: "From $2,200", note: "Matched pigeon-blood rubies, claw set so the light reaches the back of the stone." },
];

/* ------------------------------- gem geometry ------------------------------ */

type Pt = [number, number];
const pt = (r: number, deg: number): Pt => [200 + r * Math.cos((deg * Math.PI) / 180), 200 + r * Math.sin((deg * Math.PI) / 180)];
const ring = (r: number, off: number) => Array.from({ length: 12 }, (_, k) => pt(r, k * 30 + off));
const OUT = ring(190, 0);
const MID = ring(125, 15);
const INN = ring(70, 0);
const C: Pt = [200, 200];

const FACETS: { p: Pt[]; base: number }[] = [];
for (let k = 0; k < 12; k++) {
  const n = (k + 1) % 12;
  const pr = (k + 11) % 12;
  FACETS.push({ p: [C, INN[k], INN[n]], base: 74 });
  FACETS.push({ p: [INN[k], INN[n], MID[k]], base: 58 });
  FACETS.push({ p: [MID[pr], MID[k], INN[k]], base: 52 });
  FACETS.push({ p: [OUT[k], OUT[n], MID[k]], base: 40 });
  FACETS.push({ p: [MID[pr], MID[k], OUT[k]], base: 34 });
}

function Facet({ p, base, idx, hue, sat, ang }: { p: Pt[]; base: number; idx: number; hue: MotionValue<number>; sat: MotionValue<number>; ang: MotionValue<number> }) {
  const fill = useTransform([hue, sat, ang], (v: number[]) => {
    const [h, s, a] = v;
    const l = Math.min(92, Math.max(10, base + 30 * Math.sin(a * 2 + idx * 1.3)));
    return `hsl(${h + Math.cos(a + idx) * 16} ${s}% ${l}%)`;
  });
  return <motion.polygon points={p.map((q) => q.join(",")).join(" ")} style={{ fill }} stroke="rgba(255,255,255,0.32)" strokeWidth={1} strokeLinejoin="round" />;
}

/* -------------------------------- headline -------------------------------- */

function Headline({ filled }: { filled?: boolean }) {
  const style = filled
    ? { backgroundImage: `linear-gradient(100deg, ${GOLD}, #F6E7B6 45%, ${GOLD})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
    : { WebkitTextStroke: "1px rgba(232,235,243,0.38)", color: "transparent" };
  return (
    <div
      aria-hidden={filled ? true : undefined}
      className={`${display.className} pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center font-normal leading-[0.88] tracking-[-0.035em]`}
      style={{ fontSize: "clamp(3.6rem, 13.5vw, 13rem)", ...style } as React.CSSProperties}
    >
      <span className="block italic">Light,</span>
      <span className="block">cut by hand</span>
    </div>
  );
}

/* --------------------------------- page ----------------------------------- */

export default function Experiment8() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [menu, setMenu] = useState(false);
  const stone = STONES[i];

  const hue = useMotionValue(STONES[0].hue);
  const sat = useMotionValue(STONES[0].sat);
  const ang = useMotionValue(0);
  const pa = useSpring(0, { stiffness: 60, damping: 18 });
  const rotY = useSpring(0, { stiffness: 90, damping: 16 });
  const rotX = useSpring(0, { stiffness: 90, damping: 16 });

  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const sx = useSpring(mx, { stiffness: 320, damping: 32 });
  const sy = useSpring(my, { stiffness: 320, damping: 32 });
  const rr = useMotionValue(0);
  const r = useSpring(rr, { stiffness: 220, damping: 24 });

  const clip = useMotionTemplate`circle(${r}px at ${sx}px ${sy}px)`;
  const ringX = useTransform(sx, (v) => v - LOUPE / 2);
  const ringY = useTransform(sy, (v) => v - LOUPE / 2);
  const ringScale = useTransform(r, (v) => v / (LOUPE / 2));

  useAnimationFrame((t) => {
    ang.set(pa.get() + (reduce ? 0 : t / 2600));
  });

  useEffect(() => {
    const s = STONES[i];
    const a = animate(hue, s.hue, { duration: reduce ? 0 : 1.3, ease: EASE });
    const b = animate(sat, s.sat, { duration: reduce ? 0 : 1.3, ease: EASE });
    return () => {
      a.stop();
      b.stop();
    };
  }, [i, hue, sat, reduce]);

  const step = useCallback((d: number) => setI((v) => (v + d + STONES.length) % STONES.length), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
      if (menu) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, step]);

  const onMove = (e: React.PointerEvent) => {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    mx.set(x);
    my.set(y);
    rr.set(LOUPE / 2);
    const nx = (x / box.width - 0.5) * 2;
    const ny = (y / box.height - 0.5) * 2;
    pa.set(nx * Math.PI);
    rotY.set(nx * 20);
    rotX.set(-ny * 20);
  };
  const onLeave = () => {
    rr.set(0);
    rotX.set(0);
    rotY.set(0);
  };

  const link =
    "underline decoration-transparent decoration-1 underline-offset-[6px] outline-none transition-[text-decoration-color] duration-300 hover:decoration-current focus-visible:decoration-current";

  return (
    <section
      className={`${body.className} relative flex min-h-[100svh] w-full flex-col overflow-hidden`}
      style={{ backgroundColor: VELVET, color: PLATINUM }}
    >
      {/* top bar */}
      <header className="relative z-30 flex items-center justify-between px-6 py-5 md:px-10">
        <a href="#top" className={`${display.className} text-[24px] italic tracking-[-0.02em] outline-none focus-visible:underline`}>
          Vael
        </a>
        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className={`text-[15px] ${link}`}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <a href="#bag" className={`text-[15px] ${link}`}>
            Bag (0)
          </a>
          <button type="button" onClick={() => setMenu(true)} aria-expanded={menu} aria-controls="vael-menu" className="text-[15px] outline-none focus-visible:underline md:hidden">
            Menu
          </button>
        </div>
      </header>

      {/* stage: outlined headline, gem, loupe */}
      <div
        ref={stageRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative min-h-[52svh] flex-1 touch-pan-y"
        style={{ cursor: "none" }}
      >
        <h1 className="sr-only">Light, cut by hand</h1>
        <Headline />

        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.6, rotate: reduce ? 0 : -25 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: reduce ? 0 : 1.6, ease: EASE, delay: 0.2 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: "min(70vw, 58svh)", perspective: 900 }}
        >
          <motion.div style={{ rotateX: rotX, rotateY: rotY }}>
            <motion.svg
              viewBox="0 0 400 400"
              role="img"
              aria-label={`${stone.name}, round brilliant cut`}
              className="block w-full"
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.55))" }}
            >
              {FACETS.map((f, idx) => (
                <Facet key={idx} p={f.p} base={f.base} idx={idx} hue={hue} sat={sat} ang={ang} />
              ))}
            </motion.svg>
          </motion.div>
        </motion.div>

        {/* loupe: solid gold copy of the headline, revealed through a circle */}
        <motion.div className="pointer-events-none absolute inset-0 z-10" style={{ clipPath: clip, WebkitClipPath: clip } as never}>
          <Headline filled />
        </motion.div>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 rounded-full border"
          style={{ width: LOUPE, height: LOUPE, x: ringX, y: ringY, scale: ringScale, borderColor: GOLD, boxShadow: "inset 0 0 40px rgba(201,162,75,0.18)" }}
        />
      </div>

      {/* bottom: piece details and stone selector */}
      <div className="relative z-20 grid gap-6 px-6 pb-7 pt-5 md:grid-cols-12 md:items-end md:gap-10 md:px-10 md:pb-9">
        <div className="min-h-[9.5rem] md:col-span-6" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stone.id}
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }}
              className="flex flex-col items-start gap-4"
            >
              <p className={`${display.className} text-[28px] italic leading-none tracking-[-0.02em] md:text-[34px]`}>
                {stone.piece} <span className="not-italic" style={{ color: GOLD }}>{stone.price}</span>
              </p>
              <p className="max-w-[28rem] text-[15px] leading-[1.65]" style={{ color: MUTED }}>
                {stone.note}
              </p>
              <a
                href="#rings"
                className="inline-flex rounded-full border px-6 py-3 text-[15px] font-medium outline-none transition-colors duration-300 hover:bg-[#E8EBF3] hover:text-[#0A1024] focus-visible:ring-2 focus-visible:ring-[#C9A24B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1024]"
                style={{ borderColor: GOLD }}
              >
                {stone.cta}
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-start md:col-span-6 md:justify-end">
          <div role="tablist" aria-label="Choose a stone" className="flex items-center gap-1 rounded-full p-1.5" style={{ backgroundColor: "rgba(232,235,243,0.08)" }}>
            {STONES.map((s, idx) => {
              const on = idx === i;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setI(idx)}
                  className="relative whitespace-nowrap rounded-full px-3.5 py-2.5 text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] md:px-5 md:text-[14px]"
                  style={{ color: on ? VELVET : PLATINUM }}
                >
                  {on && <motion.span layoutId="stone-pill" transition={{ duration: reduce ? 0 : 0.5, ease: EASE }} className="absolute inset-0 rounded-full" style={{ backgroundColor: PLATINUM }} />}
                  <span className="relative">{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {menu && (
          <motion.div
            id="vael-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 z-50 flex flex-col px-6 py-5"
            style={{ backgroundColor: VELVET }}
          >
            <div className="flex items-center justify-between">
              <span className={`${display.className} text-[24px] italic`}>Vael</span>
              <button type="button" autoFocus onClick={() => setMenu(false)} className="text-[15px] outline-none focus-visible:underline">
                Close
              </button>
            </div>
            <nav aria-label="Menu" className="mt-14 flex flex-col">
              {[...NAV, { label: "Bag (0)", href: "#bag" }].map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  onClick={() => setMenu(false)}
                  className={`${display.className} border-t py-5 text-[2.6rem] italic leading-none tracking-[-0.03em] outline-none focus-visible:underline`}
                  style={{ borderColor: "rgba(232,235,243,0.16)" }}
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}