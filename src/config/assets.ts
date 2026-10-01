import assetVersions from "@/config/asset-versions.json";

export interface AssetEntry {
  src: string;
  width: number;
  height: number;
  ready: boolean;
  label: string;
}

export const assets = {
  monogram: {
    src: "/icons/monogram.png",
    width: 64,
    height: 64,
    ready: false,
    label: "Monograma JP",
  },
  heroPortrait: {
    src: "/images/hero/jefferson-hero.webp",
    width: 1600,
    height: 1200,
    ready: true,
    label: "Foto del hero",
  },
  avatar: {
    src: "/images/avatar/jefferson.jpg",
    width: 800,
    height: 800,
    ready: false,
    label: "Avatar",
  },
  cv: {
    src: "/cv/cv-jefferson-pena-serrano.pdf",
    width: 0,
    height: 0,
    ready: false,
    label: "CV PDF",
  },
  obstetricareCover: {
    src: "/images/projects/obstetricare/cover.jpg",
    width: 1280,
    height: 720,
    ready: true,
    label: "ObstetriCare cover",
  },
  obstetricareDashboard: {
    src: "/images/projects/obstetricare/dashboard.webp",
    width: 1600,
    height: 1000,
    ready: false,
    label: "ObstetriCare dashboard",
  },
  obstetricareArchitecture: {
    src: "/images/projects/obstetricare/arquitectura.webp",
    width: 1600,
    height: 1000,
    ready: false,
    label: "ObstetriCare arquitectura",
  },
  amaraCover: {
    src: "/images/projects/amara/cover.jpg",
    width: 1280,
    height: 720,
    ready: true,
    label: "Amará cover",
  },
  amaraCalendario: {
    src: "/images/projects/amara/calendario.webp",
    width: 1600,
    height: 1000,
    ready: false,
    label: "Amará calendario",
  },
  amaraChat: {
    src: "/images/projects/amara/chat.webp",
    width: 1600,
    height: 1000,
    ready: false,
    label: "Amará chat",
  },
} as const satisfies Record<string, AssetEntry>;

export type AssetKey = keyof typeof assets;

export function getAssetEntry(key: AssetKey): AssetEntry {
  return assets[key];
}

export function getAssetUrl(key: AssetKey): string {
  const entry = getAssetEntry(key);

  if (!entry.ready) {
    return entry.src;
  }

  const version = assetVersions[entry.src as keyof typeof assetVersions];
  return typeof version === "number" ? `${entry.src}?v=${version}` : entry.src;
}

export function getPublicAssetPath(key: AssetKey): string {
  return assets[key].src.replace(/^\//, "public/");
}
