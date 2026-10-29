
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCENE_DURATION = 6500;

const SCENES = [
  { label: "OUR BELIEF", number: "01", name: "Wonder" },
  { label: "OUR APPROACH", number: "02", name: "Discovery" },
  { label: "OUR PURPOSE", number: "03", name: "Growth" },
  { label: "OUR PROMISE", number: "04", name: "Confidence" },
];

type SceneProps = { active: boolean };

function WonderScene({ active }: SceneProps) {
  return (
    <div className="experiment-scene wonder-scene" aria-hidden={!active}>
      <div className="wonder-top">
        <span className="eyebrow">A PLACE TO BEGIN</span>
        <span className="scene-symbol">✳</span>
      </div>

      <div className="wonder-copy">
        <div className="kinetic-clip">
          <span className="kinetic-line">Learning</span>
        </div>
        <div className="kinetic-clip kinetic-indent">
          <span className="kinetic-line serif">begins with</span>
        </div>
        <div className="kinetic-clip">
          <span className="kinetic-line accent-word">wonder.</span>
        </div>
      </div>

      <div className="wonder-bottom">
        <span>ASK. IMAGINE. DISCOVER.</span>
        <span className="wonder-note">
          Every question opens a door.
        </span>
      </div>
    </div>
  );
}

function DiscoveryScene({ active }: SceneProps) {
  return (
    <div
      className="experiment-scene discovery-scene"
      aria-hidden={!active}
    >
      <div className="discovery-heading">
        <span className="eyebrow">LEARNING IS A JOURNEY</span>
        <h2>
          Follow the
          <br />
          <span className="serif">question.</span>
        </h2>
      </div>

      <div className="discovery-diagram">
        <svg
          className="discovery-svg"
          viewBox="0 0 420 150"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="draw-path"
            pathLength="1"
            d="M28 76 C80 76 78 30 137 30 S197 119 252 85 S328 38 392 76"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <circle cx="28" cy="76" r="4" fill="#D15D42" />
          <circle cx="137" cy="30" r="4" fill="#D15D42" />
          <circle cx="252" cy="85" r="4" fill="#D15D42" />
          <circle cx="392" cy="76" r="4" fill="#D15D42" />
        </svg>

        <div className="discovery-labels">
          <div className="discovery-node">
            <span>01</span>
            <strong>Ask</strong>
            <small>Be curious.</small>
          </div>
          <div className="discovery-node">
            <span>02</span>
            <strong>Explore</strong>
            <small>Try and learn.</small>
          </div>
          <div className="discovery-node">
            <span>03</span>
            <strong>Understand</strong>
            <small>Make connections.</small>
          </div>
        </div>
      </div>

      <p className="discovery-footer">
        Learning goes beyond the answer.
      </p>
    </div>
  );
}

function GrowthScene({ active }: SceneProps) {
  return (
    <div className="experiment-scene growth-scene" aria-hidden={!active}>
      <div className="growth-top">
        <span className="eyebrow">ROOM TO BECOME</span>
        <span className="growth-index">A CONTINUOUS PROCESS</span>
      </div>

      <div className="growth-layout">
        <div className="growth-copy">
          <div className="mask-clip">
            <h2 className="mask-line">Every child</h2>
          </div>
          <div className="mask-clip">
            <h2 className="mask-line serif">grows in</h2>
          </div>
          <div className="mask-clip">
            <h2 className="mask-line accent-word">their own way.</h2>
          </div>
          <p>
            Patience, practice and encouragement make space for growth.
          </p>
        </div>

        <div className="growth-art" aria-hidden="true">
          <svg viewBox="0 0 180 240" fill="none">
            <path
              className="growth-stem draw-path"
              pathLength="1"
              d="M91 220 C88 178 98 132 91 76"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              className="growth-leaf draw-path"
              pathLength="1"
              d="M91 153 C39 155 30 119 31 94 C69 95 93 116 91 153Z"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              className="growth-leaf draw-path"
              pathLength="1"
              d="M92 119 C138 113 154 83 150 57 C118 62 94 83 92 119Z"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              className="growth-leaf draw-path"
              pathLength="1"
              d="M91 78 C60 71 57 48 64 29 C87 39 97 56 91 78Z"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              className="growth-ground"
              d="M40 221 H140"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          <span className="growth-art-caption">IN ITS OWN TIME</span>
        </div>
      </div>
    </div>
  );
}

