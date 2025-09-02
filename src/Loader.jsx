import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";



export default function SPPropertiesLoader({
  brand = "sppropperties",
  accentClass = "text-emerald-500",
  onDone,
  minDurationMs = 1600,
}) {
  const rootRef = useRef(null);
  const houseRef = useRef(null);
  const pathRef = useRef(null);
  const brandRef = useRef(null);
  const dotsRef = useRef(null);
  const progressRef = useRef(null);
  const progressTrackRef = useRef(null);
  const tlRef = useRef(null);

  const [percent, setPercent] = useState(0);

  // Prepare the SVG path for a draw-on animation
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    try {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    } catch (_) {
      // getTotalLength not available – skip dash setup
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tlRef.current = tl;

      // Intro: fade in root slightly
      tl.set(rootRef.current, { autoAlpha: 1 });

      // House: pop + draw
      tl.fromTo(
        houseRef.current,
        { scale: 0.8, rotate: -8, autoAlpha: 0 },
        { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.6 }
      );

      // Draw path
      const path = pathRef.current;
      if (path) {
        const length = (() => {
          try {
            return path.getTotalLength();
          } catch {
            return 300; // fallback
          }
        })();
        tl.to(path, { strokeDashoffset: 0, duration: 0.9 }, "<");
      }

      // Brand text: per-letter stagger reveal
      const letters = brandRef.current?.querySelectorAll("span[data-letter]") || [];
      tl.fromTo(
        letters,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.035 },
        "-=0.3"
      );

      // Dots pulse loop
      const dots = dotsRef.current?.querySelectorAll(".dot") || [];
      if (dots.length) {
        gsap.to(dots, {
          scale: 1.12,
          yoyo: true,
          repeat: -1,
          duration: 0.6,
          ease: "sine.inOut",
          stagger: 0.12,
        });
      }

      // Progress bar fill (visual + number)
      const progObj = { v: 0 };
      tl.to(progObj, {
        v: 100,
        duration: 1.2,
        ease: "power1.inOut",
        onUpdate: () => {
          const v = Math.round(progObj.v);
          setPercent(v);
          if (progressRef.current && progressTrackRef.current) {
            const track = progressTrackRef.current;
            const w = track.getBoundingClientRect().width;
            progressRef.current.style.width = `${(v / 100) * w}px`;
          }
        },
      });

      // Hold for at least minDurationMs total before exit
      tl.to({}, { duration: Math.max(0, (minDurationMs - tl.duration() * 1000) / 1000) });

      // Exit animation
      tl.to(rootRef.current, { y: -40, autoAlpha: 0, duration: 0.5, ease: "power2.in" });

      tl.add(() => onDone && onDone());
    }, rootRef);

    return () => ctx.revert();
  }, [minDurationMs, onDone]);

  // Utility: render brand letters for stagger animation
  const renderBrand = (text) =>
    text.split("").map((ch, idx) => (
      <span
        key={`${ch}-${idx}`}
        data-letter
        className={`inline-block will-change-transform ${
          ch.trim() ? "" : "\u00A0"
        }`}
      >
        {ch}
      </span>
    ));

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] grid place-items-center bg-neutral-950 text-white"
      style={{ opacity: 0 }}
      aria-label="Loading"
      role="status"
    >
      <div className="flex flex-col items-center gap-6 px-6">
        {/* Brand Mark */}
        <div ref={houseRef} className="relative">
          <svg
            width="128"
            height="128"
            viewBox="0 0 128 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          >
            {/* Roof */}
            <path
              ref={pathRef}
              d="M16 64 L64 24 L112 64 M28 56 V112 H100 V56"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/90"
            />
            {/* Door */}
            <rect x="56" y="82" width="16" height="30" rx="2" className="fill-white/90" />
            {/* Accent Window */}
            <rect x="84" y="76" width="12" height="12" rx="2" className="fill-white/70" />
          </svg>
          {/* Accent glow */}
          <div className="absolute inset-0 blur-2xl opacity-40 mix-blend-screen" aria-hidden>
            <div className={`w-full h-full rounded-full ${accentClass.replace("text-", "bg-")}`} />
          </div>
        </div>

        {/* Brand Text */}
        <div
          ref={brandRef}
          className="font-semibold tracking-[0.2em] uppercase text-xl md:text-2xl text-white/95"
        >
          {renderBrand(brand)}
        </div>

        {/* Progress + Dots */}
        <div className="w-72 max-w-[82vw] flex flex-col items-center gap-3">
          <div
            ref={progressTrackRef}
            className="w-full h-2 rounded-full bg-white/10 overflow-hidden"
          >
            <div
              ref={progressRef}
              className={`h-full rounded-full ${accentClass.replace("text-", "bg-")}`}
              style={{ width: 0 }}
            />
          </div>

          <div className="flex items-center gap-3 text-sm text-white/70">
            <span>{percent}%</span>
            <div ref={dotsRef} className="flex items-center gap-1.5">
              <span className="dot w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="dot w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="dot w-1.5 h-1.5 rounded-full bg-white/60" />
            </div>
          </div>
        </div>

        {/* Tagline (optional) */}
        <p className="text-xs text-white/50 text-center max-w-[28rem] leading-relaxed">
          Shaping homes, one brick at a time.
        </p>
      </div>
    </div>
  );
}


