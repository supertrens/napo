"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  formatter?: (n: number) => string;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function AnimatedCounter({
  value,
  duration = 1100,
  className,
  prefix = "",
  suffix = "",
  formatter,
}: Props) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const target = value;
    const from = fromRef.current;
    if (from === target) return;

    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const k = Math.min(1, elapsed / duration);
      const eased = easeOut(k);
      const next = from + (target - from) * eased;
      setDisplay(k >= 1 ? target : next);
      if (k < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const text = formatter
    ? formatter(display)
    : Math.round(display).toLocaleString("en-US");

  return (
    <span className={className}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