function ConfidenceScene({ active }: SceneProps) {
  return (
    <div
      className="experiment-scene confidence-scene"
      aria-hidden={!active}
    >
      <div className="confidence-top">
        <span className="eyebrow">WHAT WE HOPE TO BUILD</span>
        <span className="confidence-star">✳</span>
      </div>

      <div className="confidence-layout">
        <div className="orbit-art" aria-hidden="true">
          <div className="orbit-ring orbit-ring-one">
            <i className="orbit-dot orbit-dot-one" />
          </div>
          <div className="orbit-ring orbit-ring-two">
            <i className="orbit-dot orbit-dot-two" />
          </div>
          <div className="orbit-core">M</div>
        </div>

        <div className="confidence-copy">
          <h2 className="confidence-heading">
            The courage
            <br />
            to <span className="serif">keep trying.</span>
          </h2>
          <p className="confidence-description">
            Every step matters. Every effort counts.
            Every child deserves the chance to keep learning.
          </p>
          <span className="confidence-signoff">
            MUKUL ACADEMY
          </span>
        </div>
      </div>
    </div>
  );
}

function SceneContent({ index }: { index: number }) {
  if (index === 1) return <DiscoveryScene active />;
  if (index === 2) return <GrowthScene active />;
  if (index === 3) return <ConfidenceScene active />;
  return <WonderScene active />;
}

