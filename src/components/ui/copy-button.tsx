"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export function CopyButton({
  value,
  label = "Copiar",
  copiedLabel = "¡Copiado!",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const iconOnly = label.length === 0;

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleCopy}
      className={cn(iconOnly && "px-2", className)}
      aria-label={iconOnly ? "Copiar" : undefined}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {!iconOnly ? (copied ? copiedLabel : label) : null}
    </Button>
  );
}
