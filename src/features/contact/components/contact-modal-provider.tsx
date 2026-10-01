"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Mail, MapPin, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/features/contact/components/contact-form";
import { useDictionary } from "@/i18n/dictionary-provider";

interface ContactModalContextValue {
  openContact: () => void;
  closeContact: () => void;
}

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const { dict } = useDictionary();

  const openContact = useCallback(() => {
    setOpen(true);
    dialogRef.current?.showModal();
  }, []);

  const closeContact = useCallback(() => {
    setOpen(false);
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    function handleClose() {
      setOpen(false);
    }

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  return (
    <ContactModalContext.Provider value={{ openContact, closeContact }}>
      {children}
      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-[100] m-auto w-[min(100%-2rem,44rem)] rounded-2xl border border-outline-variant bg-surface-container-low p-0 text-on-surface shadow-2xl backdrop:bg-black/60 open:flex open:flex-col"
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            closeContact();
          }
        }}
        aria-labelledby="contact-modal-title"
      >
        {open ? (
          <>
            <div className="relative overflow-hidden border-b border-outline-variant px-space-md py-space-md">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative flex items-start justify-between gap-space-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-label-caps uppercase tracking-wider text-primary">
                    {dict.contact.modal.kicker}
                  </span>
                  <h2 id="contact-modal-title" className="text-headline-sm font-semibold">
                    {dict.contact.modal.title}
                  </h2>
                  <p className="text-body-sm text-on-surface-variant">
                    {dict.contact.modal.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeContact}
                  className="rounded-lg p-1 text-on-surface-variant transition-all duration-200 hover:glow-hover-primary hover:bg-surface-container-high hover:text-on-surface motion-reduce:transition-none"
                  aria-label={dict.contact.modal.close}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid gap-space-md p-space-md md:grid-cols-5">
              <div className="md:col-span-3">
                <ContactForm onSuccess={closeContact} />
              </div>
              <div className="flex flex-col gap-space-sm md:col-span-2">
                <div className="rounded-xl border border-outline-variant/60 bg-surface-container p-space-sm transition-all duration-200 hover:glow-hover-primary motion-reduce:transition-none">
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-body-sm font-medium text-on-surface">
                      {siteConfig.location}
                    </span>
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="break-all font-mono text-code-block text-on-surface">
                      {siteConfig.email}
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">
                    {dict.contact.info.response}
                  </p>
                </div>
                <p className="font-mono text-code-inline text-outline">
                  {siteConfig.university}
                </p>
              </div>
            </div>
          </>
        ) : null}
      </dialog>
    </ContactModalContext.Provider>
  );
}

export function useContactModal(): ContactModalContextValue {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return context;
}
