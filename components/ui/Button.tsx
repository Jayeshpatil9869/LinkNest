"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { pressIn, pressOut } from "@/lib/motion/presets";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "soft";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] font-medium transition-[background-color,box-shadow,color] duration-[var(--duration-micro)] ease-[var(--ease-premium)] will-change-transform disabled:pointer-events-none disabled:opacity-50",
        "hover:-translate-y-px",
        size === "sm" && "min-h-10 px-3 text-sm",
        size === "md" && "min-h-11 px-4 text-sm",
        size === "lg" && "min-h-12 px-5 text-base",
        variant === "primary" &&
          "bg-[var(--color-ink)] text-[var(--color-cloud)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        variant === "ghost" &&
          "bg-transparent text-[var(--color-slate)] hover:bg-[var(--color-mesh-gold)]/25",
        variant === "soft" &&
          "glass-chip text-[var(--color-ink)] hover:border-[var(--border-hover)] hover:bg-[var(--glass-bg-strong)]",
        className,
      )}
      {...props}
      onPointerDown={(event) => {
        pressIn(ref.current);
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        pressOut(ref.current);
        onPointerUp?.(event);
      }}
      onPointerLeave={(event) => {
        pressOut(ref.current);
        onPointerLeave?.(event);
      }}
      onPointerCancel={(event) => {
        pressOut(ref.current);
        onPointerCancel?.(event);
      }}
    />
  );
}
