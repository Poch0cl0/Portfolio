"use client";

import { useContactModal } from "@/features/contact/components/contact-modal-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContactTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "code";
  size?: "sm" | "md" | "lg";
}

export function ContactTrigger({
  label,
  className,
  variant = "primary",
  size = "md",
  children,
  onClick,
  ...props
}: ContactTriggerProps) {
  const { openContact } = useContactModal();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={(event) => {
        openContact();
        onClick?.(event);
      }}
      {...props}
    >
      {children ?? label}
    </Button>
  );
}
