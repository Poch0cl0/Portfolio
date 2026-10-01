import Script from "next/script";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/env";

export function JsonLd() {
  const siteUrl = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: siteConfig.name,
        jobTitle: siteConfig.role,
        url: siteUrl,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Trujillo",
          addressCountry: "PE",
        },
      },
      {
        "@type": "WebSite",
        name: siteConfig.shortName,
        url: siteUrl,
        description: siteConfig.description,
      },
    ],
  };

  return (
    <Script
      id="site-json-ld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
