import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  surface?: "default" | "low" | "lowest";
}

export function Section({
  className,
  surface = "default",
  ...props
}: SectionProps) {
  const surfaces = {
    default: "bg-surface",
    low: "bg-surface-container-low",
    lowest: "bg-surface-container-lowest",
  };

  return (
    <section
      className={cn("py-space-xl lg:py-24", surfaces[surface], className)}
      {...props}
    />
  );
}

export function SectionHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-10 space-y-3", className)} {...props} />;
}

interface SectionKickerProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionKicker({ children, className }: SectionKickerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-mono text-label-caps uppercase tracking-widest text-primary",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-headline-lg font-semibold tracking-tight text-on-surface", className)}
      {...props}
    />
  );
}

export function SectionDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("max-w-2xl text-body-sm text-on-surface-variant", className)} {...props} />
  );
}
