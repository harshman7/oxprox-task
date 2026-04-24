/**
 * Animated integer display that counts from zero (or jumps instantly) when the
 * element scrolls into view. Used in KeyInsights for headline metrics.
 */

"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** Target number shown when the animation completes. */
  value: number;
  /** Duration in seconds when motion is allowed (ignored when reduced motion). */
  duration?: number;
  className?: string;
  /** Optional formatter (e.g. locale or padding). Receives rounded integers. */
  format?: (n: number) => string;
};

/**
 * Renders `value` inside a span. When the span enters the viewport, animates
 * from 0 to `value` unless `prefers-reduced-motion` is set, in which case the
 * final value appears immediately with zero-duration animation.
 */
export default function CountUp({
  value,
  duration = 0.9,
  className,
  format,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(reduced ? value : 0);
  const [display, setDisplay] = useState<string>(
    format ? format(reduced ? value : 0) : String(reduced ? value : 0)
  );

  useEffect(() => {
    if (!inView) return;

    // Reduced motion: skip the animation, update via motionValue so the
    // subscription below writes the final value without a sync setState here.
    const controls = animate(motionValue, value, {
      duration: reduced ? 0 : duration,
      ease: [0.22, 1, 0.36, 1],
    });

    const unsubscribe = motionValue.on("change", (latest) => {
      const rounded = Math.round(latest);
      setDisplay(format ? format(rounded) : String(rounded));
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [inView, value, duration, reduced, motionValue, format]);

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      {display}
    </span>
  );
}
