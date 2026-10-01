import { notFound } from "next/navigation";
import { ContactModalProvider } from "@/features/contact/components/contact-modal-provider";
import { SetHtmlLang } from "@/components/layout/set-html-lang";
import { locales, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { DictionaryProvider } from "@/i18n/dictionary-provider";

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <DictionaryProvider locale={lang} dict={dict}>
      <ContactModalProvider>
        <SetHtmlLang locale={lang} />
        {children}
      </ContactModalProvider>
    </DictionaryProvider>
  );
}
