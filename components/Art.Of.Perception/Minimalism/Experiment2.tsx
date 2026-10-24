
"use client";

import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const sans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const projects = [
  {
    no: "01",
    title: "The Quiet House",
    type: "Private residence",
    year: "2026",
  },
  {
    no: "02",
    title: "A Study in Stillness",
    type: "Interior architecture",
    year: "2025",
  },
  {
    no: "03",
    title: "Living Between",
    type: "Residential",
    year: "2025",
  },
];

function ArchitectureDrawing() {
  return (
    <svg
      viewBox="0 0 600 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full overflow-visible"
      aria-label="Abstract architectural perspective drawing"
      role="img"
    >
      <defs>
        <pattern
          id="forma-grid"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M24 0H0V24"
            stroke="#34372C"
            strokeWidth=".45"
            opacity=".15"
          />
        </pattern>

        <clipPath id="drawing-clip">
          <rect x="25" y="25" width="550" height="650" />
        </clipPath>
      </defs>

      <g clipPath="url(#drawing-clip)">
        <rect width="600" height="700" fill="url(#forma-grid)" />

        {/* Ground plane */}
        <g className="architecture-line" stroke="#737967" strokeWidth="1">
          <path d="M40 545L300 395L560 545L300 690Z" />
          <path d="M40 545L560 545" />
          <path d="M105 583L365 433" />
          <path d="M170 620L430 470" />
          <path d="M235 656L495 507" />
          <path d="M170 470L430 620" />
          <path d="M235 433L495 583" />
          <path d="M300 395V690" />
        </g>

        {/* Main architectural volume */}
        <g
          className="architecture-line"
          stroke="#303329"
          strokeWidth="1.4"
          strokeLinejoin="round"
        >
          <path d="M120 292L300 188L480 292L300 397Z" />
          <path d="M120 292V475L300 579V397" />
          <path d="M300 397L480 292V475L300 579" />
          <path d="M120 292L300 397L480 292" />
          <path d="M120 475L300 370L480 475" />
          <path d="M300 188V370" />
          <path d="M210 240L390 344V527" />
          <path d="M390 240L210 344V527" />
        </g>

        {/* Window / void */}
        <g
          className="architecture-line"
          stroke="#888C77"
          strokeWidth="1.2"
        >
          <path d="M218 350L300 302L382 350V449L300 497L218 449Z" />
          <path d="M300 302V497" />
          <path d="M218 400L300 449L382 400" />
        </g>

        {/* Floating section plane */}
        <g
          className="architecture-line"
          stroke="#9B9D8D"
          strokeWidth=".9"
        >
          <path d="M65 190L300 54L535 190" />
          <path d="M65 190L300 326L535 190" />
          <path d="M65 190V300" strokeDasharray="3 6" />
          <path d="M535 190V300" strokeDasharray="3 6" />
          <path d="M300 54V188" strokeDasharray="3 6" />
        </g>

        {/* Measurement lines */}
        <g
          className="architecture-line"
          stroke="#9B9D8D"
          strokeWidth=".8"
        >
          <path d="M95 292H63M95 475H63M75 292V475" />
          <path d="M63 292L70 299M63 292L70 285" />
          <path d="M63 475L70 468M63 475L70 482" />
          <path d="M120 495L300 600L480 495" strokeDasharray="2 5" />
        </g>

        {/* Reference markers */}
        <g fill="#858A72">
          <circle className="drawing-point" cx="300" cy="188" r="3" />
          <circle className="drawing-point" cx="120" cy="292" r="3" />
          <circle className="drawing-point" cx="480" cy="292" r="3" />
          <circle className="drawing-point" cx="300" cy="579" r="3" />
        </g>

        {/* Crosshairs */}
        <g
          className="architecture-line"
          stroke="#303329"
          strokeWidth=".8"
        >
          <path d="M300 30V44M293 37H307" />
          <path d="M548 190H562M555 183V197" />
          <path d="M38 545H52M45 538V552" />
        </g>
      </g>
    </svg>
  );
}

