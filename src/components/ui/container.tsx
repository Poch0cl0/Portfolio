import { cn } from "@/lib/utils";

export function Container({
  className,
  size = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: "default" | "narrow" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-margin-mobile lg:px-margin",
        size === "default" ? "max-w-7xl" : "max-w-4xl",
        className,
      )}
      {...props}
    />
  );
}
