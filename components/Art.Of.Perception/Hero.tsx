"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
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
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

/* -------------------------------------------------------------------------- */
/*  Palette (dark, cinematic)                                                 */
/*  night  #12040A  page background                                           */
/*  cream  #F3E6D0  heading, paragraph, button                                */
/*  gold   #D9B26F  cursive line, orbit line, marquee stars                   */
/*  garnet #8A1C32  button fill, glow                                         */
/*  wine   #5A0F1E  artwork tones                                             */
/* -------------------------------------------------------------------------- */

const IMAGE_SRC = "/images/Art.Of.Perception/perception-removebg-preview.png";
const WORD = "Perception".split("");
const MARQUEE_WORDS = ["Seeing", "Feeling", "Remembering", "Imagining"];

type QuickTo = ReturnType<typeof gsap.quickTo>;

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const CSS = `
@keyframes hero-marquee { to { transform: translate3d(-50%,0,0); } }
@keyframes hero-drop { 0% { transform: translateY(-100%); } 100% { transform: translateY(420%); } }
@media (prefers-reduced-motion: reduce) { .hero-anim { animation: none !important; } }
@media (hover: hover) { .hero-root, .hero-root * { cursor: none !important; } }
`;

const charVariants: Variants = {
  hidden: { y: "70%", opacity: 0 },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.05 },
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
/*  Button: cream pill, garnet circle that floods the pill on hover           */
/* -------------------------------------------------------------------------- */
function MagneticButton({ label }: { label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onEnter = () => {
    rect.current = wrapRef.current?.getBoundingClientRect() ?? null; // measured once
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
        <span className="relative z-10 transition-colors duration-500 group-hover:text-[#F3E6D0]">{label}</span>

        <span className="relative ml-6 h-12 w-12 shrink-0">
          {/* this circle grows until it covers the whole pill */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[#8A1C32] transition-transform duration-[650ms] ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-[9]"
          />
          <span className="relative z-10 grid h-full w-full place-items-center text-[#F3E6D0]">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 -rotate-45 transition-transform duration-500 ease-out group-hover:rotate-0"
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
  const preRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<SVGPathElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorShown = useRef(false);
  const tos = useRef<{
    iX: QuickTo;
    iY: QuickTo;
    hX: QuickTo;
    hY: QuickTo;
    cX: QuickTo;
    cY: QuickTo;
  } | null>(null);

  /* Scroll depth (transform only) */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const headScrollY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const imgScrollY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  /* Mouse: depth + custom cursor. No layout reads here. */
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !tos.current) return;
    const t = tos.current;
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    t.iX(nx * 30);
    t.iY(ny * 20);
    t.hX(nx * -16);
    t.hY(ny * -10);
    t.cX(e.clientX);
    t.cY(e.clientY);
    if (!cursorShown.current && cursorRef.current) {
      cursorShown.current = true;
      gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 });
    }
  };

  const handlePointerOver = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !cursorRef.current) return;
    const big = !!(e.target as HTMLElement).closest("[data-cursor]");
    gsap.to(cursorRef.current, { scale: big ? 4 : 1, duration: 0.4, ease: "power3.out", overwrite: "auto" });
  };

  const handlePointerLeave = () => {
    const t = tos.current;
    if (t) {
      t.iX(0);
      t.iY(0);
      t.hX(0);
      t.hY(0);
    }
    if (cursorRef.current) {
      cursorShown.current = false;
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.3 });
    }
  };

  /* ---------------------------- GSAP: preloader, then the hero sequence ---------------------------- */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      if (preRef.current) gsap.set(preRef.current, { display: "none" });
      if (bgRef.current) gsap.set(bgRef.current, { opacity: 1 });
      if (orbitRef.current) gsap.set(orbitRef.current, { strokeDashoffset: 0 });
      setReady(true);
      return;
    }
    if (!bgRef.current) return;

    const ctx = gsap.context(() => {
      // Smooth followers for mouse depth and cursor
      if (imgInnerRef.current && headRef.current && cursorRef.current) {
        const opts = { duration: 0.9, ease: "power3.out" };
        const copts = { duration: 0.35, ease: "power3.out" };
        tos.current = {
          iX: gsap.quickTo(imgInnerRef.current, "x", opts),
          iY: gsap.quickTo(imgInnerRef.current, "y", opts),
          hX: gsap.quickTo(headRef.current, "x", opts),
          hY: gsap.quickTo(headRef.current, "y", opts),
          cX: gsap.quickTo(cursorRef.current, "x", copts),
          cY: gsap.quickTo(cursorRef.current, "y", copts),
        };
      }

      const counter = { v: 0 };
      const tl = gsap.timeline();

      // 1. counter runs 00 to 100
      tl.to(counter, {
        v: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) counterRef.current.textContent = String(Math.round(counter.v)).padStart(2, "0");
        },
      })
        // 2. counter leaves, curtain lifts
        .to(counterRef.current, { yPercent: -120, opacity: 0, duration: 0.5, ease: "power3.in" })
        .to(
          preRef.current,
          {
            yPercent: -100,
            duration: 1,
            ease: "power4.inOut",
            onComplete: () => {
              gsap.set(preRef.current, { display: "none" });
            },
          },
          "-=0.1"
        )
        // 3. the hero starts as the curtain clears
        .add(() => setReady(true), "-=0.55")
        .fromTo(
          bgRef.current,
          { scale: 0.4, yPercent: 18, opacity: 0, transformOrigin: "50% 100%" },
          {
            scale: 1,
            yPercent: 0,
            opacity: 1,
            duration: 1.8,
            ease: "power4.out",
          },
          "<"
        )
        .fromTo(
          orbitRef.current,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 3, ease: "power3.inOut" },
          "<0.3"
        );
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
      className={`${body.className} hero-root relative isolate h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#12040A] text-[#F3E6D0]`}
    >
      <style>{CSS}</style>
      <h1 className="sr-only">The Art of Perception</h1>

      {/* ------------------------------ Preloader ------------------------------ */}
      <div ref={preRef} aria-hidden className="fixed inset-0 z-[70] bg-[#0B0206]">
        <p className="absolute left-6 top-6 text-sm text-[#F3E6D0]/60 md:left-12 md:top-8">The Art of Perception</p>
        <div className="absolute bottom-4 left-6 overflow-hidden md:bottom-6 md:left-12">
          <span
            ref={counterRef}
            className={`${display.className} block text-[clamp(5rem,18vw,14rem)] leading-[0.9] text-[#F3E6D0]`}
          >
            00
          </span>
        </div>
      </div>

      {/* ------------------------------ Custom cursor ------------------------------ */}
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] -ml-2 -mt-2 hidden h-4 w-4 rounded-full bg-[#F3E6D0] opacity-0 mix-blend-difference [@media(hover:hover)]:block"
      />

      {/* ------------------------------ Static atmosphere: glow + grain ------------------------------ */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[90vh] w-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(138,28,50,0.5),rgba(138,28,50,0)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[60] opacity-[0.07]"
        style={{ backgroundImage: GRAIN }}
      />

      {/* ------------------------------ One orbit line ------------------------------ */}
      <svg
        aria-hidden
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
        fill="none"
      >
        <path
          ref={orbitRef}
          d="M180 450 A540 285 0 1 1 1260 450 A540 285 0 1 1 180 450"
          transform="rotate(-12 720 450)"
          stroke="#D9B26F"
          strokeOpacity="0.7"
          strokeWidth="1.3"
          pathLength={1}
          strokeDasharray={1}
          style={{ strokeDashoffset: 1 }}
        />
      </svg>

      {/* ------------------------------ Background image (exact center) ------------------------------ */}
      <motion.div
        style={{ y: imgScrollY }}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      >
        <div
          ref={bgRef}
          className="relative aspect-[3/2] w-[min(84vw,80vh)] will-change-transform"
          style={{ opacity: 0 }}
        >
          <div ref={imgInnerRef} className="absolute inset-0 will-change-transform">
            <Image
              src={IMAGE_SRC}
              alt="Collage of a woman's profile, a cream lily, burgundy petals and a gold arc"
              fill
              priority
              sizes="(max-width: 768px) 84vw, 80vh"
              className="object-contain"
            />
          </div>
        </div>
      </motion.div>

      {/* ------------------------------ Heading: whole title in one place ------------------------------ */}
      <motion.div
        style={{ y: headScrollY }}
        className="pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-center md:top-6"
      >
        <div ref={headRef} aria-hidden className="inline-flex flex-col items-start will-change-transform">
          <motion.span
            initial={{ y: "40%", opacity: 0, rotate: -9 }}
            animate={ready ? { y: "0%", opacity: 1, rotate: -3 } : { y: "40%", opacity: 0, rotate: -9 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className={`${script.className} relative z-10 -mb-[0.2em] ml-[2%] block select-none text-[clamp(2.4rem,min(7.5vw,11vh),7rem)] leading-[0.9] text-[#D9B26F]`}
            style={{ WebkitTextStroke: "1.5px currentColor" }}
          >
            The Art of
          </motion.span>

          <span
            className={`${display.className} flex text-[clamp(3rem,min(12vw,18vh),12rem)] leading-[0.95] tracking-[-0.04em] text-[#F3E6D0]`}
            style={{ WebkitTextStroke: "2px currentColor" }}
          >
            {WORD.map((ch, i) => (
              <span
                key={i}
                data-cursor="big"
                className="pointer-events-auto block px-[0.01em] pb-[0.12em] pt-[0.05em] transition-[transform,color] duration-300 ease-out hover:-translate-y-[7%] hover:text-[#D9B26F]"
              >
                <motion.span custom={i} variants={charVariants} initial="hidden" animate={state} className="block">
                  {ch}
                </motion.span>
              </span>
            ))}
          </span>
        </div>
      </motion.div>

      {/* ------------------------------ Paragraph + button together ------------------------------ */}
      <div className="absolute bottom-[4.75rem] left-6 right-6 z-30 flex flex-col items-start gap-5 md:bottom-auto md:left-auto md:right-12 md:top-1/2 md:w-[20rem] md:-translate-y-1/2 md:gap-7">
        <motion.span
          custom={0.8}
          variants={fadeUp}
          initial="hidden"
          animate={state}
          aria-hidden
          className="hidden h-px w-12 bg-[#D9B26F] md:block"
        />
        <motion.p
          custom={0.9}
          variants={fadeUp}
          initial="hidden"
          animate={state}
          className="max-w-[22rem] text-[14px] leading-[1.65] text-[#F3E6D0]/90 md:text-[17px]"
        >
          Two people can look at the same face and see two different stories.
          What we notice first is shaped by memory, light and mood. This is a
          look at how seeing becomes understanding.
        </motion.p>
        <motion.div custom={1.1} variants={fadeUp} initial="hidden" animate={state}>
          <MagneticButton label="In Detail" />
        </motion.div>
      </div>

      {/* ------------------------------ Left middle: scroll cue ------------------------------ */}
      <motion.div
        custom={1.3}
        variants={fadeUp}
        initial="hidden"
        animate={state}
        className="absolute left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex md:left-12"
      >
        <span className="text-sm tracking-wide text-[#F3E6D0]/70 [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative block h-16 w-px overflow-hidden bg-[#D9B26F]/30">
          <span className="hero-anim absolute left-0 top-0 block h-4 w-px animate-none bg-[#D9B26F] [animation:hero-drop_1.8s_ease-in-out_infinite]" />
        </span>
      </motion.div>

      {/* ------------------------------ Bottom marquee strip ------------------------------ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-[#F3E6D0]/15 bg-[#12040A]/70"
      >
        <div className="hero-anim flex w-max whitespace-nowrap [animation:hero-marquee_32s_linear_infinite]">
          {[0, 1].map((set) => (
            <div key={set} className="flex shrink-0 items-center">
              {MARQUEE_WORDS.map((word) => (
                <div key={`${set}-${word}`} className="flex items-center">
                  <span
                    className={`${display.className} px-[2.5vw] py-3 text-[clamp(1.25rem,2.6vw,2.4rem)] leading-none text-[#F3E6D0]/90`}
                  >
                    {word}
                  </span>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#D9B26F]" fill="currentColor">
                    <path d="M12 0 L14.6 9.4 L24 12 L14.6 14.6 L12 24 L9.4 14.6 L0 12 L9.4 9.4 Z" />
                  </svg>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}