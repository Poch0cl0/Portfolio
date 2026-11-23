import { portfolioFontVariables } from "@/lib/fonts";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/layout/command-palette";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar fontVariables={portfolioFontVariables} />
      <main className={`${portfolioFontVariables} flex-1`}>{children}</main>
      <Footer />
      <CommandPalette />
    </>
  );
}
