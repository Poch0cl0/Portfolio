import Image from "next/image";
import type { AssetKey } from "@/config/assets";
import { getAssetEntry, getAssetUrl, getPublicAssetPath } from "@/config/assets";
import { cn } from "@/lib/utils";

interface AssetImageProps {
  assetKey: AssetKey;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

export function AssetImage({
  assetKey,
  alt,
  className,
  priority = false,
  fill = false,
}: AssetImageProps) {
  const entry = getAssetEntry(assetKey);
  const src = getAssetUrl(assetKey);
  const unoptimized = process.env.NODE_ENV === "development";

  if (!entry.ready) {
    return (
      <div
        className={cn(
          "flex items-center justify-center border-2 border-dashed border-outline-variant bg-surface-container-low p-space-md text-center",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <p className="font-mono text-code-inline text-on-surface-variant">
          Coloca aquí: {getPublicAssetPath(assetKey)}
        </p>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized={unoptimized}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={entry.width}
      height={entry.height}
      priority={priority}
      unoptimized={unoptimized}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

export function MonogramBadge({ className }: { className?: string }) {
  const entry = getAssetEntry("monogram");

  if (entry.ready) {
    return (
      <Image
        src={getAssetUrl("monogram")}
        alt="JP"
        width={32}
        height={32}
        unoptimized={process.env.NODE_ENV === "development"}
        className={cn("h-8 w-8", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 font-mono text-label-caps font-semibold text-primary",
        className,
      )}
      aria-hidden
    >
      JP
    </span>
  );
}
