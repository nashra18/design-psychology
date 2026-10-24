"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type PanInfo, type Variants } from "framer-motion";
import { Manrope } from "next/font/google";

/* -------------------------------------------------------------------------- */
/*  CONCEPT: "Browse, don't hunt"                                             */
/*  Navigation is the design. A clear top bar (with a full-screen menu on     */
/*  mobile), a wide photograph, and a dock under it that lets people move     */
/*  between pieces by tab, arrow button, arrow key or swipe. The headline     */
/*  and call to action change with the piece, so every screen has a next step. */
/* -------------------------------------------------------------------------- */

const font = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "600"], display: "swap" });

const PAPER = "#F1F0ED";
const INK = "#141414";
const MUTED = "#6F6F6B";
const LINE = "rgba(20,20,20,0.14)";
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2000&q=80`;

const NAV = [
  { label: "Shop", href: "#shop" },
  { label: "Collections", href: "#collections" },
  { label: "Journal", href: "#journal" },
  { label: "About", href: "#about" },
];

const PIECES = [
  {
    id: "edit",
    name: "The edit",
    cta: "Shop the edit",
    note: "Seven pieces for the whole year, in wool, cotton and linen. Nothing you will need to replace.",
    src: unsplash("1517502166878-35c93a0072f0"),
    alt: "White hangers on a clothes rail",
    credit: "Andrej Lišakov",
  },
  {
    id: "knit",
    name: "Wool knit",
    cta: "Shop knitwear",
    note: "Midweight merino that is soft at the collar and warm at the cuff. Washes by hand and keeps its shape.",
    src: unsplash("1603906650843-b58e94d9df4d"),
    alt: "Folded grey and cream wool knitwear",
    credit: "Haley Truong",
  },
  {
    id: "cap",
    name: "Cotton cap",
    cta: "Shop caps",
    note: "Washed cotton twill with a low crown and an adjustable strap. It softens with every wear.",
    src: unsplash("1543678577-3a30e977f0c8"),
    alt: "A plain white cap against a white building",
    credit: "kemal alkan",
  },
];

const HEADLINE = ["Wear less.", "Wear longer."];

const wipe: Variants = {
  enter: (d: number) => ({ clipPath: d > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }),
  center: { clipPath: "inset(0% 0% 0% 0%)" },
  exit: { opacity: 1 },
};

const lineVariants: Variants = {
  hidden: { y: "105%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 1.2, ease: EASE_OUT, delay: 0.6 + i * 0.12 } }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({ opacity: 1, transition: { duration: 0.9, ease: "easeOut", delay } }),
};

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

export default function Experiment7() {
  const reduce = useReducedMotion();
  const [{ i, d }, setView] = useState({ i: 0, d: 1 });
  const [menu, setMenu] = useState(false);
  const piece = PIECES[i];

  const step = useCallback((dir: 1 | -1) => {
    setView((v) => ({ i: (v.i + dir + PIECES.length) % PIECES.length, d: dir }));
  }, []);
  const select = (next: number) => setView((v) => ({ i: next, d: next >= v.i ? 1 : -1 }));

  /* keyboard: arrows browse, Escape closes the menu */
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

  /* swipe on touch screens */
  const onPanEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 60 || Math.abs(info.offset.x) < Math.abs(info.offset.y)) return;
    step(info.offset.x < 0 ? 1 : -1);
  };

  return (
    <section
      className={`${font.className} relative flex min-h-[100svh] w-full flex-col overflow-hidden`}
      style={{ backgroundColor: PAPER, color: INK }}
    >
      {/* ------------------------------ top bar ------------------------------ */}
      <motion.header
        variants={fadeIn}
        custom={0.2}
        initial="hidden"
        animate="show"
        className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10"
      >
        <a href="#top" className="text-[17px] font-semibold tracking-[-0.02em] outline-none focus-visible:underline">
          Plain Cloth
        </a>

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="text-[15px] underline decoration-transparent decoration-1 underline-offset-[6px] outline-none transition-[text-decoration-color] duration-300 hover:decoration-current focus-visible:decoration-current"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <a href="#bag" className="text-[15px] underline decoration-transparent decoration-1 underline-offset-[6px] outline-none transition-[text-decoration-color] duration-300 hover:decoration-current focus-visible:decoration-current">
            Bag (0)
          </a>
          <button
            type="button"
            onClick={() => setMenu(true)}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            className="text-[15px] outline-none focus-visible:underline md:hidden"
          >
            Menu
          </button>
        </div>
      </motion.header>

      {/* ------------------------------ photograph ------------------------------ */}
      <motion.div
        initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.5, ease: EASE, delay: 0.1 }}
        onPan={undefined}
        onPanEnd={onPanEnd}
        className="relative mx-3 min-h-[46svh] flex-1 touch-pan-y overflow-hidden bg-[#DAD9D4] md:mx-4"
      >
        <AnimatePresence initial={false} custom={d}>
          <motion.div
            key={piece.id}
            custom={d}
            variants={wipe}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 1.1, ease: EASE }}
            className="absolute inset-0"
          >
            <motion.div
              initial={{ scale: reduce ? 1 : 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: reduce ? 0 : 1.6, ease: EASE_OUT }}
              className="absolute inset-0"
            >
              <Image
                src={piece.src}
                alt={piece.alt}
                fill
                priority={piece.id === "edit"}
                unoptimized
                sizes="100vw"
                className="object-cover"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* dock: the way to move between pieces */}
        <div
          role="group"
          aria-label="Browse pieces"
          className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full p-1.5 backdrop-blur-md"
          style={{ backgroundColor: "rgba(241,240,237,0.86)" }}
        >
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous piece"
            className="hidden h-10 w-10 place-items-center rounded-full outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#141414] md:grid"
          >
            <Chevron dir="left" />
          </button>

          <div role="tablist" aria-label="Pieces" className="flex items-center">
            {PIECES.map((p, idx) => {
              const on = idx === i;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => select(idx)}
                  className="relative whitespace-nowrap rounded-full px-3 py-2.5 text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#141414] md:px-5 md:text-[14px]"
                  style={{ color: on ? PAPER : INK }}
                >
                  {on && (
                    <motion.span
                      layoutId="dock-pill"
                      transition={{ duration: reduce ? 0 : 0.5, ease: EASE_OUT }}
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: INK }}
                    />
                  )}
                  <span className="relative">{p.name}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next piece"
            className="hidden h-10 w-10 place-items-center rounded-full outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#141414] md:grid"
          >
            <Chevron dir="right" />
          </button>
        </div>

        <p
          className="absolute bottom-0 right-0 z-10 hidden px-3 py-2 text-[12px] leading-none md:block"
          style={{ backgroundColor: PAPER, color: MUTED }}
        >
          Photo by {piece.credit} on Unsplash
        </p>
      </motion.div>

      {/* ------------------------------ headline + action ------------------------------ */}
      <div className="grid gap-6 px-6 pb-7 pt-6 md:grid-cols-12 md:items-end md:gap-10 md:px-10 md:pb-9 md:pt-8">
        <h1
          className="text-[clamp(2.4rem,5.4vw,5.2rem)] font-light leading-[1.02] tracking-[-0.045em] md:col-span-7"
          aria-label={HEADLINE.join(" ")}
        >
          {HEADLINE.map((line, idx) => (
            <span key={line} aria-hidden className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <motion.span custom={idx} variants={lineVariants} initial="hidden" animate="show" className="block">
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="min-h-[7.5rem] md:col-span-5 md:min-h-[8.5rem]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={piece.id}
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
              className="flex flex-col items-start gap-5"
            >
              <p className="max-w-[26rem] text-[16px] leading-[1.6]" style={{ color: MUTED }}>
                {piece.note}
              </p>
              <a
                href="#shop"
                className="inline-flex items-center gap-3 rounded-full border px-6 py-3 text-[15px] font-medium outline-none transition-colors duration-300 hover:bg-[#141414] hover:text-[#F1F0ED] focus-visible:ring-2 focus-visible:ring-[#141414] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1F0ED]"
                style={{ borderColor: INK }}
              >
                {piece.cta}
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ------------------------------ mobile menu ------------------------------ */}
      <AnimatePresence>
        {menu && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
            className="absolute inset-0 z-50 flex flex-col px-6 py-5"
            style={{ backgroundColor: PAPER }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[17px] font-semibold tracking-[-0.02em]">Plain Cloth</span>
              <button
                type="button"
                autoFocus
                onClick={() => setMenu(false)}
                className="text-[15px] outline-none focus-visible:underline"
              >
                Close
              </button>
            </div>

            <nav aria-label="Menu" className="mt-14 flex flex-col">
              {NAV.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  onClick={() => setMenu(false)}
                  className="border-t py-5 text-[2.4rem] font-light leading-none tracking-[-0.04em] outline-none focus-visible:underline"
                  style={{ borderColor: LINE }}
                >
                  {n.label}
                </a>
              ))}
              <a
                href="#bag"
                onClick={() => setMenu(false)}
                className="border-y py-5 text-[2.4rem] font-light leading-none tracking-[-0.04em] outline-none focus-visible:underline"
                style={{ borderColor: LINE }}
              >
                Bag (0)
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}