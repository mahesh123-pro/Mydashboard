"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/** Staggered container for revealing children in sequence. */
export function Stagger({
  className,
  children,
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06, delayChildren: delay } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** A single revealed item — use inside <Stagger>. */
export function Reveal({ className, children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
