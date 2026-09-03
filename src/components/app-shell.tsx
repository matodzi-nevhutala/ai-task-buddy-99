import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  BookOpen,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";

export const TOOLS = [
  { to: "/email", label: "Smart Email", icon: Mail, blurb: "Tone & audience aware" },
  {
    to: "/notes",
    label: "Meeting Notes",
    icon: FileText,
    blurb: "Key points, actions, deadlines",
  },
  {
    to: "/planner",
    label: "Task Planner",
    icon: ListChecks,
    blurb: "Prioritise & schedule",
  },
  {
    to: "/research",
    label: "Research",
    icon: BookOpen,
    blurb: "Insights & summaries",
  },
  { to: "/chat", label: "Chatbot", icon: MessageSquare, blurb: "Ask anything" },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="flex h-18 items-center gap-3 px-6">
        <div className="grid size-9 place-items-center rounded-lg gradient-brand font-display text-sm font-bold text-primary-foreground">
          V
        </div>
        <div>
          <p className="font-display font-semibold leading-none tracking-tight">Vantage</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Workplace AI
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6 text-sm">
        <Link
          to="/"
          onClick={onNavigate}
          activeOptions={{ exact: true }}
          activeProps={{
            className:
              "border border-border bg-secondary/70 text-foreground font-medium",
          }}
          inactiveProps={{ className: "text-muted-foreground hover:bg-secondary/40" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:text-foreground"
        >
          <LayoutDashboard className="size-4" />
          Dashboard
        </Link>

        {TOOLS.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            onClick={onNavigate}
            activeProps={{
              className:
                "border border-border bg-secondary/70 text-foreground font-medium",
            }}
            inactiveProps={{ className: "text-muted-foreground hover:bg-secondary/40" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:text-foreground"
          >
            <tool.icon className="size-4" />
            {tool.label}
          </Link>
        ))}
      </nav>

      <div className="m-3 rounded-xl border border-border bg-secondary/40 p-3">
        <p className="text-[11px] font-medium">Pro plan</p>
        <p className="mt-1 text-[10px] text-muted-foreground">1,240 / 2,000 credits</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-3/5 rounded-full gradient-brand" />
        </div>
      </div>
    </>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 size-[520px] rounded-full bg-accent/25 blur-3xl float-slow" />
        <div className="absolute bottom-0 right-0 size-[620px] rounded-full bg-primary/25 blur-3xl float-slower" />
      </div>

      <div className="relative flex h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-secondary/20 backdrop-blur-2xl lg:flex">
          <SidebarContent />
        </aside>

        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              aria-label="Close navigation"
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-card backdrop-blur-2xl">
              <SidebarContent onNavigate={() => setOpen(false)} />
            </aside>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 flex h-18 items-center justify-between gap-3 border-b border-border bg-background/70 px-5 backdrop-blur-xl sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle navigation"
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-secondary/40 lg:hidden"
              >
                {open ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold tracking-tight">
                  {title}
                </p>
                <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground sm:flex">
              <span className="size-1.5 rounded-full bg-success" />
              AI ready
            </div>
          </header>

          <div className="space-y-6 px-5 py-8 sm:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[11px] text-muted-foreground ${className}`}>
      AI-generated content may require human review.
    </p>
  );
}
