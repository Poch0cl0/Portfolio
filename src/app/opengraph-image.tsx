import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.shortName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function DefaultOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#131315",
          color: "#e5e1e4",
          padding: "64px",
        }}
      >
        <div style={{ fontSize: 24, color: "#859490", fontFamily: "monospace" }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 16, color: "#4fdbc8" }}>
          {siteConfig.role}
        </div>
        <div style={{ fontSize: 28, marginTop: 24, color: "#bbcac6" }}>
          Next.js · React · TypeScript · FastAPI
        </div>
      </div>
    ),
    { ...size },
  );
}
