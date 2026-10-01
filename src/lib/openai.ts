import OpenAI from "openai";
import { getEducation } from "@/data/education";
import { getProjects } from "@/data/projects";
import { getStackItems } from "@/data/stack";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { serverEnv } from "@/lib/env";
import { siteConfig } from "@/config/site";

let openaiClient: OpenAI | null = null;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function getOpenAIClient(): OpenAI | null {
  if (!serverEnv.OPENAI_API_KEY) {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: serverEnv.OPENAI_API_KEY });
  }

  return openaiClient;
}

async function buildSystemPrompt(locale: Locale): Promise<string> {
  const dict = await getDictionary(locale);
  const projects = getProjects(dict);
  const stack = getStackItems(dict);
  const education = getEducation(dict)[0];

  const projectSummaries = projects
    .map(
      (project) =>
        `- ${project.title}: ${project.description}. Stack: ${project.technologies.slice(0, 8).join(", ")}.`,
    )
    .join("\n");

  const stackSummary = stack
    .slice(0, 12)
    .map((item) => `${item.name} (${item.category})`)
    .join(", ");

  const languageInstruction =
    locale === "es"
      ? "Responde siempre en español."
      : "Always respond in English.";

  return [
    `You are the portfolio assistant for ${siteConfig.name}, a full-stack developer.`,
    languageInstruction,
    "Use only the verified data below. Do not invent projects, dates, or technologies.",
    "If you do not know something, suggest opening the contact form.",
    "",
    `Location: ${siteConfig.location}`,
    `Education: ${education?.degree} at ${education?.institution}`,
    "",
    "Projects:",
    projectSummaries,
    "",
    `Key stack: ${stackSummary}`,
  ].join("\n");
}

export async function generateChatResponse(
  messages: ChatMessage[],
  locale: Locale,
): Promise<string> {
  const client = getOpenAIClient();

  if (!client) {
    const lastMessage = messages.at(-1)?.content ?? "";
    return locale === "es"
      ? `Respuesta de ejemplo: recibí tu mensaje "${lastMessage}". Configura OPENAI_API_KEY para respuestas reales.`
      : `Sample response: I received your message "${lastMessage}". Configure OPENAI_API_KEY for real responses.`;
  }

  const systemPrompt = await buildSystemPrompt(locale);

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ],
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content ?? "No pude generar una respuesta.";
}
