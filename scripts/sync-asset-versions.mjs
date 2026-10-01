import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const assetsFile = path.join(rootDir, "src", "config", "assets.ts");
const versionsFile = path.join(rootDir, "src", "config", "asset-versions.json");
const publicDir = path.join(rootDir, "public");

function extractAssetPaths() {
  const content = fs.readFileSync(assetsFile, "utf8");
  return [...content.matchAll(/src:\s*"([^"]+)"/g)].map((match) => match[1]);
}

export function syncAssetVersions() {
  const versions = {};

  for (const assetPath of extractAssetPaths()) {
    const filePath = path.join(publicDir, assetPath.replace(/^\//, ""));

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const { mtimeMs } = fs.statSync(filePath);
    versions[assetPath] = Math.floor(mtimeMs);
  }

  fs.writeFileSync(versionsFile, `${JSON.stringify(versions, null, 2)}\n`, "utf8");
  return versions;
}

export function watchPublicAssets(onChange) {
  if (!fs.existsSync(publicDir)) {
    return () => {};
  }

  const timer = { current: null };

  const scheduleSync = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      onChange();
    }, 150);
  };

  fs.watch(publicDir, { recursive: true }, scheduleSync);

  return () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncAssetVersions();
}
