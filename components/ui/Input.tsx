import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "min-h-12 w-full rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--glass-bg)] px-4 text-[var(--color-ink)] outline-none transition-[border-color,box-shadow,background-color,backdrop-filter] duration-[var(--duration-micro)] ease-[var(--ease-premium)] placeholder:text-[var(--color-stone)] backdrop-blur-md focus:border-[var(--border-glass-strong)] focus:bg-[var(--glass-bg-strong)] focus:shadow-[var(--shadow-glass)]",
        className,
      )}
      {...props}
    />
  );
}
