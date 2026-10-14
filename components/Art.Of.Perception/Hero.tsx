"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  type Variants,
} from "framer-motion";
import gsap from "gsap";
import { Playfair_Display, Great_Vibes, Inter } from "next/font/google";

/* -------------------------------------------------------------------------- */
/*  Fonts                                                                     */
/*  Great Vibes      -> long cursive swashes for "The Art of"                 */
/*  Playfair Display -> 900 weight, bold dramatic "Perception" + marquee      */
/*  Inter            -> paragraph, button                                     */
/* -------------------------------------------------------------------------- */
const script = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap" });
const display = Playfair_Display({ subsets: ["latin"], weight: ["900"], display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

/* -------------------------------------------------------------------------- */
/*  Palette                                                                   */
/*  ivory  #F6EEE0  page background                                           */
/*  wine   #5A0F1E  "Perception", button                                      */
/*  garnet #8A1C32  script line, hover                                        */
/*  gold   #B38B4D  lines, marquee outline, button icon                       */
/*  ink    #1E0C10  paragraph                                                 */
/* -------------------------------------------------------------------------- */

const LENS_RADIUS = 150;
const IMAGE_SRC = "/images/Art.Of.Perception/perception-removebg-preview.png";
const WORD = "Perception".split("");
const MARQUEE_WORDS = ["Seeing", "Feeling", "Remembering", "Imagining"];

type QuickTo = ReturnType<typeof gsap.quickTo>;

const charVariants: Variants = {
  hidden: { y: "60%", opacity: 0 },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 1.0 + i * 0.06 },
  }),
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* -------------------------------------------------------------------------- */
/*  Magnetic button with icon                                                 */
/* -------------------------------------------------------------------------- */
function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

