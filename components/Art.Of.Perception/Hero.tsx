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
/*  Playfair Display -> 900 weight, bold dramatic "Perception"                */
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
/*  gold   #B38B4D  long flowing lines, focus                                 */
/*  ink    #1E0C10  paragraph                                                 */
/* -------------------------------------------------------------------------- */

const LENS_RADIUS = 150;
const IMAGE_SRC = "/images/Art.Of.Perception/perception-removebg-preview.png";
const WORD = "Perception".split("");

const charVariants: Variants = {
  hidden: { y: "115%", rotate: 4 },
  show: (i: number) => ({
    y: "0%",
    rotate: 0,
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

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);

  /* ---------------------------- Cursor lens: black and white view under the cursor ---------------------------- */
  const localX = useMotionValue(0);
  const localY = useMotionValue(0);
  const radius = useMotionValue(0);
  const sx = useSpring(localX, { stiffness: 260, damping: 32 });
  const sy = useSpring(localY, { stiffness: 260, damping: 32 });
  const r = useSpring(radius, { stiffness: 140, damping: 20 });
  const lensMask = useMotionTemplate`radial-gradient(circle ${r}px at ${sx}px ${sy}px, #000 0%, #000 62%, transparent 100%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !bgRef.current) return;
    const rect = bgRef.current.getBoundingClientRect();
    const scale = bgRef.current.offsetWidth / rect.width; // accounts for the GSAP scale
    localX.set((e.clientX - rect.left) * scale);
    localY.set((e.clientY - rect.top) * scale);
    radius.set(LENS_RADIUS);
  };
  const handlePointerLeave = () => radius.set(0);

  /* ---------------------------- GSAP ---------------------------- */
  useEffect(() => {
    const lines = linesRef.current?.querySelectorAll("[data-line]");
    const star = linesRef.current?.querySelector("[data-star]");
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

      // Long gold lines draw themselves around the artwork
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

      {/* ------------------------------ Long flowing gold lines ------------------------------ */}
      <svg
        ref={linesRef}
        aria-hidden
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 z-[15] h-full w-full"
        fill="none"
      >
        {/* wide orbit around the artwork */}
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
        {/* second, thinner orbit crossing the first */}
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
        {/* long swooping line that runs behind the big word */}
        <path
          data-line
          d="M-80 790 C 240 650, 480 890, 800 770 S 1280 650, 1520 750"
          stroke="#B38B4D"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          style={{ strokeDashoffset: 1 }}
        />
        {/* thin vertical line ending in a small star, echoing the artwork */}
        <path
          data-line
          d="M1130 -10 L1130 330"
          stroke="#B38B4D"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          style={{ strokeDashoffset: 1 }}
        />
        <path
          data-star
          d="M1130 322 L1134 336 L1148 340 L1134 344 L1130 358 L1126 344 L1112 340 L1126 336 Z"
          fill="#B38B4D"
          style={{ opacity: 0 }}
        />
      </svg>

      {/* ------------------------------ One lockup: heading + paragraph + button ------------------------------ */}
      <div className="absolute inset-x-0 bottom-2 z-30 flex flex-col px-6 md:bottom-4 md:px-12">
        {/* Row 1: cursive line on the left, paragraph and button on the right */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <motion.span
            aria-hidden
            initial={{ clipPath: "inset(-30% 100% -30% -10%)" }}
            animate={{ clipPath: "inset(-30% -10% -30% -10%)" }}
            transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.4 }}
            className={`${script.className} pointer-events-none relative z-10 -mb-[0.1em] block -rotate-3 select-none text-[clamp(3.6rem,min(11vw,16vh),9.5rem)] leading-[0.9] text-[#8A1C32] sm:-mb-[0.22em]`}
            style={{ WebkitTextStroke: "2px #8A1C32" }}
          >
            The Art of
          </motion.span>

          <div className="mb-3 flex max-w-[19rem] flex-col items-start sm:mb-5">
            <motion.p
              custom={1.9}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="hidden text-[15px] leading-relaxed text-[#1E0C10]/80 sm:block"
            >
              Two people can look at the same face and see two different
              stories. What we notice first is shaped by memory, light and
              mood. This is a look at how seeing becomes understanding.
            </motion.p>

            <motion.button
              custom={2.1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              type="button"
              className="group relative overflow-hidden rounded-full border border-[#5A0F1E] bg-[#5A0F1E] px-9 py-4 text-sm font-medium tracking-wide text-[#F6EEE0] outline-none focus-visible:ring-2 focus-visible:ring-[#B38B4D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6EEE0] sm:mt-5"
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 origin-bottom bg-[#8A1C32]"
                initial={{ scaleY: 0 }}
                variants={{ hover: { scaleY: 1 } }}
                transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
              />
              <span className="relative z-10">In Detail</span>
            </motion.button>
          </div>
        </div>

        {/* Row 2: the big word, full width */}
        <div aria-hidden className="pointer-events-none flex select-none justify-center">
          <span
            className={`${display.className} flex text-[clamp(2.8rem,min(13.5vw,20vh),13rem)] leading-[0.95] tracking-[-0.04em] text-[#5A0F1E]`}
            style={{ WebkitTextStroke: "3px #5A0F1E" }}
          >
            {WORD.map((ch, i) => (
              <span key={i} className="block overflow-hidden px-[0.02em] pb-[0.14em] pt-[0.05em]">
                <motion.span
                  custom={i}
                  variants={charVariants}
                  initial="hidden"
                  animate="show"
                  className="block"
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}