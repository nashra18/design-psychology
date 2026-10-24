"use client";

/**
 * ORBIT — Awwwards-style single-screen hero
 * Next.js (App Router) · TypeScript · Tailwind · GSAP · Framer Motion · pure SVG
 *
 * Install:  npm i gsap framer-motion
 * Place as: app/page.tsx
 *
 * What's happening:
 *  1. A coral blob is a live SVG path, rebuilt every frame. It breathes on its own
 *     and stretches toward your cursor.
 *  2. The headline runs through an SVG displacement filter. The faster you move
 *     the mouse, the more the letters melt like liquid, then settle.
 *  3. Orbit rings draw themselves in, then rotate with a dot orbiting the blob.
 *  4. The circular "Start a project" badge (SVG textPath) spins faster when you
 *     move quickly.
 *  5. Marquee strip (Framer Motion) with SVG star separators.
 */

import { useEffect, useRef } from "react";
import { DM_Sans, Syne } from "next/font/google";
import gsap from "gsap";
import { motion, useReducedMotion } from "framer-motion";

const display = Syne({ subsets: ["latin"], weight: ["800"], display: "swap" });
const body = DM_Sans({ subsets: ["latin"], display: "swap" });

const EASE = [0.16, 1, 0.3, 1] as const;
const LETTERS = "ORBIT".split("");
const SERVICES = ["Brand identity", "Websites", "Motion", "Type design", "Campaigns"];

/* ───────────── Blob geometry ───────────── */
const N = 8;
const PHASES = Array.from({ length: N }, (_, i) => i * 1.7);
const SPEEDS = Array.from({ length: N }, (_, i) => 0.5 + (i % 3) * 0.23);

function blobPath(t: number, px: number, py: number, push: number): string {
  const pointerAngle = Math.atan2(py, px);
  const pts = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    let r =
      128 +
      18 * Math.sin(t * SPEEDS[i] + PHASES[i]) +
      8 * Math.sin(t * 1.9 * SPEEDS[i] + PHASES[i] * 2);
    r += push * Math.max(0, Math.cos(a - pointerAngle)) * 42; // stretch toward cursor
    return [200 + Math.cos(a) * r, 200 + Math.sin(a) * r];
  });

  // Closed Catmull-Rom spline → cubic Béziers
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % N];
    const p3 = pts[(i + 2) % N];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + " Z";
}

function Star() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" className="shrink-0">
      <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
    </svg>
  );
}

