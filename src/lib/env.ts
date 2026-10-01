import { z } from "zod";

const serverSchema = z.object({
  OPENAI_API_KEY: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

function parseEnv<T extends z.ZodTypeAny>(
  schema: T,
  data: Record<string, string | undefined>,
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn("[env] Validation warnings:", result.error.flatten().fieldErrors);
    return {} as z.infer<T>;
  }
  return result.data;
}

export const serverEnv = parseEnv(serverSchema, {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
});

export const clientEnv = parseEnv(clientSchema, {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

export function getSiteUrl(): string {
  return clientEnv.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
