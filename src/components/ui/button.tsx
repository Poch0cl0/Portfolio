import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary-container text-on-primary-container border border-primary-container hover:bg-primary hover:text-on-primary glow-primary glow-hover-primary hover-shine",
  secondary:
    "bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest glow-hover-secondary",
  ghost:
    "bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-transparent",
  outline:
    "bg-surface-container text-on-surface border border-outline-variant hover:bg-surface-container-high glow-hover-primary hover-shine",
  code:
    "bg-surface-container-high text-on-surface font-mono text-label-sm uppercase tracking-wider hover:bg-surface-container-highest",
} as const;

const sizes = {
  sm: "h-9 px-3 text-body-sm",
  md: "h-10 px-4 text-body-sm",
  lg: "h-11 px-6 text-body-md",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
