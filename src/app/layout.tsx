import { cookies } from "next/headers";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { defaultMetadata } from "@/lib/seo";
import { fontVariables } from "@/lib/fonts";
import {
  getServerThemeClass,
  parseThemeSetting,
  THEME_STORAGE_KEY,
} from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialTheme = parseThemeSetting(cookieStore.get(THEME_STORAGE_KEY)?.value);
  const themeClass = getServerThemeClass(initialTheme);

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${fontVariables} h-full ${themeClass}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <JsonLd />
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
