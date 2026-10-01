import { spawn } from "node:child_process";
import { syncAssetVersions, watchPublicAssets } from "./sync-asset-versions.mjs";

syncAssetVersions();
console.log("[assets] versiones sincronizadas desde public/");

watchPublicAssets(() => {
  syncAssetVersions();
  console.log("[assets] imagen actualizada, caché invalidada");
});

const child = spawn("pnpm", ["exec", "next", "dev"], {
  stdio: "inherit",
  shell: true,
  cwd: process.cwd(),
});

function shutdown(code = 0) {
  child.kill();
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
