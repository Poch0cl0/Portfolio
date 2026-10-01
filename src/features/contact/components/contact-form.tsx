"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { createContactSchema, type ContactFormValues } from "@/lib/validation";
import { useDictionary } from "@/i18n/dictionary-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const { dict } = useDictionary();
  const schema = createContactSchema(dict.contact.validation);

  const [values, setValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? dict.contact.form.invalid);
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? dict.contact.form.sendFailed);
      }

      setStatus("success");
      setValues({ name: "", email: "", message: "", website: "" });
      onSuccess?.();
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error ? submitError.message : dict.contact.form.error,
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
      <input
        type="text"
        name="website"
        value={values.website}
        onChange={(event) => setValues({ ...values, website: event.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="font-mono text-label-caps text-outline">
          {dict.contact.form.nameLabel}
        </label>
        <Input
          id="contact-name"
          placeholder={dict.contact.form.name}
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
          className="glow-focus-primary bg-surface-container-lowest"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="font-mono text-label-caps text-outline">
          {dict.contact.form.emailLabel}
        </label>
        <Input
          id="contact-email"
          type="email"
          placeholder={dict.contact.form.email}
          value={values.email}
          onChange={(event) => setValues({ ...values, email: event.target.value })}
          className="glow-focus-primary bg-surface-container-lowest"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="font-mono text-label-caps text-outline">
          {dict.contact.form.messageLabel}
        </label>
        <Textarea
          id="contact-message"
          placeholder={dict.contact.form.message}
          value={values.message}
          onChange={(event) => setValues({ ...values, message: event.target.value })}
          className="min-h-36 glow-focus-primary bg-surface-container-lowest"
        />
      </div>

      {error ? <p className="text-body-sm text-red-500">{error}</p> : null}
      {status === "success" ? (
        <p className="text-body-sm text-green-600">{dict.contact.form.success}</p>
      ) : null}

      <Button type="submit" disabled={status === "loading"} className="mt-1 w-full glow-hover-primary">
        <Send className="h-4 w-4" />
        {status === "loading" ? dict.contact.form.submitting : dict.contact.form.submit}
      </Button>
    </form>
  );
}
