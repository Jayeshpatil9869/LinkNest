"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { pressIn, pressOut } from "@/lib/motion/presets";

type PressableProps = React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

/** Wraps interactive chrome with GSAP press scale */
export function Pressable({
  className,
  children,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  ...props
}: PressableProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
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
      {...props}
    >
      {children}
    </div>
  );
}
