"use client";

import { useId, useLayoutEffect, useRef } from "react";
import { Bot, Send, Trash2 } from "lucide-react";
import type { ChatMessage } from "@/lib/openai";
import { useDictionary } from "@/i18n/dictionary-provider";
import { clearChat, sendChatMessage, updateChatDraft, useChatAssistant } from "./chat-assistant-state";
import styles from "./chat-assistant.module.css";

const initialSuggestionKeys = ["stack", "projects", "education", "contact"] as const;
const obstetriCareSuggestionKeys = ["obstetriCarePipeline", "obstetriCareSafety", "amara"] as const;
const amaraSuggestionKeys = ["amaraProduct", "amaraSecurity", "obstetricare"] as const;
const stackSuggestionKeys = ["architecture", "obstetriCarePipeline", "amaraArchitecture"] as const;
const generalSuggestionKeys = ["about", "architecture", "career"] as const;
const followDistance = 48;
const presentedMessages = new WeakSet<ChatMessage>();
const historyPosition = { top: 0, following: true };

function followHistory() {
  historyPosition.following = true;
}

function rememberHistoryPosition(log: HTMLDivElement) {
  const nearEnd = log.scrollHeight - log.clientHeight - log.scrollTop <= followDistance;
  // Smooth follow emits downward events before the log reaches the end.
  if (nearEnd || log.scrollTop < historyPosition.top) historyPosition.following = nearEnd;
  historyPosition.top = log.scrollTop;
}

type SuggestionKey =
  | (typeof initialSuggestionKeys)[number]
  | (typeof obstetriCareSuggestionKeys)[number]
  | (typeof amaraSuggestionKeys)[number]
  | (typeof stackSuggestionKeys)[number]
  | (typeof generalSuggestionKeys)[number];

function getSuggestionKeys(messages: ChatMessage[]): readonly SuggestionKey[] {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  if (!lastUserMessage) {
    return initialSuggestionKeys;
  }

  const message = lastUserMessage.content.toLocaleLowerCase();
  if (/(obstetri|parto|triaje|cl[ií]nic|riesgo|ml|machine learning)/.test(message)) {
    return obstetriCareSuggestionKeys;
  }
  if (/(amar[aá]|supabase|bienestar|emocion|emoci[oó]n)/.test(message)) {
    return amaraSuggestionKeys;
  }
  if (/(stack|tecnolog|frontend|backend|fastapi|next\.js|react|postgres)/.test(message)) {
    return stackSuggestionKeys;
  }

  return generalSuggestionKeys;
}

function formatMessageContent(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let lineIndex = 0;

  while (lineIndex < lines.length) {
    const line = lines[lineIndex];
    const trimmed = line.trim();

    if (trimmed.startsWith("- ")) {
      const listItems: React.ReactNode[] = [];

      while (lineIndex < lines.length && lines[lineIndex].trim().startsWith("- ")) {
        listItems.push(
          <li key={`item-${lineIndex}`}>
            {parseInlineFormatting(lines[lineIndex].trim().slice(2))}
          </li>,
        );
        lineIndex += 1;
      }

      nodes.push(
        <ul key={`list-${lineIndex}`} className="my-1 list-disc space-y-0.5 pl-4">
          {listItems}
        </ul>,
      );
      continue;
    }

    if (trimmed.length === 0) {
      nodes.push(<br key={`break-${lineIndex}`} />);
    } else {
      nodes.push(
        <p key={`line-${lineIndex}`} className={nodes.length > 0 ? "mt-1" : undefined}>
          {parseInlineFormatting(line)}
        </p>,
      );
    }

    lineIndex += 1;
  }

  return nodes;
}

function parseInlineFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function TypingIndicator() {
  return (
    <div className={styles.typing} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const bubble = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!presentedMessages.has(message) && bubble.current) {
      bubble.current.dataset.enter = "true";
      presentedMessages.add(message);
    }
  }, [message]);

  return message.role === "user" ? (
    <div ref={bubble} className={styles.user}>{message.content}</div>
  ) : (
    <div ref={bubble} className={styles.agent}>
      <span className={styles.badge} aria-hidden="true">JB</span>
      <div className={styles.bubble}>{formatMessageContent(message.content)}</div>
    </div>
  );
}

export function ChatAssistantSection() {
  const { locale, dict } = useDictionary();
  const { messages, draft, loading, error } = useChatAssistant();
  const titleId = useId();
  const chat = dict.home.chat;
  const scrollRef = useRef<HTMLDivElement>(null);
  const positioned = useRef(false);
  const suggestionKeys = getSuggestionKeys(messages);
  const latestMessage = messages.at(-1);

  useLayoutEffect(() => {
    const log = scrollRef.current;
    if (!log) return;

    const initial = !positioned.current;
    positioned.current = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (historyPosition.following) {
      log.scrollTo({ top: log.scrollHeight, behavior: initial || reducedMotion ? "instant" : "smooth" });
      historyPosition.top = log.scrollTop;
    } else if (initial) {
      log.scrollTop = historyPosition.top;
      historyPosition.top = log.scrollTop;
    }
  }, [messages, loading]);

  function sendMessage(content: string, fromInput: boolean) {
    if (loading || !content.trim()) return;
    followHistory();
    void sendChatMessage(content, locale, chat.error, fromInput);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(draft, true);
  }

  return (
    <section className={styles.chat} aria-labelledby={titleId}>
      <header className={styles.header}>
        <Bot size={19} aria-hidden="true" />
        <div>
          <h2 id={titleId}>JeffBot</h2>
          <p>{chat.subtitle}</p>
        </div>
        {messages.length > 0 ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              followHistory();
              clearChat();
            }}
          >
            <Trash2 size={15} aria-hidden="true" />
            {chat.clear}
          </button>
        ) : null}
      </header>

      <div
        ref={scrollRef}
        className={styles.log}
        role="log"
        aria-labelledby={titleId}
        aria-live="off"
        tabIndex={0}
        onScroll={(event) => rememberHistoryPosition(event.currentTarget)}
      >
        <div className={styles.agent}>
          <span className={styles.badge} aria-hidden="true">JB</span>
          <div className={styles.bubble}>{formatMessageContent(chat.welcome)}</div>
        </div>
        {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
        {loading ? <TypingIndicator /> : null}
      </div>

      <p className="sr-only" role="status">
        {loading ? chat.typing : !error && latestMessage?.role === "assistant" ? latestMessage.content : ""}
      </p>

      <div className={styles.suggestions}>
        {suggestionKeys.map((key) => (
          <button
            key={key}
            type="button"
            className="motion-transition-colors"
            disabled={loading}
            onClick={() => sendMessage(chat.suggestions[key], false)}
          >
            {chat.suggestions[key]}
          </button>
        ))}
      </div>

      {error ? <p className={styles.error} role="alert">{error}</p> : null}

      <form onSubmit={handleSubmit} className={styles.composer}>
        <input
          value={draft}
          onChange={(event) => updateChatDraft(event.target.value)}
          placeholder={chat.inputPlaceholder}
          aria-label={chat.inputPlaceholder}
        />
        <button type="submit" disabled={loading || !draft.trim()}>
          {chat.send}
          <Send size={15} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
