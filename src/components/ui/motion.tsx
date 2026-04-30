"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp, fadeIn, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

type CommonProps = React.HTMLAttributes<HTMLDivElement>;

export function MotionDiv({ className, children, ...props }: CommonProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={className}
      {...(props as object)}
    >
      {children}
    </motion.div>
  );
}

export function MotionStagger({ className, children }: CommonProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({ className, children }: CommonProps) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  );
}

export function MotionFade({ className, children }: CommonProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingCard({
  className,
  delay = 0,
  duration = 5,
  amplitude = 10,
  children,
}: {
  className?: string;
  delay?: number;
  duration?: number;
  amplitude?: number;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={reduce ? {} : { y: [0, -amplitude, 0] }}
      transition={reduce ? undefined : { duration, repeat: Infinity, ease: "easeInOut", delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
