"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Hanken_Grotesk } from "next/font/google";

/* -------------------------------------------------------------------------- */
/*  CONCEPT: "Plain Cloth"                                                    */
/*  One quiet frame, one photograph. Choosing a piece from the index wipes    */
/*  the next photograph up over the last, like turning a page.                */
/*  Single typeface, two colours, no decoration.                              */
/* -------------------------------------------------------------------------- */

const font = Hanken_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500"], display: "swap" });

const PAPER = "#ECEBE7";
const INK = "#191918";
const MUTED = "#6E6D69";
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1800&q=80`;

const PIECES = [
  {
    id: "edit",
    name: "The edit",
    note: "Seven pieces for the whole year. Nothing you will need to replace.",
    src: unsplash("1517502166878-35c93a0072f0"),
    alt: "White hangers on a clothes rail",
    credit: "Andrej Lišakov",
  },
  {
    id: "knit",
    name: "Wool knit",
    note: "Midweight merino, soft at the collar and warm at the cuff. Washes by hand.",
    src: unsplash("1603906650843-b58e94d9df4d"),
    alt: "Folded grey and cream wool knitwear",
    credit: "Haley Truong",
  },
  {
    id: "cap",
    name: "Cotton cap",
    note: "Washed cotton twill with a low crown. It softens with every wear.",
    src: unsplash("1543678577-3a30e977f0c8"),
    alt: "A plain white cap against a white building",
    credit: "kemal alkan",
  },
];

const HEADLINE = ["Clothes that need", "no explaining."];

const lineVariants: Variants = {
  hidden: { y: "105%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1.2, ease: EASE_OUT, delay: 0.5 + i * 0.12 },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({ opacity: 1, transition: { duration: 1, ease: "easeOut", delay } }),
};

export default function Experiment6() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const piece = PIECES[active];

  return (
    <section
      className={`${font.className} grid min-h-[100svh] w-full grid-rows-[auto_1fr] md:grid-cols-12 md:grid-rows-1`}
      style={{ backgroundColor: PAPER, color: INK }}
    >
      {/* ------------------------------ photograph ------------------------------ */}
      <div className="p-3 md:order-2 md:col-span-7 md:p-4 md:pl-0">
        <motion.div
          initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.1 }}
          className="relative h-[52svh] w-full overflow-hidden bg-[#DAD8D2] md:h-full md:min-h-[calc(100svh-2rem)]"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={piece.id}
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 1, transition: { duration: reduce ? 0 : 1.2 } }}
              transition={{ duration: reduce ? 0 : 1.1, ease: EASE }}
              className="absolute inset-0"
            >
              <motion.div
                initial={{ scale: reduce ? 1 : 1.12 }}
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
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <p
            className="absolute bottom-0 left-0 z-10 px-3 py-2 text-[12px] leading-none"
            style={{ backgroundColor: PAPER, color: MUTED }}
          >
            Photo by {piece.credit} on Unsplash
          </p>
        </motion.div>
      </div>

      {/* --------------------------------- copy --------------------------------- */}
      <div className="flex flex-col justify-between gap-14 px-6 pb-8 pt-8 md:order-1 md:col-span-5 md:gap-0 md:px-12 md:py-10">
        <motion.p
          custom={0.3}
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="text-[15px] font-medium tracking-[-0.01em]"
        >
          Plain Cloth
        </motion.p>

        <div className="flex flex-col gap-8">
          <h1
            className="text-[clamp(2.5rem,5vw,5rem)] font-light leading-[1.04] tracking-[-0.04em]"
            aria-label={HEADLINE.join(" ")}
          >
            {HEADLINE.map((line, i) => (
              <span key={line} aria-hidden className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <motion.span custom={i} variants={lineVariants} initial="hidden" animate="show" className="block">
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            custom={1.1}
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="max-w-[26rem] text-[17px] leading-[1.6]"
            style={{ color: MUTED }}
          >
            A small wardrobe of wool, cotton and linen. Cut simply, made to last for years instead of seasons.
          </motion.p>
        </div>

        <motion.div custom={1.4} variants={fadeIn} initial="hidden" animate="show" className="flex flex-col gap-8">
          <ul>
            {PIECES.map((p, i) => {
              const on = i === active;
              return (
                <li key={p.id} className="border-t" style={{ borderColor: `${INK}26` }}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="block w-full py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#191918] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ECEBE7]"
                  >
                    <span
                      className="block text-[17px] tracking-[-0.01em] transition-opacity duration-500"
                      style={{ opacity: on ? 1 : 0.45 }}
                    >
                      {p.name}
                    </span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: reduce ? 0 : 0.6, ease: EASE_OUT }}
                          className="block overflow-hidden"
                        >
                          <span className="block max-w-[24rem] pt-2 text-[15px] leading-[1.55]" style={{ color: MUTED }}>
                            {p.note}
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              );
            })}
            <li className="border-t" style={{ borderColor: `${INK}26` }} />
          </ul>

          <a
            href="#shop"
            className="w-fit text-[15px] font-medium underline decoration-1 underline-offset-[6px] outline-none transition-[text-decoration-thickness] duration-300 hover:decoration-2 focus-visible:ring-2 focus-visible:ring-[#191918] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ECEBE7]"
          >
            Shop the collection
          </a>
        </motion.div>
      </div>
    </section>
  );
}