function MagneticButton({ label }: { label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!wrapRef.current) return;
    const rc = wrapRef.current.getBoundingClientRect();
    x.set((e.clientX - (rc.left + rc.width / 2)) * 0.28);
    y.set((e.clientY - (rc.top + rc.height / 2)) * 0.28);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className="inline-block p-3 -m-3"
    >
      <button
        type="button"
        className="group relative inline-flex items-center gap-6 overflow-hidden rounded-full bg-[#5A0F1E] py-2 pl-8 pr-2 text-[15px] font-medium text-[#F6EEE0] outline-none transition-colors duration-500 hover:bg-[#8A1C32] focus-visible:ring-2 focus-visible:ring-[#B38B4D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6EEE0]"
      >
        {/* label slides up and is replaced by a copy */}
        <span className="relative block overflow-hidden">
          <span className="block transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:-translate-y-full">
            {label}
          </span>
          <span
            aria-hidden
            className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:-translate-y-full"
          >
            {label}
          </span>
        </span>

        {/* icon chip: the arrow exits top-right and a new one enters from bottom-left */}
        <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-[#B38B4D] text-[#5A0F1E] transition-colors duration-500 group-hover:bg-[#F6EEE0]">
          <ArrowUpRight className="h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-x-[160%] group-hover:-translate-y-[160%]" />
          <ArrowUpRight className="absolute h-5 w-5 -translate-x-[160%] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      </button>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const letterEls = useRef<(HTMLSpanElement | null)[]>([]);
  const letterTo = useRef<({ y: QuickTo; r: QuickTo } | null)[]>([]);

  /* ---------------------------- Cursor lens: black and white view under the cursor ---------------------------- */
  const localX = useMotionValue(0);
  const localY = useMotionValue(0);
  const radius = useMotionValue(0);
  const sx = useSpring(localX, { stiffness: 260, damping: 32 });
  const sy = useSpring(localY, { stiffness: 260, damping: 32 });
  const r = useSpring(radius, { stiffness: 140, damping: 20 });
  const lensMask = useMotionTemplate`radial-gradient(circle ${r}px at ${sx}px ${sy}px, #000 0%, #000 62%, transparent 100%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;

    // lens
    if (bgRef.current) {
      const rect = bgRef.current.getBoundingClientRect();
      const scale = bgRef.current.offsetWidth / rect.width; // accounts for the GSAP scale
      localX.set((e.clientX - rect.left) * scale);
      localY.set((e.clientY - rect.top) * scale);
      radius.set(LENS_RADIUS);
    }

    // letters of "Perception" lift and lean away from the cursor
    letterEls.current.forEach((el, i) => {
      const t = letterTo.current[i];
      const box = el?.parentElement;
      if (!el || !t || !box) return;
      const rc = box.getBoundingClientRect();
      const dx = e.clientX - (rc.left + rc.width / 2);
      const dy = e.clientY - (rc.top + rc.height / 2);
      const p = Math.max(0, 1 - Math.hypot(dx, dy) / 280) ** 2;
      t.y(-p * 48);
      t.r(p * (dx > 0 ? -10 : 10) * Math.min(1, Math.abs(dx) / 120));
    });
  };

  const handlePointerLeave = () => {
    radius.set(0);
    letterTo.current.forEach((t) => {
      t?.y(0);
      t?.r(0);
    });
  };

  /* ---------------------------- GSAP: image, lines, marquee ---------------------------- */
  useEffect(() => {
    const lines = sectionRef.current?.querySelectorAll("[data-line]");
    const star = sectionRef.current?.querySelector("[data-star]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      if (bgRef.current) gsap.set(bgRef.current, { opacity: 1 });
      if (lines) gsap.set(lines, { strokeDashoffset: 0 });
      if (star) gsap.set(star, { opacity: 1 });
      return;
    }
    if (!bgRef.current) return;

    const ctx = gsap.context(() => {
      // Background image grows upward from the bottom edge on load
      gsap.fromTo(
        bgRef.current,
        { scale: 0.4, yPercent: 18, opacity: 0, transformOrigin: "50% 100%" },
        {
          scale: 1,
          yPercent: 0,
          opacity: 1,
          duration: 1.8,
          ease: "power4.out",
        }
      );

      // Long gold lines draw themselves
      if (lines) {
        gsap.fromTo(
          lines,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 3, ease: "power3.inOut", stagger: 0.3, delay: 0.6 }
        );
      }
      if (star) {
        gsap.fromTo(
          star,
          { opacity: 0, scale: 0, transformOrigin: "50% 50%" },
          { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(2)", delay: 2.4 }
        );
      }

      // Diagonal marquee drifts forever behind the artwork
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, { xPercent: -50, duration: 36, ease: "none", repeat: -1 });
      }

      // Per-letter springs for the cursor interaction
      letterTo.current = letterEls.current.map((el) =>
        el
          ? {
              y: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" }),
              r: gsap.quickTo(el, "rotation", { duration: 0.7, ease: "power3.out" }),
            }
          : null
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`${body.className} relative isolate min-h-screen w-full overflow-hidden bg-[#F6EEE0] text-[#1E0C10]`}
    >
      <h1 className="sr-only">The Art of Perception</h1>

      {/* ------------------------------ Diagonal marquee (behind the artwork) ------------------------------ */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[44%] z-[5] w-[240vw] -translate-x-1/2 -translate-y-1/2 -rotate-6 select-none overflow-hidden"
      >
        <div ref={marqueeRef} className="flex w-max whitespace-nowrap">
          {[0, 1].map((set) => (
            <div key={set} className="flex shrink-0 items-center">
              {MARQUEE_WORDS.map((word) => (
                <div key={`${set}-${word}`} className="flex items-center">
                  <span
                    className={`${display.className} px-[3vw] text-[clamp(4rem,10vw,10rem)] leading-none text-transparent`}
                    style={{ WebkitTextStroke: "1.5px #B38B4D" }}
                  >
                    {word}
                  </span>
                  <svg viewBox="0 0 24 24" className="h-[clamp(1.5rem,3vw,3rem)] w-[clamp(1.5rem,3vw,3rem)] shrink-0 text-[#B38B4D]" fill="currentColor">
                    <path d="M12 0 L14.6 9.4 L24 12 L14.6 14.6 L12 24 L9.4 14.6 L0 12 L9.4 9.4 Z" />
                  </svg>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------ Background image (exact center) ------------------------------ */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div
          ref={bgRef}
          className="relative aspect-[3/2] w-[min(86vw,84vh)] will-change-transform"
          style={{ opacity: 0 }}
        >
          <Image
            src={IMAGE_SRC}
            alt="Collage of a woman's profile, a cream lily, burgundy petals and a gold arc"
            fill
            priority
            sizes="(max-width: 768px) 86vw, 84vh"
            className="object-contain"
          />

          {/* Lens: the same artwork in black and white, revealed only under the cursor */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{ maskImage: lensMask, WebkitMaskImage: lensMask }}
          >
            <Image
              src={IMAGE_SRC}
              alt=""
              fill
              sizes="(max-width: 768px) 86vw, 84vh"
              className="object-contain"
              style={{ filter: "grayscale(1) contrast(1.3) brightness(0.95)" }}
            />
          </motion.div>
        </div>
      </div>

      {/* ------------------------------ Long flowing lines ------------------------------ */}
      <svg
        ref={linesRef}
        aria-hidden
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 z-[15] h-full w-full"
        fill="none"
      >
        <path
          data-line
          d="M180 450 A540 290 0 1 1 1260 450 A540 290 0 1 1 180 450"
          transform="rotate(-14 720 450)"
          stroke="#B38B4D"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          style={{ strokeDashoffset: 1 }}
        />
        <path
          data-line
          d="M260 450 A470 250 0 1 1 1180 450 A470 250 0 1 1 260 450"
          transform="rotate(11 720 450)"
          stroke="#8A1C32"
          strokeOpacity="0.4"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          style={{ strokeDashoffset: 1 }}
        />
        <path
          data-line
          d="M1250 -10 L1250 188"
          stroke="#B38B4D"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          style={{ strokeDashoffset: 1 }}
        />
        <path
          data-star
          d="M1250 182 L1254 196 L1268 200 L1254 204 L1250 218 L1246 204 L1232 200 L1246 196 Z"
          fill="#B38B4D"
          style={{ opacity: 0 }}
        />
      </svg>

      {/* ------------------------------ Top left: cursive line with a drawn underline ------------------------------ */}
      <div className="pointer-events-none absolute left-6 top-6 z-30 md:left-12 md:top-8">
        <motion.span
          aria-hidden
          initial={{ clipPath: "inset(-30% 100% -30% -10%)" }}
          animate={{ clipPath: "inset(-30% -10% -30% -10%)" }}
          transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.4 }}
          className={`${script.className} block -rotate-3 select-none text-[clamp(4rem,min(12vw,17vh),11rem)] leading-[0.9] text-[#8A1C32]`}
          style={{ WebkitTextStroke: "2px #8A1C32" }}
        >
          The Art of
        </motion.span>
        <svg
          aria-hidden
          viewBox="0 0 600 24"
          preserveAspectRatio="none"
          className="-mt-1 h-4 w-[80%]"
          fill="none"
        >
          <path
            data-line
            d="M4 18 C 90 4, 210 24, 340 10 S 520 6, 596 16"
            stroke="#B38B4D"
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray={1}
            style={{ strokeDashoffset: 1 }}
          />
        </svg>
      </div>

      {/* ------------------------------ Left middle: scroll cue ------------------------------ */}
      <motion.div
        custom={2.4}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="absolute left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex md:left-12"
      >
        <span className="text-sm tracking-wide text-[#1E0C10]/70 [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative block h-16 w-px overflow-hidden bg-[#B38B4D]/40">
          <motion.span
            className="absolute left-0 top-0 block h-5 w-px bg-[#8A1C32]"
            animate={{ y: [-20, 64] }}
            transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
          />
        </span>
      </motion.div>

      {/* ------------------------------ Right middle: paragraph + button ------------------------------ */}
      <div className="absolute bottom-[24vw] right-6 z-30 flex max-w-[19rem] flex-col items-start gap-7 md:bottom-auto md:right-12 md:top-1/2 md:-translate-y-1/2">
        <motion.p
          custom={1.9}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="hidden text-[15px] leading-relaxed text-[#1E0C10]/80 md:block"
        >
          Two people can look at the same face and see two different stories.
          What we notice first is shaped by memory, light and mood. This is a
          look at how seeing becomes understanding.
        </motion.p>

        <motion.div custom={2.1} variants={fadeUp} initial="hidden" animate="show">
          <MagneticButton label="In Detail" />
        </motion.div>
      </div>

      {/* ------------------------------ Bottom: the big word, edge to edge ------------------------------ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex select-none justify-center md:bottom-3"
      >
        <span
          className={`${display.className} flex text-[clamp(2.8rem,min(15vw,24vh),15rem)] leading-[0.95] tracking-[-0.04em] text-[#5A0F1E]`}
          style={{ WebkitTextStroke: "3px #5A0F1E" }}
        >
          {WORD.map((ch, i) => (
            <span key={i} className="block px-[0.01em] pb-[0.14em] pt-[0.05em]">
              <motion.span
                custom={i}
                variants={charVariants}
                initial="hidden"
                animate="show"
                className="block"
              >
                <span
                  ref={(el) => {
                    letterEls.current[i] = el;
                  }}
                  className="block will-change-transform"
                >
                  {ch}
                </span>
              </motion.span>
            </span>
          ))}
        </span>
      </div>
    </section>
  );
}