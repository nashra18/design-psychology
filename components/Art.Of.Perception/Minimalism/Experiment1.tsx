"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";

const EASE = [0.76, 0, 0.24, 1] as const;
const smallCaps = "text-[0.75rem] uppercase tracking-[0.08em]";

const links = ["Work", "Studio", "Contact"];

// Splits a word into letters, each inside its own mask.
// `dot` adds an accent-coloured full stop as the last letter.
function Letters({ text, dot = false }: { text: string; dot?: boolean }) {
  const mask = "inline-block overflow-hidden pb-[0.1em] align-bottom";
  return (
    <span className="inline-block" aria-label={dot ? `${text}.` : text}>
      {text.split("").map((char, i) => (
        <span key={i} aria-hidden className={mask}>
          <span data-char className="inline-block will-change-transform">
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
      {dot && (
        <span aria-hidden className={mask}>
          <span data-char className="inline-block text-accent will-change-transform">
            .
          </span>
        </span>
      )}
    </span>
  );
}

export default function Experiment1() {
  const rootRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      if (counterRef.current) counterRef.current.textContent = "100";
      return;
    }

    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      const tl = gsap.timeline();

      // 1) Counter
      tl.to(counter, {
        value: 100,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = String(
              Math.round(counter.value)
            ).padStart(3, "0");
          }
        },
      });

      // 2) Letters fly up in random order
      tl.from(
        "[data-char]",
        {
          yPercent: 130,
          rotate: 8,
          duration: 1.1,
          ease: "expo.out",
          stagger: { each: 0.035, from: "random" },
        },
        0.9
      );

      // 3) Supporting UI fades in last
      tl.from(
        "[data-fade]",
        { opacity: 0, y: 12, duration: 0.8, ease: "power2.out", stagger: 0.08 },
        1.8
      );
    }, rootRef);

    // 4) Cursor parallax on the image
    const el = parallaxRef.current;
    const moveX = el ? gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }) : null;
    const moveY = el ? gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }) : null;

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      moveX?.(nx * 28);
      moveY?.(ny * 18);
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, [reduce]);

  return (
    <section
      ref={rootRef}
      className="grain flex min-h-svh flex-col bg-ink p-pad text-bone"
    >
      {/* NAV */}
      <header
        data-fade
        className="flex items-start justify-between border-b border-bone/20 pb-4"
      >
        <nav className={`flex gap-7 pt-1 min-[900px]:gap-10 ${smallCaps}`}>
          {links.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="group relative pb-1 transition-colors duration-300 hover:text-accent"
            >
              {label}
              <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <a
          href="#"
          aria-label="Atelier Hollis, home"
          className="grid size-[4.25rem] place-content-center border-2 border-bone font-body text-[0.8rem] font-bold leading-[1] tracking-[-0.03em] min-[900px]:size-[4.75rem] min-[900px]:text-[0.9rem]"
        >
          atelier
          <br />
          hollis.
        </a>
      </header>

      {/* STAGE */}
      <div className="relative grid flex-1 grid-cols-1 gap-y-10 py-8 min-[900px]:min-h-[40rem] min-[900px]:grid-cols-12 min-[900px]:gap-x-pad">
        {/* Vertical side text, accent colour */}
        <div
          data-fade
          className="absolute left-0 top-2 hidden gap-3 text-accent min-[900px]:flex"
        >
          <span className="rotate-180 font-body text-[1.1rem] font-bold [writing-mode:vertical-rl]">
            (2012) ▾
          </span>
          <span className="rotate-180 text-[0.625rem] font-semibold uppercase tracking-[0.12em] [writing-mode:vertical-rl]">
            &ldquo;Architecture studio for modern living&rdquo;
          </span>
        </div>

        {/* COPY: columns 2-9 */}
        <div className="flex flex-col justify-end min-[900px]:col-span-8 min-[900px]:col-start-2 min-[900px]:row-start-1 min-[900px]:pb-[2%]">
          <h1 className="font-body text-[clamp(3.5rem,10vw,11.5rem)] font-extrabold leading-[0.88] tracking-[-0.06em] text-white">
            <span className="block">
              <Letters text="Thoughtful" />
            </span>
            <span className="block">
              <Letters text="spaces" dot />
            </span>
          </h1>

          <p
            data-fade
            className="mt-5 font-display text-[1.25rem] italic leading-none text-bone"
          >
            [architecture studio]
          </p>

          <p
            data-fade
            className="mt-3 max-w-[27rem] text-[clamp(1rem,1.3vw,1.1875rem)] leading-[1.5] text-bone"
          >
            We design homes, workplaces and public spaces that begin with light,
            proportion and the way people actually live.
          </p>

          {/* BUTTON + dash row */}
          <div data-fade className="mt-16 flex flex-col items-start gap-6">
            <a
              href="#contact"
              className="group inline-flex w-fit items-center rounded-full bg-bone p-1.5 pl-7 text-ink transition-colors duration-500 hover:bg-accent"
            >
              {/* Rolling label */}
              <span className="relative block h-[1.25em] overflow-hidden text-[0.75rem] font-medium uppercase leading-[1.25] tracking-[0.12em]">
                <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                  Start a project
                </span>
                <span
                  aria-hidden
                  className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
                >
                  Start a project
                </span>
              </span>

              {/* Arrow circle: arrow exits right, a new one enters from the left */}
              <span className="relative ml-6 grid size-12 place-items-center overflow-hidden rounded-full bg-accent text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-bone">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="size-5 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[180%]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="absolute size-5 -translate-x-[180%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>

            <div className="flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.12em]">
              <span className="h-px w-10 shrink-0 bg-accent" />
              <span>Let&rsquo;s talk about your space</span>
            </div>
          </div>
        </div>

        {/* IMAGE: small portrait, columns 10-12, clear of all text */}
        <motion.div
          className="relative h-[40svh] w-[62%] overflow-hidden min-[900px]:col-span-3 min-[900px]:col-start-10 min-[900px]:row-start-1 min-[900px]:h-auto min-[900px]:w-full min-[900px]:self-center min-[900px]:aspect-[4/5]"
          initial={reduce ? false : { clipPath: "inset(0% 50% 0% 50%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
        >
          <div ref={parallaxRef} className="absolute -inset-6">
            <Image
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80"
              alt="Modern concrete and glass building facade"
              fill
              priority
              sizes="(max-width: 900px) 62vw, 25vw"
              className="object-cover grayscale contrast-[1.05]"
            />
          </div>

          {/* Counter + double rule */}
          <div className="absolute right-4 top-4 flex flex-col items-end gap-1.5 text-white">
            <span
              ref={counterRef}
              className="font-body text-[0.875rem] font-bold tabular-nums"
            >
              000
            </span>
            <span className="h-px w-8 bg-white" />
            <span className="h-px w-8 bg-white" />
          </div>

          {/* Outlined vertical word, accent colour */}
          <span
            data-fade
            className="absolute bottom-4 left-4 hidden rotate-180 font-body text-[1.75rem] font-bold uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-accent)] [writing-mode:vertical-rl] min-[900px]:block"
          >
            Concrete
          </span>
        </motion.div>
      </div>

      {/* FOOTER LINE */}
      <p
        data-fade
        className="border-t border-bone/20 pt-4 text-center text-[0.75rem] tracking-[0.02em]"
      >
        &ldquo; homes, workplaces, public spaces &rdquo;
      </p>
    </section>
  );
}