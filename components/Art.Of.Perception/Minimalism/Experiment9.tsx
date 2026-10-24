"use client";

import { useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type AnimationPlaybackControls, type PanInfo } from "framer-motion";
import { Bodoni_Moda, Manrope } from "next/font/google";

/* -------------------------------------------------------------------------- */
/*  CONCEPT: "The turntable eclipse", refined                                 */
/*  Same mechanic (drag the turntable, the eclipse behind it follows), but    */
/*  rendered like a luxury house: real metal shading, faceted stones, hairline */
/*  structure, square-cornered controls and a quiet, dim moon.                 */
/* -------------------------------------------------------------------------- */

const display = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], display: "swap" });
const body = Manrope({ subsets: ["latin"], weight: ["300", "400", "500"], display: "swap" });

const VELVET = "#0A1024";
const PLATINUM = "#E8EBF3";
const GOLD = "#C9A24B";
const MUTED = "#8A93AD";
const HAIR = "rgba(232,235,243,0.16)";
const SPRING = { type: "spring", stiffness: 70, damping: 16, mass: 1 } as const;

/* ------------------------------ faceted stone ------------------------------ */

type Pt = [number, number];
const pt = (r: number, deg: number): Pt => [200 + r * Math.cos((deg * Math.PI) / 180), 200 + r * Math.sin((deg * Math.PI) / 180)];
const ring = (r: number, off: number) => Array.from({ length: 12 }, (_, k) => pt(r, k * 30 + off));
const OUT = ring(190, 0);
const MID = ring(125, 15);
const INN = ring(70, 0);
const FACETS: { p: Pt[]; base: number }[] = [];
for (let k = 0; k < 12; k++) {
  const n = (k + 1) % 12;
  const pr = (k + 11) % 12;
  FACETS.push({ p: [[200, 200], INN[k], INN[n]], base: 84 });
  FACETS.push({ p: [INN[k], INN[n], MID[k]], base: 68 });
  FACETS.push({ p: [MID[pr], MID[k], INN[k]], base: 62 });
  FACETS.push({ p: [OUT[k], OUT[n], MID[k]], base: 46 });
  FACETS.push({ p: [MID[pr], MID[k], OUT[k]], base: 40 });
}