export default function Experiment5() {
  const reduceMotion = useReducedMotion();

  const root = useRef<HTMLElement>(null);
  const blobShift = useRef<SVGGElement>(null);
  const blobPathEl = useRef<SVGPathElement>(null);
  const turbulence = useRef<SVGFETurbulenceElement>(null);
  const displacement = useRef<SVGFEDisplacementMapElement>(null);
  const badgeSpin = useRef<SVGGElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = { x: 0, y: 0, tx: 0, ty: 0, vel: 0, disp: 0 };

    const ctx = gsap.context(() => {
      /* ── Intro: one orchestrated sequence ── */
      if (!reduce) {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(blobPathEl.current, { scale: 0, svgOrigin: "200 200", duration: 1.8, ease: "elastic.out(1, 0.55)" }, 0.1)
          .fromTo(".ring-solid", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: "power3.inOut" }, 0.3)
          .from(".ring-dashed, .ring-dot", { opacity: 0, duration: 1.2 }, 1.0)
          .from("[data-letter]", { yPercent: 125, rotate: 10, duration: 1.5, stagger: 0.08 }, 0.55)
          .from("[data-fade]", { opacity: 0, y: 10, duration: 1, stagger: 0.08 }, 1.2);

        // Rings keep orbiting
        gsap.to(".ring-a", { rotation: 360, svgOrigin: "200 200", duration: 28, ease: "none", repeat: -1 });
        gsap.to(".ring-b", { rotation: -360, svgOrigin: "200 200", duration: 46, ease: "none", repeat: -1 });
      }

      /* ── Badge spin, speed driven by pointer velocity ── */
      const spin = reduce
        ? null
        : gsap.to(badgeSpin.current, { rotation: 360, svgOrigin: "75 75", duration: 14, ease: "none", repeat: -1 });

      /* ── Pointer tracking ── */
      const onMove = (e: PointerEvent) => {
        s.tx = (e.clientX / window.innerWidth) * 2 - 1;
        s.ty = (e.clientY / window.innerHeight) * 2 - 1;
        s.vel = Math.min(s.vel + Math.hypot(e.movementX, e.movementY) * 0.35, 140);
      };
      window.addEventListener("pointermove", onMove);

      /* ── Single frame loop: blob + liquid filter + badge ── */
      const frame = (time: number) => {
        s.x += (s.tx - s.x) * 0.06;
        s.y += (s.ty - s.y) * 0.06;
        s.vel *= 0.92;
        s.disp += (Math.min(s.vel, 90) - s.disp) * 0.12;

        const push = Math.min(Math.hypot(s.x, s.y) * 0.45 + s.vel / 160, 1);
        blobPathEl.current?.setAttribute("d", blobPath(time, s.x, s.y, push));
        blobShift.current?.setAttribute("transform", `translate(${(s.x * 16).toFixed(1)} ${(s.y * 16).toFixed(1)})`);

        displacement.current?.setAttribute("scale", s.disp.toFixed(1));
        turbulence.current?.setAttribute(
          "baseFrequency",
          `${(0.008 + Math.sin(time * 0.4) * 0.002).toFixed(4)} ${(0.016 + Math.cos(time * 0.3) * 0.004).toFixed(4)}`
        );

        spin?.timeScale(1 + s.vel * 0.08);
      };

      if (reduce) {
        blobPathEl.current?.setAttribute("d", blobPath(0, 0, 0, 0));
      } else {
        gsap.ticker.add(frame);
      }

      return () => {
        window.removeEventListener("pointermove", onMove);
        gsap.ticker.remove(frame);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={root}
      className={`${body.className} relative isolate h-[100svh] w-full overflow-hidden bg-[#2438F5] text-white`}
    >
      {/* SVG filter definition (kept at 0×0, never display:none) */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>
          <filter id="orbit-liquid" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence ref={turbulence} type="fractalNoise" baseFrequency="0.008 0.016" numOctaves={2} seed={4} result="noise" />
            <feDisplacementMap ref={displacement} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Film grain */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-40 h-full w-full mix-blend-overlay">
        <filter id="orbit-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#orbit-grain)" opacity="0.22" />
      </svg>

      {/* Blob + orbit rings */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 grid place-items-center">
        <svg viewBox="0 0 400 400" className="h-[min(88vmin,900px)] w-[min(88vmin,900px)] overflow-visible">
          <g ref={blobShift}>
            <path ref={blobPathEl} fill="#FF6A3D" />
          </g>

          <g className="ring-a">
            <circle className="ring-solid" cx="200" cy="200" r="190" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="0.8" pathLength={1} strokeDasharray="1" />
            <circle className="ring-dot" cx="390" cy="200" r="5" fill="white" />
          </g>
          <g className="ring-b">
            <circle className="ring-dashed" cx="200" cy="200" r="165" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="0.8" strokeDasharray="2 7" />
            <circle className="ring-dot" cx="35" cy="200" r="3" fill="white" />
          </g>
        </svg>
      </div>

      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-6 text-sm md:p-10">
        <a data-fade href="/" className="text-base font-semibold tracking-tight outline-none focus-visible:underline">
          Orbit Studio
        </a>
        <nav data-fade className="flex gap-6 md:gap-10">
          {["Work", "Studio", "Contact"].map((label) => (
            <motion.a
              key={label}
              href={`#${label.toLowerCase()}`}
              initial="rest"
              whileHover="hover"
              whileFocus="hover"
              className="relative outline-none"
            >
              {label}
              <motion.span
                variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute -bottom-1 left-0 h-px w-full origin-left bg-current"
              />
            </motion.a>
          ))}
        </nav>
      </header>

      {/* Liquid headline */}
      <div className="absolute inset-0 z-10 grid place-items-center">
        <h1
          aria-label="Orbit"
          style={{ filter: "url(#orbit-liquid)" }}
          className={`${display.className} flex text-[clamp(5.5rem,20vw,26rem)] leading-[0.8] tracking-[-0.04em]`}
        >
          {LETTERS.map((ch, i) => (
            <span key={i} aria-hidden className="inline-block overflow-hidden px-[0.02em] pb-[0.08em] pt-[0.04em]">
              <span data-letter className="inline-block will-change-transform">
                {ch}
              </span>
            </span>
          ))}
        </h1>
      </div>

      {/* Intro copy */}
      <p data-fade className="absolute bottom-20 left-6 z-20 max-w-[18rem] text-base leading-snug md:bottom-24 md:left-10 md:text-lg">
        A design studio for brands that want to be looked at twice.
      </p>

      {/* Spinning SVG badge */}
      <motion.a
        data-fade
        href="#contact"
        aria-label="Start a project"
        whileHover={{ scale: 1.12, rotate: -8 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        className="absolute bottom-20 right-6 z-20 block h-[116px] w-[116px] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#2438F5] md:bottom-24 md:right-10 md:h-[150px] md:w-[150px]"
      >
        <svg viewBox="0 0 150 150" className="h-full w-full overflow-visible">
          <defs>
            <path id="orbit-badge-circle" d="M75,75 m-56,0 a56,56 0 1,1 112,0 a56,56 0 1,1 -112,0" />
          </defs>
          <g ref={badgeSpin}>
            <text fill="white" fontSize="11.5" fontWeight="600">
              <textPath href="#orbit-badge-circle" textLength="350" lengthAdjust="spacing">
                Start a project • Start a project • 
              </textPath>
            </text>
          </g>
          <circle cx="75" cy="75" r="34" fill="white" />
          <path d="M60 90 L90 60 M68 60 H90 V82" fill="none" stroke="#2438F5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.a>

      {/* Marquee */}
      <div data-fade className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-white/30 py-3 text-sm">
        <motion.div
          className="flex w-max whitespace-nowrap"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 32, ease: "linear", repeat: Infinity }}
        >
          {[0, 1].map((k) => (
            <div key={k} aria-hidden={k === 1} className="flex items-center gap-8 pr-8">
              {SERVICES.map((item) => (
                <span key={item} className="flex items-center gap-8">
                  {item}
                  <Star />
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}