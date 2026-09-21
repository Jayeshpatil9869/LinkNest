import { cn } from "@/lib/utils";

type GlassTone = "default" | "soft" | "strong";

type GlassPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: GlassTone;
};

const toneClass: Record<GlassTone, string> = {
  default: "glass-panel",
  soft: "glass-panel-soft",
  strong: "glass-panel-strong",
};

export function GlassPanel({
  className,
  tone = "default",
  ...props
}: GlassPanelProps) {
  return <div className={cn(toneClass[tone], className)} {...props} />;
}