function Brilliant({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const s = r / 190;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s}) translate(-200 -200)`}>
      {FACETS.map((f, i) => (
        <polygon
          key={i}
          points={f.p.map((q) => q.join(",")).join(" ")}
          fill={`hsl(215 22% ${Math.min(95, f.base + 15 * Math.sin(i * 1.9))}%)`}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

/* ----------------------------- piece illustrations -------------------------- */

const G = "url(#eclipse-gold)";
const HL = "rgba(255,255,255,0.35)";

const PIECES = [
  {
    id: "band",
    name: "Eclipse band",
    price: "$3,200",
    note: "A 4 mm band with a moonstone held in a low, hand-cut bezel.",
    spec: [["Metal", "18 ct yellow gold"], ["Stone", "Moonstone, 1.8 ct"]],
    art: (
      <g>
        <path fillRule="evenodd" fill={G} d="M34 126a66 44 0 1 0 132 0a66 44 0 1 0 -132 0ZM50 124a50 31 0 1 0 100 0a50 31 0 1 0 -100 0Z" />
        <ellipse cx="100" cy="124" rx="50" ry="31" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1.2" />
        <ellipse cx="100" cy="126" rx="66" ry="44" fill="none" stroke={HL} strokeWidth="0.8" />
        <circle cx="100" cy="72" r="27" fill={G} />
        <Brilliant cx={100} cy={72} r={23} />
      </g>
    ),
  },
  {
    id: "hoops",
    name: "Corona hoops",
    price: "$1,850",
    note: "Slim hoops with a moonstone at the hinge, light enough to wear all day.",
    spec: [["Metal", "18 ct yellow gold"], ["Stone", "Moonstone, 0.6 ct each"]],
    art: (
      <g>
        {[62, 138].map((x) => (
          <g key={x}>
            <circle cx={x} cy="96" r="42" fill="none" stroke={G} strokeWidth="5" />
            <circle cx={x} cy="96" r="44.6" fill="none" stroke={HL} strokeWidth="0.8" />
            <circle cx={x} cy="138" r="10" fill={G} />
            <Brilliant cx={x} cy={138} r={7.5} />
          </g>
        ))}
      </g>
    ),
  },
  {
    id: "pendant",
    name: "Umbra pendant",
    price: "$2,400",
    note: "A single drop on a 45 cm chain. The ring around the stone is the eclipse in miniature.",
    spec: [["Metal", "18 ct white gold"], ["Stone", "Diamond, 0.9 ct"]],
    art: (
      <g>
        <path d="M24 18C40 100 80 124 100 124s60-24 76-106" fill="none" stroke={G} strokeWidth="2.6" strokeDasharray="3.2 1.6" />
        <circle cx="100" cy="128" r="5" fill="none" stroke={G} strokeWidth="2" />
        <circle cx="100" cy="154" r="26" fill={G} />
        <circle cx="100" cy="154" r="26" fill="none" stroke={HL} strokeWidth="0.8" />
        <Brilliant cx={100} cy={154} r={21} />
      </g>
    ),
  },
  {
    id: "cuff",
    name: "Penumbra cuff",
    price: "$4,100",
    note: "An open cuff that ends in a single stone, so the gap is part of the design.",
    spec: [["Metal", "18 ct rose gold"], ["Stone", "Moonstone, 1.2 ct"]],
    art: (
      <g>
        <ellipse cx="100" cy="104" rx="72" ry="52" fill="none" stroke={G} strokeWidth="14" strokeLinecap="round" strokeDasharray="300 400" transform="rotate(-62 100 104)" />
        <ellipse cx="100" cy="104" rx="78" ry="58" fill="none" stroke={HL} strokeWidth="0.8" strokeDasharray="300 400" transform="rotate(-62 100 104)" />
        <circle cx="134" cy="40" r="13" fill={G} />
        <Brilliant cx={134} cy={40} r={10} />
      </g>
    ),
  },
];

const N = PIECES.length;
const STEP = 360 / N;
const mod = (n: number) => ((n % N) + N) % N;

/* --------------------------------- section --------------------------------- */

export default function Experiment9() {
  const reduce = useReducedMotion();
  const rot = useMotionValue(0);
  const idxRef = useRef(0);
  const startRot = useRef(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const [active, setActive] = useState(0);

  useMotionValueEvent(rot, "change", (v) => setActive(mod(Math.round(-v / STEP))));

  const shadowX = useTransform(rot, (v) => `${Math.sin((v * Math.PI) / 180) * 78}%`);
  const word = useTransform(rot, (v) => `${(v / 360) * -14}%`);

  const go = (n: number) => {
    idxRef.current = n;
    controls.current?.stop();
    controls.current = animate(rot, -n * STEP, reduce ? { duration: 0 } : SPRING);
  };
  const pick = (j: number) => go(idxRef.current + (((j - mod(idxRef.current) + N + N / 2) % N) - N / 2));

  const onPanStart = () => {
    controls.current?.stop();
    startRot.current = rot.get();
  };
  const onPan = (_: unknown, info: PanInfo) => rot.set(startRot.current + info.offset.x * 0.3);
  const onPanEnd = (_: unknown, info: PanInfo) => go(Math.round(-(rot.get() + info.velocity.x * 0.1) / STEP));

  const piece = PIECES[active];
  const arrow = "hidden h-11 w-11 place-items-center border outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#C9A24B] md:grid";

  return (
    <section className={`${body.className} relative flex min-h-[100svh] w-full flex-col overflow-hidden`} style={{ backgroundColor: VELVET, color: PLATINUM }}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="eclipse-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7A5C1E" />
            <stop offset="0.18" stopColor="#E9D08A" />
            <stop offset="0.3" stopColor="#FFF4CF" />
            <stop offset="0.45" stopColor={GOLD} />
            <stop offset="0.65" stopColor="#8A6A25" />
            <stop offset="0.82" stopColor="#E6C878" />
            <stop offset="1" stopColor="#6B4F19" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-20 flex items-baseline justify-between border-b px-6 py-6 md:px-10" style={{ borderColor: HAIR }}>
        <h2 className={`${display.className} text-[clamp(1.5rem,2.6vw,2.2rem)] leading-none tracking-[-0.02em]`}>Eclipse</h2>
        <p className="text-[14px]" style={{ color: MUTED }}>New collection, four pieces</p>
      </div>

      {/* stage */}
      <motion.div
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Eclipse collection. Use the arrow keys, drag or swipe to browse."
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(idxRef.current + 1);
          if (e.key === "ArrowLeft") go(idxRef.current - 1);
        }}
        onPanStart={onPanStart}
        onPan={onPan}
        onPanEnd={onPanEnd}
        className="relative min-h-[52svh] flex-1 cursor-grab select-none outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] active:cursor-grabbing"
        style={{ touchAction: "pan-y", background: "radial-gradient(ellipse at 50% 45%, rgba(40,52,100,0.45), rgba(10,16,36,0) 65%)" }}
      >
        <motion.div
          aria-hidden
          className={`${display.className} pointer-events-none absolute inset-0 flex items-center justify-center whitespace-nowrap`}
          style={{ x: word, fontSize: "clamp(8rem,26vw,26rem)", letterSpacing: "-0.04em", WebkitTextStroke: "1px rgba(232,235,243,0.06)", color: "transparent" }}
        >
          Eclipse
        </motion.div>

        {/* dim moon and shadow */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "min(60vw,52svh)", aspectRatio: "1" }}>
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #CDBA8A, #7A6636 70%, #3E321A)", opacity: 0.78, boxShadow: "0 0 70px 2px rgba(201,162,75,0.22)" }} />
          <motion.div className="absolute inset-[-1.2%] rounded-full" style={{ backgroundColor: VELVET, x: shadowX, boxShadow: "0 0 0 1px rgba(201,162,75,0.35)" }} />
        </div>

        {/* turntable */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 1600 }}>
          <motion.div className="relative" style={{ rotateY: rot, transformStyle: "preserve-3d", width: "min(40vw,320px)", aspectRatio: "1" }}>
            {PIECES.map((p, i) => {
              const off = mod(i - active);
              return (
                <div
                  key={p.id}
                  aria-hidden={off !== 0}
                  className="absolute inset-0 transition-[opacity,filter] duration-700"
                  style={{
                    transform: `rotateY(${i * STEP}deg) translateZ(min(34vw,380px))`,
                    opacity: [1, 0.22, 0, 0.22][off],
                    filter: off === 0 ? "none" : "blur(2px)",
                    pointerEvents: "none",
                  }}
                >
                  <svg viewBox="0 0 200 200" role="img" aria-label={p.name} className="h-full w-full">
                    {p.art}
                  </svg>
                  <div className="absolute -bottom-2 left-[12%] right-[12%] h-5" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55), transparent 70%)" }} />
                </div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* details and controls */}
      <div className="relative z-20 grid gap-8 border-t px-6 pb-7 pt-6 md:grid-cols-12 md:items-end md:gap-10 md:px-10 md:pb-9" style={{ borderColor: HAIR }}>
        <div className="min-h-[10.5rem] md:col-span-7" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={piece.id}
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
              className="flex flex-col items-start gap-4"
            >
              <p className={`${display.className} text-[26px] leading-none tracking-[-0.02em] md:text-[32px]`}>
                {piece.name}
                <span className="ml-4 text-[17px] font-normal" style={{ color: MUTED }}>{piece.price}</span>
              </p>
              <p className="max-w-[30rem] text-[15px] font-light leading-[1.7]" style={{ color: "#B7BED2" }}>{piece.note}</p>
              <dl className="grid w-full max-w-[30rem] grid-cols-2 gap-x-8 border-t pt-3 text-[13px]" style={{ borderColor: HAIR }}>
                {piece.spec.map(([k, v]) => (
                  <div key={k}>
                    <dt style={{ color: MUTED }}>{k}</dt>
                    <dd className="mt-0.5">{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-5 md:col-span-5 md:items-end">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => go(idxRef.current - 1)} aria-label="Previous piece" className={arrow} style={{ borderColor: HAIR }}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <div role="tablist" aria-label="Choose a piece" className="flex items-center gap-6 overflow-x-auto">
              {PIECES.map((p, j) => {
                const on = j === active;
                return (
                  <button key={p.id} type="button" role="tab" aria-selected={on} onClick={() => pick(j)} className="relative whitespace-nowrap py-2 text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B]" style={{ color: on ? PLATINUM : MUTED }}>
                    {p.name.split(" ")[1]}
                    {on && <motion.span layoutId="eclipse-line" transition={{ duration: reduce ? 0 : 0.45 }} className="absolute inset-x-0 -bottom-px h-px" style={{ backgroundColor: GOLD }} />}
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={() => go(idxRef.current + 1)} aria-label="Next piece" className={arrow} style={{ borderColor: HAIR }}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
          <a
            href="#bag"
            className="inline-flex w-full items-center justify-center px-8 py-3.5 text-[15px] font-medium outline-none transition-colors duration-300 hover:bg-[#C9A24B] focus-visible:ring-2 focus-visible:ring-[#C9A24B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1024] md:w-auto"
            style={{ backgroundColor: PLATINUM, color: VELVET }}
          >
            Add to bag
          </a>
        </div>
      </div>
    </section>
  );
}