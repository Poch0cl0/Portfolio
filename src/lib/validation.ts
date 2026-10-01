import { z } from "zod";

export function createContactSchema(messages: {
  nameMin: string;
  emailInvalid: string;
  messageMin: string;
}) {
  return z.object({
    name: z.string().min(2, messages.nameMin),
    email: z.string().email(messages.emailInvalid),
    message: z.string().min(10, messages.messageMin),
    website: z.string().max(0).optional(),
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;

export function createChatSchema(messages: { messageEmpty: string }) {
  return z.object({
    locale: z.enum(["es", "en"]),
    messages: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().min(1).max(1000),
        }),
      )
      .min(1)
      .max(12),
  });
}

export type ChatRequestValues = z.infer<ReturnType<typeof createChatSchema>>;

// Default schemas for API routes (Spanish messages as fallback)
export const contactSchema = createContactSchema({
  nameMin: "El nombre debe tener al menos 2 caracteres.",
  emailInvalid: "Ingresa un correo electrónico válido.",
  messageMin: "El mensaje debe tener al menos 10 caracteres.",
});

export const chatSchema = createChatSchema({
  messageEmpty: "El mensaje no puede estar vacío.",
});

export type ChatFormValues = z.infer<typeof chatSchema>;
