"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Trash2 } from "lucide-react";
import type { ChatMessage } from "@/lib/openai";
import { Container } from "@/components/ui/container";
import { Section, SectionDescription, SectionTitle } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { useDictionary } from "@/i18n/dictionary-provider";

const suggestionKeys = ["stack", "obstetricare", "amara"] as const;
const TYPEWRITER_MS = 15;

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
        <strong key={index} className="font-semibold text-on-surface">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function TypingIndicator() {
  return (
    <div className="mr-auto flex max-w-[90%] items-start gap-2 animate-fade-up">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-high ring-2 ring-tertiary/40">
        <Bot className="h-4 w-4 text-tertiary" />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-outline-variant/60 bg-surface-container px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-tertiary [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-tertiary [animation-delay:120ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-tertiary [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}

interface AgentBubbleProps {
  content: string;
  animate?: boolean;
  onProgress?: () => void;
  onComplete?: () => void;
}

function AgentBubble({ content, animate = false, onProgress, onComplete }: AgentBubbleProps) {
  const { dict } = useDictionary();
  const [visibleText, setVisibleText] = useState(animate ? "" : content);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!animate || reducedMotionRef.current) {
      setVisibleText(content);
      onComplete?.();
      return;
    }

    setVisibleText("");
    let frame = 0;
    let index = 0;
    let lastTime = 0;

    const step = (timestamp: number) => {
      if (timestamp - lastTime >= TYPEWRITER_MS) {
        index += 1;
        setVisibleText(content.slice(0, index));
        onProgress?.();
        lastTime = timestamp;
      }

      if (index < content.length) {
        frame = requestAnimationFrame(step);
      } else {
        onComplete?.();
      }
    };

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [animate, content, onComplete, onProgress]);

  return (
    <div className="mr-auto flex max-w-[92%] items-start gap-2 animate-fade-up">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-high ring-2 ring-tertiary/40">
        <Bot className="h-4 w-4 text-tertiary" />
      </div>
      <div className="relative min-w-0 overflow-hidden rounded-2xl rounded-tl-sm border border-outline-variant/60 bg-surface-container shadow-sm">
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-tertiary" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-tertiary/10" />
        <div className="relative px-4 py-3">
          <p className="mb-1 font-mono text-label-caps uppercase tracking-wider text-tertiary">
            {dict.home.chat.agentLabel}
          </p>
          <div className="text-body-sm leading-relaxed text-on-surface-variant">
            {formatMessageContent(visibleText)}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="ml-auto max-w-[88%] animate-fade-up rounded-2xl rounded-tr-sm bg-primary-container px-4 py-3 text-body-sm text-on-primary-container shadow-sm">
      {content}
    </div>
  );
}

export function ChatAssistantSection() {
  const { locale, dict } = useDictionary();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingMessageIndex, setTypingMessageIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || loading || typingMessageIndex !== null) {
      return;
    }

    setError(null);
    setLoading(true);
    setInput("");

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    scrollToBottom();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, messages: nextMessages }),
      });

      const data = (await response.json()) as { ok: boolean; reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? dict.home.chat.error);
      }

      const withReply = [...nextMessages, { role: "assistant" as const, content: data.reply }];
      setMessages(withReply);
      setTypingMessageIndex(withReply.length - 1);
      scrollToBottom();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : dict.home.chat.error);
      setMessages(nextMessages.slice(0, -1));
      setInput(trimmed);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <Section surface="lowest">
      <Container size="narrow" className="flex flex-col gap-space-md">
        <Reveal>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-3 py-1 font-mono text-label-caps uppercase tracking-wider text-tertiary">
              <Bot className="h-4 w-4" />
              <span>{dict.home.chat.kicker}</span>
            </div>
            <SectionTitle className="mt-1">{dict.home.chat.title}</SectionTitle>
            <SectionDescription className="mx-auto max-w-lg">
              {dict.home.chat.description}
            </SectionDescription>
          </div>
        </Reveal>

        <Reveal>
          <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md shadow-2xl">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-tertiary" />
                <span className="font-mono text-code-block font-medium text-on-surface">
                  {dict.home.chat.agentLabel}
                </span>
              </div>
              {messages.length > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMessages([]);
                    setError(null);
                    setTypingMessageIndex(null);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  {dict.home.chat.clear}
                </Button>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {suggestionKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  disabled={loading || typingMessageIndex !== null}
                  onClick={() => void sendMessage(dict.home.chat.suggestions[key])}
                  className="rounded-lg bg-surface-container px-3 py-1.5 text-left text-body-sm text-on-surface transition-all duration-200 hover:scale-105 hover:glow-hover-secondary hover:bg-surface-container-high disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:scale-100"
                >
                  {dict.home.chat.suggestions[key]}
                </button>
              ))}
            </div>

            <div
              ref={scrollRef}
              className="mt-2 flex max-h-80 flex-col gap-space-sm overflow-y-auto rounded-lg bg-surface-container-lowest p-space-md"
            >
              {messages.length === 0 ? (
                <AgentBubble content={dict.home.chat.welcome} />
              ) : (
                messages.map((message, index) => {
                  if (message.role === "user") {
                    return <UserBubble key={`user-${index}`} content={message.content} />;
                  }

                  return (
                    <AgentBubble
                      key={`assistant-${index}`}
                      content={message.content}
                      animate={typingMessageIndex === index}
                      onProgress={scrollToBottom}
                      onComplete={() => {
                        if (typingMessageIndex === index) {
                          setTypingMessageIndex(null);
                        }
                        scrollToBottom();
                      }}
                    />
                  );
                })
              )}
              {loading ? <TypingIndicator /> : null}
            </div>

            {error ? <p className="text-body-sm text-red-500">{error}</p> : null}

            <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={dict.home.chat.inputPlaceholder}
                disabled={loading || typingMessageIndex !== null}
                className="flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-sm text-on-surface outline-none focus:border-primary"
              />
              <Button type="submit" disabled={loading || typingMessageIndex !== null || !input.trim()}>
                <Send className="h-4 w-4" />
                {dict.home.chat.send}
              </Button>
            </form>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
