"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface RevealProps {
  delay?: number;
  direction?: "up" | "down" | "none";
  className?: string;
  children: React.ReactNode;
}

export function Reveal({
  delay = 0,
  direction = "up",
  className,
  children,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const initialY = direction === "up" ? 12 : direction === "down" ? -12 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: initialY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // ease-out cubic
      }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}
