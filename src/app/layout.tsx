import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { defaultLocale, hasLocale, LOCALE_REQUEST_HEADER } from "@/i18n/config";
import { defaultMetadata } from "@/lib/seo";
import { fontVariables } from "@/lib/fonts";
import {
  getServerThemeClass,
  parseThemeSetting,
  themeBootstrap,
  THEME_STORAGE_KEY,
} from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()]);
  const requestLocale = requestHeaders.get(LOCALE_REQUEST_HEADER) ?? "";
  const locale = hasLocale(requestLocale) ? requestLocale : defaultLocale;
  const initialTheme = parseThemeSetting(cookieStore.get(THEME_STORAGE_KEY)?.value);
  const themeClass = getServerThemeClass(initialTheme);

  return (
    <html
      lang={locale}
      data-initial-theme={initialTheme}
      suppressHydrationWarning
      className={`${fontVariables} h-full ${themeClass}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <JsonLd />
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
