import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { siteMeta } from "@/data/site";
import type { Locale } from "@/i18n/config";
import { getSiteUrl } from "@/lib/env";

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  locale?: Locale;
  image?: string;
  noIndex?: boolean;
}

function buildAlternateLanguages(path: string, siteUrl: string): Record<string, string> {
  const normalizedPath = path.replace(/^\/(es|en)/, "") || "";
  const suffix = normalizedPath === "" ? "" : normalizedPath;

  return {
    es: `${siteUrl}/es${suffix}`,
    en: `${siteUrl}/en${suffix}`,
  };
}

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "",
  locale = "es",
  image = siteConfig.defaultOgImage,
  noIndex = false,
}: BuildMetadataOptions = {}): Metadata {
  const siteUrl = getSiteUrl();
  const localizedPath = path.startsWith(`/${locale}`) ? path : `/${locale}${path}`;
  const url = new URL(localizedPath, siteUrl).toString();
  const fullTitle = title ? `${title} | ${siteConfig.shortName}` : siteConfig.shortName;
  const ogLocale = locale === "es" ? "es_PE" : "en_US";

  return {
    title: fullTitle,
    description,
    keywords: [...siteMeta.keywords],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
      languages: buildAlternateLanguages(localizedPath, siteUrl),
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.shortName,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export const defaultMetadata = buildMetadata();
