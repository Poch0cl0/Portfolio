"use client";

import { MapPin, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDictionary } from "@/i18n/dictionary-provider";

interface ContactInfoProps {
  compact?: boolean;
}

export function ContactInfo({ compact = false }: ContactInfoProps) {
  const { dict } = useDictionary();

  if (compact) {
    return (
      <div className="space-y-3 rounded-xl bg-surface-container p-space-sm text-body-sm text-on-surface-variant">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-on-surface">{siteConfig.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <span className="font-mono text-code-block text-on-surface">{siteConfig.email}</span>
        </div>
        <p>{dict.contact.info.response}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.contact.modal.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-body-sm text-on-surface-variant">
        <p className="text-on-surface">{siteConfig.name}</p>
        <p>{siteConfig.role}</p>
        <p>{siteConfig.location}</p>
        <p className="font-mono text-code-block text-on-surface">{siteConfig.email}</p>
        <p>{siteConfig.github}</p>
        <p>{siteConfig.linkedin}</p>
      </CardContent>
    </Card>
  );
}