export default function MukulAcademyExperiments() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  const [sceneIndex, setSceneIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const activeScene = SCENES[sceneIndex];

  const goToScene = (nextIndex: number) => {
    setSceneIndex(
      (nextIndex + SCENES.length) % SCENES.length
    );
    setProgress(0);
  };

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updatePreference = () => setReducedMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);

    return () => media.removeEventListener("change", updatePreference);
  }, []);

  // Reveal the experience when it enters the viewport.
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 82%",
      end: "bottom 18%",
      onEnter: () => setIsInView(true),
      onEnterBack: () => setIsInView(true),
      onLeave: () => setIsInView(false),
      onLeaveBack: () => setIsInView(false),
    });

    return () => trigger.kill();
  }, []);

  // Automatically move between scenes while visible.
  useEffect(() => {
    if (!isInView || isPaused || reducedMotion) return;

    let startTime = Date.now();
    let elapsedBeforePause = 0;
    let raf = 0;

    const updateProgress = () => {
      const elapsed = elapsedBeforePause + Date.now() - startTime;
      const nextProgress = Math.min(elapsed / SCENE_DURATION, 1);

      setProgress(nextProgress);

      if (nextProgress >= 1) {
        setSceneIndex((current) => (current + 1) % SCENES.length);
        setProgress(0);
        elapsedBeforePause = 0;
        startTime = Date.now();
      }

      raf = window.requestAnimationFrame(updateProgress);
    };

    raf = window.requestAnimationFrame(updateProgress);

    return () => window.cancelAnimationFrame(raf);
  }, [isInView, isPaused, reducedMotion, sceneIndex]);

  // Each scene has a different motion language.
  useLayoutEffect(() => {
    if (!sceneRef.current || !isInView || reducedMotion) return;

    const scope = sceneRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      if (sceneIndex === 0) {
        tl.fromTo(
          ".kinetic-line",
          { yPercent: 115, rotate: 3 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: "power4.out",
          }
        ).from(
          ".wonder-bottom > *",
          { opacity: 0, y: 8, duration: 0.5, stagger: 0.12 },
          "-=0.35"
        );
      }

      if (sceneIndex === 1) {
        tl.fromTo(
          ".discovery-svg .draw-path",
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power2.inOut",
          }
        ).from(
          ".discovery-node",
          {
            opacity: 0,
            y: 12,
            stagger: 0.15,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }

      if (sceneIndex === 2) {
        tl.fromTo(
          ".mask-line",
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.13,
            ease: "power4.out",
          }
        )
          .from(
            ".growth-copy > p",
            { opacity: 0, y: 12, duration: 0.5 },
            "-=0.35"
          )
          .fromTo(
            ".growth-art .draw-path",
            { strokeDasharray: 1, strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 1.3,
              stagger: 0.16,
              ease: "power2.inOut",
            },
            "-=0.6"
          );
      }

      if (sceneIndex === 3) {
        tl.from(".orbit-ring-one", {
          scale: 0.7,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.5)",
        })
          .from(
            ".orbit-ring-two",
            {
              scale: 0.7,
              opacity: 0,
              duration: 0.8,
              ease: "back.out(1.5)",
            },
            "-=0.55"
          )
          .from(
            ".confidence-copy > *",
            {
              clipPath: "inset(0 0 100% 0)",
              y: 10,
              stagger: 0.14,
              duration: 0.75,
              ease: "power3.out",
            },
            "-=0.35"
          );
      }
    }, scope);

    return () => ctx.revert();
  }, [sceneIndex, isInView, reducedMotion]);

  const handleManualNavigation = (direction: number) => {
    setIsPaused(true);
    goToScene(sceneIndex + direction);
  };

  return (
    <section
      ref={sectionRef}
      className="mukul-experiments"
      aria-label="Discover Mukul Academy"
    >
      <div className="experiment-shell">
        <header className="experiment-header">
          <a className="academy-mark" href="#top">
            <span className="academy-monogram">M</span>
            <span className="academy-name">Mukul Academy</span>
          </a>

          <span className="header-caption">A SCHOOL OF POSSIBILITIES</span>

          <span className="header-location">SAHARANPUR</span>
        </header>

        <div
          ref={stageRef}
          className="experiment-stage"
          data-scene={sceneIndex}
          aria-live="polite"
        >
          <div className="stage-scene" ref={sceneRef} key={sceneIndex}>
            <SceneContent index={sceneIndex} />
          </div>

          <div className="stage-footer">
            <div className="stage-scene-info">
              <span className="stage-number">
                {activeScene.number}
              </span>
              <span className="stage-label">
                {activeScene.label}
              </span>
            </div>

            <div
              className="stage-progress"
              aria-label={`Scene ${sceneIndex + 1} of ${SCENES.length}`}
            >
              {SCENES.map((scene, index) => (
                <button
                  key={scene.number}
                  className={`progress-segment ${
                    index === sceneIndex ? "is-active" : ""
                  }`}
                  onClick={() => {
                    setIsPaused(true);
                    goToScene(index);
                  }}
                  aria-label={`Show ${scene.name}`}
                  aria-current={index === sceneIndex ? "step" : undefined}
                >
                  <span
                    className="progress-fill"
                    style={{
                      transform: `scaleX(${
                        index === sceneIndex ? progress : index < sceneIndex ? 1 : 0
                      })`,
                    }}
                  />
                </button>
              ))}
            </div>

            <div className="stage-controls">
              <button
                type="button"
                className="control-button"
                onClick={() => handleManualNavigation(-1)}
                aria-label="Previous scene"
              >
                ←
              </button>

              <button
                type="button"
                className="control-button"
                onClick={() => {
                  setIsPaused((current) => !current);
                  if (isPaused) setProgress(0);
                }}
                aria-label={isPaused ? "Play animation" : "Pause animation"}
              >
                {isPaused || reducedMotion ? "▶" : "Ⅱ"}
              </button>

              <button
                type="button"
                className="control-button"
                onClick={() => handleManualNavigation(1)}
                aria-label="Next scene"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <footer className="experiment-bottom">
          <span>LEARNING. GROWING. BECOMING.</span>
          <span>EVERY CHILD HAS A STORY.</span>
        </footer>
      </div>

      <style jsx global>{`
        .mukul-experiments {
          --exp-paper: #f5f3ed;
          --exp-ink: #272923;
          --exp-muted: #77786f;
          --exp-rule: #dedbd2;
          --exp-accent: #bd5b43;
          color: var(--exp-ink);
          background: var(--exp-paper);
          font-family: Arial, Helvetica, sans-serif;
          width: 100%;
          padding: clamp(12px, 2.5vw, 32px);
        }

        .experiment-shell {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
        }

        .experiment-header {
          min-height: 54px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--exp-rule);
          padding: 0 0 15px;
        }

        .academy-mark {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: inherit;
          width: fit-content;
        }

        .academy-monogram {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border: 1px solid currentColor;
          border-radius: 50%;
          font-family: Georgia, serif;
          font-size: 16px;
          font-style: italic;
        }

        .academy-name {
          font-size: 12px;
          letter-spacing: -0.02em;
        }

        .header-caption,
        .header-location,
        .experiment-bottom,
        .eyebrow,
        .stage-footer,
        .wonder-bottom,
        .growth-index,
        .growth-art-caption,
        .confidence-signoff {
          font-size: 9px;
          letter-spacing: 0.13em;
        }

        .header-caption {
          text-align: center;
          color: var(--exp-muted);
        }

        .header-location {
          text-align: right;
          color: var(--exp-muted);
        }

        .experiment-stage {
          position: relative;
          margin-top: 14px;
          min-height: 490px;
          height: min(66vh, 620px);
          overflow: hidden;
          background: #eeece5;
          isolation: isolate;
        }

        .stage-scene {
          position: absolute;
          inset: 0;
        }

        .experiment-scene {
          position: absolute;
          inset: 0;
          padding: clamp(24px, 4.5vw, 60px);
          overflow: hidden;
        }

        .experiment-scene .eyebrow {
          color: var(--exp-muted);
        }

        .wonder-scene {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #eeece5;
        }

        .wonder-top,
        .wonder-bottom,
        .growth-top,
        .confidence-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
        }

        .scene-symbol {
          font-size: 20px;
          color: var(--exp-accent);
        }

        .wonder-copy {
          margin: auto 0;
          padding: 35px 0 45px;
        }

        .kinetic-clip,
        .mask-clip {
          overflow: hidden;
          padding-bottom: 0.07em;
        }

        .kinetic-line {
          display: block;
          font-size: clamp(48px, 8.5vw, 112px);
          line-height: 0.91;
          letter-spacing: -0.085em;
          font-weight: 500;
        }

        .serif {
          font-family: Georgia, "Times New Roman", serif;
          font-style: italic;
          font-weight: 400;
          letter-spacing: -0.07em;
        }

        .kinetic-indent {
          padding-left: 0.8em;
        }

        .accent-word {
          color: var(--exp-accent);
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          font-style: italic;
          letter-spacing: -0.08em;
        }

        .wonder-bottom {
          align-items: flex-end;
          color: var(--exp-muted);
        }

        .wonder-note {
          max-width: 200px;
          font-size: 12px;
          letter-spacing: 0;
          line-height: 1.5;
          text-align: right;
        }

        /* Experiment 02: diagram + drawn path */
        .discovery-scene {
          background: #e8e8df;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .discovery-heading h2 {
          margin: 22px 0 0;
          font-size: clamp(42px, 6.2vw, 78px);
          font-weight: 500;
          line-height: 0.95;
          letter-spacing: -0.08em;
        }

        .discovery-heading h2 .serif {
          color: #777b6d;
        }

        .discovery-diagram {
          max-width: 820px;
          width: 100%;
          margin: 8px auto 0;
        }

        .discovery-svg {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
          color: #5f6559;
        }

        .discovery-labels {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          border-top: 1px solid #c8c9bd;
          padding-top: 14px;
        }

        .discovery-node {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 7px 9px;
        }

        .discovery-node span {
          color: var(--exp-accent);
          font-size: 10px;
        }

        .discovery-node strong {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        .discovery-node small {
          grid-column: 2;
          font-size: 11px;
          color: var(--exp-muted);
        }

        .discovery-footer {
          font-family: Georgia, serif;
          font-size: 15px;
          font-style: italic;
          color: #6d7065;
          margin: 20px 0 0;
        }

        /* Experiment 03: masked editorial typography */
        .growth-scene {
          background: #f2e8da;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .growth-index {
          color: var(--exp-muted);
        }

        .growth-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(130px, 0.6fr);
          gap: 5%;
          align-items: center;
          flex: 1;
        }

        .growth-copy h2 {
          margin: 0;
          font-size: clamp(43px, 7.1vw, 90px);
          line-height: 0.95;
          letter-spacing: -0.08em;
          font-weight: 500;
          white-space: nowrap;
        }

        .growth-copy .mask-clip {
          padding-bottom: 0.08em;
        }

        .growth-copy .accent-word {
          font-size: 0.9em;
        }

        .growth-copy > p {
          max-width: 300px;
          margin: 28px 0 0;
          font-size: 12px;
          line-height: 1.75;
          color: #6e6b62;
        }

        .growth-art {
          max-width: 180px;
          width: 100%;
          justify-self: center;
          color: #71816a;
        }

        .growth-art svg {
          display: block;
          width: 100%;
          overflow: visible;
        }

        .growth-ground {
          stroke: #c8bca9;
        }

        .growth-art-caption {
          display: block;
          text-align: center;
          color: #898578;
          margin-top: 10px;
          font-size: 8px;
        }

        /* Experiment 04: restrained orbital motion */
        .confidence-scene {
          background: #e7eae4;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .confidence-star {
          color: #b85d43;
          font-size: 20px;
        }

        .confidence-layout {
          display: grid;
          grid-template-columns: minmax(150px, 0.7fr) minmax(0, 1.2fr);
          align-items: center;
          gap: 8%;
          flex: 1;
        }

        .orbit-art {
          position: relative;
          width: min(100%, 245px);
          aspect-ratio: 1;
          margin: auto;
          display: grid;
          place-items: center;
        }

        .orbit-ring {
          position: absolute;
          inset: 8%;
          border: 1px solid #c3c9be;
          border-radius: 50%;
        }

        .orbit-ring-two {
          inset: 22%;
          border-color: #b3bbae;
        }

        .orbit-core {
          display: grid;
          place-items: center;
          width: 35%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: #d6ddd2;
          color: #515d4d;
          font-family: Georgia, serif;
          font-size: 44px;
          font-style: italic;
        }

        .orbit-dot {
          position: absolute;
          width: 9px;
          height: 9px;
          background: var(--exp-accent);
          border-radius: 50%;
          top: 9%;
          left: 14%;
        }

        .orbit-dot-two {
          width: 6px;
          height: 6px;
          top: auto;
          bottom: 6%;
          left: auto;
          right: 17%;
          background: #667760;
        }

        .confidence-heading {
          font-size: clamp(39px, 6vw, 76px);
          font-weight: 500;
          line-height: 0.98;
          letter-spacing: -0.08em;
          margin: 0 0 24px;
        }

        .confidence-heading .serif {
          color: #6d7d66;
        }

        .confidence-description {
          max-width: 330px;
          color: #686f64;
          font-size: 12px;
          line-height: 1.8;
          margin: 0 0 26px;
        }

        .confidence-signoff {
          color: #777d72;
        }

        /* Shared controls */
        .stage-footer {
          position: absolute;
          z-index: 5;
          bottom: 0;
          left: 0;
          right: 0;
          min-height: 54px;
          display: grid;
          grid-template-columns: 1fr minmax(90px, 0.8fr) 1fr;
          align-items: center;
          gap: 16px;
          padding: 10px clamp(24px, 4.5vw, 60px);
          background: rgba(245, 243, 237, 0.93);
          border-top: 1px solid rgba(60, 60, 50, 0.1);
          backdrop-filter: blur(12px);
        }

        .stage-scene-info {
          display: flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
        }

        .stage-number {
          color: var(--exp-accent);
        }

        .stage-label {
          color: #66685f;
        }

        .stage-progress {
          display: flex;
          gap: 5px;
          align-items: center;
          justify-content: center;
        }

        .progress-segment {
          position: relative;
          padding: 8px 0;
          border: 0;
          background: transparent;
          flex: 1;
          min-width: 12px;
          cursor: pointer;
        }

        .progress-segment::before,
        .progress-fill {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 7px;
          height: 2px;
        }

        .progress-segment::before {
          background: #d8d7cf;
        }

        .progress-fill {
          background: var(--exp-accent);
          transform-origin: left;
        }

        .stage-controls {
          display: flex;
          justify-content: flex-end;
          gap: 7px;
        }

        .control-button {
          display: grid;
          place-items: center;
          width: 29px;
          height: 29px;
          border: 1px solid #d8d7cf;
          border-radius: 50%;
          color: var(--exp-ink);
          background: transparent;
          font: inherit;
          font-size: 12px;
          cursor: pointer;
          transition: background 180ms ease, color 180ms ease;
        }

        .control-button:hover {
          background: var(--exp-ink);
          color: white;
        }

        .experiment-bottom {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          color: var(--exp-muted);
          padding-top: 17px;
          font-size: 8px;
        }

        @media (max-width: 650px) {
          .mukul-experiments {
            padding: 12px;
          }

          .experiment-header {
            grid-template-columns: 1fr auto;
            min-height: 44px;
          }

          .header-caption {
            display: none;
          }

          .experiment-stage {
            height: min(72svh, 570px);
            min-height: 450px;
          }

          .experiment-scene {
            padding: 24px 21px 78px;
          }

          .kinetic-line {
            font-size: clamp(46px, 11vw, 70px);
          }

          .wonder-bottom {
            align-items: flex-start;
          }

          .wonder-bottom > span {
            max-width: 48%;
          }

          .discovery-heading h2 {
            font-size: clamp(40px, 10vw, 60px);
          }

          .discovery-svg {
            margin: 25px 0 8px;
          }

          .discovery-labels {
            gap: 8px;
          }

          .discovery-node {
            grid-template-columns: 1fr;
            gap: 7px;
          }

          .discovery-node small {
            grid-column: 1;
            line-height: 1.4;
          }

          .growth-layout {
            grid-template-columns: minmax(0, 1fr) 100px;
            gap: 0;
          }

          .growth-copy h2 {
            font-size: clamp(37px, 8.8vw, 57px);
          }

          .growth-art {
            width: 100px;
          }

          .growth-copy > p {
            font-size: 11px;
          }

          .confidence-layout {
            grid-template-columns: 1fr;
            gap: 15px;
            align-content: center;
          }

          .orbit-art {
            width: 130px;
          }

          .orbit-core {
            font-size: 29px;
          }

          .confidence-heading {
            font-size: clamp(42px, 10vw, 62px);
          }

          .stage-footer {
            grid-template-columns: 1fr auto;
            gap: 12px;
            padding: 9px 15px;
          }

          .stage-progress {
            grid-column: 1 / -1;
            grid-row: 1;
          }

          .stage-scene-info {
            grid-column: 1;
            grid-row: 2;
            font-size: 8px;
          }

          .stage-controls {
            grid-column: 2;
            grid-row: 2;
          }

          .experiment-bottom {
            font-size: 7px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mukul-experiments *,
          .mukul-experiments *::before,
          .mukul-experiments *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