export default function Experiment5() {
  const root = useRef<HTMLElement>(null);
  const drawing = useRef<HTMLDivElement>(null);
  const magnetic = useRef<HTMLAnchorElement>(null);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = root.current;

    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let removePointerListeners: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>(
        ".architecture-line path"
      );

      const points = gsap.utils.toArray<SVGCircleElement>(
        ".drawing-point"
      );

      if (prefersReducedMotion) {
        gsap.set(paths, {
          strokeDasharray: "none",
          strokeDashoffset: 0,
          opacity: 1,
        });

        gsap.set(
          [
            ".top-item",
            ".hero-word",
            ".hero-description",
            ".hero-meta",
            ".work-heading",
            ".project-row",
            ".closing-word",
          ],
          {
            clearProps: "transform,opacity,visibility",
          }
        );

        return;
      }

      /*
       * INTRO
       * Keep all initial motion inside one timeline.
       * This prevents separate animation systems from
       * fighting over the same elements.
       */

      paths.forEach((path) => {
        const length = path.getTotalLength();

        path.style.strokeDasharray = `${length} ${length}`;
        path.style.strokeDashoffset = `${length}`;
      });

      gsap.set(".drawing-point", {
        scale: 0,
        transformOrigin: "50% 50%",
      });

      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
        onComplete: () => {
          // Restore the SVG's original dash styling
          // after the drawing animation has finished.
          paths.forEach((path) => {
            path.style.strokeDasharray = "";
            path.style.strokeDashoffset = "";
          });
        },
      });

      intro
        .from(
          ".top-item",
          {
            y: -8,
            opacity: 0,
            duration: 0.75,
            stagger: 0.06,
          },
          0
        )
        .from(
          ".hero-word",
          {
            yPercent: 105,
            duration: 1.15,
            stagger: 0.14,
            ease: "power4.out",
          },
          0.12
        )
        .from(
          ".hero-description",
          {
            y: 12,
            opacity: 0,
            duration: 0.8,
          },
          0.55
        )
        .from(
          ".hero-meta",
          {
            opacity: 0,
            y: 5,
            duration: 0.7,
            stagger: 0.08,
          },
          0.45
        )
        .to(
          paths,
          {
            strokeDashoffset: 0,
            duration: 1.35,
            stagger: 0.008,
            ease: "power2.inOut",
          },
          0.3
        )
        .to(
          ".drawing-point",
          {
            scale: 1,
            duration: 0.45,
            stagger: 0.1,
            ease: "back.out(1.5)",
          },
          1.15
        );

      /*
       * QUIET DETAILS
       * These animations are deliberately slow and subtle.
       */

      gsap.to(".drawing-point", {
        opacity: 0.55,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        stagger: 0.4,
        ease: "sine.inOut",
        delay: 2,
      });

      // One slow orbit; the second ellipse stays still.
      gsap.to(".blueprint-orbit", {
        rotation: 360,
        svgOrigin: "300 330",
        duration: 90,
        repeat: -1,
        ease: "none",
      });

      // Almost imperceptible floating movement.
      gsap.to(".drawing-float", {
        y: -4,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /*
       * SCROLL REVEALS
       * Small distances make these feel less theatrical.
       */

      gsap.from(".work-heading", {
        y: 18,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".work-heading",
          start: "top 86%",
          once: true,
        },
      });

      gsap.from(".project-row", {
        y: 16,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".project-list",
          start: "top 84%",
          once: true,
        },
      });

      gsap.from(".closing-word", {
        yPercent: 105,
        duration: 0.9,
        stagger: 0.13,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".closing-section",
          start: "top 78%",
          once: true,
        },
      });

      /*
       * POINTER RESPONSE
       * The illustration follows the cursor only slightly.
       */

      const visual = drawing.current;

      if (visual) {
        const quickX = gsap.quickTo(visual, "x", {
          duration: 0.8,
          ease: "power3.out",
        });

        const quickY = gsap.quickTo(visual, "y", {
          duration: 0.8,
          ease: "power3.out",
        });

        const onPointerMove = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;

          const bounds = visual.getBoundingClientRect();

          if (!bounds.width || !bounds.height) return;

          const x =
            (event.clientX - bounds.left) / bounds.width - 0.5;

          const y =
            (event.clientY - bounds.top) / bounds.height - 0.5;

          quickX(x * 5);
          quickY(y * 5);
        };

        const onPointerLeave = () => {
          quickX(0);
          quickY(0);
        };

        visual.addEventListener("pointermove", onPointerMove);
        visual.addEventListener("pointerleave", onPointerLeave);

        removePointerListeners = () => {
          visual.removeEventListener("pointermove", onPointerMove);
          visual.removeEventListener("pointerleave", onPointerLeave);
        };
      }
    }, element);

    return () => {
      removePointerListeners?.();
      ctx.revert();
    };
  }, []);

  const handleMagneticMove = (
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    if (reduceMotion) return;

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();

    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(target, {
      x: x * 0.06,
      y: y * 0.06,
      duration: 0.65,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const resetMagnetic = () => {
    gsap.to(magnetic.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <main
      ref={root}
      className={`${sans.className} overflow-clip bg-[#F3F2EC] text-[#303329]`}
    >
      {/* HEADER */}
      <header className="top-item relative z-30 flex h-[72px] items-center justify-between border-b border-[#303329]/15 px-5 sm:px-8 lg:px-14">
        <a href="#home" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center border border-[#303329]/60 text-[10px] font-semibold">
            F.
          </span>

          <span className="text-[12px] font-medium tracking-[0.18em]">
            FORMA STUDIO
          </span>
        </a>

        <div className="top-item hidden items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-[#303329]/50 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#858A72]" />
          Independent by nature
        </div>

        <a
          href="#contact"
          className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.13em]"
        >
          <span>Start a conversation</span>

          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative mx-auto grid min-h-[calc(100svh-72px)] max-w-[1800px] grid-cols-1 lg:grid-cols-[1fr_0.92fr]"
      >
        {/* Editorial copy */}
        <div className="relative z-10 flex flex-col justify-between px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-16 lg:px-14 lg:pb-12 lg:pt-14">
          <div className="hero-meta flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-[#303329]/55">
            <span className="h-px w-8 bg-[#858A72]" />
            Architecture / Space / Form
          </div>

          <div className="relative z-10 my-16 lg:my-0">
            <div className="mb-5 flex items-center gap-3">
              <span className="text-[10px] text-[#858A72]">
                01 — 03
              </span>

              <span className="h-px w-10 bg-[#303329]/20" />

              <span className="text-[10px] text-[#303329]/55">
                An ongoing study
              </span>
            </div>

            <div
              className={`${serif.className} text-[clamp(3.9rem,11.5vw,11.5rem)] leading-[0.82] tracking-[-0.07em]`}
            >
              <div className="overflow-hidden pb-[0.12em]">
                <span className="hero-word block">Space,</span>
              </div>

              <div className="ml-[0.32em] overflow-hidden pb-[0.12em]">
                <span className="hero-word block italic text-[#858A72]">
                  reimagined.
                </span>
              </div>
            </div>

            <p className="hero-description mt-9 max-w-[285px] text-[12px] leading-[1.9] text-[#303329]/65 sm:ml-[12%] sm:text-[13px]">
              We explore the relationship between architecture, light, and
              the way we experience everyday life.
            </p>

            <div className="hero-meta mt-7 sm:ml-[12%]">
              <a
                href="#work"
                className="group inline-flex items-center gap-4 border-b border-[#303329]/30 pb-2.5 text-[10px] uppercase tracking-[0.13em]"
              >
                Explore selected work

                <ArrowDown
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-y-1"
                />
              </a>
            </div>
          </div>

          <div className="hero-meta flex items-end justify-between border-t border-[#303329]/15 pt-4">
            <div>
              <p className="mb-1 text-[9px] uppercase tracking-[0.16em] text-[#303329]/45">
                Based in
              </p>

              <p className="text-[11px]">India / Everywhere</p>
            </div>

            <div className="text-right">
              <p className="mb-1 text-[9px] uppercase tracking-[0.16em] text-[#303329]/45">
                Current focus
              </p>

              <p className="text-[11px]">Spaces with intention</p>
            </div>
          </div>
        </div>

        {/* SVG ART DIRECTION */}
        <div className="hero-visual relative min-h-[420px] overflow-hidden border-t border-[#303329]/15 sm:min-h-[500px] lg:min-h-0 lg:border-l lg:border-t-0">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-5 top-5 z-10 flex flex-col gap-1 sm:left-8 sm:top-8">
              <span className="text-[9px] uppercase tracking-[0.16em] text-[#303329]/60">
                Figure 001
              </span>

              <span className="text-[9px] text-[#303329]/40">
                Spatial composition
              </span>
            </div>

            <div className="absolute bottom-6 left-5 z-10 flex items-center gap-2 text-[9px] uppercase tracking-[0.13em] text-[#303329]/55 sm:bottom-8 sm:left-8">
              <span className="h-px w-5 bg-[#858A72]" />
              Study of volume / 001
            </div>

            <div className="absolute bottom-6 right-5 z-10 text-[9px] text-[#303329]/45 sm:bottom-8 sm:right-8">
              600 × 700
            </div>
          </div>

          <div
            ref={drawing}
            className="drawing-float absolute inset-[7%_0_4%] flex items-center justify-center will-change-transform"
          >
            <div className="relative aspect-[6/7] w-[min(100%,600px)]">
              <ArchitectureDrawing />

              {/* Orbiting reference geometry */}
              <svg
                viewBox="0 0 600 700"
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <g className="blueprint-orbit">
                  <ellipse
                    cx="300"
                    cy="330"
                    rx="240"
                    ry="120"
                    stroke="#858A72"
                    strokeWidth=".8"
                    strokeDasharray="2 7"
                    opacity=".65"
                    transform="rotate(-28 300 330)"
                  />

                  <circle
                    cx="519"
                    cy="218"
                    r="3"
                    fill="#858A72"
                  />
                </g>

                {/* Static secondary orbit for visual balance */}
                <g>
                  <ellipse
                    cx="300"
                    cy="330"
                    rx="190"
                    ry="255"
                    stroke="#303329"
                    strokeWidth=".65"
                    strokeDasharray="1 9"
                    opacity=".35"
                  />

                  <circle
                    cx="300"
                    cy="75"
                    r="2.5"
                    fill="#303329"
                    opacity=".65"
                  />
                </g>
              </svg>
            </div>
          </div>

          {/* Static technical indicator */}
          <div className="pointer-events-none absolute right-5 top-20 flex h-12 w-12 items-center justify-center sm:right-8 sm:top-24">
            <svg
              viewBox="0 0 48 48"
              className="h-full w-full"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="24"
                r="21"
                stroke="#303329"
                strokeWidth=".6"
                strokeDasharray="1 4"
              />

              <circle
                cx="24"
                cy="24"
                r="13"
                stroke="#858A72"
                strokeWidth=".8"
              />

              <path
                d="M24 8V24L35 30"
                stroke="#303329"
                strokeWidth=".8"
              />

              <circle
                cx="24"
                cy="24"
                r="2"
                fill="#858A72"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* PROJECT INDEX */}
      <section
        id="work"
        className="border-t border-[#303329]/20 px-5 py-20 sm:px-8 sm:py-28 lg:px-14"
      >
        <div className="mx-auto max-w-[1800px]">
          <div className="work-heading mb-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-5 text-[9px] uppercase tracking-[0.2em] text-[#858A72]">
                Selected projects / 2025—26
              </p>

              <h2
                className={`${serif.className} text-5xl tracking-[-0.055em] sm:text-7xl`}
              >
                Objects of thought.
              </h2>
            </div>

            <p className="max-w-[250px] text-[11px] leading-[1.9] text-[#303329]/55">
              Every project is an exercise in restraint, materiality, and
              the art of leaving room for life.
            </p>
          </div>

          <div className="project-list border-t border-[#303329]/20">
            {projects.map((project) => (
              <a
                key={project.no}
                href="#contact"
                className="project-row group relative grid grid-cols-[36px_1fr_32px] items-center gap-3 overflow-hidden border-b border-[#303329]/20 py-7 sm:grid-cols-[70px_1fr_160px_40px] sm:py-9"
              >
                <span className="relative z-10 text-[10px] text-[#303329]/45">
                  {project.no}
                </span>

                <span
                  className={`${serif.className} relative z-10 text-[clamp(1.8rem,4.5vw,4rem)] leading-none tracking-[-0.04em] transition-transform duration-500 group-hover:translate-x-1.5`}
                >
                  {project.title}
                </span>

                <span className="relative z-10 hidden text-[10px] uppercase tracking-[0.09em] text-[#303329]/50 sm:block">
                  {project.type}

                  <span className="mt-1 block normal-case tracking-normal">
                    {project.year}
                  </span>
                </span>

                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#303329]/25 transition-colors duration-300 group-hover:border-[#303329] group-hover:bg-[#303329] group-hover:text-[#F3F2EC]">
                  <ArrowUpRight size={15} strokeWidth={1.3} />
                </span>

                <span className="absolute inset-0 -translate-x-full bg-[#E8E8DE] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <footer
        id="contact"
        className="closing-section overflow-hidden bg-[#303329] px-5 py-20 text-[#F3F2EC] sm:px-8 sm:py-28 lg:px-14 lg:py-36"
      >
        <div className="mx-auto max-w-[1800px]">
          <div className="mb-8 text-[9px] uppercase tracking-[0.2em] text-white/45">
            An idea worth building
          </div>

          <div
            className={`${serif.className} text-[clamp(3.8rem,11vw,10rem)] leading-[0.86] tracking-[-0.06em]`}
          >
            <div className="overflow-hidden pb-[0.1em]">
              <span className="closing-word block">Less noise.</span>
            </div>

            <div className="overflow-hidden pb-[0.1em]">
              <span className="closing-word block italic text-[#B5B9A6]">
                More meaning.
              </span>
            </div>
          </div>

          <div className="mt-14 flex flex-col justify-between gap-8 border-t border-white/20 pt-6 sm:flex-row sm:items-end">
            <p className="max-w-[270px] text-[11px] leading-[1.9] text-white/60">
              Have a space, a story, or an idea that deserves thoughtful
              design? Let&apos;s give it form.
            </p>

            <a
              ref={magnetic}
              href="mailto:studio@example.com"
              onMouseMove={handleMagneticMove}
              onMouseLeave={resetMagnetic}
              className="group flex w-fit items-center gap-6 text-[11px] uppercase tracking-[0.13em]"
            >
              Start a conversation

              <span className="grid h-12 w-12 place-items-center rounded-full border border-white/35 transition-colors duration-300 group-hover:bg-[#F3F2EC] group-hover:text-[#303329]">
                <ArrowUpRight size={18} strokeWidth={1.2} />
              </span>
            </a>
          </div>

          <div className="mt-20 flex flex-col justify-between gap-3 text-[9px] uppercase tracking-[0.14em] text-white/35 sm:flex-row">
            <span>FORMA Studio</span>
            <span>Architecture / Space / Form</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
