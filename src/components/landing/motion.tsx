"use client";

import { type ReactNode } from "react";
import {
  motion,
  type Variants,
  type HTMLMotionProps,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================
   ANIMATION VARIANTS
   ============================================ */

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

/* ============================================
   SCROLL-TRIGGERED SECTION WRAPPER
   ============================================ */

interface SectionRevealProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
  className?: string;
}

export function SectionReveal({ children, className, ...props }: SectionRevealProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.section
      initial={prefersReduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeInUp}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

/* ============================================
   STAGGERED CONTAINER (for grids/lists)
   ============================================ */

interface StaggerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  slow?: boolean;
}

export function Stagger({ children, className, slow, ...props }: StaggerProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={slow ? staggerContainerSlow : staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   INDIVIDUAL ANIMATED ITEM
   ============================================ */

interface MotionItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
}

export function MotionItem({ children, className, direction = "up", ...props }: MotionItemProps) {
  const variantMap = {
    up: fadeInUp,
    left: fadeInLeft,
    right: fadeInRight,
    scale: scaleIn,
  };

  return (
    <motion.div variants={variantMap[direction]} className={className} {...props}>
      {children}
    </motion.div>
  );
}

/* ============================================
   STANDALONE REVEAL (not inside a Stagger)
   ============================================ */

interface RevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
}

export function Reveal({ children, className, direction = "up", delay = 0, ...props }: RevealProps) {
  const prefersReduced = useReducedMotion();

  const variants: Variants = {
    hidden:
      direction === "up"
        ? { opacity: 0, y: 32 }
        : direction === "left"
        ? { opacity: 0, x: -40 }
        : direction === "right"
        ? { opacity: 0, x: 40 }
        : { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1], delay },
    },
  };

  return (
    <motion.div
      initial={prefersReduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   FLOATING ANIMATION (continuous)
   ============================================ */

interface FloatProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

export function Float({ children, className, delay = 0, duration = 6, y = 12 }: FloatProps) {
  return (
    <motion.div
      animate={{ y: [-y / 2, y / 2, -y / 2] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   TEXT CHARACTER REVEAL
   ============================================ */

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04, delayChildren: delay } },
      }}
      className={cn("inline", className)}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={{
            hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
            },
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
