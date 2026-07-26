"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "success";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-gradient-to-br from-primary to-secondary shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] hover:shadow-[0_10px_30px_-8px_rgba(99,102,241,0.8)]",
  secondary:
    "text-foreground bg-white/[0.06] hover:bg-white/[0.1] border border-border-strong",
  ghost: "text-muted hover:text-foreground hover:bg-white/[0.06]",
  outline: "text-foreground border border-border-strong hover:bg-white/[0.05]",
  danger: "text-white bg-danger/90 hover:bg-danger",
  success: "text-white bg-success/90 hover:bg-success",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl",
  icon: "h-10 w-10 rounded-xl",
};

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", children, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        "disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});
