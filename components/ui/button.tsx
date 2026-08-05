"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "success";
type Size = "sm" | "md" | "lg" | "icon";

// The primary shadow was tinted indigo — rgba(99,102,241) — left over from an
// earlier palette, so the brand button glowed a colour that appears nowhere
// else in the product. It now carries the emerald brand tint.
const variants: Record<Variant, string> = {
  primary:
    "text-white bg-gradient-to-br from-primary to-secondary shadow-[0_6px_20px_-8px_rgba(16,185,129,0.65)] hover:shadow-[0_8px_26px_-8px_rgba(16,185,129,0.85)]",
  secondary: "text-foreground bg-surface-strong hover:bg-surface-hover border border-border-strong",
  ghost: "text-muted hover:text-foreground hover:bg-surface",
  outline: "text-foreground border border-border-strong hover:bg-surface",
  danger: "text-white bg-danger/90 hover:bg-danger",
  success: "text-white bg-success/90 hover:bg-success",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-control",
  md: "h-10 px-4 text-sm gap-2 rounded-field",
  lg: "h-12 px-6 text-base gap-2.5 rounded-field",
  icon: "h-10 w-10 rounded-field",
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
