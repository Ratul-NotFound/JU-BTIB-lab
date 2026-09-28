"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

export interface RevealProps {
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
  viewportMargin?: string;
  children: React.ReactNode;
}

/**
 * Single-element scroll reveal on enter viewport
 */
export function Reveal({
  delay = 0,
  duration = 0.55,
  direction = "up",
  distance = 20,
  className,
  viewportMargin = "-50px",
  children,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const initialOffset = {
    x: direction === "left" ? distance : direction === "right" ? -distance : 0,
    y: direction === "up" ? distance : direction === "down" ? -distance : 0,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: initialOffset.x, y: initialOffset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: viewportMargin as `${number}px` }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // smooth spring-like bezier
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parent grid or list container that orchestrates staggered child entrance
 */
export interface StaggerContainerProps {
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
  viewportMargin?: string;
  children: React.ReactNode;
}

export function StaggerContainer({
  staggerDelay = 0.08,
  delayChildren = 0.05,
  className,
  viewportMargin = "-40px",
  children,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin as `${number}px` }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child item inside a StaggerContainer
 */
export interface StaggerItemProps {
  className?: string;
  yOffset?: number;
  children: React.ReactNode;
}

export function StaggerItem({
  className,
  yOffset = 22,
  children,
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={cn(className)}>
      {children}
    </motion.div>
  );
}

/**
 * Scale-in reveal for cards, badges, and images
 */
export interface ScaleInProps {
  delay?: number;
  duration?: number;
  initialScale?: number;
  className?: string;
  children: React.ReactNode;
}

export function ScaleIn({
  delay = 0,
  duration = 0.5,
  initialScale = 0.94,
  className,
  children,
}: ScaleInProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Interactive motion wrapper for tactile feedback on interactive cards
 */
export interface InteractiveCardProps {
  className?: string;
  hoverY?: number;
  tapScale?: number;
  children: React.ReactNode;
}

export function InteractiveCard({
  className,
  hoverY = -4,
  tapScale = 0.985,
  children,
}: InteractiveCardProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ y: hoverY, transition: { duration: 0.22, ease: "easeOut" } }}
      whileTap={{ scale: tapScale, transition: { duration: 0.1 } }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
