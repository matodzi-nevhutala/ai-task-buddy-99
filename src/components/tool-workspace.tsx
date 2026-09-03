import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, RotateCcw, Sparkles, AlertTriangle } from "lucide-react";
import { Disclaimer } from "./app-shell";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
        {hint && <span className="tracking-normal normal-case">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const controlClass =
  "w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none";

export function TextArea(props: React.ComponentProps<"textarea">) {
  return <textarea {...props} className={`${controlClass} resize-none`} />;
}

export function TextInput(props: React.ComponentProps<"input">) {
  return <input {...props} className={controlClass} />;
}

export function Select({
  options,
  ...props
}: React.ComponentProps<"select"> & { options: readonly string[] }) {
  return (
    <select {...props} className={controlClass}>
      {options.map((o) => (
        <option key={o} value={o} className="bg-card">
          {o}
        </option>
      ))}
    </select>
  );
}

export function GenerateButton({
  loading,
  label,
  disabled,
}: {
  loading: boolean;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl gradient-brand font-display text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Sparkles className="size-4" />
      {loading ? "Generating…" : label}
    </button>
  );
}

export function OutputPanel({
  loading,
  error,
  output,
  emptyHint,
  onRegenerate,
}: {
  loading: boolean;
  error: string | null;
  output: string | null;
  emptyHint: string;
  onRegenerate?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="flex min-h-[26rem] flex-col glass-card p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          AI output
        </span>
        {output && !loading && (
          <div className="flex gap-2">
            <button
              onClick={copy}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-3 text-xs font-medium transition-colors hover:bg-secondary/70"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-3 text-xs font-medium transition-colors hover:bg-secondary/70"
              >
                <RotateCcw className="size-3.5" />
                Regenerate
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex-1 rounded-xl border border-border bg-background/40 p-4">
        {loading && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
              Composing a professional response…
            </div>
            {["w-4/5", "w-full", "w-11/12", "w-2/3", "w-3/4", "w-1/2"].map((w, i) => (
              <div
                key={i}
                className={`h-2.5 ${w} animate-pulse rounded-full bg-secondary`}
                style={{ animationDelay: `${i * 90}ms` }}
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start gap-2 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && output && (
          <div className="ai-prose">
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
        )}

        {!loading && !error && !output && (
          <p className="text-sm text-muted-foreground">{emptyHint}</p>
        )}
      </div>

      <Disclaimer className="mt-4" />
    </section>
  );
}
