import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowUp, AlertTriangle } from "lucide-react";
import { AppShell, Disclaimer } from "@/components/app-shell";
import { chatWithAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Vantage Workplace AI" },
      {
        name: "description",
        content:
          "Chat with your workplace AI assistant to draft, summarise, plan and think through work problems.",
      },
      { property: "og:title", content: "AI Chatbot — Vantage Workplace AI" },
      {
        property: "og:description",
        content: "A work-focused AI chat for drafting, summarising and planning.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Summarise the risks in a Q2 roadmap slip",
  "Draft a polite nudge for an overdue invoice",
  "Turn these three goals into a weekly plan",
];

function ChatPage() {
  const run = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The assistant could not reply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="AI Chatbot" subtitle="Ask anything about your work">
      <div className="flex h-[calc(100vh-11.5rem)] flex-col glass-card p-5 sm:p-6">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="max-w-sm text-sm text-muted-foreground">
                Ask for a draft, a summary, a plan or a second opinion. Vantage keeps the
                whole conversation in context.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <div
                key={i}
                className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm gradient-brand px-4 py-2.5 text-sm text-primary-foreground"
              >
                {m.content}
              </div>
            ) : (
              <div
                key={i}
                className="max-w-[90%] rounded-2xl rounded-bl-sm border border-border bg-secondary/40 px-4 py-3"
              >
                <div className="ai-prose">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ),
          )}

          {loading && (
            <div className="flex max-w-[60%] items-center gap-2 rounded-2xl rounded-bl-sm border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
              <span className="flex gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-primary" />
                <span
                  className="size-1.5 animate-bounce rounded-full bg-primary"
                  style={{ animationDelay: ".15s" }}
                />
                <span
                  className="size-1.5 animate-bounce rounded-full bg-primary"
                  style={{ animationDelay: ".3s" }}
                />
              </span>
              Thinking…
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}

          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background/50 px-3 py-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Vantage…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="grid size-9 place-items-center rounded-lg gradient-brand text-primary-foreground disabled:opacity-50"
          >
            <ArrowUp className="size-4" />
          </button>
        </form>

        <Disclaimer className="mt-3 text-center" />
      </div>
    </AppShell>
  );
}
