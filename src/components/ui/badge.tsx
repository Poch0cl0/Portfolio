import { cn } from "@/lib/utils";

const variants = {
  default: "bg-surface-container-high text-on-surface border border-outline-variant",
  outline: "bg-transparent text-on-surface border border-outline-variant",
  accent: "bg-primary/10 text-primary border border-primary/25",
  tech: "bg-surface-container-low text-on-surface border border-outline-variant font-mono text-code-inline",
  health: "bg-primary/10 text-primary border border-primary/25 font-mono text-code-inline",
  ai: "bg-tertiary/10 text-tertiary border border-tertiary/25 font-mono text-code-inline",
} as const;

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
