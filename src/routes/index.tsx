import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell, Disclaimer, TOOLS } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vantage — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarise meetings, plan tasks and research topics with one AI workspace built for professionals.",
      },
      { property: "og:title", content: "Vantage — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "One AI workspace for emails, meeting summaries, task plans and research briefings.",
      },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "Emails drafted", value: "27", note: "+12% this week", accent: true },
  { label: "Meetings summarized", value: "14", note: "48 min saved" },
  { label: "Tasks scheduled", value: "32", note: "8 high priority", accent: true },
  { label: "Research digests", value: "6", note: "2 pending review" },
];

function Dashboard() {
  return (
    <AppShell title="Good morning, Matodzi" subtitle="Five assistants, one workspace">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
            Assistant overview
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-none tracking-tight">
            Your day, <span className="text-gradient-brand">orchestrated</span>.
          </h1>
        </div>
        <Link
          to="/planner"
          className="inline-flex h-11 items-center rounded-xl gradient-brand px-5 font-display text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-opacity hover:opacity-95"
        >
          Generate today&rsquo;s plan
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="glass-card p-5">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
            <p
              className={`mt-1 text-[11px] ${s.accent ? "text-success" : "text-muted-foreground"}`}
            >
              {s.note}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="group glass-card p-6 transition-colors hover:bg-secondary/40"
          >
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl border border-border gradient-brand-soft text-primary">
                <tool.icon className="size-4" />
              </div>
              <div>
                <h2 className="font-display font-semibold">{tool.label}</h2>
                <p className="text-xs text-muted-foreground">{tool.blurb}</p>
              </div>
              <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Recent meeting summary</h2>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] uppercase tracking-widest text-accent">
              3 key points
            </span>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3 rounded-lg border border-border/60 bg-secondary/20 p-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" />
              <span className="text-muted-foreground">
                Launch pricing locked at $49/mo with annual discount.
              </span>
            </li>
            <li className="flex items-start gap-3 rounded-lg border border-border/60 bg-secondary/20 p-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-muted-foreground">
                <b className="text-foreground">Action:</b> Maya to send onboarding deck —{" "}
                <span className="text-primary">due May 16</span>
              </span>
            </li>
            <li className="flex items-start gap-3 rounded-lg border border-border/60 bg-secondary/20 p-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-muted-foreground">
                <b className="text-foreground">Deadline:</b> Beta cohort signups close{" "}
                <span className="text-accent">May 20</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Today&rsquo;s priorities</h2>
            <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              Auto-sorted
            </span>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { n: 1, task: "Confirm API data access", meta: "High · 10:00", tone: "accent" },
              { n: 2, task: "Review pricing one-pager", meta: "Med · 13:30", tone: "primary" },
              { n: 3, task: "Update roadmap doc", meta: "Low · 16:00", tone: "muted" },
            ].map((t) => (
              <li
                key={t.n}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/20 p-3"
              >
                <span
                  className={`grid size-5 place-items-center rounded-md text-[10px] font-bold ${
                    t.tone === "accent"
                      ? "bg-accent/20 text-accent"
                      : t.tone === "primary"
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {t.n}
                </span>
                <span className="flex-1 text-foreground/85">{t.task}</span>
                <span
                  className={`text-[10px] ${
                    t.tone === "accent"
                      ? "text-accent"
                      : t.tone === "primary"
                        ? "text-primary"
                        : "text-muted-foreground"
                  }`}
                >
                  {t.meta}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Disclaimer className="py-2 text-center" />
    </AppShell>
  );
}
