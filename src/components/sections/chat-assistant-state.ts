"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/config";
import type { ChatMessage } from "@/lib/openai";

type TranscriptMessage = ChatMessage & { id: number };

interface ChatState {
  messages: TranscriptMessage[];
  draft: string;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = { messages: [], draft: "", loading: false, error: null };
const listeners = new Set<() => void>();
const responseTimeoutMs = 60_000;
let state = initialState;
let nextMessageId = 0;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return initialState;
}

function update(patch: Partial<ChatState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

export function useChatAssistant() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function updateChatDraft(draft: string) {
  update({ draft });
}

export function clearChat() {
  if (!state.loading) update({ messages: [], error: null });
}

export async function sendChatMessage(content: string, locale: Locale, fallbackError: string, fromInput: boolean) {
  const text = content.trim();
  if (!text || state.loading) return;

  const previousMessages = state.messages;
  const pending: TranscriptMessage = { id: nextMessageId++, role: "user", content: text };
  const messages = [...previousMessages, pending];
  update({ messages, loading: true, error: null, draft: fromInput ? "" : state.draft });

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), responseTimeoutMs);
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        messages: messages.map(({ role, content: message }) => ({ role, content: message })),
      }),
      signal: controller.signal,
    });
    const data = (await response.json().catch(() => null)) as { reply?: string; error?: string } | null;

    if (!response.ok || !data?.reply) {
      update({ messages: previousMessages, draft: state.draft || text, loading: false, error: data?.error ?? fallbackError });
      return;
    }

    update({
      messages: [...messages, { id: nextMessageId++, role: "assistant", content: data.reply }],
      loading: false,
    });
  } catch {
    update({ messages: previousMessages, draft: state.draft || text, loading: false, error: fallbackError });
  } finally {
    window.clearTimeout(timeout);
  }
}
