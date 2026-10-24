"use client";

/**
 * Business landing hero — one 100vh section
 * Next.js (App Router) · TypeScript · Tailwind · GSAP · Framer Motion
 *
 * Install:  npm i gsap framer-motion
 * Place as: app/page.tsx
 *
 * Edit CONTENT below — nothing else needs to change.
 */

import { useEffect, useRef } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import gsap from "gsap";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ───────────── Your business content ───────────── */
const CONTENT = {
  brand: "Still Studio",
  nav: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
  ],
  headline: ["Quiet design", "that makes people", "look closer."],
  sub: "We design websites and brands for companies that would rather be remembered than loud.",
  cta: { label: "Book a free call", href: "#contact" },
  note: "Now booking for November",
};
/* ───────────────────────────────────────────────── */

const font = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });
const EASE = [0.16, 1, 0.3, 1] as const;

/** CTA that leans toward the cursor */
function MagneticButton({ label, href }: { label: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 14, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 14, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      data-cta
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className="inline-flex items-center gap-3 rounded-full border border-current px-7 py-4 text-base font-medium outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-[#1A2233]"
    >
      {label}
      <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-current" />
    </motion.a>
  );
}

export default function Experiment4() {
  const root = useRef<HTMLElement>(null);
  const disc = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.set(disc.current, {
        xPercent: -50,
        yPercent: -50,
        x: window.innerWidth * 0.7,
        y: window.innerHeight * 0.4,
      });

      // One orchestrated entrance
      if (!reduce) {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-line]", { yPercent: 115, duration: 1.5, stagger: 0.12 }, 0.15)
          .from(disc.current, { scale: 0, duration: 1.8, ease: "elastic.out(1, 0.6)" }, 0.8)
          .from("[data-fade]", { opacity: 0, duration: 1, stagger: 0.1 }, 1.0);
      }

      // Inertial follow
      const d = reduce ? 0 : 1;
      const moveX = gsap.quickTo(disc.current, "x", { duration: d, ease: "power3" });
      const moveY = gsap.quickTo(disc.current, "y", { duration: d, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        moveX(e.clientX);
        moveY(e.clientY);
      };

      // Disc reacts to what's under it: floods over the CTA, shrinks over links
      const onOver = (e: PointerEvent) => {
        const el = e.target as HTMLElement;
        const scale = el.closest("[data-cta]") ? 3.6 : el.closest("a,button") ? 0.45 : 1;
        gsap.to(disc.current, {
          scale,
          duration: reduce ? 0 : 0.9,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerover", onOver);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={root}
      className={`${font.className} relative isolate flex h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#ECEEF0] p-6 text-[#1A2233] md:p-10 [@media(pointer:fine)]:cursor-none`}
    >
      {/* Nav */}
      <header className="relative z-20 flex items-center justify-between text-sm">
        <a href="/" data-fade className="text-base font-semibold tracking-tight outline-none">
          {CONTENT.brand}
        </a>
        <nav className="hidden gap-8 md:flex" data-fade>
          {CONTENT.nav.map((n) => (
            <motion.a
              key={n.label}
              href={n.href}
              initial="rest"
              whileHover="hover"
              whileFocus="hover"
              className="relative outline-none"
            >
              {n.label}
              <motion.span
                variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute -bottom-1 left-0 h-px w-full origin-left bg-current"
              />
            </motion.a>
          ))}
        </nav>
        <span data-fade className="text-sm md:hidden">
          Menu
        </span>
      </header>

      {/* Headline — the memorable part */}
      <h1 className="relative z-10 font-light leading-[0.95] tracking-[-0.045em] text-[clamp(2.75rem,10.5vw,11rem)]">
        {CONTENT.headline.map((line) => (
          <span key={line} className="block overflow-hidden pb-[0.08em]">
            <span data-line className="block will-change-transform">
              {line}
            </span>
          </span>
        ))}
      </h1>

      {/* Disc: white + difference blend inverts whatever is beneath it */}
      <div
        ref={disc}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-30 h-[20vmin] w-[20vmin] rounded-full bg-white mix-blend-difference will-change-transform [@media(pointer:coarse)]:hidden"
      />

      {/* Value prop + CTA */}
      <footer className="relative z-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div data-fade className="max-w-md">
          <p className="text-lg leading-snug md:text-xl">{CONTENT.sub}</p>
          <p className="mt-4 flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-[#1A2233]" aria-hidden />
            {CONTENT.note}
          </p>
        </div>
        <div data-fade>
          <MagneticButton label={CONTENT.cta.label} href={CONTENT.cta.href} />
        </div>
      </footer>
    </main>
  );
}