"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const EASE = [0.76, 0, 0.24, 1] as const;

/* ------------------------------------------------------------------ */
/* Big headline — sized by width AND height so it never pushes the     */
/* images out of the viewport                                          */
/* ------------------------------------------------------------------ */
function Headline({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  return (
    <h2
      ref={ref}
      aria-label={text}
      className="shrink-0 font-body text-[min(19.5vw,23svh)] font-extrabold leading-[0.85] tracking-[-0.06em] text-ink max-[899px]:text-[19vw]"
    >
      {text.split("").map((c, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={reduce ? false : { y: "115%", rotate: 6 }}
            animate={inView ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: i * 0.05 }}
          >
            {c}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* One project: image + "0" behind it + "1" in front of it             */
/* ------------------------------------------------------------------ */
type CardProps = {
  digits: [string, string];
  src: string;
  alt: string;
  title: string;
  meta: string;
  className?: string; // grid placement (desktop)
  aspect: string; // mobile aspect ratio
  numberSide?: "left" | "right";
  delay?: number;
};

function ProjectCard({
  digits,
  src,
  alt,
  title,
  meta,
  className = "",
  aspect,
  numberSide = "right",
  delay = 0,
}: CardProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const drop = (d: number) => ({
    initial: reduce ? false : { y: -80, opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : undefined,
    transition: { duration: 1.1, ease: EASE, delay: delay + d },
  });

  return (
    <article
      ref={ref}
      className={`group relative isolate min-[900px]:flex min-[900px]:flex-col ${className}`}
    >
      {/*
        This wrapper has NO z-index / transform / opacity, so both digits
        share the card's stacking context with the image:
        "0" => z-0 (behind image) · image => z-10 · "1" => z-20 (in front)
      */}
      <div
        className={`pointer-events-none absolute top-[-0.52em] flex text-[min(18vw,11svh)] font-medium leading-[1] tracking-[-0.04em] text-ink min-[900px]:text-[min(9vw,13svh)] ${
          numberSide === "right" ? "left-[58%]" : "left-[6%]"
        }`}
      >
        <motion.span aria-hidden className="relative z-0 block" {...drop(0.35)}>
          {digits[0]}
        </motion.span>
        <motion.span aria-hidden className="relative z-20 block" {...drop(0.5)}>
          {digits[1]}
        </motion.span>
      </div>

      {/* IMAGE (z-10) — fills the available height on desktop */}
      <motion.a
        href="#"
        aria-label={`${title} — view project`}
        className={`relative z-10 block w-full overflow-hidden bg-ink/10 ${aspect} min-[900px]:aspect-auto min-[900px]:min-h-0 min-[900px]:flex-1`}
        initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={{ duration: 1.4, ease: EASE, delay }}
      >
        <motion.div
          style={reduce ? undefined : { y: imgY }}
          className="absolute -inset-[7%]"
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            className="object-cover grayscale transition-[filter,transform] duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-[1.06] group-hover:grayscale-0"
          />
        </motion.div>
      </motion.a>

      {/* CAPTION */}
      <motion.div
        className="mt-2.5 flex shrink-0 items-center justify-between gap-6 text-[0.7rem] uppercase tracking-[0.08em]"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8, ease: "easeOut", delay: delay + 0.9 }}
      >
        <div className="flex items-baseline gap-3">
          <p className="font-bold">{title}</p>
          <p className="text-ink/60">{meta}</p>
        </div>

        {/* arrow: exits right, a new one slides in from the left */}
        <span className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border border-ink/30 transition-colors duration-500 group-hover:bg-ink group-hover:text-bone">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[220%]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="absolute size-3.5 -translate-x-[220%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </span>
      </motion.div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Section — exactly one screen tall on desktop                        */
/* ------------------------------------------------------------------ */
export default function Experiment3() {
  const paraRef = useRef<HTMLDivElement>(null);
  const paraIn = useInView(paraRef, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  return (
    <section
      id="work"
      className="grain flex flex-col bg-bone px-pad pb-4 pt-5 text-ink min-[900px]:h-svh min-[900px]:overflow-hidden"
    >
      <Headline text="Projects" />

      {/* STAGE — takes all remaining height */}
      <div className="mt-14 grid grid-cols-1 gap-y-20 min-[900px]:mt-0 min-[900px]:min-h-0 min-[900px]:flex-1 min-[900px]:grid-cols-12 min-[900px]:grid-rows-[minmax(0,1fr)] min-[900px]:gap-x-pad min-[900px]:gap-y-0 min-[900px]:pt-[7.5svh]">
        {/* 01 — tall portrait, full stage height */}
        <ProjectCard
          digits={["0", "1"]}
          src="https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=1800&q=85"
          alt="Concrete tower with geometric facade against the sky"
          title="House of Light"
          meta="Residential · 2023"
          aspect="aspect-[4/5]"
          numberSide="right"
          className="min-[900px]:col-span-5 min-[900px]:col-start-1 min-[900px]:row-start-1 min-[900px]:h-full"
        />

        {/* Vertical paragraph */}
        <div
          ref={paraRef}
          className="min-[900px]:col-span-2 min-[900px]:col-start-7 min-[900px]:row-start-1 min-[900px]:self-start min-[900px]:pt-[2svh]"
        >
          <div className="overflow-hidden">
            <motion.p
              className="max-w-[26rem] text-[1rem] leading-[1.35] min-[900px]:max-w-none min-[900px]:text-[min(0.95rem,2.3svh)] min-[900px]:[writing-mode:vertical-rl]"
              initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
              animate={paraIn ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } : undefined}
              transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
            >
              Every project begins with light, <br /> proportion and the way people
              actually live. <br />
              Walk through our selected homes,<br /> workplaces and public spaces. <br />
              Start a conversation about yours.
            </motion.p>
          </div>
        </div>

        {/* 02 — landscape, bottom right, ~55% of stage height */}
        <ProjectCard
          digits={["0", "2"]}
          src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1800&q=85"
          alt="Modern building facade shot from below"
          title="North Pavilion"
          meta="Public space · 2021"
          aspect="aspect-[4/3]"
          numberSide="left"
          delay={0.15}
          className="min-[900px]:col-span-5 min-[900px]:col-start-8 min-[900px]:row-start-1 min-[900px]:h-[56%] min-[900px]:self-end"
        />
      </div>

      {/* FOOTER */}
      <div className="mt-10 flex shrink-0 items-center justify-between border-t border-ink/20 pt-3 text-[0.7rem] uppercase tracking-[0.08em] min-[900px]:mt-3">
        <span>Selected work</span>
        <span>2012 — 2024</span>
      </div>
    </section>
  );
}